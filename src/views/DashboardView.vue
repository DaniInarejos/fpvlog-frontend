<script setup>
  import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'  // Añadir useRouter
import { useUserStore } from '../stores/user'
import { useI18n } from 'vue-i18n'
import userService from '../services/userService'
import followerService from '../services/followerService'
import BaseCard from '../components/base/BaseCard.vue'
import UserAvatar from '../components/base/UserAvatar.vue'
import BaseButton from '../components/base/BaseButton.vue'

const DEFAULT_IMAGE = '/images/placeholder.png'
const route = useRoute()
const router = useRouter()  // Añadir esta línea
const userStore = useUserStore()
const { t } = useI18n()

const dashboard = ref(null)
const loading = ref(true)
const error = ref('')
const isFollowing = ref(false)
const followLoading = ref(false)

// Computed properties para manejar valores por defecto
const stats = computed(() => ({
  dronesCount: dashboard.value?.stats?.dronesCount || 0,
  flightsCount: dashboard.value?.stats?.flightsCount || 0,
  followersCount: dashboard.value?.stats?.followersCount || 0,
  followingCount: dashboard.value?.stats?.followingCount || 0
}))

const recentFlights = computed(() => dashboard.value?.recentFlights || [])
const drones = computed(() => dashboard.value?.drones || [])

const loadDashboard = async () => {
  try {
    loading.value = true
    const username = route.params.username || userStore.user?.username
    
    if (!username) {
      error.value = t('dashboard.error.userNotFound')
      return
    }

    const response = await userService.getDashboard(username)
    dashboard.value = response

    // Verificar si seguimos a este usuario
    if (userStore.user && userStore.user?._id !== dashboard.value.user._id) {
      const followStatus = await followerService.checkIfFollowing(dashboard.value.user._id)
      isFollowing.value = followStatus.isFollowing
    }
  } catch (err) {
    error.value = t('dashboard.error.loading')
  } finally {
    loading.value = false
  }
}

const toggleFollow = async () => {
  // Verificar si el usuario está autenticado
  if (!userStore.isAuthenticated) {
    router.push('/login')
    return
  }

  try {
    followLoading.value = true
    if (isFollowing.value) {
      await followerService.unfollowUser(dashboard.value.user._id)
      dashboard.value.stats.followersCount--
    } else {
      await followerService.followUser(dashboard.value.user._id)
      dashboard.value.stats.followersCount++
    }
    isFollowing.value = !isFollowing.value
  } catch (err) {
    error.value = isFollowing.value ? t('message.dashboard.error.unfollowError') : t('message.dashboard.error.followError')
  } finally {
    followLoading.value = false
  }
}

onMounted(() => {
  loadDashboard()
})
</script>

<template>
  <div class="container mx-auto px-4 py-4">
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <div v-else-if="dashboard" class="space-y-4">
      <!-- Perfil Header -->
      <BaseCard class="p-4">
        <div class="flex items-center gap-4">
          <UserAvatar
            :src="dashboard.user.profilePicture || DEFAULT_IMAGE"
            :alt="dashboard.user.name + ' ' + dashboard.user.lastName"
            :size="'lg'"
            class="w-20 h-20"
          />
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-xl font-bold text-gray-900">{{ dashboard.user.name }} {{ dashboard.user.lastName }}</h1>
                <p class="text-sm text-gray-600">@{{ dashboard.user.username }}</p>
              </div>
              <div v-if="userStore.user?._id !== dashboard.user._id">
                <BaseButton
                  :variant="isFollowing ? 'danger' : 'primary'"
                  :disabled="followLoading"
                  @click="toggleFollow"
                  size="sm"
                >
                  {{ isFollowing ? t('message.dashboard.follow.unfollow') : t('message.dashboard.follow.follow') }}
                </BaseButton>
              </div>
            </div>

            <!-- Estadísticas -->
            <div class="grid grid-cols-4 gap-2 mt-3">
              <div class="text-center p-2 bg-gray-50 rounded">
                <div class="text-lg font-bold text-primary-600">{{ stats.dronesCount }}</div>
                <div class="text-xs text-gray-500">{{ t('message.dashboard.stats.drones') }}</div>
              </div>
              <div class="text-center p-2 bg-gray-50 rounded">
                <div class="text-lg font-bold text-primary-600">{{ stats.flightsCount }}</div>
                <div class="text-xs text-gray-500">{{ t('message.dashboard.stats.flights') }}</div>
              </div>
              <div class="text-center p-2 bg-gray-50 rounded">
                <div class="text-lg font-bold text-primary-600">{{ stats.followersCount }}</div>
                <div class="text-xs text-gray-500">{{ t('message.dashboard.stats.followers') }}</div>
              </div>
              <div class="text-center p-2 bg-gray-50 rounded">
                <div class="text-lg font-bold text-primary-600">{{ stats.followingCount }}</div>
                <div class="text-xs text-gray-500">{{ t('message.dashboard.stats.following') }}</div>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Vuelos Recientes -->
      <BaseCard v-if="recentFlights.length > 0" class="p-4">
        <h2 class="text-lg font-bold mb-3">{{ t('message.dashboard.recentFlights.title') }}</h2>
        <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="flight in dashboard.recentFlights" :key="flight._id" class="bg-gray-50 p-3 rounded">
            <div class="flex items-center justify-between mb-1">
              <h3 class="font-medium">{{ flight.title }}</h3>
              <span class="text-xs text-gray-500">{{ new Date(flight.date).toLocaleDateString() }}</span>
            </div>
            <p class="text-gray-600 text-xs mb-2">{{ flight.description }}</p>
            <div class="flex justify-between text-xs text-gray-500">
              <span>🕒 {{ flight.duration }}{{ t('message.dashboard.recentFlights.duration') }}</span>
              <span>📍 {{ flight.location }}</span>
            </div>
          </div>
        </div>
      </BaseCard>
      <BaseCard v-else class="p-4 text-center text-gray-500 text-sm">
        <p>{{ t('message.dashboard.recentFlights.noFlights') }}</p>
      </BaseCard>

      <!-- Drones -->
      <BaseCard v-if="drones.length > 0" class="p-4">
        <h2 class="text-lg font-bold mb-3">{{ t('message.dashboard.drones.title') }}</h2>
        <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="drone in drones" :key="drone._id" class="bg-gray-50 p-3 rounded">
            <div class="flex items-center space-x-3">
              <img 
                :src="drone.image || DEFAULT_IMAGE" 
                :alt="drone.name" 
                class="w-12 h-12 object-cover rounded" 
              />
              <div>
                <h3 class="font-medium">{{ drone.name }}</h3>
                <p class="text-xs text-gray-500">{{ drone.model }}</p>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
      <BaseCard v-else class="p-4 text-center text-gray-500 text-sm">
        <p>{{ t('message.dashboard.drones.noDrones') }}</p>
      </BaseCard>
    </div>
  </div>
</template>