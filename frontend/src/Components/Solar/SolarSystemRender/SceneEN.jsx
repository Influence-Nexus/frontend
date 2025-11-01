import { Planet } from './Planet';
import { Sun } from './Sun';
import { Orbit } from './Orbit';
import GreenPlanetTexture from './assets/imgs/Green/GreenPlanetTexture.png';
import OrangePlanetTexture from './assets/imgs/Orange/OrangePlanetTexture.jpg';
import VioletPlanetTexture from './assets/imgs/Violet/VioletPlanetTexture.jpg';
import { useEffect } from 'react';

export const Scene = ({
  sunRef,
  setHoveredPlanet,
  setSelectedPlanet,
  selectedPlanet,
  hoveredPlanet,
  isPaused,
}) => {
  useEffect(() => {
    setHoveredPlanet('Orange');
  }, [setHoveredPlanet]);

  return (
    <>
      <Sun sunRef={sunRef} />

      <Orbit radius={12} speed={0.3} isPaused={isPaused}>
        <Planet
          name="Green"
          description="The inhabitants of planet Green have adopted a comprehensive strategy to conserve its natural resources and to live surrounded by nature. Ensuring the quality of the environment is of paramount importance in decision-making."
          textureUrl={GreenPlanetTexture}
          size={1}
          setHoveredPlanet={setHoveredPlanet}
          setSelectedPlanet={setSelectedPlanet}
          selectedPlanet={selectedPlanet}
        />
      </Orbit>

      <Orbit radius={18} speed={-0.05} isPaused={isPaused}>
        <Planet
          name="Orange"
          description="The inhabitants of planet Orange are building a perfect societal system. The balance of social factors determines the nation’s prosperity. Fine-tuning the institutional framework across all spheres of people’s lives is the foremost task."
          textureUrl={OrangePlanetTexture}
          size={1.1}
          setHoveredPlanet={setHoveredPlanet}
          setSelectedPlanet={setSelectedPlanet}
          selectedPlanet={selectedPlanet}
        />
      </Orbit>

      <Orbit radius={28} speed={0.05} isPaused={isPaused}>
        <Planet
          name="Violet"
          description="The inhabitants of planet Violet are focused on ensuring sustainable life support, reliability, and safety of all industrial and socio-economic systems developing on the planet. They prefer conservation methods that have a positive impact on the environment, animals, and people."
          textureUrl={VioletPlanetTexture}
          size={1.3}
          setHoveredPlanet={setHoveredPlanet}
          setSelectedPlanet={setSelectedPlanet}
          selectedPlanet={selectedPlanet}
        />
      </Orbit>
    </>
  );
};
