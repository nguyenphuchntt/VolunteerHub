import api from '../api';

export const pushNotificationService = {
    /**
     * Subscribe FCM token to backend
     * POST /api/push-notifications/subscribe
     * @param {string} token - FCM token
     * @returns {Promise<string>}
     */
    async subscribeToken(token) {
        const response = await api.post('/push-notifications/subscribe', { token });
        return response.data;
    },

    /**
     * Unsubscribe FCM token from backend
     * DELETE /api/push-notifications/unsubscribe
     * @param {string} token - FCM token
     * @returns {Promise<string>}
     */
    async unsubscribeToken(token) {
        const response = await api.delete('/push-notifications/unsubscribe', {
            data: { token }
        });
        return response.data;
    },

    /**
     * Unsubscribe all tokens for current user
     * DELETE /api/push-notifications/unsubscribe-all
     * @returns {Promise<string>}
     */
    async unsubscribeAllTokens() {
        const response = await api.delete('/push-notifications/unsubscribe-all');
        return response.data;
    },
};
