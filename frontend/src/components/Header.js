import React from 'react';
import './Header.css';
import SocialIcons from './SocialIcons';

const Header = () => {
  return (
    <header className="App-header">
      <nav>
        <ul>
          <li>Главная</li>
          <li>Контакты</li>
          <li>О проекте</li>
        </ul>
      </nav>
      <SocialIcons />
    </header>
  );
}

export default Header;
