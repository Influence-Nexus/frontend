/* eslint-disable react/no-unknown-property */
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Orbit = ({ children, radius, speed, isPaused }) => {
  const planetRef = useRef();
  const angleRef = useRef(0);

  useFrame((_, delta) => {
    if (!planetRef.current || isPaused) return;

    angleRef.current = (angleRef.current + speed * delta) % (Math.PI * 2);

    planetRef.current.position.x = radius * Math.cos(angleRef.current);
    planetRef.current.position.z = radius * Math.sin(angleRef.current);
  });

  const orbitGeometry = React.useMemo(() => {
    const points = Array.from({ length: 64 }, (_, i) => {
      const angle = (i / 64) * Math.PI * 2;
      return new THREE.Vector3(
        radius * Math.cos(angle),
        0,
        radius * Math.sin(angle)
      );
    });
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [radius]);

  return (
    <>
      <lineLoop geometry={orbitGeometry}>
        <lineBasicMaterial attach="material" color="rgb(0,0,0)" />
      </lineLoop>
      <group ref={planetRef}>
        {React.isValidElement(children)
          ? React.cloneElement(children, { planetRef })
          : children}
      </group>
    </>
  );
};
