import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ChallengeComponentEN from '../en/ChallengeComponentEN.jsx';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('ChallengeComponent', () => {
  let originalImage;
  let imageInstance;
  let playSpy;
  let pauseSpy;

  beforeEach(() => {
    vi.useFakeTimers();
    navigateMock.mockReset();

    originalImage = global.Image;
    global.Image = class {
      constructor() {
        imageInstance = this;
        this.onload = null;
      }
      set src(value) {
        this._src = value;
      }
    };

    playSpy = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockImplementation(() => {});
    pauseSpy = vi
      .spyOn(HTMLMediaElement.prototype, 'pause')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    global.Image = originalImage;
    playSpy.mockRestore();
    pauseSpy.mockRestore();
  });

  it('shows text, then video, and navigates to /solar', () => {
    const setHeaderShow = vi.fn();
    const { container } = render(
      <MemoryRouter>
        <ChallengeComponentEN setHeaderShow={setHeaderShow} />
      </MemoryRouter>
    );

    act(() => {
      imageInstance.onload();
    });

    // eslint-disable-next-line testing-library/no-node-access,testing-library/no-container
    const video = container.querySelector('video');

    fireEvent(video, new Event('canplay'));

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByText("Let's go!")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(video.classList.contains('visible')).toBe(true);

    fireEvent(video, new Event('ended'));
    expect(navigateMock).toHaveBeenCalledWith('/solar');
  });

  it('loads and releases background resources', () => {
    const setHeaderShow = vi.fn();
    const { container, unmount } = render(
      <MemoryRouter>
        <ChallengeComponentEN setHeaderShow={setHeaderShow} />
      </MemoryRouter>
    );

    act(() => {
      imageInstance.onload();
    });

    // eslint-disable-next-line testing-library/no-node-access,testing-library/no-container
    const video = container.querySelector('video');
    expect(imageInstance._src).toBeTruthy();
    expect(video).toBeInTheDocument();

    unmount();

    // eslint-disable-next-line testing-library/no-node-access,testing-library/no-container
    expect(container.querySelector('video')).not.toBeInTheDocument();
    expect(vi.getTimerCount()).toBe(0);
  });
});
