import React from 'react';
import {createRoot} from 'react-dom/client';
import {ThemeProvider, ToastProvider} from 'woosign-system';
import {App} from './App';
import './styles.css';
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
