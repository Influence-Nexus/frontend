import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './Components/Header/Header';
import StartPage from './Components/StartPage/StartPage';
import { useState } from 'react';
import { CustomStatesProvider } from './CustomStates';
import { GlobalAudioManager } from './Components/Audio';
import DynamicComponentLoader from './DynamicComponentLoader';
import StaticCanvasWrapper from './StaticCanvasWrapper';

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
            element={<StaticCanvasWrapper setHeaderShow={setHeaderShow} />}
          />
          <Route
            path="/:lang/science/:uuid"
            element={
              <DynamicComponentLoader
                componentBaseDir="Science"
                componentName="SciencePage"
                setHeaderShow={setHeaderShow}
              />
            }
          />
          <Route
            path="/:lang/matrix_uuid/:uuid"
            element={
              <DynamicComponentLoader
                componentBaseDir="Graph"
                componentName="GraphMainLayout"
                setHeaderShow={setHeaderShow}
              />
            }
          />
          <Route
            path="/:lang/sign-up"
            element={
              <DynamicComponentLoader
                componentBaseDir="UserCreds"
                componentName="SignUp"
                setHeaderShow={setHeaderShow}
              />
            }
          />
          <Route
            path="/:lang/sign-in"
            element={
              <DynamicComponentLoader
                componentBaseDir="UserCreds"
                componentName="SignIn"
                setHeaderShow={setHeaderShow}
              />
            }
          />
          <Route
            path="/:lang/algorithm"
            element={
              <DynamicComponentLoader
                componentBaseDir="Science"
                componentName="AlgoPage"
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
                componentBaseDir="ComaBerenicesPage"
                componentName="ComaBerenicesPage"
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
