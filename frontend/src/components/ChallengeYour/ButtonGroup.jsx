import React from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";

import styles from "./CodeChallenge.module.css";

const ButtonGroup = () => {
  const audioRef = useRef(null);

  const playMusic = () => {
    const music = document.getElementById("backgroundMusic");
    if (music) {
      music.play().catch((error) => {
        console.error("Не удалось запустить музыку:", error);
      });
    }
  };

  const pauseMusic = () => {
    const music = document.getElementById("backgroundMusic");
    if (music) {
      music.pause();
    }
  };

  return (
    <div className={styles.buttonContainer}>
      <Link style={{ color: "black" }} to={"./ChallengeComponent"}>
        <button className={styles.playButton} onClick={playMusic}>
          Play{" "}
        </button>
      </Link>
      <Link style={{ color: "rgba(255, 232, 28, 1)" }} to={"./rules"}>
        <button className={styles.aboutButton}>About</button>
      </Link>
    </div>
  );
};

export default ButtonGroup;
