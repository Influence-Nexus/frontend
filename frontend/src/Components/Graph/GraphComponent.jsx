import { useEffect, useState } from 'react';
import { GraphCanvasRender } from './GraphCanvasRender';
import Stopwatch from './Stopwatch';
import VerticalProgressBar from './VerticalProgressBar';
import { Buttons } from './Buttons';
import { HistoryTable } from './HistoryTable';
import { DetailsModal } from './DetailsModal'; // Импортируем модальное окно
import { cards } from '../Solar/ModalWindowCards/cards';

export const GraphComponent = (props) => {
  const {
    graphData,
    setGraphData,
    setHighlightedNode,
    setSelectedNodes,
    selectedEdges,
    setSelectedEdges,
    history,
    setHistory,
    setShowNodeList,
    lockedNodes,
    setHoveredNode,
    handleLoadCoordinates,
    disabledNodes,
    matrixInfo,
    positiveEdgeColor,
    negativeEdgeColor,
    physicsEnabled,
    nodeSize,
    edgeRoundness,
    networkRef,
    selectedPlanetLocal,
    uuid,
    nodeColor,
    applyCoordinates,
    handleClear,
    handleMakeMove,
    selectedNodes,
    hoveredNode,
    showModal,
    setShowModal,
    lastIndex,
    showNodeList,
    handleClearEdges,
    setIsNetworkReady,
    isNetworkReady,
    graphDataState,
    setGraphDataState,
    planetColor,
    modelName,
    planetImg,
    showHistory,
    hoverSoundRef,
  } = props;

  // Локальное состояние для управления модальным окном Details в GraphComponent
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCardDetails, setSelectedCardDetails] = useState(null);

  useEffect(() => {
    if (!selectedPlanetLocal) return;
    if (!matrixInfo) return;
    if (!isNetworkReady) return;

    console.log('Сеть готова, применяем координаты...');
    handleLoadCoordinates(uuid, applyCoordinates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matrixInfo, isNetworkReady, uuid, applyCoordinates]);

  // Функция для открытия модального окна Details
  const handleOpenDetailsModal = () => {
    let foundCard = null;

    // Ищем карточку по uuid во всех массивах внутри объекта cards
    for (const planetKey in cards) {
      // Перебираем ключи (названия планет) в объекте cards
      if (Object.prototype.hasOwnProperty.call(cards, planetKey)) {
        const planetCards = cards[planetKey]; // Получаем массив карточек для текущей планеты
        foundCard = planetCards.find((card) => card.uuid === uuid); // Ищем карточку по uuid
        if (foundCard) {
          break; // Если нашли, прерываем цикл
        }
      }
    }

    if (foundCard) {
      setSelectedCardDetails(foundCard); // Сохраняем найденную карточку
    } else {
      console.warn(`Карточка с UUID ${uuid} не найдена в массиве 'cards'.`); //
      // Если карточка не найдена, можно установить дефолтные значения
      setSelectedCardDetails({
        title: modelName || 'Неизвестная модель',
        image: planetImg || '',
        description: 'Информация об этой модели пока недоступна.',
        paper: '',
        link: '',
      });
    }
    setIsDetailsModalOpen(true);
  };

  // Функция для закрытия модального окна Details
  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedCardDetails(null); // Очищаем данные при закрытии
  };

  const graphCanvasProps = {
    matrixInfo,
    disabledNodes,
    nodeColor,
    edgeRoundness,
    positiveEdgeColor,
    negativeEdgeColor,
    setGraphData,
    graphData,
    selectedEdges,
    physicsEnabled,
    nodeSize,
    setHighlightedNode,
    setShowNodeList,
    setHoveredNode,
    lockedNodes,
    setSelectedNodes,
    setSelectedEdges,
    networkRef,
    handleClear,
    handleMakeMove,
    selectedNodes,
    hoveredNode,
    showModal,
    setShowModal,
    lastIndex,
    showNodeList,
    handleClearEdges,
    setIsNetworkReady,
    graphDataState,
    setGraphDataState,
    hoverSoundRef,
  };

  return (
    <div>
      <div className="graph-component-header">
        <div className="head">
          {' '}
          {/* Removed inline style */}
          <img src={planetImg} alt="planet" className="planet-image" />
          <div className="graph-component-inner">
            <h1
              className="header"
              style={{ position: 'relative', color: planetColor }}
            >
              {modelName}
            </h1>
            <Buttons
              matrixUuid={uuid}
              applyCoordinates={applyCoordinates}
              matrixInfo={matrixInfo}
              networkRef={networkRef}
              planetColor={planetColor}
              planetImg={planetImg}
              modelName={modelName}
              onOpenDetailsModal={handleOpenDetailsModal} // Передаем функцию для открытия модального окна
            />
          </div>
        </div>
      </div>
      {/* если showHistory – показываем таблицу вместо графа */}
      {showHistory ? (
        <div style={{ padding: '20px' }}>
          <HistoryTable
            matrixUuid={uuid}
            planetColor={planetColor}
            history={history}
            setHistory={setHistory}
          />
        </div>
      ) : (
        <div className="graph-component-row">
          <VerticalProgressBar />
          <GraphCanvasRender {...graphCanvasProps} />
          <Stopwatch planetColor={planetColor} />
        </div>
      )}

      {/* Модальное окно Details теперь рендерится здесь, на уровне GraphComponent */}
      <DetailsModal
        open={isDetailsModalOpen}
        handleClose={handleCloseDetailsModal}
        cardData={selectedCardDetails} // Передаем найденную карточку
        planetColor={planetColor} // Передаем цвет планеты
      />
    </div>
  );
};
