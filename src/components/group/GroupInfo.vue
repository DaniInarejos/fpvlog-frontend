<script setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import BaseModal from '../base/BaseModal.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseAlert from '../base/BaseAlert.vue'
import groupService from '../../services/groupService'

const props = defineProps({
  group: {
    type: Object,
    default: null
  },
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])
const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

const isLoading = ref(false)
const members = ref([])
const errorMessage = ref('')
const successMessage = ref('')
const userMembership = ref(null)

// Computed properties para mejor control de estado
const isUserAuthenticated = computed(() => userStore.isAuthenticated)
const currentUserId = computed(() => userStore.user?._id)

const canJoinGroup = computed(() => {
  if (!isUserAuthenticated.value) return false
  if (!userMembership.value) return true
  return userMembership.value.role === 'banned' ? false : false
})

const canLeaveGroup = computed(() => {
  if (!isUserAuthenticated.value || !userMembership.value) return false
  return userMembership.value.role !== 'owner' && userMembership.value.role !== 'banned'
})

const isOwner = computed(() => {
  return userMembership.value?.role === 'owner'
})

const isPending = computed(() => {
  return userMembership.value?.role === 'pending'
})

const isBanned = computed(() => {
  return userMembership.value?.role === 'banned'
})

const fetchGroupMembers = async () => {
  if (!props.group) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const response = await groupService.getGroupMembers(props.group._id, { limit: 20 })
    members.value = response.members || []
    
    // Find current user's membership status
    userMembership.value = members.value.find(member => 
      member.userId?._id === currentUserId.value
    ) || null
    
  } catch (error) {
    console.error('Error fetching group members:', error)
    errorMessage.value = error.response?.data?.message || error.message || 'Error al cargar los miembros'
  } finally {
    isLoading.value = false
  }
}

const handleJoinGroup = async () => {
  if (!props.group || !isUserAuthenticated.value) return
  
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const response = await groupService.joinGroup(props.group._id)
    successMessage.value = response.message || (props.group.isPrivate ? 'Solicitud enviada correctamente' : 'Te has unido al grupo')
    
    // Refresh members to update status
    await fetchGroupMembers()
  } catch (error) {
    console.error('Error joining group:', error)
    errorMessage.value = error.response?.data?.message || error.message || 'Error al unirse al grupo'
  } finally {
    isLoading.value = false
  }
}

const handleLeaveGroup = async () => {
  if (!props.group || !isUserAuthenticated.value) return
  
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const response = await groupService.leaveGroup(props.group._id)
    successMessage.value = response.message || 'Has abandonado el grupo'
    
    // Refresh members to update status
    await fetchGroupMembers()
  } catch (error) {
    console.error('Error leaving group:', error)
    errorMessage.value = error.response?.data?.message || error.message || 'Error al abandonar el grupo'
  } finally {
    isLoading.value = false
  }
}

const handleDeleteGroup = async () => {
  if (!props.group || !isOwner.value) return
  
  // Confirmar eliminación
  if (!confirm(`¿Estás seguro de que quieres eliminar el grupo "${props.group.name}"? Esta acción no se puede deshacer.`)) {
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    await groupService.deleteGroup(props.group._id)
    successMessage.value = 'Grupo eliminado correctamente'
    
    // Cerrar modal después de un breve delay
    setTimeout(() => {
      emit('close')
      // Opcional: recargar la página o actualizar la lista de grupos
      window.location.reload()
    }, 2000)
  } catch (error) {
    console.error('Error deleting group:', error)
    errorMessage.value = error.response?.data?.message || error.message || 'Error al eliminar el grupo'
  } finally {
    isLoading.value = false
  }
}

const getRoleLabel = (role) => {
  const roles = {
    owner: t('groups.roles.owner'),
    admin: t('groups.roles.admin'),
    member: t('groups.roles.member'),
    pending: t('groups.roles.pending'),
    banned: t('groups.roles.banned')
  }
  return roles[role] || role
}

const getRoleBadgeClass = (role) => {
  const classes = {
    owner: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    member: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    banned: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

watch(() => props.show, (newShow) => {
  if (newShow && props.group) {
    clearMessages()
    fetchGroupMembers()
  }
})

// Función para navegar al detalle del grupo
const navigateToGroup = () => {
  if (props.group?._id) {
    emit('close') // Cerrar el modal primero
    router.push(`/groups/${props.group._id}`)
  }
}
</script>

<template>
  <BaseModal
    :show="show"
    :title="group?.name || ''"
    :show-accept-button="false"
    :show-cancel-button="false"
    size="full"
    @close="emit('close')"
  >
    <div v-if="group" class="space-y-6">
      <!-- Messages -->
      <div v-if="successMessage || errorMessage" class="space-y-2">
        <BaseAlert
          v-if="successMessage"
          type="success"
          dismissible
          @close="successMessage = ''"
        >
          {{ successMessage }}
        </BaseAlert>
        
        <BaseAlert
          v-if="errorMessage"
          type="error"
          dismissible
          @close="errorMessage = ''"
        >
          {{ errorMessage }}
        </BaseAlert>
      </div>

      <!-- Group Header -->
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6">
        <div class="flex items-start gap-4">
          <div class="text-4xl">
            {{ group.isPrivate ? '🔒' : '🌐' }}
          </div>
          <div class="flex-1">
            <h2 
              class="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              @click="navigateToGroup"
            >
              {{ group.name }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
              {{ group.description || 'Sin descripción disponible' }}
            </p>
            
            <!-- Group Stats -->
            <div class="flex flex-wrap gap-4 mt-4 text-sm">
              <div class="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span>{{ t('groups.memberCount', { count: group.membersCount || 0 }) }}</span>
              </div>
              
              <div class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span class="font-medium">{{ t('groups.topicsn', { count: group.postsCount || 0 }) }}</span>
              </div>
              
              <div class="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{{ t('groups.createdBy', { owner: group.createdBy?.username || group.owner?.username || t('common.unknown') }) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Status Info -->
      <div v-if="isUserAuthenticated && userMembership" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-blue-800 dark:text-blue-200 font-medium">
            Tu estado en este grupo: 
            <span :class="['px-2 py-1 text-xs rounded-full ml-1', getRoleBadgeClass(userMembership.role)]">
              {{ getRoleLabel(userMembership.role) }}
            </span>
          </span>
        </div>
      </div>

      <!-- Tags -->
      <div v-if="group.tags && group.tags.length > 0">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {{ t('groups.tags') }}
        </h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in group.tags"
            :key="tag"
            class="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm px-3 py-1 rounded-full font-medium"
          >
            #{{ tag }}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="isUserAuthenticated" class="flex flex-wrap gap-3">
        <!-- Join Button -->
        <BaseButton
          v-if="canJoinGroup"
          @click="handleJoinGroup"
          :loading="isLoading"
          variant="primary"
          class="flex-1 sm:flex-none"
        >
          <template #icon>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </template>
          {{ group.isPrivate ? t('groups.requestJoin') : t('groups.joinGroup') }}
        </BaseButton>
        
        <!-- Leave Button -->
        <BaseButton
          v-if="canLeaveGroup"
          variant="danger"
          @click="handleLeaveGroup"
          :loading="isLoading"
          class="flex-1 sm:flex-none"
        >
          <template #icon>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </template>
          {{ t('groups.leaveGroup') }}
        </BaseButton>

        <!-- Delete Button -->
        <BaseButton
          v-if="isOwner"
          variant="danger"
          @click="handleDeleteGroup"
          :loading="isLoading"
          class="flex-1 sm:flex-none"
        >
          <template #icon>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </template>
          {{ t('groups.deleteGroup') }}
        </BaseButton>
        
        <!-- Pending Status -->
        <div v-if="isPending" class="flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <svg class="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-yellow-800 dark:text-yellow-200 font-medium">{{ t('groups.requestPending') }}</span>
        </div>
        
        <!-- Banned Status -->
        <div v-if="isBanned" class="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <svg class="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
          </svg>
          <span class="text-red-800 dark:text-red-200 font-medium">Has sido baneado de este grupo</span>
        </div>
      </div>
      
      <!-- Not authenticated message -->
      <div v-else class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <p class="text-gray-600 dark:text-gray-400 text-center">
          Debes iniciar sesión para interactuar con este grupo
        </p>
      </div>

      <!-- Members Section -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          {{ t('groups.members') }}
          <span class="text-sm text-gray-500 dark:text-gray-400">({{ members.length }})</span>
        </h3>
        
        <div v-if="isLoading" class="space-y-3">
          <div v-for="i in 5" :key="i" class="animate-pulse flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-1"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
            </div>
            <div class="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
        </div>
        
        <div v-else-if="members.length > 0" class="space-y-2 max-h-96 overflow-y-auto">
          <div
              v-for="member in members"
              :key="member._id"
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {{ member.userId?.username?.charAt(0).toUpperCase() || '?' }}
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ member.userId?.username || 'Usuario desconocido' }}
                    <span v-if="member.userId?._id === currentUserId" class="text-xs text-blue-600 dark:text-blue-400 ml-1">(Tú)</span>
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ t('groups.joinedOn') }}: {{ new Date(member.joinedAt).toLocaleDateString() }}
                  </p>
                </div>
              </div>
              
              <span :class="['px-3 py-1 text-xs rounded-full font-medium', getRoleBadgeClass(member.role)]">
                {{ getRoleLabel(member.role) }}
              </span>
            </div>
        </div>
        
        <div v-else class="text-center py-8">
          <svg class="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <p class="text-gray-500 dark:text-gray-400">{{ t('groups.noMembers') }}</p>
        </div>
      </div>

      <!-- Close Button -->
      <div class="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <BaseButton
          variant="secondary"
          @click="emit('close')"
        >
          <template #icon>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </template>
          {{ t('common.close') }}
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>