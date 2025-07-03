<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../../stores/user'
import UserAvatar from '../base/UserAvatar.vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

const menuItems = computed(() => [

  {
    name: t('message.nav.feed'),
    path: '/feed',
    icon: 'feed',
    exact: true
  },
  {
    name: t('message.nav.spots'),
    path: '/feedSpots',
    icon: 'feedSpots',
    exact: true
  },
  {
    name: t('message.nav.following'),
    path: '/following',
    icon: 'following',
    count: userStore.followingCount
  }
])

const getIcon = (icon) => {
  const icons = {
    home: '🏠',
    feed: '🌐',
    flight: '✈️',
    drone: '🚁',
    feedSpots: '📍',
    following: '👥',
    components: '🔧',
  }
  return icons[icon] || ''
}

const isActive = (path, exact = false) => {
  if (exact) return route.path === path
  return route.path.startsWith(path)
}

const navigateToProfile = () => {
  router.push(`/dashboard/${userStore.user?.username}`)
}
</script>

<template>
  <aside class="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md shadow-xl border-r border-gray-200/20 dark:border-gray-700/20 overflow-y-auto transition-all duration-300">
    <!-- Perfil del usuario -->
    <div class="p-4 border-b border-gray-200/20 dark:border-gray-700/20">
      <div 
        class="flex items-center space-x-4 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-700/50 p-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
        @click="navigateToProfile"
      >
        <UserAvatar 
          :src="userStore.user?.profilePicture"
          :alt="userStore.user?.name || t('message.common.user')" 
          size="md" 
          status="online"
          class="ring-2 ring-sky-500/30 transition-transform duration-300"
        />
        <div>
          <h3 class="font-medium text-gray-800 dark:text-gray-200 text-base">{{ userStore.user?.name }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ userStore.user?.username }}</p>
        </div>
      </div>
    </div>
    
    <!-- Navegación -->
    <nav class="mt-6 px-3">
      <router-link 
        v-for="item in menuItems" 
        :key="item.path" 
        :to="item.path"
        :class="[
          'flex items-center px-4 py-3 rounded-xl mb-2 transition-all duration-300 text-base',
          isActive(item.path) 
            ? 'bg-gradient-to-r from-sky-500/10 to-indigo-500/10 text-sky-600 dark:text-sky-400 transform scale-[1.02]' 
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 hover:scale-[1.02]'
        ]"
      >
        <span class="mr-4 text-lg">{{ getIcon(item.icon) }}</span>
        <span>{{ item.name }}</span>
        <span 
          v-if="item.count" 
          class="ml-auto px-2 py-1 text-xs rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400"
        >
          {{ item.count }}
        </span>
      </router-link>
    </nav>
  </aside>
</template>