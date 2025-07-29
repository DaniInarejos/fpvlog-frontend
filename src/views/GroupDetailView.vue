<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useI18n } from 'vue-i18n'
import groupService from '../services/groupService'
import groupTopicService from '../services/groupTopicService'

import BaseButton from '../components/base/BaseButton.vue'
import BaseModal from '../components/base/BaseModal.vue'
import TabSelector from '../components/base/TabSelector.vue'

// Group Components
import GroupMembersList from '../components/group/GroupMembersList.vue'
import GroupTopicsList from '../components/group/GroupTopicsList.vue'

// Composables
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

// Debug logs
console.log('GroupDetailView: Component initialized')
console.log('Route params:', route.params)
console.log('User store:', userStore.user)

// State
const group = ref(null)
const posts = ref([])
const members = ref([])
const pendingRequests = ref([])
const isLoading = ref(false)
const postsLoading = ref(false)
const errors = ref({})
const activeTab = ref('topics')
const userMembership = ref(null)

// Modals state
const modals = ref({
  members: false,
  joinGroup: false,
  leaveGroup: false
})

// Pagination
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
})

// Computed - Tabs definition (reactive to translations)
const tabs = computed(() => [
  { id: 'topics', label: t('groups.detail.tabs.topics') },
  { id: 'about', label: t('groups.detail.tabs.about') }
])

// Computed - Access Control
const canViewContent = computed(() => {
  if (!group.value) return false
  if (!group.value.isPrivate) return true
  return userMembership.value && userMembership.value.status === 'approved'
})

const canPost = computed(() => {
  return canViewContent.value && userMembership.value
})

const canManageGroup = computed(() => {
  return userMembership.value && 
    (userMembership.value.role === 'admin' || userMembership.value.role === 'owner')
})

// Computed - User Status
const userStatus = computed(() => {
  if (!userMembership.value) return 'not_member'
  return userMembership.value.status // 'approved', 'pending', 'rejected'
})

const userRole = computed(() => {
  return userMembership.value?.role || null // 'owner', 'admin', 'member'
})

const isMember = computed(() => userStatus.value === 'approved')
const isPending = computed(() => userStatus.value === 'pending')
const isOwner = computed(() => userRole.value === 'owner')

// Methods - Data Fetching
const fetchGroup = async () => {
  try {
    isLoading.value = true
    errors.value = {}
    
    const response = await groupService.getGroup(route.params.id)
    // La API devuelve directamente el objeto grupo, no { group: ... }
    group.value = response.data || response
    
    // Obtener membresía del usuario por separado si es necesario
    if (userStore.isAuthenticated) {
      try {
        const memberResponse = await groupService.getGroupMembers(route.params.id, {
          userId: userStore.user.id // Filtrar por usuario actual
        })
        userMembership.value = memberResponse.members?.find(m => m.userId._id === userStore.user.id)
      } catch (memberError) {
        // Usuario no es miembro
        userMembership.value = null
      }
    }
  } catch (error) {
    console.error('Error fetching group:', error)
    errors.value.group = error.message || t('common.error')
    group.value = null // Ensure group is null on error
  } finally {
    isLoading.value = false
  }
}

const fetchTopics = async () => {
  if (!canViewContent.value) return
  
  try {
    postsLoading.value = true
    const response = await groupTopicService.getGroupTopics(route.params.id, {
      page: pagination.value.page,
      limit: pagination.value.limit,
      sort: '-createdAt'
    })
    
    if (response.success) {
      posts.value = response.data.topics
      pagination.value = response.data.pagination
    }
  } catch (error) {
    console.error('Error fetching topics:', error)
    errors.value.posts = error.message || t('common.error')
  } finally {
    postsLoading.value = false
  }
}

const fetchMembers = async () => {
  if (!canViewContent.value) return
  
  try {
    const response = await groupService.getGroupMembers(route.params.id)
    members.value = response.members
    
    if (canManageGroup.value) {
      const pendingResponse = await groupService.getPendingRequests(route.params.id)
      pendingRequests.value = pendingResponse.requests
    }
  } catch (error) {
    console.error('Error fetching members:', error)
    errors.value.members = error.message || t('common.error')
  }
}

// Methods - Group Actions
const handleJoinGroup = async () => {
  try {
    await groupService.joinGroup(route.params.id)
    await fetchGroup()
    modals.value.joinGroup = false
  } catch (error) {
    console.error('Error joining group:', error)
    errors.value.join = error.message || t('common.error')
  }
}

const handleLeaveGroup = async () => {
  try {
    await groupService.leaveGroup(route.params.id)
    await fetchGroup()
    modals.value.leaveGroup = false
  } catch (error) {
    console.error('Error leaving group:', error)
    errors.value.leave = error.message || t('common.error')
  }
}

// Methods - UI Handlers
const handleTabChange = (tabId) => {
  activeTab.value = tabId
}

const handlePageChange = (page) => {
  pagination.value.page = page
  fetchTopics()
}

const openModal = (modalName) => {
  modals.value[modalName] = true
}

const closeModal = (modalName) => {
  modals.value[modalName] = false
}

// Lifecycle
onMounted(async () => {
  console.log('Component mounted, starting data fetch...')
  await fetchGroup()
  if (canViewContent.value) {
    await fetchTopics()
  }
  console.log('Mount completed')
})
</script>

<template>
  <!-- Loading state -->
  <div v-if="isLoading" class="flex justify-center items-center h-64">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>

  <!-- Error state -->
  <div v-else-if="!group" class="text-center py-8">
    <p class="text-gray-500">{{ t('groups.notFound') }}</p>
  </div>

  <!-- Group content -->
  <div v-else class="max-w-4xl mx-auto">
    <!-- Group Header Card -->
    <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
      <!-- Banner Section -->
      <div class="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
        <img 
          v-if="group?.bannerUrl" 
          :src="group.bannerUrl" 
          class="w-full h-full object-cover" 
          :alt="group.name + ' banner'"
        />
        <!-- Overlay gradient for better text readability -->
        <div class="absolute inset-0 bg-black bg-opacity-20"></div>
        
        <!-- Group Avatar -->
        <div class="absolute -bottom-12 left-6">
          <div class="relative">
            <img 
              v-if="group?.avatarUrl" 
              :src="group.avatarUrl" 
              class="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" 
              :alt="group.name + ' avatar'"
            />
            <div 
              v-else 
              class="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-300 flex items-center justify-center"
            >
              <svg class="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Group Info Section -->
      <div class="pt-16 pb-6 px-6">
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <!-- Left side - Group details -->
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ group?.name || '' }}</h1>
            <p v-if="group?.description" class="text-gray-600 mb-4 leading-relaxed">{{ group.description }}</p>
            
            <!-- Stats Row -->
            <div class="flex flex-wrap gap-6 mb-4">
              <div class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
                <span class="font-medium">{{ group?.membersCount || 0 }}</span>
                <span class="ml-1">{{ t('groups.members') }}</span>
              </div>
              
              <div class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd"/>
                </svg>
                <span class="font-medium">{{ group?.topicsCount || 0 }}</span>
                <span class="ml-1">{{ t('groups.topicsn') }}</span>
              </div>
              
              <div v-if="group?.createdBy" class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                </svg>
                <span>{{ t('groups.createdBy') }}: {{ group.createdBy.name }} {{ group.createdBy.lastName }}</span>
              </div>
            </div>
            
            <!-- Tags -->
            <div v-if="group?.tags?.length" class="flex flex-wrap gap-2 mb-4">
              <span 
                v-for="tag in group.tags" 
                :key="tag" 
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
              >
                #{{ tag }}
              </span>
            </div>
            
            <!-- Privacy Badge -->
            <div class="flex items-center">
              <span 
                :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                  group?.isPrivate 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                ]"
              >
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path v-if="group?.isPrivate" fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                  <path v-else fill-rule="evenodd" d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
                {{ group?.isPrivate ? t('groups.private') : t('groups.public') }}
              </span>
            </div>
          </div>
          
          <!-- Right side - Action buttons -->
          <div class="mt-6 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row lg:flex-col gap-3">
            <!-- Join/Leave buttons based on user status -->
            <BaseButton 
              v-if="!isMember && !isPending && userStore.isAuthenticated"
              @click="openModal('joinGroup')"
              variant="primary"
              class="whitespace-nowrap"
            >
              {{ group?.isPrivate ? t('groups.requestJoin') : t('groups.join') }}
            </BaseButton>
            
            <BaseButton 
              v-else-if="isPending"
              disabled
              variant="secondary"
              class="whitespace-nowrap"
            >
              {{ t('groups.requestPending') }}
            </BaseButton>
            
            <BaseButton 
              v-else-if="isMember && !isOwner"
              @click="openModal('leaveGroup')"
              variant="outline"
              class="whitespace-nowrap"
            >
              {{ t('groups.leave') }}
            </BaseButton>
            
            <!-- Management button for admins/owners -->
            <BaseButton 
              v-if="canManageGroup"
              @click="openModal('members')"
              variant="secondary"
              class="whitespace-nowrap"
            >
              {{ t('groups.manageMembers') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Tabs and Content Section -->
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Tab Navigation -->
      <div class="border-b border-gray-200">
        <TabSelector 
          :tabs="tabs" 
          :active-tab="activeTab" 
          @tab-change="handleTabChange" 
        />
      </div>
      
      <!-- Tab Content -->
      <div class="p-6">
        <!-- Topics Tab -->
        <div v-if="activeTab === 'topics'">
          <GroupTopicsList 
            v-if="canViewContent" 
            :group-id="route.params.id" 
            :can-post="canPost" 
          />
          <div v-else class="text-center py-8">
            <p class="text-gray-500">{{ t('groups.privateGroupMessage') }}</p>
          </div>
        </div>
        
        <!-- Posts Tab -->
        <div v-else-if="activeTab === 'posts'">
          <div v-if="canViewContent">
            <!-- Post Creation Button -->
            <div v-if="canPost" class="mb-6">
              <BaseButton @click="openModal('postForm')" variant="primary">
                {{ t('groups.createPost') }}
              </BaseButton>
            </div>

          </div>
          <div v-else class="text-center py-8">
            <p class="text-gray-500">{{ t('groups.privateGroupMessage') }}</p>
          </div>
        </div>
        
        <!-- About Tab -->
        <div v-else-if="activeTab === 'about'">
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ t('groups.about.description') }}</h3>
              <p class="text-gray-600">{{ group?.description || t('groups.about.noDescription') }}</p>
            </div>
            
            <div v-if="group?.rules">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ t('groups.about.rules') }}</h3>
              <p class="text-gray-600">{{ group.rules }}</p>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ t('groups.about.details') }}</h3>
              <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">{{ t('groups.about.created') }}</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ new Date(group?.createdAt).toLocaleDateString() }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">{{ t('groups.about.privacy') }}</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ group?.isPrivate ? t('groups.private') : t('groups.public') }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Modals -->
  <!-- Join Group Modal -->
  <BaseModal 
    :show="modals.joinGroup" 
    @close="closeModal('joinGroup')"
    :title="t('groups.joinGroup')"
  >
    <p class="mb-4">{{ t('groups.joinConfirmation', { name: group?.name }) }}</p>
    <div class="flex justify-end space-x-3">
      <BaseButton @click="closeModal('joinGroup')" variant="outline">
        {{ t('common.cancel') }}
      </BaseButton>
      <BaseButton @click="handleJoinGroup" variant="primary">
        {{ t('groups.join') }}
      </BaseButton>
    </div>
  </BaseModal>
  
  <!-- Leave Group Modal -->
  <BaseModal 
    :show="modals.leaveGroup" 
    @close="closeModal('leaveGroup')"
    :title="t('groups.leaveGroup')"
  >
    <p class="mb-4">{{ t('groups.leaveConfirmation', { name: group?.name }) }}</p>
    <div class="flex justify-end space-x-3">
      <BaseButton @click="closeModal('leaveGroup')" variant="outline">
        {{ t('common.cancel') }}
      </BaseButton>
      <BaseButton @click="handleLeaveGroup" variant="danger">
        {{ t('groups.leave') }}
      </BaseButton>
    </div>
  </BaseModal>
  

  <!-- Members Modal -->
  <BaseModal 
    :show="modals.members" 
    @close="closeModal('members')"
    :title="t('groups.members')"
    size="full"
  >
    <GroupMembersList 
      :members="members" 
      :pending-requests="pendingRequests" 
      :can-manage="canManageGroup" 
      :user-role="userRole" 
      @member-action="handleMemberAction" 
      @transfer-ownership="handleTransferOwnership"
    />
  </BaseModal>
</template>