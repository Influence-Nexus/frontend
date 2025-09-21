import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fetchJson, registerUser, loginUser } from '../clientServerHub.js';

// Простая реализация localStorage для тестов
function createLocalStorageMock() {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value;
    },
    removeItem: (key) => delete store[key],
    clear: () => {
      store = {};
    },
  };
}

describe('clientServerHub', () => {
  let fetchSpy;

  beforeEach(() => {
    fetchSpy = vi.spyOn(global, 'fetch');
    global.localStorage = createLocalStorageMock();
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('refreshes token on 401 and retries request', async () => {
    localStorage.setItem('refresh_token', 'refresh');

    fetchSpy
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: vi.fn().mockResolvedValue({}),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ access_token: 'new-access' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ data: 123 }),
      });

    const result = await fetchJson('/test');

    expect(result).toEqual({ data: 123 });
    expect(fetchSpy).toHaveBeenCalledTimes(3);
    expect(localStorage.getItem('access_token')).toBe('new-access');
  });

  it('registerUser saves user_uuid', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({ user_uuid: 'abc' }),
    });

    const res = await registerUser('user', 'email', 'pass');

    expect(res).toEqual({ user_uuid: 'abc' });
    expect(localStorage.getItem('user_uuid')).toBe('abc');
  });

  it('loginUser saves tokens', async () => {
    const payload = { sub: 'user123' };
    const base64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const token = `h.${base64}.s`;

    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({ access_token: token }),
    });

    const res = await loginUser('user', 'pass');

    expect(res).toEqual({ access_token: token });
    expect(localStorage.getItem('access_token')).toBe(token);
    expect(localStorage.getItem('user_uuid')).toBe('user123');
  });

  it('returns empty object on invalid JSON', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockRejectedValue(new Error('bad json')),
    });

    const res = await fetchJson('/bad');
    expect(res).toEqual({});
  });
});
