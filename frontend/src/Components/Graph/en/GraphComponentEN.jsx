import { useEffect, useState } from 'react';
import { GraphCanvasRender } from '../GraphCanvasRender';
import Stopwatch from '../Stopwatch';
import VerticalProgressBar from '../VerticalProgressBar';
import { Buttons } from '../Buttons';
import { HistoryTable } from '../HistoryTable';
import { DetailsModal } from '../DetailsModal';
import { cards } from '../../Solar/en/ModalWindowCards/cardsEN';

export const GraphComponentEN = (props) => {
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

  const handleOpenDetailsModal = () => {
    let foundCard = null;

    for (const planetKey in cards) {
      if (Object.prototype.hasOwnProperty.call(cards, planetKey)) {
        const planetCards = cards[planetKey];
        foundCard = planetCards.find((card) => card.uuid === uuid);
        if (foundCard) {
          break;
        }
      }
    }

    if (foundCard) {
      setSelectedCardDetails(foundCard);
    } else {
      console.warn(`Карточка с UUID ${uuid} не найдена в массиве 'cards'.`); //
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

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedCardDetails(null);
  };

  let cardForHeader = null;
  let planetKeyForHeader = '';
  for (const planetKey in cards) {
    if (Object.prototype.hasOwnProperty.call(cards, planetKey)) {
      const planetCards = cards[planetKey];
      cardForHeader = planetCards.find((card) => card.uuid === uuid);
      if (cardForHeader) {
        planetKeyForHeader = planetKey;
        break;
      }
    }
  }

  let headerColorClass = '';
  if (planetKeyForHeader === 'Green') headerColorClass = 'header-green';
  else if (planetKeyForHeader === 'Orange') headerColorClass = 'header-orange';
  else if (planetKeyForHeader === 'Violet') headerColorClass = 'header-violet';

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
          <img
            src={cardForHeader?.image || ''}
            alt="planet"
            className="planet-image"
          />
          <div className="graph-component-inner">
            <h1
              className={`header ${headerColorClass}`}
              style={{ position: 'relative' }}
            >
              {cardForHeader?.title || modelName}
            </h1>
            <Buttons
              matrixUuid={uuid}
              applyCoordinates={applyCoordinates}
              matrixInfo={matrixInfo}
              networkRef={networkRef}
              planetColor={planetColor}
              planetImg={planetImg}
              modelName={modelName}
              onOpenDetailsModal={handleOpenDetailsModal}
            />
          </div>
        </div>
      </div>
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

      <DetailsModal
        open={isDetailsModalOpen}
        handleClose={handleCloseDetailsModal}
        cardData={selectedCardDetails}
        planetColor={planetColor}
      />
    </div>
  );
};

export default GraphComponentEN;
