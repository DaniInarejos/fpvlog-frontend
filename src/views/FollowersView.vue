<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useI18n } from 'vue-i18n'
import BaseCard from '../components/base/BaseCard.vue'
import UserAvatar from '../components/base/UserAvatar.vue'
import followerService from '../services/followerService'
import TabSelector from '../components/base/TabSelector.vue'
import BaseFilter from '../components/base/BaseFilter.vue'
import BaseDivider from '../components/base/BaseDivider.vue'

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()
const followers = ref([])
const following = ref([])
const loading = ref(true)
const error = ref('')
const activeTab = ref('followers')

const tabs = [
  { id: 'followers', label: t('followers.title') },
  { id: 'following', label: t('following.title') }
]

const filterConfig = ref({
  searchText: '',
  selectedFields: []
})

const filteredUsers = computed(() => {
  const users = activeTab.value === 'followers' ? followers.value : following.value
  if (!filterConfig.value.searchText && filterConfig.value.selectedFields.length === 0) return users

  return users.filter(user => {
    const searchText = filterConfig.value.searchText.toLowerCase()
    
    // Si no hay campos seleccionados, buscar en todos los campos
    if (filterConfig.value.selectedFields.length === 0) {
      return (
        user.username.toLowerCase().includes(searchText) ||
        `${user.name} ${user.lastName}`.toLowerCase().includes(searchText) ||
        new Date(user.createdAt).toLocaleDateString().includes(searchText)
      )
    }

    // Buscar solo en los campos seleccionados
    return filterConfig.value.selectedFields.some(field => {
      switch(field) {
        case 'username':
          return user.username.toLowerCase().includes(searchText)
        case 'name':
          return `${user.name} ${user.lastName}`.toLowerCase().includes(searchText)
        case 'createdAt':
          return new Date(user.createdAt).toLocaleDateString().includes(searchText)
        default:
          return false
      }
    })
  })
})

const handleFilterChange = ({ searchText, selectedFields }) => {
  filterConfig.value.searchText = searchText
  filterConfig.value.selectedFields = selectedFields
}

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
      error.value = t('followers.error.userNotFound')
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
    error.value = t('followers.error.loading')
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
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ t('followers.title') }}</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('followers.subtitle') }}</p>
    </div>

    <!-- Selector de pestañas -->
    <TabSelector
      :tabs="tabs"
      :active-tab="activeTab"
      @tab-change="handleTabChange"
    />
          <BaseDivider :title="t('common.filters')" />

        <BaseFilter
                :fields="['username', 'name', 'createdAt']"
                :field-labels="{
                  username: t('profile.form.username'),
                  name: t('profile.form.name'),
                  createdAt: t('flights.form.date')
                }"
                :placeholder="t('followers.searchPlaceholder')"
                @filter-change="handleFilterChange"
              />
                    <BaseDivider :title="''"/>

    <BaseCard class="p-3">
      <template #header>
        <div class="mb-4">
         
          <p class="text-xs text-gray-500 mt-2" v-if="pagination.total > 0">
            {{ t('followers.total') }}: {{ pagination.total }}
          </p>
        </div>
      </template>
      
      <div v-if="loading" class="flex justify-center py-4">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="error" class="text-red-500 text-center py-3 text-sm">
        {{ error }}
      </div>

      <div v-else-if="filteredUsers.length === 0" class="text-center py-3 text-sm text-gray-500">
        {{ filterConfig.searchText ? t('followers.noUsersFound') : 
          activeTab === 'followers' ? t('followers.noFollowers') : t('followers.noFollowing') }}
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
              <p class="text-sm text-gray-600">{{ user.name }} {{ user.lastName }}</p>
              <p class="text-xs text-gray-500">{{ t('followers.followsSince') }} {{ new Date(user.createdAt).toLocaleDateString() }}</p>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>