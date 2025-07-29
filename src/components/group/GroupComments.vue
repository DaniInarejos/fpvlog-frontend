<script>
import { useUserStore } from '../../stores/user'
import groupTopicService from '../../services/groupTopicService'

export default {
  name: 'GroupComments',
  props: {
    topicId: {
      type: [String, Number],
      required: true
    },
    groupId: {
      type: [String, Number],
      required: true
    },
    canComment: {
      type: Boolean,
      default: false
    }
  },
  emits: ['comment-added', 'comment-updated', 'comment-deleted'],
  methods: {
    async fetchComments(page = 1) {
      this.loading = true
      try {
        const response = await groupTopicService.getTopicComments(this.groupId, this.topicId, {
          page,
          limit: 10,
          sort: 'createdAt'
        })
        
        if (page === 1) {
          this.comments = response.data.comments
        } else {
          this.comments.push(...response.data.comments)
        }
        
        this.pagination = response.data.pagination
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        this.loading = false
      }
    },
    
    async createComment() {
      if (!this.newComment.trim()) return
      
      try {
        const response = await groupTopicService.createTopicComment(this.groupId, this.topicId, {
          content: this.newComment.trim(),
          parentId: this.replyingTo?.id || null
        })
        
        if (this.replyingTo) {
          // Agregar como respuesta
          if (!this.replyingTo.replies) {
            this.replyingTo.replies = []
          }
          this.replyingTo.replies.push(response.data)
          this.replyingTo.repliesCount = (this.replyingTo.repliesCount || 0) + 1
        } else {
          // Agregar como comentario principal
          this.comments.unshift(response.data)
        }
        
        this.newComment = ''
        this.replyingTo = null
        this.$emit('comment-added', response.data)
      } catch (error) {
        console.error('Error creating comment:', error)
      }
    },
    
    async toggleLike(comment) {
      try {
        await groupTopicService.toggleTopicCommentLike(this.groupId, this.topicId, comment.id)
        comment.isLiked = !comment.isLiked
        comment.likesCount = comment.isLiked ? 
          (comment.likesCount || 0) + 1 : 
          Math.max(0, (comment.likesCount || 0) - 1)
      } catch (error) {
        console.error('Error toggling comment like:', error)
      }
    }
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- Error Alerts -->
    <BaseAlert
      v-if="errors.fetch || errors.create || errors.edit || errors.delete || errors.reply"
      type="error"
      :message="errors.fetch || errors.create || errors.edit || errors.delete || errors.reply"
    />

    <!-- New Comment Form -->
    <div v-if="canComment && currentUser" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <div class="flex gap-3">
        <UserAvatar :user="currentUser" size="sm" />
        <div class="flex-1">
          <textarea
            v-model="newComment"
            :placeholder="t('groups.comments.placeholder')"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
          ></textarea>
          <div class="flex justify-end mt-2">
            <BaseButton
              @click="handleCreateComment"
              :disabled="!newComment.trim() || isSubmitting"
              size="sm"
            >
              {{ t('groups.comments.post') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Comments List -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse flex gap-3">
        <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-1/4"></div>
          <div class="h-3 bg-gray-200 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <div v-else-if="comments.length > 0" class="space-y-4">
      <div
        v-for="comment in comments"
        :key="comment._id"
        class="flex gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <UserAvatar :user="comment.authorId" size="sm" />
        
        <div class="flex-1">
          <!-- Comment Header -->
          <div class="flex items-center gap-2 mb-2">
            <span class="font-medium text-gray-900 dark:text-white">
              {{ comment.authorId.username }}
            </span>
            <span class="text-sm text-gray-500">
              {{ formatDate(comment.createdAt) }}
            </span>
            <span v-if="comment.updatedAt !== comment.createdAt" class="text-xs text-gray-400">
              ({{ t('groups.comments.edited') }})
            </span>
          </div>
          
          <!-- Comment Content -->
          <div v-if="editingComment === comment._id" class="mb-3">
            <textarea
              v-model="editContent"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
            ></textarea>
            <div class="flex justify-end gap-2 mt-2">
              <BaseButton @click="cancelEdit" variant="ghost" size="sm">
                {{ t('common.cancel') }}
              </BaseButton>
              <BaseButton @click="handleEditComment(comment)" size="sm">
                {{ t('common.save') }}
              </BaseButton>
            </div>
          </div>
          
          <p v-else class="text-gray-700 dark:text-gray-300 mb-3">
            {{ comment.content }}
          </p>
          
          <!-- Comment Actions -->
          <div class="flex items-center gap-4 text-sm">
            <!-- Like Button -->
            <button
              @click="handleToggleLike(comment)"
              class="flex items-center gap-1 text-gray-500 hover:text-primary-600 transition-colors"
              :class="{ 'text-primary-600': comment.isLiked }"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span>{{ comment.likesCount || 0 }}</span>
            </button>
            
            <!-- Reply Button -->
            <button
              v-if="canComment && currentUser"
              @click="startReply(comment)"
              class="text-gray-500 hover:text-primary-600 transition-colors"
            >
              {{ t('groups.comments.reply') }}
            </button>
            
            <!-- Edit Button -->
            <button
              v-if="canEditComment(comment)"
              @click="startEdit(comment)"
              class="text-gray-500 hover:text-primary-600 transition-colors"
            >
              {{ t('common.edit') }}
            </button>
            
            <!-- Delete Button -->
            <button
              v-if="canDeleteComment(comment)"
              @click="handleDeleteComment(comment)"
              class="text-gray-500 hover:text-red-600 transition-colors"
            >
              {{ t('common.delete') }}
            </button>
          </div>
          
          <!-- Reply Form -->
          <div v-if="replyingTo === comment._id" class="mt-3 ml-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <textarea
              v-model="replyContent"
              :placeholder="t('groups.comments.replyPlaceholder')"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white resize-none"
            ></textarea>
            <div class="flex justify-end gap-2 mt-2">
              <BaseButton @click="cancelReply" variant="ghost" size="sm">
                {{ t('common.cancel') }}
              </BaseButton>
              <BaseButton
                @click="handleCreateReply(comment._id)"
                :disabled="!replyContent.trim() || isSubmitting"
                size="sm"
              >
                {{ t('groups.comments.reply') }}
              </BaseButton>
            </div>
          </div>
          
          <!-- Show Replies Count -->
          <div v-if="comment.repliesCount > 0" class="mt-3">
            <button class="text-sm text-primary-600 hover:text-primary-700">
              {{ t('groups.comments.showReplies', { count: comment.repliesCount }) }}
            </button>
          </div>
        </div>
      </div>
      
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
    <div v-else class="text-center py-8">
      <div class="text-4xl mb-2">💬</div>
      <p class="text-gray-500 dark:text-gray-400">
        {{ t('groups.comments.empty') }}
      </p>
    </div>
  </div>
</template>