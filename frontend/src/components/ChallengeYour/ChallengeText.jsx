import React from 'react';

import styles from './CodeChallenge.module.css';


const ChallengeText = () => {

  return (

    <>

      <h1 className={styles.challengeText}>

        Challenge your mind <span style={{fontFamily: 'Reggae One, sans-serif'}}>!</span>

      </h1>

      <div className={styles.codeText}>

        C<span style={{fontSize: '168px'}}>о</span>D<span style={{fontSize: '128px'}}>Е</span>

      </div>

    </>

  );

};


export default ChallengeText;

