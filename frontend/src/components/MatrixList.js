// MatrixList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MatrixList.css'; // Import the CSS file for styling

const MatrixList = () => {
  const [matrices, setMatrices] = useState([]);

  useEffect(() => {
    // Fetch matrices from the Flask server
    fetch('http://147.45.68.90:5000/matrices')
      .then(response => response.json())
      .then(data => {
        console.log('API response:', data); // Log the response
        setMatrices(data.matrices);
      })
      .catch(error => console.error('Error fetching matrices:', error));
  }, []);
  
  

  return (
    <div className="matrix-list-container">
      <h1>Matrix List</h1>
      <div className="matrix-cards">
        {matrices ? (
          matrices.map(matrix => (
            <Link key={matrix} to={`/matrix/${matrix}`}>
              <div className="matrix-card">
                <h2>{matrix}</h2>
              </div>
            </Link>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
  
};

export default MatrixList;
