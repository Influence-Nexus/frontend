import React from 'react';

import styles from './CodeChallenge.module.css';

import ChallengeText from './ChallengeText';

import ButtonGroup from './ButtonGroup';


const CodeChallenge = () => {

  return (

    <main className={styles.mainContainer}>

      <ChallengeText />

      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/309134ca66c5e867836260d30c84ca84f65e54cb470101c66b8ad1d7260bcfd5?placeholderIfAbsent=true&apiKey=bb57d50f14b1477582a4d5db25b73723" className={styles.mainImage} alt="Code Challenge Illustration" />

      <ButtonGroup />

    </main>

  );

};


export default CodeChallenge;
