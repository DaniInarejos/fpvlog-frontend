import api from './api'

const componentService = {
  getComponents() {
    return api.get('/components')
  },

  getComponent(id) {
    return api.get(`/components/${id}`)
  },

  getUserComponents(userId) {
    return api.get(`/users/${userId}/components`)
  },

  createComponent(componentData) {
    return api.post('/components', componentData)
  },

  updateComponent(id, componentData) {
    return api.put(`/components/${id}`, componentData)
  },

  deleteComponent(id) {
    return api.delete(`/components/${id}`)
  }
}

export default componentService