<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
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
const userStore = useUserStore()

const isLoading = ref(false)
const members = ref([])
const errorMessage = ref('')
const successMessage = ref('')
const userMembership = ref(null)

const fetchGroupMembers = async () => {
  if (!props.group) return
  
  isLoading.value = true
  try {
    const response = await groupService.getGroupMembers(props.group._id, { limit: 20 })
    members.value = response.members
    
    // Find current user's membership status
    userMembership.value = members.value.find(member => 
      member.user._id === userStore.user._id
    )
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

const handleJoinGroup = async () => {
  if (!props.group) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const response = await groupService.joinGroup(props.group._id)
    successMessage.value = response.message
    
    // Refresh members to update status
    await fetchGroupMembers()
  } catch (error) {
    errorMessage.value = error.response?.data?.error || error.message
  } finally {
    isLoading.value = false
  }
}

const handleLeaveGroup = async () => {
  if (!props.group) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const response = await groupService.leaveGroup(props.group._id)
    successMessage.value = response.message
    
    // Refresh members to update status
    await fetchGroupMembers()
  } catch (error) {
    errorMessage.value = error.response?.data?.error || error.message
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
    owner: 'bg-purple-100 text-purple-800',
    admin: 'bg-blue-100 text-blue-800',
    member: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    banned: 'bg-red-100 text-red-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

const canJoinGroup = () => {
  return !userMembership.value
}

const canLeaveGroup = () => {
  return userMembership.value && 
         userMembership.value.role !== 'owner' && 
         userMembership.value.role !== 'banned'
}

watch(() => props.show, (newShow) => {
  if (newShow && props.group) {
    fetchGroupMembers()
  }
})
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
      <BaseAlert
        v-if="successMessage"
        type="success"
        :message="successMessage"
      />
      
      <BaseAlert
        v-if="errorMessage"
        type="error"
        :message="errorMessage"
      />

      <!-- Group Header -->
      <div class="flex items-start gap-4">
        <div class="text-4xl">
          {{ group.isPrivate ? '🔒' : '🌐' }}
        </div>
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ group.name }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            {{ group.description }}
          </p>
          
          <!-- Group Stats -->
          <div class="flex gap-4 mt-3 text-sm text-gray-500">
            <span>{{ t('groups.memberCount', { count: group.memberCount || 0 }) }}</span>
            <span>{{ group.isPrivate ? t('groups.private') : t('groups.public') }}</span>
            <span>{{ t('groups.createdBy', { owner: group.owner?.username || 'Unknown' }) }}</span>
          </div>
        </div>
      </div>

      <!-- Tags -->
      <div v-if="group.tags && group.tags.length > 0">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {{ t('groups.tags') }}
        </h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in group.tags"
            :key="tag"
            class="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
          >
            #{{ tag }}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <BaseButton
          v-if="canJoinGroup()"
          @click="handleJoinGroup"
          :loading="isLoading"
        >
          {{ group.isPrivate ? t('groups.requestJoin') : t('groups.joinGroup') }}
        </BaseButton>
        
        <BaseButton
          v-if="canLeaveGroup()"
          variant="secondary"
          @click="handleLeaveGroup"
          :loading="isLoading"
        >
          {{ t('groups.leaveGroup') }}
        </BaseButton>
      </div>

      <!-- Members Section -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ t('groups.members') }}
        </h3>
        
        <div v-if="isLoading" class="space-y-3">
          <div v-for="i in 5" :key="i" class="animate-pulse flex items-center gap-3">
            <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>
              <div class="h-3 bg-gray-200 rounded w-1/6"></div>
            </div>
          </div>
        </div>
        
        <div v-else-if="members.length > 0" class="space-y-3">
          <div
            v-for="member in members"
            :key="member._id"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-gray-600">
                  {{ member.user?.username?.charAt(0).toUpperCase() || '?' }}
                </span>
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ member.user?.username || 'Usuario desconocido' }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ t('groups.joinedOn', { date: new Date(member.joinedAt).toLocaleDateString() }) }}
                </p>
              </div>
            </div>
            
            <span :class="['px-2 py-1 text-xs rounded-full', getRoleBadgeClass(member.role)]">
              {{ getRoleLabel(member.role) }}
            </span>
          </div>
        </div>
        
        <p v-else class="text-gray-500 text-center py-4">
          {{ t('groups.noMembers') }}
        </p>
      </div>

      <!-- Close Button -->
      <div class="flex justify-end pt-4 border-t border-gray-200">
        <BaseButton
          variant="secondary"
          @click="emit('close')"
        >
          {{ t('common.close') }}
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>