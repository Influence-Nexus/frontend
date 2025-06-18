import React, { useState, useEffect } from 'react';
import { useCustomStates } from '../../CustomStates';

const VerticalProgressBar = () => {
  const { currentTime, maxTime } = useCustomStates();

  const [isPortraitMobile, setIsPortraitMobile] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Проверяем, если ширина окна меньше или равна 767px (мобильный)
      // И если ориентация портретная (window.innerHeight > window.innerWidth)
      setIsPortraitMobile(
        window.innerWidth <= 767 && window.innerHeight > window.innerWidth
      );
    };

    // Проверяем при монтировании
    checkOrientation();

    // Добавляем слушатель события resize для обновления при изменении размера/ориентации
    window.addEventListener('resize', checkOrientation);

    // Очистка слушателя события при размонтировании компонента
    return () => {
      window.removeEventListener('resize', checkOrientation);
    };
  }, []);

  const percentage = Math.min((currentTime / maxTime) * 100, 100);

  return (
    <div className="vertical-progress-bar">
      <div
        className="vertical-progress-bar-fill"
        // Динамически применяем 'width' или 'height' в зависимости от ориентации
        style={
          isPortraitMobile
            ? { width: `${percentage}%` }
            : { height: `${percentage}%` }
        }
      />
    </div>
  );
};

export default VerticalProgressBar;
