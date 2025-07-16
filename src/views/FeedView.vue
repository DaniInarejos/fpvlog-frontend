<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '../stores/user'
import feedService from '../services/feedService'
import FeedItem from '../components/feed/FeedItem.vue'
import TabSelector from '../components/base/TabSelector.vue'
import DroneInfo from '../components/drone/DroneInfo.vue'
import SpotInfo from '../components/spot/SpotInfo.vue'
import FlightInfo from '../components/flight/FlightInfo.vue'

const { t } = useI18n()
const userStore = useUserStore()
const items = ref([])
const loading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const hasNextPage = ref(true)
const activeTab = ref('global')

const tabs = [
  { id: 'global', label: t('feed.globalFeed') },
  { id: 'following', label: t('feed.followingFeed') }
]

const loadFeed = async (page = 1) => {
  if (!hasNextPage.value || loading.value) return

  try {
    loading.value = true
    const response = await (activeTab.value === 'global' 
      ? feedService.getGlobalFeed(page)
      : feedService.getFollowingFeed(page))
    
    if (page === 1) {
      items.value = response.items
    } else {
      items.value = [...items.value, ...response.items]
    }

    hasNextPage.value = response.pagination.hasNextPage
    currentPage.value = response.pagination.currentPage
  } catch (err) {
    error.value = t('feed.error.loading')
  } finally {
    loading.value = false
  }
}

const handleTabChange = (tabId) => {
  activeTab.value = tabId
  currentPage.value = 1
  hasNextPage.value = true
  items.value = []
  loadFeed(1)
}

const handleScroll = () => {
  const scrollPosition = window.innerHeight + window.scrollY
  const documentHeight = document.documentElement.offsetHeight
  
  if (scrollPosition >= documentHeight - 1000) {
    loadFeed(currentPage.value + 1)
  }
}

onMounted(() => {
  loadFeed()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const showDroneInfo = ref(false)
const selectedDrone = ref(null)
const showSpotInfo = ref(false)
const selectedSpot = ref(null)
const showFlightInfo = ref(false)
const selectedFlight = ref(null)

const handleShowDroneInfo = (drone) => {
  selectedDrone.value = drone
  showDroneInfo.value = true
}

const handleShowSpotInfo = (spot) => {
  selectedSpot.value = spot
  showSpotInfo.value = true
}

const handleShowFlightInfo = (flight) => {
  selectedFlight.value = flight
  showFlightInfo.value = true
}

const handleCloseDroneInfo = () => {
  showDroneInfo.value = false
  selectedDrone.value = null
}

const handleCloseSpotInfo = () => {
  showSpotInfo.value = false
  selectedSpot.value = null
}

const handleCloseFlightInfo = () => {
  showFlightInfo.value = false
  selectedFlight.value = null
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-3xl">
    <!-- Encabezado -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ t('feed.title') }}</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('feed.subtitle') }}</p>
    </div>

    <!-- Selector de pestañas -->
    <TabSelector
      :tabs="tabs"
      :active-tab="activeTab"
      @tab-change="handleTabChange"
    />

    <!-- Lista de items -->
    <div class="space-y-6">
      <FeedItem
        v-for="item in items"
        :key="item.data._id"
        :item="item"
        :current-user-id="userStore.user?._id"
        @show-drone-info="handleShowDroneInfo"
        @show-spot-info="handleShowSpotInfo"
        @show-flight-info="handleShowFlightInfo"
      />
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
    </div>

    <!-- Mensaje de error -->
    <div v-if="error" class="text-center py-8 text-red-600 dark:text-red-400">
      {{ error }}
    </div>

    <!-- Fin del feed -->
    <div v-if="!hasNextPage && !loading" class="text-center py-8 text-gray-600 dark:text-gray-400">
      {{ t('feed.noMoreContent') }}
    </div>

    <!-- Modales de información -->
    <DroneInfo
      v-if="showDroneInfo"
      :show="showDroneInfo"
      :drone="selectedDrone"
      @close="handleCloseDroneInfo"
    />

    <SpotInfo
      v-if="showSpotInfo"
      :show="showSpotInfo"
      :spot="selectedSpot"
      @close="handleCloseSpotInfo"
    />

    <FlightInfo
      v-if="showFlightInfo"
      :show="showFlightInfo"
      :flight="selectedFlight"
      @close="handleCloseFlightInfo"
    />
  </div>
</template>