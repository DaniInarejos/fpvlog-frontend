import api from './api'

const groupService = {
  // Obtener todos los grupos con filtros
  getGroups(params = {}) {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.search) queryParams.append('search', params.search)
    if (params.tags) queryParams.append('tags', params.tags)
    if (params.createdBy) queryParams.append('createdBy', params.createdBy)
    
    return api.get(`/groups?${queryParams.toString()}`)
  },

  // Obtener grupos del usuario (grupos a los que se ha unido)
  getUserGroups(userId, params = {}) {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    
    return api.get(`/users/${userId}/groups?${queryParams.toString()}`)
  },

  // Buscar grupos
  searchGroups(query, page = 1, limit = 10) {
    return api.get(`/groups/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`)
  },

  // Obtener grupo por ID
  getGroup(id) {
    return api.get(`/groups/${id}`)
  },

  // Crear nuevo grupo
  createGroup(groupData) {
    return api.post('/groups', groupData)
  },

  // Actualizar grupo
  updateGroup(id, groupData) {
    return api.patch(`/groups/${id}`, groupData)
  },

  // Eliminar grupo
  deleteGroup(id) {
    return api.delete(`/groups/${id}`)
  },

  // Unirse a un grupo
  joinGroup(id) {
    return api.post(`/groups/${id}/join`)
  },

  // Abandonar grupo
  // Agregar método para abandonar grupo (cambiar de POST a DELETE)
  leaveGroup(id) {
    return api.delete(`/groups/${id}/leave`)
  },
  
  // Actualizar getPendingRequests para manejar paginación
  getPendingRequests(id, params = {}) {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    
    return api.get(`/groups/${id}/members/pending?${queryParams.toString()}`)
  },

  // Obtener miembros del grupo
  getGroupMembers(id, params = {}) {
    const queryParams = new URLSearchParams()
    if (params.role) queryParams.append('role', params.role)
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    
    return api.get(`/groups/${id}/members?${queryParams.toString()}`)
  },

  // Obtener solicitudes pendientes
  getPendingRequests(id) {
    return api.get(`/groups/${id}/members/pending`)
  },

  // Gestionar miembro (aprobar, rechazar, banear, etc.)
  manageMember(groupId, userId, action, newRole = null) {
    const data = { action }
    if (newRole) data.newRole = newRole
    return api.patch(`/groups/${groupId}/members/${userId}`, data)
  },

  // Transferir propiedad
  transferOwnership(id, newOwnerId) {
    return api.post(`/groups/${id}/transfer-ownership`, { newOwnerId })
  }
}

export default groupService