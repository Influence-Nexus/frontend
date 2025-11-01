import React from 'react';
import { useCustomStates } from '../../CustomStates';

export const InfoModalWindow = ({ planetColor }) => {
  const {
    showPreviewWindow,
    isClosing,
    handleClosePreviewWindow,
    setIsClosing,
  } = useCustomStates();

  const handleAnimationEnd = () => {
    if (isClosing) {
      setIsClosing(false);
    }
  };

  if (!showPreviewWindow && !isClosing) return null;

  return (
    <div className={`preview-main-div ${isClosing ? 'hidden' : ''}`}>
      <div
        className={`modal-wrapper ${isClosing ? 'slide-out' : 'slide-in'}`}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="preview-modal-window preview-custom-modal preview-custom-modal-content">
          <div className="GraphPreviewModalBody">
            <h2 id="graph-preview-title">
              Прежде чем начать игру, вы можете произвести предпросмотр графа,
              чтобы понять логику игры.
            </h2>
          </div>
          <div className="GraphPreviewModalFooter">
            <button
              id="buttonOkGraphPreview"
              style={{ color: planetColor, borderColor: planetColor }}
              onClick={handleClosePreviewWindow}
            >
              <p>Ok</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
