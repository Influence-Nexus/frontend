import { useEffect } from "react";

export const BackgroundMusic = ({ volume = 0.1 }) => {
  useEffect(() => {
    const audio = document.getElementById('backgroundMusic');
    
    if (audio) {
      audio.volume = volume; // устанавливаем громкость из пропса
    }

    const playAudio = () => {
      audio.play().catch(error => {
        console.log("Автовоспроизведение заблокировано браузером:", error);
      });
    };

    window.addEventListener('load', playAudio);
    document.addEventListener('click', playAudio);
    document.addEventListener('keydown', playAudio);
    document.addEventListener('touchstart', playAudio);

    return () => {
      window.removeEventListener('load', playAudio);
      document.removeEventListener('click', playAudio);
      document.removeEventListener('keydown', playAudio);
      document.removeEventListener('touchstart', playAudio);
    };
  }, [volume]);

  return (
    <audio id="backgroundMusic" loop autoPlay style={{ display: 'none' }}>
      <source src="/sounds/background.mp3" type="audio/mpeg" />
      Ваш браузер не поддерживает аудио.
    </audio>
  );
};
