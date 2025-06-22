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
      <div
        style={{
          margin: '0 245px',
        }}
      >
        <button
          onClick={() => setLanguage('en')}
          disabled={currentLang === 'en'}
          style={{ marginRight: '5px', padding: '8px 12px', cursor: 'pointer' }}
        >
          English
        </button>
        <button
          onClick={() => setLanguage('ru')}
          disabled={currentLang === 'ru'}
          style={{ padding: '8px 12px', cursor: 'pointer' }}
        >
          Русский
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
