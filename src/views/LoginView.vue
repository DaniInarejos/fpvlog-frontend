<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useI18n } from 'vue-i18n'
import BaseInput from '../components/base/BaseInput.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseAlert from '../components/base/BaseAlert.vue'
import BaseToast from '../components/base/BaseToast.vue'

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

onMounted(async () => {
  if (userStore.isAuthenticated) {
    router.push('/')
  }
})

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
    router.push('/')
  } catch (err) {
    error.value = 'Credenciales inválidas'
  } finally {
    loading.value = false
  }
}

// Agregar nuevo ref para el toast
const showToast = ref(false)
const toastMessage = ref('')

// Función para manejar el clic en "¿Olvidaste tu contraseña?"
const handleForgotPassword = () => {
  toastMessage.value = `🚧 Función en desarrollo.
  Envia un Correo a danielinarejosaroca@gmail.com 
  desde el correo que quieres cambiar indicando que olvidaste la contraseña.
  Disculpa las molestias.`
  showToast.value = true
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center w-full">
    <div class="w-full max-w-sm p-8">
      <div class="mb-8 text-center">
        <div class="flex flex-col items-center justify-center space-y-3">
          <img 
            src="/src/assets/images/logoSkySphere.png" 
            alt="SkySphere Logo" 
            class="h-20 w-20 transform transition-transform duration-300 hover:scale-110" 
          />
          <span class="text-2xl font-bold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">SkySphere</span>
        </div>
      </div>

      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
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
            <div class="relative">
              <BaseInput
                v-model="form.email"
                type="email"
                :placeholder="t('login.form.email.placeholder')"
                required
                class="w-full pl-10 pr-4 py-3 border-0 bg-gray-50 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all duration-300"
              />
              <span class="absolute left-3 top-3.5 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
            </div>

            <div class="relative">
              <BaseInput
                v-model="form.password"
                type="password"
                placeholder="Contraseña"
                required
                class="w-full pl-10 pr-4 py-3 border-0 bg-gray-50 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all duration-300"
              />
              <span class="absolute left-3 top-3.5 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
            </div>
          </div>

          <div class="flex items-center justify-between text-sm">
            <a 
              href="#" 
              @click.prevent="handleForgotPassword"
              class="text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors duration-300"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <div class="flex justify-center">
            <BaseButton
              type="submit"
              variant="primary"
              class="w-full max-w-[200px] py-3 rounded-xl transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg"
              :loading="loading"
            >
              Iniciar Sesión
            </BaseButton>
          </div>
        </form>

        <div class="mt-6 text-center">
          <router-link
            to="/register"
            class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors duration-300"
          >
            REGISTRARSE
          </router-link>
        </div>
      </div>
    </div>
  </div>

    <!-- Agregar el BaseToast al final del template -->
    <BaseToast
      v-model:show="showToast"
      :message="toastMessage"
      :duration="10000"
    />
</template>

<style scoped>
.backdrop-blur-lg {
  backdrop-filter: blur(16px);
}
</style>