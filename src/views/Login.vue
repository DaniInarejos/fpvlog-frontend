<template>
  <div class="login-container">
    <div class="login-form">
      <h2>FPV Log - {{ isRegisterMode ? 'Crear Cuenta' : 'Iniciar Sesión' }}</h2>
      
      <form @submit.prevent="handleSubmit">
        <!-- Campos adicionales para registro -->
        <div v-if="isRegisterMode" class="form-group">
          <label for="username">Nombre de Usuario:</label>
          <input 
            id="username"
            v-model="formData.username" 
            type="text" 
            required 
            :disabled="loading"
          >
        </div>
        
        <div v-if="isRegisterMode" class="form-group">
          <label for="firstName">Nombre:</label>
          <input 
            id="firstName"
            v-model="formData.firstName" 
            type="text" 
            :disabled="loading"
          >
        </div>
        
        <div v-if="isRegisterMode" class="form-group">
          <label for="lastName">Apellido:</label>
          <input 
            id="lastName"
            v-model="formData.lastName" 
            type="text" 
            :disabled="loading"
          >
        </div>
        
        <!-- Campo email (común para login y registro) -->
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            id="email"
            v-model="formData.email" 
            type="email" 
            required 
            :disabled="loading"
          >
        </div>
        
        <!-- Campo contraseña (común para login y registro) -->
        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input 
            id="password"
            v-model="formData.password" 
            type="password" 
            required 
            :disabled="loading"
          >
        </div>
        
        <!-- Confirmar contraseña solo para registro -->
        <div v-if="isRegisterMode" class="form-group">
          <label for="confirmPassword">Confirmar Contraseña:</label>
          <input 
            id="confirmPassword"
            v-model="formData.confirmPassword" 
            type="password" 
            required 
            :disabled="loading"
          >
        </div>
        
        <button type="submit" :disabled="loading">
          {{ loading ? (isRegisterMode ? 'Creando cuenta...' : 'Iniciando sesión...') : (isRegisterMode ? 'Crear Cuenta' : 'Iniciar Sesión') }}
        </button>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>
      
      <!-- Toggle entre login y registro -->
      <div class="toggle-mode">
        <p v-if="!isRegisterMode">
          ¿No tienes cuenta? 
          <button @click="toggleMode" class="link-button" :disabled="loading">
            Crear una cuenta
          </button>
        </p>
        <p v-else>
          ¿Ya tienes cuenta? 
          <button @click="toggleMode" class="link-button" :disabled="loading">
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isRegisterMode = ref(false)
const loading = ref(false)
const error = ref('')

const formData = reactive({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value
  error.value = ''
  // Limpiar campos específicos de registro
  if (!isRegisterMode.value) {
    formData.username = ''
    formData.firstName = ''
    formData.lastName = ''
    formData.confirmPassword = ''
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  
  try {
    if (isRegisterMode.value) {
      await handleRegister()
    } else {
      await handleLogin()
    }
  } catch (err) {
    error.value = err.message
  }
  
  loading.value = false
}

const handleLogin = async () => {
  const credentials = {
    email: formData.email,
    password: formData.password
  }
  
  const result = await authStore.login(credentials)
  
  if (result.success) {
    router.push('/dashboard')
  } else {
    error.value = result.message
  }
}

const handleRegister = async () => {
  // Validar que las contraseñas coincidan
  if (formData.password !== formData.confirmPassword) {
    throw new Error('Las contraseñas no coinciden')
  }
  
  // Validar longitud mínima de contraseña
  if (formData.password.length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres')
  }
  
  const userData = {
    username: formData.username,
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    password: formData.password
  }
  
  const result = await authStore.register(userData)
  
  if (result.success) {
    router.push('/dashboard')
  } else {
    error.value = result.message
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.2) 0%, transparent 30%),
    radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 35%);
  animation: drift 25s ease-in-out infinite;
}

@keyframes drift {
  0%, 100% { transform: translateX(0px); }
  50% { transform: translateX(20px); }
}

.login-form {
  background: rgba(255, 255, 255, 0.95);
  padding: 3rem;
  border-radius: 25px;
  box-shadow: 0 20px 60px rgba(116, 185, 255, 0.25);
  width: 100%;
  max-width: 450px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 2;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--sky-text);
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--sky-primary), var(--sky-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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

button[type="submit"] {
  width: 100%;
  margin: 1.5rem 0 1rem 0;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.error-message {
  background: rgba(232, 67, 147, 0.1);
  color: var(--sky-error);
  padding: 1rem;
  border-radius: 12px;
  margin-top: 1rem;
  border: 1px solid rgba(232, 67, 147, 0.3);
  text-align: center;
  font-weight: 500;
}

.toggle-mode {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(116, 185, 255, 0.2);
}

.toggle-mode p {
  color: var(--sky-text-light);
  margin: 0;
}

.link-button {
  background: none;
  border: none;
  color: var(--sky-primary);
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
  padding: 0;
  font-size: inherit;
  transition: color 0.3s ease;
}

.link-button:hover {
  color: var(--sky-secondary);
}

.link-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
  }
  
  .login-form {
    padding: 2rem;
  }
}
</style>