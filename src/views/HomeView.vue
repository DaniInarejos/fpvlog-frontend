<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '../stores/user'
import { useI18n } from 'vue-i18n'
import flightService from '../services/flightService'
import droneService from '../services/droneService'
import BaseCard from '../components/base/BaseCard.vue'
import UserAvatar from '../components/base/UserAvatar.vue'

const userStore = useUserStore()
const { t } = useI18n()
const flights = ref([])
const drones = ref([])
const followers = ref([])
const following = ref([])

const stats = ref({
  totalFlightTime: 0,
  totalFlights: 0,
  totalDrones: 0,
  averageFlightTime: 0
})

const loading = ref(true)
const error = ref(null)

const formatDuration = (minutes) => {
  if (!minutes) return `0${t('home.time.hours')} 0${t('home.time.minutes')}`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}${t('home.time.hours')} ${mins}${t('home.time.minutes')}`
}


const loadDashboardData = async () => {
  try {
    loading.value = true
    const [userFlights, userDrones] = await Promise.all([
      flightService.getUserFlights(userStore.user._id),
      droneService.getUserDrones(userStore.user._id)
    ])

    flights.value = userFlights
    drones.value = userDrones

    const totalTime = userFlights.reduce((acc, flight) => acc + (flight.duration || 0), 0)
    
    stats.value = {
      totalFlightTime: totalTime,
      totalFlights: userFlights.length,
      totalDrones: userDrones.length,
      averageFlightTime: totalTime / userFlights.length
    }

    following.value = userStore.user.following || []
    followers.value = []
  } catch (err) {
    error.value = t('home.error.loading')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (userStore.isAuthenticated) {
    loadDashboardData()
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <div v-else class="space-y-8">
      <BaseCard class="p-6">
        <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
          <UserAvatar
            :src="userStore.user?.profilePicture"
            :size="'xl'"
            :alt="userStore.user?.name + ' ' + userStore.user?.lastName"
            class="w-32 h-32"
          />
          <div class="flex-1 text-center md:text-left">
            <h1 class="text-3xl font-bold text-gray-900">{{ userStore.user?.name }} {{ userStore.user?.lastName }}</h1>
            <p class="text-lg text-gray-600 mb-4">@{{ userStore.user?.username }}</p>
            
            <div class="flex flex-wrap gap-6 justify-center md:justify-start mb-4">
              <div class="text-center">
                <span class="block text-2xl font-bold">{{ followers.length }}</span>
                <span class="text-gray-600">{{ t('home.profile.followers') }}</span>
              </div>
              <div class="text-center">
                <span class="block text-2xl font-bold">{{ following.length }}</span>
                <span class="text-gray-600">{{ t('home.profile.following') }}</span>
              </div>
            </div>

            <p class="text-gray-700">
              {{ userStore.user?.bio || t('home.profile.bio') }}
            </p>
          </div>
        </div>
      </BaseCard>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BaseCard class="p-6">
          <div class="text-center">
            <h3 class="text-lg font-semibold text-gray-600">{{ t('home.stats.totalTime') }}</h3>
            <p class="text-3xl font-bold text-primary-600">{{ formatDuration(stats.totalFlightTime) }}</p>
          </div>
        </BaseCard>

        <BaseCard class="p-6">
          <div class="text-center">
            <h3 class="text-lg font-semibold text-gray-600">{{ t('home.stats.flights') }}</h3>
            <p class="text-3xl font-bold text-primary-600">{{ stats.totalFlights }}</p>
          </div>
        </BaseCard>

        <BaseCard class="p-6">
          <div class="text-center">
            <h3 class="text-lg font-semibold text-gray-600">{{ t('home.stats.drones') }}</h3>
            <p class="text-3xl font-bold text-primary-600">{{ stats.totalDrones }}</p>
          </div>
        </BaseCard>

        <BaseCard class="p-6">
          <div class="text-center">
            <h3 class="text-lg font-semibold text-gray-600">{{ t('home.stats.averageTime') }}</h3>
            <p class="text-3xl font-bold text-primary-600">{{ formatDuration(stats.averageFlightTime) }}</p>
          </div>
        </BaseCard>
      </div>

      <BaseCard class="p-6">
        <h2 class="text-2xl font-bold mb-6">{{ t('home.sections.myDrones') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="drone in drones.slice(0, 3)" :key="drone._id" class="relative group">
            <img 
              :src="drone.image || '/images/placeholder.png'" 
              :alt="drone.name"
              class="w-full h-48 object-cover rounded-lg"
            >
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
              <h3 class="text-white font-semibold">{{ drone.name }}</h3>
              <p class="text-white/80 text-sm">{{ drone.model }}</p>
            </div>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="p-6">
        <h2 class="text-2xl font-bold mb-6">{{ t('home.sections.flights') }}</h2>
        <div class="space-y-4">
          <div v-for="flight in flights.slice(0, 3)" :key="flight._id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 class="font-semibold">{{ flight.title }}</h3>
              <p class="text-sm text-gray-600">{{ flight.location }}</p>
            </div>
            <div class="text-right">
              <p class="font-medium">{{ formatDuration(flight.duration) }}</p>
              <p class="text-sm text-gray-500">{{ new Date(flight.date).toLocaleDateString() }}</p>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>