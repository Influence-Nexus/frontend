import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './Components/Header/Header';
import StartPage from './Components/StartPage/StartPage';
import { useState } from 'react';
import { CustomStatesProvider } from './CustomStates';
import { GlobalAudioManager } from './Components/Audio';
import DynamicComponentLoader from './DynamicComponentLoader';

function App() {
  const [headerShow, setHeaderShow] = useState(true);

  return (
    <Router>
      <CustomStatesProvider>
        <Header headerShow={headerShow} />
        <Routes>
          <Route
            path="/"
            element={<StartPage setHeaderShow={setHeaderShow} />}
          />
          <Route
            path="/:lang/"
            element={<StartPage setHeaderShow={setHeaderShow} />}
          />
          <Route
            path="/:lang/challengecomponent"
            element={
              <DynamicComponentLoader
                componentBaseDir="AldafiraWelcome"
                componentName="ChallengeComponent"
                setHeaderShow={setHeaderShow}
              />
            }
          />
          <Route
            path="/:lang/solar"
            element={
              <DynamicComponentLoader
                componentPath="Solar/SolarSystem"
                setHeaderShow={setHeaderShow}
              />
            }
          />
          <Route
            path="/:lang/science/:uuid"
            element={
              <DynamicComponentLoader
                componentPath="Science/SciencePage"
                setHeaderShow={setHeaderShow}
              />
            }
          />
          <Route
            path="/:lang/matrix_uuid/:uuid"
            element={
              <DynamicComponentLoader
                componentPath="Graph/GraphMainLayout"
                setHeaderShow={setHeaderShow}
              />
            }
          />
          <Route
            path="/:lang/sign-up"
            element={
              <DynamicComponentLoader
                componentPath="UserCreds/SignUp"
                setHeaderShow={setHeaderShow}
              />
            }
          />
          <Route
            path="/:lang/sign-in"
            element={
              <DynamicComponentLoader
                componentPath="UserCreds/SignIn"
                setHeaderShow={setHeaderShow}
              />
            }
          />
          <Route
            path="/:lang/algorithm"
            element={
              <DynamicComponentLoader
                componentPath="Science/AlgoPage"
                setHeaderShow={setHeaderShow}
              />
            }
          />
          <Route
            path="/:lang/rules"
            element={
              <DynamicComponentLoader
                componentBaseDir="RulesPage"
                componentName="RulesPage"
                setHeaderShow={setHeaderShow}
              />
            }
          />
          <Route
            path="/:lang/coma-berenices"
            element={
              <DynamicComponentLoader
                componentPath="ComaBerenicesPage/ComaBerenicesPage"
                setHeaderShow={setHeaderShow}
              />
            }
          />
        </Routes>
        <GlobalAudioManager />
      </CustomStatesProvider>
    </Router>
  );
}

export default App;
