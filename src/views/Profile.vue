<template>
  <div class="profile">
    <AppHeader />
    
    <main class="profile-content">
      <div class="profile-form-container">
        <h1>👤 Mi Perfil</h1>
        
        <!-- Sección de foto de perfil moderna -->
        <div class="profile-picture-section">
          <div class="profile-avatar-container">
            <div class="profile-avatar">
              <img 
                v-if="profileData.profilePicture" 
                :src="getProfilePictureUrl(profileData.profilePicture)" 
                alt="Avatar"
                class="avatar-image"
              >
              <div v-else class="avatar-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              
              <!-- Botón de cambiar foto superpuesto -->
              <button 
                type="button" 
                @click="$refs.fileInput.click()"
                class="avatar-edit-btn"
                :disabled="uploadingPicture"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            
            <!-- Botones de acción modernos -->
            <div class="avatar-actions">
              <input 
                ref="fileInput"
                type="file" 
                accept="image/*" 
                @change="handleFileSelect"
                style="display: none"
              >
              
              <button 
                v-if="profileData.profilePicture"
                type="button" 
                @click="removeProfilePicture"
                class="action-btn danger"
                :disabled="uploadingPicture"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Eliminar
              </button>
            </div>
            
            <!-- Indicador de carga -->
            <div v-if="uploadingPicture" class="upload-indicator">
              <div class="spinner"></div>
              <span>Subiendo...</span>
            </div>
          </div>
        </div>
        
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
import api from '@/services/api'

const authStore = useAuthStore()

// Obtener la URL base del API desde las variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL

const profileData = ref({
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  profilePicture: ''
})

const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const loading = ref(false)
const uploadingPicture = ref(false)
const message = ref('')
const messageType = ref('success') // 'success' or 'error'

// Función para construir la URL completa de la foto de perfil
const getProfilePictureUrl = (profilePicturePath) => {
  if (!profilePicturePath) return ''
  
  // Si ya es una URL completa, devolverla tal como está
  if (profilePicturePath.startsWith('http://') || profilePicturePath.startsWith('https://')) {
    return profilePicturePath
  }
  
  // Si es una ruta relativa, construir la URL completa
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL
  const path = profilePicturePath.startsWith('/') ? profilePicturePath : `/${profilePicturePath}`
  
  return `${baseUrl}${path}`
}

// Cargar datos del usuario al montar el componente
onMounted(() => {
  if (authStore.user) {
    profileData.value = {
      username: authStore.user.username || '',
      email: authStore.user.email || '',
      firstName: authStore.user.firstName || '',
      lastName: authStore.user.lastName || '',
      profilePicture: authStore.user.profilePicture || ''
    }
  }
})

const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // Validar tipo de archivo
  if (!file.type.startsWith('image/')) {
    message.value = 'Por favor selecciona un archivo de imagen válido'
    messageType.value = 'error'
    return
  }
  
  // Validar tamaño (5MB máximo según el API)
  if (file.size > 5 * 1024 * 1024) {
    message.value = 'La imagen debe ser menor a 5MB'
    messageType.value = 'error'
    return
  }
  
  await uploadProfilePicture(file)
}

const uploadProfilePicture = async (file) => {
  uploadingPicture.value = true
  message.value = ''
  
  try {
    const formData = new FormData()
    formData.append('profilePicture', file)
    
    const response = await api.post('/users/upload-profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    // Actualizar la foto de perfil en el estado local
    profileData.value.profilePicture = response.data.profilePicture
    
    // Actualizar el usuario en el store
    await authStore.fetchUser()
    
    message.value = 'Foto de perfil actualizada correctamente'
    messageType.value = 'success'
    
  } catch (error) {
    console.error('Error uploading profile picture:', error)
    message.value = error.response?.data?.message || 'Error al subir la foto de perfil'
    messageType.value = 'error'
  }
  
  uploadingPicture.value = false
}

const removeProfilePicture = async () => {
  if (!confirm('¿Estás seguro de que quieres eliminar tu foto de perfil?')) {
    return
  }
  
  uploadingPicture.value = true
  message.value = ''
  
  try {
    // Aquí podrías implementar un endpoint específico para eliminar la foto
    // Por ahora, simplemente actualizamos el perfil sin la foto
    const updateData = { ...profileData.value }
    delete updateData.profilePicture
    
    const result = await authStore.updateProfile(updateData)
    
    if (result.success) {
      profileData.value.profilePicture = ''
      message.value = 'Foto de perfil eliminada correctamente'
      messageType.value = 'success'
    } else {
      message.value = result.message || 'Error al eliminar la foto de perfil'
      messageType.value = 'error'
    }
    
  } catch (error) {
    console.error('Error removing profile picture:', error)
    message.value = 'Error al eliminar la foto de perfil'
    messageType.value = 'error'
  }
  
  uploadingPicture.value = false
}

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

/* Sección de avatar moderna */
.profile-picture-section {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(116, 185, 255, 0.1);
  display: flex;
  justify-content: center;
}

.profile-avatar-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.profile-avatar {
  position: relative;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 4px solid #ffffff;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(116, 185, 255, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.profile-avatar:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(116, 185, 255, 0.2);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.profile-avatar:hover .avatar-image {
  transform: scale(1.05);
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
}

/* Botón de editar superpuesto */
.avatar-edit-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: #64748b;
}

.avatar-edit-btn:hover {
  background: var(--sky-primary);
  border-color: var(--sky-primary);
  color: white;
  transform: scale(1.1);
}

.avatar-edit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Botones de acción modernos */
.avatar-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-btn.danger {
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.2);
}

.action-btn.danger:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Indicador de carga */
.upload-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #e2e8f0;
  border-top: 2px solid var(--sky-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Secciones del formulario */
.form-section {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(116, 185, 255, 0.1);
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
  border: 2px solid rgba(116, 185, 255, 0.2);
  border-radius: 15px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--sky-primary);
  box-shadow: 0 0 0 3px rgba(116, 185, 255, 0.1);
  transform: translateY(-1px);
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
  .profile-content {
    padding: 1rem;
  }
  
  .profile-form-container {
    padding: 2rem;
  }
  
  .profile-avatar {
    width: 120px;
    height: 120px;
  }
  
  .avatar-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>