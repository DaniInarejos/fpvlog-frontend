import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    count: 0,
    user: null
  }),
  actions: {
    increment() {
      this.count++
    },
    setUser(user) {
      this.user = user
    }
  }
})

// Exportar todos los stores
export { useUserStore } from './user'
export { useFlightStore } from './flight'
export { useComponentsStore } from './components'