import api from '../api';

export const postService = {
  // GET /api/posts/{id}
  async getPostById(postId) {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  // GET /api/posts/search?content&ownerUsername&eventId
  async searchPosts(params = {}) {
    const response = await api.get('/posts/search', { params });
    return response.data;
  },

  // GET /api/posts/by-event/{eventId}
  async getPostsByEvent(eventId, params = {}) {
    const response = await api.get(`/posts/by-event/${eventId}`, { params });
    return response.data;
  },

  // GET /api/posts/by-account/{username}
  async getPostsByOwner(username, params = {}) {
    const response = await api.get(`/posts/by-account/${username}`, { params });
    return response.data;
  },

  // POST /api/posts
  async createPost(data) {
    const response = await api.post('/posts', data);
    return response.data;
  },

  // PATCH /api/posts/{id}/content
  async updatePostContent(postId, content) {
    const response = await api.patch(`/posts/${postId}/content`, { content });
    return response.data;
  },

  // PATCH /api/posts/{id}/type
  async updatePostType(postId, type) {
    const response = await api.patch(`/posts/${postId}/type`, { type });
    return response.data;
  },

  // PATCH /api/posts/{id}/status
  async updatePostStatus(postId, status) {
    const response = await api.patch(`/posts/${postId}/status`, { status });
    return response.data;
  },

  // DELETE /api/posts/{postId}
  async deletePost(postId) {
    await api.delete(`/posts/${postId}`);
  }
};
