import React from "react";
import "./Header.css";
import SocialIcons from "./SocialIcons";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="App-header">
      <SocialIcons />
      <nav>
        <ul>
          <li><Link style={{color:"#ffd700"}} to={"/"}>Главная</Link></li>
          <li>Контакты</li>
          <li>О проекте</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
