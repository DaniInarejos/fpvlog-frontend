<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useI18n } from 'vue-i18n'
import { useGlobalLoginModal } from '../composables/useGlobalLoginModal'
import spotService from '../services/spotService'
import SpotList from '../components/spot/SpotList.vue'
import SpotForm from '../components/spot/SpotForm.vue'
import BaseModal from '../components/base/BaseModal.vue'
import LoginModal from '../components/common/LoginModal.vue'

const userStore = useUserStore()
const { t } = useI18n()
const { showLoginModal, openLoginModal, closeLoginModal, handleLoginSuccess } = useGlobalLoginModal()
const spots = ref([])
const isLoading = ref(false)
const showForm = ref(false)
const selectedSpot = ref(null)
const showDeleteModal = ref(false)
const spotToDelete = ref(null)
const errors = ref({})

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

const handleCreate = () => {
  if (!userStore.isAuthenticated) {
    openLoginModal()
    return
  }
  selectedSpot.value = null
  showForm.value = true
}

const handleEdit = (spot) => {
  if (!userStore.isAuthenticated) {
    openLoginModal()
    return
  }
  selectedSpot.value = spot
  showForm.value = true
}

const handleDelete = (spot) => {
  spotToDelete.value = spot
  showDeleteModal.value = true
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
    <div v-if="!showForm">
      <SpotList
        :spots="spots"
        :is-loading="isLoading"
        :errors="errors"
        @edit="handleEdit"
        @create="showForm = true"
        @delete="handleDelete"
      />
    </div>

    <div v-else>
      <SpotForm
        :spot="selectedSpot"
        @close="handleClose"
        @saved="handleSaved"
      />
    </div>

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
    
    <!-- Modal de Login Global -->
    <LoginModal
      :show="showLoginModal"
      @close="closeLoginModal"
      @login-success="handleLoginSuccess"
    />
  </div>
</template>