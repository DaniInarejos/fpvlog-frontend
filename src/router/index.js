import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

// Añadir estas propiedades adicionales a las rutas más importantes:
const routes = [
  {
    path: '/',
    name: 'landing',
    component: () => import('../views/LandingView.vue'),
    meta: {
      title: 'SkySphere - Plataforma Social para Pilotos FPV',
      description: 'Bienvenido a SkySphere, la plataforma social para pilotos de drones FPV. Conecta con otros pilotos, comparte tus vuelos y descubre nuevos spots.',
      ogImage: '/images/logoSkySphere.png'
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/HomeView.vue'), 
    meta: {
      requiresAuth: true,
      title: 'Inicio',
      description: 'Panel de control personal en SkySphere.',
      ogImage: '/images/logoSkySphere.png'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'), 
    meta: {
      layout: 'auth',
      title: 'Iniciar Sesión',
      description: 'Inicia sesión en SkySphere para conectar con otros pilotos de drones FPV y compartir tus experiencias de vuelo.',
      ogImage: '/images/logoSkySphere.png'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'), 
    meta: {
      layout: 'auth',
      title: 'Registro',
      description: 'Únete a la comunidad de SkySphere. Regístrate gratis para compartir tus experiencias con drones FPV y conectar con otros pilotos.',
      ogImage: '/images/logoSkySphere.png'
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'), 
    meta: {
      requiresAuth: true,
      title: 'Perfil',
      description: 'Gestiona tu perfil de piloto en SkySphere',
      ogImage: '/images/logoSkySphere.png'
    }
  },
  {
    path: '/flights',
    name: 'flights',
    component: () => import('../views/FlightView.vue'), 
    meta: {
      requiresAuth: true,
      title: 'Vuelos',
      description: 'Explora y gestiona tus vuelos de drones FPV',
      ogImage: '/images/logoSkySphere.png'
    }
  },
  {
    path: '/drones',
    name: 'drones',
    component: () => import('../views/DroneView.vue'), 
    meta: {
      requiresAuth: true,
      title: 'Mis Drones',
      description: 'Gestiona tu colección de drones FPV',
      ogImage: '/images/logoSkySphere.png'
    }
  },
  {
    path: '/followers',
    name: 'followers',
    component: () => import('../views/FollowersView.vue'), 
    meta: {
      requiresAuth: true,
      title: 'Seguidores',
      description: 'Descubre quién te sigue en la comunidad de SkySphere',
      ogImage: '/images/logoSkySphere.png'
    }
  },
  {
    path: '/following',
    name: 'following',
    component: () => import('../views/FollowingView.vue'), 
    meta: {
      requiresAuth: true,
      title: 'Siguiendo',
      description: 'Gestiona a los pilotos que sigues en SkySphere',
      ogImage: '/images/logoSkySphere.png'
    }
  },
  {
    path: '/dashboard/:username',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: {
      title: 'Dashboard',
      description: 'Panel de control del piloto - Explora drones, vuelos y actividad',
      ogImage: '/images/logoSkySphere.png'
    }
  },
   {
    path: '/feed',
    name: 'feed',
    component: () => import('../views/FeedView.vue'), 
    meta: {
      title: 'Feed',
      description: 'Descubre las últimas novedades de la comunidad de pilotos FPV',
      ogImage: '/images/logoSkySphere.png'
    }
  },{
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue'), 
    meta: {
      title: 'Acerca de',
      description: 'Conoce más sobre SkySphere, la plataforma social para pilotos de drones FPV',
      ogImage: '/images/logoSkySphere.png'
    }
  },
  {
    path: '/components',
    name: 'components',
    component: () => import('../views/ComponentsView.vue'), 
    meta: {
      requiresAuth: true,
      title: 'Componentes',
      description: 'Explora y gestiona componentes para tus drones FPV',
      ogImage: '/images/logoSkySphere.png'
    }
  },
  {
    path: '/spots',
    name: 'spots',
    component: () => import('../views/SpotView.vue'), 
    meta: {
      requiresAuth: true,
      title: 'Spots',
      description: 'Descubre y comparte los mejores lugares para volar drones FPV',
      ogImage: '/images/logoSkySphere.png'
    }
  },
  {
    path: '/groups',
    name: 'groups',
    component: () => import('../views/GroupsView.vue'), 
    meta: {
      requiresAuth: true,
      title: 'Grupos',
      description: 'Únete a grupos de pilotos FPV y participa en discusiones',
      ogImage: '/images/logoSkySphere.png'
    }
  },
  {
    path: '/groups/:id',
    name: 'group-detail',
    component: () => import('../views/GroupDetailView.vue'), 
    meta: {
      requiresAuth: true,
      title: 'Grupo',
      description: 'Participa en discusiones y conecta con otros miembros del grupo',
      ogImage: '/images/logoSkySphere.png'
    }
  },
  {
    path: '/groups/:groupId/topics/:topicId',
    name: 'topic-detail',
    component: () => import('../views/TopicDetailView.vue'), 
    meta: {
      requiresAuth: true,
      title: 'Topic',
      description: 'Participa en la conversación sobre este tema específico',
      ogImage: '/images/logoSkySphere.png'
    }
  },
  {
    path: '/feedSpots',
    name: 'spotsMap',
    component: () => import('../views/SpotsMapView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Mapa de Spots',
      description: 'Explora spots de vuelo en el mapa interactivo',
      ogImage: '/images/logoSkySphere.png'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('../views/TermsView.vue'),
    meta: {
      title: 'Términos y Condiciones',
      description: 'Lee los términos y condiciones de uso de SkySphere',
      ogImage: '/images/logoSkySphere.png'
    }
  }
]

const router = createRouter({
  history: createWebHistory('/'),//createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Si hay una posición guardada (por ejemplo, al usar el botón atrás del navegador)
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    return { top: 0, behavior: 'smooth' }
  }
})

// Navegación protegida
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // Esperar a que se inicialice la autenticación
  await userStore.initAuth()

if (to.path === '/' && userStore.isAuthenticated) {
  // Si está autenticado y va a la landing, redirigir al dashboard
  next(`/dashboard/${userStore.user.username}`)
}  else {
  next()
}
})



export default router