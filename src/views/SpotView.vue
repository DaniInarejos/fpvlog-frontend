<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useGlobalLoginModal } from '../composables/useGlobalLoginModal'
import spotService from '../services/spotService'
import SpotPageHeader from '../components/spot/SpotPageHeader.vue'
import SpotFilters from '../components/spot/SpotFilters.vue'
import SpotCardGlass from '../components/spot/SpotCardGlass.vue'
import SpotForm from '../components/spot/SpotForm.vue'
import SpotInfoGlassModal from '../components/spot/SpotInfoGlassModal.vue'
import SpotInfo from '../components/spot/SpotInfo.vue'
import BaseModal from '../components/base/BaseModal.vue'
import LoginModal from '../components/common/LoginModal.vue'

const userStore = useUserStore()
const { t } = useI18n()
const router = useRouter()
const { showLoginModal, openLoginModal, closeLoginModal, handleLoginSuccess } = useGlobalLoginModal()
const spots = ref([])
const isLoading = ref(false)
const showForm = ref(false)
const selectedSpot = ref(null)
const showDeleteModal = ref(false)
const spotToDelete = ref(null)
const showSpotInfo = ref(false)
const selectedSpotInfo = ref(null)
const showSpotInfoGlass = ref(false)
const selectedSpotInfoGlass = ref(null)
const selectedFilter = ref('ALL')
const errors = ref({})

const isAuthenticated = computed(() => userStore.isAuthenticated)

const filteredSpots = computed(() => {
  return spots.value.filter(spot => {
    if (selectedFilter.value === 'ALL') return true
    if (selectedFilter.value === 'NORESTRICTIONS') return spot.legalStatus === 'NORESTRICTIONS'
    if (selectedFilter.value === 'RESTRICTEDZONE') return spot.legalStatus === 'RESTRICTEDZONE'
    if (selectedFilter.value === 'PROHIBITEDZONE') return spot.legalStatus === 'PROHIBITEDZONE'
    if (selectedFilter.value === 'WITHOUT_ANALIZED') return spot.legalStatus === 'WITHOUT_ANALIZED'
    if (selectedFilter.value === 'FAVORITES') return spot.isFavorite
    return false
  })
})

const handleLogin = () => {
  router.push('/login')
}

const handleCreateSpot = () => {
  if (!isAuthenticated.value) {
    openLoginModal()
    return
  }
  selectedSpot.value = null
  showForm.value = true
}

const handleEditSpot = (spot) => {
  selectedSpot.value = spot
  showForm.value = true
}

const handleDeleteSpot = (spot) => {
  spotToDelete.value = spot
  showDeleteModal.value = true
}

const handleViewSpot = (spot) => {
  selectedSpotInfo.value = spot
  showSpotInfo.value = true
}

const handleShowSpotInfo = (spot) => {
  selectedSpotInfoGlass.value = spot
  showSpotInfoGlass.value = true
}

const handleFilterChange = (filter) => {
  selectedFilter.value = filter
}

const fetchSpots = async () => {
  isLoading.value = true
  try {
    spots.value = await spotService.getUserSpots(userStore.user._id)
  } catch (error) {
    errors.value.fetch = error.response?.data?.message || error.message
  } finally {
    isLoading.value = false
  }
}

const confirmDelete = async () => {
  try {
    await spotService.deleteSpot(spotToDelete.value._id)
    await fetchSpots()
    showDeleteModal.value = false
    spotToDelete.value = null
  } catch (error) {
    errors.value.delete = error.response?.data?.message || error.message
  }
}

const handleSaved = async () => {
  showForm.value = false
  await fetchSpots()
}

const handleClose = () => {
  showForm.value = false
  selectedSpot.value = null
}

onMounted(() => {
  // Cargar spots independientemente del estado de autenticación
  // Los usuarios no autenticados pueden ver los spots pero no interactuar
  fetchSpots()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <SpotPageHeader
      :title="t('spots.title')"
      :description="t('spots.description')"
      :is-authenticated="isAuthenticated"
      color="blue"
      @create="handleCreateSpot"
    />

    <!-- Filtros y búsqueda -->
    <div class="mb-6 space-y-4 mt-8">
      <!-- Filtro de tipos -->
      <SpotFilters
        :selected-filter="selectedFilter"
        @filter-change="handleFilterChange"
      />
    </div>

    <!-- Lista de spots -->
    <div v-if="isAuthenticated" class="space-y-4">
      <!-- Contador de filtros con glassmorphism -->
      <div class="text-sm text-gray-700 dark:text-gray-300 backdrop-blur-sm bg-white/20 dark:bg-gray-900/20 rounded-lg px-4 py-2 border border-white/30 dark:border-gray-700/30 shadow-sm">
        {{ t('spots.showing', { 
          count: filteredSpots.length,
          total: spots.length 
        }) }}
      </div>

      <!-- Grid de spots -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
      
      <div v-else-if="filteredSpots.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <SpotCardGlass
          v-for="spot in filteredSpots"
          :key="spot._id"
          :spot="spot"
          :is-authenticated="isAuthenticated"
          color="blue"
          @edit="handleEditSpot"
          @delete="handleDeleteSpot"
          @view="handleViewSpot"
          @show-info="handleShowSpotInfo"
          @toggle-favorite="fetchSpots"
        />
      </div>

      <!-- Estado vacío con glassmorphism -->
      <div v-else class="text-center py-12">
        <div class="backdrop-blur-md bg-white/20 dark:bg-gray-900/20 rounded-2xl p-8 border border-white/30 dark:border-gray-700/30 shadow-xl">
          <div class="text-6xl mb-4">📍</div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {{ t('spots.noSpots') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ t('spots.noSpotsDescription') }}
          </p>
          <button
            @click="handleCreateSpot"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors backdrop-blur-sm border border-blue-500/30 shadow-lg"
          >
            <span class="mr-2">➕</span>
            {{ t('spots.addFirstSpot') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Estado no autenticado con glassmorphism -->
    <div v-else class="text-center py-12">
      <div class="backdrop-blur-md bg-white/20 dark:bg-gray-900/20 rounded-2xl p-8 border border-white/30 dark:border-gray-700/30 shadow-xl">
        <div class="text-6xl mb-4">🔐</div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {{ t('auth.loginRequired') }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ t('spots.loginDescription') }}
        </p>
        <button
          @click="handleLogin"
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors backdrop-blur-sm border border-blue-500/30 shadow-lg"
        >
          <span class="mr-2">🔐</span>
          {{ t('auth.login') }}
        </button>
      </div>
    </div>

    <!-- Modal para formulario -->
    <Teleport to="body">
      <BaseModal
        v-if="showForm"
        :show="showForm"
        :title="selectedSpot ? t('spots.editSpot') : t('spots.addSpot')"
        :show-accept-button="false"
        :show-cancel-button="false"
        :show-close-button="true"
        :require-double-click="true"
        size="full"
        @close="handleClose"
      >
        <SpotForm
          :spot="selectedSpot"
          @close="handleClose"
          @saved="handleSaved"
        />
      </BaseModal>
    </Teleport>

    <!-- Modal de confirmación de eliminación -->
    <BaseModal
      :show="showDeleteModal"
      :title="t('spots.delete.title')"
      :show-warning-icon="true"
      :show-delete-button="true"
      :show-accept-button="false"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    >
      <p class="text-sm text-gray-500">
        {{ t('spots.delete.confirmation', { name: spotToDelete?.name }) }}
      </p>
    </BaseModal>

    <!-- Modal de información del spot -->
    <SpotInfo
      v-if="showSpotInfo"
      :spot="selectedSpotInfo"
      @close="showSpotInfo = false"
      @edit="handleEditSpot"
      @delete="handleDeleteSpot"
    />

    <!-- Modal Glass de información del spot -->
    <SpotInfoGlassModal
      :spot="selectedSpotInfoGlass"
      :show="showSpotInfoGlass"
      @close="showSpotInfoGlass = false"
    />
    
    <!-- Modal de Login Global -->
    <LoginModal
      :show="showLoginModal"
      @close="closeLoginModal"
      @login-success="handleLoginSuccess"
    />
  </div>
</template>