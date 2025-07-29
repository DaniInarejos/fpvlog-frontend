import api from './api'

const groupTopicService = {
  // Obtener topics de un grupo
  getGroupTopics(groupId, params = {}) {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.sort) queryParams.append('sort', params.sort)
    
    return api.get(`/groups/${groupId}/topics?${queryParams.toString()}`)
  },

  // Obtener topic específico
  getTopic(groupId, topicId) {
    return api.get(`/groups/${groupId}/topics/${topicId}`)
  },

  // Crear nuevo topic
  createTopic(groupId, topicData) {
    return api.post(`/groups/${groupId}/topics`, topicData)
  },

  // Actualizar topic
  updateTopic(groupId, topicId, topicData) {
    return api.patch(`/groups/${groupId}/topics/${topicId}`, topicData)
  },

  // Eliminar topic
  deleteTopic(groupId, topicId) {
    return api.delete(`/groups/${groupId}/topics/${topicId}`)
  },

  // Fijar/desfijar topic
  togglePinTopic(groupId, topicId) {
    return api.patch(`/groups/${groupId}/topics/${topicId}/pin`)
  }, // <- AGREGAR ESTA COMA

  // Obtener comentarios de un topic
  getTopicComments(groupId, topicId, params = {}) {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.sort) queryParams.append('sort', params.sort)
    
    return api.get(`/groups/${groupId}/topics/${topicId}/comments?${queryParams.toString()}`)
  },

  // Crear comentario en topic
  createTopicComment(groupId, topicId, commentData) {
    return api.post(`/groups/${groupId}/topics/${topicId}/comments`, commentData)
  },

  // Actualizar comentario
  updateTopicComment(groupId, topicId, commentId, commentData) {
    return api.patch(`/groups/${groupId}/topics/${topicId}/comments/${commentId}`, commentData)
  },

  // Eliminar comentario
  deleteTopicComment(groupId, topicId, commentId) {
    return api.delete(`/groups/${groupId}/topics/${topicId}/comments/${commentId}`)
  },

  // Like/Unlike comentario
  toggleTopicCommentLike(groupId, topicId, commentId) {
    return api.post(`/groups/${groupId}/topics/${topicId}/comments/${commentId}/like`)
  },

  // Obtener respuestas de un comentario
  getCommentReplies(groupId, topicId, commentId, params = {}) {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    
    return api.get(`/groups/${groupId}/topics/${topicId}/comments/${commentId}/replies?${queryParams.toString()}`)
  }
}

export default groupTopicService