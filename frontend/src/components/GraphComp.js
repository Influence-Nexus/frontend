import React, { useEffect, useState, useRef } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';
import './Graph.css'; // Import the CSS file for styling
import 'bootstrap/dist/css/bootstrap.min.css'; // Подключаем файл стилей Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Button from 'react-bootstrap/Button'; // Путь к компоненту Button
import Table from 'react-bootstrap/Table';


const GraphComponent = ({ matrixInfo }) => {
  const [graphData, setGraphData] = useState(null);
  const [highlightedNode, setHighlightedNode] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stopwatchHistory, setStopwatchHistory] = useState([]);
  const [showNodeList, setShowNodeList] = useState(false);

  const intervalRef = useRef();
  const networkRef = useRef(null);

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
  
      edges.forEach(({ from, to, value }) => {
        if (value !== 0) {
          if (!nodes.has(from.id)) {
            nodes.set(from.id, { id: from.id, label: `${from.id}`, title: from.name });
            nodesDataSet.add(nodes.get(from.id));
          }
  
          if (!nodes.has(to.id)) {
            nodes.set(to.id, { id: to.id, label: `${to.id}`, title: to.name });
  
            // Проверяем, является ли вершина целевой (target) и устанавливаем соответствующий цвет
            if (to.target === 1) {
              nodes.get(to.id).color = 'gold';
            }
  
            nodesDataSet.add(nodes.get(to.id));
          }
  
          edgesDataSet.add({ from: from.id, to: to.id, value, label: value.toString() });
        }
      });
  
      setGraphData({ nodes: nodesDataSet, edges: edgesDataSet });
    }
  }, [matrixInfo]);
  

  const handleNodeClick = (event) => {
    const clickedNodeIds = event.nodes;
    if (clickedNodeIds.length === 1) {
      const clickedNodeId = clickedNodeIds[0];
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
  };

  const handleClearSelection = () => {
    setSelectedNodes([]);
  };

  const handleStart = () => {
    setIsRunning(true);
    setElapsedTime(0);
  };

  const handleStop = () => {
    setIsRunning(false);

    // Save stopwatch event to history
    setStopwatchHistory([
      ...stopwatchHistory,
      {
        elapsedTime,
        startTime: new Date(),
        selectedNodes: [...selectedNodes],
      },
    ]);

    // Reset elapsed time
    setElapsedTime(0);
  };

  useEffect(() => {
    if (graphData) {
      const container = document.getElementById('graph-container');

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
          arrows: { middle: { scaleFactor: 0.45, }, to: true },
        },
        physics: false,

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
            background: 'white',
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
            background: selectedNodes.includes(node.id) ? 'gray' : 'white',
          },
        
        })));

        allEdges.update(allEdges.get().map(edge => ({
          id: edge.id,
          color: {
            color: edge.value > 0 ? 'rgba(60, 114, 194, 0.7)' : 'rgba(255, 99, 71, 0.7)', // Green for positive, Red for negative
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

        networkRef.current = newNetwork;
      }
    }
  }, [graphData, selectedNodes]);


return (
    <div style={{ display: 'flex'}}>
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

      </div>

      <div class="tab-content" id="pills-tabContent">
          <div class="tab-pane fade show active" id="pills-graph" role="tabpanel" aria-labelledby="pills-graph-tab">
          <div className="stopwatch-container" style={{right: 75, position: 'absolute', zIndex: 1 }}>
        <h3>Timer</h3>
        <div>
          <p>{`Elapsed Time: ${elapsedTime} seconds`}</p>
        </div>
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
              <div id="graph-container" style={{ height: '755px', width: '100%', position: 'absolute', top: 210, left: 0 }}></div>
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
            </tr>
          </thead>
          <tbody>
            {stopwatchHistory.map((event, index) => (
              <tr key={index}>
                <td>{event.elapsedTime} seconds</td>
                <td>{event.startTime.toLocaleString()}</td>
                <td>{event.selectedNodes.join(', ')}</td>
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
