import React, { useEffect, useState } from 'react';
import {
  loginUser,
  getUserUuidFromToken,
  requestPasswordReset,
  completePasswordReset,
  changePassword,
} from '../../../clientServerHub';
import '../UserCreds.css';
import { Link } from 'react-router-dom';

export const SignInRU = ({ setHeaderShow }) => {
  useEffect(() => {
    setHeaderShow(true);
  }, [setHeaderShow]);

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [view, setView] = useState('login');
  const [resetForm, setResetForm] = useState({
    email: '',
    token: '',
    newPassword: '',
  });
  const [changeFormState, setChangeFormState] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
  });

  const switchView = (mode) => {
    setView(mode);
    setError(null);
    setSuccessMsg('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleResetChange = (e) => {
    setResetForm({ ...resetForm, [e.target.name]: e.target.value });
  };

  const handleChangePasswordChange = (e) => {
    setChangeFormState({ ...changeFormState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg('');

    try {
      const response = await loginUser(form.username, form.password);
      setSuccessMsg(response.message || 'Вход выполнен успешно');

      const token = localStorage.getItem('access_token');
      // eslint-disable-next-line no-unused-vars
      const user_uuid = getUserUuidFromToken(token);
    } catch (err) {
      console.error('Ошибка входа:', err);
      setError(err.message);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg('');
    try {
      const response = await requestPasswordReset(resetForm.email);
      setSuccessMsg(
        response.message ||
          'Если почта зарегистрирована, создан токен для сброса пароля.'
      );
      setResetForm((prev) => ({
        ...prev,
        token: '',
        newPassword: '',
      }));
      setView('reset');
    } catch (err) {
      console.error('Ошибка восстановления пароля:', err);
      setError(err.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg('');
    try {
      const response = await completePasswordReset(
        resetForm.token,
        resetForm.newPassword
      );
      setSuccessMsg(response.message || 'Пароль обновлён. Можно входить.');
      setResetForm({ email: '', token: '', newPassword: '' });
      setView('login');
    } catch (err) {
      console.error('Ошибка сброса пароля:', err);
      setError(err.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg('');
    try {
      const response = await changePassword(
        changeFormState.username,
        changeFormState.currentPassword,
        changeFormState.newPassword
      );
      setSuccessMsg(response.message || 'Пароль успешно изменён.');
      setChangeFormState({
        username: '',
        currentPassword: '',
        newPassword: '',
      });
      setView('login');
    } catch (err) {
      console.error('Ошибка смены пароля:', err);
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>
        {view === 'login'
          ? 'Вход'
          : view === 'forgot'
            ? 'Восстановление пароля'
            : view === 'reset'
              ? 'Сброс пароля'
              : 'Смена пароля'}
      </h2>
      {error && <p className="auth-error">{error}</p>}
      {successMsg && <p className="auth-success">{successMsg}</p>}

      {view === 'login' && (
        <form
          onSubmit={async (e) => {
            await handleSubmit(e);
            if (!error) {
              window.location.href = '/';
            }
          }}
          className="auth-form"
        >
          <input
            name="username"
            placeholder="Имя пользователя"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Войти</button>
        </form>
      )}

      {view === 'forgot' && (
        <form onSubmit={handleForgotPassword} className="auth-form">
          <input
            type="email"
            name="email"
            placeholder="Электронная почта"
            value={resetForm.email}
            onChange={handleResetChange}
            required
          />
          <button type="submit">Получить токен</button>
        </form>
      )}

      {view === 'reset' && (
        <form onSubmit={handleResetPassword} className="auth-form">
          <input
            name="token"
            placeholder="Токен для сброса"
            value={resetForm.token}
            onChange={handleResetChange}
            required
          />
          <input
            type="password"
            name="newPassword"
            placeholder="Новый пароль"
            value={resetForm.newPassword}
            onChange={handleResetChange}
            required
          />
          <button type="submit">Обновить пароль</button>
        </form>
      )}

      {view === 'change' && (
        <form onSubmit={handleChangePassword} className="auth-form">
          <input
            name="username"
            placeholder="Имя пользователя"
            value={changeFormState.username}
            onChange={handleChangePasswordChange}
            required
          />
          <input
            type="password"
            name="currentPassword"
            placeholder="Текущий пароль"
            value={changeFormState.currentPassword}
            onChange={handleChangePasswordChange}
            required
          />
          <input
            type="password"
            name="newPassword"
            placeholder="Новый пароль"
            value={changeFormState.newPassword}
            onChange={handleChangePasswordChange}
            required
          />
          <button type="submit">Сохранить пароль</button>
        </form>
      )}

      {view === 'login' && (
        <>
          <p className="sign-in-up-p">
            Вы тут впервые?{' '}
            <Link className="sign-in-up-link" to={'/sign-up'}>
              Зарегистрироваться
            </Link>
          </p>
          <p className="sign-in-up-p">
            Забыли пароль?
            <button
              type="button"
              className="auth-switch-button"
              onClick={() => switchView('forgot')}
            >
              Восстановить доступ
            </button>
          </p>
          <p className="sign-in-up-p">
            Хотите сменить пароль?
            <button
              type="button"
              className="auth-switch-button"
              onClick={() => switchView('change')}
            >
              Изменить пароль
            </button>
          </p>
        </>
      )}

      {view !== 'login' && (
        <p className="sign-in-up-p">
          <button
            type="button"
            className="auth-switch-button"
            onClick={() => switchView('login')}
          >
            Вернуться ко входу
          </button>
        </p>
      )}
    </div>
  );
};

export default SignInRU;
