import api from '../api';

export const commentService = {
  // GET /api/comments/search?postId&rootOnly
  async searchComments(postId, rootOnly = true, params = {}) {
    const response = await api.get('/comments/search', { 
      params: { postId, rootOnly, ...params } 
    });
    return response.data;
  },

  // GET /api/comments/{parentCommentId}/replies
  async getReplies(parentCommentId, params = {}) {
    const response = await api.get(`/comments/${parentCommentId}/replies`, { params });
    return response.data;
  },

  // GET /api/comments/{postId}
  async getCommentsByPost(postId, params = {}) {
    const response = await api.get(`/comments/${postId}`, { params });
    return response.data;
  },

  // DELETE /api/comments/{commentId}
  async deleteComment(commentId) {
    await api.delete(`/comments/${commentId}`);
  },

  // POST /api/comments - Create new comment (supports nested replies via parentCommentId)
  async createComment(data) {
    // data: { postId, content, parentCommentId? }
    const response = await api.post('/comments', data);
    return response.data;
  },

  // PATCH /api/comments/{commentId}/content - Update comment content
  async updateComment(commentId, content) {
    const response = await api.patch(`/comments/${commentId}/content`, { content });
    return response.data;
  }
};
