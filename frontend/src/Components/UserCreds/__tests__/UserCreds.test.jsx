import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { SignInEN } from '../en/SignInEN';
import { SignUpEN } from '../en/SignUpEN';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { loginUser, registerUser } from '../../../clientServerHub';
vi.mock('../../../clientServerHub', () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
  getUserUuidFromToken: vi.fn(() => 'uuid'),
}));

afterEach(cleanup);

describe('SignInEN', () => {
  const setHeaderShow = vi.fn();
  let originalLocation;

  beforeEach(() => {
    originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it('handles successful login', async () => {
    loginUser.mockImplementation(async () => {
      localStorage.setItem('access_token', 'token123');
      return { message: 'ok', access_token: 'token123' };
    });

    render(
      <MemoryRouter>
        <SignInEN setHeaderShow={setHeaderShow} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'user' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'pass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => expect(loginUser).toHaveBeenCalledWith('user', 'pass'));
    expect(localStorage.getItem('access_token')).toBe('token123');
    expect(window.location.href).toBe('/');
  });

  it('handles login error', async () => {
    loginUser.mockRejectedValue(new Error('Invalid credentials'));

    render(
      <MemoryRouter>
        <SignInEN setHeaderShow={setHeaderShow} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'user' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'pass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await screen.findByText(/invalid credentials/i);
    expect(localStorage.getItem('access_token')).toBeNull();
  });
});

describe('SignUpEN', () => {
  const setHeaderShow = vi.fn();
  let originalLocation;

  beforeEach(() => {
    originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };
    vi.clearAllMocks();
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it('handles successful registration', async () => {
    registerUser.mockResolvedValue({ message: 'ok' });

    render(
      <MemoryRouter>
        <SignUpEN setHeaderShow={setHeaderShow} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'user' },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'pass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => expect(registerUser).toHaveBeenCalled());
    expect(window.location.href).toBe('/sign-in');
  });

  it('handles registration error', async () => {
    registerUser.mockRejectedValue(new Error('Server error'));

    render(
      <MemoryRouter>
        <SignUpEN setHeaderShow={setHeaderShow} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'user' },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'pass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await screen.findByText(/server error/i);
    expect(window.location.href).not.toBe('/sign-in');
  });
});
