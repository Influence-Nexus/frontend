import React, { useRef, useState, useEffect } from "react";
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, GodRays } from "@react-three/postprocessing";
import { OrbitControls, Stars, Html, Text } from "@react-three/drei";
import * as THREE from "three";
import {PlanetCard} from "./ModalWindowCards"
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css"; // Import the CSS file for styling


const SolarSystem = () => {
  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const sunRef = useRef();

  useEffect(() => {
    const appHeader = document.querySelector(".App-header");
    if (selectedPlanet) {
      appHeader.style.display = "none";
    } else {
      appHeader.style.display = "flex";
    }
  }, [selectedPlanet]);

  return (
    <div className="solar-system">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "absolute",
          top: "120px",
          left: "31%",
          zIndex: 1,
        }}
      >
        {/* <h1 className="text-block-solar">Al-Dafira</h1> */}
        <h1 className="text-block-solar">
          Challenge your mind
          <span style={{ fontFamily: "Reggae One, cursive" }}>!</span>
        </h1>
      </div>

      <Canvas style={{ height: "100vh" }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 4, 10]} />
        <Stars />
        <OrbitControls />
        <Scene
          sunRef={sunRef}
          setHoveredPlanet={setHoveredPlanet}
          setSelectedPlanet={setSelectedPlanet}
          selectedPlanet={selectedPlanet}
        />
        <EffectComposer>
          {sunRef.current && (
            <GodRays
              sun={sunRef.current}
              density={0.91}
              decay={0.9}
              weight={0.5}
              samples={60}
            />
          )}
        </EffectComposer>
      </Canvas>
      {/* {hoveredPlanet && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            color: "white",
            pointerEvents: "none",
          }}
        >
         {hoveredPlanet}
        </div>
      )} */}
      {selectedPlanet && (
        <PlanetCard
          selectedPlanet={selectedPlanet}
          setSelectedPlanet={setSelectedPlanet}
        />
      )}
    </div>
  );
};

const Scene = ({
  sunRef,
  setHoveredPlanet,
  setSelectedPlanet,
  selectedPlanet,
}) => {
  return (
    <>
      <Sun sunRef={sunRef} />
      <Orbit radius={12} speed={0.3}>
        <Planet
          name="Green"
          description="Жители планеты Green приняли всеобъемлющую стратегию сбережения ее природных ресурсов и жизни в окружении природы. Обеспечение качества среды обитания занимают первостепенное значение в принятии решений."
          // textureUrl="/imgs/1_green_upd.jpg"
          textureUrl="/imgs/green.jpg"
          size={1}
          setHoveredPlanet={setHoveredPlanet}
          setSelectedPlanet={setSelectedPlanet}
          selectedPlanet={selectedPlanet}
        />
      </Orbit>
      <Orbit radius={16} speed={-0.05}>
        <Planet
          name="Orange"
          description="Жители планеты Orange строят совершенное общественное устройство. Баланс социальных факторов определяет процветание нации. Настройка институционального комплекса во всех сферах жизни людей является первостепенной задачей."
          // textureUrl="/textures/drive-download-20241003T122711Z-001/1524-A seamless texture representing the adva-Juggernaut XL - Jugg_XI_by_RunDiffusion-422941055.png"
          textureUrl="/imgs/orange.jpg"
          size={1.1}
          setHoveredPlanet={setHoveredPlanet}
          setSelectedPlanet={setSelectedPlanet}
          selectedPlanet={selectedPlanet}
        />
      </Orbit>
      <Orbit radius={19} speed={0.05}>
        <Planet
          name="Violet"
          description="Жители планеты Violet сосредоточены на обеспечении устойчивого жизнеобеспечения, надежности и безопасности всех индустриальных и социально-экономических систем, развивающихся на планете. Предпочитают сберегающие методы, оказывающих положительное воздействие на окружающую среду, животных и людей."
          textureUrl="/textures/1534-A seamless texture representing the sust-Juggernaut XL - Jugg_XI_by_RunDiffusion-1572952848.png"
          size={1.3}
          setHoveredPlanet={setHoveredPlanet}
          setSelectedPlanet={setSelectedPlanet}
          selectedPlanet={selectedPlanet}
        />
      </Orbit>
    </>
  );
};

const Sun = ({ sunRef }) => {
  return (
    <mesh ref={sunRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial emissive={"#f5be76"} emissiveIntensity={7} />
      <Text position={[0, 5, 0]} fontSize={1.7} color="#ffffff">
        Al-Dafira
      </Text>
    </mesh>
  );
};

const Orbit = ({ children, radius, speed }) => {
  const planetRef = useRef();
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    planetRef.current.position.x = radius * Math.cos(elapsedTime * speed);
    planetRef.current.position.z = radius * Math.sin(elapsedTime * speed);
  });

  const points = [];
  for (let i = 0; i < 100; i++) {
    const angle = (i / 100) * 2 * Math.PI;
    points.push(
      new THREE.Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle))
    );
  }

  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <>
      <lineLoop geometry={orbitGeometry}>
        <lineBasicMaterial attach="material" color="rgba(0,0,0, 0.01)" />
      </lineLoop>
      <group ref={planetRef}>
        {React.cloneElement(children, { planetRef })}
      </group>
    </>
  );
};

const Planet = ({
  name,
  description,
  textureUrl,
  size,
  setHoveredPlanet,
  setSelectedPlanet,
  selectedPlanet,
  planetRef,
}) => {
  const texture = useLoader(THREE.TextureLoader, textureUrl);
  const { camera } = useThree();

  useFrame(() => {
    if (selectedPlanet && selectedPlanet.name === name) {
      const planetPosition = planetRef.current.position;
      camera.position.lerp(
        new THREE.Vector3(
          planetPosition.x + size * 3,
          planetPosition.y + size * 2,
          planetPosition.z + size * 3
        ),
        0.1
      );
      camera.lookAt(planetPosition);
    }
  });

  const handleClick = () => {
    setSelectedPlanet({
      name,
      description,
      position: planetRef.current.position,
    });
  };

  return (
    <group ref={planetRef}>
      <mesh
        onPointerOver={() => setHoveredPlanet(name)}
        onPointerOut={() => setHoveredPlanet(null)}
        onClick={handleClick}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          map={texture} // Используем текстуру
          emissiveIntensity={0.5}
          roughness={0.5} // Установите шероховатость
          metalness={0.5} // Установите металлический эффект
        />
      </mesh>
      <Text position={[0, 3.5, 0]} fontSize={1} color="#ffffff">
        {name}
      </Text>
    </group>
  );
};



export default SolarSystem;
