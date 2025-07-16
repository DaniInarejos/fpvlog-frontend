<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import likeService from '../../services/likeService'
import BaseCard from '../base/BaseCard.vue'
import UserAvatar from '../base/UserAvatar.vue'

const { t } = useI18n()
const router = useRouter()

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  currentUserId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['show-drone-info', 'show-spot-info', 'show-flight-info'])

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const itemData = computed(() => props.item.data)
const itemType = computed(() => props.item.type)

const navigateToProfile = (username) => {
  router.push(`/dashboard/${username}`)
}

const likesCount = computed(() => {
  return props.item.data?.likes?.length || 0
})

const hasUserLiked = computed(() => {
  if (!props.item.likes) 
    return false
  return props.item.likes.some(like => like.userId === props.currentUserId)
})

const likeIconClass = computed(() => {
  return hasUserLiked.value 
    ? 'text-red-500 dark:text-red-400' 
    : 'text-gray-400 dark:text-gray-500'
})

const handleLike = async () => {
  try {
    const response = await likeService.toggleLike(props.item.type,  props.item._id )
    if (response.liked) {
      props.item.likes = [...(props.item.likes || []), { userId: props.currentUserId }]
    } else {
      props.item.likes = props.item.likes.filter(like => like.userId !== props.currentUserId)
    }
  } catch (error) {
    console.error('Error al dar like:', error)
  }
}

const initSpotMap = (spotId, coordinates) => {
  if (!window.google || !coordinates?.length === 2) return

  const mapId = `spot-map-${spotId}`
  setTimeout(() => {
    const map = new google.maps.Map(document.getElementById(mapId), {
      mapId: mapId,
      center: { 
        lat: coordinates[1], 
        lng: coordinates[0] 
      },
      zoom: 15,
      disableDefaultUI: true,
      draggable: false,
      zoomControl: false,
      scrollwheel: false,
      disableDoubleClickZoom: true
    })

    new google.maps.marker.AdvancedMarkerElement({
      map,
      position: { 
        lat: coordinates[1], 
        lng: coordinates[0] 
      }
    })
  }, 100)
}

const handleDroneClick = () => {
  emit('show-drone-info', itemData.value)
}

const handleSpotClick = () => {
  emit('show-spot-info', itemData.value)
}

const handleFlightClick = () => {
  emit('show-flight-info', itemData.value)
}

const handleImageError = (event) => {
  event.target.src = '/images/placeholder.png'
}

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null
  const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/ ]{11})/)
  const videoId = videoIdMatch ? videoIdMatch[1] : null
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}
</script>

<template>
  <BaseCard class="mb-4 overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div class="p-4">
      <!-- Usuario nuevo -->
      <div v-if="itemType === 'user'" class="flex items-center space-x-4">
        <UserAvatar
          :src="itemData.profilePicture"
          :alt="itemData.username"
          size="lg"
          class="ring-2 ring-sky-500/30"
          @click="navigateToProfile(itemData.username)"
          style="cursor: pointer"
        />
        <div class="flex-1">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {{ t('feed.itemInfo.newUser') }}
          </h3>
          <p class="text-lg text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer"
             @click="navigateToProfile(itemData.username)">
            @{{ itemData.username }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ t('feed.itemInfo.joinedAt') }} {{ formatDate(itemData.createdAt) }}
          </p>
        </div>
      </div>

      <!-- Drone -->
      <div v-else-if="itemType === 'drone'" class="space-y-4">
        <div class="flex items-center mb-4">
          <UserAvatar
            :src="itemData.user.profilePicture"
            :alt="itemData.user.username"
            size="sm"
            class="mr-3"
            @click="navigateToProfile(itemData.user.username)"
            style="cursor: pointer"
          />
          <div>
            <h3 class="font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer"
                @click="navigateToProfile(itemData.user.username)">
              {{ itemData.user.username }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
          <!--   {{ formatDate(itemData.createdAt) }}--> 
            </p>
          </div>
        </div>

        <h4 class="text-xl font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
            @click="handleDroneClick">
         {{ t('feed.drone.title') }}: {{ itemData.name }}
        </h4>
        <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span v-if="itemData.droneBrand">{{ t('feed.itemInfo.brand') }}: {{ itemData.droneBrand.name }}</span>
          <span v-if="itemData.droneType">{{ t('feed.itemInfo.type') }}: {{ itemData.droneType.name }}</span>
          <span>{{ t('feed.itemInfo.model') }}: {{ itemData.model }}</span>
          <span>{{ t('feed.itemInfo.weight') }}: {{ itemData.weight }}g</span>
          <span>{{ t('feed.itemInfo.frameSize') }}: {{ itemData.frameSize }}mm</span>
        </div>

        <img
          v-if="itemData.image"
          :src="itemData.image"
          :alt="itemData.name"
          class="w-full h-auto rounded-lg mt-4 object-cover max-h-96"
        />

      </div>

      <!-- Vuelo -->
      <div v-else-if="itemType === 'flight'" class="space-y-4">
        <div class="flex items-center mb-4">
          <UserAvatar
            :src="itemData.user.profilePicture"
            :alt="itemData.user.username"
            size="sm"
            class="mr-3"
            @click="navigateToProfile(itemData.user.username)"
            style="cursor: pointer"
          />
          <div>
            <h3 class="font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer"
                @click="navigateToProfile(itemData.user.username)">
              {{ itemData.user.username }}
            </h3>
          <!-- <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(itemData.createdAt) }}
            </p> --->
          </div>
        </div>

        <h4 class="text-xl font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
            @click="handleFlightClick">
          {{ itemData.title }}
        </h4>
        <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>📍 {{ t('feed.itemInfo.location') }}: {{ itemData.location }}</span>
          <span>⏱️ {{ t('feed.itemInfo.duration') }}: {{ itemData.duration }}min</span>
          <span>🌤️ {{ t('feed.itemInfo.weather') }}: {{ itemData.weather }}</span>
        </div>
        <p class="text-gray-600 dark:text-gray-300">
          {{ itemData.notes }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
           @click="handleDroneClick">
          {{ t('feed.drone.title') }}: {{ itemData.drone.name }}
        </p>

        <img
          v-if="itemData.image"
          :src="itemData.image"
          :alt="itemData.title"
          class="w-full h-auto rounded-lg mt-4 object-cover max-h-96"
          @error="handleImageError"
        />
           
      </div>
           <div v-else-if="itemType === 'spot'" class="space-y-4">
        <div class="flex items-center mb-4">
          <UserAvatar
            :src="itemData.user.profilePicture"
            :alt="itemData.user.username"
            size="sm"
            class="mr-3"
            @click="navigateToProfile(itemData.user.username)"
            style="cursor: pointer"
          />
          <div>
            <h3 class="font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer"
                @click="navigateToProfile(itemData.user.username)">
              {{ itemData.user.username }}
            </h3>
          </div>
        
        </div>

        <h4 class="text-xl font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
            @click="handleSpotClick">
          Spot: {{ itemData.name }}
        </h4>
        
        <!-- Map -->
        <div v-if="itemData.location?.coordinates?.length === 2" 
             :id="`spot-map-${item._id}`" 
             class="w-full h-48 rounded-lg overflow-hidden"
             @vue:mounted="initSpotMap(item._id, itemData.location.coordinates)">
        </div>

        <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>📍 {{ itemData.location?.city }}, {{ itemData.location?.country }}</span>
        </div>

        <p v-if="itemData.description" class="text-gray-600 dark:text-gray-300">
          {{ itemData.description }}
        </p>

      </div>
       <!-- Botón de like común para todos los tipos -->
       <button 
         @click="handleLike"
         class="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
       >
         <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="likeIconClass" viewBox="0 0 20 20" fill="currentColor">
           <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
         </svg>
         {{ likesCount }}
       </button>
 
    </div>
  </BaseCard>
</template>