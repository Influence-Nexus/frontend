// LoginPage.js
import React, { useState } from 'react';

export const LoginPage = () => {
  // Состояния для управления значениями полей формы
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Обработка отправки формы
  const handleSubmit = (e) => {
    e.preventDefault(); // Предотвращаем стандартную отправку формы
    console.log('Попытка входа:');
    console.log('Email:', email);
    console.log('Пароль:', password);

    // Здесь можно добавить логику аутентификации пользователя
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1 style={{ color: "white", justifyContent: "center", display: "flex" }}>Вход</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: 'auto' }}>
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
          Войти
        </button>
      </form>

      {/* Текст и ссылка "Нет аккаунта? Зарегистрироваться" */}
      <div style={{ marginTop: '15px', fontSize: '14px', color: "white" }}>
        <span>Нет аккаунта? </span>
        <a href="/registration" style={{ textDecoration: 'underline', color: '#007BFF', cursor: 'pointer' }}>
          Зарегистрироваться
        </a>
      </div>
    </div>
  );
};