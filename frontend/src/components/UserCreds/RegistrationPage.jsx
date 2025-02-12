// RegistrationPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate

export const RegistrationPage = () => {
  const navigate = useNavigate(); // Инициализируем хук useNavigate

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Форма отправлена:');
    console.log('Никнейм:', nickname);
    console.log('Email:', email);
    console.log('Пароль:', password);
  };

  const handleLoginClick = () => {
    navigate('/login'); // Переход на страницу /login
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1 style={{ color: "white", justifyContent: "center", display: "flex" }}>Регистрация</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: 'auto' }}>
        {/* Поле для ввода никнейма */}
        <input
          type="text"
          placeholder="Никнейм"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          style={{ padding: '8px', fontSize: '16px' }}
        />
        {/* Поле для ввода email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '8px', fontSize: '16px' }}
        />
        {/* Поле для ввода пароля */}
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '8px', fontSize: '16px' }}
        />
        {/* Кнопка отправки формы */}
        <button
          type="submit"
          style={{
            padding: '10px',
            fontSize: '16px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '5px'
          }}
        >
          Зарегистрироваться
        </button>
      </form>

      {/* Текст и ссылка "Уже есть аккаунт? Войти" */}
      <div style={{ marginTop: '15px', fontSize: '14px', color: "white" }}>
        <span>Уже есть аккаунт? </span>
        <span
          style={{ textDecoration: 'underline', color: '#007BFF', cursor: 'pointer' }}
          onClick={handleLoginClick}
        >
          Войти
        </span>
      </div>
    </div>
  );
};