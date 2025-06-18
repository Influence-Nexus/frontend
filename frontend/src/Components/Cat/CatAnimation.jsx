import React, { useState, useEffect } from 'react';

const importAll = (requireContext) => {
  return requireContext.keys().map(requireContext);
};

const frames = importAll(require.context('./frames', false, /\.png$/));

const CatAnimation = ({
  frameRate = 45,
  timeToCross = 20,
  triggerAnimation,
  onAnimationEnd,
  stopAtX = window.innerWidth * 0.7,
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [xPosition, setXPosition] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const moveSpeed = window.innerWidth / (timeToCross * frameRate);

  useEffect(() => {
    if (triggerAnimation) {
      setIsRunning(true);
      setXPosition(100);
    }
  }, [triggerAnimation]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentFrame((prevFrame) => (prevFrame + 1) % frames.length);
      setXPosition((prevX) => {
        const nextX = prevX + moveSpeed;

        if (nextX >= stopAtX) {
          clearInterval(interval);
          setIsRunning(false);

          if (onAnimationEnd) {
            onAnimationEnd();
          }
          return stopAtX;
        }

        return nextX;
      });
    }, 1000 / frameRate);

    return () => clearInterval(interval);
  }, [isRunning, frameRate, moveSpeed, onAnimationEnd, stopAtX]);

  if (!isRunning) {
    return null;
  }

  return (
    <div style={styles.container}>
      <img
        src={frames[currentFrame]}
        alt={`Cat frame ${currentFrame + 1}`}
        style={{
          ...styles.image,
          transform: `translateX(${xPosition}px)`,
        }}
      />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: '83%',
  },
  image: {
    width: '450px',
    height: 'auto',
    position: 'absolute',
    left: 0,
  },
};

export default CatAnimation;
