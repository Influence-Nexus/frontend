import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MatrixList.css';

const MatrixList = () => {
  const [matrices, setMatrices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('matrix_name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [loading, setLoading] = useState(true);

  const [appliedSortBy, setAppliedSortBy] = useState('matrix_name');
  const [appliedSortDirection, setAppliedSortDirection] = useState('asc');

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

  const applySort = () => {
    setAppliedSortBy(sortBy);
    setAppliedSortDirection(sortDirection);
  };

  const filteredMatrices = matrices.filter(matrix =>
    matrix.matrix_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedMatrices = [...filteredMatrices].sort((a, b) => {
    if (appliedSortBy === 'matrix_name') {
      return appliedSortDirection === 'asc' ? a.matrix_name.localeCompare(b.matrix_name) : b.matrix_name.localeCompare(a.matrix_name);
    } else {
      return appliedSortDirection === 'asc' ? a[appliedSortBy] - b[appliedSortBy] : b[appliedSortBy] - a[appliedSortBy];
    }
  });

  const truncateDescription = (description, maxLength) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + '...';
    } else {
      return description;
    }
  };

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
      <h1 className="display-4">Model List</h1>

      <div className="row mb-3">
        <div className="col">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by matrix name"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className="input-group-append">
              <span className="input-group-text"><i className="fas fa-search"></i></span>
            </div>
            </div>
        </div>
        <div className="col">
          <div className="input-group">
            <select className="form-control" value={sortBy} onChange={handleSortChange}>
              <option value="matrix_name">Matrix Name</option>
              <option value="node_count">Node Count</option>
              <option value="edge_count">Edge Count</option>
            </select>
          </div>
        </div>
        <div className="input-group-append col">
              <button className="btn btn-primary" type="button" onClick={applySort}><i className="fas fa-sort"></i> Apply Sort</button>
        </div>
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
                    <img src={`data:image/jpeg;base64,${matrix.image}`} className="card-img-top" alt={matrix.matrix_name} />
                    <div className="card-body">
                      <h2 className="card-title">{matrix.matrix_name}</h2>
                      <p className="card-text">{truncateDescription(matrix.description, 251)}</p>
                      <p className="card-text">
                        <i className="fas fa-sitemap mr-1"></i> Nodes: {matrix.node_count}
                      </p>
                      <p className="card-text">
                        <i className="fas fa-code-branch mr-1"></i> Edges: {matrix.edge_count}
                      </p>
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
