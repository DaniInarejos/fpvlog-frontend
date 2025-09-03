<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '../../stores/user'
import BaseButton from '../base/BaseButton.vue'
import RichTextEditor from '../common/RichTextEditor.vue'

const props = defineProps({
  isSubmitting: {
    type: Boolean,
    default: false
  },
  canWrite: {
    type: Boolean,
    default: false
  },
  groupId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['submit', 'cancel', 'join-group'])

const { t } = useI18n()
const userStore = useUserStore()
const commentContent = ref('')
const showForm = ref(false)

const isUserAuthenticated = computed(() => userStore.isAuthenticated)

const handleSubmit = () => {
  if (commentContent.value.trim()) {
    emit('submit', commentContent.value)
    commentContent.value = ''
    showForm.value = false
  }
}

const handleCancel = () => {
  commentContent.value = ''
  showForm.value = false
  emit('cancel')
}

const toggleForm = () => {
  showForm.value = !showForm.value
}

const handleJoinGroup = () => {
  emit('join-group')
}
</script>

<template>
  <!-- Add Comment Form -->
  <div class="bg-blue-50/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-blue-100/50 dark:border-gray-700/50">
    <!-- Form Header -->
    <div class="bg-blue-100/60 dark:bg-gray-700/60 px-6 py-4 border-b border-blue-200/50 dark:border-gray-600">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        {{ t('groups.comments.addComment') }}
      </h2>
    </div>
    
    <!-- Form Content -->
    <div class="p-6">
      <!-- Si el usuario no puede escribir (no es miembro) -->
      <div v-if="!canWrite && isUserAuthenticated" class="text-center py-8">
        <div class="mb-4">
          <svg class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ t('groups.comments.membershipRequired') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ t('groups.comments.joinToComment') }}
          </p>
        </div>
        
        <BaseButton @click="handleJoinGroup" variant="primary" class="px-8 py-3">
          <template #icon>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </template>
          {{ t('groups.joinGroup') }}
        </BaseButton>
      </div>
      
      <!-- Si el usuario no está autenticado -->
      <div v-else-if="!isUserAuthenticated" class="text-center py-8">
        <div class="mb-4">
          <svg class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ t('groups.comments.loginRequired') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ t('groups.comments.loginToComment') }}
          </p>
        </div>
        
        <BaseButton @click="$router.push('/login')" variant="primary" class="px-8 py-3">
          <template #icon>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </template>
          {{ t('auth.login') }}
        </BaseButton>
      </div>
      
      <!-- Formulario normal para miembros -->
      <div v-else-if="canWrite">
        <div v-if="!showForm" class="text-center">
          <BaseButton @click="toggleForm" variant="primary" class="w-full sm:w-auto">
            <template #icon>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </template>
            {{ t('groups.comments.writeComment') }}
          </BaseButton>
        </div>
        
        <div v-else class="space-y-4">
          <!-- Rich Text Editor -->
          <div>
            <RichTextEditor
              v-model="commentContent"
              :placeholder="t('groups.comments.placeholder')"
              :height="150"
              toolbar="forum"
              class="min-h-[120px]"
            />
          </div>
          
          <!-- Form Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-blue-200/50 dark:border-gray-600">
            <BaseButton
              @click="handleCancel"
              variant="secondary"
              :disabled="isSubmitting"
            >
              {{ t('common.cancel') }}
            </BaseButton>
            
            <BaseButton
              @click="handleSubmit"
              variant="primary"
              :loading="isSubmitting"
              :disabled="!commentContent.trim() || isSubmitting"
            >
              <template #icon v-if="!isSubmitting">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </template>
              {{ isSubmitting ? t('common.sending') : t('groups.comments.comment') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>