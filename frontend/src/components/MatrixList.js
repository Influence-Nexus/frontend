import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MatrixList.css';

const MatrixList = () => {
  const [matrices, setMatrices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('matrix_name');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating an asynchronous fetch
    const fetchData = async () => {
      try {
        // Simulating a delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 500));

        // Fetch matrices from the Flask server
        const response = await fetch('http://localhost:5000/matrices');
        const data = await response.json();

        console.log('API response:', data);
        setMatrices(data.matrices);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching matrices:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const filteredMatrices = matrices.filter(matrix =>
    matrix.matrix_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedMatrices = [...filteredMatrices].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return -1;
    if (a[sortBy] > b[sortBy]) return 1;
    return 0;
  });

  const renderPlaceholder = () => (
    <div className="col-md-4 mb-4">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title placeholder-glow">
            <span className="placeholder col-6"></span>
          </h2>
          <p className="card-text placeholder-glow">
            <span className="placeholder col-7"></span>
            <span className="placeholder col-4"></span>
            <span className="placeholder col-4"></span>
            <span className="placeholder col-6"></span>
            <span className="placeholder col-8"></span>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <h1 className="display-4">Models List</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by matrix name"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="mb-3">
        <label className="mr-2">Sort by:</label>
        <select className="form-control" value={sortBy} onChange={handleSortChange}>
          <option value="matrix_name">Matrix Name</option>
          <option value="node_count">Node Count</option>
          <option value="edge_count">Edge Count</option>
        </select>
      </div>

      <div className="row">
        {loading ? (
          // Bootstrap placeholder while loading
          renderPlaceholder()
        ) : (
          // Actual content when matrices are loaded
          sortedMatrices.length > 0 ? (
            sortedMatrices.map(matrix => (
              <div key={matrix.matrix_id} className="col-md-4 mb-4">
                <Link to={`/matrix/${matrix.matrix_id}`} className="text-decoration-none text-dark">
                  <div className="card card-hover">
                    <div className="card-body">
                      <h2 className="card-title">{matrix.matrix_name}</h2>
                      <p className="card-text">{matrix.description}</p>
                      <p className="card-text">Nodes: {matrix.node_count}</p>
                      <p className="card-text">Edges: {matrix.edge_count}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>No matching matrices found.</p>
          )
        )}
      </div>
    </div>
  );
};

export default MatrixList;
