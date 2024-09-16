import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import Spaceship from './Spaceship';
import GameInfo from '../UsersPages/GameInfo';
import "./SpaceshipView.css"

function SpaceshipView() {
  return (
    <Canvas style={{ height: "100vh" }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      
      {/* Космический корабль */}
      <Spaceship />
      
      {/* Info panel */}
      <Html position={[0, 10, 0]} className="info-panel" distanceFactor={20}>
        <GameInfo />
      </Html>
      
      {/* Запрещаем вращение камеры вокруг info panel */}
      <OrbitControls enableRotate={true} enablePan={true} enableZoom={true} target={[0, 0, 0]} />
      
    </Canvas>
  );
}

export default SpaceshipView;
