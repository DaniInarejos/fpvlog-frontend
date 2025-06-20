<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import BaseInput from '../components/base/BaseInput.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseAlert from '../components/base/BaseAlert.vue'

const router = useRouter()
const userStore = useUserStore()

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
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Crear una cuenta
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?
        <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
          Inicia sesión
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleSubmit" class="space-y-6">
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

          <BaseInput
            v-model="formData.username"
            label="Nombre de usuario"
            :error="errors.username"
            required
          />

          <BaseInput
            v-model="formData.name"
            label="Nombre"
            :error="errors.name"
            required
          />

          <BaseInput
            v-model="formData.lastName"
            label="Apellido"
            :error="errors.lastName"
            required
          />

          <BaseInput
            v-model="formData.email"
            label="Email"
            type="email"
            :error="errors.email"
            required
          />

          <BaseInput
            v-model="formData.password"
            label="Contraseña"
            type="password"
            :error="errors.password"
            required
          />

          <BaseInput
            v-model="formData.confirmPassword"
            label="Confirmar contraseña"
            type="password"
            :error="errors.confirmPassword"
            required
          />

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="terms" class="ml-2 block text-sm text-gray-900">
                Acepto los
                <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
                  términos y condiciones
                </a>
              </label>
            </div>
          </div>

          <div>
            <BaseButton
              type="submit"
              :loading="isLoading"
              class="w-full"
            >
              Registrarse
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>