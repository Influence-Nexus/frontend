import { useEffect, useState, useRef } from 'react';
import { useCustomStates } from '../../CustomStates';
import { Link } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';
import KeyIcon from '@mui/icons-material/Key';
import MenuIcon from '@mui/icons-material/Menu';
import { getScienceClicks, logScienceAttempt } from '../../clientServerHub';

export const Buttons = ({
  matrixUuid,
  planetColor,
  planetImg,
  onOpenDetailsModal,
}) => {
  const {
    isRunning,
    selectedPlanet,
    selectedCardIndex,
    handleLoadCoordinates,
    handleResetCoordinates,
    handleSaveUserView,
    applyCoordinates,
    setShowHistory,
  } = useCustomStates();

  const [scienceClicks, setScienceClicks] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonsContainerRef = useRef(null);

  useEffect(() => {
    const fetchScienceClicks = async () => {
      try {
        const result = await getScienceClicks(matrixUuid);
        if (result && result.science_clicks !== undefined) {
          setScienceClicks(result.science_clicks);
        }
      } catch (error) {
        console.error('Ошибка при получении science_clicks:', error.message);
      }
    };

    fetchScienceClicks();
  }, [matrixUuid]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        buttonsContainerRef.current &&
        !buttonsContainerRef.current.contains(event.target) &&
        window.innerWidth <= 768
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleScienceClick = async () => {
    try {
      const result = await logScienceAttempt(matrixUuid);

      if (result && result.science_clicks !== undefined) {
        setScienceClicks(result.science_clicks);
      }
    } catch (error) {
      console.error('Ошибка:', error.message);
      // alert(error.message);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleButtonClick = (callback) => {
    return (event) => {
      callback();

      if (
        isMenuOpen &&
        window.innerWidth <= 768 &&
        event.currentTarget.id !== 'menu-toggle-button'
      ) {
        setIsMenuOpen(false);
      }
    };
  };

  return (
    <div
      className={`buttons-container ${isMenuOpen ? 'menu-open' : ''}`}
      ref={buttonsContainerRef}
    >
      {/* Attach ref */}
      {/* Кнопка-переключатель меню для мобильных устройств */}
      <button
        id="menu-toggle-button"
        className="menu-toggle"
        onClick={toggleMenu}
      >
        <MenuIcon /> Menu
      </button>
      <ul className="buttons-group" id="pills-tab" role="tablist">
        <li>
          <button
            id="details-button"
            className="game-button"
            onClick={handleButtonClick(onOpenDetailsModal)} // Вызываем пропс onOpenDetailsModal
          >
            <InfoIcon /> Details
          </button>
        </li>

        <li>
          <Link
            to={`/science/${matrixUuid}`}
            state={{
              selectedPlanet,
              selectedCardIndex,
              planetColor,
              planetImg,
            }}
          >
            <button
              id="science-button"
              className="game-button"
              onClick={handleScienceClick}
              // disabled={scienceClicks !== null && scienceClicks <= 0}
              title="Временно заблокирована!"
            >
              <p>Science</p>
              {scienceClicks !== null &&
                Array.from({ length: scienceClicks }, (_, index) => (
                  <KeyIcon key={index} sx={{ marginRight: '4px' }} />
                ))}
            </button>
          </Link>
        </li>

        {/* Остальные кнопки */}
        <li>
          {/* GAME возвращает граф, без refresh */}
          <button
            className="game-button"
            id="game-button-divider"
            onClick={handleButtonClick(() => {
              setShowHistory(false);
              if (matrixUuid && applyCoordinates) {
                handleLoadCoordinates(matrixUuid, applyCoordinates);
              }
            })}
          >
            Game
          </button>
        </li>
        <li>
          {/* PROFILE показывает историю */}
          <button
            className="game-button"
            disabled={isRunning}
            title={isRunning ? 'Not available during the game' : ''}
            onClick={handleButtonClick(() => setShowHistory(true))}
          >
            Profile
          </button>
        </li>
        <li>
          <button
            className="game-button"
            onClick={handleButtonClick(handleSaveUserView)}
          >
            Save View
          </button>
        </li>
        <li>
          <button
            className="game-button"
            onClick={handleButtonClick(() =>
              handleResetCoordinates(matrixUuid, applyCoordinates)
            )}
            title="Сбросить граф к дефолтным настройкам"
          >
            Reset
          </button>
        </li>
        <li>
          <button
            className="game-button"
            onClick={handleButtonClick(() =>
              handleLoadCoordinates(matrixUuid, applyCoordinates)
            )}
            title="Загружает последний сохранённый вид графа"
          >
            Load Last View
          </button>
        </li>
        {/* <li>          <button className='game-button' onClick={handleButtonClick(handleSaveDefaultView)} title='Временная кнопка'>
            Save Graph (Default)
          </button>
        </li> */}
      </ul>
    </div>
  );
};
