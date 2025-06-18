import React, { useEffect, useRef } from 'react';
import { useCustomStates } from '../../CustomStates';

export const GameOverModalWindow = ({ planetColor, score }) => {
  const {
    isClosing,
    setIsClosing,
    showGameOverModal,
    setShowGameOverModal,
    setIsRunning,
    isRunning,
    maxTime,
    currentTime,
    handleStop,
    gameOverSoundRef,
    backgroundMusicRef,
  } = useCustomStates();

  const hasTriggeredGameOver = useRef(false);

  useEffect(() => {
    if (showGameOverModal) {
      backgroundMusicRef.current?.pause();

      gameOverSoundRef.current
        ?.play()
        .catch((err) =>
          console.warn('gameOverSound play failed:', err.message)
        );
    }
  }, [showGameOverModal, gameOverSoundRef]);

  useEffect(() => {
    if (
      currentTime >= maxTime &&
      isRunning &&
      !showGameOverModal &&
      !hasTriggeredGameOver.current
    ) {
      hasTriggeredGameOver.current = true;
      setIsRunning(false);
      setShowGameOverModal(true);
      handleStop();
    }
  }, [
    currentTime,
    maxTime,
    isRunning,
    showGameOverModal,
    setIsRunning,
    setShowGameOverModal,
    handleStop,
  ]);

  useEffect(() => {
    if (!showGameOverModal && !isClosing) {
      hasTriggeredGameOver.current = false;
    }
  }, [showGameOverModal, isClosing]);

  const handleAnimationEnd = () => {
    if (isClosing) {
      setIsClosing(false);
      setShowGameOverModal(false);

      backgroundMusicRef.current
        ?.play()
        .catch((err) =>
          console.warn('backgroundMusic play failed:', err.message)
        );
    }
  };

  if (!showGameOverModal && !isClosing) return null;

  return (
    <div className={`game-over-main-div ${isClosing ? 'hidden' : ''}`}>
      <div
        className={`game-over-modal-wrapper ${isClosing ? 'slide-out' : 'slide-in'}`}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="game-over-modal-window game-over-modal-content">
          <div className="GameOverModalBody">
            <h2 id="game-over-title">Game Over</h2>
          </div>
          <div className="GameOverModalBody">
            {score >= 100 ? (
              <>
                <h3
                  style={{
                    color: '#FFD700',
                    fontWeight: 'bold',
                    marginBottom: '10px',
                  }}
                >
                  Идеальное прохождение! 🌟
                </h3>
                <h3>Your Score: {score.toFixed(2)}</h3>
              </>
            ) : (
              <h3>Your Score: {score.toFixed(2)}</h3>
            )}
          </div>
          <div className="GameOverModalFooter">
            <button
              id="game-over-ok-button"
              onClick={() => setIsClosing(true)}
              className="game-over-button"
              style={{
                color: planetColor,
                border: `3px solid ${planetColor}`,
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
