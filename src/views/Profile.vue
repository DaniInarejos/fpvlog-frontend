<template>
  <div class="profile">
    <AppHeader />
    
    <main class="profile-content">
      <div class="profile-form-container">
        <h1>👤 Mi Perfil</h1>
        <form @submit.prevent="handleUpdateProfile" class="profile-form">
          <div class="form-section">
            <h2>Información Personal</h2>
            
            <div class="form-group">
              <label for="username">Nombre de Usuario:</label>
              <input 
                id="username"
                v-model="profileData.username" 
                type="text" 
                required 
                :disabled="loading"
              >
            </div>
            
            <div class="form-group">
              <label for="email">Email:</label>
              <input 
                id="email"
                v-model="profileData.email" 
                type="email" 
                required 
                :disabled="loading"
              >
            </div>
            
            <div class="form-group">
              <label for="firstName">Nombre:</label>
              <input 
                id="firstName"
                v-model="profileData.firstName" 
                type="text" 
                :disabled="loading"
              >
            </div>
            
            <div class="form-group">
              <label for="lastName">Apellido:</label>
              <input 
                id="lastName"
                v-model="profileData.lastName" 
                type="text" 
                :disabled="loading"
              >
            </div>
          </div>
          
          <div class="form-section">
            <h2>Cambiar Contraseña</h2>
            
            <div class="form-group">
              <label for="currentPassword">Contraseña Actual:</label>
              <input 
                id="currentPassword"
                v-model="passwordData.currentPassword" 
                type="password" 
                :disabled="loading"
              >
            </div>
            
            <div class="form-group">
              <label for="newPassword">Nueva Contraseña:</label>
              <input 
                id="newPassword"
                v-model="passwordData.newPassword" 
                type="password" 
                :disabled="loading"
              >
            </div>
            
            <div class="form-group">
              <label for="confirmPassword">Confirmar Nueva Contraseña:</label>
              <input 
                id="confirmPassword"
                v-model="passwordData.confirmPassword" 
                type="password" 
                :disabled="loading"
              >
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" :disabled="loading" class="btn btn-primary">
              {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
          
          <div v-if="message" :class="['message', messageType]">
            {{ message }}
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/AppHeader.vue'

const authStore = useAuthStore()

const profileData = ref({
  username: '',
  email: '',
  firstName: '',
  lastName: ''
})

const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const loading = ref(false)
const message = ref('')
const messageType = ref('success') // 'success' or 'error'

// Cargar datos del usuario al montar el componente
onMounted(() => {
  if (authStore.user) {
    profileData.value = {
      username: authStore.user.username || '',
      email: authStore.user.email || '',
      firstName: authStore.user.firstName || '',
      lastName: authStore.user.lastName || ''
    }
  }
})

const handleUpdateProfile = async () => {
  loading.value = true
  message.value = ''
  
  try {
    // Validar contraseñas si se están cambiando
    if (passwordData.value.newPassword) {
      if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
        throw new Error('Las contraseñas no coinciden')
      }
      if (!passwordData.value.currentPassword) {
        throw new Error('Debe ingresar su contraseña actual')
      }
    }
    
    const updateData = { ...profileData.value }
    
    // Agregar datos de contraseña si se están cambiando
    if (passwordData.value.newPassword) {
      updateData.currentPassword = passwordData.value.currentPassword
      updateData.newPassword = passwordData.value.newPassword
    }
    
    const result = await authStore.updateProfile(updateData)
    
    if (result.success) {
      message.value = 'Perfil actualizado correctamente'
      messageType.value = 'success'
      
      // Limpiar campos de contraseña
      passwordData.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    } else {
      message.value = result.message || 'Error al actualizar el perfil'
      messageType.value = 'error'
    }
  } catch (error) {
    message.value = error.message || 'Error al actualizar el perfil'
    messageType.value = 'error'
  }
  
  loading.value = false
}
</script>

<style scoped>
.profile {
  min-height: 100vh;
  position: relative;
}

.profile-header {
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem 2rem;
  box-shadow: 0 4px 20px rgba(116, 185, 255, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(116, 185, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
}

.profile-header h1 {
  color: var(--sky-text);
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--sky-primary), var(--sky-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.profile-content {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.profile-form-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 25px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(116, 185, 255, 0.2);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.form-section {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(116, 185, 255, 0.2);
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 2rem;
}

.form-section h2 {
  color: var(--sky-text);
  margin-bottom: 2rem;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-section h2::before {
  content: '';
  width: 4px;
  height: 20px;
  background: linear-gradient(135deg, var(--sky-primary), var(--sky-accent));
  border-radius: 2px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--sky-text);
}

.form-group input {
  width: 100%;
  padding: 0.875rem 1.25rem;
  border: 2px solid rgba(116, 185, 255, 0.3);
  border-radius: 15px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--sky-primary);
  box-shadow: 0 0 0 3px rgba(116, 185, 255, 0.15);
  transform: translateY(-2px);
  background: white;
}

.form-actions {
  text-align: center;
  margin-top: 2rem;
}

.form-actions .btn {
  padding: 1rem 3rem;
  font-size: 1.1rem;
}

.message {
  padding: 1rem 1.5rem;
  border-radius: 15px;
  margin: 1.5rem 0;
  font-weight: 500;
  text-align: center;
}

.message.success {
  background: rgba(0, 184, 148, 0.1);
  color: var(--sky-success);
  border: 1px solid rgba(0, 184, 148, 0.3);
}

.message.error {
  background: rgba(232, 67, 147, 0.1);
  color: var(--sky-error);
  border: 1px solid rgba(232, 67, 147, 0.3);
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .profile-content {
    padding: 1rem;
  }
  
  .profile-form-container {
    padding: 2rem;
  }
}
</style>