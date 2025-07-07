import React, { useEffect, useRef } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';
import { ScienceAllNodesList } from './ScienceAllNodesList';
import { ScienceSelectedNodesList } from './ScienceSelectedNodes';
import { useCustomStates } from '../../../CustomStates';

export const ScienceGraphComponent = () => {
  const {
    // -- Вытягиваем нужные стейты и методы --
    matrixInfo,
    disabledNodes,
    nodeColor,
    edgeRoundness,
    positiveEdgeColor,
    negativeEdgeColor,
    setGraphData,
    graphData,
    physicsEnabled,
    nodeSize,
    setHighlightedNode,
    setShowNodeList,
    setHoveredNode,
    lockedNodes,
    selectedNodes, // теперь у нас будет массив чисел (ID)
    setSelectedNodes,
    selectedEdges,
    setSelectedEdges,
    networkRef,
    lastIndex,
    hoveredNode,
    handleClear,
    handleMakeMove,
    showNodeList,
    handleClearEdges,
    handleLoadCoordinates,
    applyCoordinates,
    hoverSoundRef,
  } = useCustomStates();

  // Локальные refs для DataSet узлов, рёбер и экземпляра сети
  const nodesRef = useRef(null);
  const edgesRef = useRef(null);
  const localNetworkRef = useRef(null);

  // Ref для актуальных disabledNodes (чтобы знать их внутри обработчиков сети)
  const disabledNodesRef = useRef(disabledNodes);

  // При изменении disabledNodes обновляем ref:
  useEffect(() => {
    disabledNodesRef.current = disabledNodes;
    // Если у нас были выбраны узлы, которые вдруг стали недоступными,
    // уберём их из selectedNodes (аналог GraphCanvasRender).
    setSelectedNodes((prev) =>
      prev.filter((id) => !disabledNodesRef.current.includes(id))
    );
  }, [disabledNodes, setSelectedNodes]);

  // ======================
  // ИНИЦИАЛИЗАЦИЯ ГРАФА (1 раз)
  // ======================
  useEffect(() => {
    if (!matrixInfo?.edges || !matrixInfo?.nodes) return;
    // Если DataSet уже созданы – не пересоздаём их
    if (nodesRef.current && edgesRef.current) return;

    const { edges, nodes: oldNodes } = matrixInfo;
    const nodesDataSet = new DataSet();
    const edgesDataSet = new DataSet();
    const nodesMap = new Map();

    edges.forEach(({ from, to, value }) => {
      if (value === 0) return;

      // Добавляем узлы в DataSet (если ещё не были добавлены)
      const addNode = (id) => {
        if (!oldNodes[id - 1]) return;
        if (nodesMap.has(id)) return;

        const isDisabled = disabledNodesRef.current.includes(id);
        const nodeData = {
          id,
          label: String(id),
          title: oldNodes[id - 1].name,
          description: oldNodes[id - 1].description,
          color: { background: isDisabled ? 'gray' : nodeColor },
          font: { size: isDisabled ? 14 : 16 },
        };
        // Если это target-узел — подсветим
        if (oldNodes[id - 1].target === 1) {
          nodeData.color = { background: 'gold' };
          nodeData.font = { size: 25 };
        }

        nodesMap.set(id, nodeData);
        nodesDataSet.add(nodeData);
      };

      addNode(from);
      addNode(to);

      // Добавляем ребро
      const edgeId = `${from}-${to}`;
      edgesDataSet.add({
        id: edgeId,
        from,
        to,
        rawValue: value,
        width: 1,
        title: `При увеличении ${oldNodes[from - 1].name} ${
          value > 0 ? 'увеличивается' : 'уменьшается'
        } ${oldNodes[to - 1].name} на ${value}`,
        label: String(value),
        smooth: { type: 'continues', roundness: edgeRoundness },
        color: { color: value > 0 ? positiveEdgeColor : negativeEdgeColor },
      });
    });

    // Сохраняем DataSet в рефах, чтобы управлять ими напрямую
    nodesRef.current = nodesDataSet;
    edgesRef.current = edgesDataSet;

    // Запишем graphData в стейт (сохраняя DataSet!)
    if (setGraphData) {
      setGraphData({ nodes: nodesDataSet, edges: edgesDataSet });
    }

    // Инициализируем Network
    const container = document.getElementById('graph-container');
    if (!container) {
      console.warn('Контейнер #graph-container не найден');
      return;
    }

    const options = {
      edges: {
        smooth: { type: 'curvedCW', roundness: edgeRoundness },
        scaling: {
          min: 1,
          max: 1,
          label: {
            enabled: true,
            min: 11,
            max: 11,
            maxVisible: 55,
            drawThreshold: 5,
          },
        },
        arrows: { to: true },
        font: {
          size: 18,
          align: 'horizontal',
          color: 'white',
          strokeWidth: 2,
          strokeColor: 'black',
        },
        color: { highlight: 'white', hover: 'white' },
        chosen: true,
      },
      physics: {
        enabled: physicsEnabled,
        barnesHut: {
          gravitationalConstant: -50000,
          centralGravity: 0.3,
          springLength: 95,
          springConstant: 0.04,
          damping: 0.09,
          avoidOverlap: 3.4,
        },
        stabilization: { enabled: true, iterations: 1000, updateInterval: 25 },
      },
      nodes: {
        shape: 'circle',
        size: nodeSize,
        font: { size: 14, color: 'white', align: 'center' },
        borderWidth: 2,
        borderWidthSelected: 4,
      },
      interaction: { hover: true, tooltipDelay: 300, multiselect: true },
    };

    const newNetwork = new Network(
      container,
      { nodes: nodesDataSet, edges: edgesDataSet },
      options
    );

    localNetworkRef.current = newNetwork;
    if (networkRef) {
      networkRef.current = newNetwork;
    }

    // ======================
    // ОБРАБОТЧИКИ СОБЫТИЙ
    // ======================

    // -- Клик по графу --
    newNetwork.on('click', (event) => {
      const clickedNodeIds = event.nodes || [];
      const clickedEdgeIds = event.edges || [];

      // Если клик по disabled узлу — снимаем выделение, игнорим
      if (clickedNodeIds.some((id) => disabledNodesRef.current.includes(id))) {
        newNetwork.unselectAll();
        return;
      }

      // Клик по 1 узлу
      if (clickedNodeIds.length === 1) {
        const clickedNodeId = clickedNodeIds[0];
        if (
          !lockedNodes[clickedNodeId] &&
          !disabledNodesRef.current.includes(clickedNodeId)
        ) {
          // 👉 ЛОГИКА, КАК В GraphCanvasRender:
          setSelectedNodes((prev) =>
            prev.includes(clickedNodeId)
              ? prev.filter((id) => id !== clickedNodeId)
              : [...prev, clickedNodeId]
          );
        }
      }

      // Клик по рёбрам
      if (clickedEdgeIds.length > 0) {
        setSelectedEdges((prev) => {
          const newSelected = new Set(prev);
          clickedEdgeIds.forEach((edgeId) => {
            if (newSelected.has(edgeId)) {
              // снимаем выделение
              newSelected.delete(edgeId);
              const edgeObj = edgesRef.current.get(edgeId);
              if (edgeObj) {
                edgesRef.current.update({
                  id: edgeId,
                  width: 1,
                  color: {
                    color:
                      edgeObj.rawValue > 0
                        ? positiveEdgeColor
                        : negativeEdgeColor,
                  },
                });
              }
            } else {
              // выделяем
              newSelected.add(edgeId);
              const edgeObj = edgesRef.current.get(edgeId);
              if (edgeObj) {
                edgesRef.current.update({
                  id: edgeId,
                  width: 5,
                  color: { color: 'white' },
                });
              }
            }
          });
          return Array.from(newSelected);
        });
      }
    });

    // -- Наведение на узел --
    newNetwork.on('hoverNode', (event) => {
      if (disabledNodesRef.current.includes(event.node)) {
        newNetwork.unselectAll();
        setShowNodeList(false);
        setHoveredNode(null);
        return;
      }
      // играем звук при наведении на активный узел
      hoverSoundRef.current
        ?.play()
        .catch((err) => console.warn('hoverSound play failed:', err.message));
      setHighlightedNode(event.node);
      setShowNodeList(true);
      setHoveredNode(event.node);
    });

    // -- Потеря фокуса --
    newNetwork.on('blurNode', () => {
      setHighlightedNode(null);
      setShowNodeList(false);
      setHoveredNode(null);
    });

    // -- Выделение узла --
    newNetwork.on('selectNode', (params) => {
      // Запретим выделять locked-узлы
      const selectableNodes = params.nodes.filter((id) => !lockedNodes[id]);
      newNetwork.setSelection({ nodes: selectableNodes, edges: params.edges });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    matrixInfo,
    nodeColor,
    positiveEdgeColor,
    negativeEdgeColor,
    edgeRoundness,
    physicsEnabled,
    nodeSize,
    disabledNodes,
    setGraphData,
    networkRef,
    lockedNodes,
  ]);

  // ======================
  // СЛЕДИМ ЗА ИЗМЕНЕНИЕМ disabledNodes → обновляем цвета
  // ======================
  useEffect(() => {
    if (!nodesRef.current) return;
    nodesRef.current.forEach((node) => {
      if (disabledNodes.includes(node.id)) {
        nodesRef.current.update({ id: node.id, color: { background: 'gray' } });
      } else {
        nodesRef.current.update({
          id: node.id,
          color: { background: nodeColor },
        });
      }
    });
  }, [disabledNodes, nodeColor]);

  // ======================
  // СЛЕДИМ ЗА ИЗМЕНЕНИЕМ selectedEdges → обновляем стили
  // ======================
  useEffect(() => {
    if (!edgesRef.current) return;

    // Подсветим выбранные
    selectedEdges.forEach((edgeId) => {
      try {
        edgesRef.current.update({
          id: edgeId,
          width: 5,
          color: { color: 'white' },
        });
      } catch (err) {
        console.warn(`Ошибка при обновлении ребра ${edgeId}:`, err);
      }
    });

    // Сбросим невыбранные
    edgesRef.current.forEach((edge) => {
      if (!selectedEdges.includes(edge.id)) {
        edgesRef.current.update({
          id: edge.id,
          width: 1,
          color: {
            color: edge.rawValue > 0 ? positiveEdgeColor : negativeEdgeColor,
          },
        });
      }
    });
  }, [selectedEdges, positiveEdgeColor, negativeEdgeColor]);

  // ======================
  // ЗАГРУЗКА КООРДИНАТ (если нужно)
  // ======================
  useEffect(() => {
    if (graphData && matrixInfo?.matrix_info?.uuid && networkRef.current) {
      handleLoadCoordinates(matrixInfo.matrix_info.uuid, applyCoordinates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ======================
  // Рендер
  // ======================
  return (
    <>
      <div id="graph-container" className="graph-container" />

      {/* Отображаем список всех узлов, если showNodeList включён */}
      {graphData && showNodeList && (
        <ScienceAllNodesList
          nodes={nodesRef.current ? nodesRef.current.get() : []}
          hoveredNode={hoveredNode}
        />
      )}

      {/* Отображаем список выбранных узлов, если есть что-то выбранное */}
      {selectedNodes.length > 0 && (
        <ScienceSelectedNodesList
          selectedNodes={selectedNodes} /* массив ID, как в GraphCanvas */
          hoveredNode={hoveredNode}
          lastIndex={lastIndex}
          handleClear={handleClear}
          handleMakeMove={handleMakeMove}
          handleClearEdges={handleClearEdges}
        />
      )}
    </>
  );
};

export default ScienceGraphComponent;
