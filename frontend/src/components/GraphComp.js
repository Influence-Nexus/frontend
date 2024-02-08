import React, { useEffect, useState } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';
import './Graph.css'; // Import the CSS file for styling

const GraphComponent = ({ matrixInfo }) => {
  const [graphData, setGraphData] = useState(null);
  const [highlightedNode, setHighlightedNode] = useState(null);

  useEffect(() => {
    if (matrixInfo) {
      const edges = matrixInfo.edges;

      const nodes = new Map();
      const nodesDataSet = new DataSet();
      const edgesDataSet = new DataSet();

      edges.forEach(({ from, to, value }) => {
        if (value !== 0) { // Exclude edges with value 0
          if (!nodes.has(from.id)) {
            nodes.set(from.id, { id: from.id, label: from.name, title: from.name });
            nodesDataSet.add(nodes.get(from.id));
          }

          if (!nodes.has(to.id)) {
            nodes.set(to.id, { id: to.id, label: to.name, title: to.name });
            nodesDataSet.add(nodes.get(to.id));
          }

          edgesDataSet.add({ from: from.id, to: to.id, value, label: value.toString() });
        }
      });


      setGraphData({ nodes: nodesDataSet, edges: edgesDataSet });
    }
  }, [matrixInfo]);

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
              min: 7,
              max: 7,
              maxVisible: 55,
              drawThreshold: 5,
            },
          },
          interaction: {
            hover: false, // Disable hover effect on edges
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
          interaction: {
            hover: true, // Enable hover effect on nodes
          },
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
       physics: false,
        interaction: {
          physics: false,
          hover: true,
          tooltipDelay: 300,
          multiselect: true,
       },
      };

      const network = new Network(container, graphData, options);

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
  }, [graphData]);

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
              >{`${node.label} - ${node.title}`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GraphComponent;
