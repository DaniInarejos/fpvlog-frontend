<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useI18n } from 'vue-i18n'
import groupCommentService from '../services/groupCommentService'
import groupTopicService from '../services/groupTopicService'
import groupService from '../services/groupService'

import TopicHeader from '../components/group/TopicHeader.vue'
import TopicComments from '../components/group/TopicComments.vue'
import CommentForm from '../components/group/CommentForm.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

const topic = ref(null)
const comments = ref([])
const isLoading = ref(false)
const isLoadingComments = ref(false)
const isSubmittingComment = ref(false)
const sortOrder = ref('newest')
const userMembership = ref(null)

const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalComments: 0,
  hasNextPage: false,
  hasPrevPage: false
})

// Computed properties para verificar membresía
const isUserAuthenticated = computed(() => userStore.isAuthenticated)
const currentUserId = computed(() => userStore.user?._id)

const isMember = computed(() => {
  if (!userMembership.value) return false
  const memberRoles = ['OWNER', 'ADMIN', 'MEMBER']
  return memberRoles.includes(userMembership.value.role)
})

const canWriteComments = computed(() => {
  return isUserAuthenticated.value && isMember.value
})

// Verificar membresía del usuario
const checkUserMembership = async () => {
  if (!isUserAuthenticated.value) {
    userMembership.value = null
    return
  }
  
  try {
    const memberResponse = await groupService.getGroupMembers(route.params.groupId, { limit: 100 })
    const members = memberResponse.members || []
    
    userMembership.value = members.find(member => 
      member.userId?._id === currentUserId.value
    ) || null
  } catch (error) {
    console.error('Error checking membership:', error)
    userMembership.value = null
  }
}

// Función para unirse al grupo
const handleJoinGroup = async () => {
  try {
    await groupService.joinGroup(route.params.groupId)
    await checkUserMembership() // Recargar membresía
  } catch (error) {
    console.error('Error joining group:', error)
  }
}

const loadTopic = async () => {
  try {
    isLoading.value = true
    const response = await groupTopicService.getTopicById(route.params.groupId,route.params.topicId)
    topic.value = response
  } catch (error) {
    console.error('Error loading topic:', error)
    router.push({ name: 'group-detail', params: { id: route.params.groupId } })
  } finally {
    isLoading.value = false
  }
}

const loadComments = async (page = 1) => {
  try {
    isLoadingComments.value = true
    const response = await groupCommentService.getTopicComments(route.params.groupId,route.params.topicId, {

      page,
      limit: 10,
      sort: sortOrder.value === 'newest' ? '-createdAt' : 'createdAt'
    })
    
    if (response.success) {
      comments.value = response.data.comments
      Object.assign(pagination, response.data.pagination)
    }
  } catch (error) {
    console.error('Error loading comments:', error)
  } finally {
    isLoadingComments.value = false
  }
}

const handleSortChange = () => {
  sortOrder.value = sortOrder.value === 'newest' ? 'oldest' : 'newest'
  loadComments(1)
}

const handlePageChange = (page) => {
  loadComments(page)
}

const handleSubmitComment = async (content) => {
  try {
    isSubmittingComment.value = true
    await groupCommentService.createComment(route.params.groupId, route.params.topicId, { content })
    
    // Reload comments and go to last page if new comment was added
    await loadComments(pagination.totalPages)
  } catch (error) {
    console.error('Error submitting comment:', error)
  } finally {
    isSubmittingComment.value = false
  }
}

const handleLikeComment = async (comment) => {
  try {
    await groupCommentService.toggleCommentLike(route.params.groupId, comment._id)
    // Reload current page to update like count
    await loadComments(pagination.currentPage)
  } catch (error) {
    console.error('Error liking comment:', error)
  }
}

const handleReplyComment = (comment) => {
  // TODO: Implement reply functionality
  console.log('Reply to comment:', comment)
}

// Nuevas funciones para editar y eliminar comentarios
const handleEditComment = async (commentId, newContent) => {
  try {
    await groupCommentService.updateComment(route.params.groupId, commentId, { content: newContent })
    // Reload current page to show updated comment
    await loadComments(pagination.currentPage)
  } catch (error) {
    console.error('Error editing comment:', error)
  }
}

const handleDeleteComment = async (commentId) => {
  try {
    await groupCommentService.deleteComment(route.params.groupId, commentId)
    // Reload current page to remove deleted comment
    await loadComments(pagination.currentPage)
  } catch (error) {
    console.error('Error deleting comment:', error)
  }
}

// Lifecycle
onMounted(async () => {
  await loadTopic()
  await checkUserMembership()
  await loadComments()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100/80 via-indigo-100/70 to-purple-100/60 dark:from-gray-900 dark:via-blue-900/30 dark:to-purple-900/20">
    <div class="max-w-5xl mx-auto px-4 py-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <!-- Breadcrumb Navigation -->
      <nav class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6" v-else-if="topic">
        <button 
          @click="$router.push({ name: 'groups' })"
          class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {{ t('groups.title') }}
        </button>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <button 
          @click="$router.push({ name: 'group-detail', params: { id: route.params.groupId } })"
          class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {{ topic.groupId.name || t('groups.title') }}
        </button>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <span class="text-gray-900 dark:text-white font-medium">{{ topic.title }}</span>
      </nav>

      <!-- Topic Header -->
      <TopicHeader
        v-if="topic"
        :topic="topic"
        :group-id="route.params.groupId"
        :total-comments="pagination.totalComments"
        :can-edit="false"
      />

      <!-- Comments Section -->
      <TopicComments
        :comments="comments"
        :pagination="pagination"
        :is-loading="isLoadingComments"
        :sort-order="sortOrder"
        @sort-change="handleSortChange"
        @page-change="handlePageChange"
        @like-comment="handleLikeComment"
        @reply-comment="handleReplyComment"
        @edit-comment="handleEditComment"
        @delete-comment="handleDeleteComment"
      />

      <!-- Comment Form -->
      <CommentForm
        :is-submitting="isSubmittingComment"
        :can-write="canWriteComments"
        :group-id="route.params.groupId"
        @submit="handleSubmitComment"
        @join-group="handleJoinGroup"
      />
    </div>
  </div>
</template>