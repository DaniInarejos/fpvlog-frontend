import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

// Vistas
import Home from '../views/HomeView.vue'
import Login from '../views/LoginView.vue'
import Register from '../views/RegisterView.vue'
import Profile from '../views/ProfileView.vue'
import Flights from '../views/FlightView.vue'
import Drones from '../views/DroneView.vue'
import Followers from '../views/FollowersView.vue'
import Following from '../views/FollowingView.vue'
import Dashboard from '../views/DashboardView.vue'

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
    component: Login,
    meta: {
      layout: 'auth',
      title: 'Iniciar Sesión'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      layout: 'auth',
      title: 'Registro'
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: {
      requiresAuth: true,
      title: 'Perfil'
    }
  },
  {
    path: '/flights',
    name: 'flights',
    component: Flights,
    meta: {
      requiresAuth: true,
      title: 'Vuelos'
    }
  },
  {
    path: '/drones',
    name: 'drones',
    component: Drones,
    meta: {
      requiresAuth: true,
      title: 'Mis Drones'
    }
  },
  {
    path: '/followers',
    name: 'followers',
    component: Followers,
    meta: {
      requiresAuth: true,
      title: 'Seguidores'
    }
  },
  {
    path: '/following',
    name: 'following',
    component: Following,
    meta: {
      requiresAuth: true,
      title: 'Siguiendo'
    }
  },
  {
    path: '/dashboard/:username',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      title: 'Dashboard'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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