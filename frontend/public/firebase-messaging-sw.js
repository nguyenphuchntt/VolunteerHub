// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-messaging-compat.js');

// Firebase config (same as in src/config/firebase.config.js)
const firebaseConfig = {
  apiKey: "AIzaSyDJwPir5GxNEouNmo_T8ksaOyzWSO1Hv9g",
  authDomain: "volunteerhub-a01c1.firebaseapp.com",
  projectId: "volunteerhub-a01c1",
  storageBucket: "volunteerhub-a01c1.firebasestorage.app",
  messagingSenderId: "199942070484",
  appId: "1:199942070484:web:a786a8ebe2efa38f585b41"
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
