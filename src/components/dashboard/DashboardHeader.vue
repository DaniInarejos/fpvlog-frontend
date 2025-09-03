<script setup>
import { computed } from 'vue'
import { useUserStore } from '../../stores/user'
import { useI18n } from 'vue-i18n'
import BaseCard from '../base/BaseCard.vue'
import UserAvatar from '../base/UserAvatar.vue'
import BaseButton from '../base/BaseButton.vue'

const DEFAULT_IMAGE = '/images/placeholder.png'
const userStore = useUserStore()
const { t } = useI18n()

const props = defineProps({
  dashboard: {
    type: Object,
    required: true
  },
  isFollowing: {
    type: Boolean,
    required: true
  },
  followLoading: {
    type: Boolean,
    required: true
  }
})

const stats = computed(() => ({
  dronesCount: props.dashboard?.stats?.dronesCount || 0,
  flightsCount: props.dashboard?.stats?.flightsCount || 0,
  followersCount: props.dashboard?.stats?.followersCount || 0,
  followingCount: props.dashboard?.stats?.followingCount || 0
}))

const emit = defineEmits(['toggleFollow'])

const handleToggleFollow = () => {
  emit('toggleFollow')
}
</script>

<template>
  <!-- Header Principal con Gradiente -->
  <div class="relative overflow-hidden">
    <!-- Fondo con gradiente y patrón -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(14,165,233,0.1),transparent_50%)]" />
    </div>
    
    <BaseCard class="relative backdrop-blur-sm border-primary/20">
      <div class="p-8">
        <!-- Información del Usuario -->
        <div class="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <!-- Avatar y Info Básica -->
          <div class="flex items-center gap-6">
            <div class="relative">
              <UserAvatar
                :src="dashboard.user.profilePicture || DEFAULT_IMAGE"
                :alt="dashboard.user.name + ' ' + dashboard.user.lastName"
                :size="'xl'"
                class="w-24 h-24 ring-4 ring-primary/20 shadow-xl"
              />
              <!-- Indicador de estado online (opcional) -->
              <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-card shadow-lg" />
            </div>
            
            <div class="space-y-2">
              <div>
                <h1 class="text-3xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  {{ dashboard.user.name }} {{ dashboard.user.lastName }}
                </h1>
                <p class="text-lg text-muted-foreground font-medium">@{{ dashboard.user.username }}</p>
              </div>
              
              <!-- Badges/Tags del usuario -->
              <div class="flex flex-wrap gap-2">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  🚁 Piloto FPV
                </span>
                <span v-if="stats.flightsCount > 10" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 border border-green-500/20">
                  ⭐ Experimentado
                </span>
              </div>
            </div>
          </div>
          
          <!-- Botón de Seguir -->
          <div class="lg:ml-auto">
            <BaseButton
              v-if="userStore.user && userStore.user._id !== dashboard.user._id"
              :variant="isFollowing ? 'secondary' : 'primary'"
              :loading="followLoading"
              @click="handleToggleFollow"
              class="px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span class="flex items-center gap-2">
                <svg v-if="!isFollowing" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ isFollowing ? t('dashboard.unfollow') : t('dashboard.follow') }}
              </span>
            </BaseButton>
          </div>
        </div>
        
        <!-- Estadísticas Mejoradas -->
        <div class="mt-8">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Drones -->
            <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div class="absolute top-2 right-2 text-blue-500/20 group-hover:text-blue-500/40 transition-colors">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                </svg>
              </div>
              <div class="relative">
                <div class="text-3xl font-bold text-blue-600 mb-1">{{ stats.dronesCount }}</div>
                <div class="text-sm font-medium text-blue-600/80">{{ t('dashboard.stats.drones') }}</div>
              </div>
            </div>
            
            <!-- Vuelos -->
            <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div class="absolute top-2 right-2 text-green-500/20 group-hover:text-green-500/40 transition-colors">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
              </div>
              <div class="relative">
                <div class="text-3xl font-bold text-green-600 mb-1">{{ stats.flightsCount }}</div>
                <div class="text-sm font-medium text-green-600/80">{{ t('dashboard.stats.flights') }}</div>
              </div>
            </div>
            
            <!-- Seguidores -->
            <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div class="absolute top-2 right-2 text-purple-500/20 group-hover:text-purple-500/40 transition-colors">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.5 8H17c-.8 0-1.5.7-1.5 1.5v6c0 .8.7 1.5 1.5 1.5h1v5h2zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6h1.5v7h4zm6.5 0v-4h1v-4.5c0-.83-.67-1.5-1.5-1.5h-2c-.83 0-1.5.67-1.5 1.5V18h1v4h3z" />
                </svg>
              </div>
              <div class="relative">
                <div class="text-3xl font-bold text-purple-600 mb-1">{{ stats.followersCount }}</div>
                <div class="text-sm font-medium text-purple-600/80">{{ t('dashboard.stats.followers') }}</div>
              </div>
            </div>
            
            <!-- Siguiendo -->
            <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div class="absolute top-2 right-2 text-orange-500/20 group-hover:text-orange-500/40 transition-colors">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div class="relative">
                <div class="text-3xl font-bold text-orange-600 mb-1">{{ stats.followingCount }}</div>
                <div class="text-sm font-medium text-orange-600/80">{{ t('dashboard.stats.following') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>