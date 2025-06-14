import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import Profile from '@/views/Profile.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true } // Solo para usuarios no autenticados
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navegación mejorado
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Esperar a que termine la inicialización si está en proceso
  if (authStore.isLoading) {
    // Esperar un poco para que termine la verificación
    await new Promise(resolve => {
      const checkLoading = () => {
        if (!authStore.isLoading) {
          resolve()
        } else {
          setTimeout(checkLoading, 100)
        }
      }
      checkLoading()
    })
  }
  
  const isAuthenticated = authStore.isLoggedIn
  const requiresAuth = to.meta.requiresAuth
  const requiresGuest = to.meta.requiresGuest
  
  if (requiresAuth && !isAuthenticated) {
    // Ruta protegida y usuario no autenticado
    next('/login')
  } else if (requiresGuest && isAuthenticated) {
    // Ruta para invitados y usuario autenticado
    next('/dashboard')
  } else {
    next()
  }
})

export default router