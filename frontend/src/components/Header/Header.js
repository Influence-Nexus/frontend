import React from "react";
import "./Header.css";
import SocialIcons from "./SocialIcons";

const Header = () => {
  return (
    <header className="App-header">
      <SocialIcons />
      <nav>
        <ul>
          <li>
            <a href="/">Главная</a>
          </li>
          <li>
            <a href="/">Контакты</a>
          </li>
          <li>
            <a href="/about">О проекте</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
