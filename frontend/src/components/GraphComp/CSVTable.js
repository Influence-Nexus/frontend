// CSVTable.js
import React from 'react';
import { Table } from 'react-bootstrap';

const CSVTable = ({ matrixInfo }) => {
  return (
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
  );
};

export default CSVTable;
