<script setup>
  import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useI18n } from 'vue-i18n'
import userService from '../services/userService'
import followerService from '../services/followerService'
import likeService from '../services/likeService'
import DashboardHeader from '../components/dashboard/DashboardHeader.vue'
import DashboardContent from '../components/dashboard/DashboardContent.vue'
import DroneInfo from '../components/drone/DroneInfo.vue'
import SpotInfo from '../components/spot/SpotInfo.vue'
import FlightInfo from '../components/flight/FlightInfo.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

const dashboard = ref(null)
const loading = ref(true)
const error = ref('')
const isFollowing = ref(false)
const followLoading = ref(false)
const showDroneInfo = ref(false)
const selectedDroneInfo = ref(null)
const showSpotInfo = ref(false)
const selectedSpotInfo = ref(null)
const showFlightInfo = ref(false)
const selectedFlightInfo = ref(null)

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
  if (!userStore.isAuthenticated) {
    console.log('Usuario no autenticado - considerar mostrar modal de login')
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
    error.value = isFollowing.value ? t('dashboard.error.unfollowError') : t('dashboard.error.followError')
  } finally {
    followLoading.value = false
  }
}

const handleLike = async ({ type, item }) => {
  try {
    const response = await likeService.toggleLike(type, item._id)
    if (response.liked) {
      item.likes = [...(item.likes || []), { userId: userStore.user._id }]
    } else {
      item.likes = item.likes.filter(like => like.userId !== userStore.user._id)
    }
  } catch (error) {
    console.error('Error al dar like:', error)
  }
}

const handleShowDroneInfo = (drone) => {
  selectedDroneInfo.value = drone
  showDroneInfo.value = true
}

const handleCloseDroneInfo = () => {
  showDroneInfo.value = false
  selectedDroneInfo.value = null
}

const handleShowSpotInfo = (spot) => {
  selectedSpotInfo.value = spot
  showSpotInfo.value = true
}

const handleCloseSpotInfo = () => {
  showSpotInfo.value = false
  selectedSpotInfo.value = null
}

const handleShowFlightInfo = (flight) => {
  selectedFlightInfo.value = flight
  showFlightInfo.value = true
}

const handleCloseFlightInfo = () => {
  showFlightInfo.value = false
  selectedFlightInfo.value = null
}

onMounted(() => {
  loadDashboard()
})

// Observar cambios en el parámetro username de la ruta
watch(
  () => route.params.username,
  (newUsername) => {
    loadDashboard()
  }
)
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
      <DashboardHeader
        :dashboard="dashboard"
        :is-following="isFollowing"
        :follow-loading="followLoading"
        @toggle-follow="toggleFollow"
      />

      <DashboardContent
        :dashboard="dashboard"
        @like="handleLike"
        @show-drone-info="handleShowDroneInfo"
        @show-spot-info="handleShowSpotInfo"
        @show-flight-info="handleShowFlightInfo"
      />

      <DroneInfo
        :drone="selectedDroneInfo"
        :show="showDroneInfo"
        @close="handleCloseDroneInfo"
      />

      <SpotInfo
        :spot="selectedSpotInfo"
        :show="showSpotInfo"
        @close="handleCloseSpotInfo"
      />

      <FlightInfo
        :flight="selectedFlightInfo"
        :show="showFlightInfo"
        @close="handleCloseFlightInfo"
      />
    </div>
  </div>
</template>