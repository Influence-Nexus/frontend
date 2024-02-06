import React, { useEffect, useState } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';
import './Graph.css'; // Import the CSS file for styling

const Graph = () => {
  const [graphData, setGraphData] = useState(null);
  const [highlightedNode, setHighlightedNode] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const matrixText = event.target.result;
      const matrixRows = matrixText.trim().split('\n');
      const nodeNames = matrixRows[0].split('\t').slice(1);
      const edges = matrixRows.slice(1).map((row, index) => {
        const values = row.split('\t');
        const sourceNode = nodeNames[index];
        const sourceLabel = values[0]; // Подпись вершины
        return values.slice(1).map((value, subIndex) => {
          const toNode = nodeNames[subIndex];
          const numericValue = parseFloat(value);
          // Убираем связи с нулевыми значениями
          return numericValue !== 0 ? { from: sourceNode, to: toNode, value: numericValue, label: sourceLabel } : null;
        }).filter(Boolean);
      }).flat();

      setGraphData({ nodeNames, edges });
    };

    reader.readAsText(file);
  };

  useEffect(() => {
    if (graphData) {
      const { nodeNames, edges } = graphData;

      const nodesDataSet = new DataSet(nodeNames.map((nodeName, index) => ({ id: nodeName, label: `${index + 1}`, title: nodeName })));
      const edgesDataSet = new DataSet(edges.map((edge, index) => ({
        ...edge,
        id: `edge${index}`,
        label: edge.value.toString(),
        color: { color: 'black', inherit: false }, 
        smooth: {
          type: 'cubicBezier',
          roundness: 0.25, // Adjust the roundness as needed
        },
        arrows: 'to',
        font: {
          align: 'top',
          strokeWidth: 0.001,
          strokeColor: '#ffffff',
        },
      })));

      const container = document.getElementById('graph-container');

      const data = { nodes: nodesDataSet, edges: edgesDataSet };
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
            springLength: 2000, // Увеличиваем длину пружины
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
        interaction: {
          hover: true,
          tooltipDelay: 300,
          multiselect: true,
       },
      };
      const network = new Network(container, data, options);
    

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
        <input type="file" accept=".txt" onChange={handleFileChange} />
        <div id="graph-container" style={{ height: '400px' }}></div>
      </div>
      {graphData && (
        <div className="node-list-container">
          <h2>Node List</h2>
          <ul className="node-list">
            {graphData.nodeNames.map((nodeName, index) => (
              <li
                key={index}
                className={highlightedNode === nodeName ? 'highlighted' : ''}
                onMouseEnter={() => setHighlightedNode(nodeName)}
                onMouseLeave={() => setHighlightedNode(null)}
              >{`${index + 1} - ${nodeName}`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Graph;
