import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

vi.mock('../ComponentMap', () => ({ componentMap: {} }));
vi.mock('../CustomStates', () => ({ useCustomStates: vi.fn() }));
vi.mock('react-router-dom', () => ({ useParams: () => ({}) }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('DynamicComponentLoader', () => {
  it('loads component for current language', async () => {
    vi.resetModules();
    const { componentMap } = await import('../ComponentMap');
    const { useCustomStates } = await import('../CustomStates');
    Object.keys(componentMap).forEach((key) => delete componentMap[key]);
    useCustomStates.mockReturnValue({ currentLang: 'ru' });
    componentMap['Test-ru'] = vi.fn(() =>
      Promise.resolve({ default: () => <div>RU component</div> })
    );

    const { default: DynamicComponentLoader } = await import(
      '../DynamicComponentLoader.jsx'
    );

    render(<DynamicComponentLoader componentName="Test" />);

    expect(await screen.findByText('RU component')).toBeInTheDocument();
    expect(componentMap['Test-ru']).toHaveBeenCalledTimes(1);
  });

  it('falls back to English component when localized one is missing', async () => {
    vi.resetModules();
    const { componentMap } = await import('../ComponentMap');
    const { useCustomStates } = await import('../CustomStates');
    Object.keys(componentMap).forEach((key) => delete componentMap[key]);
    useCustomStates.mockReturnValue({ currentLang: 'ru' });
    componentMap['Test-en'] = vi.fn(() =>
      Promise.resolve({ default: () => <div>EN component</div> })
    );

    const { default: DynamicComponentLoader } = await import(
      '../DynamicComponentLoader.jsx'
    );

    render(<DynamicComponentLoader componentName="Test" />);

    expect(await screen.findByText('EN component')).toBeInTheDocument();
    expect(componentMap['Test-en']).toHaveBeenCalledTimes(1);
  });

  it('reuses cached component on subsequent renders', async () => {
    vi.resetModules();
    const { componentMap } = await import('../ComponentMap');
    const { useCustomStates } = await import('../CustomStates');
    Object.keys(componentMap).forEach((key) => delete componentMap[key]);
    useCustomStates.mockReturnValue({ currentLang: 'en' });
    componentMap['Test-en'] = vi.fn(() =>
      Promise.resolve({ default: () => <div>Cached component</div> })
    );

    const { default: DynamicComponentLoader } = await import(
      '../DynamicComponentLoader.jsx'
    );

    const { unmount } = render(<DynamicComponentLoader componentName="Test" />);
    expect(await screen.findByText('Cached component')).toBeInTheDocument();
    expect(componentMap['Test-en']).toHaveBeenCalledTimes(1);

    unmount();

    render(<DynamicComponentLoader componentName="Test" />);
    expect(await screen.findByText('Cached component')).toBeInTheDocument();

    await waitFor(() => {
      expect(componentMap['Test-en']).toHaveBeenCalledTimes(1);
    });
  });
});
