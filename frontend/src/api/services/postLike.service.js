import api from '../api';

export const postLikeService = {
  // GET /api/postlike/count?postId
  async getLikeCount(postId) {
    const response = await api.get('/postlike/count', { params: { postId } });
    return response.data;
  },

  // POST /api/postlike
  // RequestBody: { postId, accountId }
  async toggleLike(postId, accountId) {
    const response = await api.post('/postlike', { postId, accountId });
    return response.data; // { isLiked: boolean }
  }
};
