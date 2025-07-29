import api from './api'

const groupCommentService = {
  // Obtener comentarios de un post
  getPostComments(groupId, postId, params = {}) {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    
    return api.get(`/groups/${groupId}/posts/${postId}/comments?${queryParams.toString()}`)
  },

  // Obtener respuestas de un comentario
  getCommentReplies(groupId, commentId, params = {}) {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    
    return api.get(`/groups/${groupId}/comments/${commentId}/replies?${queryParams.toString()}`)
  },

  // Crear comentario
  createComment(groupId, postId, commentData) {
    return api.post(`/groups/${groupId}/posts/${postId}/comments`, commentData)
  },

  // Actualizar comentario
  updateComment(groupId, postId, commentId, commentData) {
    return api.patch(`/groups/${groupId}/posts/${postId}/comments/${commentId}`, commentData)
  },

  // Eliminar comentario
  deleteComment(groupId, postId, commentId) {
    return api.delete(`/groups/${groupId}/posts/${postId}/comments/${commentId}`)
  },

  // Toggle like en comentario
  toggleCommentLike(groupId, commentId) {
    return api.post(`/groups/${groupId}/comments/${commentId}/like`)
  }
}

export default groupCommentService