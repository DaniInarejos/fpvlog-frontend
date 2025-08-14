<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '../base/BaseButton.vue'

const props = defineProps({
  comments: {
    type: Array,
    default: () => []
  },
  pagination: {
    type: Object,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: String,
    default: 'newest'
  }
})

const emit = defineEmits(['sort-change', 'page-change', 'like-comment', 'reply-comment'])

const { t } = useI18n()

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getCommentNumber = (comment, index) => {
  const baseNumber = (props.pagination.currentPage - 1) * 10 + index + 1
  return baseNumber
}

const goToPage = (page) => {
  emit('page-change', page)
}

const goToPreviousPage = () => {
  if (props.pagination.hasPrevPage) {
    emit('page-change', props.pagination.currentPage - 1)
  }
}

const goToNextPage = () => {
  if (props.pagination.hasNextPage) {
    emit('page-change', props.pagination.currentPage + 1)
  }
}

const handleSortChange = () => {
  emit('sort-change')
}
</script>

<template>
  <!-- Comments Section -->
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
    <!-- Comments Header -->
    <div class="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          {{ t('groups.topics.comments') }} ({{ pagination.totalComments }})
        </h2>
        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>{{ t('common.sortBy') }}:</span>
          <select 
            :value="sortOrder" 
            @change="handleSortChange"
            class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">{{ t('common.newest') }}</option>
            <option value="oldest">{{ t('common.oldest') }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Comments List -->
    <div v-if="comments.length > 0" class="relative">
      <!-- Loading overlay -->
      <div v-if="isLoading" class="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
      
      <div 
        v-for="(comment, index) in comments" 
        :key="comment._id"
        class="border-b border-gray-200 dark:border-gray-600 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
      >
        <div class="p-6">
          <div class="flex gap-4">
            <!-- User Avatar -->
            <div class="flex-shrink-0">
              <div class="flex flex-col items-center">
                <img 
                  v-if="comment.authorId?.profilePicture"
                  :src="comment.authorId.profilePicture"
                  :alt="comment.authorId.username"
                  class="w-12 h-12 rounded-full object-cover border-2 border-gray-300 dark:border-gray-500"
                />
                <div 
                  v-else
                  class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center border-2 border-gray-300 dark:border-gray-500"
                >
                  <span class="text-white font-bold text-lg">
                    {{ comment.authorId?.username?.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <!-- User Badge -->
                <div class="mt-2 text-center">
                  <div class="text-xs font-medium text-gray-900 dark:text-white">{{ comment.authorId?.username }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('groups.roles.member') }}</div>
                </div>
              </div>
            </div>
            
            <!-- Comment Content -->
            <div class="flex-1 min-w-0">
              <!-- Comment Header -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <span class="font-semibold text-gray-900 dark:text-white">{{ comment.authorId?.username }}</span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(comment.createdAt) }}</span>
                  <span class="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">
                    #{{ getCommentNumber(comment, index) }}
                  </span>
                </div>
              </div>
              
              <!-- Comment Body -->
              <div class="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mb-3 border border-gray-200 dark:border-gray-600">
                <div class="text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none dark:prose-invert" v-html="comment.content">
                </div>
              </div>
              
              <!-- Comment Actions -->
              <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <button 
                  @click="emit('like-comment', comment)"
                  class="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{{ comment.likesCount || 0 }}</span>
                </button>
                <button 
                  @click="emit('reply-comment', comment)"
                  class="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  <span>{{ t('groups.comments.reply') }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination Controls -->
      <div v-if="pagination.totalPages > 1" class="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-600">
        <div class="flex items-center justify-between">
          <!-- Page Info -->
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Mostrando página {{ pagination.currentPage }} de {{ pagination.totalPages }} 
            ({{ pagination.totalComments }} comentarios en total)
          </div>
          
          <!-- Pagination Buttons -->
          <div class="flex items-center gap-2">
            <!-- Previous Button -->
            <BaseButton
              @click="goToPreviousPage"
              :disabled="!pagination.hasPrevPage || isLoading"
              variant="secondary"
              size="sm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </BaseButton>
            
            <!-- Page Numbers -->
            <div class="flex items-center gap-1">
              <template v-for="page in Math.min(pagination.totalPages, 5)" :key="page">
                <BaseButton
                  v-if="page === pagination.currentPage"
                  variant="primary"
                  size="sm"
                  class="px-3 py-2"
                >
                  {{ page }}
                </BaseButton>
                <BaseButton
                  v-else
                  @click="goToPage(page)"
                  :disabled="isLoading"
                  variant="secondary"
                  size="sm"
                  class="px-3 py-2"
                >
                  {{ page }}
                </BaseButton>
              </template>
            </div>
            
            <!-- Next Button -->
            <BaseButton
              @click="goToNextPage"
              :disabled="!pagination.hasNextPage || isLoading"
              variant="secondary"
              size="sm"
            >
              Siguiente
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="p-12 text-center">
      <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ t('groups.topics.noComments') }}</h3>
      <p class="text-gray-500 dark:text-gray-400">{{ t('groups.comments.empty') }}</p>
    </div>
  </div>
</template>