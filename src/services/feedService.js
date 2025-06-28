import api from './api'

const feedService = {
  getGlobalFeed: async (page = 1, limit = 20) => {
    try {
      return await api.get(`/feeds/global?page=${page}&limit=${limit}`)
    } catch (error) {
      throw error
    }
  },

  getFollowingFeed: async (page = 1, limit = 20) => {
    try {
      return await api.get(`/feeds/following?page=${page}&limit=${limit}`)
    } catch (error) {
      throw error
    }
  }
}

export default feedService