import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import dbService from './services/databaseService';
import { registerSW } from 'virtual:pwa-register';

// Initialize database service (replaces window.storage)
console.log('🗄️ Database initialized:', dbService.getStatus());

// Try to sync data from cloud on startup (if Supabase is configured)
dbService.syncAllFromCloud().catch(err => {
  console.log('Starting in offline mode');
});

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  registerSW({
    onNeedRefresh() {
      if (confirm('New content available! Reload to update?')) {
        window.location.reload();
      }
    },
    onOfflineReady() {
      console.log('App ready to work offline');
    },
    immediate: true
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
