import api from './api'

const spotService = {
  getSpots() {
    return api.get('/spots')
  },

  getUserSpots(userId) {
    return api.get(`/users/${userId}/spots`)
  },

  getSpot(id) {
    return api.get(`/spots/${id}`)
  },

  createSpot(spotData) {
    return api.post('/spots', spotData)
  },

  updateSpot(id, spotData) {
    return api.put(`/spots/${id}`, spotData)
  },

  deleteSpot(id) {
    return api.delete(`/spots/${id}`)
  }
}

export default spotService