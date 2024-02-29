import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Подключаем файл стилей Bootstrap

const Header = () => {
  return (
    <header className="bg-dark text-white p-4">
      <div className="container">
        <h1 className="display-4">Influence Nexus Test</h1>
        <nav>
          <ul className="nav">
            <li className="nav-item">
              <a className="nav-link text-white" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/model">Test Model Loading</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/rules">Rules</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
