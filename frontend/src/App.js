import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MatrixList from './components/MatrixList';
import MatrixDetails from './components/MatrixDetails';
import Graph from './components/Graph';
import Header from './components/Header';
import RulesPage from './components/RulesPage';
import MainContent from './components/MainContent';
import SolarSystem from './components/SolarSystem';
import SpaceshipView from './components/SpaceshipView';


const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/matrix/:matrix_id" element={<MatrixDetails />} />
        <Route path="/model" element={<Graph />} />
        <Route path="/cabine" element={<SpaceshipView />} />
        <Route path="/solar" element={<SolarSystem />} />
        <Route path="/rules" element={<RulesPage />} />
      </Routes>
    </Router>
  );
};

export default App;
