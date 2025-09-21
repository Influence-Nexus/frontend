/* eslint-disable testing-library/no-container, testing-library/no-node-access */
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { useCustomStates } from '../../CustomStates';
import { GlobalAudioManager } from '../Audio';

vi.mock('../../CustomStates', () => ({
  useCustomStates: vi.fn(),
}));

describe('GlobalAudioManager', () => {
  it('assigns context ref to audio element', () => {
    const ref = React.createRef();
    useCustomStates.mockReturnValue({ backgroundMusicRef: ref });

    const { container } = render(<GlobalAudioManager />);
    const audio = container.querySelector('audio');

    expect(audio).toBeTruthy();
    expect(ref.current).toBe(audio);
  });

  it('sets loop and preload attributes correctly', () => {
    const ref = React.createRef();
    useCustomStates.mockReturnValue({ backgroundMusicRef: ref });

    const { container } = render(<GlobalAudioManager />);
    const audio = container.querySelector('audio');

    expect(audio).toHaveAttribute('loop');
    expect(audio).toHaveAttribute('preload', 'auto');
  });
});
