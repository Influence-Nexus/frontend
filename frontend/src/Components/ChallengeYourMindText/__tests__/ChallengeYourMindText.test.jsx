import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { ChallengeYourMindText } from '../ChallengeYourMindText';

describe('ChallengeYourMindText', () => {
  it('renders the challenge text with sign', () => {
    render(<ChallengeYourMindText />);
    const textElement = screen.getByRole('heading', {
      name: /Challenge your mind/,
    });
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveTextContent('Challenge your mind!');
    const sign = within(textElement).getByText('!');
    expect(sign).toHaveClass('challenge-text-sign');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<ChallengeYourMindText />);
    expect(asFragment()).toMatchSnapshot();
  });
});
