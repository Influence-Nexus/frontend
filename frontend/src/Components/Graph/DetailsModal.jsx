import React from 'react';
import { Modal } from 'react-bootstrap';
import CloseIcon from '@mui/icons-material/Cancel';

// Стили лежат в папке ModalWindowCards рядом с cards.js и ModalWindowCards.jsx

import "../Solar/ModalWindowCards/ModalWindowCards.css";     // переиспользуем стили из вашей модалки
import "../Solar/ModalWindowCards/mobileVersion.css";

export const DetailsModal = ({
  show,
  onHide,
  selectedCard,
  allNodes,
  planetColor
}) => {
  if (!selectedCard) return null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      dialogClassName="modal-dialog"
      contentClassName="modal-content-custom"
    >
      <Modal.Header className="modal-header-custom">
        <Modal.Title>
          <h2 style={{ color: planetColor }}>{selectedCard.title}</h2>
        </Modal.Title>
        <button className="close-cardList-modal-window" onClick={onHide}>
          <CloseIcon fontSize="large" style={{ color: planetColor }} />
        </button>
      </Modal.Header>

      <Modal.Body className="modal-body-custom">
        {/* Описание карточки */}
        <div className="card-description" style={{ padding: 10 }}>
          <p>{selectedCard.description}</p>
          <br />
          <p style={{ color: 'rgb(255, 218, 150)' }}>Источник:</p>
          <p>{selectedCard.paper}</p>
          <a
            className="card-desc-link"
            href={selectedCard.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ссылка на статью
          </a>
        </div>

        {/* Список вершин */}
        <div className="card-description" style={{ marginTop: 20 }}>
          <h4 style={{ color: planetColor }}>Все вершины:</h4>
          <ul style={{ maxHeight: 200, overflowY: 'auto', paddingLeft: 20 }}>
            {allNodes.map((node, idx) => (
              <li key={idx}>
                {node.label ?? node.id ?? JSON.stringify(node)}
              </li>
            ))}
          </ul>
        </div>
      </Modal.Body>
    </Modal>
  );
};