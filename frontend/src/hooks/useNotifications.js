import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationService } from '../api';
import { pushNotificationService } from '../api/services/pushNotification.service';
import {
    requestNotificationPermission,
    onForegroundMessage,
    initializeMessaging
} from '../services/firebase.service';

/**
 * Hook to manage notifications with real-time updates via FCM
 * @param {boolean} isAuthenticated - Whether the user is authenticated
 * @returns {Object} Notification state and methods
 */
export const useNotifications = (isAuthenticated = false) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fcmToken, setFcmToken] = useState(null);
    const [permissionStatus, setPermissionStatus] = useState('default');
    const unsubscribeRef = useRef(null);
    const initializedRef = useRef(false);

    /**
     * Fetch unread count from API
     */
    const fetchUnreadCount = useCallback(async () => {
        if (!isAuthenticated) {
            setUnreadCount(0);
            return;
        }

        try {
            const result = await notificationService.getUnreadCount();
            setUnreadCount(result.unreadCount || 0);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch unread count:', err);
            // Don't show error for auth issues
            if (err.response?.status !== 401 && err.response?.status !== 403) {
                setError('Failed to load notifications');
            }
        }
    }, [isAuthenticated]);

    /**
     * Initialize Firebase and request notification permission
     */
    const initializePushNotifications = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            // Check current permission status
            if ('Notification' in window) {
                setPermissionStatus(Notification.permission);
            }

            // Initialize messaging
            await initializeMessaging();

            // Request permission and get token
            const token = await requestNotificationPermission();

            if (token) {
                setFcmToken(token);
                setPermissionStatus('granted');

                // Subscribe token to backend
                try {
                    await pushNotificationService.subscribeToken(token);
                    console.log('FCM token subscribed to backend');
                } catch (err) {
                    console.error('Failed to subscribe FCM token:', err);
                }

                // Listen for foreground messages
                unsubscribeRef.current = onForegroundMessage((payload) => {
                    console.log('New notification received:', payload);
                    // Increment unread count when new notification arrives
                    setUnreadCount(prev => prev + 1);

                    // Optionally show browser notification for foreground messages
                    if (Notification.permission === 'granted') {
                        new Notification(payload.notification?.title || 'VolunteerHub', {
                            body: payload.notification?.body || payload.data?.content || 'Bạn có thông báo mới',
                            icon: '/images/logo.png'
                        });
                    }
                });
            }
        } catch (err) {
            console.error('Failed to initialize push notifications:', err);
        }
    }, [isAuthenticated]);

    /**
     * Request notification permission manually
     */
    const requestPermission = useCallback(async () => {
        await initializePushNotifications();
    }, [initializePushNotifications]);

    /**
     * Decrement unread count (when marking as read)
     */
    const decrementUnreadCount = useCallback(() => {
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    /**
     * Reset unread count to 0 (when marking all as read)
     */
    const resetUnreadCount = useCallback(() => {
        setUnreadCount(0);
    }, []);

    /**
     * Increment unread count (when new notification arrives)
     */
    const incrementUnreadCount = useCallback(() => {
        setUnreadCount(prev => prev + 1);
    }, []);

    // Initialize on mount or when auth status changes
    useEffect(() => {
        if (!isAuthenticated) {
            setUnreadCount(0);
            setLoading(false);
            return;
        }

        const init = async () => {
            if (initializedRef.current) return;
            initializedRef.current = true;

            setLoading(true);
            await fetchUnreadCount();

            // Delay FCM initialization to ensure service worker is ready
            setTimeout(async () => {
                await initializePushNotifications();
            }, 1000);

            setLoading(false);
        };

        init();

        // Cleanup on unmount
        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, [isAuthenticated, fetchUnreadCount, initializePushNotifications]);

    // Reset when user logs out
    useEffect(() => {
        if (!isAuthenticated) {
            initializedRef.current = false;
            setFcmToken(null);
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
                unsubscribeRef.current = null;
            }
        }
    }, [isAuthenticated]);

    // Listen for messages from service worker
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data?.type === 'NOTIFICATION_CLICKED') {
                // Refresh notifications when user clicks on notification
                fetchUnreadCount();
            }
        };

        navigator.serviceWorker?.addEventListener('message', handleMessage);

        return () => {
            navigator.serviceWorker?.removeEventListener('message', handleMessage);
        };
    }, [fetchUnreadCount]);

    return {
        unreadCount,
        loading,
        error,
        fcmToken,
        permissionStatus,
        fetchUnreadCount,
        requestPermission,
        decrementUnreadCount,
        resetUnreadCount,
        incrementUnreadCount,
    };
};

export default useNotifications;
