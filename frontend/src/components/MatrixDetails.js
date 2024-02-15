// MatrixDetails.js
import React, { useState, useEffect } from 'react';
import {Link, useParams } from 'react-router-dom';
import GraphComponent from './GraphComp'; // Предполагается, что GraphComponent правильно настроен
import 'bootstrap/dist/css/bootstrap.min.css'; // Подключаем файл стилей Bootstrap

const MatrixDetails = () => {
  const { matrixName } = useParams();
  const [matrixInfo, setMatrixInfo] = useState({});

  useEffect(() => {
    // Fetch detailed information about the selected matrix
    fetch(`http://91.108.240.55:5000/matrix/${matrixName}`)
      .then(response => response.json())
      .then(data => setMatrixInfo(data))
      .catch(error => console.error('Error fetching matrix details:', error));
  }, [matrixName]);

  return (
<div className="container mt-4">
      <h1 className="display-4">{matrixInfo.matrix_name}</h1>
      <p className="lead">Description: {matrixInfo.description}</p>

      <Link to={`/`} className="btn btn-primary mt-3">
        Домой
      </Link>
      
      <div>
        {matrixInfo.edges && (
          <GraphComponent matrixInfo={matrixInfo} />
        )}
      </div>
    </div>
  );
};

export default MatrixDetails;
