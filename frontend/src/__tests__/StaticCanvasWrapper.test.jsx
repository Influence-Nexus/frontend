import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

import StaticCanvasWrapper from '../StaticCanvasWrapper';
import * as customStates from '../CustomStates';

vi.mock('../Components/Solar/ru/SolarSystemRU', () => ({
  default: () => <div data-testid="solar-ru" />,
}));

vi.mock('../Components/Solar/en/SolarSystemEN', () => ({
  default: () => <div data-testid="solar-en" />,
}));

afterEach(() => {
  vi.restoreAllMocks();
  cleanup();
});

describe('StaticCanvasWrapper', () => {
  it('renders SolarSystemRU when currentLang is ru', () => {
    vi.spyOn(customStates, 'useCustomStates').mockReturnValue({
      currentLang: 'ru',
    });

    render(<StaticCanvasWrapper setHeaderShow={() => {}} />);

    expect(screen.getByTestId('solar-ru')).toBeInTheDocument();
    expect(screen.queryByTestId('solar-en')).toBeNull();
  });

  it('renders SolarSystemEN when currentLang is en', () => {
    vi.spyOn(customStates, 'useCustomStates').mockReturnValue({
      currentLang: 'en',
    });

    render(<StaticCanvasWrapper setHeaderShow={() => {}} />);

    expect(screen.getByTestId('solar-en')).toBeInTheDocument();
    expect(screen.queryByTestId('solar-ru')).toBeNull();
  });
});
