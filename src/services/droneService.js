import api from './api'

const droneService = {
  // Obtener todos los drones del usuario
  getDrones() {
    return api.get('/drones')
  },

  // Obtener un drone específico
  getDrone(id) {
    return api.get(`/drones/${id}`)
  },

  // Crear un nuevo drone
  createDrone(droneData) {
    return api.post('/drones', droneData)
  },

  // Actualizar un drone existente
  updateDrone(id, droneData) {
    return api.patch(`/drones/${id}`, droneData)
  },

  // Eliminar un drone
  deleteDrone(id) {
    return api.delete(`/drones/${id}`)
  },

  // Obtener tipos de drones
  getDroneTypes() {
    return api.get('/drone-types')
  },

  // Obtener marcas de drones
  getDroneBrands() {
    return api.get('/drone-brands')
  }
}

export default droneService