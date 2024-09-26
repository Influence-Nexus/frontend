import React, { useRef } from 'react';
import './MainContent.css';

const MainContent = () => {
  const audioRef = useRef(null);

  const playMusic = () => {
    const music = document.getElementById('backgroundMusic');
    if (music) {
      music.play().catch((error) => {
        console.error('Не удалось запустить музыку:', error);
      });
    }
  };

  const pauseMusic = () => {
    const music = document.getElementById('backgroundMusic');
    if (music) {
      music.pause();
    }
  };

  return (
    <main className='codemain'>
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
        <button className="play-button" onClick={playMusic}>Играть</button>
        <button className="about-button">О проекте</button>
      </div>
    </main>
  );
}

export default MainContent;
    