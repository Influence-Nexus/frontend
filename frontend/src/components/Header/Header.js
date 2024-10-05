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
          <li><Link to={"/"}>Main</Link></li>
          {/* <li>Контакты</li> */}
          <li>Project</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
