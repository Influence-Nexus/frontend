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
import CatAnimation from './components/GraphComp/CatAnimation'

import { SciencePage } from './components/Science/SciencePage';
import { AlgoPage } from './components/Science/AlgoPAge/AlgoPage';
import { RegistrationPage } from './components/UserCreds/RegistrationPage';
import { LoginPage } from './components/UserCreds/LoginPage';


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
        <Route path="/algorithm" element={<AlgoPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/test_animation" element={<CatAnimation />} />
      </Routes>
    </Router>
  );
};

export default App;
