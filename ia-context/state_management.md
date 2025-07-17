# State Management Guidelines

## Store Structure

### Directory Organization
```plaintext
src/stores/
├── index.js       # Store configuration and exports
├── flight.js      # Flight-related state management
└── user.js        # User-related state management
```

### Store Module Template
```javascript
// Example store module structure
import { defineStore } from 'pinia'

export const useFlightStore = defineStore('flight', {
  state: () => ({
    // State properties
    flights: [],
    currentFlight: null,
    isLoading: false,
    error: null
  }),

  getters: {
    // Computed state
    sortedFlights: (state) => [...state.flights].sort((a, b) => b.date - a.date),
    flightsByLocation: (state) => (location) => {
      return state.flights.filter(flight => flight.location === location)
    }
  },

  actions: {
    // Async operations and state mutations
    async fetchFlights() {
      this.isLoading = true
      try {
        const response = await api.getFlights()
        this.flights = response.data
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    }
  }
})
```

## Actions and Mutations

### Action Guidelines

1. **Naming Conventions**
   - Use verb-based names for actions
   - Prefix async actions with verbs indicating the operation:
     - `fetch` for GET requests
     - `create` for POST requests
     - `update` for PUT/PATCH requests
     - `delete` for DELETE requests

```javascript
// Good action naming
actions: {
  async fetchFlightDetails(id) { /* ... */ },
  async createNewFlight(data) { /* ... */ },
  async updateFlightStatus(id, status) { /* ... */ },
  async deleteFlightRecord(id) { /* ... */ }
}
```

2. **Error Handling**
```javascript
actions: {
  async updateFlight(flightData) {
    this.isLoading = true
    this.error = null
    
    try {
      const response = await api.updateFlight(flightData)
      this.currentFlight = response.data
      return response.data
    } catch (error) {
      this.error = error.message
      throw error
    } finally {
      this.isLoading = false
    }
  }
}
```

3. **State Updates**
```javascript
actions: {
  setCurrentFlight(flight) {
    this.currentFlight = { ...flight } // Create copy to avoid reference issues
  },
  
  updateFlightList(newFlight) {
    const index = this.flights.findIndex(f => f.id === newFlight.id)
    if (index !== -1) {
      this.flights[index] = { ...newFlight }
    } else {
      this.flights.push({ ...newFlight })
    }
  }
}
```

## Shared Composables

### State Access Composables

```javascript
// composables/useFlightManagement.js
import { storeToRefs } from 'pinia'
import { useFlightStore } from '@/stores/flight'

export function useFlightManagement() {
  const store = useFlightStore()
  const { flights, currentFlight, isLoading, error } = storeToRefs(store)
  
  const loadFlightDetails = async (id) => {
    await store.fetchFlightDetails(id)
  }
  
  const saveFlight = async (flightData) => {
    const result = await store.createNewFlight(flightData)
    return result
  }
  
  return {
    // Reactive state
    flights,
    currentFlight,
    isLoading,
    error,
    
    // Methods
    loadFlightDetails,
    saveFlight
  }
}
```

### Reusable Logic Composables

```javascript
// composables/useFlightValidation.js
import { computed } from 'vue'

export function useFlightValidation(flight) {
  const isValidDuration = computed(() => {
    return flight.value?.duration > 0 && flight.value?.duration < 120
  })

  const isValidLocation = computed(() => {
    return flight.value?.location?.trim().length > 0
  })

  const canSaveFlight = computed(() => {
    return isValidDuration.value && isValidLocation.value
  })

  return {
    isValidDuration,
    isValidLocation,
    canSaveFlight
  }
}
```

### Component Usage Example

```vue
<script setup>
import { useFlightManagement } from '@/composables/useFlightManagement'
import { useFlightValidation } from '@/composables/useFlightValidation'

const { currentFlight, isLoading, saveFlight } = useFlightManagement()
const { canSaveFlight } = useFlightValidation(currentFlight)

const handleSave = async () => {
  if (canSaveFlight.value) {
    await saveFlight(currentFlight.value)
  }
}
</script>

<template>
  <div>
    <button 
      @click="handleSave"
      :disabled="!canSaveFlight || isLoading"
    >
      {{ isLoading ? 'Saving...' : 'Save Flight' }}
    </button>
  </div>
</template>
```

## Best Practices

1. **State Organization**
   - Keep state minimal and derived data in getters
   - Use namespaced stores for feature isolation
   - Maintain single source of truth

2. **Performance Optimization**
   - Use `storeToRefs` for reactive state destructuring
   - Implement selective subscription to store changes
   - Cache computed properties when appropriate

3. **Testing Considerations**
   - Keep business logic in composables for easier testing
   - Mock store actions in component tests
   - Test store modules in isolation

4. **State Persistence**
   - Implement state hydration for critical data
   - Use plugins for persistent storage when needed
   - Handle storage errors gracefully