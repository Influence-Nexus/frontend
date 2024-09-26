import React from 'react';

import styles from './CodeChallenge.module.css';


const Header = () => {

  return (

    <header className={styles.header}>

      <div className={styles.logoContainer}>

        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/0a62fcf87e9f72720fb7c64bd719b6224a19724066eec2786d429ea545557549?placeholderIfAbsent=true&apiKey=bb57d50f14b1477582a4d5db25b73723" className={styles.logoImage} alt="Logo" />

        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/573ed59f1463406e2afc4322685b2fa6abcf415b870478f855a1013df1ae4c69?placeholderIfAbsent=true&apiKey=bb57d50f14b1477582a4d5db25b73723" className={styles.logoImageSecondary} alt="Secondary Logo" />

      </div>

      <nav className={styles.navigation}>

        <a href="#" className={styles.navItem}>Главная</a>

        <a href="#" className={styles.navItem}>Контакты</a>

        <a href="#" className={styles.navItem}>О проекте</a>

      </nav>

    </header>

  );

};


export default Header;
