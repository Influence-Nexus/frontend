import { beforeEach, describe, expect, test, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header.jsx';
import { useCustomStates } from '../../../CustomStates';
import { useLocation } from 'react-router-dom';
expect.extend(matchers);

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useLocation: vi.fn() };
});

vi.mock('../../../CustomStates', () => ({
  useCustomStates: vi.fn(),
}));

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('language buttons toggle active state correctly', async () => {
    const mockSetLanguage = vi.fn();
    useCustomStates.mockReturnValue({
      userUuid: null,
      setUserUuid: vi.fn(),
      currentLang: 'en',
      setLanguage: mockSetLanguage,
    });
    useLocation.mockReturnValue({ pathname: '/' });

    const { rerender } = render(
      <MemoryRouter>
        <Header headerShow />
      </MemoryRouter>
    );

    const englishButton = screen.getByRole('button', {
      name: /switch to english/i,
    });
    const russianButton = screen.getByRole('button', {
      name: /переключить на русский/i,
    });

    expect(englishButton).toBeDisabled();
    expect(russianButton).not.toBeDisabled();
    expect(englishButton).toHaveClass('active');
    expect(russianButton).not.toHaveClass('active');

    await userEvent.click(russianButton);
    expect(mockSetLanguage).toHaveBeenCalledWith('ru');

    useCustomStates.mockReturnValue({
      userUuid: null,
      setUserUuid: vi.fn(),
      currentLang: 'ru',
      setLanguage: mockSetLanguage,
    });

    rerender(
      <MemoryRouter>
        <Header headerShow />
      </MemoryRouter>
    );

    expect(englishButton).not.toBeDisabled();
    expect(russianButton).toBeDisabled();
    expect(englishButton).not.toHaveClass('active');
    expect(russianButton).toHaveClass('active');
  });

  test('logout removes tokens and redirects', async () => {
    localStorage.setItem('access_token', '123');
    localStorage.setItem('user_uuid', 'abc');

    const mockSetUserUuid = vi.fn();
    useCustomStates.mockReturnValue({
      userUuid: 'abc',
      setUserUuid: mockSetUserUuid,
      currentLang: 'en',
      setLanguage: vi.fn(),
    });
    useLocation.mockReturnValue({ pathname: '/' });

    const originalLocation = window.location;
    delete window.location;
    window.location = { href: 'http://localhost/' };

    render(
      <MemoryRouter>
        <Header headerShow />
      </MemoryRouter>
    );

    const logoutButton = screen.getByTitle(/log out/i);
    await userEvent.click(logoutButton);

    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('user_uuid')).toBeNull();
    expect(window.location.href).toBe('/sign-in');

    window.location = originalLocation;
  });
});
