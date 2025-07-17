<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '../base/BaseCard.vue'
import BaseInput from '../base/BaseInput.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseAlert from '../base/BaseAlert.vue'
import componentService from '../../services/componentService'
import { useUserStore } from '../../stores/user'

const props = defineProps({
  selectedType: {
    type: String,
    required: true
  }
})
const userStore = useUserStore()
const emit = defineEmits(['close', 'saved'])
const { t } = useI18n()
const isLoading = ref(false)
const errors = ref({})

const formData = ref({
  name: '',
  type: props.selectedType,
  brand: '',
  weightGrams: 0,
  description: '',
  sourceUrl: '',
  createdBy:userStore.user._id
})

const validateForm = () => {
  errors.value = {}
  if (!formData.value.name) errors.value.name = t('components.validation.name')
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  try {
    await componentService.createComponent(formData.value)
    emit('saved')
  } catch (error) {
    errors.value.submit = error.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <BaseCard class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">
        {{ t('components.addComponent') }} - {{ t(`components.types.${selectedType.toLowerCase()}`) }}
      </h2>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <BaseAlert
        v-if="errors.submit"
        type="error"
        :message="errors.submit"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          v-model="formData.name"
          :label="t('components.form.name')"
          :error="errors.name"
          required
        />

        <BaseInput
          v-model="formData.brand"
          :label="t('components.form.brand')"
        />

        <BaseInput
          v-model="formData.weightGrams"
          :label="t('components.form.weight')"
          type="number"
        />

        <BaseInput
          v-model="formData.sourceUrl"
          :label="t('components.form.sourceUrl')"
          type="url"
        />
      </div>

      <BaseInput
        v-model="formData.description"
        :label="t('components.form.description')"
        type="textarea"
      />

      <div class="flex justify-end space-x-4">
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
          {{ t('common.save') }}
        </BaseButton>
      </div>
    </form>
  </BaseCard>
</template>