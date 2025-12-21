import api from '../api';

export const managerService = {
  // Check if current user is event manager of any event
  // GET /api/manager/is-event-manager
  async checkIsEventManager() {
    const response = await api.get('/manager/is-event-manager');
    return response.data; // { isEventManager: boolean }
  },

  // Get events managed by current user
  // GET /api/manager/me/managed-events
  async getManagedEvents(params = {}) {
    const response = await api.get('/manager/me/managed-events', { params });
    return response.data; // Page<EventSearchDTO>
  },

  // GET /api/manager/pending-users
  async getPendingUsers(params = {}) {
    const response = await api.get('/manager/pending-users', { params });
    return response.data;
  },

  // Dashboard APIs for specific event
  async getEventDashboardOverview(eventId) {
    const response = await api.get(`/manager/events/${eventId}/dashboard/overview`);
    return response.data;
  },

  async getParticipantsByStatus(eventId) {
    const response = await api.get(`/manager/events/${eventId}/dashboard/participants-by-status`);
    return response.data;
  },

  async getParticipantsByRole(eventId) {
    const response = await api.get(`/manager/events/${eventId}/dashboard/participants-by-role`);
    return response.data;
  },

  async getAttendanceRate(eventId) {
    const response = await api.get(`/manager/events/${eventId}/dashboard/attendance-rate`);
    return response.data;
  },

  async getRegistrationTimeline(eventId) {
    const response = await api.get(`/manager/events/${eventId}/dashboard/registration-timeline`);
    return response.data;
  }
};
