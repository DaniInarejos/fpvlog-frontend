<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    default: 0
  },
  maxVisiblePages: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['page-change'])
const { t } = useI18n()

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, props.currentPage - Math.floor(props.maxVisiblePages / 2))
  const end = Math.min(props.totalPages, start + props.maxVisiblePages - 1)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const canGoPrevious = computed(() => props.currentPage > 1)
const canGoNext = computed(() => props.currentPage < props.totalPages)

const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}

const goToPrevious = () => {
  if (canGoPrevious.value) {
    goToPage(props.currentPage - 1)
  }
}

const goToNext = () => {
  if (canGoNext.value) {
    goToPage(props.currentPage + 1)
  }
}
</script>

<template>
  <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 dark:bg-gray-800 dark:border-gray-700">
    <!-- Mobile pagination info -->
    <div class="flex flex-1 justify-between sm:hidden">
      <BaseButton
        variant="ghost"
        size="sm"
        :disabled="!canGoPrevious"
        @click="goToPrevious"
      >
        {{ t('common.previous') }}
      </BaseButton>
      <BaseButton
        variant="ghost"
        size="sm"
        :disabled="!canGoNext"
        @click="goToNext"
      >
        {{ t('common.next') }}
      </BaseButton>
    </div>
    
    <!-- Desktop pagination -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700 dark:text-gray-300">
          {{ t('common.pagination.showing') }}
          <span class="font-medium">{{ ((currentPage - 1) * Math.ceil(totalItems / totalPages)) + 1 }}</span>
          {{ t('common.pagination.to') }}
          <span class="font-medium">{{ Math.min(currentPage * Math.ceil(totalItems / totalPages), totalItems) }}</span>
          {{ t('common.pagination.of') }}
          <span class="font-medium">{{ totalItems }}</span>
          {{ t('common.pagination.results') }}
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <!-- Previous button -->
          <button
            type="button"
            :disabled="!canGoPrevious"
            @click="goToPrevious"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:ring-gray-600 dark:hover:bg-gray-700"
          >
            <span class="sr-only">{{ t('common.previous') }}</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <!-- First page if not visible -->
          <button
            v-if="visiblePages[0] > 1"
            type="button"
            @click="goToPage(1)"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-gray-100 dark:ring-gray-600 dark:hover:bg-gray-700"
          >
            1
          </button>
          
          <!-- Ellipsis if gap -->
          <span
            v-if="visiblePages[0] > 2"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 dark:text-gray-300 dark:ring-gray-600"
          >
            ...
          </span>
          
          <!-- Visible page numbers -->
          <button
            v-for="page in visiblePages"
            :key="page"
            type="button"
            @click="goToPage(page)"
            :class="[
              'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 dark:ring-gray-600',
              page === currentPage
                ? 'z-10 bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                : 'text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            {{ page }}
          </button>
          
          <!-- Ellipsis if gap -->
          <span
            v-if="visiblePages[visiblePages.length - 1] < totalPages - 1"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 dark:text-gray-300 dark:ring-gray-600"
          >
            ...
          </span>
          
          <!-- Last page if not visible -->
          <button
            v-if="visiblePages[visiblePages.length - 1] < totalPages"
            type="button"
            @click="goToPage(totalPages)"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-gray-100 dark:ring-gray-600 dark:hover:bg-gray-700"
          >
            {{ totalPages }}
          </button>
          
          <!-- Next button -->
          <button
            type="button"
            :disabled="!canGoNext"
            @click="goToNext"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:ring-gray-600 dark:hover:bg-gray-700"
          >
            <span class="sr-only">{{ t('common.next') }}</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>