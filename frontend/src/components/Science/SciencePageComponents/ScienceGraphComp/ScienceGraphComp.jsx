import React, { useEffect, useRef, useState } from "react";
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
  const [moveHistory, setMoveHistory] = useState([]);
  const [lastIndex, setLastIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [maxScorePerMove, setMaxScorePerMove] = useState(0);
  const [serverResponseData, setServerResponseData] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

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
              title: `При увеличении ${from.name} ${
                value > 0 ? "увеличивается" : "уменьшается"
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
    const matrixName = matrixInfo.matrix_info.matrix_name;
    const fileName = `/models_coords/${matrixName}_coordinates.json`;
  
    fetch(fileName)
      .then((response) => {
        if (!response.ok) {
          console.warn(
            `Файл с координатами ${fileName} не найден или недоступен.`
          );
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (!data) return;
  
        // Проверяем наличие данных о графе
        const { graph_settings, node_coordinates } = data;
  
        // Применяем координаты к узлам
        if (node_coordinates && typeof node_coordinates === "object") {
          if (networkRef.current) {
            Object.keys(node_coordinates).forEach((nodeId) => {
              const node = networkRef.current.body.nodes[nodeId];
              if (node && node_coordinates[nodeId]) {
                node.x = node_coordinates[nodeId].x;
                node.y = node_coordinates[nodeId].y;
              }
            });
            console.log("Координаты узлов применены.");
          }
        }
  
        // Применяем настройки графа: позицию и масштаб
        if (graph_settings) {
          const { position, scale } = graph_settings;
          if (networkRef.current) {
            networkRef.current.moveTo({
              position: position || { x: 0, y: 0 },
              scale: scale || 1,
              animation: {
                duration: 1000,
                easingFunction: "easeInOutQuad",
              },
            });
            console.log("Позиция и масштаб графа применены.");
          }
        }
  
        // Обновляем граф
        if (networkRef.current) {
          networkRef.current.redraw();
        }
      })
      .catch((error) => {
        console.error("Ошибка при загрузке данных для графа:", error);
      });
  };
  

  const handleNodeClick = (event) => {
    const clickedNodeIds = event.nodes;
    const clickedEdgeIds = event.edges;

    console.log("Нажаты узлы:", clickedNodeIds);
    console.log("Нажаты ребра:", clickedEdgeIds);

    if (clickedNodeIds.length === 1) {
      const clickedNodeId = clickedNodeIds[0];
      if (!lockedNodes[clickedNodeId]) {
        setSelectedNodes((prevSelectedNodes) => {
          if (prevSelectedNodes.includes(clickedNodeId)) {
            console.log(`Удаление узла ${clickedNodeId} из выбора.`);
            return prevSelectedNodes.filter(
              (nodeId) => nodeId !== clickedNodeId
            );
          } else {
            console.log(`Добавление узла ${clickedNodeId} в выбор.`);
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
          } else {
            newSelectedEdges.add(edgeId);
          }
        });
        return Array.from(newSelectedEdges);
      });
    }
  };

  const handleClearSelection = () => {
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
        setMoveHistory([
          ...moveHistory,
          { selectedNodes, score: responseData.turn_score },
        ]);
        setScore(score + responseData.score);
        if (responseData.score > maxScorePerMove) {
          setMaxScorePerMove(responseData.score);
        }
        setLastIndex((prevLastIndex) => {
          const maxIndex = Math.max(...Object.keys(selectedNodesDictionary));
          const newIndex = maxIndex + 1;
          return newIndex;
        });
        setServerResponseData(responseData);
        setShowHistoryModal(true);
        handleClearSelection();

        // Блокировать выбранные вершины
        const newLockedNodes = {};
        selectedNodes.forEach((nodeId) => {
          newLockedNodes[nodeId] = true;
        });
        setLockedNodes({ ...lockedNodes, ...newLockedNodes });
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
                      className={`list-group-item ${
                        highlightedNode === node.id ? "active" : ""
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
              <ListGroup.Item key={index + lastIndex}>{`${
                index + lastIndex + 1
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
