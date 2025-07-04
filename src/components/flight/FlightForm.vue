<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '../base/BaseCard.vue'
import BaseInput from '../base/BaseInput.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseAlert from '../base/BaseAlert.vue'

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
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'close', 'imageUpload'])

const formData = ref({
  title: '',
  date: '',
  location: '',
  duration: '',
  batteryUsed: '',
  weather: '',
  notes: '',
  droneId: '',
  visibility: {
    isVisibleToFollowers: true,
    isPublic: false
  }
})

const errors = ref({})

if (props.flight) {
  formData.value = {
    ...props.flight,
    date: props.flight.date.split('T')[0]
  }
}

const validateForm = () => {
  errors.value = {}
  if (!formData.value.title) errors.value.title = t('message.flights.validation.title')
  if (!formData.value.date) errors.value.date = t('message.flights.validation.date')
  if (!formData.value.location) errors.value.location = t('message.flights.validation.location')
  if (!formData.value.duration) errors.value.duration = t('message.flights.validation.duration')
  if (!formData.value.batteryUsed) errors.value.batteryUsed = t('message.flights.validation.batteryUsed')
  if (!formData.value.droneId) errors.value.droneId = t('message.flights.validation.droneId')
  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) return
  emit('submit', formData.value)
}

const handleImageUpload = (event) => {
  emit('imageUpload', event)
}
</script>

<template>
  <BaseCard class="p-6">
    <h2 class="text-xl font-semibold mb-4">
      {{ flight ? t('message.flights.editFlight') : t('message.flights.newFlight') }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          v-model="formData.title"
          :label="t('message.flights.form.title')"
          :error="errors.title"
          required
        />

        <BaseInput
          v-model="formData.date"
          :label="t('message.flights.form.date')"
          type="date"
          :error="errors.date"
          required
        />

        <select
          v-model="formData.droneId"
          class="input"
          :class="{ 'border-red-500': errors.droneId }"
          required
        >
          <option value="">{{ t('message.flights.form.drone') }}</option>
          <option v-for="drone in drones" :key="drone._id" :value="drone._id">
            {{ drone.name }}
          </option>
        </select>

        <BaseInput
          v-model="formData.location"
          :label="t('message.flights.form.location')"
          :error="errors.location"
          required
        />

        <BaseInput
          v-model="formData.duration"
          :label="t('message.flights.form.duration')"
          type="number"
          :error="errors.duration"
          required
        />

        <BaseInput
          v-model="formData.batteryUsed"
          :label="t('message.flights.form.batteryUsed')"
          type="number"
          :error="errors.batteryUsed"
          required
        />

        <BaseInput
          v-model="formData.weather"
          :label="t('message.flights.form.weather')"
        />

        <div class="md:col-span-2">
          <BaseInput
            v-model="formData.notes"
            :label="t('message.flights.form.notes')"
            type="textarea"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ t('message.flights.form.image') }}
          </label>
          <input
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            class="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <div class="md:col-span-2 space-y-2">
          <label class="flex items-center">
            <input
              type="checkbox"
              v-model="formData.visibility.isVisibleToFollowers"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span class="ml-2">{{ t('message.flights.form.visibility.followers') }}</span>
          </label>

          <label class="flex items-center">
            <input
              type="checkbox"
              v-model="formData.visibility.isPublic"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span class="ml-2">{{ t('message.flights.form.visibility.public') }}</span>
          </label>
        </div>
      </div>

      <div class="flex justify-end space-x-4">
        <BaseButton
          type="button"
          variant="secondary"
         @click="emit('close')"
        >
          {{ t('message.common.cancel') }}
        </BaseButton>

        <BaseButton
          type="submit"
          :loading="isLoading"
        >
          {{ flight ? t('message.common.save') : t('message.flights.addFlight') }}
        </BaseButton>
      </div>
    </form>
  </BaseCard>
</template>