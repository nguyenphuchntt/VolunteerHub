import api from '../api';

export const eventService = {
  /**
   * Searches public events with filters (excludes PENDING events).
   * 
   * @param {Object} params - Search filters (title, status, category, location, etc.)
   * @returns {Promise<Object>} Paginated event list
   */
  async searchEvents(params = {}) {
    const response = await api.get('/events/search-public', { params });
    return response.data; // Page<EventSearchDTO>
  },

  /**
   * Searches all events including PENDING (ADMIN only).
   * 
   * @param {Object} params - Search filters
   * @returns {Promise<Object>} Paginated event list
   */
  async searchAllEvents(params = {}) {
    const response = await api.get('/events/search', { params });
    return response.data; // Page<EventSearchDTO>
  },

  /**
   * Gets event details by ID.
   * 
   * @param {number} eventId - Event ID
   * @returns {Promise<Object>} Event details
   */
  async getEventById(eventId) {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },

  /**
   * Gets paginated list of event participants.
   * 
   * @param {number} eventId - Event ID
   * @param {Object} params - Pagination parameters
   * @returns {Promise<Object>} Paginated participants list
   */
  async getEventParticipants(eventId, params = {}) {
    const response = await api.get(`/events/${eventId}/participants`, { params });
    return response.data;
  },

  /**
   * Gets all events created by a specific account.
   * 
   * @param {string} accountId - Account ID
   * @param {Object} params - Pagination parameters
   * @returns {Promise<Object>} Paginated events list
   */
  async getEventsByAccountId(accountId, params = {}) {
    const response = await api.get(`/events/accounts/${accountId}`, { params });
    return response.data;
  },

  /**
   * Registers new event as manager (status: PENDING).
   * 
   * @param {Object} data - Event data
   * @returns {Promise<Object>} Created event
   */
  async registerEvent(data) {
    const response = await api.post('/events/register-event', data);
    return response.data;
  },

  /**
   * Creates event as admin with custom status.
   * 
   * @param {Object} data - Event data with status
   * @returns {Promise<Object>} Created event
   */
  async createEvent(data) {
    const response = await api.post('/events/create-event', data);
    return response.data;
  },

  /**
   * Updates event details (manager or admin).
   * 
   * @param {number} eventId - Event ID
   * @param {Object} data - Updated event data
   * @returns {Promise<Object>} Updated event
   */
  async updateEvent(eventId, data) {
    const response = await api.patch(`/events/${eventId}/update`, data);
    return response.data;
  },

  /**
   * Deletes an event.
   * 
   * @param {number} eventId - Event ID
   * @returns {Promise<void>}
   */
  async deleteEvent(eventId) {
    await api.delete(`/events/${eventId}/delete`);
  },

  /**
   * Updates event status (ADMIN only).
   * 
   * @param {number} eventId - Event ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated event
   */
  async updateEventStatus(eventId, status) {
    const response = await api.patch(`/events/${eventId}/event-status`, { status });
    return response.data;
  },

  /**
   * Likes or unlikes an event.
   * 
   * @param {number} eventId - Event ID
   * @returns {Promise<Object>} Like response
   */
  async likeEvent(eventId) {
    const response = await api.post(`/events/${eventId}/like`);
    return response.data;
  },

  /**
   * Checks if current user has liked the event.
   * 
   * @param {number} eventId - Event ID
   * @returns {Promise<boolean>} True if liked
   */
  async isEventLiked(eventId) {
    const response = await api.post(`/events/${eventId}/liked`);
    return response.data;
  },

  /**
   * Gets hot/popular events sorted by likes.
   * 
   * @param {number} page - Page number
   * @param {number} size - Page size
   * @param {string|null} category - Filter by category
   * @returns {Promise<Object>} Paginated hot events
   */
  async getHotEvents(page = 0, size = 10, category = null) {
    const params = { page, size };
    if (category && category !== 'all') {
      params.category = category;
    }
    const response = await api.get('/events/hot', { params });
    return response.data; // Page<EventSearchDTO>
  },

  /**
   * Gets upcoming events sorted by start date.
   * 
   * @param {number} page - Page number
   * @param {number} size - Page size
   * @returns {Promise<Object>} Paginated upcoming events
   */
  async getUpcomingEvents(page = 0, size = 10) {
    const now = new Date().toISOString();
    const response = await api.get('/events/search-public', { 
      params: { page, size, startAtFrom: now, sort: 'startAt,asc' } 
    });
    return response.data; // Page<EventSearchDTO>
  },

  /**
   * Gets event search suggestions for autocomplete.
   * 
   * @param {string} query - Search query
   * @param {number} limit - Max suggestions
   * @returns {Promise<Array>} Event suggestions
   */
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
