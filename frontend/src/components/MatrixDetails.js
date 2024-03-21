import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaCog, FaInfoCircle } from 'react-icons/fa'; // Импортируем иконки FaCog и FaInfoCircle из react-icons/fa
import GraphComponent from './GraphComp';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Graph.css'; // Импортируем файл CSS для стилизации

const MatrixDetails = () => {
  const { matrix_id } = useParams();
  const [matrixInfo, setMatrixInfo] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF'); // Состояние для цвета фона
  const [nodeColor, setNodeColor] = useState('#FF5733'); // Состояние для цвета узлов
  const [positiveEdgeColor, setPositiveEdgeColor] = useState('#00FF00'); // Состояние для цвета положительных ребер
  const [negativeEdgeColor, setNegativeEdgeColor] = useState('#FF0000'); // Состояние для цвета отрицательных ребер
  const [physicsEnabled, setPhysicsEnabled] = useState(false);
  const [nodeSize, setNodeSize] = useState(40);
  const [edgeRoundness, setEdgeRoundness] = useState(0.1);


  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleOpenSettingsModal = () => setShowSettingsModal(true);
  const handleCloseSettingsModal = () => setShowSettingsModal(false);

  const handleBackgroundColorChange = (color) => setBackgroundColor(color); // Функция для обновления состояния цвета фона
  const handleNodeColorChange = (color) => setNodeColor(color); // Функция для обновления состояния цвета узлов
  const handlePositiveEdgeColorChange = (color) => setPositiveEdgeColor(color); // Функция для обновления состояния цвета положительных ребер
  const handleNegativeEdgeColorChange = (color) => setNegativeEdgeColor(color); // Функция для обновления состояния цвета отрицательных ребер
  const handlePhysicsToggle = () => setPhysicsEnabled(!physicsEnabled);
  const handleNodeSizeChange = (size) => setNodeSize(size);
  const handleEdgeRoundnessChange = (roundness) => setEdgeRoundness(roundness);


  useEffect(() => {
    // Получение подробной информации о выбранной матрице
    fetch(`http://localhost:5000/matrix/${matrix_id}`)
      .then(response => response.json())
      .then(data => setMatrixInfo(data))
      .catch(error => console.error('Ошибка при получении информации о матрице:', error));
  }, [matrix_id]);

  return (
    <div className="container mt-4">
      {matrixInfo.matrix_info && (
        <div>
          <div className='local-header' style={{ zIndex: 12 }}>
            <div>
              <h1 className="display-6">{matrixInfo.matrix_info.matrix_name}</h1>

              <Button variant="primary" onClick={handleOpenModal} style={{ zIndex: 1000 }}>
                <FaInfoCircle /> Показать описание {/* Иконка FaInfoCircle внутри кнопки */}
              </Button>

              <Button variant="success" onClick={handleOpenSettingsModal} style={{ marginLeft: '10px' }}>
                <FaCog /> {/* Иконка FaCog внутри кнопки */}
                Настройки графа
              </Button>
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
                style={{ zIndex: -1 }}
              />
            )}
          </div>

          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>{matrixInfo.matrix_info.matrix_name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{matrixInfo.matrix_info.description}</Modal.Body>
          </Modal>

          <Modal show={showSettingsModal} onHide={handleCloseSettingsModal}>
            <Modal.Header closeButton>
              <Modal.Title>Настройки графа</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="backgroundColor">
                  <Form.Label>Цвет фона:</Form.Label>
                  <Form.Control type="color" value={backgroundColor} onChange={(e) => handleBackgroundColorChange(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="nodeColor">
                  <Form.Label>Цвет узлов:</Form.Label>
                  <Form.Control type="color" value={nodeColor} onChange={(e) => handleNodeColorChange(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="positiveEdgeColor">
                  <Form.Label>Цвет положительных ребер:</Form.Label>
                  <Form.Control type="color" value={positiveEdgeColor} onChange={(e) => handlePositiveEdgeColorChange(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="negativeEdgeColor">
                  <Form.Label>Цвет отрицательных ребер:</Form.Label>
                  <Form.Control type="color" value={negativeEdgeColor} onChange={(e) => handleNegativeEdgeColorChange(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="physicsEnabled">
                  <Form.Check type="checkbox" label="Включить физику" checked={physicsEnabled} onChange={handlePhysicsToggle} />
                </Form.Group>

                <Form.Group controlId="nodeSize">
                  <Form.Label>Размер узлов:</Form.Label>
                  <Form.Control type="number" value={nodeSize} onChange={(e) => handleNodeSizeChange(Number(e.target.value))} />
                </Form.Group>

                <Form.Group controlId="edgeRoundness">
                  <Form.Label>Коэффициент окружности дуг:</Form.Label>
                  <Form.Control type="number" value={edgeRoundness} onChange={(e) => handleEdgeRoundnessChange(Number(e.target.value))} />
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

      {!matrixInfo.matrix_info && <p>Загрузка...</p>}
    </div>
  );
};

export default MatrixDetails;
