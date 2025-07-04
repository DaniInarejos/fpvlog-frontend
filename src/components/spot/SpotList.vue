<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '../base/BaseCard.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseAlert from '../base/BaseAlert.vue'
import StaticMap from '../base/StaticMap.vue'
import SpotInfo from './SpotInfo.vue'

const props = defineProps({
  spots: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  errors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['create', 'edit', 'delete'])
const { t } = useI18n()

const showSpotInfo = ref(false)
const selectedSpot = ref(null)

const handleShowSpotInfo = (spot) => {
  selectedSpot.value = spot
  showSpotInfo.value = true
}

const handleCloseSpotInfo = () => {
  showSpotInfo.value = false
  selectedSpot.value = null
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
        {{ t('message.spots.title') }}
      </h1>
      <BaseButton
        variant="primary"
        @click="emit('create')"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
        </template>
        {{ t('message.spots.addSpot') }}
      </BaseButton>
    </div>

    <BaseAlert
      v-if="errors.fetch"
      type="error"
      :message="errors.fetch"
    />

    <div v-if="isLoading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
    </div>

    <div v-else-if="spots.length === 0" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">
        {{ t('message.spots.noSpots') }}
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BaseCard
        v-for="spot in spots"
        :key="spot._id"
        class="overflow-hidden hover:shadow-lg transition-shadow duration-300 p-0"
      >
        <StaticMap
          v-if="spot.location?.coordinates?.length === 2"
          :coordinates="spot.location.coordinates"
          :spot-id="spot._id"
        />
        <div v-else class="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-t-lg flex items-center justify-center">
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            {{ t('message.spots.noLocation') }}
          </p>
        </div>

        <div class="p-4">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 
                class="text-lg font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
                @click="handleShowSpotInfo(spot)"
              >
                {{ spot.name }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ spot.location.city }}, {{ spot.location.country }}
              </p>
            </div>
           
          </div>

          <p v-if="spot.description" class="text-gray-600 dark:text-gray-400 mb-4">
            {{ spot.description }}
          </p>

          <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span v-if="spot.visibility.public">
              {{ t('message.spots.public') }}
            </span>
            <span v-else-if="spot.visibility.visibleToFollowersOnly">
              {{ t('message.spots.followersOnly') }}
            </span>
            <span v-else>
              {{ t('message.spots.private') }}
            </span>
          </div>
           <div class="flex gap-2">
              <BaseButton
                size="sm"
                variant="secondary"
                @click="emit('edit', spot)"
              >
                <template #icon>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </template>
                {{ t('message.common.edit') }}
              </BaseButton>
              <BaseButton
                size="sm"
                variant="danger"
                @click="emit('delete', spot)"
              >
                {{ t('message.common.delete') }}
              </BaseButton>
            </div>
        </div>
      </BaseCard>
    </div>

    <SpotInfo
      :spot="selectedSpot"
      :show="showSpotInfo"
      @close="handleCloseSpotInfo"
    />
  </div>
</template>