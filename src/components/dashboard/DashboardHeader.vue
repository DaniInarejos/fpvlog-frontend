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
  <BaseCard class="p-4">
    <div class="flex items-center gap-4">
      <UserAvatar
        :src="dashboard.user.profilePicture || DEFAULT_IMAGE"
        :alt="dashboard.user.name + ' ' + dashboard.user.lastName"
        :size="'lg'"
        class="w-20 h-20"
      />
      <div class="flex-1">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-gray-900">{{ dashboard.user.name }} {{ dashboard.user.lastName }}</h1>
            <p class="text-sm text-gray-600">@{{ dashboard.user.username }}</p>
          </div>
          <div v-if="userStore.user?._id !== dashboard.user._id">
            <BaseButton
              :variant="isFollowing ? 'danger' : 'primary'"
              :disabled="followLoading"
              @click="handleToggleFollow"
              size="sm"
            >
              {{ isFollowing ? t('dashboard.follow.unfollow') : t('dashboard.follow.follow') }}
            </BaseButton>
          </div>
        </div>

        <!-- Estadísticas -->
        <div class="grid grid-cols-4 gap-2 mt-3">
          <div class="text-center p-2 bg-gray-50 rounded">
            <div class="text-lg font-bold text-primary-600">{{ stats.dronesCount }}</div>
            <div class="text-xs text-gray-500">{{ t('dashboard.stats.drones') }}</div>
          </div>
          <div class="text-center p-2 bg-gray-50 rounded">
            <div class="text-lg font-bold text-primary-600">{{ stats.flightsCount }}</div>
            <div class="text-xs text-gray-500">{{ t('dashboard.stats.flights') }}</div>
          </div>
          <div class="text-center p-2 bg-gray-50 rounded">
            <div class="text-lg font-bold text-primary-600">{{ stats.followersCount }}</div>
            <div class="text-xs text-gray-500">{{ t('dashboard.stats.followers') }}</div>
          </div>
          <div class="text-center p-2 bg-gray-50 rounded">
            <div class="text-lg font-bold text-primary-600">{{ stats.followingCount }}</div>
            <div class="text-xs text-gray-500">{{ t('dashboard.stats.following') }}</div>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>