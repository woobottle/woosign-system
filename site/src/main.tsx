import React from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {ThemeProvider, ToastProvider} from 'woosign-system';
import {App} from './App';
import './styles.css';
const root = document.getElementById('root')!;
const app = (
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <App initialRoute={root.dataset.route} />
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
);
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
