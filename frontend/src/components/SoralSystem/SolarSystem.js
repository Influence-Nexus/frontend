import React, { useRef, useState } from "react";
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, GodRays } from "@react-three/postprocessing";
import { OrbitControls, Stars, Html, Text } from "@react-three/drei";
import * as THREE from "three";
import { Link } from "react-router-dom";
import { Carousel, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css"; // Import the CSS file for styling
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const SolarSystem = () => {
  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const sunRef = useRef();

  return (
    <div className="solar-system">
      <div
        style={{ position: "absolute", top: "240px", left: "320px", zIndex: 1 }}
      >
        {/* <h1 className='text-block-solar'>
            Звёздная система Al-Dafira<br></br>           
          </h1> */}
      </div>

      <Canvas style={{ height: "100vh" }}>
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 5, 5]} />
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
              density={0.96}
              decay={0.93}
              weight={0.5}
              samples={60}
            />
          )}
        </EffectComposer>
      </Canvas>
      {hoveredPlanet && (
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
      )}
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
          name="Blue-Green"
          description="Жители планеты Blue-Green приняли всеобъемлющую стратегию сбережения ее природных ресурсов и жизни в окружении природы. Обеспечение качества среды обитания занимают первостепенное значение в принятии решений."
          textureUrl="/textures/drive-download-20241003T122711Z-001/1523-A seamless, natural-style texture inspir-Juggernaut XL - Jugg_XI_by_RunDiffusion-768700044.png"
          size={0.5}
          setHoveredPlanet={setHoveredPlanet}
          setSelectedPlanet={setSelectedPlanet}
          selectedPlanet={selectedPlanet}
        />
      </Orbit>
      <Orbit radius={16} speed={-0.05}>
        <Planet
          name="Orange"
          description="Жители планеты Orange строят совершенное общественное устройство. Баланс социальных факторов определяет процветание нации. Настройка институционального комплекса во всех сферах жизни людей является первостепенной задачей."
          textureUrl="/textures/drive-download-20241003T122711Z-001/1524-A seamless texture representing the adva-Juggernaut XL - Jugg_XI_by_RunDiffusion-422941055.png"
          size={0.8}
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
          size={1}
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
      <Text position={[0, 3.5, 0]} fontSize={0.8} color="#ffffff">
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
      <Text position={[0, -3.5, 0]} fontSize={0.8} color="#ffffff">
        {name}
      </Text>
    </group>
  );
};

const PlanetCard = ({ selectedPlanet, setSelectedPlanet }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  const cards = {
    "Blue-Green": [
      {
        index: 0,
        title: "Связывание углерода",
        description: "Связывание углерода",
        link: "https://search.app/VePfKaJAwjYRozsM7",
        image:
          "https://pics.craiyon.com/2023-09-23/cd587327ae3648c493067e63fbe16932.webp",
      },
      {
        index: 1,
        title: "Глобальное потепление",
        description: "Глобальное потепление",
        link: "https://search.app/xXaWBqBmVUwJikXc9",
        image:
          "https://pics.craiyon.com/2023-09-16/2cb8e418aa87473aafb8a8c56aa0e773.webp",
      },
      {
        index: 2,
        title: "Качество и доступность среды обитания",
        description: "Качество и доступность среды обитания",
        link: "https://search.app/2aWfsW4YhZRGbd6UA",
        image:
          "https://pics.craiyon.com/2023-09-15/cd5c90837994479fbd580f5b7d64240c.webp",
      },
      {
        index: 3,
        title: "Коммерческое рыболовство",
        description: "Коммерческое рыболовство",
        link: "https://search.app/CWyYe4kaJtaShWyR8",
        image:
          "https://pics.craiyon.com/2023-11-10/ll7zHv8dSI2e0XDXjBW2xQ.webp",
      },
      {
        index: 4,
        title: "Спортивная рыбалка",
        description: "Спортивная рыбалка",
        link: "https://www.craiyon.com/image/2h8pJ0zuQD6mawpHOjH3zw",
        image:
          "https://pics.craiyon.com/2023-10-07/36ff413db3da42068dd0d4a34f660fb6.webp",
      },
      {
        index: 5,
        title: "Прогулочное катание на лодках",
        description: "Прогулочное катание на лодках",
        link: "https://www.craiyon.com/image/lMkDXUSNTuuwRuBOoFBeug",
        image:
          "https://pics.craiyon.com/2023-09-26/fd5b6d13339241f1be0409f19486cedb.webp",
      },
      {
        index: 6,
        title: "Производство дикого риса",
        description: "Производство дикого риса",
        link: "https://search.app/5ANeLspNrfGqRovKA",
        image:
          "https://pics.craiyon.com/2023-11-02/7284eedd54c446ea8137ca4e1557f4ec.webp",
      },
      {
        index: 7,
        title: "Урожайность озимой пшеницы",
        description: "Урожайность озимой пшеницы",
        link: "https://www.craiyon.com/image/-bcetbHzQheAf0vSOaLmpQ",
        image:
          "https://pics.craiyon.com/2023-11-26/nKXjW6YZTpq6tQLPENp29g.webp",
      },
      {
        index: 8,
        title: "Риск лесного пожара",
        description: "Риск лесного пожара",
        link: "",
        image: "/textures/wildfire.png",
      },
      {
        index: 9,
        title: "Деградация среды обитания",
        description: "Деградация среды обитания за счет вырубки лесов в сельской горной местности",
        link: "https://www.craiyon.com/image/riRK9KyZREqUyhEEWcf_UQ",
        image:
          "https://pics.craiyon.com/2023-09-26/0ba6de42a92742eca6765d15c71337d4.webp",
      },
    ],
    Violet: [
      {
        index: 0,
        title: "Средства к существованию на основе разведения крупного рогатого скота",
        description: "Средства к существованию на основе разведения крупного рогатого скота",
        link: "https://search.app/v3gP3M1KYo56szXT8",
        image: "IMAGE_LINK_11",
      },
      {
        index: 1,
        title: "Средства к существованию, основанные на растениеводстве и мелком скотоводстве",
        description: "Средства к существованию, основанные на растениеводстве и мелком скотоводстве",
        link: "https://search.app/1tYx1f76uoSNkcho9",
        image: "IMAGE_LINK_12",
      },
      {
        index: 2,
        title: "Средства к существованию, не связанные с сельским хозяйством",
        description: "Нефермерские средства к существованию в сельской местности",
        link: "https://search.app/SeUHtX8h8zrJR51r5",
        image: "IMAGE_LINK_13",
      },
      {
        index: 3,
        title: "Стабильность предприятия",
        description: "Стабильность предприятия",
        link: "https://search.app/S1XZLAQugrctiDJe9",
        image: "IMAGE_LINK_14",
      },
      {
        index: 4,
        title: "Надежность и безопасность автомобиля",
        description: "Надежность и безопасность автомобиля",
        link: "https://www.craiyon.com/image/B5R28A_3RZKJTn4WByAAvw",
        image: "IMAGE_LINK_15",
      },
      {
        index: 5,
        title: "Доля рынка",
        description: "Увеличение доли рынка компании за счет диверсификации",
        link: "https://search.app/1adA5qcaNaSWsvBHA",
        image: "IMAGE_LINK_16",
      },
      {
        index: 6,
        title: "Знания персонала",
        description: "Знания персонала",
        link: "https://search.app/b6cvsj1J5bs7hnGw6",
        image: "IMAGE_LINK_17",
      },
      {
        index: 7,
        title: "Производственные затраты",
        description: "Производственные затраты",
        link: "https://www.craiyon.com/image/SqgBjmGdRJClAq5mhav3bA",
        image: "IMAGE_LINK_18",
      },
      {
        index: 8,
        title: "Клинический риск применения лекарственных препаратов",
        description: "Клинический риск в администрировании лекарств",
        link: "https://www.craiyon.com/image/2U4cGPxeTn-tqFstIIAztA",
        image: "IMAGE_LINK_19",
      },
      {
        index: 9,
        title: "Выбор научной конференции",
        description: "Выбор научной конференции",
        link: "https://www.craiyon.com/image/5sG-Mkv2QVW-zAe2TRZblA",
        image: "IMAGE_LINK_20",
      },
      {
        index: 10,
        title: "Монтаж трубопроводов",
        description: "Монтаж трубопроводов",
        link: "https://www.craiyon.com/image/ATspx3rPR-ibVF982ERPsQ",
        image: "IMAGE_LINK_21",
      },
      {
        index: 11,
        title: "Энергетический переход",
        description: "Энергетический переход",
        link: "https://search.app/mkg6Ccuhs2v9xcqy8",
        image: "IMAGE_LINK_22",
      },
    ],
    Orange: [
      {
        index: 0,
        title: "Преступление и наказание",
        description: "Преступление и наказание",
        link: "https://www.craiyon.com/image/f2TkYJ46TqKyyl0Rt_GJ3g",
        image: "IMAGE_LINK_23",
      },
      {
        index: 1,
        title: "Кубинский ракетный кризис",
        description: "Кубинский ракетный кризис",
        link: "https://search.app/Yjx1o9gNj5d2jzaZ7",
        image: "IMAGE_LINK_24",
      },
      {
        index: 2,
        title: "Финансовый кризис в Малайзии",
        description: "Финансовый кризис спекулятивных инвестиций",
        link: "https://search.app/Wy8Y3erT3fLKqgEB6",
        image: "IMAGE_LINK_25",
      },
      {
        index: 3,
        title: "Финансовый кризис в Южной Кореи",
        description: "Финансовый кризис промышленного развития",
        link: "https://search.app/Lf1xh2KB8mMmD1tT8",
        image: "IMAGE_LINK_26",
      },
      {
        index: 4,
        title: "Влияние ИТ на расходы по экономическому развитию",
        description: "Влияние ИТ на расходы по экономическому развитию",
        link: "https://www.craiyon.com/image/k_54MUGrRfCyrtE5GLuzJA",
        image: "IMAGE_LINK_27",
      },
      {
        index: 5,
        title: "Бездомность",
        description: "Бездомность",
        link: "https://www.craiyon.com/image/OUFGuuZ8RNuZ0gh-BvYh_Q",
        image: "IMAGE_LINK_28",
      },
    ],
  };

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = cards[selectedPlanet.name].slice(
    indexOfFirstCard,
    indexOfLastCard
  );

  const cardcreds = {
    "Blue-Green": {"name": "Blue-Green", "desc": "Жизнь в окружении природы / Сбережение природы / Качество среды обитания.", "src": "/imgs/green.jpg", "color": "#52ffbd"},
    "Orange": {"name": "Orange", "desc": "Совершенное общественное устройство / Баланс социальных факторов / Настройка институционального комплекса.", "src": "/imgs/orange.jpg", "color": "#ff8b2b"},
    "Violet": {"name": "Violet", "desc": "Устойчивое жизнеобеспечение / Сбережение природы / Надежность и безопасность.", "src": "/imgs/viol.png", "color": "#eea8ff"},
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(
    cards[selectedPlanet.name].length / cardsPerPage
  );

  return (
    <div className=" planet-cardcard text-white bg-dark mb-3">
      <div className="segment-domen">
        <div className="segment-domen-header">
          <div className="segment-domen-planet">
            <img className="planet-image" src={cardcreds[selectedPlanet.name].src} />
            <div>
            <h1 className="planet-name" style={{fontSize: "80px", color: cardcreds[selectedPlanet.name].color}}>{cardcreds[selectedPlanet.name].name}</h1>
            <h3><span style={{color: cardcreds[selectedPlanet.name].color}}>Стратегия жизни: </span>{cardcreds[selectedPlanet.name].desc}</h3>
            </div>
          </div>
          <Link to="/" className="return-main" style={{color: cardcreds[selectedPlanet.name].color, borderColor: cardcreds[selectedPlanet.name].color}}>Главная</Link>
        </div>

      <div className="segment-cards">
        {currentCards.map((segment, index) => (
          <div key={segment.index} className={`card text-white bg-secondary mb-3 segment-card segment-card-${index}`}>
            <div className="card-header">{segment.title}</div>
            <div className="card-body">
            <img className="d-block w-100" src={segment.image} alt={segment.title} />
              <p className="card-text">{segment.description}</p>
              <div className="text-center">
                <Link className="btn-CHECK" style={{color: cardcreds[selectedPlanet.name].color, borderColor: cardcreds[selectedPlanet.name].color}}to={`/matrix/${index + 1}`}>pick</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

        <div className="pagination-button">
          {/* Кнопки пагинации */}
          <div className="pagination">
            {currentPage > 1 && (
              <Button onClick={() => paginate(currentPage - 1)}>
                <ArrowBackIosIcon />
              </Button>
            )}
            {currentPage < totalPages && (
              <Button onClick={() => paginate(currentPage + 1)}>
                <ArrowForwardIosIcon />
              </Button>
            )}
          </div>
          {/* Добавляем кнопку для возврата к виду солнечной системы */}
          <Button
            variant="secondary"
            onClick={() => setSelectedPlanet(null)}
            className="mb-3"
          >
            <RestartAltIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SolarSystem;
