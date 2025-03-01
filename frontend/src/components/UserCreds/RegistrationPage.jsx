import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistrationPage.css';

export const RegistrationPage = () => {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    const payload = {
      username: nickname,
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:5000/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok) {
        setSuccessMessage("Пользователь успешно зарегистрирован!");
        // Опционально: через несколько секунд перенаправляем на страницу логина
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setErrorMessage(result.error || "Ошибка регистрации");
      }
    } catch (error) {
      setErrorMessage("Ошибка при отправке данных на сервер: " + error.message);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="registration-container">
      <h1 className="registration-title">Регистрация</h1>
      <form onSubmit={handleSubmit} className="registration-form">
        <input
          type="text"
          placeholder="Никнейм"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          className="registration-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="registration-input"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="registration-input"
        />
        <button type="submit" className="registration-button">
          Зарегистрироваться
        </button>
      </form>
      
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="registration-footer">
        <span>Уже есть аккаунт? </span>
        <span className="registration-link" onClick={handleLoginClick}>
          Войти
        </span>
      </div>
    </div>
  );
};
