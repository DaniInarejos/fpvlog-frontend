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
import About from '../views/About.vue'
import Feed from '../views/FeedView.vue'
import Components from '../views/ComponentsView.vue'
import Spots from '../views/SpotView.vue'
import Groups from '../views/GroupsView.vue'
import GroupDetail from '../views/GroupDetailView.vue'
import TopicDetail from '../views/TopicDetailView.vue'

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
      title: 'Dashboard'
    }
  },
   {
    path: '/feed',
    name: 'feed',
    component: Feed,
    meta: {
      title: 'Feed'
    }
  },{
    path: '/about',
    name: 'about',
    component: About,
    meta: {
      title: 'Acerca de'
    }
  },
  {
    path: '/components',
    name: 'components',
    component: Components,
    meta: {
      requiresAuth: true,
      title: 'Componentes'
    }
  },
  {
    path: '/spots',
    name: 'spots',
    component: Spots, 
    meta: {
      requiresAuth: true,
      title: 'Spots'
    }
  },
  {
    path: '/groups',
    name: 'groups',
    component: Groups,
    meta: {
      requiresAuth: true,
      title: 'Grupos'
    }
  },
  {
    path: '/groups/:id',
    name: 'group-detail',
    component: GroupDetail,
    meta: {
      requiresAuth: true,
      title: 'Grupo'
    }
  },
  {
    path: '/groups/:groupId/topics/:topicId',
    name: 'topic-detail',
    component: TopicDetail,
    meta: {
      requiresAuth: true,
      title: 'Topic'
    }
  },
  {
    path: '/feedSpots',
    name: 'spotsMap',
    component: () => import('../views/SpotsMapView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Mapa de Spots'
    }
  },
  {
  path: '/:pathMatch(.*)*',
  redirect: '/'
},
{
  path: '/terms',
  name: 'terms',
  component: () => import('../views/TermsView.vue')
}
]

const router = createRouter({
  history: createWebHistory('/'),//createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navegación protegida
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isDashboard = to.name === 'dashboard'

  // Esperar a que se inicialice la autenticación
  await userStore.initAuth()

  if (to.path === '/') {
    if (!userStore.isAuthenticated) {
      next('/login')
    } else {
      next(`/dashboard/${userStore.user.username}`)
    }
  } else if (requiresAuth && !userStore.isAuthenticated && !isDashboard) {
    next('/login')
  } else {
    next()
  }
})

export default router