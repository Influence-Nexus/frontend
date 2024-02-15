import React from 'react';

const SelectedNodesList = ({ selectedNodes }) => {
  return (
    <div className="selected-nodes-list">
      <h2>Selected Nodes</h2>
      <ul>
        {selectedNodes.map((nodeId, index) => (
          <li key={index}>{`Node ID: ${nodeId}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default SelectedNodesList;
