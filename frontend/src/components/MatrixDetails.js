// MatrixDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GraphComponent from './GraphComp'; // Предполагается, что GraphComponent правильно настроен

const MatrixDetails = () => {
  const { matrixName } = useParams();
  const [matrixInfo, setMatrixInfo] = useState({});

  useEffect(() => {
    // Fetch detailed information about the selected matrix
    fetch(`http://147.45.68.90:5000/matrix/${matrixName}`)
      .then(response => response.json())
      .then(data => setMatrixInfo(data))
      .catch(error => console.error('Error fetching matrix details:', error));
  }, [matrixName]);

  return (
    <div>
      <h1>{matrixInfo.matrix_name}</h1>
      <p>Description: {matrixInfo.description}</p>
      
      Display graph using GraphComponent
      {matrixInfo.edges && (
        <GraphComponent matrixInfo={matrixInfo} />
      )}
    </div>
  );
};

export default MatrixDetails;
