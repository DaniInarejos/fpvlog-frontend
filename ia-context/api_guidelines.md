# API Guidelines

## Service Structure

### Directory Organization
```plaintext
src/services/
├── api.js           # Base API configuration and interceptors
├── userService.js   # User-related API calls
├── flightService.js # Flight-related API calls
├── spotService.js   # Spot-related API calls
├── droneService.js  # Drone-related API calls
└── ...             # Other feature-specific services
```

### Service Module Template
```javascript
import api from './api'

const exampleService = {
  // GET requests
  async getItems() {
    return api.get('/endpoint')
  },

  // GET with parameters
  async getItemById(id) {
    return api.get(`/endpoint/${id}`)
  },

  // POST requests
  async createItem(data) {
    return api.post('/endpoint', data)
  },

  // PUT/PATCH requests
  async updateItem(id, data) {
    return api.put(`/endpoint/${id}`, data)
  },

  // DELETE requests
  async deleteItem(id) {
    return api.delete(`/endpoint/${id}`)
  }
}

export default exampleService
```

### API Base Configuration
```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
```

## Error Handling

### Global Error Handler
```javascript
// Global error handling in api.js
api.interceptors.response.use(
  response => response.data,
  error => {
    // Handle specific error cases
    switch (error.response?.status) {
      case 401:
        // Unauthorized - redirect to login
        handleUnauthorized()
        break
      case 403:
        // Forbidden - show permission error
        handleForbidden()
        break
      case 404:
        // Not found - show resource missing
        handleNotFound()
        break
      case 422:
        // Validation errors
        handleValidationErrors(error.response.data)
        break
      default:
        // Generic error handling
        handleGenericError(error)
    }
    return Promise.reject(error)
  }
)
```

### Service-Level Error Handling
```javascript
const userService = {
  async updateProfile(profileData) {
    try {
      const response = await api.patch(
        `/users/${profileData._id}`,
        profileData
      )
      return response
    } catch (error) {
      // Handle specific service errors
      if (error.response?.status === 413) {
        throw new Error('Profile image too large')
      }
      throw error // Let global handler catch other errors
    }
  }
}
```

## Interceptors

### Request Interceptors
```javascript
// Authentication interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Request logging interceptor
api.interceptors.request.use(config => {
  console.log(`[API] ${config.method.toUpperCase()} ${config.url}`)
  return config
})
```

### Response Interceptors
```javascript
// Data transformation interceptor
api.interceptors.response.use(response => {
  // Extract data from response
  return response.data
})

// Authentication error interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear auth state and redirect to login
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

## Best Practices

### 1. Service Organization
- Keep services modular and feature-focused
- Use consistent naming conventions
- Document service methods with JSDoc comments
- Group related endpoints within the same service

### 2. Error Handling
- Implement global error handling for common cases
- Add specific error handling in services when needed
- Provide meaningful error messages to users
- Log errors appropriately for debugging

### 3. Authentication
- Handle token management consistently
- Implement token refresh mechanism
- Secure sensitive routes
- Handle session expiration gracefully

### 4. Data Transformation
- Transform API responses to match frontend needs
- Keep data transformation logic in services
- Use consistent date and number formats
- Handle null/undefined values appropriately

### 5. Testing
- Mock API calls in tests
- Test error handling scenarios
- Validate request/response formats
- Test interceptors functionality

### 6. Performance
- Implement request caching where appropriate
- Cancel pending requests when needed
- Handle concurrent requests properly
- Monitor API response times

### 7. Security
- Never expose sensitive data in logs
- Sanitize request data
- Implement CSRF protection
- Use secure headers