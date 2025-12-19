import api from '../api';

export const requestService = {
  // ========== USER ENDPOINTS ==========
  
  // POST /api/requests - Create a new manager request
  async createRequest(reason) {
    const response = await api.post('/requests', { reason });
    return response.data;
  },

  // GET /api/requests/me - Get current user's requests
  async getMyRequests(page = 0, size = 10) {
    const response = await api.get('/requests/me', {
      params: { page, size }
    });
    return response.data;
  },

  // GET /api/requests/{requestId} - Get request by ID
  async getRequestById(requestId) {
    const response = await api.get(`/requests/${requestId}`);
    return response.data;
  },

  // DELETE /api/requests/{requestId} - Cancel a pending request
  async cancelRequest(requestId) {
    await api.delete(`/requests/${requestId}`);
  },

  // ========== ADMIN ENDPOINTS ==========

  // GET /api/admin/requests - Get all requests
  async getAllRequests(page = 0, size = 10) {
    const response = await api.get('/admin/requests', {
      params: { page, size }
    });
    return response.data;
  },

  // GET /api/admin/requests/status/{status} - Get requests by status
  async getRequestsByStatus(status, page = 0, size = 10) {
    const response = await api.get(`/admin/requests/status/${status}`, {
      params: { page, size }
    });
    return response.data;
  },

  // GET /api/admin/requests/pending-count - Get count of pending requests
  async getPendingCount() {
    const response = await api.get('/admin/requests/pending-count');
    return response.data;
  },

  // PATCH /api/admin/requests/{requestId}/review - Approve or reject request
  async reviewRequest(requestId, status, adminResponse = '') {
    const response = await api.patch(`/admin/requests/${requestId}/review`, {
      status,
      adminResponse
    });
    return response.data;
  },

  // GET /api/admin/requests/{requestId} - Get request details (admin)
  async getRequestByIdAdmin(requestId) {
    const response = await api.get(`/admin/requests/${requestId}`);
    return response.data;
  }
};
