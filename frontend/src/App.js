// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MatrixList from './components/MatrixList';
import MatrixDetails from './components/MatrixDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MatrixList />} />
        <Route path="/matrix/:matrixName" element={<MatrixDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
