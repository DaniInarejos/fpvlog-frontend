import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

// Vistas
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true,
      title: 'Inicio'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: {
      layout: 'auth',
      title: 'Iniciar Sesión'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: {
      layout: 'auth',
      title: 'Registro'
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Perfil'
    }
  },
  {
    path: '/flights',
    name: 'flights',
    component: () => import('../views/FlightView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Vuelos'
    }
  },
  {
    path: '/drones',
    name: 'drones',
    component: () => import('../views/DroneView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Mis Drones'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

// Navegación protegida
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  // Esperar a que se inicialice la autenticación
  await userStore.initAuth()

  if (requiresAuth && !userStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router