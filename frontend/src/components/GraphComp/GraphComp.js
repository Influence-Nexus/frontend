import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";
import "./Graph.css";
import "bootstrap/dist/css/bootstrap.min.css";
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

// [CAT LOGIC] - Импортируем CatAnimation
import CatAnimation from "./CatAnimation"; // <-- скорректируйте путь

const GraphComponent = ({
  matrixInfo,
  backgroundColor = "#0b001a",
  positiveEdgeColor = "#00FF00",
  negativeEdgeColor = "#FF0000",
  nodeColor = "#97C2FC",
  physicsEnabled = false,
  nodeSize = 40,
  edgeRoundness = 0.15,
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
  const [lockedNodes, setLockedNodes] = useState({});
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [lastIndex, setLastIndex] = useState(0);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showModal, setShowModal] = useState(false);
  const [serverResponseData, setServerResponseData] = useState(null);
  const [score, setScore] = useState(0);
  const [maxScorePerMove, setMaxScorePerMove] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [movesHistory, setMovesHistory] = useState([]);
  const [disabledNodes, setDisabledNodes] = useState([]);

  const intervalRef = useRef();
  const networkRef = useRef(null);

  const location = useLocation();
  const selectedPlanetLocal = location.state?.selectedPlanet;
  const selectedCardIndexLocal = location.state?.selectedCardIndex;

  const planet = selectedPlanet || selectedPlanetLocal;
  const cardIndex =
    selectedCardIndex !== undefined ? selectedCardIndex : selectedCardIndexLocal;

  // [CAT LOGIC] - состояния для "показать кота" и "уже запустили кота"
  const [showCat, setShowCat] = useState(false);
  const [catAnimationLaunched, setCatAnimationLaunched] = useState(false);

  const createSelectedNodesDictionary = (selectedNodes, startIndex) => {
    return selectedNodes.reduce((acc, nodeId, index) => {
      acc[index + startIndex] = nodeId;
      return acc;
    }, {});
  };

  // --- Логика запуска/остановки таймера ---
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

  // --- Если время превысило 600 секунд, заканчиваем игру (Game Over) ---
  useEffect(() => {
    if (elapsedTime >= 600 && isRunning) {
      setIsRunning(false);
      setShowGameOverModal(true);
    }

    // [CAT LOGIC] - Если достигли 300 секунд и ещё не запускали кота, запускаем
    if (elapsedTime >= 300 && !catAnimationLaunched) {
      setShowCat(true);               // показать кота на экране
      setCatAnimationLaunched(true);  // больше не запускать
    }
  }, [elapsedTime, isRunning, catAnimationLaunched]);

  // --- Инициализация графа ---
  useEffect(() => {
    if (matrixInfo) {
      const edges = matrixInfo.edges;
      const oldnodes = matrixInfo.nodes;
      const nodes = new Map();
      const nodesDataSet = new DataSet();
      const edgesDataSet = new DataSet();

      edges.forEach(({ from, to, value }) => {
        if (value !== 0) {
          const fromId = from;
          const toId = to;

          // Узел-источник
          if (oldnodes[fromId - 1]) {
            if (!nodes.has(fromId)) {
              const isDisabled = disabledNodes.includes(fromId);
              nodes.set(fromId, {
                id: fromId,
                label: `${fromId}`,
                title: oldnodes[fromId - 1].name,
                description: oldnodes[fromId - 1].description,
                color: { background: isDisabled ? "gray" : nodeColor },
                font: { size: isDisabled ? 14 : 16 },
              });
              nodesDataSet.add(nodes.get(fromId));
            }
          }

          // Узел-приёмник
          if (oldnodes[toId - 1]) {
            if (!nodes.has(toId)) {
              const isDisabled = disabledNodes.includes(toId);
              const nodeObj = {
                id: toId,
                label: `${toId}`,
                title: oldnodes[toId - 1].name,
                description: oldnodes[toId - 1].description,
                color: { background: isDisabled ? "gray" : nodeColor },
                font: { size: isDisabled ? 14 : 16 },
              };

              if (oldnodes[toId - 1].target === 1) {
                nodeObj.color = { background: "gold" };
                nodeObj.font = { size: 25 };
              }
              nodes.set(toId, nodeObj);
              nodesDataSet.add(nodeObj);
            }
          }

          // Рёбра
          try {
            edgesDataSet.add({
              id: `${fromId}${toId}`,
              from: fromId,
              to: toId,
              value,
              title: `При увеличении ${oldnodes[fromId - 1].name
                } ${value > 0 ? "увеличивается" : "уменьшается"} ${oldnodes[toId - 1].name
                } на ${value}`,
              label: value.toString(),
              smooth: { type: "continues", roundness: edgeRoundness },
              color: {
                color: value > 0 ? positiveEdgeColor : negativeEdgeColor,
              },
            });
          } catch (e) {
            console.log(e);
          }
        }
      });

      setGraphData({ nodes: nodesDataSet, edges: edgesDataSet });
    }
  }, [
    matrixInfo,
    nodeColor,
    positiveEdgeColor,
    negativeEdgeColor,
    edgeRoundness,
    disabledNodes,
  ]);

  // --- Загружаем координаты из JSON (если есть) ---
  const loadCoordinates = () => {
    const matrixName = matrixInfo.matrix_info.matrix_name;
    const fileName = `/models_coords/${matrixName}_coordinates.json`;

    fetch(fileName)
      .then((response) => {
        if (!response.ok) {
          console.warn(`Файл ${fileName} не найден или недоступен.`);
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (!data) return;
        const { graph_settings, node_coordinates } = data;

        if (networkRef.current) {
          // Устанавливаем координаты узлов
          if (node_coordinates && typeof node_coordinates === "object") {
            Object.keys(node_coordinates).forEach((nodeId) => {
              const node = networkRef.current.body.nodes[nodeId];
              if (node && node_coordinates[nodeId]) {
                node.x = node_coordinates[nodeId].x;
                node.y = node_coordinates[nodeId].y;
              }
            });
          }
          // Устанавливаем позицию и масштаб
          if (graph_settings) {
            const { position, scale } = graph_settings;
            networkRef.current.moveTo({
              position: position || { x: 0, y: 0 },
              scale: scale || 1,
              animation: {
                duration: 1000,
                easingFunction: "easeInOutQuad",
              },
            });
          }
          networkRef.current.redraw();
        }
      })
      .catch((error) => {
        console.error("Ошибка при загрузке координат:", error);
      });
  };

  // --- Сброс координат ---
  const resetNodeCoordinates = () => {
    loadCoordinates();
    alert("Координаты узлов и настройки графа успешно сброшены.");
  };

  // --- Сохраняем настройки графа в JSON ---
  const saveGraphSettings = () => {
    if (networkRef.current) {
      const nodePositions = networkRef.current.body.nodes;
      const coordinates = {};

      // Сохраняем координаты узлов
      Object.keys(nodePositions).forEach((nodeId) => {
        const node = nodePositions[nodeId];
        coordinates[nodeId] = { x: node.x, y: node.y };
      });

      // Сохраняем текущую позицию и масштаб
      const { position, scale } = networkRef.current.getViewPosition();
      const dataToSave = {
        graph_settings: {
          position,
          scale,
        },
        node_coordinates: coordinates,
      };

      // Создаём Blob-файл
      const file = new Blob([JSON.stringify(dataToSave, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(file);

      // Автоматическая загрузка
      const a = document.createElement("a");
      a.href = url;
      const matrixName = matrixInfo.matrix_info.matrix_name;
      a.download = `${matrixName}_graph_settings.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      console.log(
        `Настройки графа сохранены в файл ${matrixName}_graph_settings.json`
      );
    } else {
      console.log("Граф ещё не инициализирован.");
    }
  };

  // --- После появления graphData рисуем сеть ---
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
          font: {
            size: 24,
            align: "horizontal",
          },
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
          multiselect: true,
        },
      };

      if (networkRef.current) {
        networkRef.current.destroy();
      }

      const newNetwork = new Network(container, graphData, options);

      newNetwork.moveTo({
        position: { x: -100, y: -350 },
        scale: 0.85,
        animation: {
          duration: 1000,
          easingFunction: "easeInOutQuad",
        },
      });

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

      networkRef.current = newNetwork;
      loadCoordinates();
    }
  }, [graphData, lockedNodes, edgeRoundness, physicsEnabled, nodeSize]);

  // --- Клики по вершинам/рёбрам ---
  const handleNodeClick = (event) => {
    const clickedNodeIds = event.nodes;
    const clickedEdgeIds = event.edges;

    // Выбор узла
    if (clickedNodeIds.length === 1) {
      const clickedNodeId = clickedNodeIds[0];
      // Проверяем, не заблокирована ли эта вершина
      if (!lockedNodes[clickedNodeId] && !disabledNodes.includes(clickedNodeId)) {
        setSelectedNodes((prevSelectedNodes) => {
          if (prevSelectedNodes.includes(clickedNodeId)) {
            return prevSelectedNodes.filter((id) => id !== clickedNodeId);
          } else {
            return [...prevSelectedNodes, clickedNodeId];
          }
        });
      }
    }

    // Выбор рёбер
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

  // --- Очистить выбор ---
  const handleClearSelection = () => {
    setSelectedNodes([]);
    setSelectedEdges([]);
  };

  // --- Старт ---
  const handleStart = () => {
    setIsRunning(true);
    setElapsedTime(0);
    setScore(0);
    setLastIndex(0);
    setMoveHistory([]);
    setLockedNodes({});
  };

  // --- Стоп ---
  const handleStop = () => {
    setIsRunning(false);

    setStopwatchHistory([
      ...stopwatchHistory,
      {
        elapsedTime,
        startTime: new Date(),
        selectedNodes: [...moveHistory],
        resscore: score,
      },
    ]);

    setElapsedTime(0);
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleShowHistoryModal = () => setShowHistoryModal(true);
  const handleCloseHistoryModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowHistoryModal(false);
      setIsClosing(false);
    }, 300);
  };

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

      if (!isRunning) {
        handleStart();
      }

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
        setDisabledNodes((prev) => [...new Set([...prev, ...selectedNodes])]);

        handleClearSelection();

        // Индекс для уникальных ключей
        setLastIndex((prevLastIndex) => {
          const maxIndex = Math.max(...Object.keys(selectedNodesDictionary));
          return maxIndex + 1;
        });

        setShowHistoryModal(true);
      } else {
        console.error("Error: Invalid or missing server response data");
      }
    } catch (error) {
      console.error("Error making move:", error);
    }
  };

  // --- Закрыть Game Over ---
  const handleCloseGameOverModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowGameOverModal(false);
      setIsClosing(false);
    }, 700);
  };

  // [CAT LOGIC] - колбэк, который вызывает CatAnimation, когда кот добегает до конца
  const handleCatAnimationEnd = () => {
    setShowCat(false); // убираем кота с экрана
  };

  return (
    <div style={{ display: "flex", zIndex: -1, flexDirection: "column" }}>
      {/* [CAT LOGIC] - рендерим кота только если showCat === true */}
      {showCat && (
        <CatAnimation
          triggerAnimation={true}
          stopAtX={1100}
          onAnimationEnd={() => console.log("Остановился на 600px!")}
        />

      )}

      <div style={{ position: "relative", flex: "1", paddingRight: "20px" }}>
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
            <Link to={"/science"} state={{ selectedPlanet, selectedCardIndex }}>
              <button
                className="game-button"
                disabled={isRunning}
                title={isRunning ? "Недоступно в процессе игры" : ""}
              >
                Science
              </button>
            </Link>
          </li>
          <li className="nav-item" role="presentation">
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

          <li className="nav-item" role="presentation">
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
            <button className="game-button" onClick={saveGraphSettings}>
              Сохранить граф
            </button>
          </li>
          <li>
            <button className="game-button" onClick={resetNodeCoordinates}>
              Reset
            </button>
          </li>
        </ul>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{cards[planet.name][cardIndex].title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{cards[planet.name][cardIndex].description}</Modal.Body>
        </Modal>

        <InfoModalWindow selectedPlanet={planet} />

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

        {/* Модальное окно "Game Over" */}
        <Modal
          show={showGameOverModal}
          centered
          animation={false}
          dialogClassName="custom-modal"
          contentClassName="custom-modal-content"
          className={`game-over-modal ${isClosing ? "slide-out" : "slide-in"}`}
        >
          <Modal.Header className="game-over-header">
            <Modal.Title id="game-over-title">Game Over</Modal.Title>
          </Modal.Header>
          <Modal.Body className="game-over-body">
            <h3>Your Score: {Math.max(0, score)}</h3>
          </Modal.Body>
          <Modal.Footer className="game-over-footer">
            <button
              id="game-over-ok-button"
              onClick={handleCloseGameOverModal}
              className="game-over-button"
              style={{
                color: cardcreds[selectedPlanet.name].color,
                border: `3px solid ${cardcreds[selectedPlanet.name].color}`,
              }}
            >
              OK
            </button>
          </Modal.Footer>
        </Modal>
      </div>

      <div className="tab-content" id="pills-tabContent">
        <div
          className="tab-pane fade show active"
          id="pills-graph"
          role="tabpanel"
          aria-labelledby="pills-graph-tab"
        >
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
                <FaMedal /> {`${score}`}
              </p>
            </div>

            <div className="stopwatch-container-table">
              <h1>Vertices</h1>
              {movesHistory.length > 0 ? (
                <ul style={{ padding: 0, listStyle: "none" }}>
                  {movesHistory.map((move) => (
                    <li key={move.moveNumber} style={{ marginBottom: "10px" }}>
                      <strong>Move {move.moveNumber}:</strong>{" "}
                      {move.nodes.join(", ")}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No moves made yet</p>
              )}
            </div>

            <div className="stopwatch-container-buttons">
              <Button
                variant="success"
                disabled={isRunning}
                onClick={() => setIsRunning(true)}
              >
                Start
              </Button>{" "}
              <Button
                variant="danger"
                disabled={!isRunning}
                onClick={() => setIsRunning(false)}
              >
                Stop
              </Button>
            </div>
          </div>

          {graphData && (
            <div
              id="graph-container"
              style={{
                height: "755px",
                width: "100%",
                position: "absolute",
                left: 0,
                zIndex: -1,
                backgroundColor: backgroundColor,
                color: "white",
                overflow: "hidden",
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
                top: "240px",
                right: "320px",
                zIndex: 1,
              }}
            >
              <h2>Выбранные факторы:</h2>
              <ListGroup>
                {selectedNodes.map((nodeId, index) => (
                  <ListGroup.Item key={index + lastIndex}>
                    {`${index + lastIndex + 1}| Node ID: ${nodeId}`}
                  </ListGroup.Item>
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
          className="tab-pane fade"
          id="pills-history"
          role="tabpanel"
          aria-labelledby="pills-history-tab"
        >
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
          className="tab-pane fade"
          id="profile"
          role="tabpanel"
          aria-labelledby="profile-tab"
        >
          <div className="csv-table-container">
            <h2>CSV Data</h2>
            {matrixInfo &&
              matrixInfo.csv_data &&
              matrixInfo.csv_data.length > 0 ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
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
