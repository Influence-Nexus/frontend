import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';
import './Graph.css'; // Import the CSS file for styling
import 'bootstrap/dist/css/bootstrap.min.css'; // Подключаем файл стилей Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import KeyIcon from "@mui/icons-material/Key";

import "../Science/SciencePageComponents/Buttons/SciencePageButtons.css";


import { FaMedal, FaStar, FaStopwatch  } from 'react-icons/fa';
import VerticalProgressBar from './VerticalProgress';



const GraphComponent = ({ matrixInfo, backgroundColor, positiveEdgeColor, negativeEdgeColor, nodeColor, physicsEnabled, nodeSize, edgeRoundness }) => {
  const [graphData, setGraphData] = useState(null);
  const [highlightedNode, setHighlightedNode] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);
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





  const createSelectedNodesDictionary = (selectedNodes, startIndex) => {
    return selectedNodes.reduce((acc, nodeId, index) => {
      console.log(startIndex);
      // Используем индекс плюс startIndex как ключ
      acc[index + startIndex] = nodeId;
      return acc;
    }, {});
  };
  



  const [score, setScore] = useState(0); // Состояние для набранных очков
  const [maxScorePerMove, setMaxScorePerMove] = useState(0); // Состояние для максимального количества очков за ход


  const [showModal, setShowModal] = useState(false);
  const [serverResponseData, setServerResponseData] = useState(null);

  const intervalRef = useRef();
  const networkRef = useRef(null);

  const handleShowHistoryModal = () => setShowHistoryModal(true);
  const handleCloseHistoryModal = () => setShowHistoryModal(false);



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
       console.log(matrixInfo);
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
       indexes.forEach(index => {
         indexMap.set(index, newIndex);
         newIndex++;
       });
   
       edges.forEach(({ from, to, value }) => {
        console.log(from, to, value)
         if (value !== 0) {
           const fromId = from;
           const toId = to;
   
           if (!nodes.has(fromId)) {
             nodes.set(fromId, { id: fromId, label: `${fromId}`, title: oldnodes[fromId].name, description: from.description});
             nodesDataSet.add(nodes.get(fromId));
           }
   
           if (!nodes.has(toId)) {
             nodes.set(toId, { id: toId, label: `${toId}`, title: oldnodes[fromId].name, target: to.target, description: to.description });
   
             // Проверяем, является ли вершина целевой (target) и устанавливаем соответствующий цвет
             if (to.target === 1) {
               nodes.get(toId).color = 'gold';
               nodes.get(toId).font = {
                size: 25,
              }
             }
   
             nodesDataSet.add(nodes.get(toId));
           }

           console.log({ id: `${fromId}${toId}`, from: fromId, to: toId, value, title: `При увеличении ${from.name} ${value > 0 ? 'увеличивается' : 'уменьшается'} ${to.ru_name} на ${value}`,label: value.toString(), smooth: { type: "curvedCW", roundness:edgeRoundness } })
  
           try{
            edgesDataSet.add({ id: `${fromId}${toId}`, from: fromId, to: toId, value, title: `При увеличении ${from.name} ${value > 0 ? 'увеличивается' : 'уменьшается'} ${to.ru_name} на ${value}`,label: value.toString(), smooth: { type: "curvedCW", roundness:edgeRoundness } });

           }catch (e) {
            // инструкции для обработки ошибок
            console.log(e);
          }
          
         }
       });
   
       setGraphData({ nodes: nodesDataSet, edges: edgesDataSet });
    }
   }, [matrixInfo]);
   
  

   const handleNodeClick = (event) => {
    const clickedNodeIds = event.nodes;
    if (clickedNodeIds.length === 1) {
       const clickedNodeId = clickedNodeIds[0];
       // Проверяем, находится ли выделенный узел в массиве заблокированных узлов
       if (!lockedNodes[clickedNodeId]) {
         // Toggle the selected state of the clicked node
         setSelectedNodes((prevSelectedNodes) => {
           if (prevSelectedNodes.includes(clickedNodeId)) {
             // Deselect the node
             return prevSelectedNodes.filter(nodeId => nodeId !== clickedNodeId);
           } else {
             // Select the node
             return [...prevSelectedNodes, clickedNodeId];
           }
         });
       }
    }
   };
   

  const handleClearSelection = () => {
    setSelectedNodes([]);
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
      const container = document.getElementById('graph-container');

      console.log(lockedNodes);


      const options = {     
        edges: {
          smooth: {
            type: 'cubicBezier',
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
        },
        physics: {
          enabled: physicsEnabled,
          barnesHut: {
            gravitationalConstant: -50000,
            centralGravity: 0.3,
            springLength: 95,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 3.4
          },
          stabilization: {
            enabled: true,
            iterations: 1000,
            updateInterval: 25
          }
       },

        //   repulsion: {
        //     centralGravity: 1,
        //     springLength: 300,
        //     springConstant: 0.001,
        //   },
        // },
        nodes: {
          shape: 'circle',
          size: 40,
          font: {
            size: 14,
            color: "white",
            align: 'center',
          },
          borderWidth: 2,
          borderWidthSelected: 4,
          color: {
            background: "#0b001a"

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

        allNodes.update(allNodes.get().map(node => ({
          id: node.id,
          color: {
            background: selectedNodes.includes(node.id) || lockedNodes[node.id] ? 'gray' : node.target ? "gold" : "#0b001a",
          },
          fixed: lockedNodes[node.id] ? { x: true, y: true } : { x: false, y: false },
          interaction: lockedNodes[node.id] ? false : true, 
        })));
        

        allEdges.update(allEdges.get().map(edge => ({
          id: edge.id,
          color: {
            color: edge.value > 0 ? "white" : "gold", // Green for positive, Red for negative
          },
        })));
         
      } else {
        // If the graph is not created yet, create a new one
        const newNetwork = new Network(container, graphData, options);
        newNetwork.on('click', handleNodeClick);
        newNetwork.on('hoverNode', (event) => {
          setHighlightedNode(event.node);
          setShowNodeList(true);
          setHoveredNode(event.node);
          setCursorPosition({ x: event.pointer.DOM.x, y: event.pointer.DOM.y });


          
        });
        newNetwork.on('blurNode', () => {
          setHighlightedNode(null);
          setShowNodeList(false);
          setHoveredNode(null);

        });

        newNetwork.on('selectNode', (params) => {
          // Фильтруем узлы, исключая те, которые находятся в массиве lockedNodes
          const selectableNodes = params.nodes.filter(id => !Object.keys(lockedNodes).includes(id));
          // Устанавливаем выделение для узлов, которые не находятся в массиве lockedNodes
          newNetwork.setSelection({
             nodes: selectableNodes,
             edges: params.edges, // Если вам нужно управлять выделением ребер, добавьте их здесь
          });
         });


        networkRef.current = newNetwork;
      }
    }
  }, [graphData, selectedNodes, lockedNodes]);

// Inside the makeMove function
const makeMove = async () => {
  try {
    let selectedNodesDictionary = createSelectedNodesDictionary(selectedNodes, lastIndex);
    console.log(lastIndex);
    const response = await fetch('http://localhost:5000/calculate_score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selectedNodes: selectedNodesDictionary, matrixName: matrixInfo.matrix_info.matrix_name}),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const responseData = await response.json();

    if (responseData && typeof responseData === 'object') {
      if (!isRunning){
        handleStart();
      }
      setMoveHistory([...moveHistory, { selectedNodes, score: responseData.score }]);
      setScore(score + responseData.score);
      if (responseData.score > maxScorePerMove) {
        setMaxScorePerMove(responseData.score);
      }
      setLastIndex(prevLastIndex => {
        const maxIndex = Math.max(...Object.keys(selectedNodesDictionary));
        console.log("Max index:", maxIndex);
        console.log("Previous last index:", prevLastIndex);
        const newIndex = maxIndex + 1;
        console.log("New index:", newIndex);
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
      console.error('Error: Invalid or missing server response data');
    }
  } catch (error) {
    console.error('Error making move:', error);
  }
};

    

return (
    <div style={{ display: 'flex', zIndex: -1 }} >

      
      <div style={{ position: 'relative', flex: '1', paddingRight: '20px' }}>

      {/* Stopwatch */}

      <ul class="nav nav-tabs mb-3" id="pills-tab" role="tablist" style={{top: '20px', position: 'absolute', zIndex: 1 }}>
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="pills-graph-tab" data-bs-toggle="pill" data-bs-target="#pills-graph" type="button" role="tab" aria-controls="pills-graph" aria-selected="true">Graph</button>
  </li>
  <li class="nav-item" role="presentation">

</li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="profile-tab" data-bs-toggle="pill" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Profile</button>
    </li>
</ul>



<Modal show = {showHistoryModal} onHide={handleCloseHistoryModal} backdrop="static" keyboard={false}>
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
            <td>{move.selectedNodes.join(', ')}</td>
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

      <div className="VerticalProgressBar-container" style={{top: '280px', position: 'absolute', zIndex: 1, color: "white"}}>
      End Game
        <VerticalProgressBar currentTime={elapsedTime} maxTime={3600} />
      Start game

      </div>


      <div class="tab-content" id="pills-tabContent">
          <div class="tab-pane fade show active" id="pills-graph" role="tabpanel" aria-labelledby="pills-graph-tab">
                  <div className="stopwatch-container" style={{ right: 75, position: 'absolute', zIndex: 1, color: "white" }}>
                    <div className="stopwatch-container-time"> 
                      <h3>Time</h3>
                      <p><FaStopwatch />{ `${String(Math.floor(elapsedTime / 60)).padStart(2, '0')}:${String(elapsedTime % 60).padStart(2, '0')}`}</p>
                    </div>
                    <div className="stopwatch-container-score">
                      <h3>Score</h3>
                      <p>
                        <FaMedal /> {`${score}`} {/* Иконка рядом с полем "Набранные очки" */}
                      </p>
                    </div>
                    <div className="stopwatch-container-table">
                      <h3> Vertices</h3>

                    </div>
                    <div className="stopwatch-container-buttons">
                    <Button variant="success" onClick={handleStart} disabled={isRunning}>
                      Start
                    </Button>{' '}
                    <Button variant="danger" onClick={handleStop} disabled={!isRunning}>
                      Stop
                    </Button>
                  </div>                  
                </div>

          {/* Graph container */}
          {graphData && (
              <div id="graph-container" style={{ height: '755px', width: '100%', position: 'absolute', top: 210, left: 0 , zIndex: -1, backgroundColor: "#0b001a", color: "white" }}></div>
            )}
            {showNodeList && (
              <div className={`node-list-container ${showNodeList ? 'visible' : ''}`}>
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
                        className={`list-group-item ${highlightedNode === node.id ? 'active' : ''}`}
                        onMouseEnter={() => setHighlightedNode(node.id)}
                        onMouseLeave={() => setHighlightedNode(null)}
                        ref={highlightedNode === node.id ? (element) => element && element.scrollIntoView({ behavior: "smooth", block: "nearest" }) : null}

                      >
                        {`${node.id} - ${node.title}`}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </div>
            )}
{/* {hoveredNode && (
  <div 
    className="card" 
    style={{ 
      position: 'absolute', 
      top: `${cursorPosition.y + 200}px`, 
      left: `${cursorPosition.x}px`,
      maxWidth: '555px',
      maxHeight: '355px', 
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',  // первая колонка для изображения, вторая для содержимого
      alignItems: 'center',  // выровнять элементы по вертикали
      overflow: 'hidden',  // скрыть излишек содержимого

    }}
  >
    <img 
      src={`data:image/jpeg;base64,${graphData.nodes.get(hoveredNode).image}`} 
      className="card-img-top" 
      alt={`Изображение вершины ${graphData.nodes.get(hoveredNode).title}`} 
      style={{
        maxHeight: '355px', 
        objectFit: 'cover',
        width: 'auto',
        marginRight: '15px'  // отступ между изображением и текстом
      }} 
    />
    <div className="card-body" style={{ overflowY: 'auto', maxHeight: '300px' }}>
      <h5 className="card-title">{`${graphData.nodes.get(hoveredNode).title}`}</h5>
      <p className="card-text">{`${graphData.nodes.get(hoveredNode).description}`}</p>
    </div>
  </div>    
)} */}



      {selectedNodes.length > 0 && (
        <div className="selected-nodes-list"  style={{ position: 'absolute', top: '240px', right: '320px', zIndex: 1 }}>
          <h2>Выбранные факторы:</h2>
          <ListGroup>
            {selectedNodes.map((nodeId, index) => (
              <ListGroup.Item key={index + lastIndex}>{`${index + lastIndex + 1}|  Node ID: ${nodeId}`}</ListGroup.Item>
            ))}
          </ListGroup>
          <Button variant="outline-danger" onClick={handleClearSelection}>
            Clear Selection
          </Button>
          <Button variant="primary" onClick={makeMove} disabled={selectedNodes.length === 0}>
              Make Move
            </Button>
        </div>
      )}
          
          
          </div>
          
          <div class="tab-pane fade" id="pills-history" role="tabpanel" aria-labelledby="pills-history-tab">
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
                <td>{event.selectedNodes.map(move => move.selectedNodes.join(', ')).join(', ')}</td>
                <td>{event.resscore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


          </div>
          <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
            {/* Render CSV Table */}
        <div className="csv-table-container">
          <h2>CSV Data</h2>
          {matrixInfo && matrixInfo.csv_data && matrixInfo.csv_data.length > 0 ? (
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
