// src/Components/Graph/GraphComponent.jsx
import React, { useEffect, useState } from 'react';
import { GraphCanvasRender } from './GraphCanvasRender';
import Stopwatch from './Stopwatch';
import VerticalProgressBar from './VerticalProgressBar';
import Buttons from './Buttons';
import { HistoryTable } from './HistoryTable';
import { PlanetCardModal } from '../Solar/ModalWindowCards/ModalWindowCards';
import { useCustomStates } from '../../CustomStates';

export const GraphComponent = (props) => {
  // Вытягиваем флаг и данные модалки из контекста
  const {
    showModal,
    setShowModal,
    selectedPlanet,
  } = useCustomStates();

  // Остальные пропсы — передаём 그대로 в граф
  const {
    graphData, setGraphData,
    setHighlightedNode,
    setSelectedNodes,
    selectedEdges, setSelectedEdges,
    history, setHistory,
    setShowNodeList, lockedNodes,
    setHoveredNode, handleLoadCoordinates,
    disabledNodes, matrixInfo,
    positiveEdgeColor, negativeEdgeColor,
    physicsEnabled, nodeSize,
    edgeRoundness, intervalRef,
    networkRef, uuid,
    nodeColor, applyCoordinates,
    handleClear, handleMakeMove,
    selectedNodes, hoveredNode,
    lastIndex, showNodeList, handleClearEdges,
    setIsNetworkReady, isNetworkReady,
    graphDataState, setGraphDataState,
    planetColor, modelName, planetImg,
    showHistory, hoverSoundRef
  } = props;

  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const onResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
      setIsMobile(window.innerWidth <= 900);
    };
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!matrixInfo || !isNetworkReady) return;
    handleLoadCoordinates(uuid, applyCoordinates);
  }, [matrixInfo, isNetworkReady, uuid, applyCoordinates]);

  const graphCanvasProps = {
    matrixInfo, disabledNodes, nodeColor, edgeRoundness,
    positiveEdgeColor, negativeEdgeColor, setGraphData, graphData,
    selectedEdges, physicsEnabled, nodeSize, setHighlightedNode,
    setShowNodeList, setHoveredNode, lockedNodes, setSelectedNodes,
    setSelectedEdges, networkRef, handleClear, handleMakeMove,
    selectedNodes, hoveredNode, lastIndex,
    showNodeList, handleClearEdges, setIsNetworkReady,
    graphDataState, setGraphDataState, hoverSoundRef
  };

  return (
    <div>
      {/* Desktop header */}
      {!isMobile && (
        <div className="graph-component-header">
          <div style={{ display: 'flex' }}>
            <img
              src={planetImg}
              alt="planet"
              style={{ width: 150, height: 150, borderRadius: 15 }}
            />
            <div className="graph-component-inner">
              <h1 style={{ color: planetColor }}>{modelName}</h1>
              <Buttons
                matrixUuid={uuid}
                applyCoordinates={applyCoordinates}
                matrixInfo={matrixInfo}
                networkRef={networkRef}
                planetColor={planetColor}
                planetImg={planetImg}
              />
            </div>
          </div>
        </div>
      )}

      {/* History view / Mobile layouts / Desktop main */}
      {showHistory ? (
        <div style={{ padding: 20 }}>
          <HistoryTable
            matrixUuid={uuid}
            planetColor={planetColor}
            history={history}
            setHistory={setHistory}
          />
        </div>
      ) : isMobile && isPortrait ? (
        <div className="layout-mobile portrait">
          <div className="mobile-header">
            <img src={planetImg} alt="planet" className="mobile-planet-img" />
            <h2 style={{ color: planetColor }}>{modelName}</h2>
          </div>
          <div className="mobile-buttons-overlay">
            <Buttons
              matrixUuid={uuid}
              applyCoordinates={applyCoordinates}
              matrixInfo={matrixInfo}
              networkRef={networkRef}
              planetColor={planetColor}
              planetImg={planetImg}
            />
          </div>
          <GraphCanvasRender {...graphCanvasProps} />
          <div className="mobile-overlay">
            <Stopwatch planetColor={planetColor} />
          </div>
        </div>
      ) : isMobile && !isPortrait ? (
        <div className="layout-mobile landscape">
          <div className="landscape-left">
            <img src={planetImg} alt="planet" className="mobile-planet-img" />
            <h2 style={{ color: planetColor }}>{modelName}</h2>
            <div className="mobile-buttons-overlay">
              <Buttons
                matrixUuid={uuid}
                applyCoordinates={applyCoordinates}
                matrixInfo={matrixInfo}
                networkRef={networkRef}
                planetColor={planetColor}
                planetImg={planetImg}
              />
            </div>
            <Stopwatch planetColor={planetColor} />
          </div>
          <div className="landscape-right">
            <GraphCanvasRender {...graphCanvasProps} />
          </div>
        </div>
      ) : (
        <div className="graph-component-row">
          <VerticalProgressBar />
          <GraphCanvasRender {...graphCanvasProps} />
          <Stopwatch planetColor={planetColor} />
        </div>
      )}

      {/* А вот и ваша модалка из ModalWindowCards.jsx */}
      {showModal && (
        <PlanetCardModal
          selectedPlanet={selectedPlanet}
          setSelectedPlanet={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default GraphComponent;
