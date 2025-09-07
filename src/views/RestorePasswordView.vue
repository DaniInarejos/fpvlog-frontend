<template>
  <div class="min-h-screen bg-background flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <img src="/images/logoSkySphere.png" alt="SkySphere" class="h-12 mx-auto mb-4">
        <h1 class="text-2xl font-bold text-foreground mb-2">{{ $t('restorePassword.title') }}</h1>
        <p class="text-muted-foreground">{{ $t('restorePassword.subtitle') }}</p>
      </div>

      <!-- Form Card -->
      <div class="bg-card border border-border rounded-lg shadow-lg p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- New Password Field -->
          <div>
            <label for="newPassword" class="block text-sm font-medium text-foreground mb-2">
              {{ $t('restorePassword.newPassword') }}
            </label>
            <input
              id="newPassword"
              v-model="form.newPassword"
              type="password"
              required
              :placeholder="$t('restorePassword.newPasswordPlaceholder')"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              :disabled="isLoading"
            >
            <div v-if="errors.newPassword" class="text-destructive text-sm mt-1">
              {{ errors.newPassword }}
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-foreground mb-2">
              {{ $t('restorePassword.confirmPassword') }}
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              :placeholder="$t('restorePassword.confirmPasswordPlaceholder')"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              :disabled="isLoading"
            >
            <div v-if="errors.confirmPassword" class="text-destructive text-sm mt-1">
              {{ errors.confirmPassword }}
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ $t('restorePassword.updating') }}
            </span>
            <span v-else>
              {{ $t('restorePassword.updatePassword') }}
            </span>
          </button>
        </form>

        <!-- Success Message -->
        <div v-if="successMessage" class="mt-4 p-4 bg-success/10 border border-success/20 rounded-md">
          <p class="text-success text-sm">{{ successMessage }}</p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p class="text-destructive text-sm">{{ errorMessage }}</p>
        </div>
      </div>

      <!-- Back to Login -->
      <div class="text-center mt-6">
        <router-link 
          to="/"
          class="text-primary hover:text-primary/80 text-sm font-medium transition-colors duration-200"
        >
          {{ $t('restorePassword.backToLogin') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'

export default {
  name: 'RestorePasswordView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const form = ref({
      newPassword: '',
      confirmPassword: ''
    })
    
    const errors = ref({
      newPassword: '',
      confirmPassword: ''
    })
    
    const isLoading = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')
    const token = ref('')
    
    // Get token from URL params
    onMounted(() => {
      token.value = route.query.token || ''
      if (!token.value) {
        errorMessage.value = 'Token de restablecimiento no válido o expirado'
      }
    })
    
    // Form validation
    const isFormValid = computed(() => {
      return form.value.newPassword.length >= 8 && 
             form.value.confirmPassword.length >= 8 && 
             form.value.newPassword === form.value.confirmPassword
    })
    
    // Validate passwords
    const validatePasswords = () => {
      errors.value = { newPassword: '', confirmPassword: '' }
      
      if (form.value.newPassword.length < 8) {
        errors.value.newPassword = 'La contraseña debe tener al menos 8 caracteres'
        return false
      }
      
      if (form.value.newPassword !== form.value.confirmPassword) {
        errors.value.confirmPassword = 'Las contraseñas no coinciden'
        return false
      }
      
      return true
    }
    
    // Handle form submission
    const handleSubmit = async () => {
      if (!validatePasswords() || !token.value) {
        return
      }
      
      isLoading.value = true
      errorMessage.value = ''
      successMessage.value = ''
      
      try {
        const response = await api.post('/auth/reset-password', {
          token: token.value,
          newPassword: form.value.newPassword
        })
        
        if (response.status === 200) {
          successMessage.value = response.data.message || 'Contraseña actualizada correctamente'
          
          // Redirect to landing page after 2 seconds
          setTimeout(() => {
            router.push('/')
          }, 2000)
        } else {
          errorMessage.value = response.data.message || 'Error al actualizar la contraseña'
        }
      } catch (error) {
        console.error('Error resetting password:', error)
        errorMessage.value = error.response?.data?.message || 'Error al actualizar la contraseña. Inténtalo de nuevo.'
      } finally {
        isLoading.value = false
      }
    }
    
    return {
      form,
      errors,
      isLoading,
      successMessage,
      errorMessage,
      isFormValid,
      handleSubmit
    }
  }
}
</script>