/* eslint-disable react/no-unknown-property */
import React, { useEffect, useRef, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { EffectComposer, GodRays } from '@react-three/postprocessing';
import { OrbitControls, Stars } from '@react-three/drei';
import { PlanetCardModal } from './ModalWindowCards/ModalWindowCardsRU';
import '../SolarSystem.css';
import { ChallengeYourMindText } from '../../ChallengeYourMindText/ChallengeYourMindText';
import CameraResetter from '../CameraResetter';
import { Scene } from '../SolarSystemRender/Scene';
import { useCustomStates } from '../../../CustomStates';

const RenderController = ({ isPaused }) => {
  useThree();

  useFrame(() => {
    if (isPaused) {
      return false;
    }
  });

  return null;
};

const MemoizedScene = React.memo(Scene);
const MemoizedStars = React.memo(Stars);
const MemoizedChallengeText = React.memo(ChallengeYourMindText);

const SolarSystemRU = ({ setHeaderShow }) => {
  useEffect(() => {
    setHeaderShow(false);
  }, [setHeaderShow]);

  const { setHoveredPlanet, selectedPlanet, setSelectedPlanet, hoveredPlanet } =
    useCustomStates();

  const sunRef = useRef();
  const isPaused = selectedPlanet !== null;

  const canvasSettings = useMemo(
    () => ({
      camera: { position: [35, 5, 25], fov: 70 },
      style: { height: '100vh' },
    }),
    []
  );

  const godRaysSettings = useMemo(
    () => ({
      density: 0.85,
      decay: 0.85,
      weight: 0.4,
      samples: 30,
      clampMax: 1,
    }),
    []
  );

  return (
    <div className="solar-system">
      <div className="solar-challege-text-container">
        <MemoizedChallengeText />
      </div>

      <Canvas
        {...canvasSettings}
        onCreated={({ gl }) => {
          console.log('✅ WebGLRenderer создан', gl);

          const canvas = gl.domElement;
          const handleContextLost = (event) => {
            event.preventDefault();
            console.warn('❌ WebGL контекст потерян!');
          };

          canvas.addEventListener('contextlost', handleContextLost, false);
        }}
        onContextLost={(event) => {
          event.preventDefault();
          console.warn('❌ WebGL контекст потерян!');
        }}
      >
        <RenderController isPaused={isPaused} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 4, 10]} />
        <MemoizedStars />
        <OrbitControls
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          maxDistance={100}
          minDistance={5}
          enabled={!isPaused}
        />
        <CameraResetter selectedPlanet={selectedPlanet} />
        <MemoizedScene
          sunRef={sunRef}
          setHoveredPlanet={setHoveredPlanet}
          setSelectedPlanet={setSelectedPlanet}
          selectedPlanet={selectedPlanet}
          hoveredPlanet={hoveredPlanet}
          isPaused={isPaused}
        />
        {!isPaused && sunRef.current && (
          <EffectComposer multisampling={0}>
            <GodRays sun={sunRef.current} {...godRaysSettings} />
          </EffectComposer>
        )}
      </Canvas>

      {selectedPlanet && (
        <PlanetCardModal
          selectedPlanet={selectedPlanet}
          setSelectedPlanet={setSelectedPlanet}
        />
      )}
    </div>
  );
};

export default React.memo(SolarSystemRU);
