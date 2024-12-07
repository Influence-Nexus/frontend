import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";
import "./Graph.css"; // Import the CSS file for styling
import "bootstrap/dist/css/bootstrap.min.css"; // Подключаем файл стилей Bootstrap
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import KeyIcon from "@mui/icons-material/Key";
import InfoIcon from "@mui/icons-material/Info";
import "../Science/SciencePageComponents/Buttons/SciencePageButtons.css";

import { FaInfoCircle, FaMedal, FaStar, FaStopwatch } from "react-icons/fa";
import VerticalProgressBar from "./VerticalProgress";
import { InfoModalWindow } from "./InfoModalWindow";
import { cardcreds, cards } from "../SoralSystem/cards";

const GraphComponent = ({
  matrixInfo,
  backgroundColor,
  positiveEdgeColor,
  negativeEdgeColor,
  nodeColor,
  physicsEnabled,
  nodeSize,
  edgeRoundness,
  selectedPlanet,
  selectedCardIndex,
}) => {
  const [graphData, setGraphData] = useState(null);
  const [highlightedNode, setHighlightedNode] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [selectedEdges, setSelectedEdges] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stopwatchHistory, setStopwatchHistory] = useState([]);
  const [showNodeList, setShowNodeList] = useState(false);
  const [lockedNodes, setLockedNodes] = useState({}); // State to track locked nodes
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [lastIndex, setLastIndex] = useState(0);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [serverResponseData, setServerResponseData] = useState(null);

  const createSelectedNodesDictionary = (selectedNodes, startIndex) => {
    return selectedNodes.reduce((acc, nodeId, index) => {
      // console.log(startIndex);
      // Используем индекс плюс startIndex как ключ
      acc[index + startIndex] = nodeId;
      return acc;
    }, {});
  };

  const [score, setScore] = useState(0); // Состояние для набранных очков
  const [maxScorePerMove, setMaxScorePerMove] = useState(0); // Состояние для максимального количества очков за ход

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const intervalRef = useRef();
  const networkRef = useRef(null);

  const handleShowHistoryModal = () => setShowHistoryModal(true);
  const handleCloseHistoryModal = () => setShowHistoryModal(false);

  const saveNodeCoordinates = () => {
    if (networkRef.current) {
      const nodePositions = networkRef.current.body.nodes;
      const coordinates = {};

      Object.keys(nodePositions).forEach((nodeId) => {
        const node = nodePositions[nodeId];
        coordinates[nodeId] = { x: node.x, y: node.y };
      });

      // Генерация файла с координатами
      const file = new Blob([JSON.stringify(coordinates, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(file);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${matrixInfo.matrix_info.matrix_name}_coordinates.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      console.log('Координаты узлов сохранены в файл node_coordinates.json');
    } else {
      console.log('Граф ещё не инициализирован.');
    }
  };


  const resetNodeCoordinates = () => {
    const fileName = `/models_coords/${matrixInfo.matrix_info.matrix_name}_coordinates.json`;

    fetch(fileName)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Файл ${fileName} не найден или недоступен.`);
        }
        return response.json();
      })
      .then((coordinates) => {
        // Привязываем координаты к узлам графа
        if (coordinates && typeof coordinates === 'object') {
          Object.keys(coordinates).forEach((nodeId) => {
            const node = coordinates[nodeId];
            if (node && node.x !== undefined && node.y !== undefined) {
              const existingNode = networkRef.current.body.nodes[nodeId];
              if (existingNode) {
                existingNode.x = node.x;
                existingNode.y = node.y;
              }
            }
          });

          networkRef.current.redraw(); // Перерисовываем граф
          alert('Координаты узлов успешно сброшены.');
        } else {
          alert('Неверный формат данных в файле.');
        }
      })
      .catch((error) => {
        console.error('Ошибка при сбросе координат:', error);
        alert(`Ошибка: ${error.message}`);
      });
  };


  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (matrixInfo) {
      // console.log(matrixInfo);
      const edges = matrixInfo.edges;
      const oldnodes = matrixInfo.nodes;
      const nodes = new Map();
      const nodesDataSet = new DataSet();
      const edgesDataSet = new DataSet();

      // Шаг 1: Собираем все существующие индексы
      const indexes = new Set();
      edges.forEach(({ from, to }) => {
        indexes.add(from.id);
        indexes.add(to.id);
      });

      // Шаг 2: Создаем отображение старых индексов на новые
      const indexMap = new Map();
      let newIndex = 1;
      indexes.forEach((index) => {
        indexMap.set(index, newIndex);
        newIndex++;
      });

      edges.forEach(({ from, to, value }) => {
        // console.log(from, to, value)
        if (value !== 0) {
          const fromId = from;
          const toId = to;

          if (!nodes.has(fromId)) {
            nodes.set(fromId, {
              id: fromId,
              label: `${fromId}`,
              title: oldnodes[fromId].name,
              description: from.description,
            });
            nodesDataSet.add(nodes.get(fromId));
          }

          if (!nodes.has(toId)) {
            nodes.set(toId, {
              id: toId,
              label: `${toId}`,
              title: oldnodes[fromId].name,
              target: to.target,
              description: to.description,
            });

            // Проверяем, является ли вершина целевой (target) и устанавливаем соответствующий цвет
            if (to.target === 1) {
              nodes.get(toId).color = "gold";
              nodes.get(toId).font = {
                size: 25,
              };
            }

            nodesDataSet.add(nodes.get(toId));
          }

          // console.log({ id: `${fromId}${toId}`, from: fromId, to: toId, value, title: `При увеличении ${from.name} ${value > 0 ? 'увеличивается' : 'уменьшается'} ${to.ru_name} на ${value}`, label: value.toString(), smooth: { type: "curvedCW", roundness: edgeRoundness } })

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
            });
          } catch (e) {
            // инструкции для обработки ошибок
            // console.log(e);
          }
        }
      });
      // Установка начальных позиций узлов по шаблону
      // const nodesWithPositions = nodesDataSet.get().map((node, index) => ({
      //   ...node,
      //   x: templatePositions[index] ? templatePositions[index].x : 0,
      //   y: templatePositions[index] ? templatePositions[index].y : 0,
      //   fixed: true, // Фиксируем начальные позиции узлов
      // }));
      // nodesDataSet.update(nodesWithPositions);

      setGraphData({ nodes: nodesDataSet, edges: edgesDataSet });
    }
  }, [matrixInfo]);

  const handleNodeClick = (event) => {
    const clickedNodeIds = event.nodes;
    const clickedEdgeIds = event.edges;
    if (clickedNodeIds.length === 1) {
      const clickedNodeId = clickedNodeIds[0];
      // Проверяем, находится ли выделенный узел в массиве заблокированных узлов
      if (!lockedNodes[clickedNodeId]) {
        // Toggle the selected state of the clicked node
        setSelectedNodes((prevSelectedNodes) => {
          if (prevSelectedNodes.includes(clickedNodeId)) {
            // Deselect the node
            return prevSelectedNodes.filter(
              (nodeId) => nodeId !== clickedNodeId
            );
          } else {
            // Select the node
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

  const handleStart = () => {
    setIsRunning(true);
    setElapsedTime(0);
    setScore(0);
    setLastIndex(0);
    setMoveHistory([]);
    setLockedNodes({}); // Разблокировать все вершины
  };

  const handleStop = () => {
    setIsRunning(false);

    // Save stopwatch event to history
    setStopwatchHistory([
      ...stopwatchHistory,
      {
        elapsedTime,
        startTime: new Date(),
        selectedNodes: [...moveHistory],
        resscore: score,
      },
    ]);

    // Reset elapsed time
    setElapsedTime(0);
  };

  useEffect(() => {
    if (graphData) {
      const container = document.getElementById("graph-container");

      const options = {
        edges: {
          smooth: {
            type: "curvedCW",
            roundness: edgeRoundness,
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
          arrows: { to: true },
          color: {
            highlight: "white",
          },
          chosen: true,
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
          size: 40,
          font: {
            size: 14,
            color: "white",
            align: "center",
          },
          borderWidth: 2,
          borderWidthSelected: 4,
          color: {
            background: "#0b001a",
          },
        },
        interaction: {
          hover: true,
          tooltipDelay: 300,
          multiselect: true,
        },
      };

      const existingNetwork = networkRef.current;

      if (existingNetwork) {
        const allNodes = existingNetwork.body.data.nodes;
        const allEdges = existingNetwork.body.data.edges;

        allNodes.update(
          allNodes.get().map((node) => ({
            id: node.id,
            color: {
              background:
                selectedNodes.includes(node.id) || lockedNodes[node.id]
                  ? "gray"
                  : node.target
                    ? "gold"
                    : "#0b001a",
            },
            fixed: lockedNodes[node.id]
              ? { x: true, y: true }
              : { x: false, y: false },
            interaction: lockedNodes[node.id] ? false : true,
          }))
        );

        allEdges.update(
          allEdges.get().map((edge) => ({
            id: edge.id,
            color: {
              color: selectedEdges.includes(edge.id)
                ? "white"
                : edge.value > 0
                  ? "green"
                  : "red",
            },
          }))
        );
      } else {
        const newNetwork = new Network(container, graphData, options);

        newNetwork.on("click", handleNodeClick);
        newNetwork.on("hoverNode", (event) => {
          setHighlightedNode(event.node);
          setShowNodeList(true);
          setHoveredNode(event.node);
          setCursorPosition({ x: event.pointer.DOM.x, y: event.pointer.DOM.y });
        });
        newNetwork.on("blurNode", () => {
          setHighlightedNode(null);
          setShowNodeList(false);
          setHoveredNode(null);
        });
        newNetwork.on("selectNode", (params) => {
          const selectableNodes = params.nodes.filter(
            (id) => !Object.keys(lockedNodes).includes(id)
          );
          newNetwork.setSelection({
            nodes: selectableNodes,
            edges: params.edges,
          });
        });

        // Добавляем обработчик для отслеживания координат узлов
        newNetwork.on("dragEnd", () => {
          const nodePositions = newNetwork.body.nodes;
          Object.keys(nodePositions).forEach((nodeId) => {
            const node = nodePositions[nodeId];
          });
        });

        networkRef.current = newNetwork;
      }
    }
  }, [graphData, selectedNodes, selectedEdges, lockedNodes]);

  // Inside the makeMove function
  const makeMove = async () => {
    try {
      let selectedNodesDictionary = createSelectedNodesDictionary(
        selectedNodes,
        lastIndex
      );
      // console.log(lastIndex);
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
        if (!isRunning) {
          handleStart();
        }
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
          // console.log("Max index:", maxIndex);
          // console.log("Previous last index:", prevLastIndex);
          const newIndex = maxIndex + 1;
          // console.log("New index:", newIndex);
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

  return (
    <div style={{ display: "flex", zIndex: -1, flexDirection: "column" }}>
      <div style={{ position: "relative", flex: "1", paddingRight: "20px" }}>
        {/* Stopwatch */}

        <ul
          className="Button-Group"
          id="pills-tab"
          role="tablist"
          style={{ top: "20px", position: "absolute", zIndex: 1 }}
        >
          <li>
            <button
              className="game-button"
              variant="primary"
              style={{
                display: "flex",
                flexDirection: "row",
                zIndex: 1000,
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
              onClick={handleOpenModal}
            >
              <InfoIcon /> Description
            </button>
          </li>
          <li>
            <Link to={"/science"}>
              <button
                className="game-button"
                disabled={isRunning}
                title={isRunning ? "Недоступно в процессе игры" : ""}
              >
                Science
              </button>
            </Link>
          </li>
          <li class="nav-item" role="presentation">
            <button
              className="game-button active"
              id="pills-graph-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-graph"
              type="button"
              role="tab"
              aria-controls="pills-graph"
              aria-selected="true"
            >
              Graph
            </button>
          </li>

          <li class="nav-item" role="presentation">
            <button
              className="game-button"
              id="profile-tab"
              data-bs-toggle="pill"
              data-bs-target="#profile"
              type="button"
              role="tab"
              aria-controls="profile"
              aria-selected="false"
              disabled={isRunning}
              title={isRunning ? "Недоступно в процессе игры" : ""}
            >
              Profile
            </button>
          </li>
          <li>
            <button
              className="game-button"
              onClick={saveNodeCoordinates}
            >
              Сохранить координаты
            </button>
          </li>

          <li>
            <button
              className="game-button"
              onClick={resetNodeCoordinates}
            >
              Reset
            </button>


          </li>

        </ul>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {cards[selectedPlanet.name][selectedCardIndex].title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {cards[selectedPlanet.name][selectedCardIndex].description}
          </Modal.Body>
        </Modal>
        <InfoModalWindow selectedPlanet={selectedPlanet} />

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
      </div>


      <div class="tab-content" id="pills-tabContent">
        <div
          class="tab-pane fade show active"
          id="pills-graph"
          role="tabpanel"
          aria-labelledby="pills-graph-tab"
        >
          <div></div>

          <div
            className="VerticalProgressBar-container"
            style={{
              top: 430,
              left: "13%",
              position: "absolute",
              zIndex: 1,
              color: "white",
            }}
          >
            <VerticalProgressBar currentTime={elapsedTime} maxTime={600} />
          </div>
          <div
            className="stopwatch-container"
            style={{
              top: 430,
              right: 75,
              position: "absolute",
              zIndex: 1,
              color: "white",
            }}
          >
            <div className="stopwatch-container-time">
              <h3>Time</h3>
              <p>
                <FaStopwatch />
                {`${String(Math.floor(elapsedTime / 60)).padStart(
                  2,
                  "0"
                )}:${String(elapsedTime % 60).padStart(2, "0")}`}
              </p>
            </div>
            <div className="stopwatch-container-score">
              <h3>Score</h3>
              <p>
                <FaMedal /> {`${score}`}{" "}
                {/* Иконка рядом с полем "Набранные очки" */}
              </p>
            </div>
            <div className="stopwatch-container-table">
              <h3> Vertices</h3>
            </div>
            <div className="stopwatch-container-buttons">
              <Button
                variant="success"
                onClick={handleStart}
                disabled={isRunning}
              >
                Start
              </Button>{" "}
              <Button
                variant="danger"
                onClick={handleStop}
                disabled={!isRunning}
              >
                Stop
              </Button>
            </div>
          </div>

          {/* Graph container */}
          {graphData && (
            <div
              id="graph-container"
              style={{
                height: "755px",
                width: "100%",
                position: "absolute",
                left: 0,
                zIndex: -1,
                backgroundColor: "#0b001a",
                color: "white",
              }}
            ></div>
          )}
          {showNodeList && (
            <div
              className={`node-list-container ${showNodeList ? "visible" : ""}`}
            >
              <Card>
                <Card.Header>
                  <Card.Title>Список вершин:</Card.Title>
                </Card.Header>
                <Card.Body>
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
                </Card.Body>
              </Card>
            </div>
          )}

          {selectedNodes.length > 0 && (
            <div
              className="selected-nodes-list"
              style={{
                position: "absolute",
                top: "240px",
                right: "320px",
                zIndex: 1,
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
        </div>

        <div
          class="tab-pane fade"
          id="pills-history"
          role="tabpanel"
          aria-labelledby="pills-history-tab"
        >
          {/* Stopwatch History Table */}
          <div className="stopwatch-history-container">
            <h2>Games History</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Elapsed Time</th>
                  <th>Start Time</th>
                  <th>Selected Nodes</th>
                  <th>Final Score</th>
                </tr>
              </thead>
              <tbody>
                {stopwatchHistory.map((event, index) => (
                  <tr key={index}>
                    <td>{event.elapsedTime} seconds</td>
                    <td>{event.startTime.toLocaleString()}</td>
                    <td>
                      {event.selectedNodes
                        .map((move) => move.selectedNodes.join(", "))
                        .join(", ")}
                    </td>
                    <td>{event.resscore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div
          class="tab-pane fade"
          id="profile"
          role="tabpanel"
          aria-labelledby="profile-tab"
        >
          {/* Render CSV Table */}
          <div className="csv-table-container">
            <h2>CSV Data</h2>
            {matrixInfo &&
              matrixInfo.csv_data &&
              matrixInfo.csv_data.length > 0 ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    {/* Assuming the CSV file has headers, use them as table headers */}
                    {Object.keys(matrixInfo.csv_data[0]).map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrixInfo.csv_data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>No CSV data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphComponent;

{
  /* <div>
Чтобы отслеживать положение вершин графа в библиотеке **vis.js**, вы можете использовать метод `getPositions()` для получения текущих координат узлов. Затем вы можете сохранить эти позиции и обновить их, когда это необходимо. Вот как это можно сделать:

## Шаги для отслеживания положения узлов

1. **Создание графа**: Инициализируйте граф с узлами и ребрами.
2. **Отслеживание изменений**: Используйте метод `getPositions()` для получения текущих координат узлов после их перемещения.
3. **Сохранение позиций**: Сохраните полученные координаты в массив или объект для дальнейшего использования.
4. **Обновление позиций**: При необходимости обновите позиции узлов, используя метод `update()`.

## Пример кода

Вот пример, который демонстрирует, как отслеживать и сохранять положение узлов:

```javascript
// Создание набора узлов
var nodes = new vis.DataSet([
    { id: 1, label: 'Узел 1' },
    { id: 2, label: 'Узел 2' },
    { id: 3, label: 'Узел 3' }
]);

// Создание набора ребер
var edges = new vis.DataSet([
    { from: 1, to: 2 },
    { from: 2, to: 3 }
]);

// Инициализация контейнера
var container = document.getElementById('mynetwork');
var data = {
    nodes: nodes,
    edges: edges
};

// Опции графа
var options = {
    physics: true // Включение физики для динамического перемещения узлов
};

// Создание сети
var network = new vis.Network(container, data, options);

// Функция сохранения позиций узлов
function saveNodePositions() {
    var positions = network.getPositions();
    var savedPositions = [];

    for (const [id, pos] of Object.entries(positions)) {
        savedPositions.push({
            id: parseInt(id),
            x: pos.x,
            y: pos.y
        });
    }

    console.log(savedPositions); // Сохраненные позиции узлов
}

// Пример вызова функции сохранения позиций через определенный интервал времени
setInterval(saveNodePositions, 5000); // Сохраняем позиции каждые 5 секунд

// Обработчик события перетаскивания узлов (если необходимо)
network.on("dragEnd", function (params) {
    saveNodePositions(); // Сохраняем позиции после перетаскивания
});
```

### Объяснение кода

- **getPositions()**: Этот метод возвращает объект с текущими позициями всех узлов в графе.
- **Сохранение позиций**: Позиции сохраняются в массив `savedPositions`, который можно использовать для восстановления состояния графа позже.
- **Интервал**: Позиции сохраняются каждые 5 секунд с помощью функции `setInterval`, но вы также можете сохранять их по событию (например, после перетаскивания).
- **dragEnd**: Событие `dragEnd` позволяет вам сохранить позиции сразу после того, как пользователь закончил перемещение узла.

Эти шаги позволят вам эффективно отслеживать и сохранять положение вершин в графе на основе vis.js.

</div> */
}
