import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { componentMap } from '../ComponentMap';

// Map of keys to expected import paths
const expectedPaths = {
  'RulesPage-ru': './Components/RulesPage/ru/RulesPageRU.jsx',
  'RulesPage-en': './Components/RulesPage/en/RulesPageEN.jsx',
  'SignIn-ru': './Components/UserCreds/ru/SignInRU.jsx',
  'SignIn-en': './Components/UserCreds/en/SignInEN.jsx',
  'SignUp-ru': './Components/UserCreds/ru/SignUpRU.jsx',
  'SignUp-en': './Components/UserCreds/en/SignUpEN.jsx',
  'ChallengeComponent-ru':
    './Components/AldafiraWelcome/ru/ChallengeComponentRU.jsx',
  'ChallengeComponent-en':
    './Components/AldafiraWelcome/en/ChallengeComponentEN.jsx',
  'ComaBerenicesPage-ru':
    './Components/ComaBerenicesPage/ru/ComaBerenicesPageRU.jsx',
  'ComaBerenicesPage-en':
    './Components/ComaBerenicesPage/en/ComaBerenicesPageEN.jsx',
  'SciencePage-ru': './Components/Science/ru/SciencePageRU.jsx',
  'SciencePage-en': './Components/Science/en/SciencePageEN.jsx',
  'AlgoPage-ru': './Components/Science/ru/AlgoPageRU.jsx',
  'AlgoPage-en': './Components/Science/en/AlgoPageEN.jsx',
  'SolarSystem-ru': './Components/Solar/ru/SolarSystemRU.jsx',
  'SolarSystem-en': './Components/Solar/en/SolarSystemEN.jsx',
  'GraphMainLayout-en': './Components/Graph/en/GraphMainLayoutEN.jsx',
  'GraphMainLayout-ru': './Components/Graph/ru/GraphMainLayoutRU.jsx',
};

describe('componentMap', () => {
  const mockImport = vi.fn();

  beforeAll(() => {
    vi.stubGlobal('import', mockImport);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  Object.entries(expectedPaths).forEach(([key, path]) => {
    it(`maps ${key} to ${path}`, () => {
      const loader = componentMap[key];
      expect(loader).toBeInstanceOf(Function);
      const resolved = path.replace(/^\.\//, '/src/');
      expect(loader.toString()).toContain(resolved);
    });
  });

  it('throws error for unknown key', () => {
    const key = 'NonExistent';
    const loader = componentMap[key];
    expect(loader).toBeUndefined();
    expect(() => {
      if (!loader) throw new Error('Component not found');
      loader();
    }).toThrow('Component not found');
  });
});
