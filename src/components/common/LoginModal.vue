<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { useI18n } from 'vue-i18n'
import BaseInput from '../base/BaseInput.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseAlert from '../base/BaseAlert.vue'
import BaseModal from '../base/BaseModal.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'login-success'])

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

const form = ref({
  email: '',
  password: ''
})

const error = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    await userStore.login(form.value)
    emit('login-success')
    emit('close')
  } catch (err) {
    error.value = 'Credenciales inválidas'
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  form.value = { email: '', password: '' }
  error.value = ''
  emit('close')
}

const goToRegister = () => {
  emit('close')
  router.push('/register')
}
</script>

<template>
  <BaseModal
    :show="show"
    title="Iniciar Sesión"
    @close="handleClose"
    :show-accept-button="false"
    :show-cancel-button="false"
    :show-close-button="true"
    size="default"
  >
    <!-- Contenido del modal -->
    <div class="space-y-6">
      <!-- Logo y título -->
      <div class="text-center">
        <div class="flex flex-col items-center justify-center space-y-3">
          <img 
            src="/images/logoSkySphere.png" 
            alt="SkySphere Logo" 
            class="h-12 w-12 transition-transform duration-300 hover:scale-110" 
          />
          <span class="text-lg font-semibold gradient-text">SkySphere</span>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseAlert
          v-if="error"
          type="error"
          class="mb-4"
          dismissible
          @close="error = ''"
        >
          {{ error }}
        </BaseAlert>

        <div class="space-y-4">
          <BaseInput
            v-model="form.email"
            type="email"
            label="Correo electrónico"
            placeholder="tu@email.com"
            required
            class="input"
          />

          <BaseInput
            v-model="form.password"
            type="password"
            label="Contraseña"
            placeholder="Tu contraseña"
            required
            class="input"
          />
        </div>

        <div class="flex justify-center pt-4">
          <BaseButton
            type="submit"
            variant="primary"
            class="w-full btn btn-primary"
            :loading="loading"
          >
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </BaseButton>
        </div>
      </form>

      <div class="text-center pt-4 border-t border-gray-200/20 dark:border-gray-700/20">
        <button
          @click="goToRegister"
          class="text-sm transition-colors duration-300 hover:transform hover:-translate-y-1"
        >
          ¿No tienes cuenta? <span class="font-medium gradient-text">Registrarse</span>
        </button>
      </div>
    </div>
  </BaseModal>
</template>