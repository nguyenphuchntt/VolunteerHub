import api from '../api';

export const eventUserService = {
  // GET /api/event-users/search?params (MANAGER, ADMIN)
  async searchEventUsers(params = {}) {
    const response = await api.get('/event-users/search', { params });
    return response.data;
  },

  // GET /api/event-users/accounts/{accountId}
  async getEventUsersByAccountId(accountId, params = {}) {
    const response = await api.get(`/event-users/accounts/${accountId}`, { params });
    return response.data;
  },

  // GET /api/event-users/{eventId}
  async getEventUsersByEventId(eventId, params = {}) {
    const response = await api.get(`/event-users/${eventId}`, { params });
    return response.data;
  },

  // GET /api/event-users/{eventId}/{accountId}
  async getEventUser(eventId, accountId) {
    const response = await api.get(`/event-users/${eventId}/${accountId}`);
    return response.data;
  },

  // POST /api/event-users/{eventId}/{accountId}/create
  async createEventUser(eventId, accountId, data) {
    const response = await api.post(`/event-users/${eventId}/${accountId}/create`, data);
    return response.data;
  },

  // DELETE /api/event-users/{eventId}/{accountId}/delete
  async deleteEventUser(eventId, accountId) {
    await api.delete(`/event-users/${eventId}/${accountId}/delete`);
  },

  // PATCH /api/event-users/{eventId}/{accountId}/update-role
  async updateEventUserRole(eventId, accountId, eventUserRole) {
    const response = await api.patch(`/event-users/${eventId}/${accountId}/update-role`, { eventUserRole });
    return response.data;
  },

  // PATCH /api/event-users/{eventId}/{accountId}/update-status
  async updateEventUserStatus(eventId, accountId, status) {
    const response = await api.patch(`/event-users/${eventId}/${accountId}/update-status`, { status });
    return response.data;
  }
};
