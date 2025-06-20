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
  <div class="max-w-3xl mx-auto py-6">
    <h1 class="text-2xl font-bold mb-6">Mi Perfil</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Información del perfil -->
      <div class="md:col-span-2">
        <BaseCard padding="large">
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
            dismissible
            @close="success = false"
          >
            Perfil actualizado correctamente
          </BaseAlert>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <BaseInput
              v-model="form.username"
              label="Nombre de usuario"
              required
            />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BaseInput
                v-model="form.name"
                label="Nombre"
                required
              />
              <BaseInput
                v-model="form.lastName"
                label="Apellido"
                required
              />
            </div>

            <BaseInput
              v-model="form.email"
              type="email"
              label="Correo electrónico"
              required
              disabled
            />

            <BaseInput
              v-model="form.profilePicture"
              type="url"
              label="Imagen Perfil"
            />

            <!-- Configuración de privacidad -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium">Privacidad</h3>
              
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="form.privacySettings.allowFollowersToSeeFlights"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span class="ml-2">Permitir que seguidores vean mis vuelos</span>
                </label>

                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="form.privacySettings.allowFollowersToSeeDrones"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span class="ml-2">Permitir que seguidores vean mis drones</span>
                </label>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">Visibilidad del perfil</label>
                <select
                  v-model="form.privacySettings.profileVisibility"
                  class="input"
                >
                  <option value="public">Público</option>
                  <option value="followers">Solo seguidores</option>
                  <option value="private">Privado</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end">
              <BaseButton
                type="submit"
                variant="primary"
                :loading="loading"
              >
                Guardar Cambios
              </BaseButton>
            </div>
          </form>
        </BaseCard>
      </div>

      <!-- Estadísticas y foto de perfil -->
      <div>
        <BaseCard class="text-center p-6">
          <div class="mb-6">
            <UserAvatar
              :src="form.profilePicture || user?.profilePicture"
              :alt="user?.name || 'Usuario'"
              size="xl"
              class="mx-auto"
            />
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div>
              <div class="text-2xl font-bold">{{ user?.flightCount || 0 }}</div>
              <div class="text-sm text-gray-500">Vuelos</div>
            </div>
            <div>
              <div class="text-2xl font-bold">{{ user?.followers?.length || 0 }}</div>
              <div class="text-sm text-gray-500">Seguidores</div>
            </div>
            <div>
              <div class="text-2xl font-bold">{{ user?.following?.length || 0 }}</div>
              <div class="text-sm text-gray-500">Siguiendo</div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>