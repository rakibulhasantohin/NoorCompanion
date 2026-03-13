import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Fix for "Cannot set property fetch of #<Window> which has only a getter"
// This can happen when libraries try to polyfill fetch in environments where it's read-only.
try {
  const descriptor = Object.getOwnPropertyDescriptor(window, 'fetch');
  if (descriptor && !descriptor.writable && descriptor.configurable) {
    Object.defineProperty(window, 'fetch', {
      value: window.fetch,
      writable: true,
      configurable: true
    });
  }
} catch (e) {
  console.warn('Could not make fetch writable:', e);
}

/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
*/

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
