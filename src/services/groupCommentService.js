import api from './api'

const groupCommentService = {
  // Obtener comentarios de un topic (público)
  async getTopicComments(groupId, topicId, params = {}) {
    const response = await api.get(`/groups/${groupId}/topics/${topicId}/comments`, { params })
    return response
  },

  // Obtener respuestas de un comentario (público)
  async getCommentReplies(groupId, commentId, params = {}) {
    const response = await api.get(`/groups/${groupId}/topics/comments/${commentId}/replies`, { params })
    return response.data
  },

  // Crear comentario en topic (protegido)
  async createComment(groupId, topicId, commentData) {
    const response = await api.post(`/groups/${groupId}/topics/${topicId}/comments`, commentData)
    return response.data
  },

  // Actualizar comentario (protegido)
  async updateComment(groupId, commentId, commentData) {
    const response = await api.patch(`/groups/${groupId}/topics/comments/${commentId}`, commentData)
    return response.data
  },

  // Eliminar comentario (protegido)
  async deleteComment(groupId, commentId) {
    const response = await api.delete(`/groups/${groupId}/topics/comments/${commentId}`)
    return response.data
  },

  // Toggle like en comentario (protegido)
  async toggleCommentLike(groupId, commentId) {
    const response = await api.post(`/groups/${groupId}/topics/comments/${commentId}/like`)
    return response.data
  }
}

export default groupCommentService