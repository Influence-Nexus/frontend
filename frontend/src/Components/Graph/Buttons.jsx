// src/Components/Graph/Buttons.jsx
import React, { useEffect, useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import KeyIcon from '@mui/icons-material/Key';
import { Link } from 'react-router-dom';

import { useCustomStates } from '../../CustomStates';
import { getScienceClicks, logScienceAttempt } from '../../clientServerHub';

const Buttons = ({ matrixUuid, planetColor, planetImg }) => {
  const {
    isRunning,
    selectedPlanet,
    selectedCardIndex,
    handleOpenModal,
    handleLoadCoordinates,
    handleResetCoordinates,
    handleSaveUserView,
    handleSaveDefaultView,
    applyCoordinates,
    setShowHistory,
  } = useCustomStates();

  // Science-клики
  const [scienceClicks, setScienceClicks] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await getScienceClicks(matrixUuid);
        if (res?.science_clicks != null) setScienceClicks(res.science_clicks);
      } catch (err) {
        console.error('Не удалось загрузить science_clicks:', err);
      }
    })();
  }, [matrixUuid]);

  const handleScienceClick = async () => {
    try {
      const res = await logScienceAttempt(matrixUuid);
      if (res?.science_clicks != null) setScienceClicks(res.science_clicks);
    } catch (err) {
      console.error('Ошибка при Science click:', err);
      alert(err.message);
    }
  };

  return (
    <div className="buttons-container">
      <ul className="buttons-group" role="tablist">
        {/* Details */}
        <li>
          <button
            id="details-button"
            className="game-button"
            onClick={() => handleOpenModal(selectedCardIndex)}
            disabled={selectedCardIndex == null}
          >
            <InfoIcon /> Details
          </button>
        </li>

        {/* Science */}
        <li>
          <Link
            to={`/science/${matrixUuid}`}
            state={{ selectedPlanet, selectedCardIndex, planetColor, planetImg }}
          >
            <button
              className="game-button"
              onClick={handleScienceClick}
              disabled={scienceClicks !== null && scienceClicks <= 0}
            >
              <p>Science</p>
              {scienceClicks !== null &&
                Array.from({ length: scienceClicks }, (_, i) => (
                  <KeyIcon key={i} sx={{ mr: 0.5 }} />
                ))}
            </button>
          </Link>
        </li>

        {/* Game */}
        <li>
          <button
            className="game-button"
            onClick={() => {
              setShowHistory(false);
              if (matrixUuid && applyCoordinates) {
                handleLoadCoordinates(matrixUuid, applyCoordinates);
              }
            }}
          >
            Game
          </button>
        </li>

        {/* Profile */}
        <li>
          <button
            className="game-button"
            disabled={isRunning}
            title={isRunning ? 'Not available during the game' : ''}
            onClick={() => setShowHistory(true)}
          >
            Profile
          </button>
        </li>

        {/* Save View */}
        <li>
          <button className="game-button" onClick={handleSaveUserView}>
            Save View
          </button>
        </li>

        {/* Reset */}
        <li>
          <button
            className="game-button"
            onClick={() => handleResetCoordinates(matrixUuid, applyCoordinates)}
            title="Сбросить граф к дефолтным настройкам"
          >
            Reset
          </button>
        </li>

        {/* Load Last View */}
        <li>
          <button
            className="game-button"
            onClick={() => handleLoadCoordinates(matrixUuid, applyCoordinates)}
            title="Загружает последний сохранённый вид графа"
          >
            Load Last View
          </button>
        </li>

        {/* Save Default */}
        <li>
          <button
            className="game-button"
            onClick={handleSaveDefaultView}
            title="Сохранить вид графа по умолчанию"
          >
            Save Graph (Default)
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Buttons;
