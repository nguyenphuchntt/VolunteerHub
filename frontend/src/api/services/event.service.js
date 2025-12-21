import api from '../api';

export const eventService = {
  // GET /api/events/search?params (public)
  // params: { title, status, category, location, startAtFrom, startAtTo, etc. }
  async searchEvents(params = {}) {
    const response = await api.get('/events/search-public', { params });
    return response.data; // Page<EventSearchDTO>
  },

  // GET /api/events/search (ADMIN only - returns all events including PENDING)
  async searchAllEvents(params = {}) {
    const response = await api.get('/events/search', { params });
    return response.data; // Page<EventSearchDTO>
  },

  // GET /api/events/{eventId} (public)
  async getEventById(eventId) {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },

  // GET /api/events/{eventId}/participants (public)
  async getEventParticipants(eventId, params = {}) {
    const response = await api.get(`/events/${eventId}/participants`, { params });
    return response.data;
  },

  // GET /api/events/accounts/{accountId} (public)
  async getEventsByAccountId(accountId, params = {}) {
    const response = await api.get(`/events/accounts/${accountId}`, { params });
    return response.data;
  },

  // POST /api/events/register-event (MANAGER, ADMIN)
  async registerEvent(data) {
    const response = await api.post('/events/register-event', data);
    return response.data;
  },

  // POST /api/events/create-event (ADMIN only)
  async createEvent(data) {
    const response = await api.post('/events/create-event', data);
    return response.data;
  },

  // PATCH /api/events/{eventId}/update (MANAGER, ADMIN)
  async updateEvent(eventId, data) {
    const response = await api.patch(`/events/${eventId}/update`, data);
    return response.data;
  },

  // DELETE /api/events/{eventId}/delete
  async deleteEvent(eventId) {
    await api.delete(`/events/${eventId}/delete`);
  },

  // PATCH /api/events/{eventId}/event-status (ADMIN only)
  async updateEventStatus(eventId, status) {
    const response = await api.patch(`/events/${eventId}/event-status`, { status });
    return response.data;
  },

  // POST /api/events/{eventId}/like (authenticated)
  async likeEvent(eventId) {
    const response = await api.post(`/events/${eventId}/like`);
    return response.data;
  },

  // POST /api/events/{eventId}/liked - Check if user liked event
  async isEventLiked(eventId) {
    const response = await api.post(`/events/${eventId}/liked`);
    return response.data;
  },

  // GET /api/events/hot - Lấy sự kiện nổi bật
  async getHotEvents(page = 0, size = 10, category = null) {
    const params = { page, size };
    if (category && category !== 'all') {
      params.category = category;
    }
    const response = await api.get('/events/hot', { params });
    return response.data; // Page<EventSearchDTO>
  },

  // GET /api/events/search-public - Lấy sự kiện sắp diễn ra (gần nhất)
  async getUpcomingEvents(page = 0, size = 10) {
    const now = new Date().toISOString();
    const response = await api.get('/events/search-public', { 
      params: { page, size, startAtFrom: now, sort: 'startAt,asc' } 
    });
    return response.data; // Page<EventSearchDTO>
  },

  // GET /api/events/suggestions - Gợi ý tìm kiếm (autocomplete)
  async getSuggestions(query, limit = 5) {
    if (!query || query.trim().length === 0) {
      return [];
    }
    const response = await api.get('/events/suggestions', { 
      params: { q: query, limit } 
    });
    return response.data; // List<EventSuggestionDTO>
  }
};
