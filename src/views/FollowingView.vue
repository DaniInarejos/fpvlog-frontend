<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import BaseCard from '../components/base/BaseCard.vue'
import UserAvatar from '../components/base/UserAvatar.vue'
import BaseButton from '../components/base/BaseButton.vue'
import followerService from '../services/followerService'

const router = useRouter()
const userStore = useUserStore()
const following = ref([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const filteredFollowing = computed(() => {
  if (!searchQuery.value) return following.value
  return following.value.filter(user => 
    user.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const loadFollowing = async () => {
  try {
    loading.value = true
    await userStore.initAuth()
    
    if (!userStore.user?._id) {
      error.value = 'Usuario no encontrado'
      return
    }
    
    const response = await followerService.getUserFollowing(userStore.user._id)
    following.value = response.following || [] // Actualizamos para usar response.following
  } catch (err) {
    error.value = 'Error cargando usuarios seguidos'
  } finally {
    loading.value = false
  }
}

const navigateToDashboard = (username) => {
  router.push(`/dashboard/${username}`)
}

const handleUnfollow = async (event, userId) => {
  event.stopPropagation() // Evitar navegación al hacer unfollow
  try {
    await followerService.unfollowUser(userId)
    following.value = following.value.filter(user => user._id !== userId)
  } catch (err) {
    error.value = 'Error al dejar de seguir al usuario'
  }
}

onMounted(() => {
  loadFollowing()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <BaseCard>
      <template #header>
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl font-bold">Siguiendo</h1>
          <div class="relative w-64">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por username..."
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </template>
      
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="error" class="text-red-500 text-center py-4">
        {{ error }}
      </div>

      <div v-else-if="filteredFollowing.length === 0" class="text-center py-4 text-gray-500">
        {{ searchQuery ? 'No se encontraron usuarios' : 'No sigues a ningún usuario aún' }}
      </div>

      <div v-else class="space-y-4">
        <div v-for="user in filteredFollowing" 
             :key="user._id" 
             class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-gray-100 hover:border-primary"
             @click="navigateToDashboard(user.username)">
          <div class="flex items-center space-x-4">
            <UserAvatar 
              :src="user.profilePicture" 
              :alt="user.username"
              :size="12" 
            />
            <div>
              <h3 class="font-semibold text-lg">@{{ user.username }}</h3>
              <p class="text-sm text-gray-500">Seguido desde {{ new Date(user.followedAt).toLocaleDateString() }}</p>
            </div>
          </div>
          <BaseButton
            variant="danger"
            size="sm"
            class="hover:scale-105 transition-transform"
            @click="(event) => handleUnfollow(event, user._id)"
          >
            Dejar de seguir
          </BaseButton>
        </div>
      </div>
    </BaseCard>
  </div>
</template>