// HistoryTable.js
import React from 'react';

const HistoryTable = ({ stopwatchHistory }) => {
  return (
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
  );
};

export default HistoryTable;
