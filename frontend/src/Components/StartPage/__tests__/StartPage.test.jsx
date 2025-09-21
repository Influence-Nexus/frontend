import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import StartPage from '../StartPage';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

describe('StartPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('navigates to sign-in when no access token', async () => {
    const setHeaderShow = vi.fn();
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={<StartPage setHeaderShow={setHeaderShow} />}
          />
          <Route path="/sign-in" element={<div>SignIn</div>} />
          <Route path="/challengecomponent" element={<div>Challenge</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByText(/play/i));

    expect(screen.getByText('SignIn')).toBeInTheDocument();
  });

  it('navigates to challengecomponent when access token exists', async () => {
    localStorage.setItem('access_token', 'token');
    const setHeaderShow = vi.fn();
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={<StartPage setHeaderShow={setHeaderShow} />}
          />
          <Route path="/sign-in" element={<div>SignIn</div>} />
          <Route path="/challengecomponent" element={<div>Challenge</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByText(/play/i));

    expect(screen.getByText('Challenge')).toBeInTheDocument();
  });

  it('calls setHeaderShow(true) once on mount', () => {
    const setHeaderShow = vi.fn();

    render(
      <MemoryRouter>
        <StartPage setHeaderShow={setHeaderShow} />
      </MemoryRouter>
    );

    expect(setHeaderShow).toHaveBeenCalledTimes(1);
    expect(setHeaderShow).toHaveBeenCalledWith(true);
  });
});
