import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RulesPageEN from '../en/RulesPageEN.jsx';
import RulesPageRU from '../ru/RulesPageRU.jsx';
import '@testing-library/jest-dom/vitest';

describe('RulesPage', () => {
  const locales = [
    ['English', RulesPageEN],
    ['Russian', RulesPageRU],
  ];

  it.each(locales)(
    'applies setHeaderShow and shows GUIDE link and image in %s locale',
    (_, Component) => {
      const setHeaderShow = vi.fn();
      render(
        <MemoryRouter>
          <Component setHeaderShow={setHeaderShow} />
        </MemoryRouter>
      );
      expect(setHeaderShow).toHaveBeenCalledWith(true);
      expect(screen.getAllByText('GUIDE').length).toBeGreaterThan(0);
      expect(screen.getAllByRole('img').length).toBeGreaterThan(0);
    }
  );
});
