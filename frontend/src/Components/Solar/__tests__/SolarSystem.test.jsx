import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import SolarSystemEN from '../en/SolarSystemEN.jsx';
import { Planet } from '../SolarSystemRender/Planet.jsx';
import { Orbit } from '../SolarSystemRender/Orbit.jsx';

let frameCallbacks = [];
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => <div>{children}</div>,
  useThree: () => ({
    camera: { position: new THREE.Vector3(), lookAt: vi.fn() },
  }),
  useFrame: (cb) => {
    frameCallbacks.push(cb);
  },
  useLoader: vi.fn(() => ({ dispose: vi.fn() })),
}));

vi.mock('@react-three/drei', () => ({
  Text: ({ children }) => <div>{children}</div>,
  OrbitControls: ({ children }) => <div>{children}</div>,
  Stars: () => <div />,
}));

vi.mock('@react-three/postprocessing', () => ({
  EffectComposer: ({ children }) => <div>{children}</div>,
  GodRays: () => <div />,
}));

vi.mock('../SolarSystemRender/SceneEN', () => ({
  Scene: () => <div />,
}));

vi.mock('../CameraResetter', () => ({
  default: () => null,
}));

vi.mock('../../ChallengeYourMindText/ChallengeYourMindText', () => ({
  ChallengeYourMindText: () => <div />,
}));

vi.mock('../en/ModalWindowCards/ModalWindowCardsEN', () => ({
  PlanetCardModal: () => <div />,
}));

const mockState = {
  setHoveredPlanet: vi.fn(),
  selectedPlanet: { name: 'Earth' },
  setSelectedPlanet: vi.fn(),
  hoveredPlanet: null,
};

vi.mock('../../../CustomStates', () => ({
  useCustomStates: () => mockState,
}));

describe('Solar system components', () => {
  beforeEach(() => {
    frameCallbacks = [];
  });

  it('passes isPaused to RenderController', () => {
    render(<SolarSystemEN setHeaderShow={() => {}} />);
    expect(frameCallbacks.length).toBe(1);
    const result = frameCallbacks[0]();
    expect(result).toBe(false);
  });

  it('Planet calls setSelectedPlanet on click', () => {
    const setSelectedPlanet = vi.fn();
    const planetRef = React.createRef();
    const { container } = render(
      <Planet
        name="Mars"
        description="red planet"
        textureUrl="mars.jpg"
        size={1}
        setHoveredPlanet={() => {}}
        setSelectedPlanet={setSelectedPlanet}
        selectedPlanet={null}
        planetRef={planetRef}
      />
    );
    planetRef.current.position = new THREE.Vector3();
    const mesh = container.querySelector('mesh'); // eslint-disable-line testing-library/no-node-access, testing-library/no-container
    fireEvent.click(mesh);
    expect(setSelectedPlanet).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Mars',
        description: 'red planet',
        position: planetRef.current.position,
      })
    );
  });

  it('Orbit updates position based on speed', () => {
    let refFromChild;
    const DummyChild = ({ planetRef }) => {
      refFromChild = planetRef;
      return <mesh />;
    };

    render(
      <Orbit radius={5} speed={1} isPaused={false}>
        <DummyChild />
      </Orbit>
    );

    refFromChild.current.position = new THREE.Vector3(0, 0, 0);
    frameCallbacks[0](null, 1);
    expect(refFromChild.current.position.x).toBeCloseTo(5 * Math.cos(1));
    expect(refFromChild.current.position.z).toBeCloseTo(5 * Math.sin(1));
  });
});
