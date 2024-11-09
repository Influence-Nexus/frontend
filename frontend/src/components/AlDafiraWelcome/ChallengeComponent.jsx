import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ChallengeComponent.module.css";

const ChallengeComponent = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [showText, setShowText] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 3000);

    const videoTimer = setTimeout(() => {
      setShowVideo(true);
      setShowText(false);
    }, 10000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(videoTimer);
    };
  }, []);

  const handleVideoEnd = () => {
    navigate("/solar");
  };

  return (
    <main className={styles.challengeContainer}>
      <section className={styles.heroSection}>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/60c36393ab5789e8bbbfdbcd4e0af221f7f9e604cca448a66ac1f2954b93d1b2?placeholderIfAbsent=true&apiKey=bb57d50f14b1477582a4d5db25b73723"
          className={`${styles.backgroundImage}`}
          alt=""
        />
        
        <div className={styles.burningStar}></div>

        <svg
          className={styles.constellationLine}
          viewBox="0 0 100 100"
          style={{
            position: "absolute",
            top: "60px",
            left: "345px",
            width: "385px",
            height: "250px",
          }}
        >
          <line
            x1="-100"
            y1="100"
            x2="45"
            y2="20"
            stroke="white"
            strokeWidth="0.5"
            strokeLinecap="round"
          />
          <line
            x1="45"
            y1="20"
            x2="75"
            y2="85"
            stroke="white"
            strokeWidth="0.5"
            strokeLinecap="round"
          />
        </svg>

        <div className={styles.contentWrapper}>
          <h1 className="challengeText">
            Challenge your mind
            <span style={{ fontFamily: "Reggae One, cursive" }}>!</span>
          </h1>
          <h1 className={styles.comabla}>Coma Berenices</h1>

          {showText && <h2 className={styles.letsGoText}>Let's go!</h2>}
        </div>
      </section>

      {showVideo && (
        <div className={styles.videoOverlay}>
          <video
            ref={videoRef}
            src="premain.mp4"
            className={styles.fullScreenVideo}
            onEnded={handleVideoEnd}
            autoPlay
            muted
            playsInline
            controls
          />
        </div>
      )}
    </main>
  );
};

export default ChallengeComponent;