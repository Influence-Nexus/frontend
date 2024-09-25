import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MatrixList from './components/Matrices/MatrixList';
import MatrixDetails from './components/Matrices/MatrixDetails';
import Graph from './components/GraphComp/Graph';
import Header from './components/Header/Header';
import RulesPage from './components/UsersPages/RulesPage';
import MainContent from './components/MainContent/MainContent';
import SolarSystem from './components/SoralSystem/SolarSystem';
import SpaceshipView from './components/SpaceShip/SpaceshipView';
import { SciencePage } from './components/Science/Page/SciencePage';
import { About } from './components/AboutPage/About';


const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path='/about' element={<About />} />
        <Route path="/matrix/:matrix_id" element={<MatrixDetails />} />
        <Route path="/model" element={<Graph />} />
        <Route path="/cabine" element={<SpaceshipView />} />
        <Route path="/solar" element={<SolarSystem />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="/science" element={<SciencePage />} />
      </Routes>
    </Router>
  );
};

export default App;
