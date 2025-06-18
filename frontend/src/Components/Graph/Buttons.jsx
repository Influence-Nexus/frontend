import React, { useEffect, useState } from 'react';
import { useCustomStates } from '../../CustomStates';
import InfoIcon from '@mui/icons-material/Info';
import KeyIcon from "@mui/icons-material/Key";
import MenuIcon from '@mui/icons-material/Menu'; // Import MenuIcon
import { getScienceClicks, logScienceAttempt } from '../../clientServerHub';

export const Buttons = ({ matrixUuid, planetColor, planetImg }) => {
  const {
    isRunning,
    handleOpenModal,
    handleLoadCoordinates,
    handleResetCoordinates,
    handleSaveUserView,
    handleSaveDefaultView, applyCoordinates, setShowHistory
  } = useCustomStates();

  const [scienceClicks, setScienceClicks] = useState(null); // null пока не загрузилось
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for menu open/close

  // Загружаем текущее количество science_clicks при монтировании
  useEffect(() => {
    const fetchScienceClicks = async () => {
      try {
        const result = await getScienceClicks(matrixUuid); // Тот же эндпоинт, но без уменьшения
        if (result && result.science_clicks !== undefined) {
          setScienceClicks(result.science_clicks);
        }
      } catch (error) {
        console.error("Ошибка при получении science_clicks:", error.message);
      }
    };

    fetchScienceClicks();
  }, [matrixUuid]);

  const handleScienceClick = async () => {
    try {
      const result = await logScienceAttempt(matrixUuid);
      // console.log("Science attempt logged:", result);
      if (result && result.science_clicks !== undefined) {
        setScienceClicks(result.science_clicks); // Обновляем из ответа сервера
      }
    } catch (error) {
      console.error("Ошибка:", error.message);
      // Use a custom modal instead of alert
      // alert(error.message);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  // Закрываем меню при клике на любую кнопку на мобильных устройствах
  const handleButtonClick = (callback) => {
    return () => {
      callback();
      // Закрываем меню только если оно открыто и на мобильном устройстве (ширина менее 768px)
      if (isMenuOpen && window.innerWidth <= 768) {
        setIsMenuOpen(false);
      }
    };
  };

  return (
    <div
      className={`buttons-container ${isMenuOpen ? 'menu-open' : ''}`}
    >
      {/* Кнопка-переключатель меню для мобильных устройств */}
      <button className="menu-toggle" onClick={toggleMenu}>
        <MenuIcon /> Menu
      </button>

      <ul className="buttons-group" id="pills-tab" role="tablist">
        <li>
          <button id="details-button" className="game-button" onClick={handleButtonClick(handleOpenModal)}>
            <InfoIcon /> Details
          </button>
        </li>

        <li>
          <button
            id="science-button"
            className='game-button'
            onClick={handleButtonClick(handleScienceClick)}
            // disabled={scienceClicks !== null && scienceClicks <= 0}
            disabled
            title='Временно заблокирована!'
          >
            <p>Science</p>
            {scienceClicks !== null &&
              Array.from({ length: scienceClicks }, (_, index) => (
                <KeyIcon key={index} sx={{ marginRight: "4px" }} />
              ))
            }
          </button>
        </li>

        {/* Остальные кнопки */}
        <li>
          {/* GAME возвращает граф, без refresh */}
          <button
            className="game-button"
            id="game-button-divider"
            onClick={handleButtonClick(() => {
              setShowHistory(false);        // возвращаемся в граф
              if (matrixUuid && applyCoordinates) {
                handleLoadCoordinates(matrixUuid, applyCoordinates); // переобновляем координаты
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
            title={isRunning ? "Not available during the game" : ""}
            onClick={handleButtonClick(() => setShowHistory(true))}
          >
            Profile
          </button>
        </li>
        <li><button className="game-button" onClick={handleButtonClick(handleSaveUserView)}>Save View</button></li>
        <li><button
          className="game-button"
          onClick={handleButtonClick(() => handleResetCoordinates(matrixUuid, applyCoordinates))}
          title="Сбросить граф к дефолтным настройкам"
        >
          Reset
        </button>
        </li>
        <li>
          <button
            className="game-button"
            onClick={handleButtonClick(() => handleLoadCoordinates(matrixUuid, applyCoordinates))}
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
