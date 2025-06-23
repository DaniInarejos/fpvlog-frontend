<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import BaseCard from '../components/base/BaseCard.vue'
import UserAvatar from '../components/base/UserAvatar.vue'
import followerService from '../services/followerService'

const router = useRouter()
const userStore = useUserStore()
const followers = ref([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const filteredFollowers = computed(() => {
  if (!searchQuery.value) return followers.value
  return followers.value.filter(user => 
    user.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
// Añadimos estado para la paginación
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  pages: 0
})

const loadFollowers = async () => {
  try {
    loading.value = true
    await userStore.initAuth()
    
    if (!userStore.user?._id) {
      error.value = 'Usuario no encontrado'
      return
    }
    
    const response = await followerService.getUserFollowers(userStore.user._id)
    followers.value = response.followers || []
    pagination.value = response.pagination || {
      page: 1,
      limit: 20,
      total: 0,
      pages: 0
    }
  } catch (err) {
    error.value = 'Error cargando seguidores'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadFollowers()
})

const navigateToDashboard = (username) => {
  router.push(`/dashboard/${username}`)
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <BaseCard>
      <template #header>
        <div class="flex justify-between items-center mb-4">
          <div>
            <h1 class="text-2xl font-bold">Seguidores</h1>
            <p class="text-sm text-gray-500 mt-1" v-if="pagination.total > 0">
              Total: {{ pagination.total }}
            </p>
          </div>
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

      <div v-else-if="filteredFollowers.length === 0" class="text-center py-4 text-gray-500">
        {{ searchQuery ? 'No se encontraron usuarios' : 'No tienes seguidores aún' }}
      </div>

      <div v-else class="space-y-4">
        <div v-for="follower in filteredFollowers" 
             :key="follower._id" 
             class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-gray-100 hover:border-primary"
             @click="navigateToDashboard(follower.username)">
          <div class="flex items-center space-x-4">
            <UserAvatar :alt="follower.username" :size="12" />
            <div>
              <h3 class="font-semibold text-lg">@{{ follower.username }}</h3>
              <p class="text-sm text-gray-500">Te sigue desde {{ new Date(follower.followedAt).toLocaleDateString() }}</p>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>