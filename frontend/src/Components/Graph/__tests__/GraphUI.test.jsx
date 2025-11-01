/* eslint-disable import/first, testing-library/no-node-access */
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

vi.mock('../../../CustomStates', () => ({
  useCustomStates: vi.fn(),
}));

vi.mock('../../../clientServerHub', () => ({
  getGameHistory: vi.fn(),
}));

import { useCustomStates } from '../../../CustomStates';
import { getGameHistory } from '../../../clientServerHub';

import { GameOverModalWindow } from '../GameOverModalWindow';
import { InfoModalWindow } from '../InfoModalWindow';
import { HistoryTable } from '../HistoryTable';
import Stopwatch from '../Stopwatch';
import VerticalProgressBar from '../VerticalProgressBar';

describe('GameOverModalWindow', () => {
  it('renders and closes', () => {
    const setIsClosing = vi.fn();
    const setShowGameOverModal = vi.fn();
    const commonState = {
      setIsRunning: vi.fn(),
      isRunning: false,
      maxTime: 100,
      currentTime: 100,
      handleStop: vi.fn(),
      gameOverSoundRef: { current: { play: vi.fn().mockResolvedValue() } },
      backgroundMusicRef: {
        current: { pause: vi.fn(), play: vi.fn().mockResolvedValue() },
      },
    };

    useCustomStates.mockReturnValue({
      ...commonState,
      isClosing: false,
      setIsClosing,
      showGameOverModal: true,
      setShowGameOverModal,
    });

    const { rerender } = render(
      <GameOverModalWindow planetColor="#fff" score={10} />
    );

    expect(screen.getByText(/Game Over/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /ok/i }));
    expect(setIsClosing).toHaveBeenCalledWith(true);

    useCustomStates.mockReturnValue({
      ...commonState,
      isClosing: true,
      setIsClosing,
      showGameOverModal: true,
      setShowGameOverModal,
    });

    rerender(<GameOverModalWindow planetColor="#fff" score={10} />);

    const wrapper = screen
      .getByText(/Game Over/i)
      .closest('.game-over-modal-wrapper');
    // eslint-disable-next-line testing-library/no-node-access
    fireEvent.animationEnd(wrapper);

    expect(setIsClosing).toHaveBeenCalledWith(false);
    expect(setShowGameOverModal).toHaveBeenCalledWith(false);
  });
});

describe('InfoModalWindow', () => {
  it('renders and closes', () => {
    const handleClosePreviewWindow = vi.fn();
    const setIsClosing = vi.fn();

    useCustomStates.mockReturnValue({
      showPreviewWindow: true,
      isClosing: false,
      handleClosePreviewWindow,
      setIsClosing,
    });

    const { rerender } = render(<InfoModalWindow planetColor="#fff" />);

    expect(screen.getByText(/прежде чем начать игру/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /ok/i }));
    expect(handleClosePreviewWindow).toHaveBeenCalled();

    useCustomStates.mockReturnValue({
      showPreviewWindow: false,
      isClosing: true,
      handleClosePreviewWindow,
      setIsClosing,
    });

    rerender(<InfoModalWindow planetColor="#fff" />);
    const infoWrapper = screen
      .getByRole('button', { name: /ok/i })
      .closest('.modal-wrapper');
    // eslint-disable-next-line testing-library/no-node-access
    fireEvent.animationEnd(infoWrapper);

    expect(setIsClosing).toHaveBeenCalledWith(false);
  });
});

describe('HistoryTable', () => {
  it('loads and displays history', async () => {
    const historyData = [
      {
        timestamp: 1700000000000,
        final_score: 42,
        turns: [{ nodes: ['A', 'B'] }],
      },
    ];
    getGameHistory.mockResolvedValue({ history: historyData });

    const Wrapper = () => {
      const [history, setHistory] = React.useState([]);
      return (
        <HistoryTable
          matrixUuid="matrix1"
          planetColor="#fff"
          history={history}
          setHistory={setHistory}
        />
      );
    };

    render(<Wrapper />);

    expect(getGameHistory).toHaveBeenCalledWith('matrix1');

    await screen.findByText(/42/);
    expect(screen.getByText(/Ход 1: A, B/)).toBeInTheDocument();
  });
});

describe('Stopwatch', () => {
  it('handles start and stop', async () => {
    const handleStart = vi.fn();
    const handleStop = vi.fn();
    const setIsHoveredStart = vi.fn();
    const setIsHoveredStop = vi.fn();

    useCustomStates.mockReturnValue({
      currentTime: 0,
      score: 0,
      movesHistory: [],
      handleStart,
      handleStop,
      isRunning: false,
      isPaused: false,
      isHoveredStart: false,
      setIsHoveredStart,
      isHoveredStop: false,
      setIsHoveredStop,
    });

    const user = userEvent.setup();
    const { rerender } = render(<Stopwatch planetColor="#fff" />);

    const startButton = screen.getByRole('button', { name: /start/i });
    const stopButton = screen.getByRole('button', { name: /pause/i });

    expect(startButton).not.toBeDisabled();
    expect(stopButton).toBeDisabled();

    await user.click(startButton);
    expect(handleStart).toHaveBeenCalled();

    useCustomStates.mockReturnValue({
      currentTime: 0,
      score: 0,
      movesHistory: [],
      handleStart,
      handleStop,
      isRunning: true,
      isPaused: false,
      isHoveredStart: false,
      setIsHoveredStart,
      isHoveredStop: false,
      setIsHoveredStop,
    });

    rerender(<Stopwatch planetColor="#fff" />);

    expect(screen.getByRole('button', { name: /start/i })).toBeDisabled();
    const stopButtonActive = screen.getByRole('button', { name: /pause/i });
    expect(stopButtonActive).not.toBeDisabled();

    await user.click(stopButtonActive);
    expect(handleStop).toHaveBeenCalled();
  });
});

describe('VerticalProgressBar', () => {
  it('computes fill percentage', () => {
    useCustomStates.mockReturnValue({
      currentTime: 50,
      maxTime: 200,
    });

    render(<VerticalProgressBar />);

    // eslint-disable-next-line testing-library/no-node-access
    const fill = document.querySelector('.vertical-progress-bar-fill');

    expect(fill).toHaveStyle({ height: '25%' });
  });
});
