<script setup>
import DOMPurify from 'dompurify'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseButton from '../base/BaseButton.vue'

const props = defineProps({
  topic: {
    type: Object,
    required: true
  },
  groupId: {
    type: String,
    required: true
  },
  totalComments: {
    type: Number,
    default: 0
  },
  canEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit', 'delete', 'pin', 'unpin'])

const router = useRouter()
const { t } = useI18n()

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const navigateToGroup = () => {
  router.push({ name: 'group-detail', params: { id: props.groupId } })
}

// Función para sanitizar HTML básico (opcional, para seguridad)
const sanitizeHtml = (html) => {
  return DOMPurify.sanitize(html)
}
</script>

<template>
  <!-- Topic Header Card -->
  <div class="bg-blue-50/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden mb-6 border border-blue-100/50 dark:border-gray-700/50">
    <!-- Banner Section -->
    <div class="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
      <img 
        v-if="topic?.bannerUrl" 
        :src="topic.bannerUrl" 
        class="w-full h-full object-cover" 
        :alt="topic.title + ' banner'"
      />
      <!-- Overlay gradient for better text readability -->
      <div class="absolute inset-0 bg-black bg-opacity-20"></div>
      
      <!-- Topic Avatar/Icon -->
      <div class="absolute -bottom-12 left-6">
        <div class="relative">
          <div class="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span class="text-4xl">
              {{ topic.isPinned ? '📌' : '💬' }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Topic Info Section -->
    <div class="pt-16 pb-6 px-6">
      <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between">
        <!-- Left side - Topic details -->
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ topic?.title || '' }}</h1>
          <!-- Cambio principal: usar v-html en lugar de interpolación de texto -->
          <div 
            v-if="topic?.description" 
            v-html="sanitizeHtml(topic.description)"
            class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed prose prose-sm max-w-none"
          ></div>
          
          <!-- Stats Row -->
          <div class="flex flex-wrap gap-6 mb-4">
            <div class="flex items-center text-gray-600 dark:text-gray-400">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span class="font-medium">{{ totalComments }}</span>
              <span class="ml-1">{{ t('groups.topics.comments') }}</span>
            </div>
            
            <div v-if="topic?.createdBy || topic?.author" class="flex items-center text-gray-600 dark:text-gray-400">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
              <span>{{ t('groups.createdBy') }}: {{ topic.createdBy?.username || topic.author?.username }}</span>
            </div>
            
            <div class="flex items-center text-gray-600 dark:text-gray-400">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
              </svg>
              <span>{{ formatDate(topic.createdAt) }}</span>
            </div>
            
            <!-- Group Link -->
            <div class="flex items-center text-gray-600 dark:text-gray-400">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <button 
                @click="navigateToGroup"
                class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline"
              >
                {{ topic.groupId.name || t('groups.title') }}
              </button>
            </div>
          </div>
          
          <!-- Tags -->
          <div v-if="topic?.tags?.length" class="flex flex-wrap gap-2 mb-4">
            <span 
              v-for="tag in topic.tags" 
              :key="tag" 
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              #{{ tag }}
            </span>
          </div>
          
          <!-- Status Badges -->
          <div class="flex items-center gap-2">
            <span 
              v-if="topic?.isPinned"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            >
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8zM9 5a2 2 0 000 4h.01a2 2 0 000-4H9zM9 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
              </svg>
              {{ t('groups.topics.pinned') }}
            </span>
          </div>
        </div>
        
        <!-- Right side - Action buttons -->
        <div v-if="canEdit" class="mt-6 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row lg:flex-col gap-3">
          <BaseButton 
            @click="emit('edit')"
            variant="secondary"
            class="whitespace-nowrap"
          >
            {{ t('common.edit') }}
          </BaseButton>
          
          <BaseButton 
            v-if="topic?.isPinned"
            @click="emit('unpin')"
            variant="secondary"
            class="whitespace-nowrap"
          >
            {{ t('groups.topics.unpin') }}
          </BaseButton>
          
          <BaseButton 
            v-else
            @click="emit('pin')"
            variant="secondary"
            class="whitespace-nowrap"
          >
            {{ t('groups.topics.pin') }}
          </BaseButton>
          
          <BaseButton 
            @click="emit('delete')"
            variant="danger"
            class="whitespace-nowrap"
          >
            {{ t('common.delete') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>