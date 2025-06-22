import api from './api'

const flightService = {
  // Obtener todos los vuelos visibles
  getVisibleFlights: async (page = 1, limit = 20) => {
    return api.get(`/flights?page=${page}&limit=${limit}`)
  },

  // Obtener vuelos de un usuario específico
  getUserFlights: async (userId) => {
    return api.get(`/users/${userId}/flights`)
  },

  // Crear un nuevo vuelo
  createFlight: async (flightData) => {
    return api.post('/flights', flightData)
  },

  // Actualizar un vuelo
  updateFlight: async (id, flightData) => {
    return api.patch(`/flights/${id}`, flightData)
  },

  // Eliminar un vuelo
  deleteFlight: async (id) => {
    return api.delete(`/flights/${id}`)
  }
}

export default flightService