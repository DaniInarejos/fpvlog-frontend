<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'
import { useI18n } from 'vue-i18n'
import groupTopicService from '../../services/groupTopicService'
import BaseCard from '../base/BaseCard.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseModal from '../base/BaseModal.vue'
import BaseInput from '../base/BaseInput.vue'
import BaseAlert from '../base/BaseAlert.vue'

const props = defineProps({
  groupId: {
    type: String,
    required: true
  },
  canManage: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['topic-created', 'topic-updated', 'topic-deleted'])

const userStore = useUserStore()
const { t } = useI18n()

const topics = ref([])
const isLoading = ref(false)
const showTopicForm = ref(false)
const selectedTopic = ref(null)
const errors = ref({})
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalTopics: 0
})

const topicForm = ref({
  title: '',
  description: '',
  isPinned: false
})

const fetchTopics = async (page = 1) => {
  isLoading.value = true
  errors.value = {}
  try {
    const response = await groupTopicService.getGroupTopics(props.groupId, {
      page,
      limit: 10,
      sort: '-isPinned,-createdAt' // Primero fijados, luego por fecha
    })
      console.log(response)
    if (response.topics) {
      topics.value = response.topics
      pagination.value = response.pagination
    }
  } catch (error) {
    console.error('Error fetching topics:', error)
    errors.value.fetch = error.response?.data?.message || t('common.error.generic')
  } finally {
    isLoading.value = false
  }
}

const handleCreateTopic = () => {
  selectedTopic.value = null
  topicForm.value = {
    title: '',
    description: '',
    isPinned: false
  }
  showTopicForm.value = true
}

const handleEditTopic = (topic) => {
  selectedTopic.value = topic
  topicForm.value = {
    title: topic.title,
    description: topic.description || '',
    isPinned: topic.isPinned
  }
  showTopicForm.value = true
}

const validateForm = () => {
  errors.value = {}
  
  if (!topicForm.value.title.trim()) {
    errors.value.title = t('groups.topics.validation.titleRequired')
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSaveTopic = async () => {
  if (!validateForm()) return
  
  try {
    const topicData = {
      title: topicForm.value.title.trim(),
      description: topicForm.value.description.trim(),
      isPinned: topicForm.value.isPinned
    }
    
    if (selectedTopic.value) {
      // Editar topic existente
      await groupTopicService.updateTopic(props.groupId, selectedTopic.value._id, topicData)
      emit('topic-updated')
    } else {
      // Crear nuevo topic
      await groupTopicService.createTopic(props.groupId, topicData)
      emit('topic-created')
    }
    
    showTopicForm.value = false
    await fetchTopics(pagination.value.currentPage)
  } catch (error) {
    console.error('Error saving topic:', error)
    errors.value.save = error.response?.data?.message || t('common.error.generic')
  }
}

const handleDeleteTopic = async (topic) => {
  if (!confirm(t('groups.topics.confirmDelete', { title: topic.title }))) return
  
  try {
    await groupTopicService.deleteTopic(props.groupId, topic._id)
    emit('topic-deleted')
    await fetchTopics(pagination.value.currentPage)
  } catch (error) {
    console.error('Error deleting topic:', error)
    errors.value.delete = error.response?.data?.message || t('common.error.generic')
  }
}

const handleTogglePin = async (topic) => {
  try {
    await groupTopicService.togglePinTopic(props.groupId, topic._id)
    await fetchTopics(pagination.value.currentPage)
  } catch (error) {
    console.error('Error toggling pin:', error)
  }
}

const formatLastActivity = (date) => {
  const now = new Date()
  const activityDate = new Date(date)
  const diff = now - activityDate
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return t('common.today')
  } else if (days === 1) {
    return t('common.yesterday')
  } else {
    return t('common.daysAgo', { days })
  }
}

const handlePageChange = (page) => {
  fetchTopics(page)
}

onMounted(() => {
  fetchTopics()
})
</script>

<template>
  <div class="space-y-4">
    <!-- Error Alert -->
    <BaseAlert
      v-if="errors.fetch || errors.delete"
      type="error"
      :message="errors.fetch || errors.delete"
    />

    <!-- Header con botón para crear topic -->
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
        {{ t('groups.topics.title') }}
      </h2>
      <BaseButton
        v-if="canManage"
        @click="handleCreateTopic"
        size="sm"
      >
        <template #icon>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </template>
        {{ t('groups.topics.createTopic') }}
      </BaseButton>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <BaseCard class="p-4">
          <div class="space-y-3">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            <div class="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Topics List -->
    <div v-else-if="topics.length > 0" class="space-y-4">
      <BaseCard
        v-for="topic in topics"
        :key="topic._id"
        class="p-4 hover:shadow-md transition-shadow cursor-pointer"
        @click="$emit('topic-selected', topic)"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <!-- Pin Icon -->
              <svg
                v-if="topic.isPinned"
                class="w-4 h-4 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                <path fill-rule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                <path d="M8 11v5l4-2v-3H8z" />
              </svg>
              
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ topic.title }}
              </h3>
            </div>
            
            <p v-if="topic.description" class="text-gray-600 dark:text-gray-400 mb-3">
              {{ topic.description }}
            </p>
            
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span>{{ t('groups.topics.postCount', { count: topic.postCount || 0 }) }}</span>
              <span v-if="topic.lastActivity">
                {{ t('groups.topics.lastActivity') }}: {{ formatLastActivity(topic.lastActivity) }}
              </span>
              <span v-if="topic.author">
                {{ t('groups.topics.by') }} {{ topic.author.username }}
              </span>
            </div>
          </div>
          
          <!-- Actions -->
          <div v-if="canManage" class="flex items-center gap-2 ml-4">
            <BaseButton
              @click.stop="handleTogglePin(topic)"
              variant="ghost"
              size="sm"
              :title="topic.isPinned ? t('groups.topics.unpin') : t('groups.topics.pin')"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                <path fill-rule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                <path d="M8 11v5l4-2v-3H8z" />
              </svg>
            </BaseButton>
            
            <BaseButton
              @click.stop="handleEditTopic(topic)"
              variant="ghost"
              size="sm"
              :title="t('common.edit')"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </BaseButton>
            
            <BaseButton
              @click.stop="handleDeleteTopic(topic)"
              variant="ghost"
              size="sm"
              :title="t('common.delete')"
              class="text-red-600 hover:text-red-700"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </BaseButton>
          </div>
        </div>
      </BaseCard>
      
      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="flex justify-center">
        <nav class="flex items-center gap-2">
          <BaseButton
            v-for="page in pagination.totalPages"
            :key="page"
            @click="handlePageChange(page)"
            :variant="page === pagination.currentPage ? 'primary' : 'ghost'"
            size="sm"
          >
            {{ page }}
          </BaseButton>
        </nav>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <BaseCard class="p-8">
        <div class="text-6xl mb-4">💬</div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {{ t('groups.topics.empty.title') }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          {{ t('groups.topics.empty.description') }}
        </p>
      </BaseCard>
    </div>

    <!-- Modal para crear/editar topic -->
    <BaseModal
      :show="showTopicForm"
      :title="selectedTopic ? t('groups.topics.editTopic') : t('groups.topics.createTopic')"
      @close="showTopicForm = false"
    >
      <div class="space-y-4">
        <BaseAlert
          v-if="errors.save"
          type="error"
          :message="errors.save"
        />
        
        <BaseInput
          v-model="topicForm.title"
          :label="t('groups.topics.form.title')"
          :placeholder="t('groups.topics.form.titlePlaceholder')"
          :error="errors.title"
          required
        />
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('groups.topics.form.description') }}
          </label>
          <textarea
            v-model="topicForm.description"
            :placeholder="t('groups.topics.form.descriptionPlaceholder')"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          ></textarea>
        </div>
        
        <div v-if="canManage" class="flex items-center">
          <input
            id="isPinned"
            v-model="topicForm.isPinned"
            type="checkbox"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          >
          <label for="isPinned" class="ml-2 block text-sm text-gray-900 dark:text-white">
            {{ t('groups.topics.form.pinTopic') }}
          </label>
        </div>
      </div>
      
      <div class="flex justify-end gap-2 mt-6">
        <BaseButton variant="secondary" @click="showTopicForm = false">
          {{ t('common.cancel') }}
        </BaseButton>
        <BaseButton @click="handleSaveTopic" :disabled="!topicForm.title.trim()">
          {{ selectedTopic ? t('common.update') : t('common.create') }}
        </BaseButton>
      </div>
    </BaseModal>
  </div>
</template>