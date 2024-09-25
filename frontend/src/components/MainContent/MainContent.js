import React from "react";
import "./MainContent.css";

const MainContent = () => {
  return (
    <main>
      <h1>Challenge your mind!</h1>
      <div className="code">
        <span className="co">Co</span>
        <span className="de">De</span>
      </div>
      <div className="words">
        <span className="cognition">COGNITION</span>
        <span className="decision">DECISION</span>
      </div>
      <div className="buttons">
        <a href="/solar">
          <button className="play-button">Играть</button>
        </a>
        <a href="/about">
          <button className="about-button">О проекте</button>
        </a>
      </div>
    </main>
  );
};

export default MainContent;
