import api from '../api';

export const notificationService = {
  // PATCH /api/notifications/{notificationId}/toggle-read
  async toggleReadStatus(notificationId) {
    const response = await api.patch(`/notifications/${notificationId}/toggle-read`);
    return response.data; // { isRead: boolean }
  },

  // PATCH /api/notifications/{notificationId}/type
  async updateNotificationType(notificationId, type) {
    const response = await api.patch(`/notifications/${notificationId}/type`, { type });
    return response.data;
  }
};
