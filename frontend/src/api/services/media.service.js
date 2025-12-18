import api from '../api';

export const mediaService = {
  // POST /api/media/upload - Upload generic file
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // POST /api/media/upload/post/{postId} - Upload and link media to post
  async uploadPostMedia(file, postId) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/media/upload/post/${postId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // POST /api/media/upload/event/{eventId} - Upload and link media to event
  async uploadEventMedia(file, eventId) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/media/upload/event/${eventId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // POST /api/media/upload/account - Upload profile media
  async uploadAccountMedia(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/media/upload/account', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // GET /api/media/{id} - Get media by ID
  async getMediaById(mediaId) {
    const response = await api.get(`/media/${mediaId}`);
    return response.data;
  },

  // GET /api/media/by-post/{postId} - Get all media for a post
  async getMediaByPost(postId, params = {}) {
    const response = await api.get(`/media/by-post/${postId}`, { params });
    return response.data;
  },

  // GET /api/media/by-event/{eventId} - Get all media for an event
  async getMediaByEvent(eventId, params = {}) {
    const response = await api.get(`/media/by-event/${eventId}`, { params });
    return response.data;
  },

  // GET /api/media/download/{filename} - Get download URL
  getDownloadUrl(filename) {
    return `/api/media/download/${filename}`;
  },

  // DELETE /api/media/{id} - Delete media
  async deleteMedia(mediaId) {
    const response = await api.delete(`/media/${mediaId}`);
    return response.data;
  },

  // POST /api/media/link/post/{postId}/{mediaId} - Link existing media to post
  async linkMediaToPost(postId, mediaId) {
    await api.post(`/media/link/post/${postId}/${mediaId}`);
  },

  // DELETE /api/media/link/post/{postId}/{mediaId} - Unlink media from post
  async unlinkMediaFromPost(postId, mediaId) {
    await api.delete(`/media/link/post/${postId}/${mediaId}`);
  }
};
