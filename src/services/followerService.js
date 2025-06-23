import api from './api'

const followerService = {
  // Seguir a un usuario
  followUser: async (userId) => {
    return api.post(`/followers/${userId}/follow`)
  },

  // Dejar de seguir a un usuario
  unfollowUser: async (userId) => {
    return api.delete(`/followers/${userId}/follow`)
  },

  // Obtener seguidores de un usuario
  getUserFollowers: async (userId, page = 1, limit = 20) => {
    return api.get(`/followers/${userId}/followers?page=${page}&limit=${limit}`)
  },

  // Obtener usuarios que sigue un usuario
  getUserFollowing: async (userId, page = 1, limit = 20) => {
    return api.get(`/followers/${userId}/following?page=${page}&limit=${limit}`)
  },

  // Verificar si el usuario actual sigue a otro usuario
  checkIfFollowing: async (userId) => {
    return api.get(`/followers/${userId}/is-following`)
  }
}

export default followerService