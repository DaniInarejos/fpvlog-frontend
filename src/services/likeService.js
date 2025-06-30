import api from './api'

const likeService = {
  toggleLike: async (type, itemId) => {
    return await api.post(`/likes/${type}/${itemId}`)
  }
}

export default likeService