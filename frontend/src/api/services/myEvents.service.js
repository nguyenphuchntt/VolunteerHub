import api from '../api';

export const myEventsService = {
  // GET /api/me/events?page&size
  async getMyEvents(page = 0, size = 10) {
    const response = await api.get('/me/events', { params: { page, size } });
    return response.data;
  },

  // GET /api/me/events/{eventId}
  async getMyEvent(eventId) {
    const response = await api.get(`/me/events/${eventId}`);
    return response.data;
  },

  // POST /api/me/events/{eventId}/register
  // RequestBody: { startAt, endAt }
  async registerForEvent(eventId, data) {
    const response = await api.post(`/me/events/${eventId}/register`, data);
    return response.data;
  },

  // DELETE /api/me/events/{eventId}/unregister
  async unregisterFromEvent(eventId) {
    await api.delete(`/me/events/${eventId}/unregister`);
  },

  // PATCH /api/me/events/{eventId}/update
  async updateParticipation(eventId, data) {
    const response = await api.patch(`/me/events/${eventId}/update`, data);
    return response.data;
  }
};
