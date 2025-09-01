import { ref } from 'vue'

// Estado global del modal
const showLoginModal = ref(false)

export function useGlobalLoginModal() {
  const openLoginModal = () => {
    showLoginModal.value = true
  }

  const closeLoginModal = () => {
    showLoginModal.value = false
  }

  const handleLoginSuccess = () => {
    closeLoginModal()
    // Opcional: recargar la página o actualizar datos
    window.location.reload()
  }

  return {
    showLoginModal,
    openLoginModal,
    closeLoginModal,
    handleLoginSuccess
  }
}