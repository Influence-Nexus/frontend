// MatrixDetails.js
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import GraphComponent from './GraphComp';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Graph.css'; // Import the CSS file for styling

const MatrixDetails = () => {
  const { matrix_id } = useParams();
  const [matrixInfo, setMatrixInfo] = useState({});

  useEffect(() => {
    // Fetch detailed information about the selected matrix
    fetch(`http://localhost:5000/matrix/${matrix_id}`)
      .then(response => response.json())
      .then(data => setMatrixInfo(data))
      .catch(error => console.error('Error fetching matrix details:', error));
  }, [matrix_id]);

  return (
    <div className="container mt-4">
      {matrixInfo.matrix_info && (
        <div>
          <div className='local-header'>
            <div>
              <h1 className="display-4">{matrixInfo.matrix_info.matrix_name}</h1>
              <p className="lead">Description: {matrixInfo.matrix_info.description}</p>
            </div>
          </div>

          <div>
            {matrixInfo.edges && (
              <GraphComponent matrixInfo={matrixInfo} />
            )}
          </div>
        </div>
      )}

      {!matrixInfo.matrix_info && <p>Loading...</p>}
    </div>
  );
};

export default MatrixDetails;
