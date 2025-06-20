import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFlightStore = defineStore('flight', () => {
  const flights = ref([])
  const loading = ref(false)
  const error = ref(null)

  const getVisibleFlights = async (page = 1) => {
    loading.value = true
    error.value = null
    
    try {
      // Aquí iría la llamada a la API
      // Simulación temporal
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockFlights = Array(5).fill(null).map((_, index) => ({
        _id: `flight-${page}-${index}`,
        title: `Vuelo de prueba ${page}-${index}`,
        description: 'Descripción del vuelo de prueba',
        createdAt: new Date().toISOString(),
        duration: Math.floor(Math.random() * 20) + 5,
        distance: (Math.random() * 5).toFixed(1),
        maxAltitude: Math.floor(Math.random() * 200) + 50,
        user: {
          name: 'Usuario de Prueba',
          profilePicture: null
        },
        drone: {
          name: 'Drone de Prueba'
        }
      }))

      return {
        flights: mockFlights,
        hasMore: page < 3 // Simulamos que hay 3 páginas
      }
    } catch (err) {
      error.value = 'Error al cargar los vuelos'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    flights,
    loading,
    error,
    getVisibleFlights
  }
})