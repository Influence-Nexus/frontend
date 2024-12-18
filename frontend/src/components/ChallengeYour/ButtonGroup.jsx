// ButtonGroup.js
import React from "react";
import { Link } from "react-router-dom";
import styles from "./CodeChallenge.module.css";

const ButtonGroup = () => {

  return (
    <div className={styles.buttonContainer}>
      <Link style={{ color: "black" }} to={"./ChallengeComponent"}>
        <button className={styles.playButton}>
          Play
        </button>
      </Link>
      <Link style={{ color: "rgba(255, 232, 28, 1)" }} to={"./rules"}>
        <button className={styles.aboutButton}>Info</button>
      </Link>
    </div>
  );
};

export default ButtonGroup;
