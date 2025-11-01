import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { CODE } from '../CODE';
import { CognitionDecisionText } from '../CognitionDecisionText';

expect.extend(matchers);

describe('CODE component', () => {
  it('renders characters with correct ids', () => {
    render(<CODE />);

    const oChar = screen.getByText('о');
    const eChar = screen.getByText('Е');

    expect(oChar).toHaveAttribute('id', 'code-o');
    expect(eChar).toHaveAttribute('id', 'code-E');
  });
});

describe('CognitionDecisionText component', () => {
  beforeAll(() => {
    vi.spyOn(global.Image.prototype, 'src', 'set').mockImplementation(
      function () {
        if (this.onload) {
          this.onload();
        }
      }
    );
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('renders main image', () => {
    render(<CognitionDecisionText />);

    const image = screen.getByAltText('Code Challenge Illustration');
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass('mainImage');
  });
});
