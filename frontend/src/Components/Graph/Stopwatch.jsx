import React from 'react';
import { FaStopwatch, FaMedal } from 'react-icons/fa';
import { useCustomStates } from '../../CustomStates';

const Stopwatch = ({ planetColor }) => {
  const {
    currentTime,
    score,
    movesHistory,
    handleStart,
    handleStop,
    isRunning,
    isHoveredStart,
    setIsHoveredStart,
    isHoveredStop,
    setIsHoveredStop,
  } = useCustomStates();

  const formattedTime = `${String(Math.floor(currentTime / 60)).padStart(2, '0')}:${String(currentTime % 60).padStart(2, '0')}`;

  return (
    <div className="stopwatch-container">
      {/* Блок времени */}
      <div className="stopwatch-container-time">
        <h3>Time</h3>
        <p><FaStopwatch /> {formattedTime}</p>
      </div>

      {/* Блок счёта */}
      <div className="stopwatch-container-score">
        <h3>Score</h3>
        <p><FaMedal /> {score.toFixed(2)}</p>
      </div>

      {/* Блок ходов */}
      <div className="stopwatch-container-table">
        <h3>Vertices</h3>
        {movesHistory.length > 0 ? (
          <ul className="selected-list">
            {movesHistory.map((move) => (
              <li key={move.moveNumber}>
                <strong>Move {move.moveNumber}:</strong> {move.nodes.map(node => node?.id ?? 'N/A').join(', ')}
              </li>
            ))}
          </ul>
        ) : (
          <p>No moves made yet</p>
        )}
      </div>

      {/* Кнопки */}
      <div className="stopwatch-container-buttons">
        <button
          className="btn-start"
          style={{
            backgroundColor: isRunning ? "gray" : (isHoveredStart ? 'transparent' : planetColor),
            border: `1px solid ${isRunning ? "gray" : planetColor}`,
            color: isHoveredStart ? planetColor : "black",
            cursor: isRunning ? "not-allowed" : "pointer"
          }}
          onMouseEnter={() => setIsHoveredStart(true)}
          onMouseLeave={() => setIsHoveredStart(false)}
          onClick={handleStart}
          disabled={isRunning}
        >
          Start
        </button>

        <button
          className="btn-stop"
          style={{
            backgroundColor: isRunning ? (isHoveredStop ? 'transparent' : 'rgb(255, 105, 105)') : 'gray',
            border: `1px solid ${isRunning ? (isHoveredStop ? planetColor : "rgb(255, 105, 105)") : 'gray'}`,
            color: isHoveredStop ? planetColor : "black",
            cursor: isRunning ? "pointer" : "not-allowed"
          }}
          onMouseEnter={() => setIsHoveredStop(true)}
          onMouseLeave={() => setIsHoveredStop(false)}
          onClick={handleStop}
          disabled={!isRunning}
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default Stopwatch;
