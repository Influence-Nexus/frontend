import React, { useEffect, useRef, useMemo } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { EffectComposer, GodRays } from "@react-three/postprocessing";
import { OrbitControls, Stars } from "@react-three/drei";
import { PlanetCardModal } from "./ModalWindowCards/ModalWindowCards";
import "./SolarSystem.css";
import { ChallengeYourMindText } from "../ChallengeYourMindText/ChallengeYourMindText";
import CameraResetter from "./CameraResetter";
import { Scene } from "./SolarSystemRender/Scene";
import { useCustomStates } from "../../CustomStates";

// Компонент для управления рендерингом
const RenderController = ({ isPaused }) => {
  useThree();
  
  useFrame(() => {
    if (isPaused) {
      // Пропускаем рендеринг, если на паузе
      return false;
    }
  });

  return null;
};

// Оптимизация с помощью React.memo
const MemoizedScene = React.memo(Scene);
const MemoizedStars = React.memo(Stars);
const MemoizedChallengeText = React.memo(ChallengeYourMindText);

const SolarSystem = ({ setHeaderShow }) => {
  useEffect(() => {
    setHeaderShow(false);
  }, [setHeaderShow]);

  const {
    setHoveredPlanet, 
    selectedPlanet, 
    setSelectedPlanet, 
    hoveredPlanet
  } = useCustomStates();
  
  const sunRef = useRef();
  const isPaused = selectedPlanet !== null;

  // Мемоизация настроек Canvas
  const canvasSettings = useMemo(() => ({
    camera: { position: [35, 5, 25], fov: 70 },
    style: { height: "100vh" }
  }), []);

  // Мемоизация настроек GodRays
  const godRaysSettings = useMemo(() => ({
    density: 0.85,
    decay: 0.85,
    weight: 0.4,
    samples: 30,
    clampMax: 1
  }), []);

  return (
    <div className="solar-system">
      <div className="solar-challege-text-container">
        <MemoizedChallengeText />
      </div>

      <Canvas {...canvasSettings}>
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
          enabled={!isPaused} // Отключаем управление при паузе
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
        {!isPaused && (
          <EffectComposer multisampling={0}>
            {sunRef.current && (
              <GodRays 
                sun={sunRef.current}
                {...godRaysSettings}
              />
            )}
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

export default React.memo(SolarSystem);
