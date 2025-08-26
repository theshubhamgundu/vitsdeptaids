/* global importScripts, firebase */
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js');

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// These placeholders are replaced by Vite env injection at build if provided
const firebaseConfig = {
  apiKey: self.FIREBASE_API_KEY || undefined,
  authDomain: self.FIREBASE_AUTH_DOMAIN || undefined,
  projectId: self.FIREBASE_PROJECT_ID || undefined,
  storageBucket: self.FIREBASE_STORAGE_BUCKET || undefined,
  messagingSenderId: self.FIREBASE_MESSAGING_SENDER_ID || undefined,
  appId: self.FIREBASE_APP_ID || undefined,
};

try {
  if (firebaseConfig.apiKey && firebaseConfig.appId) {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      const { title, body, icon } = payload.notification || {};
      self.registration.showNotification(title || 'Notification', {
        body: body || '',
        icon: icon || '/favicon.ico',
        data: payload.data || {},
      });
    });
  }
} catch (e) {
  // no-op in case firebase is not configured
}


