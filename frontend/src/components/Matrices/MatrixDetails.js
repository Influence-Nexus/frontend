import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { FaCog, FaInfoCircle } from "react-icons/fa"; // Импортируем иконки FaCog и FaInfoCircle из react-icons/fa
import KeyIcon from "@mui/icons-material/Key";
import GraphComponent from "../GraphComp/GraphComp";
import "bootstrap/dist/css/bootstrap.min.css";
import "../GraphComp/Graph.css"; // Импортируем файл CSS для стилизации
import { cardcreds, cards } from "../SoralSystem/cards";




const MatrixDetails = () => {
  const { matrix_id } = useParams();
  const [matrixInfo, setMatrixInfo] = useState({});
  // const [showModal, setShowModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#0b001a"); // Состояние для цвета фона
  const [nodeColor, setNodeColor] = useState("#0b001a"); // Состояние для цвета узлов
  const [positiveEdgeColor, setPositiveEdgeColor] = useState("#00FF00"); // Состояние для цвета положительных ребер
  const [negativeEdgeColor, setNegativeEdgeColor] = useState("#FF0000"); // Состояние для цвета отрицательных ребер
  const [physicsEnabled, setPhysicsEnabled] = useState(false);
  const [nodeSize, setNodeSize] = useState(40);
  const [edgeRoundness, setEdgeRoundness] = useState(0.15); // Степерь искривления рёбер

  // const handleOpenModal = () => setShowModal(true);
  // const handleCloseModal = () => setShowModal(false);

  const handleOpenSettingsModal = () => setShowSettingsModal(true);
  const handleCloseSettingsModal = () => setShowSettingsModal(false);

  const handleBackgroundColorChange = (color) => setBackgroundColor(color); // Функция для обновления состояния цвета фона
  const handleNodeColorChange = (color) => setNodeColor(color); // Функция для обновления состояния цвета узлов
  const handlePositiveEdgeColorChange = (color) => setPositiveEdgeColor(color); // Функция для обновления состояния цвета положительных ребер
  const handleNegativeEdgeColorChange = (color) => setNegativeEdgeColor(color); // Функция для обновления состояния цвета отрицательных ребер
  const handlePhysicsToggle = () => setPhysicsEnabled(!physicsEnabled);
  const handleNodeSizeChange = (size) => setNodeSize(size);
  const handleEdgeRoundnessChange = (roundness) => setEdgeRoundness(roundness);




  const location = useLocation();
  const selectedPlanet = location.state?.selectedPlanet;
  const selectedCardIndex = location.state?.selectedCardIndex
  // console.log("Planet: ", selectedPlanet)

  useEffect(() => {
    // Получение подробной информации о выбранной матрице
    fetch(`http://localhost:5000/matrix/${matrix_id}`)
      .then((response) => response.json())
      .then((data) => setMatrixInfo(data))
      .catch((error) =>
        console.error("Ошибка при получении информации о матрице:", error)
      );
  }, [matrix_id]);
  const matrix_info = matrixInfo.matrix_info;

console.log('matrix_info', matrixInfo)

  return (
    <div className="container mt-4">
      <h1
        style={{
          color: "white",
          textAlign: "center",
          font: "400 72px Moon Dance, cursive",
        }}
      >
        Challenge your mind!
      </h1>
      {matrix_info && (
        <div>
          <div className="Graph-Planet-Card-Info">
            <img
              className="planet-image"
              src={`../${cardcreds[selectedPlanet.name].src}`}
            />
            <h1 className="matrix-name" style={{ color: cardcreds[selectedPlanet.name].color }}>{cards[selectedPlanet.name][selectedCardIndex].title}</h1>
          </div>
          <div className="local-header" style={{ zIndex: 12 }}>
            <div>
              {/* <Button
                className="game-button"
                variant="primary"
                onClick={handleOpenModal}
                style={{ zIndex: 1000 }}
              >
                <FaInfoCircle /> Preview
            
              </Button>

              <Button
                className="game-button"
              // id="pills-graph-tab"
              // data-bs-toggle="pill"
              // data-bs-target="#pills-graph"
              // type="button"
              // role="tab"
              // aria-controls="pills-graph"
              // aria-selected="true"
              >
                {" "}
                <Link style={{ color: "white" }} to={"/science"}>
                  Science
                </Link>
                <KeyIcon key={0} />
                <KeyIcon key={1} />
            
              </Button> */}
            </div>
          </div>
          <div>
            {matrixInfo.edges && (
              <GraphComponent
                matrixInfo={matrixInfo}
                backgroundColor={backgroundColor} // Передача цвета фона в GraphComponent
                nodeColor={nodeColor} // Передача цвета узлов в GraphComponent
                positiveEdgeColor={positiveEdgeColor} // Передача цвета положительных ребер в GraphComponent
                negativeEdgeColor={negativeEdgeColor} // Передача цвета отрицательных ребер в GraphComponent
                physicsEnabled={physicsEnabled}
                nodeSize={nodeSize}
                edgeRoundness={edgeRoundness}
                selectedPlanet={selectedPlanet}
                selectedCardIndex={selectedCardIndex}
                style={{ zIndex: -1 }}
              />
            )}
          </div>

          {/* Конец окна "Исследуйте граф" чтоб не искать границы хД */}
          <Modal show={showSettingsModal} onHide={handleCloseSettingsModal}>
            <Modal.Header closeButton>
              <Modal.Title>Cognition</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="backgroundColor">
                  <Form.Label>Цвет фона:</Form.Label>
                  <Form.Control
                    type="color"
                    value={backgroundColor}
                    onChange={(e) =>
                      handleBackgroundColorChange(e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group controlId="nodeColor">
                  <Form.Label>Цвет узлов:</Form.Label>
                  <Form.Control
                    type="color"
                    value={nodeColor}
                    onChange={(e) => handleNodeColorChange(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="positiveEdgeColor">
                  <Form.Label>Цвет положительных ребер:</Form.Label>
                  <Form.Control
                    type="color"
                    value={positiveEdgeColor}
                    onChange={(e) =>
                      handlePositiveEdgeColorChange(e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group controlId="negativeEdgeColor">
                  <Form.Label>Цвет отрицательных ребер:</Form.Label>
                  <Form.Control
                    type="color"
                    value={negativeEdgeColor}
                    onChange={(e) =>
                      handleNegativeEdgeColorChange(e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group controlId="physicsEnabled">
                  <Form.Check
                    type="checkbox"
                    label="Включить физику"
                    checked={physicsEnabled}
                    onChange={handlePhysicsToggle}
                  />
                </Form.Group>

                <Form.Group controlId="nodeSize">
                  <Form.Label>Размер узлов:</Form.Label>
                  <Form.Control
                    type="number"
                    value={nodeSize}
                    onChange={(e) =>
                      handleNodeSizeChange(Number(e.target.value))
                    }
                  />
                </Form.Group>

                <Form.Group controlId="edgeRoundness">
                  <Form.Label>Коэффициент окружности дуг:</Form.Label>
                  <Form.Control
                    type="number"
                    value={edgeRoundness}
                    onChange={(e) =>
                      handleEdgeRoundnessChange(Number(e.target.value))
                    }
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseSettingsModal}>
                Закрыть
              </Button>
              <Button variant="primary" onClick={handleCloseSettingsModal}>
                Сохранить изменения
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}

      {!matrixInfo && <p>Загрузка...</p>}
    </div>
  );
};

export default MatrixDetails;
