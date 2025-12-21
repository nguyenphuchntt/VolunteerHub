import { createContext, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';

const NotificationContext = createContext(null);

/**
 * Provider component for notification state
 * Wrap your app with this to enable real-time notifications
 */
export const NotificationProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const notificationState = useNotifications(isAuthenticated);

    return (
        <NotificationContext.Provider value={notificationState}>
            {children}
        </NotificationContext.Provider>
    );
};

/**
 * Hook to access notification context
 * @returns {Object} Notification state and methods
 */
export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        // Return default values if context is not available
        return {
            unreadCount: 0,
            loading: false,
            error: null,
            fcmToken: null,
            permissionStatus: 'default',
            fetchUnreadCount: () => { },
            requestPermission: () => { },
            decrementUnreadCount: () => { },
            resetUnreadCount: () => { },
            incrementUnreadCount: () => { },
        };
    }
    return context;
};

export default NotificationContext;
