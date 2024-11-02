import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChallengeComponent.module.css';

const ChallengeComponent = () => {
  const [showVideo, setShowVideo] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  
  const handleGoClick = () => {
    setShowVideo(true);
  };

  const handleVideoEnd = () => {
    navigate('/solar  '); // Замените '/your-next-route' на ваш желаемый маршрут
  };

  return (
    <main className={styles.challengeContainer}>
      <section className={styles.heroSection}>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/60c36393ab5789e8bbbfdbcd4e0af221f7f9e604cca448a66ac1f2954b93d1b2?placeholderIfAbsent=true&apiKey=bb57d50f14b1477582a4d5db25b73723"
          className={styles.backgroundImage}
          alt=""
        />
        <div className={styles.contentWrapper}>
          <h1 className="challengeText">
            Challenge your mind <span style={{ fontFamily: 'Reggae One, sans-serif' }}>!</span>
          </h1>
          <h1 className={styles.comabla}>
          Coma Berenices 
          </h1>
          
          <button className={styles.ctaButton} onClick={handleGoClick}>
            GO
          </button>
        </div>
      </section>
      {showVideo && (
        <div className={styles.videoOverlay}>
          <video 
            ref={videoRef} 
            
            src="premain.mp4" // Замените 'path/to/your/video.mp4' на путь к вашему видео
            className={styles.fullScreenVideo} 
            onEnded={handleVideoEnd} 
            autoPlay 
            controls 
          />
        </div>
      )}
    </main>
  );
};

export default ChallengeComponent;