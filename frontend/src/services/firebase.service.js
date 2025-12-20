import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import firebaseConfig, { VAPID_KEY } from '../config/firebase.config';

// Initialize Firebase
let app = null;
let messaging = null;

// Check if browser supports notifications
const isSupported = () => {
    return 'Notification' in window &&
        'serviceWorker' in navigator &&
        'PushManager' in window;
};

/**
 * Initialize Firebase App
 */
const initializeFirebaseApp = () => {
    if (!app) {
        try {
            app = initializeApp(firebaseConfig);
        } catch (error) {
            console.error('Error initializing Firebase App:', error);
        }
    }
    return app;
};

/**
 * Initialize Firebase Messaging
 * @returns {Promise<object|null>} Firebase messaging instance or null if not supported
 */
export const initializeMessaging = async () => {
    if (!isSupported()) {
        console.warn('Push notifications are not supported in this browser');
        return null;
    }

    try {
        initializeFirebaseApp();
        messaging = getMessaging(app);
        return messaging;
    } catch (error) {
        console.error('Error initializing Firebase Messaging:', error);
        return null;
    }
};

/**
 * Wait for service worker to be ready
 * @param {ServiceWorkerRegistration} registration 
 * @returns {Promise<ServiceWorker>}
 */
const waitForServiceWorkerActive = async (registration) => {
    // If already active, return immediately
    if (registration.active) {
        return registration.active;
    }

    // Wait for the service worker to become active
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('Service worker activation timeout'));
        }, 10000);

        if (registration.installing || registration.waiting) {
            const sw = registration.installing || registration.waiting;
            sw.addEventListener('statechange', function onStateChange() {
                if (sw.state === 'activated') {
                    clearTimeout(timeout);
                    sw.removeEventListener('statechange', onStateChange);
                    resolve(sw);
                }
            });
        } else if (registration.active) {
            clearTimeout(timeout);
            resolve(registration.active);
        }
    });
};

/**
 * Request permission and get FCM token
 * @returns {Promise<string|null>} FCM token or null if failed
 */
export const requestNotificationPermission = async () => {
    if (!isSupported()) {
        console.warn('Push notifications are not supported');
        return null;
    }

    try {
        const permission = await Notification.requestPermission();

        if (permission !== 'granted') {
            console.warn('Notification permission denied');
            return null;
        }

        // Register service worker
        let registration;
        try {
            registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
            console.log('Service Worker registered:', registration.scope);

            // Wait for service worker to be active
            await waitForServiceWorkerActive(registration);
            console.log('Service Worker is active');
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            return null;
        }

        // Get messaging instance
        if (!messaging) {
            await initializeMessaging();
        }

        if (!messaging) {
            console.error('Messaging not initialized');
            return null;
        }

        // Small delay to ensure service worker is fully ready
        await new Promise(resolve => setTimeout(resolve, 500));

        // Get FCM token
        const token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: registration
        });

        if (token) {
            console.log('FCM Token obtained:', token.substring(0, 20) + '...');
            return token;
        } else {
            console.warn('No FCM token available');
            return null;
        }
    } catch (error) {
        console.error('Error getting FCM token:', error);
        return null;
    }
};

/**
 * Listen for foreground messages
 * @param {Function} callback - Callback function to handle incoming messages
 * @returns {Function|null} Unsubscribe function or null if not supported
 */
export const onForegroundMessage = (callback) => {
    if (!messaging) {
        console.warn('Messaging not initialized');
        return null;
    }

    return onMessage(messaging, (payload) => {
        console.log('Foreground message received:', payload);
        callback(payload);
    });
};

export { app, messaging };
