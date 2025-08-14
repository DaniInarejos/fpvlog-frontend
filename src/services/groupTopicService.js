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

  // Obtener topic específico por ID (método actualizado)
  async getTopicById(groupId, topicId) {
    const response = await api.get(`/groups/${groupId}/topics/${topicId}`)
    return response
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
  }
}

export default groupTopicService