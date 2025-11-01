import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
  cleanup,
} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Buttons } from '../Buttons';

vi.mock('../../../CustomStates', () => ({
  useCustomStates: () => ({
    isRunning: false,
    selectedPlanet: null,
    selectedCardIndex: null,
    handleLoadCoordinates: vi.fn(),
    handleResetCoordinates: vi.fn(),
    handleSaveUserView: vi.fn(),
    applyCoordinates: vi.fn(),
    setShowHistory: vi.fn(),
  }),
}));

vi.mock('../../../clientServerHub', () => ({
  logScienceAttempt: vi.fn(),
  getScienceClicks: vi.fn(),
}));

// eslint-disable-next-line import/first
import { logScienceAttempt, getScienceClicks } from '../../../clientServerHub';

const setWindowWidth = (width) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
};

describe('Buttons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('opens and closes menu on mobile when clicking outside', async () => {
    setWindowWidth(500);
    render(
      <MemoryRouter>
        <Buttons
          matrixUuid="123"
          planetColor="red"
          planetImg="img"
          onOpenDetailsModal={vi.fn()}
        />
      </MemoryRouter>
    );

    const toggleButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(toggleButton);
    const buttonsContainer = screen.getByTestId('buttons-container');
    expect(buttonsContainer).toHaveClass('menu-open');

    fireEvent.mouseDown(document);
    await waitFor(() => expect(buttonsContainer).not.toHaveClass('menu-open'));
  });

  it('keeps menu open on desktop when clicking outside', async () => {
    setWindowWidth(1024);
    render(
      <MemoryRouter>
        <Buttons
          matrixUuid="123"
          planetColor="red"
          planetImg="img"
          onOpenDetailsModal={vi.fn()}
        />
      </MemoryRouter>
    );

    const toggleButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(toggleButton);
    const buttonsContainer = screen.getByTestId('buttons-container');
    expect(buttonsContainer).toHaveClass('menu-open');

    fireEvent.mouseDown(document);
    await waitFor(() => expect(buttonsContainer).toHaveClass('menu-open'));
  });

  it('logs science attempt and shows KeyIcon', async () => {
    setWindowWidth(1024);
    getScienceClicks.mockResolvedValue({ science_clicks: 1 });
    logScienceAttempt.mockResolvedValue({ science_clicks: 2 });

    render(
      <MemoryRouter>
        <Buttons
          matrixUuid="123"
          planetColor="red"
          planetImg="img"
          onOpenDetailsModal={vi.fn()}
        />
      </MemoryRouter>
    );

    await waitFor(() => expect(getScienceClicks).toHaveBeenCalled());
    const scienceButton = screen.getByRole('button', { name: /science/i });
    expect(within(scienceButton).getAllByTestId('KeyIcon')).toHaveLength(1);

    fireEvent.click(scienceButton);
    await waitFor(() => expect(logScienceAttempt).toHaveBeenCalled());
    await waitFor(() =>
      expect(within(scienceButton).getAllByTestId('KeyIcon')).toHaveLength(2)
    );
  });

  it('calls handleButtonClick and closes menu on mobile', async () => {
    setWindowWidth(500);
    const onOpenDetailsModal = vi.fn();
    render(
      <MemoryRouter>
        <Buttons
          matrixUuid="123"
          planetColor="red"
          planetImg="img"
          onOpenDetailsModal={onOpenDetailsModal}
        />
      </MemoryRouter>
    );

    const toggleButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(toggleButton);
    const buttonsContainer = screen.getByTestId('buttons-container');
    expect(buttonsContainer).toHaveClass('menu-open');

    const detailsButton = screen.getByRole('button', { name: /details/i });
    fireEvent.click(detailsButton);
    expect(onOpenDetailsModal).toHaveBeenCalled();
    await waitFor(() => expect(buttonsContainer).not.toHaveClass('menu-open'));
  });
});
