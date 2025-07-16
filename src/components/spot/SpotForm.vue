<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '../../stores/user'
import spotService from '../../services/spotService'
import BaseInput from '../base/BaseInput.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseAlert from '../base/BaseAlert.vue'
import BaseCard from '../base/BaseCard.vue'
import BaseCheckbox from '../base/BaseCheckbox.vue'
import BaseDivider from '../base/BaseDivider.vue'
import BaseMap from '../base/BaseMap.vue'

const props = defineProps({
  spot: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])
const { t } = useI18n()
const userStore = useUserStore()

const form = ref({
  name: props.spot?.name || '',
  description: props.spot?.description || '',
  location: props.spot?.location || {
    type: 'Point',
    coordinates: [],
    address: '',
    city: '',
    country: '',
    placeId: ''
  },
  visibility: props.spot?.visibility || {
    public: true,
    visibleToFollowersOnly: false
  }
})

const errors = ref({})
const isLoading = ref(false)

const handleSubmit = async () => {
  isLoading.value = true
  errors.value = {}

  try {
    if (props.spot) {
      await spotService.updateSpot(props.spot._id, form.value)
    } else {
      const spotData = {
        ...form.value,
        submittedBy: userStore.user._id
      }
      await spotService.createSpot(spotData)
    }
    emit('saved')
  } catch (error) {
    errors.value = error.response?.data?.errors || { general: error.message }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <BaseCard class="p-6">
    <h2 class="text-xl font-semibold mb-4">
      {{ props.spot ? t('spots.editSpot') : t('spots.addSpot') }}
    </h2>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <BaseAlert
        v-if="errors.general"
        type="error"
        :message="errors.general"
      />

      <BaseDivider title="Información Básica" />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          v-model="form.name"
          :label="t('spots.form.name')"
          :error="errors.name"
          required
        />

        <BaseInput
          v-model="form.description"
          :label="t('spots.form.description')"
          :error="errors.description"
          type="textarea"
        />
      </div>

      <BaseDivider title="Ubicación" />

      <div class="space-y-2">
        <BaseMap
          v-model="form.location"
          :error="errors.location"
        />
      </div>

      <BaseDivider title="Privacidad" />

      <div class="space-y-3">
        <BaseCheckbox
          v-model="form.visibility.public"
          :label="t('spots.form.public')"
        />
        <BaseCheckbox
          v-model="form.visibility.visibleToFollowersOnly"
          :label="t('spots.form.visibleToFollowersOnly')"
        />
      </div>

      <div class="flex justify-end space-x-4 mt-6">
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
          {{ props.spot ? t('common.save') : t('spots.form.create') }}
        </BaseButton>
      </div>
    </form>
  </BaseCard>
</template>