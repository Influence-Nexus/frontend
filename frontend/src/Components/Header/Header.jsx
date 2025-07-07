import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import SocialIcons from './SocialIcons';
import { useCustomStates } from '../../CustomStates';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = ({ headerShow }) => {
  const location = useLocation();
  const { userUuid, setUserUuid } = useCustomStates();
  const { currentLang, setLanguage } = useCustomStates();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_uuid');
    setUserUuid(null);

    window.location.href = '/sign-in';
  };

  if (!headerShow) return null;

  return (
    <header className="App-header">
      <SocialIcons />
      <div className="lang-switcher">
        <button
          onClick={() => setLanguage('en')}
          disabled={currentLang === 'en'}
          className={`lang-btn${currentLang === 'en' ? ' active' : ''}`}
          aria-label="Switch to English"
        >
          <span role="img" className="fi fi-us" aria-label="English"></span>
        </button>
        <button
          onClick={() => setLanguage('ru')}
          disabled={currentLang === 'ru'}
          className={`lang-btn${currentLang === 'ru' ? ' active' : ''}`}
          aria-label="Переключить на русский"
        >
          <span role="img" className="fi fi-ru" aria-label="Русский"></span>
        </button>
      </div>
      <nav>
        <ul>
          <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/">Main</Link>
          </li>
          {userUuid ? (
            <li className="logout-icon">
              <button
                onClick={handleLogout}
                className="logout-button"
                title="Log Out"
              >
                <LogoutIcon fontSize="inherit" />
              </button>
            </li>
          ) : (
            <li className={location.pathname === '/sign-in' ? 'active' : ''}>
              <Link to="/sign-in">Sign in</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
