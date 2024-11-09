import React, { useState } from "react";
import "./SciencePageButtons.css";
import KeyIcon from "@mui/icons-material/Key";

export const SciencePageButtons = () => {
  const [science, setScience] = useState(2);

  const handleCheckSequence = () => {
    if (science != 0) {
      setScience(science - 1);
    } else {
      alert("You have no more attempts!");
    }
  };

  return (
    <div className="SciencePageButtons-div">
      <button id="game-button">
        <a href="/solar">
          <p>Game</p>
        </a>
      </button>

      <button id="science-button" onClick={() => handleCheckSequence()}>
        {/* <a href="/science"> */}
          <p>Science</p>
          {Array.from({ length: science }, (_, index) => (
            <KeyIcon key={index} sx={{marginRight: "4px"}}/>
          ))}
        {/* </a> */}
      </button>


      <button id="algo-button" onClick={() => handleCheckSequence()}>
          <h4>Algorithm</h4>
      </button>
    </div>
  );
};