<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '../base/BaseCard.vue'
import BaseInput from '../base/BaseInput.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseImageUpload from '../base/BaseImageUpload.vue'
import BaseAlert from '../base/BaseAlert.vue'
import BaseDivider from '../base/BaseDivider.vue'
import BaseCheckbox from '../base/BaseCheckbox.vue'
import flightService from '../../services/flightService'

const { t } = useI18n()

const props = defineProps({
  flight: {
    type: Object,
    default: null
  },
  drones: {
    type: Array,
    required: true
  },
  spots: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'close', 'saved'])

const errors = ref({})
const isSubmitting = ref(false)

const formData = ref({
  title: '',
  date: '',
  droneId: null,
  spotId: null,
  duration: '',
  batteryUsed: '',
  weather: '',
  notes: '',
  urlVideo: '',
  image: null,
  visibility: {
    isVisibleToFollowers: true,
    isPublic: true
  }
})

if (props.flight) {
  formData.value = {
    ...props.flight,
    date: props.flight.date ? props.flight.date.split('T')[0] : ''
  }
}

const validateForm = () => {
  errors.value = {}
  if (!formData.value.title) errors.value.title = t('flights.validation.title')
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  try {
    let flightId
    if (props.flight) {
      await flightService.updateFlight(props.flight._id, formData.value)
      flightId = props.flight._id
    } else {
      const newFlight = await flightService.createFlight(formData.value)
      flightId = newFlight._id
    }
    
    if (formData.value.image instanceof File) {
      const imageFormData = new FormData()
      imageFormData.append('image', formData.value.image)
      await flightService.uploadFlightImage(flightId, imageFormData)
    }
    
    emit('saved')
  } catch (error) {
    errors.value.submit = error.message
  } finally {
    isSubmitting.value = false
  }
}

const handleImageChange = (image) => {
  formData.value.image = image
}
</script>

<template>
  <BaseCard class="p-6">
    <h2 class="text-xl font-semibold mb-4">
      {{ flight ? t('flights.editFlight') : t('flights.newFlight') }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <BaseAlert
        v-if="errors.submit"
        type="error"
        :message="errors.submit"
      />

      <BaseDivider :title="t('flights.form.sections.media')" />
      <BaseImageUpload
        :label="t('flights.form.image')"
        :current-image="formData.image"
        @change="handleImageChange"
      />

      <BaseDivider :title="t('flights.form.sections.basic')" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          v-model="formData.title"
          :label="t('flights.form.title')"
          :error="errors.title"
          required
        />

        <BaseInput
          v-model="formData.date"
          :label="t('flights.form.date')"
          type="date"
        />

        <select
          v-model="formData.droneId"
          class="input"
        >
          <option value="">{{ t('flights.form.drone') }}</option>
          <option v-for="drone in drones" :key="drone._id" :value="drone._id">
            {{ drone.name }}
          </option>
        </select>

        <select
          v-model="formData.spotId"
          class="input"
        >
          <option value="">{{ t('flights.form.spot') }}</option>
          <option v-for="spot in spots" :key="spot._id" :value="spot._id">
            {{ spot.name }}
          </option>
        </select>

        <BaseInput
          v-model="formData.duration"
          :label="t('flights.form.duration')"
          type="number"
        />

        <BaseInput
          v-model="formData.batteryUsed"
          :label="t('flights.form.batteryUsed')"
          type="number"
        />

        <BaseInput
          v-model="formData.weather"
          :label="t('flights.form.weather')"
        />

        <BaseInput
          v-model="formData.urlVideo"
          :label="t('flights.form.urlVideo')"
          type="url"
        />
      </div>

      <div class="md:col-span-2">
        <BaseInput
          v-model="formData.notes"
          :label="t('flights.form.notes')"
          type="textarea"
        />
      </div>

      <BaseDivider :title="t('flights.form.sections.privacy')" />
      <div class="md:col-span-2 space-y-2">
        <BaseCheckbox
          v-model="formData.visibility.isVisibleToFollowers"
          :label="t('flights.form.visibility.followers')"
        />
        <BaseCheckbox
          v-model="formData.visibility.isPublic"
          :label="t('flights.form.visibility.public')"
        />
      </div>

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
          {{ flight ? t('common.save') : t('flights.addFlight') }}
        </BaseButton>
      </div>
    </form>
  </BaseCard>
</template>