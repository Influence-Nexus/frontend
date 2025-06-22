// StaticCanvasWrapper.jsx
import React from 'react';
import SolarSystemRU from './Components/Solar/ru/SolarSystemRU';
import SolarSystemEN from './Components/Solar/en/SolarSystemEN';
import { useCustomStates } from './CustomStates';

const StaticCanvasWrapper = ({ setHeaderShow }) => {
  const { currentLang } = useCustomStates();

  return currentLang === 'ru' ? (
    <SolarSystemRU setHeaderShow={setHeaderShow} />
  ) : (
    <SolarSystemEN setHeaderShow={setHeaderShow} />
  );
};

export default React.memo(StaticCanvasWrapper);
