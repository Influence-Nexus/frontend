/* eslint-disable import/first */
/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';

vi.mock('react-bootstrap', () => {
  const Modal = ({ children }) => <div>{children}</div>;
  Modal.Header = ({ children }) => <div>{children}</div>;
  Modal.Title = ({ children }) => <div>{children}</div>;
  Modal.Body = ({ children }) => <div>{children}</div>;
  return { Modal };
});

vi.mock('../en/ModalWindowCards/cardsEN', () => {
  const mockCards = {
    TestPlanet: [
      {
        uuid: 'test-uuid',
        title: 'Test Card',
        description: 'Card description',
        paper: 'Paper',
        link: 'http://example.com',
        image: 'test.png',
      },
    ],
  };

  const mockCardCreds = {
    TestPlanet: { src: 'planet.png', color: '#fff' },
  };

  return {
    cards: mockCards,
    cardcreds: mockCardCreds,
  };
});

import { PlanetCardModal } from '../en/ModalWindowCards/ModalWindowCardsEN.jsx';

const selectedPlanet = {
  name: 'TestPlanet',
  description: 'Planet description',
};

const LocationDisplay = () => {
  const location = useLocation();
  return (
    <>
      <span data-testid="location-display">{location.pathname}</span>
      <span data-testid="location-state">{JSON.stringify(location.state)}</span>
    </>
  );
};

describe('ModalWindowCards', () => {
  beforeEach(() => {
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('opens, zooms and closes a card', async () => {
    render(
      <MemoryRouter>
        <PlanetCardModal
          selectedPlanet={selectedPlanet}
          setSelectedPlanet={() => {}}
        />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.click(screen.getByText('Pick'));
    await screen.findByText('Play');

    const closeIcon = screen
      .getAllByTestId('CancelIcon')
      .find((icon) =>
        icon.closest('button')?.classList.contains('close-card-modal-window')
      );
    await user.click(closeIcon);
    await waitFor(() =>
      expect(screen.queryByText('Play')).not.toBeInTheDocument()
    );
  });

  it('navigates to matrix path with planet state on Play', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <PlanetCardModal
                selectedPlanet={selectedPlanet}
                setSelectedPlanet={() => {}}
              />
            }
          />
          <Route path="/matrix_uuid/:uuid" element={<LocationDisplay />} />
        </Routes>
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.click(screen.getByText('Pick'));
    await screen.findByText('Play');
    await user.click(screen.getByText('Play'));

    await waitFor(() =>
      expect(screen.getByTestId('location-display')).toHaveTextContent(
        '/matrix_uuid/test-uuid'
      )
    );

    const state = screen.getByTestId('location-state').textContent;
    expect(JSON.parse(state)).toEqual({ selectedPlanet });
  });
});
