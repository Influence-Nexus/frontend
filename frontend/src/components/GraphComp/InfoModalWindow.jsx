import React, { useState } from 'react'
import { Modal } from "react-bootstrap";
import { cardcreds } from "../SoralSystem/cards";

export const InfoModalWindow = ({ selectedPlanet }) => {
    const [showPreviewWindow, setShowPreviewWindow] = useState(true); // Состояние для окна "Исследуйте граф"
    const [isClosing, setIsClosing] = useState(false); // Для работы анимации



    const handleClosePreviewWindow = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            setShowPreviewWindow(false);
        }, 700);
    };





    return (
        <Modal
            show={showPreviewWindow}
            centered
            animation={false}
            className={`modal-window ${isClosing ? "in" : "out"}`}
            dialogClassName="custom-modal"
            contentClassName="custom-modal-content"
        >
            <Modal.Body className="GraphPreviewModalBody">
                <Modal.Title id="graph-preview-title">Прежде чем начать игру, вы можете произвести предпросмотр графа, чтобы понять механику игры.</Modal.Title>
            </Modal.Body>
            <Modal.Footer className="GraphPreviewModalFooter">
                <button id="buttonNoGraphPreview"
                    style={{ color: cardcreds[selectedPlanet.name].color, borderColor: cardcreds[selectedPlanet.name].color }}


                    onClick={handleClosePreviewWindow}>
                    <p>Ok</p>
                </button>
            </Modal.Footer>
        </Modal>

    )
}
