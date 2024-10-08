import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MatrixList from './components/Matrices/MatrixList';
import MatrixDetails from './components/Matrices/MatrixDetails';
import Graph from './components/GraphComp/Graph';
import Header from './components/Header/Header';
import RulesPage from './components/UsersPages/RulesPage';
import SolarSystem from './components/SoralSystem/SolarSystem';
import SpaceshipView from './components/SpaceShip/SpaceshipView';
import ChallengeComponent from './components/AlDafiraWelcome/ChallengeComponent'
import CodeChallenge from './components/ChallengeYour/CodeChallenge';

import { SciencePage } from './components/Science/Page/SciencePage';


const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<CodeChallenge />} />
        <Route path="/matrix/:matrix_id" element={<MatrixDetails />} />
        <Route path="/matrices" element={<MatrixList />} />
        <Route path="/model" element={<Graph />} />
        <Route path="/cabine" element={<SpaceshipView />} />
        <Route path="/solar" element={<SolarSystem />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="/science" element={<SciencePage />} />
        <Route path="/ChallengeComponent" element={<ChallengeComponent />} />
      </Routes>
    </Router>
  );
};

export default App;
