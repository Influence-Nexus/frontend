import React from 'react';
import { useGLTF } from '@react-three/drei';

function Spaceship() {
  const { scene } = useGLTF('/models/scene.gltf');
  return <primitive object={scene} scale={1} position={[0, 0, 0]} />;
}

export default Spaceship;
