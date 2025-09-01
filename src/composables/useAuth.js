import { computed } from 'vue'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

export function useAuth() {
  const userStore = useUserStore()
  const router = useRouter()

  const isAuthenticated = computed(() => userStore.isAuthenticated)
  const isPublicMode = computed(() => !userStore.isAuthenticated)

  const requireAuth = (action = 'realizar esta acción') => {
    if (!isAuthenticated.value) {
      return {
        allowed: false,
        message: `Necesitas iniciar sesión para ${action}`,
        showLoginLink: true
      }
    }
    return { allowed: true }
  }

  // Eliminar función goToLogin
  // const goToLogin = () => {
  //   router.push('/login')
  // }

  return {
    isAuthenticated,
    isPublicMode,
    requireAuth
    // goToLogin - eliminado
  }
}