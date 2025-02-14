import React, { useCallback, useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal"; // Corrected Import
import { Table } from "react-bootstrap";

export const ScienceGraphComp = ({
  matrixInfo,
  backgroundColor = "#0b001a",
  positiveEdgeColor = "#00FF00",
  negativeEdgeColor = "#FF0000",
  physicsEnabled = false,
  nodeSize = 40,
  edgeRoundness = 0.15,
  moveHistory, setMoveHistory, setMovesHistory, setIsRunning

}) => {
  const networkRef = useRef(null);
  const [graphData, setGraphData] = useState(null);
  const [highlightedNode, setHighlightedNode] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [showNodeList, setShowNodeList] = useState(false);
  const [lockedNodes, setLockedNodes] = useState({});
  const [hoveredNode, setHoveredNode] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [selectedEdges, setSelectedEdges] = useState([]);
  // const [moveHistory, setMoveHistory] = useState([]);
  const [lastIndex, setLastIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [maxScorePerMove, setMaxScorePerMove] = useState(0);
  const [serverResponseData, setServerResponseData] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [disabledNodes, setDisabledNodes] = useState([]);
  
  // const [movesHistory, setMovesHistory] = useState([]);

  useEffect(() => {
    if (matrixInfo && matrixInfo.edges && matrixInfo.nodes) {
      const edges = matrixInfo.edges;
      const oldnodes = matrixInfo.nodes;
      const nodes = new Map();
      const nodesDataSet = new DataSet();
      const edgesDataSet = new DataSet();

      edges.forEach(({ from, to, value }) => {
        if (value !== 0) {
          const fromId = from;
          const toId = to;
          // Проверяем существование узлов
          if (oldnodes[fromId - 1]) {
            if (!nodes.has(fromId)) {
              nodes.set(fromId, {
                id: fromId,
                label: `${fromId}`,
                title: oldnodes[fromId - 1].name,
                color: { background: backgroundColor },
              });
              nodesDataSet.add(nodes.get(fromId));
            }
          }

          if (oldnodes[toId - 1]) {
            if (!nodes.has(toId)) {
              const nodeObj = {
                id: toId,
                label: `${toId}`,
                title: oldnodes[toId - 1].name,
                color: { background: backgroundColor },
              };
              // Проверяем, является ли вершина целевой
              if (to.target === 1) {
                nodeObj.color = { background: "gold" };
                nodeObj.font = { size: 25 };
              }
              nodes.set(toId, nodeObj);
              nodesDataSet.add(nodes.get(toId));
            }
          }

          try {
            edgesDataSet.add({
              id: `${fromId}${toId}`,
              from: fromId,
              to: toId,
              value,
              title: `При увеличении ${from.name} ${value > 0 ? "увеличивается" : "уменьшается"
                } ${to.ru_name} на ${value}`,
              label: value.toString(),
              smooth: { type: "continues", roundness: edgeRoundness },
              color: value > 0 ? positiveEdgeColor : negativeEdgeColor,
            });
          } catch (e) {
            console.error("Ошибка при добавлении ребра:", e);
          }
        }
      });

      setGraphData({ nodes: nodesDataSet, edges: edgesDataSet });
    }
  }, [
    matrixInfo,
    backgroundColor,
    positiveEdgeColor,
    negativeEdgeColor,
    edgeRoundness,
  ]);

  useEffect(() => {
    if (graphData) {
      const container = document.getElementById("simple-graph-container");
      const options = {
        edges: {
          smooth: {
            type: "curvedCW",
            roundness: edgeRoundness,
          },
          arrows: { to: true },
          color: {
            highlight: "white",
            hover: "white",
          },
          scaling: {
            min: 1,
            max: 1,
            label: {
              enabled: true,
              min: 11,
              max: 11,
              maxVisible: 55,
              drawThreshold: 5,
            },
          },
        },
        physics: {
          enabled: physicsEnabled,
          barnesHut: {
            gravitationalConstant: -50000,
            centralGravity: 0.3,
            springLength: 95,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 3.4,
          },
          stabilization: {
            enabled: true,
            iterations: 1000,
            updateInterval: 25,
          },
        },
        nodes: {
          shape: "circle",
          size: nodeSize,
          font: {
            size: 14,
            color: "white",
            align: "center",
          },
          borderWidth: 2,
          borderWidthSelected: 4,
        },
        interaction: {
          hover: true,
          tooltipDelay: 300,
          multiselect: false,
        },
      };

      // Если сеть уже существует, уничтожаем её перед созданием новой
      if (networkRef.current) {
        networkRef.current.destroy();
      }

      networkRef.current = new Network(container, graphData, options);

      // Устанавливаем начальное положение и масштаб графа
      networkRef.current.moveTo({
        position: { x: 0, y: -250 },
        scale: 0.8,
        animation: {
          duration: 1000,
          easingFunction: "easeInOutQuad",
        },
      });

      // Добавляем обработчики событий
      networkRef.current.on("click", handleNodeClick);
      networkRef.current.on("hoverNode", (event) => {
        setHighlightedNode(event.node);
        setShowNodeList(true);
        setHoveredNode(event.node);
        setCursorPosition({ x: event.pointer.DOM.x, y: event.pointer.DOM.y });
      });
      networkRef.current.on("blurNode", () => {
        setHighlightedNode(null);
        setShowNodeList(false);
        setHoveredNode(null);
      });

      // Удалён обработчик события 'selectNode' для предотвращения конфликта

      // После создания сети загружаем координаты и применяем их
      loadAndApplyCoordinates();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphData]);

  const loadAndApplyCoordinates = () => {
    const matrixName = encodeURIComponent(matrixInfo.matrix_info.matrix_name);
    const endpoint = `http://localhost:5000/load-graph-settings/${matrixName}`;

    fetch(endpoint)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data) {
          console.warn(`Файл настроек ${matrixName} отсутствует.`);
          return;
        }

        const { graph_settings, node_coordinates } = data;
        if (networkRef.current) {
          if (node_coordinates) {
            Object.entries(node_coordinates).forEach(([nodeId, coords]) => {
              if (networkRef.current.body.nodes[nodeId]) {
                networkRef.current.body.nodes[nodeId].x = coords.x;
                networkRef.current.body.nodes[nodeId].y = coords.y;
              }
            });
          }

          if (graph_settings) {
            networkRef.current.moveTo({
              position: graph_settings.position || { x: 0, y: 0 },
              scale: graph_settings.scale || 1,
              animation: { duration: 1000, easingFunction: "easeInOutQuad" },
            });
          }

          networkRef.current.redraw();
        }
      })
      .catch((error) => console.error("Ошибка загрузки графа:", error));
  };


  // Добавляем useRef для disabledNodes
  const disabledNodesRef = useRef(disabledNodes);
  useEffect(() => {
    disabledNodesRef.current = disabledNodes;
  }, [disabledNodes]);

  const handleNodeClick = useCallback((event) => {
    const clickedNodeIds = event.nodes;
    const clickedEdgeIds = event.edges;

    if (clickedNodeIds.length === 1) {
      const clickedNodeId = clickedNodeIds[0];
      // Используем актуальное состояние через ref
      if (!lockedNodes[clickedNodeId] && !disabledNodesRef.current.includes(clickedNodeId)) {
        setSelectedNodes((prevSelectedNodes) => {
          if (prevSelectedNodes.includes(clickedNodeId)) {
            return prevSelectedNodes.filter((nodeId) => nodeId !== clickedNodeId);
          } else {
            return [...prevSelectedNodes, clickedNodeId];
          }
        });
      }
    }

    if (clickedEdgeIds.length > 0) {
      setSelectedEdges((prevSelectedEdges) => {
        const newSelectedEdges = new Set(prevSelectedEdges);
        clickedEdgeIds.forEach((edgeId) => {
          if (newSelectedEdges.has(edgeId)) {
            newSelectedEdges.delete(edgeId);
            graphData.edges.update({ id: edgeId, width: 1, color: { color: negativeEdgeColor } });
          } else {
            newSelectedEdges.add(edgeId);
            graphData.edges.update({ id: edgeId, width: 5, color: { color: "white" } });
          }
        });
        return Array.from(newSelectedEdges);
      });
    }
  }, [lockedNodes, graphData, negativeEdgeColor]);



  // useEffect для обновления стиля узлов при изменении disabledNodes
  useEffect(() => {
    if (graphData?.nodes) {
      graphData.nodes.forEach(node => {
        const isDisabled = disabledNodes.includes(node.id);
        graphData.nodes.update({
          id: node.id,
          color: {
            background: isDisabled ? "#555555" : backgroundColor,
            border: isDisabled ? "#777777" : "#1b3b7d"
          },
          opacity: isDisabled ? 0.5 : 1,
          font: {
            color: isDisabled ? "#999999" : "white"
          }
        });
      });
    }
  }, [disabledNodes, graphData, backgroundColor]);


  useEffect(() => {
    if (graphData?.edges) {
      selectedEdges.forEach((edgeId) => {
        graphData.edges.update({ id: edgeId, width: 4, color: { color: "white" } });
      });

      // Сбрасываем толщину у невыбранных рёбер
      graphData.edges.forEach((edge) => {
        if (!selectedEdges.includes(edge.id)) {
          graphData.edges.update({ id: edge.id, width: 1, color: { color: edge.value > 0 ? positiveEdgeColor : negativeEdgeColor } });
        }
      });
    }
  }, [selectedEdges, graphData, positiveEdgeColor, negativeEdgeColor]);


  // --- Очистить выбор ---
  const handleClearSelection = () => {
    // Сбрасываем выбранные узлы
    setSelectedNodes([]);
    setSelectedEdges([]);
  };




  const createSelectedNodesDictionary = (selectedNodes, startIndex) => {
    return selectedNodes.reduce((acc, nodeId, index) => {
      // Используем индекс плюс startIndex как ключ
      acc[index + startIndex] = nodeId;
      return acc;
    }, {});
  };

  // Inside the makeMove function
  // --- При нажатии "Make Move" ---
  const makeMove = async () => {
    try {
      let selectedNodesDictionary = createSelectedNodesDictionary(
        selectedNodes,
        lastIndex
      );

      const response = await fetch("http://localhost:5000/calculate_score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedNodes: selectedNodesDictionary,
          matrixName: matrixInfo.matrix_info.matrix_name,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData && typeof responseData === "object") {
        const { turn_score, total_score } = responseData;

        setMoveHistory((prevHistory) => [
          ...prevHistory,
          { selectedNodes: [...selectedNodes], score: turn_score },
        ]);

        setMovesHistory((prevMoves) => [
          ...prevMoves,
          { moveNumber: prevMoves.length + 1, nodes: [...selectedNodes] },
        ]);

        setScore((prevScore) =>
          typeof total_score === "number" && !isNaN(total_score)
            ? total_score
            : prevScore
        );

        // Блокируем выбранные вершины
        setDisabledNodes((prev) => [
          ...new Set([...prev, ...selectedNodes]) // Убираем дубликаты
        ]);
        handleClearSelection();

        // Индекс для уникальных ключей
        setLastIndex((prevLastIndex) => {
          const maxIndex = Math.max(...Object.keys(selectedNodesDictionary));
          return maxIndex + 1;
        });
        setIsRunning(true)
        setShowHistoryModal(true);
      } else {
        console.error("Error: Invalid or missing server response data");
      }
    } catch (error) {
      console.error("Error making move:", error);
    }
  };


  const handleCloseHistoryModal = () => setShowHistoryModal(false);

  return (
    <>
      <div
        id="simple-graph-container"
        style={{
          marginLeft: "3rem",
          marginRight: "7.5rem",
          height: "600px",
          width: "50%",
          backgroundColor,
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      />
      {showNodeList && (
        <div className={`node-list-container ${showNodeList ? "visible" : ""}`}>
          <Card>
            <Card.Header>
              <Card.Title>Список вершин:</Card.Title>
            </Card.Header>
            <Card.Body>
              {graphData && (
                <ListGroup>
                  {graphData.nodes.get().map((node) => (
                    <ListGroup.Item
                      key={node.id}
                      action
                      className={`list-group-item ${highlightedNode === node.id ? "active" : ""
                        }`}
                      onMouseEnter={() => setHighlightedNode(node.id)}
                      onMouseLeave={() => setHighlightedNode(null)}
                      ref={
                        highlightedNode === node.id
                          ? (element) =>
                            element &&
                            element.scrollIntoView({
                              behavior: "smooth",
                              block: "nearest",
                            })
                          : null
                      }
                    >
                      {`${node.id} - ${node.title}`}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </div>
      )}

      {selectedNodes.length > 0 && (
        <div
          className="selected-nodes-list"
          style={{
            position: "absolute",
            zIndex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: "10px",
            borderRadius: "5px",
            color: "white",
          }}
        >
          <h2>Выбранные факторы:</h2>
          <ListGroup>
            {selectedNodes.map((nodeId, index) => (
              <ListGroup.Item key={index + lastIndex}>{`${index + lastIndex + 1
                }| Node ID: ${nodeId}`}</ListGroup.Item>
            ))}
          </ListGroup>
          <Button variant="outline-danger" onClick={handleClearSelection}>
            Clear Selection
          </Button>
          <Button
            variant="primary"
            onClick={makeMove}
            disabled={selectedNodes.length === 0}
          >
            Make Move
          </Button>
        </div>
      )}

      {/* History Modal */}
      <Modal
        show={showHistoryModal}
        onHide={handleCloseHistoryModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Move History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Selected Nodes</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {moveHistory.map((move, index) => (
                <tr key={index}>
                  <td>{move.selectedNodes.join(", ")}</td>
                  <td>{move.score}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <p>Total Score: {score}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseHistoryModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ScienceGraphComp; // Corrected Export