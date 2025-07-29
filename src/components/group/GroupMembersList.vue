<template>
  <div class="space-y-6">
    <!-- Members section -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t('groups.members') }} ({{ members.length }})
        </h3>
        <div v-if="canManageMembers" class="flex items-center space-x-2">
          <button
            @click="showInviteModal = true"
            class="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            {{ t('groups.inviteMembers') }}
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 5" :key="i" class="animate-pulse flex items-center space-x-3 p-3">
          <div class="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
            <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/6"></div>
          </div>
        </div>
      </div>

      <!-- Members list -->
      <div v-else-if="members.length" class="space-y-2">
        <div
          v-for="member in members"
          :key="member.id"
          class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center space-x-3">
            <img
              :src="member.profilePicture || '/images/placeholder.png'"
              :alt="member.username"
              class="w-10 h-10 rounded-full object-cover"
            >
            <div>
              <div class="flex items-center space-x-2">
                <h4 class="font-medium text-gray-900 dark:text-white">
                  {{ member.username }}
                </h4>
                <span
                  v-if="member.role === 'admin'"
                  class="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs rounded-full"
                >
                  {{ t('groups.admin') }}
                </span>
                <span
                  v-else-if="member.role === 'moderator'"
                  class="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-full"
                >
                  {{ t('groups.moderator') }}
                </span>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ t('groups.joinedOn') }} {{ formatDate(member.joinedAt) }}
              </p>
            </div>
          </div>
          
          <!-- Member actions -->
          <div v-if="canManageMembers && member.id !== userStore.user?.id" class="flex items-center space-x-2">
            <select
              v-if="member.role !== 'admin'"
              :value="member.role"
              @change="updateMemberRole(member, $event.target.value)"
              class="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="member">{{ t('groups.member') }}</option>
              <option value="moderator">{{ t('groups.moderator') }}</option>
            </select>
            <button
              @click="removeMember(member)"
              class="text-red-500 hover:text-red-700 transition-colors"
              :title="t('groups.removeMember')"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-8">
        <div class="text-gray-400 dark:text-gray-500 mb-4">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
          </svg>
        </div>
        <p class="text-gray-500 dark:text-gray-400">
          {{ t('groups.noMembers') }}
        </p>
      </div>
    </div>

    <!-- Join requests section (only for admins/moderators) -->
    <div v-if="canManageMembers && pendingRequests.length > 0">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ t('groups.joinRequests') }} ({{ pendingRequests.length }})
      </h3>
      <div class="space-y-2">
        <div
          v-for="request in pendingRequests"
          :key="request.id"
          class="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
        >
          <div class="flex items-center space-x-3">
            <img
              :src="request.user.profilePicture || '/images/placeholder.png'"
              :alt="request.user.username"
              class="w-10 h-10 rounded-full object-cover"
            >
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">
                {{ request.user.username }}
              </h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ t('groups.requestedOn') }} {{ formatDate(request.createdAt) }}
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="approveJoinRequest(request)"
              class="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
            >
              {{ t('groups.approve') }}
            </button>
            <button
              @click="rejectJoinRequest(request)"
              class="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
            >
              {{ t('groups.reject') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Invite modal -->
    <div v-if="showInviteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('groups.inviteMembers') }}
          </h3>
          <button
            @click="showInviteModal = false"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <form @submit.prevent="sendInvite">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('groups.usernameOrEmail') }}
            </label>
            <input
              v-model="inviteForm.identifier"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              :placeholder="t('groups.enterUsernameOrEmail')"
              required
            >
          </div>
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showInviteModal = false"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {{ t('common.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="!inviteForm.identifier.trim()"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ t('groups.sendInvite') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../../stores/user'
import { useI18n } from 'vue-i18n'
import groupService from '../../services/groupService'

const props = defineProps({
  groupId: {
    type: [String, Number],
    required: true
  },
  members: {
    type: Array,
    default: () => []
  },
  pendingRequests: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  canManage: {
    type: Boolean,
    default: false
  },
  isOwner: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['members-updated'])

const userStore = useUserStore()
const { t } = useI18n()

const showInviteModal = ref(false)
const inviteForm = ref({
  identifier: ''
})

const canManageMembers = computed(() => {
  return props.canManage || props.isOwner
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const updateMemberRole = async (member, newRole) => {
  try {
    await groupService.updateMemberRole(props.groupId, member.id, newRole)
    member.role = newRole
    emit('members-updated')
  } catch (error) {
    console.error('Error updating member role:', error)
  }
}

const removeMember = async (member) => {
  if (!confirm(t('groups.confirmRemoveMember', { username: member.username }))) {
    return
  }
  
  try {
    await groupService.removeMember(props.groupId, member.id)
    emit('members-updated')
  } catch (error) {
    console.error('Error removing member:', error)
  }
}

const approveJoinRequest = async (request) => {
  try {
    await groupService.approveJoinRequest(props.groupId, request.id)
    emit('members-updated')
  } catch (error) {
    console.error('Error approving join request:', error)
  }
}

const rejectJoinRequest = async (request) => {
  try {
    await groupService.rejectJoinRequest(props.groupId, request.id)
    emit('members-updated')
  } catch (error) {
    console.error('Error rejecting join request:', error)
  }
}

const sendInvite = async () => {
  try {
    await groupService.inviteMember(props.groupId, {
      identifier: inviteForm.value.identifier.trim()
    })
    showInviteModal.value = false
    inviteForm.value.identifier = ''
    emit('members-updated')
  } catch (error) {
    console.error('Error sending invite:', error)
  }
}
</script>