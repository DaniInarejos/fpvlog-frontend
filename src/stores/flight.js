import { defineStore } from 'pinia'
import { ref } from 'vue'
import flightService from '../services/flightService'

export const useFlightStore = defineStore('flight', () => {
  const flights = ref([])
  const loading = ref(false)
  const error = ref(null)
  const totalPages = ref(0)
  const currentPage = ref(1)

  const getUserFlights = async (userId, page = 1) => {
    loading.value = true
    error.value = null
    try {
      const response = await flightService.getUserFlights(userId, page)
      flights.value = response.flights
      totalPages.value = response.totalPages
      currentPage.value = page
      return response
    } catch (err) {
      error.value = 'Error al obtener los vuelos'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createFlight = async (flightData) => {
    loading.value = true
    error.value = null
    try {
      const newFlight = await flightService.createFlight(flightData)
      flights.value.unshift(newFlight)
      return newFlight
    } catch (err) {
      error.value = 'Error al crear el vuelo'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    flights,
    loading,
    error,
    totalPages,
    currentPage,
    getUserFlights,
    createFlight
  }
})