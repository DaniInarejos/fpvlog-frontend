<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useI18n } from 'vue-i18n'
import groupService from '../services/groupService'
import GroupList from '../components/group/GroupList.vue'
import GroupForm from '../components/group/GroupForm.vue'
import GroupInfo from '../components/group/GroupInfo.vue'
import BaseModal from '../components/base/BaseModal.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseInput from '../components/base/BaseInput.vue'
import TabSelector from '../components/base/TabSelector.vue'

const userStore = useUserStore()
const { t } = useI18n()

const groups = ref([])
const isLoading = ref(false)
const showForm = ref(false)
const selectedGroup = ref(null)
const showDeleteModal = ref(false)
const groupToDelete = ref(null)
const errors = ref({})
const showGroupInfo = ref(false)
const selectedGroupInfo = ref(null)
const searchQuery = ref('')
const selectedTab = ref('all')
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
})

// Configuración de pestañas
const tabs = [
  { id: 'all', label: t('groups.tabs.all') },
  { id: 'my-groups', label: t('groups.tabs.myGroups') },
  { id: 'joined', label: t('groups.tabs.joined') }
]

const fetchGroups = async () => {
  isLoading.value = true
  try {
    const params = {
      page: pagination.value.page,
      limit: pagination.value.limit
    }
    
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    
    let response
    
    if (selectedTab.value === 'my-groups') {
      // Grupos creados por el usuario
      params.createdBy = userStore.user?._id
      response = await groupService.getGroups(params)
    } else if (selectedTab.value === 'joined') {
      // Grupos a los que el usuario se ha unido
      response = await groupService.getUserGroups(userStore.user?._id, params)
      // La respuesta tiene una estructura diferente, necesitamos extraer los grupos
      if (response.groups) {
        // Transformar la estructura de respuesta para que coincida con el formato esperado
        const transformedGroups = response.groups.map(item => ({
          ...item.group,
          userRole: item.role,
          joinedAt: item.joinedAt
        }))
        groups.value = transformedGroups
      }
      
      // Actualizar pagination si está disponible en la respuesta
      if (response.pagination) {
        pagination.value = {
          ...pagination.value,
          ...response.pagination
        }
      } else if (response.summary) {
        // Si no hay pagination pero hay summary, usar esa información
        pagination.value = {
          ...pagination.value,
          total: response.summary.totalGroups,
          totalPages: Math.ceil(response.summary.totalGroups / pagination.value.limit)
        }
      }
      return // Salir temprano para evitar el procesamiento normal
    } else {
      // Todos los grupos
      response = await groupService.getGroups(params)
    }
    
    groups.value = response.groups || []
    // Asegurar que pagination siempre tenga una estructura válida
    if (response.pagination) {
      pagination.value = {
        ...pagination.value,
        ...response.pagination
      }
    }
  } catch (error) {
    errors.value.fetch = error.message
    // Mantener la estructura de pagination en caso de error
    groups.value = []
  } finally {
    isLoading.value = false
  }
}
const handleCreate = () => {
  selectedGroup.value = null
  showForm.value = true
}

const handleEdit = (group) => {
  selectedGroup.value = group
  showForm.value = true
}

const handleClose = () => {
  showForm.value = false
  selectedGroup.value = null
}

const handleSaved = () => {
  showForm.value = false
  selectedGroup.value = null
  fetchGroups()
}

const handleShowGroupInfo = (group) => {
  selectedGroupInfo.value = group
  showGroupInfo.value = true
}

const handleCloseGroupInfo = () => {
  showGroupInfo.value = false
  selectedGroupInfo.value = null
}

const openDeleteModal = (group) => {
  groupToDelete.value = group
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!groupToDelete.value) return
  
  try {
    await groupService.deleteGroup(groupToDelete.value._id)
    await fetchGroups()
    showDeleteModal.value = false
    groupToDelete.value = null
  } catch (error) {
    errors.value.delete = error.message
  }
}

const handleTabChange = (tabId) => {
  selectedTab.value = tabId
  // Verificación defensiva para asegurar que pagination existe
  if (pagination.value) {
    pagination.value.page = 1
  }
  fetchGroups()
}

const handleSearch = () => {
  pagination.value.page = 1
  fetchGroups()
}

const handlePageChange = (page) => {
  pagination.value.page = page
  fetchGroups()
}

onMounted(() => {
  fetchGroups()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t('groups.title') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ t('groups.subtitle') }}
        </p>
      </div>
      <BaseButton @click="handleCreate">
        <template #icon>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </template>
        {{ t('groups.createGroup') }}
      </BaseButton>
    </div>

    <!-- Search and Filters -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <BaseInput
          v-model="searchQuery"
          :placeholder="t('groups.search.placeholder')"
          @keyup.enter="handleSearch"
        >
          <template #suffix>
            <BaseButton
              variant="secondary"
              size="sm"
              @click="handleSearch"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </BaseButton>
          </template>
        </BaseInput>
      </div>
    </div>

    <!-- Tabs -->
    <TabSelector
      :tabs="tabs"
      :active-tab="selectedTab"
      @tab-change="handleTabChange"
    />

    <!-- Groups List -->
    <GroupList
      :groups="groups"
      :is-loading="isLoading"
      :errors="errors"
      :pagination="pagination"
      :current-user="userStore.user"
      @edit="handleEdit"
      @delete="openDeleteModal"
      @show-info="handleShowGroupInfo"
      @page-change="handlePageChange"
    />

    <!-- Group Form Modal -->
    <GroupForm
      v-if="showForm"
      :group="selectedGroup"
      :show="showForm"
      @close="handleClose"
      @saved="handleSaved"
    />

    <!-- Delete Confirmation Modal -->
    <BaseModal
      :show="showDeleteModal"
      :title="t('common.delete')"
      :show-warning-icon="true"
      :show-delete-button="true"
      :show-accept-button="false"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    >
      <p class="text-sm text-gray-500">
        {{ t('groups.delete.confirmation', { name: groupToDelete?.name }) }}
      </p>
    </BaseModal>

    <!-- Group Info Modal -->
    <GroupInfo
      :group="selectedGroupInfo"
      :show="showGroupInfo"
      @close="handleCloseGroupInfo"
    />
  </div>
</template>