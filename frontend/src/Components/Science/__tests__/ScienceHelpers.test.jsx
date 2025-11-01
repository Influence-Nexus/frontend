import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { MovesTable } from '../en/Table';
import { SciencePageButtons } from '../en/SciencePageButtons';
import { ScienceStopWatchContainer } from '../en/ScienceStopWatchContainer';
import { Conditions } from '../en/Conditions';
import { useCustomStates } from '../../../CustomStates';

expect.extend(matchers);

vi.mock('../../../CustomStates', () => ({
  useCustomStates: vi.fn(),
}));

describe('Science helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('MovesTable renders rows and enables scrolling when prevScores length exceeds 7', () => {
    useCustomStates.mockReturnValue({
      prevScores: [1, 3, 6, 10, 15, 21, 28, 36],
      containerRef: { current: null },
    });

    render(<MovesTable />);

    expect(screen.getAllByText(/Move \d/)).toHaveLength(8);
    // eslint-disable-next-line testing-library/no-node-access
    const container = screen.getByRole('table').parentElement;
    expect(container).toHaveStyle({ overflowY: 'auto' });
  });

  test('SciencePageButtons contain correct navigation links', () => {
    render(
      <MemoryRouter>
        <SciencePageButtons />
      </MemoryRouter>
    );

    const gameLink = screen.getByRole('link', { name: /game/i });
    const algorithmLink = screen.getAllByRole('link')[1];

    expect(gameLink).toHaveAttribute('href', '/solar');
    expect(algorithmLink).toHaveAttribute('href', '/algorithm');
  });

  test('ScienceStopWatchContainer handles start and stop logic', () => {
    const handleStart = vi.fn();
    const handleStop = vi.fn();

    useCustomStates.mockReturnValue({
      currentTime: 0,
      score: 0,
      movesHistory: [],
      handleStart,
      handleStop,
      isRunning: false,
      isPaused: false,
      isHoveredStart: false,
      setIsHoveredStart: vi.fn(),
      isHoveredStop: false,
      setIsHoveredStop: vi.fn(),
    });

    render(<ScienceStopWatchContainer planetColor="#fff" />);

    const startButton = screen.getByRole('button', { name: /start/i });
    const stopButton = screen.getByRole('button', { name: /pause/i });

    expect(startButton).not.toBeDisabled();
    expect(stopButton).toBeDisabled();

    fireEvent.click(startButton);
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
      setIsHoveredStart: vi.fn(),
      isHoveredStop: false,
      setIsHoveredStop: vi.fn(),
    });

    render(<ScienceStopWatchContainer planetColor="#fff" />);

    const startButtonRunning = screen.getAllByRole('button', {
      name: /start/i,
    })[1];
    const stopButtonRunning = screen.getAllByRole('button', {
      name: /pause/i,
    })[1];

    expect(startButtonRunning).toBeDisabled();
    expect(stopButtonRunning).not.toBeDisabled();

    fireEvent.click(stopButtonRunning);
    expect(handleStop).toHaveBeenCalled();
  });

  test('Conditions renders model constraints text', () => {
    render(<Conditions />);
    expect(screen.getByText(/Model Constraints/)).toBeInTheDocument();
    expect(screen.getByText(/Damping-Factor: δ=0.02/)).toBeInTheDocument();
    expect(
      screen.getByText(/Constraints to impacts: N\(0\): 1, 2, 3/)
    ).toBeInTheDocument();
    expect(screen.getByText(/N\(\+\): 1, 2, 3/)).toBeInTheDocument();
    expect(screen.getByText(/N\(-\): 1, 2, 3/)).toBeInTheDocument();
  });
});
