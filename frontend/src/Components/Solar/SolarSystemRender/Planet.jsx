import { Text } from '@react-three/drei';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import React, { useMemo } from 'react';

export const Planet = ({
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

  const atmosphereMaterial = useMemo(() => {
    const getGlowColor = (planetName) => {
      switch (planetName) {
        case 'Green':
          return '#52ffbd';
        case 'Orange':
          return '#ff8b2b';
        case 'Violet':
          return '#eea8ff';
        default:
          return '#ffffff';
      }
    };

    return new THREE.ShaderMaterial({
      uniforms: {
        c: { type: 'f', value: 0.2 },
        p: { type: 'f', value: 4.0 },
        glowColor: {
          type: 'c',
          value: new THREE.Color(getGlowColor(name)),
        },
        viewVector: { type: 'v3', value: camera.position },
      },
      vertexShader: `
                uniform vec3 viewVector;
                uniform float c;
                uniform float p;
                varying float intensity;
                void main() {
                    vec3 vNormal = normalize(normalMatrix * normal);
                    vec3 vNormel = normalize(normalMatrix * viewVector);
                    intensity = pow(c - dot(vNormal, vNormel), p);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
      fragmentShader: `
                uniform vec3 glowColor;
                varying float intensity;
                void main() {
                    vec3 glow = glowColor * intensity;
                    gl_FragColor = vec4(glow, 1.0);
                }
            `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
  }, [name, camera.position]);

  useFrame(() => {
    if (selectedPlanet?.name === name && planetRef.current) {
      const targetPosition = new THREE.Vector3(
        planetRef.current.position.x + size * 3,
        planetRef.current.position.y + size * 2,
        planetRef.current.position.z + size * 3
      );

      camera.position.lerp(targetPosition, 0.05);
      camera.lookAt(planetRef.current.position);
    }
  }, 1);

  const handleClick = () => {
    setSelectedPlanet({
      name,
      description,
      position: planetRef.current.position,
    });
  };

  const sphereGeometry = useMemo(
    () => new THREE.SphereGeometry(size, 24, 24),
    [size]
  );
  const atmosphereGeometry = useMemo(
    () => new THREE.SphereGeometry(size * 1.1, 24, 24),
    [size]
  );

  return (
    <group ref={planetRef}>
      <mesh
        onPointerOver={() => setHoveredPlanet(name)}
        onPointerOut={() => setHoveredPlanet(null)}
        onClick={handleClick}
        geometry={sphereGeometry}
      >
        <meshStandardMaterial
          map={texture}
          emissiveIntensity={0.5}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>
      {name === 'Green' && (
        <mesh geometry={atmosphereGeometry}>
          <primitive object={atmosphereMaterial} />
        </mesh>
      )}
      {name === 'Orange' && (
        <mesh geometry={atmosphereGeometry}>
          <primitive object={atmosphereMaterial} />
        </mesh>
      )}
      {name === 'Violet' && (
        <mesh geometry={atmosphereGeometry}>
          <primitive object={atmosphereMaterial} />
        </mesh>
      )}
      <Text position={[0, 3.5, 0]} fontSize={1} color="#ffffff">
        {name}
      </Text>
    </group>
  );
};
