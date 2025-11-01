/* eslint-disable import/first */
import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('vis-network/standalone/esm/vis-network', () => {
  const handlers = {};
  const mockUnselectAll = vi.fn();

  class MockNetwork {
    on(event, cb) {
      handlers[event] = cb;
    }
    setSelection = vi.fn();
    unselectAll = mockUnselectAll;
  }

  class MockDataSet {
    constructor(items = []) {
      this.items = [...items];
    }
    add(item) {
      this.items.push(item);
    }
    forEach(cb) {
      this.items.forEach(cb);
    }
    update(item) {
      const idx = this.items.findIndex((i) => i.id === item.id);
      if (idx !== -1) {
        this.items[idx] = { ...this.items[idx], ...item };
      }
    }
    get() {
      return this.items;
    }
  }

  return {
    Network: MockNetwork,
    DataSet: MockDataSet,
    handlers,
    mockUnselectAll,
  };
});

import ScienceGraphComponent from '../en/ScienceGraphComp.jsx';
import {
  handlers as networkHandlers,
  mockUnselectAll,
} from 'vis-network/standalone/esm/vis-network';

let disabledNodes = [];
let selectedNodes = [];
let graphData = null;

const setHighlightedNode = vi.fn();
const setShowNodeList = vi.fn();
const setHoveredNode = vi.fn();
const setSelectedEdges = vi.fn();
const handleLoadCoordinates = vi.fn();
const applyCoordinates = vi.fn();

const setGraphData = vi.fn((data) => {
  graphData = data;
  context.graphData = data;
});

const setSelectedNodes = vi.fn((updater) => {
  selectedNodes =
    typeof updater === 'function' ? updater(selectedNodes) : updater;
  context.selectedNodes = selectedNodes;
});

const context = {
  matrixInfo: {
    nodes: [
      { name: 'Node 1', description: 'Desc 1' },
      { name: 'Node 2', description: 'Desc 2' },
    ],
    edges: [{ from: 1, to: 2, value: 1 }],
  },
  disabledNodes,
  nodeColor: '#0000ff',
  edgeRoundness: 0.15,
  positiveEdgeColor: '#00ff00',
  negativeEdgeColor: '#ff0000',
  setGraphData,
  graphData: null,
  physicsEnabled: false,
  nodeSize: 20,
  setHighlightedNode,
  setShowNodeList,
  setHoveredNode,
  lockedNodes: {},
  selectedNodes,
  setSelectedNodes,
  selectedEdges: [],
  setSelectedEdges,
  networkRef: { current: null },
  lastIndex: 0,
  hoveredNode: null,
  handleClear: vi.fn(),
  handleMakeMove: vi.fn(),
  showNodeList: false,
  handleClearEdges: vi.fn(),
  handleLoadCoordinates,
  applyCoordinates,
  hoverSoundRef: { current: { play: vi.fn().mockResolvedValue() } },
};

vi.mock('../../../CustomStates', () => ({
  useCustomStates: () => context,
}));

describe('ScienceGraphComponent', () => {
  beforeEach(() => {
    Object.keys(networkHandlers).forEach((key) => delete networkHandlers[key]);
    disabledNodes = [];
    selectedNodes = [];
    graphData = null;
    context.disabledNodes = disabledNodes;
    context.selectedNodes = selectedNodes;
    context.graphData = graphData;
    setHighlightedNode.mockClear();
    setShowNodeList.mockClear();
    setHoveredNode.mockClear();
    setSelectedNodes.mockClear();
    mockUnselectAll.mockClear();
  });

  it('highlights and selects nodes', () => {
    render(<ScienceGraphComponent />);

    networkHandlers.hoverNode({ node: 1 });
    expect(setHighlightedNode).toHaveBeenCalledWith(1);
    expect(setShowNodeList).toHaveBeenCalledWith(true);
    expect(setHoveredNode).toHaveBeenCalledWith(1);

    networkHandlers.click({ nodes: [1], edges: [] });
    expect(selectedNodes).toContain(1);
  });

  it('ignores disabled nodes on hover and click', () => {
    disabledNodes = [1];
    context.disabledNodes = disabledNodes;

    render(<ScienceGraphComponent />);

    networkHandlers.hoverNode({ node: 1 });
    expect(mockUnselectAll).toHaveBeenCalled();
    expect(setHoveredNode).toHaveBeenCalledWith(null);
    expect(setHighlightedNode).not.toHaveBeenCalledWith(1);

    networkHandlers.click({ nodes: [1], edges: [] });
    expect(selectedNodes).not.toContain(1);
  });

  it('filters selectedNodes and updates node colors when disabledNodes change', async () => {
    selectedNodes = [1, 2];
    context.selectedNodes = selectedNodes;
    const { rerender } = render(<ScienceGraphComponent />);

    disabledNodes = [2];
    context.disabledNodes = disabledNodes;
    rerender(<ScienceGraphComponent />);

    await waitFor(() => {
      expect(selectedNodes).toEqual([1]);
    });

    let node = graphData.nodes.items.find((n) => n.id === 2);
    expect(node.color.background).toBe('gray');

    disabledNodes = [];
    context.disabledNodes = disabledNodes;
    rerender(<ScienceGraphComponent />);

    node = graphData.nodes.items.find((n) => n.id === 2);
    expect(node.color.background).toBe('#0000ff');
  });
});
