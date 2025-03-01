import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

export const LoginPage = () => {
  const navigate = useNavigate();

  // Используем "username" вместо "email"
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const payload = { username, password };

    try {
      const response = await fetch("http://localhost:5000/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage("Вход выполнен успешно!");
        localStorage.setItem("currentUser", username);

        // После успешного входа можно перенаправить пользователя, например, на страницу дашборда:
        setTimeout(() => navigate('/'), 2000);
      } else {
        setErrorMessage(result.error || "Ошибка входа");
      }
    } catch (error) {
      setErrorMessage("Ошибка при отправке данных на сервер: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Вход</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Никнейм"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="login-input"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
        />
        <button type="submit" className="login-button">
          Войти
        </button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <div className="login-footer">
        <span>Нет аккаунта? </span>
        <a href="/registration" className="login-link">
          Зарегистрироваться
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
