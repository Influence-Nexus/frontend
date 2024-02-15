// MatrixList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MatrixList.css'; // Import the CSS file for styling

const MatrixList = () => {
  const [matrices, setMatrices] = useState([]);

  useEffect(() => {
    // Fetch matrices from the Flask server
    fetch('http://localhost:5000/matrices')
      .then(response => response.json())
      .then(data => {
        console.log('API response:', data); // Log the response
        setMatrices(data.matrices);
      })
      .catch(error => console.error('Error fetching matrices:', error));
  }, []);
  
  

  return (
    <div className="container mt-4">
      <h1 className="display-4">Matrix List</h1>
      <div className="row">
        {matrices ? (
          matrices.map(matrix => (
            <div key={matrix} className="col-md-4 mb-4">
              <Link to={`/matrix/${matrix}`} className="text-decoration-none text-dark">
                <div className="card">
                  <div className="card-body">
                    <h2 className="card-title">{matrix}</h2>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );

  
};

export default MatrixList;
