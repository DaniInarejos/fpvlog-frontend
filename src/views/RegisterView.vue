<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useI18n } from 'vue-i18n'
import BaseInput from '../components/base/BaseInput.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseAlert from '../components/base/BaseAlert.vue'
import BaseCard from '../components/base/BaseCard.vue'

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  lastName: '',
  privacySettings: {
    allowFollowersToSeeFlights: true,
    allowFollowersToSeeDrones: true,
    profileVisibility: 'public'
  }
})

const errors = ref({})
const isLoading = ref(false)
const showSuccessAlert = ref(false)
const showTermsModal = ref(false)

const validateForm = () => {
  errors.value = {}
  if (!formData.value.username) errors.value.username = 'El nombre de usuario es requerido'
  if (!formData.value.name) errors.value.name = 'El nombre es requerido'
  if (!formData.value.lastName) errors.value.lastName = 'El apellido es requerido'
  if (!formData.value.email) errors.value.email = 'El email es requerido'
  if (!formData.value.password) errors.value.password = 'La contraseña es requerida'
  if (formData.value.password.length < 6) errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
  if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden'
  }
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  try {
    await userStore.register({
      username: formData.value.username,
      email: formData.value.email.toLowerCase().trim(),
      password: formData.value.password,
      name: formData.value.name,
      lastName: formData.value.lastName,
      privacySettings: formData.value.privacySettings
    })
    showSuccessAlert.value = true
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    errors.value.submit = error.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <!-- Fondo animado similar a la landing -->
  <div class="register-container">
    <!-- Orbes flotantes de fondo -->
    <div class="floating-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <!-- Contenido principal -->
    <div class="register-content">
      <div class="register-header">
        <div class="logo-section">
          <div class="logo-glow"></div>
          <h1 class="register-title gradient-text">Únete a SkySphere</h1>
        </div>
        <p class="register-subtitle">
          Conecta con pilotos FPV de todo el mundo y comparte tus aventuras
        </p>
        <p class="login-link">
          ¿Ya tienes una cuenta?
          <router-link to="/login" class="link-primary">
            Inicia sesión
          </router-link>
        </p>
      </div>

      <div class="register-form-container">
        <form @submit.prevent="handleSubmit" class="register-form">
          <BaseAlert
            v-if="showSuccessAlert"
            type="success"
            message="Registro exitoso. Redirigiendo..."
          />
          <BaseAlert
            v-if="errors.submit"
            type="error"
            :message="errors.submit"
          />

          <div class="form-grid">
            <BaseInput
              v-model="formData.username"
              label="Nombre de usuario"
              :error="errors.username"
              required
              class="form-input"
            />

            <BaseInput
              v-model="formData.email"
              label="Email"
              type="email"
              :error="errors.email"
              required
              class="form-input"
            />

            <BaseInput
              v-model="formData.name"
              label="Nombre"
              :error="errors.name"
              required
              class="form-input"
            />

            <BaseInput
              v-model="formData.lastName"
              label="Apellido"
              :error="errors.lastName"
              required
              class="form-input"
            />

            <BaseInput
              v-model="formData.password"
              label="Contraseña"
              type="password"
              :error="errors.password"
              required
              class="form-input"
            />

            <BaseInput
              v-model="formData.confirmPassword"
              label="Confirmar contraseña"
              type="password"
              :error="errors.confirmPassword"
              required
              class="form-input"
            />
          </div>

          <div class="terms-section">
            <div class="checkbox-container">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                class="custom-checkbox"
              />
              <label for="terms" class="checkbox-label">
                Acepto los
                <button
                  type="button"
                  @click="showTermsModal = true"
                  class="terms-link"
                >
                  términos y condiciones
                </button>
              </label>
            </div>
          </div>

          <div class="submit-section">
            <BaseButton
              type="submit"
              :loading="isLoading"
              class="register-button"
            >
              <span>Crear Cuenta</span>
              <div class="btn-glow"></div>
            </BaseButton>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Términos y Condiciones con estilo mejorado -->
    <div v-if="showTermsModal" class="modal-overlay" @click="showTermsModal = false">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title gradient-text">{{ t('terms.title') }}</h2>
          <button @click="showTermsModal = false" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="modal-content">
          <p class="modal-subtitle">{{ t('terms.lastUpdated') }}: {{ t('terms.updateDate') }}</p>
          
          <div class="terms-sections">
            <BaseCard v-for="section in ['definitions', 'registration', 'content', 'affiliates', 'privacy', 'liability', 'offers', 'modifications']" :key="section" class="terms-card">
              <h3 class="section-title">{{ t(`terms.${section}.title`) }}</h3>
              <div class="section-content">
                <!-- Contenido de términos igual que antes -->
                <template v-if="section === 'definitions'">
                  <h4>{{ t('terms.definitions.user') }}</h4>
                  <p>{{ t('terms.definitions.userDesc') }}</p>
                  <h4>{{ t('terms.definitions.fpvPilot') }}</h4>
                  <p>{{ t('terms.definitions.fpvPilotDesc') }}</p>
                  <h4>{{ t('terms.definitions.content') }}</h4>
                  <p>{{ t('terms.definitions.contentDesc') }}</p>
                  <h4>{{ t('terms.definitions.services') }}</h4>
                  <p>{{ t('terms.definitions.servicesDesc') }}</p>
                </template>
                <!-- Resto de secciones igual que antes -->
              </div>
            </BaseCard>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showTermsModal = false" class="modal-button">
            <span>Cerrar</span>
            <div class="btn-glow"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Contenedor principal con fondo animado */
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

/* Orbes flotantes de fondo */
.floating-orbs {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  animation: float 6s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, transparent 70%);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%);
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%);
  bottom: 20%;
  left: 50%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(120deg); }
  66% { transform: translateY(10px) rotate(240deg); }
}

/* Contenido principal */
.register-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 500px;
}

/* Header de registro */
.register-header {
  text-align: center;
  margin-bottom: 3rem;
}

.logo-section {
  position: relative;
  margin-bottom: 1.5rem;
}

.logo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 100px;
  background: radial-gradient(ellipse, rgba(14, 165, 233, 0.3) 0%, transparent 70%);
  filter: blur(20px);
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
}

.register-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0;
  position: relative;
  z-index: 2;
}

.gradient-text {
  background: linear-gradient(45deg, #0ea5e9, #6366f1, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
  animation: gradientShift 3s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.register-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.login-link {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
}

.link-primary {
  color: #0ea5e9;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.link-primary:hover {
  color: #38bdf8;
}

/* Formulario */
.register-form-container {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.register-form {
  space-y: 1.5rem;
}

.form-grid {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-input {
  transition: all 0.3s ease;
}

.form-input:focus-within {
  transform: translateY(-2px);
}

/* Sección de términos */
.terms-section {
  margin-bottom: 2rem;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.custom-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(14, 165, 233, 0.5);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.125rem;
}

.custom-checkbox:checked {
  background: linear-gradient(45deg, #0ea5e9, #6366f1);
  border-color: #0ea5e9;
}

.checkbox-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.5;
  cursor: pointer;
}

.terms-link {
  color: #0ea5e9;
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 600;
  transition: color 0.3s ease;
}

.terms-link:hover {
  color: #38bdf8;
}

/* Botón de registro */
.submit-section {
  margin-top: 2rem;
}

.register-button {
  width: 100%;
  background: linear-gradient(45deg, #0ea5e9, #6366f1);
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #000;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(14, 165, 233, 0.3);
}

.register-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(14, 165, 233, 0.4);
}

.btn-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.register-button:hover .btn-glow {
  left: 100%;
}

/* Modal mejorado */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 2rem;
}

.modal-container {
  background: rgba(30, 41, 59, 0.95);
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 20px;
  max-width: 4xl;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.modal-content {
  padding: 2rem;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-subtitle {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2rem;
  text-align: center;
}

.terms-sections {
  space-y: 1.5rem;
}

.terms-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
}

.section-title {
  color: #0ea5e9;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.section-content {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.section-content h4 {
  color: #ffffff;
  font-weight: 600;
  margin: 1rem 0 0.5rem 0;
}

.section-content p {
  margin-bottom: 1rem;
}

.modal-footer {
  padding: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
}

.modal-button {
  background: linear-gradient(45deg, #0ea5e9, #6366f1);
  border: none;
  border-radius: 12px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  color: #000;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.modal-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(14, 165, 233, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .register-container {
    padding: 1rem;
  }
  
  .register-form-container {
    padding: 1.5rem;
  }
  
  .register-title {
    font-size: 2rem;
  }
  
  .modal-container {
    margin: 1rem;
    max-height: 90vh;
  }
  
  .modal-header,
  .modal-content,
  .modal-footer {
    padding: 1.5rem;
  }
}
</style>