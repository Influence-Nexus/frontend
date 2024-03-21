import React, { useEffect, useState, useRef } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';
import './Graph.css'; // Import the CSS file for styling
import 'bootstrap/dist/css/bootstrap.min.css'; // Подключаем файл стилей Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { FaMedal, FaStar, FaStopwatch  } from 'react-icons/fa';



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
         if (value !== 0) {
           const fromId = indexMap.get(from.id);
           const toId = indexMap.get(to.id);
   
           if (!nodes.has(fromId)) {
             nodes.set(fromId, { id: fromId, label: `${fromId}`, title: from.name });
             nodesDataSet.add(nodes.get(fromId));
           }
   
           if (!nodes.has(toId)) {
             nodes.set(toId, { id: toId, label: `${toId}`, title: to.name });
   
             // Проверяем, является ли вершина целевой (target) и устанавливаем соответствующий цвет
             if (to.target === 1) {
               nodes.get(toId).color = 'gold';
               nodes.get(toId).size = 70;
             }
   
             nodesDataSet.add(nodes.get(toId));
           }
   
           edgesDataSet.add({ id: `${fromId}${toId}`, from: fromId, to: toId, value, label: value.toString(), smooth: { type: "curvedCW", roundness: 0.1 } });
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
        physics: physicsEnabled,

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
            align: 'center',
          },
          borderWidth: 2,
          borderWidthSelected: 4,
          color: {
            border: 'black',
            background: nodeColor,

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
            background: selectedNodes.includes(node.id) || lockedNodes[node.id] ? 'gray' : nodeColor,
          },
          fixed: lockedNodes[node.id] ? { x: true, y: true } : { x: false, y: false },
          interaction: lockedNodes[node.id] ? false : true, 
        })));
        

        allEdges.update(allEdges.get().map(edge => ({
          id: edge.id,
          color: {
            color: edge.value > 0 ? positiveEdgeColor : negativeEdgeColor, // Green for positive, Red for negative
          },
        })));
         
      } else {
        // If the graph is not created yet, create a new one
        const newNetwork = new Network(container, graphData, options);
        newNetwork.on('click', handleNodeClick);
        newNetwork.on('hoverNode', (event) => {
          setHighlightedNode(event.node);
          setShowNodeList(true);

          
        });
        newNetwork.on('blurNode', () => {
          setHighlightedNode(null);
          setShowNodeList(false);
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
    <button class="nav-link" id="pills-history-tab" data-bs-toggle="pill" data-bs-target="#pills-history" type="button" role="tab" aria-controls="pills-history" aria-selected="false">History</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-bs-toggle="pill" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Profile</button>
  </li>
</ul>
<Button variant="primary" onClick={handleShowHistoryModal} style={{top: '20px', left: '244px', position: 'absolute', zIndex: 1 }}>
  Show History
</Button>

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

      <div class="tab-content" id="pills-tabContent">
          <div class="tab-pane fade show active" id="pills-graph" role="tabpanel" aria-labelledby="pills-graph-tab">
          <div className="stopwatch-container" style={{ right: 75, position: 'absolute', zIndex: 1 }}>
          <h3>Процесс игры</h3>
          <div>
          <div>
    <p><FaStopwatch />{`Elapsed Time: ${elapsedTime} seconds`}</p>
    <p>
      <FaMedal /> {`Score: ${score}`} {/* Иконка рядом с полем "Набранные очки" */}
    </p>
    <p>
      <FaStar /> {`Max Score Per Move: ${maxScorePerMove}`} {/* Иконка рядом с полем "Максимальное количество очков за ход" */}
    </p>
  </div>          </div>
          <div>
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
              <div id="graph-container" style={{ height: '755px', width: '100%', position: 'absolute', top: 210, left: 0 , zIndex: -1, backgroundColor: backgroundColor}}></div>
            )}
            {showNodeList && (
              <div className={`node-list-container ${showNodeList ? 'visible' : ''}`}>
                <h2>Node List</h2>
                <ul className="node-list">
                  {graphData.nodes.get().map((node) => (
                    <li
                      key={node.id}
                      className={highlightedNode === node.id ? 'highlighted' : ''}
                      onMouseEnter={() => setHighlightedNode(node.id)}
                      onMouseLeave={() => setHighlightedNode(null)}
                    >{`${node.id} - ${node.title}`}</li>
                  ))}
                </ul>
              </div>
            )}
      {selectedNodes.length > 0 && (
        <div className="selected-nodes-list"  style={{ position: 'absolute', top: '240px', right: '320px', zIndex: 1 }}>
          <h2>Selected Nodes</h2>
          <ul>
            {selectedNodes.map((nodeId, index) => (
              <li key={index}>{`${index + 1}|  Node ID: ${nodeId}`}</li>
            ))}
          </ul>
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
                <td>{event.selectedNodes.join(', ')}</td>
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
