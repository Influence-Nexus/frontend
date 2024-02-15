// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MatrixList from './components/MatrixList';
import MatrixDetails from './components/MatrixDetails';
import Graph from './components/Graph';
import Header from './components/Header';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MatrixList />} />
        <Route path="/matrix/:matrixName" element={<MatrixDetails />} />
        <Route path="/model" element={<Graph />} />
      </Routes>
    </Router>
  );
};

export default App;
