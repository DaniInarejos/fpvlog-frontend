<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '../../stores/user'
import BaseModal from '../base/BaseModal.vue'
import BaseInput from '../base/BaseInput.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseAlert from '../base/BaseAlert.vue'
import BaseCheckbox from '../base/BaseCheckbox.vue'
import groupService from '../../services/groupService'

const props = defineProps({
  group: {
    type: Object,
    default: null
  },
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'saved'])
const { t } = useI18n()
const userStore = useUserStore()

const isLoading = ref(false)
const errors = ref({})
const errorMessage = ref('')
const successMessage = ref('')

const formData = ref({
  name: '',
  description: '',
  isPrivate: false,
  tags: []
})

const tagInput = ref('')

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.name.trim()) {
    errors.value.name = t('groups.validation.nameRequired')
  } else if (formData.value.name.length > 100) {
    errors.value.name = t('groups.validation.nameTooLong')
  }
  
  if (!formData.value.description.trim()) {
    errors.value.description = t('groups.validation.descriptionRequired')
  } else if (formData.value.description.length > 500) {
    errors.value.description = t('groups.validation.descriptionTooLong')
  }
  
  if (formData.value.tags.length > 10) {
    errors.value.tags = t('groups.validation.tooManyTags')
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const groupData = {
      name: formData.value.name.trim(),
      description: formData.value.description.trim(),
      isPrivate: formData.value.isPrivate,
      tags: formData.value.tags
    }
    
    if (props.group) {
      await groupService.updateGroup(props.group._id, groupData)
      successMessage.value = t('groups.messages.updated')
    } else {
      await groupService.createGroup(groupData)
      successMessage.value = t('groups.messages.created')
    }
    
    setTimeout(() => {
      emit('saved')
    }, 1000)
  } catch (error) {
    errorMessage.value = error.response?.data?.error || error.message
  } finally {
    isLoading.value = false
  }
}

const addTag = () => {
  const tag = tagInput.value.trim().toLowerCase()
  if (tag && !formData.value.tags.includes(tag) && formData.value.tags.length < 10) {
    formData.value.tags.push(tag)
    tagInput.value = ''
  }
}

const removeTag = (index) => {
  formData.value.tags.splice(index, 1)
}

const handleTagKeyup = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    addTag()
  }
}

// Initialize form data when group prop changes
watch(() => props.group, (newGroup) => {
  if (newGroup) {
    formData.value = {
      name: newGroup.name || '',
      description: newGroup.description || '',
      isPrivate: newGroup.isPrivate || false,
      tags: [...(newGroup.tags || [])]
    }
  } else {
    formData.value = {
      name: '',
      description: '',
      isPrivate: false,
      tags: []
    }
  }
  errors.value = {}
  errorMessage.value = ''
  successMessage.value = ''
}, { immediate: true })
</script>

<template>
  <BaseModal
    :show="show"
    :title="group ? t('groups.editGroup') : t('groups.createGroup')"
    :show-accept-button="false"
    :show-cancel-button="false"
    size="full"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Success/Error Messages -->
      <BaseAlert
        v-if="successMessage"
        type="success"
        :message="successMessage"
      />
      
      <BaseAlert
        v-if="errorMessage"
        type="error"
        :message="errorMessage"
      />

      <!-- Basic Information -->
      <div class="space-y-4">
        <BaseInput
          v-model="formData.name"
          :label="t('groups.form.name')"
          :error="errors.name"
          :placeholder="t('groups.form.namePlaceholder')"
          required
        />

        <BaseInput
          v-model="formData.description"
          :label="t('groups.form.description')"
          :error="errors.description"
          :placeholder="t('groups.form.descriptionPlaceholder')"
          type="textarea"
          rows="4"
          required
        />

        <!-- Privacy Setting -->
        <BaseCheckbox
          v-model="formData.isPrivate"
          :label="t('groups.form.isPrivate')"
          :description="t('groups.form.isPrivateDescription')"
        />

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('groups.form.tags') }}
          </label>
          
          <!-- Tag Input -->
          <div class="flex gap-2 mb-3">
            <BaseInput
              v-model="tagInput"
              :placeholder="t('groups.form.tagsPlaceholder')"
              class="flex-1"
              @keyup="handleTagKeyup"
            />
            <BaseButton
              type="button"
              variant="secondary"
              @click="addTag"
              :disabled="!tagInput.trim() || formData.tags.length >= 10"
            >
              {{ t('groups.form.addTag') }}
            </BaseButton>
          </div>
          
          <!-- Tags Display -->
          <div v-if="formData.tags.length > 0" class="flex flex-wrap gap-2">
            <span
              v-for="(tag, index) in formData.tags"
              :key="index"
              class="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
            >
              #{{ tag }}
              <button
                type="button"
                @click="removeTag(index)"
                class="text-blue-600 hover:text-blue-800"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          </div>
          
          <p v-if="errors.tags" class="text-red-500 text-sm mt-1">
            {{ errors.tags }}
          </p>
          
          <p class="text-gray-500 text-sm mt-1">
            {{ t('groups.form.tagsHelp', { count: formData.tags.length, max: 10 }) }}
          </p>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <BaseButton
          type="button"
          variant="secondary"
          @click="emit('close')"
          :disabled="isLoading"
        >
          {{ t('common.cancel') }}
        </BaseButton>
        
        <BaseButton
          type="submit"
          :loading="isLoading"
          :disabled="isLoading"
        >
          {{ group ? t('common.save') : t('groups.createGroup') }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>