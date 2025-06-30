<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '../stores/user' // Importar el store de usuario
import feedService from '../services/feedService'
import FeedItem from '../components/feed/FeedItem.vue'

const { t } = useI18n()
const userStore = useUserStore() // Inicializar el store
const items = ref([])
const loading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const hasNextPage = ref(true)

const loadFeed = async (page = 1) => {
  if (!hasNextPage.value || loading.value) return

  try {
    loading.value = true
    const response = await feedService.getGlobalFeed(page)
    
    if (page === 1) {
      items.value = response.items
    } else {
      items.value = [...items.value, ...response.items]
    }

    hasNextPage.value = response.pagination.hasNextPage
    currentPage.value = response.pagination.currentPage
  } catch (err) {
    error.value = t('message.feed.error.loading')
  } finally {
    loading.value = false
  }
}

const handleScroll = () => {
  const scrollPosition = window.innerHeight + window.scrollY
  const documentHeight = document.documentElement.offsetHeight
  
  if (scrollPosition >= documentHeight - 1000) {
    loadFeed(currentPage.value + 1)
  }
}

onMounted(() => {
  loadFeed()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-3xl">
    <!-- Encabezado -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ t('message.feed.title') }}</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('message.feed.subtitle') }}</p>
    </div>

    <!-- Lista de items -->
    <div class="space-y-6">
      <FeedItem
        v-for="item in items"
        :key="item.data._id"
        :item="item"
        :current-user-id="userStore.user?._id"
      />
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
    </div>

    <!-- Mensaje de error -->
    <div v-if="error" class="text-center py-8 text-red-600 dark:text-red-400">
      {{ error }}
    </div>

    <!-- Fin del feed -->
    <div v-if="!hasNextPage && !loading" class="text-center py-8 text-gray-600 dark:text-gray-400">
      {{ t('message.feed.noMoreContent') }}
    </div>
  </div>
</template>