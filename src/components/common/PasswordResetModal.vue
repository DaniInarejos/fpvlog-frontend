<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseInput from '../base/BaseInput.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseAlert from '../base/BaseAlert.vue'
import BaseModal from '../base/BaseModal.vue'
import { api } from '../../services/api'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'success'])

const { t } = useI18n()

const form = ref({
  email: ''
})

const error = ref('')
const success = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = ''
    
    await api.post('/auth/request-password-reset', {
      email: form.value.email
    })
    
    success.value = 'Se ha enviado un enlace de recuperación a tu correo electrónico'
    form.value.email = ''
    
    // Cerrar modal después de 3 segundos
    setTimeout(() => {
      emit('success')
      emit('close')
    }, 3000)
    
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al enviar el correo de recuperación'
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  form.value = { email: '' }
  error.value = ''
  success.value = ''
  loading.value = false
  emit('close')
}
</script>

<template>
  <BaseModal
    :show="show"
    title="Recuperar Contraseña"
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

      <div class="text-center text-sm text-muted-foreground">
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
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

        <BaseAlert
          v-if="success"
          type="success"
          class="mb-4"
        >
          {{ success }}
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
        </div>

        <div class="flex justify-center pt-4">
          <BaseButton
            type="submit"
            variant="primary"
            class="w-full btn btn-primary"
          >
            {{ loading ? 'Enviando...' : 'Enviar enlace de recuperación' }}
          </BaseButton>
        </div>
      </form>
    </div>
  </BaseModal>
</template>