import React from "react";
import "./Header.css";
import SocialIcons from "./SocialIcons";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation(); // Используем хук useLocation для получения текущего URL
  return (
    <header className="App-header">
      <SocialIcons />
      <nav>
        <ul>
          <li className={location.pathname === "/" ? "active" : ""}>
            <Link to="/">Main</Link>
          </li>
          {/* <li>Контакты</li> */}
          <li className={location.pathname === "/registration" || location.pathname === "/login" ? "active" : ""}>
            <Link to="/registration">Registration</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
