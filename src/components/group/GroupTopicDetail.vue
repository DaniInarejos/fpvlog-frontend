<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <!-- Loading state -->
    <div v-if="loading" class="animate-pulse p-6">
      <div class="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
      <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
      <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
    </div>

    <!-- Topic content -->
    <div v-else-if="topic" class="p-6">
      <!-- Topic header -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="flex items-center space-x-2 mb-2">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ topic.title }}
            </h1>
            <span v-if="topic.isPinned" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                <path fill-rule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
              </svg>
              {{ $t('groups.topics.pinned') }}
            </span>
          </div>
          
          <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div class="flex items-center space-x-2">
              <img
                :src="topic.author.profilePicture || '/images/placeholder.png'"
                :alt="topic.author.username"
                class="w-6 h-6 rounded-full object-cover"
              >
              <span>{{ topic.author.username }}</span>
            </div>
            <span>{{ formatDate(topic.createdAt) }}</span>
            <span>{{ topic.commentsCount || 0 }} {{ $t('groups.comments') }}</span>
          </div>
          
          <div v-if="topic.description" class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-6">
            {{ topic.description }}
          </div>
        </div>
        
        <div v-if="canEditTopic" class="flex items-center space-x-2 ml-4">
          <button
            @click="$emit('edit-topic', topic)"
            class="text-gray-400 hover:text-blue-500 transition-colors"
            :title="$t('common.edit')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </button>
          <button
            @click="$emit('delete-topic', topic)"
            class="text-gray-400 hover:text-red-500 transition-colors"
            :title="$t('common.delete')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Comments section -->
      <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
        <GroupComments
          :topic-id="topic._id"
          :group-id="groupId"
          :can-comment="canComment"
          @comment-added="handleCommentAdded"
        />
      </div>
    </div>
    
    <!-- Error state -->
    <div v-else class="p-6 text-center">
      <p class="text-gray-500 dark:text-gray-400">{{ $t('groups.topics.notFound') }}</p>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../../stores/user'
import GroupComments from './GroupComments.vue'

export default {
  name: 'GroupTopicDetail',
  components: {
    GroupComments
  },
  props: {
    topic: {
      type: Object,
      default: null
    },
    groupId: {
      type: [String, Number],
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    canComment: {
      type: Boolean,
      default: false
    },
    canModerate: {
      type: Boolean,
      default: false
    }
  },
  emits: ['edit-topic', 'delete-topic', 'topic-updated'],
  setup() {
    const userStore = useUserStore()
    return {
      currentUser: userStore.user
    }
  },
  computed: {
    canEditTopic() {
      return this.canModerate || this.topic?.author?.id === this.currentUser?.id
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString(this.$i18n.locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    handleCommentAdded() {
      // Actualizar contador de comentarios
      if (this.topic) {
        this.topic.commentsCount = (this.topic.commentsCount || 0) + 1
        this.$emit('topic-updated', this.topic)
      }
    }
  }
}
</script>