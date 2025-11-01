import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';
import { App as CapApp } from '@capacitor/app';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

const splash = document.getElementById('splash');
if (splash) {
  splash.classList.add('hidden');
  setTimeout(() => splash.remove(), 300);
}

if (Capacitor.isNativePlatform()) {
  StatusBar.setOverlaysWebView({ overlay: true });
  StatusBar.setBackgroundColor({ color: '#0e0a20' });
  CapApp.addListener('backButton', () => {
    window.history.back();
  });
}
