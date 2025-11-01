export const componentMap = {
  'RulesPage-ru': () => import('./Components/RulesPage/ru/RulesPageRU.jsx'),
  'RulesPage-en': () => import('./Components/RulesPage/en/RulesPageEN.jsx'),

  'SignIn-ru': () => import('./Components/UserCreds/ru/SignInRU.jsx'),
  'SignIn-en': () => import('./Components/UserCreds/en/SignInEN.jsx'),

  'SignUp-ru': () => import('./Components/UserCreds/ru/SignUpRU.jsx'),
  'SignUp-en': () => import('./Components/UserCreds/en/SignUpEN.jsx'),

  'ChallengeComponent-ru': () =>
    import('./Components/AldafiraWelcome/ru/ChallengeComponentRU.jsx'),
  'ChallengeComponent-en': () =>
    import('./Components/AldafiraWelcome/en/ChallengeComponentEN.jsx'),

  'ComaBerenicesPage-ru': () =>
    import('./Components/ComaBerenicesPage/ru/ComaBerenicesPageRU.jsx'),
  'ComaBerenicesPage-en': () =>
    import('./Components/ComaBerenicesPage/en/ComaBerenicesPageEN.jsx'),

  'SciencePage-ru': () => import('./Components/Science/ru/SciencePageRU.jsx'),
  'SciencePage-en': () => import('./Components/Science/en/SciencePageEN.jsx'),

  'AlgoPage-ru': () => import('./Components/Science/ru/AlgoPageRU.jsx'),
  'AlgoPage-en': () => import('./Components/Science/en/AlgoPageEN.jsx'),

  'SolarSystem-ru': () => import('./Components/Solar/ru/SolarSystemRU.jsx'),
  'SolarSystem-en': () => import('./Components/Solar/en/SolarSystemEN.jsx'),

  'GraphMainLayout-en': () =>
    import('./Components/Graph/en/GraphMainLayoutEN.jsx'),
  'GraphMainLayout-ru': () =>
    import('./Components/Graph/ru/GraphMainLayoutRU.jsx'),
};
