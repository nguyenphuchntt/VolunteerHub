// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-messaging-compat.js');

// Firebase config (same as in src/config/firebase.config.js)
const firebaseConfig = {
    apiKey: "AIzaSyDNnPhIWnN3ThZvzMiOEoqug_TY63YKNns",
    authDomain: "volunteerhub-af843.firebaseapp.com",
    projectId: "volunteerhub-af843",
    storageBucket: "volunteerhub-af843.firebasestorage.app",
    messagingSenderId: "385131798352",
    appId: "1:385131798352:web:0b8873ebef82606df41655"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    const notificationTitle = payload.notification?.title || 'VolunteerHub';
    const notificationOptions = {
        body: payload.notification?.body || payload.data?.content || 'Bạn có thông báo mới',
        icon: '/images/logo.png',
        badge: '/images/logo.png',
        tag: 'volunteerhub-notification',
        data: payload.data,
        requireInteraction: true,
        actions: [
            {
                action: 'view',
                title: 'Xem chi tiết'
            },
            {
                action: 'dismiss',
                title: 'Bỏ qua'
            }
        ]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification clicked:', event);

    event.notification.close();

    if (event.action === 'dismiss') {
        return;
    }

    // Open the app and navigate to notifications page
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // If app is already open, focus it
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.focus();
                    client.postMessage({
                        type: 'NOTIFICATION_CLICKED',
                        data: event.notification.data
                    });
                    return;
                }
            }
            // Otherwise, open new window
            if (clients.openWindow) {
                return clients.openWindow('/notifications');
            }
        })
    );
});
