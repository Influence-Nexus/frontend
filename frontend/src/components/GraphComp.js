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
            roundness: 0.25, // Adjust the roundness as needed
          },
          arrows: 'to',
          font: {
            align: 'top',
            strokeWidth: 0.001,
            strokeColor: '#ffffff',
          },
        },
        physics: {
          repulsion: {
            centralGravity: 1,
            springLength: 300,
            springConstant: 0.001,
          },
        },
        nodes: {
          shape: 'circle',
          size: 40,
          interaction: {
            hover: true,
          },
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
