import CloseIcon from "@mui/icons-material/Cancel";
import { cards, cardcreds } from "./cards";
import { Link } from "react-router-dom";
import { Carousel, Button, Modal } from "react-bootstrap";
import "./styles.css"; // Import the CSS file for styling
import { useState } from "react";

export const PlanetCard = ({ selectedPlanet, setSelectedPlanet }) => {
  const [showReviewWindow, setShowReviewWindow] = useState(false); // Состояние для окна "Исследуйте граф"
  const [selectedCardIndex, setSelectedCardIndex] = useState(null); // Хранилище для индексов
  const [isClosing, setIsClosing] = useState(false); // Для работы анимации
  const [isZoomed, setIsZoomed] = useState(false); // State for zoom effect
  // const [picked, setPicked] = useState(null);
  // const [currentPage, setCurrentPage] = useState(1);
  // const cardsPerPage = 6;

  const handleCloseReviewWindow = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setShowReviewWindow(false);
    }, 700);
  };

  const handleOpenReviewWindow = (index) => {
    setIsZoomed(true); // Set zoom state
    setTimeout(() => {
      setShowReviewWindow(true);
      setSelectedCardIndex(index);
    }, 700); // Delay to allow zoom animation to complete
  };

  const handleZoomOut = () => {
    setIsZoomed(false);
    setIsClosing(false);
    setTimeout(() => {
      setSelectedCardIndex(null);
    }, 700);
  };

  const handleCardClick = (event) => {
    if (isZoomed) {
      event.stopPropagation(); // Prevent the click from propagating to the parent
    }
  };

  // const indexOfLastCard = currentPage * cardsPerPage;
  // const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  // const currentCards = cards[selectedPlanet.name].slice(
  //   indexOfFirstCard,
  //   indexOfLastCard
  // );
  const currentCards = cards[selectedPlanet.name];

  return (
    <div className="planet-cardcard text-white bg-dark mb-3">
      <div className="segment-domen">
        <div className="segment-domen-header">
          <div className="segment-domen-planet">
            <img
              className="planet-image"
              src={cardcreds[selectedPlanet.name].src}
            />
            <div>
              <h1
                className="planet-name"
                style={{
                  fontSize: "80px",
                  color: cardcreds[selectedPlanet.name].color,
                }}
              >
                {cardcreds[selectedPlanet.name].name}
              </h1>
              <h3>
                <span style={{ color: cardcreds[selectedPlanet.name].color }}>
                  Стратегия жизни:
                </span>{" "}
                {cardcreds[selectedPlanet.name].desc}
              </h3>
            </div>
          </div>
          <Link
            to="/"
            className="return-main"
            style={{
              color: cardcreds[selectedPlanet.name].color,
              borderColor: cardcreds[selectedPlanet.name].color,
            }}
          >
            Main
          </Link>
        </div>

        <div className="segment-cards">
          {currentCards.map((segment, index) => (
            <div
              key={segment.index}
              className={`card text-white bg-secondary mb-3 segment-card segment-card-${index} ${
                isZoomed && index === selectedCardIndex ? "zoomed" : "unzoomed"
              }`}
              onClick={
                isZoomed && index === selectedCardIndex
                  ? handleZoomOut
                  : () => {}
              }
            >
              <div className="card-header">
                <p>{segment.title}</p>
              </div>
              <div className="card-body" onClick={handleCardClick}>
                <img
                  width={isZoomed && index === selectedCardIndex ? "80%" : 160}
                  height={isZoomed && index === selectedCardIndex ? "310px" : 160}
                  src={segment.image}
                  alt={segment.title}
                />
                {isZoomed && index === selectedCardIndex && (
                  <div className="card-description">
                    <p>{segment.description}</p>
                  </div>
                )}
                <div className="text-center">
                  {isZoomed && index === selectedCardIndex ? (
                    <button
                      className="btn-CLOSE"
                      style={{
                        color: cardcreds[selectedPlanet.name].color,
                        borderColor: cardcreds[selectedPlanet.name].color,
                        backgroundColor: "transparent",
                        borderRadius: "10px",
                      }}
                      onClick={handleZoomOut}
                    >
                      Close
                    </button>
                  ) : (
                    <button
                      className="btn-CHECK"
                      style={{
                        color: cardcreds[selectedPlanet.name].color,
                        borderColor: cardcreds[selectedPlanet.name].color,
                      }}
                      onClick={() => handleOpenReviewWindow(index)} // Open modal on button click
                    >
                      pick
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Добавляем кнопку для возврата к виду солнечной системы */}
        <Button
          variant="secondary"
          onClick={() => setSelectedPlanet(null)}
          className="mb-3"
          size="sm"
          style={{
            width: "55px",
            position: "absolute",
            top: "90%",
            left: "95%",
          }}
        >
          <CloseIcon />
        </Button>
        {/* Окно "Исследуйте граф" */}
        <Modal
          show={showReviewWindow}
          centered
          animation={false}
          className={`modal-window ${isClosing ? "in" : "out"}`}
          dialogClassName="custom-modal"
          contentClassName="custom-modal-content"
        >
          <Modal.Body className="GraphReviewModalBody">
            <Modal.Title id="graph-preview-title">Graph Preview</Modal.Title>
          </Modal.Body>
          <Modal.Footer className="GraphReviewModalFooter">
            <Link
              id="buttonOkGraphReview"
              to={`/matrix/${selectedCardIndex + 1}`}
            >
              <p>Ok</p>
            </Link>
            <button id="buttonNoGraphReview" onClick={handleCloseReviewWindow}>
              <p>Next</p>
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};
