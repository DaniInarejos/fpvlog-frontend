<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '../base/BaseCard.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseAlert from '../base/BaseAlert.vue'
import BasePagination from '../base/BasePagination.vue'

const props = defineProps({
  groups: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  pagination: {
    type: Object,
    default: () => ({})
  },
  currentUser: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['edit', 'delete', 'showInfo', 'pageChange'])
const { t } = useI18n()

const hasGroups = computed(() => props.groups.length > 0)

const getGroupIcon = (isPrivate) => {
  return isPrivate ? '🔒' : '🌐'
}

const getMemberCountText = (memberCount) => {
  return t('groups.memberCount', { count: memberCount })
}

// Función para verificar si el usuario actual es el propietario del grupo
const isOwner = (group) => {
  return props.currentUser && group.createdBy && props.currentUser._id === group.createdBy._id
}
</script>

<template>
  <div class="space-y-6">
    <!-- Error Alert -->
    <BaseAlert
      v-if="errors.fetch"
      type="error"
      :message="errors.fetch"
    />

    <!-- Loading State -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="animate-pulse">
        <BaseCard class="h-48">
          <div class="space-y-4">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            <div class="space-y-2">
              <div class="h-3 bg-gray-200 rounded"></div>
              <div class="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasGroups" class="text-center py-12">
      <div class="text-6xl mb-4">👥</div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {{ t('groups.empty.title') }}
      </h3>
      <p class="text-gray-500 dark:text-gray-400">
        {{ t('groups.empty.description') }}
      </p>
    </div>

    <!-- Groups Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BaseCard
        v-for="group in groups"
        :key="group._id"
        class="h-full flex flex-col"
      >
        <div class="flex-grow">
          <!-- Group Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="text-2xl">{{ getGroupIcon(group.isPrivate) }}</span>
              <div>
                <h3 
                  class="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  @click="$router.push(`/groups/${group._id}`)"
                >
                  {{ group.name }}
                </h3>
                <div class="text-sm text-gray-500 space-y-1">
                  <p>{{ getMemberCountText(group.membersCount || 0) }}</p>
                  <p>{{ t('groups.postsCount', { count: group.postsCount || 0 }) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {{ group.description }}
          </p>

          <!-- Tags -->
          <div v-if="group.tags && group.tags.length > 0" class="mb-4">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="tag in group.tags.slice(0, 3)"
                :key="tag"
                class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                #{{ tag }}
              </span>
              <span
                v-if="group.tags.length > 3"
                class="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
              >
                +{{ group.tags.length - 3 }}
              </span>
            </div>
          </div>

          <!-- Owner Info -->
          <div class="text-xs text-gray-500 mb-4">
            {{ t('groups.createdBy', { owner: group.createdBy?.username || 'Unknown' }) }}
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 mt-auto pt-4 border-t border-gray-200">
          <BaseButton
            variant="secondary"
            size="sm"
            class="flex-1"
            @click="emit('showInfo', group)"
          >
            <template #icon>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
            {{ t('common.info') }}
          </BaseButton>
          
          <!-- Solo mostrar botón de editar si es el propietario -->
          <BaseButton
            v-if="isOwner(group)"
            variant="secondary"
            size="sm"
            @click="emit('edit', group)"
          >
            <template #icon>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </template>
            {{ t('common.edit') }}
          </BaseButton>
          
          <!-- ELIMINAR ESTE BOTÓN DE VER -->
          <!-- <BaseButton 
            variant="secondary" 
            size="sm" 
            class="flex-1"
            @click="$router.push(`/groups/${group._id}`)"
          >
            <template #icon>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </template>
            {{ t('groups.detail.view') }}
          </BaseButton> -->
          
          <!-- Solo mostrar botón de borrar si es el propietario -->
          <BaseButton
            v-if="isOwner(group)"
            variant="secondary"
            size="sm"
            @click="emit('delete', group)"
          >
            <template #icon>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </template>
            {{ t('common.delete') }}
          </BaseButton>
        </div>
      </BaseCard>
    </div>

    <!-- Pagination -->
    <BasePagination
      v-if="hasGroups && pagination.totalPages > 1"
      :current-page="pagination.page"
      :total-pages="pagination.totalPages"
      :total-items="pagination.total"
      @page-change="emit('pageChange', $event)"
    />
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>