import api from '../api';

export const notificationService = {
  /**
   * GET /api/notifications/me - Lấy tất cả thông báo của user hiện tại (phân trang)
   * @param {number} page - Số trang (bắt đầu từ 0)
   * @param {number} size - Số lượng mỗi trang
   * @returns {Promise<Page<NotificationReadDTO>>}
   */
  async getMyNotifications(page = 0, size = 20) {
    const response = await api.get('/notifications/me', {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * GET /api/notifications/search - Tìm kiếm với filter
   * @param {Object} params - Các tham số filter
   * @param {boolean} params.isRead - Filter theo trạng thái đọc (true/false/undefined)
   * @param {string} params.type - Filter theo loại thông báo
   * @param {number} params.page - Số trang
   * @param {number} params.size - Số lượng mỗi trang
   * @returns {Promise<Page<NotificationReadDTO>>}
   */
  async searchNotifications({ isRead, type, page = 0, size = 20 } = {}) {
    const params = { page, size };
    if (isRead !== undefined && isRead !== null) {
      params.isRead = isRead;
    }
    if (type) {
      params.type = type;
    }
    const response = await api.get('/notifications/search', { params });
    return response.data;
  },

  /**
   * GET /api/notifications/unread-count - Đếm số thông báo chưa đọc
   * @returns {Promise<{unreadCount: number}>}
   */
  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  /**
   * PATCH /api/notifications/{notificationId}/toggle-read - Toggle trạng thái đọc
   * @param {number} notificationId
   * @returns {Promise<{isRead: boolean}>}
   */
  async toggleReadStatus(notificationId) {
    const response = await api.patch(`/notifications/${notificationId}/toggle-read`);
    return response.data;
  },

  /**
   * PATCH /api/notifications/mark-all-as-read - Đánh dấu tất cả đã đọc
   * @returns {Promise<void>}
   */
  async markAllAsRead() {
    const response = await api.patch('/notifications/mark-all-as-read');
    return response.data;
  },
};
