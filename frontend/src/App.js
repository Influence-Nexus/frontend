import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MatrixList from './components/MatrixList';
import MatrixDetails from './components/MatrixDetails';
import Graph from './components/Graph';
import Header from './components/Header';
import RulesPage from './components/RulesPage';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MatrixList />} />
        <Route path="/matrix/:matrix_id" element={<MatrixDetails />} />
        <Route path="/model" element={<Graph />} />
        <Route path="/rules" element={<RulesPage />} />
      </Routes>
    </Router>
  );
};

export default App;
