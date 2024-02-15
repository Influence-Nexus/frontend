import React, { useEffect, useState } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';
import './Graph.css'; // Import the CSS file for styling
import 'bootstrap/dist/css/bootstrap.min.css'; // Подключаем файл стилей Bootstrap
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'; // Import Bootstrap JavaScript
import SelectedNodesList from './SelectedNodesList'; // Путь к компоненту SelectedNodesList
import Button from 'react-bootstrap/Button'; // Путь к компоненту Button

const GraphComponent = ({ matrixInfo }) => {
  const [graphData, setGraphData] = useState(null);
  const [highlightedNode, setHighlightedNode] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);
  
  useEffect(() => {
    if (matrixInfo) {
      const edges = matrixInfo.edges;

      const nodes = new Map();
      const nodesDataSet = new DataSet();
      const edgesDataSet = new DataSet();

      console.log(edges);

      edges.forEach(({ from, to, value }) => {
        if (value !== 0) { // Exclude edges with value 0
          console.log(from, to, value);
          if (!nodes.has(from.id)) {
            nodes.set(from.id, { id: from.id, label: `${from.id}`, title: from.name });
            nodesDataSet.add(nodes.get(from.id));
          }

          if (!nodes.has(to.id)) {
            nodes.set(to.id, { id: to.id, label: `${to.id}`, title: to.name });
            nodesDataSet.add(nodes.get(to.id));
          }

          edgesDataSet.add({ from: from.id, to: to.id, value, label: value.toString() });
        }
      });

      console.log(nodesDataSet);
      console.log(edgesDataSet);


      setGraphData({ nodes: nodesDataSet, edges: edgesDataSet });
    }
  }, [matrixInfo]);

  const handleNodeClick = (event) => {
    const clickedNodeIds = event.nodes;
    if (clickedNodeIds.length === 1) {
      const clickedNodeId = clickedNodeIds[0];
      // Если вершина уже была выбрана, удаляем её из списка выбранных
      if (selectedNodes.includes(clickedNodeId)) {
        setSelectedNodes(selectedNodes.filter(nodeId => nodeId !== clickedNodeId));
      } else {
        // Иначе, добавляем вершину в список выбранных
        setSelectedNodes([...selectedNodes, clickedNodeId]);
      }
    }
  };
  const handleClearSelection = () => {
    setSelectedNodes([]);
  };


  useEffect(() => {
    if (graphData) {
      const container = document.getElementById('graph-container');

      const nodes = graphData.nodes; // Define nodes here

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
              min: 7,
              max: 7,
              maxVisible: 55,
              drawThreshold: 5,
            },
          },
          arrows: {
            to: {
              scaleFactor: 0.45, // Уменьшить размер стрелочки
            },
          },
      
        },
        physics: {
          repulsion: {
            centralGravity: 1, // Уменьшаем центральное притяжение между вершинами
            springLength: 300, // Увеличиваем длину пружины
            springConstant: 0.001, // Уменьшаем жесткость пружины
          },
        },
        nodes: {
          shape: 'circle', // Сделать вершины круглыми
          size: 40,
          font: {
            size: 14,
            align: 'center', // Выравнивание текста по центру
          },
      
          borderWidth: 2, // Ширина обводки
          borderWidthSelected: 4, // Ширина обводки при выделении
          color: {
            border: 'black', // Цвет обводки
            background: 'white', // Прозрачный фон
          },
       },
        interaction: {
          hover: true,
          tooltipDelay: 300,
          multiselect: true,
       },
      };

      const network = new Network(container, graphData, options);

      network.on('click', handleNodeClick);

      // Highlight node in the graph on hover in the node list
      network.on('hoverNode', (event) => {
        setHighlightedNode(event.node);
      });

      // Remove highlight when leaving the node list
      network.on('blurNode', () => {
        setHighlightedNode(null);
      });


      return () => {
        network.destroy();
      };
    }
  }, [graphData, selectedNodes]);


  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: '1', paddingRight: '20px' }}>
        <div id="graph-container" style={{ height: '400px' }}></div>
      </div>
      {graphData && (
        <div className="node-list-container">
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
        <div className="selected-nodes-list">
          <h2>Selected Nodes</h2>
          <ul>
            {selectedNodes.map((nodeId, index) => (
              <li key={index}>{`Node ID: ${nodeId}`}</li>
            ))}
          </ul>
          <Button variant="outline-danger" onClick={handleClearSelection}>
            Clear Selection
          </Button>
        </div>
      )}

      
    </div>
  );
};

export default GraphComponent;
