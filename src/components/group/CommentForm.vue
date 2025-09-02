<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '../base/BaseButton.vue'
import RichTextEditor from '../common/RichTextEditor.vue'

const props = defineProps({
  isSubmitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const { t } = useI18n()
const commentContent = ref('')
const showForm = ref(false)

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
</template>