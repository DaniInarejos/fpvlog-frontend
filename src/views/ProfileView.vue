<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import BaseCard from '../components/base/BaseCard.vue'
import BaseButton from '../components/base/BaseButton.vue'
import UserAvatar from '../components/base/UserAvatar.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseAlert from '../components/base/BaseAlert.vue'

const userStore = useUserStore()
const user = ref(null)
const loading = ref(true)
const success = ref(false)
const error = ref('')

const form = ref({
  username: '',
  name: '',
  lastName: '',
  email: '',
  profilePicture:'',
  privacySettings: {
    allowFollowersToSeeFlights: true,
    allowFollowersToSeeDrones: true,
    profileVisibility: 'public'
  }
})

const loadProfile = async () => {
  try {
    loading.value = true
    // Si el usuario ya está en el store, usamos esos datos
    if (userStore.user) {
      const profile = userStore.user
      user.value = profile
      form.value = {
        username: profile.username,
        name: profile.name,
        lastName: profile.lastName,
        email: profile.email,
        profilePicture: profile.profilePicture,
        privacySettings: { ...profile.privacySettings }
      }
    } else {
      // Solo si no hay datos en el store, hacemos la petición
      await userStore.fetchCurrentUser()
      const profile = userStore.user
      user.value = profile
      form.value = {
        username: profile.username,
        name: profile.name,
        lastName: profile.lastName,
        email: profile.email,
        profilePicture: profile.profilePicture,
        privacySettings: { ...profile.privacySettings }
      }
    }
  } catch (err) {
    error.value = 'Error cargando perfil'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    await userStore.updateProfile({
      ...form.value,
      _id: user.value._id
    })
    success.value = true
    setTimeout(() => success.value = false, 3000)
  } catch (err) {
    error.value = 'Error actualizando perfil'
  } finally {
    loading.value = false
  }
}

const handleProfilePictureUpload = async (event) => {
  try {
    const file = event.target.files[0]
    if (!file) return

    loading.value = true
    error.value = ''
    
    const formData = new FormData()
    formData.append('profilePicture', file)
    
    await userStore.uploadProfilePicture(formData)
    await loadProfile() // Recargar perfil para obtener la nueva foto
    success.value = true
    setTimeout(() => success.value = false, 3000)
  } catch (err) {
    error.value = 'Error subiendo la foto de perfil'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div class="min-h-[85vh] max-w-4xl mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-8 bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent animate-fade-in">
      Mi Perfil
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Estadísticas y foto de perfil -->
      <div class="md:col-span-1 order-1 md:order-none">
        <BaseCard class="backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-gray-200/20 dark:border-gray-700/20 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] p-8">
          <div class="relative group mb-8">
            <UserAvatar
              :src="form.profilePicture || user?.profilePicture"
              :alt="user?.name || 'Usuario'"
              size="2xl"
              class="mx-auto ring-4 ring-sky-500/30 transition-transform duration-300 group-hover:scale-105"
            />
            <label class="absolute bottom-0 left-1/2 -translate-x-1/2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleProfilePictureUpload"
              >
              Cambiar foto
            </label>
          </div>

          <div class="grid grid-cols-3 gap-6">
            <div class="transform hover:scale-105 transition-transform duration-300">
              <div class="text-2xl font-bold text-sky-500">{{ user?.flightCount || 0 }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-300">Vuelos</div>
            </div>
            <div class="transform hover:scale-105 transition-transform duration-300">
              <div class="text-2xl font-bold text-indigo-500">{{ user?.followers?.length || 0 }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-300">Seguidores</div>
            </div>
            <div class="transform hover:scale-105 transition-transform duration-300">
              <div class="text-2xl font-bold text-purple-500">{{ user?.following?.length || 0 }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-300">Siguiendo</div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Información del perfil -->
      <div class="md:col-span-2">
        <BaseCard class="backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-gray-200/20 dark:border-gray-700/20 shadow-xl p-8">
          <BaseAlert
            v-if="error"
            type="error"
            class="mb-6 animate-shake"
            dismissible
            @close="error = ''"
          >
            {{ error }}
          </BaseAlert>

          <BaseAlert
            v-if="success"
            type="success"
            class="mb-6 animate-fade-in"
            dismissible
            @close="success = false"
          >
            Perfil actualizado correctamente
          </BaseAlert>

          <form @submit.prevent="handleSubmit" class="space-y-8">
            <div class="space-y-6">
              <BaseInput
                v-model="form.username"
                label="Nombre de usuario"
                required
                class="transition-all duration-300 focus-within:scale-[1.02]"
              />

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BaseInput
                  v-model="form.name"
                  label="Nombre"
                  required
                  class="transition-all duration-300 focus-within:scale-[1.02]"
                />
                <BaseInput
                  v-model="form.lastName"
                  label="Apellido"
                  required
                  class="transition-all duration-300 focus-within:scale-[1.02]"
                />
              </div>

              <BaseInput
                v-model="form.email"
                type="email"
                label="Correo electrónico"
                required
                disabled
                class="opacity-70"
              />
            </div>

            <!-- Configuración de privacidad -->
            <div class="space-y-6">
              <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Privacidad</h3>
              
              <div class="space-y-4">
                <label class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-300">
                  <input
                    type="checkbox"
                    v-model="form.privacySettings.allowFollowersToSeeFlights"
                    class="w-5 h-5 rounded border-gray-300 text-sky-500 focus:ring-sky-500 transition-colors duration-300"
                  />
                  <span class="text-gray-700 dark:text-gray-300">Permitir que seguidores vean mis vuelos</span>
                </label>

                <label class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-300">
                  <input
                    type="checkbox"
                    v-model="form.privacySettings.allowFollowersToSeeDrones"
                    class="w-5 h-5 rounded border-gray-300 text-sky-500 focus:ring-sky-500 transition-colors duration-300"
                  />
                  <span class="text-gray-700 dark:text-gray-300">Permitir que seguidores vean mis drones</span>
                </label>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Visibilidad del perfil</label>
                <select
                  v-model="form.privacySettings.profileVisibility"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
                >
                  <option value="public">Público</option>
                  <option value="followers">Solo seguidores</option>
                  <option value="private">Privado</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end pt-6">
              <BaseButton
                type="submit"
                variant="primary"
                :loading="loading"
                class="min-w-[150px]"
              >
                Guardar Cambios
              </BaseButton>
            </div>
          </form>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shake {
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(2px); }
  30%, 50%, 70% { transform: translateX(-4px); }
  40%, 60% { transform: translateX(4px); }
}
</style>