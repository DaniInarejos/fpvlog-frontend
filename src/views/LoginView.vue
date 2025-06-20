<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import BaseCard from '../components/base/BaseCard.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseAlert from '../components/base/BaseAlert.vue'

const router = useRouter()
const userStore = useUserStore()

// Redirigir si ya está autenticado
onMounted(() => {
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
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Bienvenido a FPV Log
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-300">
          Inicia sesión para continuar
        </p>
      </div>

      <BaseCard padding="large">
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

          <BaseInput
            v-model="form.email"
            type="email"
            label="Correo electrónico"
            required
            placeholder="tu@email.com"
          />

          <BaseInput
            v-model="form.password"
            type="password"
            label="Contraseña"
            required
            placeholder="••••••••"
          />

          <div>
            <BaseButton
              type="submit"
              variant="primary"
              class="w-full"
              :loading="loading"
            >
              Iniciar Sesión
            </BaseButton>
          </div>
        </form>

        <div class="mt-4 text-center">
          <router-link
            to="/register"
            class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            ¿No tienes cuenta? Regístrate
          </router-link>
        </div>
      </BaseCard>
    </div>
  </div>
</template>