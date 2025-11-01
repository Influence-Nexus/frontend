import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { vi, afterEach, describe, test, expect } from 'vitest';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// eslint-disable-next-line import/first
import { MemoryRouter } from 'react-router-dom';
// eslint-disable-next-line import/first
import { CustomStatesProvider, useCustomStates } from '../CustomStates';

vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(),
}));

vi.mock('../clientServerHub', () => ({
  calculateScore: vi.fn(),
  getUserUuidFromToken: vi.fn(() => 'uuid'),
  loadDefaultCoordinatesAPI: vi.fn(),
  loadUserCoordinatesAPI: vi.fn(),
  saveGraphSettingsDefaultAPI: vi.fn(),
  saveUserGraphSettingsAPI: vi.fn(),
  resetGame: vi.fn(),
}));

const LangDisplay = () => {
  const { currentLang } = useCustomStates();
  return <span data-testid="lang">{currentLang}</span>;
};

const LangSetter = () => {
  const { currentLang, setLanguage } = useCustomStates();
  return (
    <div>
      <span data-testid="lang">{currentLang}</span>
      <button onClick={() => setLanguage('en')}>set</button>
    </div>
  );
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe('CustomStatesProvider', () => {
  test('initializes language from URL', async () => {
    render(
      <MemoryRouter initialEntries={['/en']}>
        <CustomStatesProvider>
          <LangDisplay />
        </CustomStatesProvider>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByTestId('lang').textContent).toBe('en')
    );
    expect(localStorage.getItem('language')).toBe('en');
  });

  test('initializes language from localStorage', async () => {
    localStorage.setItem('language', 'ru');

    render(
      <MemoryRouter initialEntries={['/']}>
        <CustomStatesProvider>
          <LangDisplay />
        </CustomStatesProvider>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByTestId('lang').textContent).toBe('ru')
    );
    expect(mockNavigate).toHaveBeenCalledWith('/ru', { replace: true });
  });

  test('setLanguage updates language and navigates', async () => {
    render(
      <MemoryRouter initialEntries={['/ru']}>
        <CustomStatesProvider>
          <LangSetter />
        </CustomStatesProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('set'));

    await waitFor(() =>
      expect(screen.getByTestId('lang').textContent).toBe('en')
    );
    expect(mockNavigate).toHaveBeenCalledWith('/en');
    expect(localStorage.getItem('language')).toBe('en');
  });

  test('preloads audio files', () => {
    const instances = [];
    const mockAudio = vi.fn(() => {
      const audio = { preload: '', play: vi.fn() };
      instances.push(audio);
      return audio;
    });
    vi.stubGlobal('Audio', mockAudio);

    render(
      <MemoryRouter initialEntries={['/en']}>
        <CustomStatesProvider>
          <LangDisplay />
        </CustomStatesProvider>
      </MemoryRouter>
    );

    expect(mockAudio).toHaveBeenCalledTimes(2);
    instances.forEach((a) => expect(a.preload).toBe('auto'));
  });
});
