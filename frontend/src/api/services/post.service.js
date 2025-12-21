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
    const defaultParams = { sort: 'createAt,desc', ...params };
    const response = await api.get(`/posts/by-event/${eventId}`, { params: defaultParams });
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
  },

  // POST /api/posts/{id}/toggle-like
  async toggleLike(postId, accountId) {
    const response = await api.post(`/posts/${postId}/toggle-like`, { postId, accountId });
    return response.data; // { isLiked: boolean }
  },

  // POST /api/posts/{id}/is-liked
  async checkIsLiked(postId) {
    const response = await api.post(`/posts/${postId}/is-liked`);
    return response.data; // { isLiked: boolean }
  },

  // GET /api/posts/{id}/like-count
  async getLikeCount(postId) {
    const response = await api.get(`/posts/${postId}/like-count`);
    return response.data; // { count: number }
  },

  // GET /api/posts/{id}/comments
  async getComments(postId, params = {}) {
    const response = await api.get(`/posts/${postId}/comments`, { params });
    return response.data;
  },

  // GET /api/posts/{id}/comments/count
  async getCommentCount(postId) {
    const response = await api.get(`/posts/${postId}/comments/count`);
    return response.data; // { count: number }
  },

  // GET /api/me/posts/liked - Get user's liked posts
  async getMyLikedPosts(page = 0, size = 10) {
    const response = await api.get('/me/posts/liked', { params: { page, size } });
    return response.data;
  }
};
