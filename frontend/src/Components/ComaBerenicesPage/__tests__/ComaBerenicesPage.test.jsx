import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { CustomStatesProvider } from '../../../CustomStates';
import DynamicComponentLoader from '../../../DynamicComponentLoader';

expect.extend(matchers);

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({ pathname: '/en/coma-berenices' }),
    useParams: () => ({ lang: 'en' }),
    useNavigate: () => vi.fn(),
  };
});

describe('ComaBerenicesPage', () => {
  it('renders header and key sections', async () => {
    render(
      <CustomStatesProvider>
        <DynamicComponentLoader
          componentBaseDir="ComaBerenicesPage"
          componentName="ComaBerenicesPage"
        />
      </CustomStatesProvider>
    );

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /welcome to al-dafira/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { level: 2, name: /humanoids/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { level: 2, name: /housing/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { level: 2, name: /knowledge/i })
    ).toBeInTheDocument();
  });
});
