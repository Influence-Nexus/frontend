import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('CatAnimation', () => {
  beforeEach(() => {
    vi.resetModules();

    Object.defineProperty(import.meta, 'glob', {
      value: vi.fn().mockReturnValue({
        './frames/frame1.png': { default: 'frame1.png' },
        './frames/frame2.png': { default: 'frame2.png' },
      }),
      configurable: true,
    });

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000,
    });
  });

  it('starts animation when triggerAnimation is true', async () => {
    const { default: CatAnimation } = await import('../CatAnimation.jsx');

    render(
      <CatAnimation
        triggerAnimation
        frameRate={1}
        timeToCross={1}
        stopAtX={150}
      />
    );

    await Promise.resolve();
    await Promise.resolve();
    const image = screen.getByAltText('Cat frame 1');
    expect(image).toBeInTheDocument();
    expect(image).toHaveStyle({ transform: 'translateX(100px)' });
  });

  it('calls onAnimationEnd when reaching stopAtX', async () => {
    const { default: CatAnimation } = await import('../CatAnimation.jsx');
    vi.useFakeTimers();
    const onAnimationEnd = vi.fn();

    render(
      <CatAnimation
        triggerAnimation
        frameRate={1}
        timeToCross={1}
        stopAtX={150}
        onAnimationEnd={onAnimationEnd}
      />
    );

    await Promise.resolve();
    await Promise.resolve();
    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(onAnimationEnd).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
