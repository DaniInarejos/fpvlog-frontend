<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useI18n } from 'vue-i18n'
import BaseCard from '../components/base/BaseCard.vue'
import UserAvatar from '../components/base/UserAvatar.vue'
import followerService from '../services/followerService'
import TabSelector from '../components/base/TabSelector.vue'

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()
const followers = ref([])
const following = ref([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const activeTab = ref('followers')

const tabs = [
  { id: 'followers', label: t('message.followers.title') },
  { id: 'following', label: t('message.following.title') }
]

const filteredUsers = computed(() => {
  const users = activeTab.value === 'followers' ? followers.value : following.value
  if (!searchQuery.value) return users
  return users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  pages: 0
})

const loadUsers = async () => {
  try {
    loading.value = true
    await userStore.initAuth()
    
    if (!userStore.user?._id) {
      error.value = t('message.followers.error.userNotFound')
      return
    }
    
    const response = activeTab.value === 'followers'
      ? await followerService.getUserFollowers(userStore.user._id)
      : await followerService.getUserFollowing(userStore.user._id)

    if (activeTab.value === 'followers') {
      followers.value = response.followers || []
    } else {
      following.value = response.following || []
    }

    pagination.value = response.pagination || {
      page: 1,
      limit: 20,
      total: 0,
      pages: 0
    }
  } catch (err) {
    error.value = t('message.followers.error.loading')
  } finally {
    loading.value = false
  }
}

const handleTabChange = (tabId) => {
  activeTab.value = tabId
  loadUsers()
}

onMounted(() => {
  loadUsers()
})

const navigateToDashboard = (username) => {
  router.push(`/dashboard/${username}`)
}
</script>

<template>
  <div class="container mx-auto px-4 py-4">
    <!-- Encabezado -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ t('message.followers.title') }}</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('message.followers.subtitle') }}</p>
    </div>

    <!-- Selector de pestañas -->
    <TabSelector
      :tabs="tabs"
      :active-tab="activeTab"
      @tab-change="handleTabChange"
    />

    <BaseCard class="p-3">
      <template #header>
        <div class="flex justify-between items-center mb-2">
          <div>
            <p class="text-xs text-gray-500" v-if="pagination.total > 0">
              {{ t('message.followers.total') }}: {{ pagination.total }}
            </p>
          </div>
          <div class="relative w-48">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('message.followers.searchPlaceholder')"
              class="w-full px-3 py-1.5 text-sm border rounded focus:ring-1 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </template>
      
      <div v-if="loading" class="flex justify-center py-4">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="error" class="text-red-500 text-center py-3 text-sm">
        {{ error }}
      </div>

      <div v-else-if="filteredUsers.length === 0" class="text-center py-3 text-sm text-gray-500">
        {{ searchQuery ? t('message.followers.noUsersFound') : 
          activeTab === 'followers' ? t('message.followers.noFollowers') : t('message.followers.noFollowing') }}
      </div>

      <div v-else class="space-y-2">
        <div v-for="user in filteredUsers" 
             :key="user._id" 
             class="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors cursor-pointer border border-gray-100 hover:border-primary"
             @click="navigateToDashboard(user.username)">
          <div class="flex items-center space-x-3">
            <UserAvatar 
              :src="user.profilePicture" 
              :alt="user.username" 
              size="sm"
              class="w-8 h-8"
            />
            <div>
              <h3 class="font-medium text-sm">@{{ user.username }}</h3>
              <p class="text-xs text-gray-500">{{ t('message.followers.followsSince') }} {{ new Date(user.createdAt).toLocaleDateString() }}</p>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>