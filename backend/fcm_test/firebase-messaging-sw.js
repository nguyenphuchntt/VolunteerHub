// Firebase Messaging Service Worker
// This file MUST be at the root of the web app to handle background push notifications

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase Configuration (same as in app.js)
firebase.initializeApp({
    apiKey: "AIzaSyDNnPhIWnN3ThZvzMiOEoqug_TY63YKNns",
    authDomain: "volunteerhub-af843.firebaseapp.com",
    projectId: "volunteerhub-af843",
    storageBucket: "volunteerhub-af843.firebasestorage.app",
    messagingSenderId: "385131798352",
    appId: "1:385131798352:web:0b8873ebef82606df41655"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    const notificationTitle = 'VolunteerHub';
    const notificationOptions = {
        body: payload.data?.content || 'You have a new notification',
        icon: '/favicon.ico',
        badge: '/badge.png',
        data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification click:', event);
    event.notification.close();

    // Open or focus the app
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes('/fcm_test') && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/fcm_test/');
            }
        })
    );
});
