import React, { useState } from "react";
import "./SciencePageButtons.css";
import KeyIcon from "@mui/icons-material/Key";

export const SciencePageButtons = () => {
  const [science, setScience] = useState(2);

  const handleCheckSequence = () => {
    if (science != 0) {
      setScience(science - 1);
    } else {
      alert("У вас больше нет попыток!");
    }
  };

  return (
    <div className="SciencePage-div">
      <button id="game-button">
        <p>Game</p>
      </button>

      <button id="science-button" onClick={() => handleCheckSequence()}>
        <p>Science</p>
        {Array.from({ length: science }, (_, index) => (
          <KeyIcon key={index} />
        ))}
      </button>
    </div>
  );
};
