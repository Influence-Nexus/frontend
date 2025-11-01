import React, { useState, useEffect } from 'react';
import { useCustomStates } from '../../CustomStates';

const VerticalProgressBar = () => {
  const { currentTime, maxTime } = useCustomStates();

  const [isPortraitMobile, setIsPortraitMobile] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortraitMobile(
        window.innerWidth <= 767 && window.innerHeight > window.innerWidth
      );
    };

    checkOrientation();

    window.addEventListener('resize', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
    };
  }, []);

  const percentage = Math.min((currentTime / maxTime) * 100, 100);

  return (
    <div className="vertical-progress-bar">
      <div
        className="vertical-progress-bar-fill"
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
