<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import groupPostService from '../../services/groupPostService'
import BaseModal from '../base/BaseModal.vue'
import BaseInput from '../base/BaseInput.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseAlert from '../base/BaseAlert.vue'

const props = defineProps({
  groupId: {
    type: String,
    required: true
  },
  post: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])
const { t } = useI18n()

const form = ref({
  title: props.post?.title || '',
  content: props.post?.content || '',
  tags: props.post?.tags?.join(', ') || ''
})

const isLoading = ref(false)
const errors = ref({})

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.title.trim()) {
    errors.value.title = t('groups.topics.validation.titleRequired')
  }
  
  if (!form.value.content.trim()) {
    errors.value.content = t('groups.topics.validation.contentRequired')
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    isLoading.value = true
    
    const postData = {
      title: form.value.title.trim(),
      content: form.value.content.trim(),
      tags: form.value.tags ? form.value.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
    }
    
    if (props.post) {
      await groupPostService.updatePost(props.groupId, props.post._id, postData)
    } else {
      await groupPostService.createPost(props.groupId, postData)
    }
    
    emit('saved')
  } catch (error) {
    errors.value.submit = error.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <BaseModal
    :show="true"
    :title="post ? t('groups.topics.edit') : t('groups.topics.create')"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <BaseAlert
        v-if="errors.submit"
        type="error"
        :message="errors.submit"
      />
      
      <BaseInput
        v-model="form.title"
        :label="t('groups.topics.title')"
        :error="errors.title"
        required
      />
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('groups.topics.content') }}
        </label>
        <textarea
          v-model="form.content"
          rows="6"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          :class="{ 'border-red-500': errors.content }"
        ></textarea>
        <p v-if="errors.content" class="mt-1 text-sm text-red-600">{{ errors.content }}</p>
      </div>
      
      <BaseInput
        v-model="form.tags"
        :label="t('groups.topics.tags')"
        :placeholder="t('groups.topics.tagsPlaceholder')"
      />
      
      <div class="flex justify-end gap-2 pt-4">
        <BaseButton
          type="button"
          variant="secondary"
          @click="emit('close')"
        >
          {{ t('common.cancel') }}
        </BaseButton>
        <BaseButton
          type="submit"
          :loading="isLoading"
        >
          {{ post ? t('common.update') : t('common.create') }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>