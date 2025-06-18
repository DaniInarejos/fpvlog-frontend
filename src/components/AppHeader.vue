<template>
  <header class="dashboard-header">
    <div class="header-brand">
      <img src="/logo.png" alt="FPV Log" class="app-logo" />
      <h1>FPV Log</h1>
    </div>
    <div class="user-info">
      <span v-if="authStore.user">Bienvenido, {{ authStore.user.username }}</span>
      <div class="settings-menu" ref="settingsMenu">
        <button 
          @click="toggleMenu" 
          class="settings-gear"
          :class="{ 'rotating': isRotating }"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2569 9.77251 19.9859C9.5799 19.7148 9.31074 19.5063 9 19.38C8.69838 19.2469 8.36381 19.2072 8.03941 19.266C7.71502 19.3248 7.41568 19.4795 7.18 19.71L7.12 19.77C6.93425 19.956 6.71368 20.1035 6.47088 20.2041C6.22808 20.3048 5.96783 20.3566 5.705 20.3566C5.44217 20.3566 5.18192 20.3048 4.93912 20.2041C4.69632 20.1035 4.47575 19.956 4.29 19.77C4.10405 19.5843 3.95653 19.3637 3.85588 19.1209C3.75523 18.8781 3.70343 18.6178 3.70343 18.355C3.70343 18.0922 3.75523 17.8319 3.85588 17.5891C3.95653 17.3463 4.10405 17.1257 4.29 16.94L4.35 16.88C4.58054 16.6443 4.73519 16.345 4.794 16.0206C4.85282 15.6962 4.81312 15.3616 4.68 15.06C4.55324 14.7642 4.34276 14.512 4.07447 14.3343C3.80618 14.1566 3.49179 14.0613 3.17 14.06H3C2.46957 14.06 1.96086 13.8493 1.58579 13.4742C1.21071 13.0991 1 12.5904 1 12.06C1 11.5296 1.21071 11.0209 1.58579 10.6458C1.96086 10.2707 2.46957 10.06 3 10.06H3.09C3.42099 10.0523 3.742 9.94512 4.01309 9.75251C4.28417 9.5599 4.49268 9.29074 4.62 8.98C4.75312 8.67838 4.79282 8.34381 4.734 8.01941C4.67519 7.69502 4.52054 7.39568 4.29 7.16L4.23 7.1C4.04405 6.91425 3.89653 6.69368 3.79588 6.45088C3.69523 6.20808 3.64343 5.94783 3.64343 5.685C3.64343 5.42217 3.69523 5.16192 3.79588 4.91912C3.89653 4.67632 4.04405 4.45575 4.23 4.27C4.41575 4.08405 4.63632 3.93653 4.87912 3.83588C5.12192 3.73523 5.38217 3.68343 5.645 3.68343C5.90783 3.68343 6.16808 3.73523 6.41088 3.83588C6.65368 3.93653 6.87425 4.08405 7.06 4.27L7.12 4.33C7.35568 4.56054 7.65502 4.71519 7.97941 4.774C8.30381 4.83282 8.63838 4.79312 8.94 4.66H9C9.29577 4.53324 9.54802 4.32276 9.72569 4.05447C9.90337 3.78618 9.99872 3.47179 10 3.15V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <!-- En la sección del dropdown-menu -->
        <div class="dropdown-menu" :class="{ 'show': showMenu }">
          <button 
            v-if="$route.name !== 'Dashboard'" 
            @click="navigateTo('/dashboard')" 
            class="menu-item"
          >
            Dashboard
          </button>
          <button 
            v-if="$route.name !== 'UserDrones'" 
            @click="navigateTo('/my-drones')" 
            class="menu-item"
          >
            Mis Drones
          </button>
          <button 
            v-if="$route.name !== 'UserFlights'" 
            @click="navigateTo('/my-flights')" 
            class="menu-item"
          >
            Mis Vuelos
          </button>
          <button 
            v-if="$route.name !== 'DroneManagement'" 
            @click="navigateTo('/drone-management')" 
            class="menu-item"
          >
            Gestión de Drones
          </button>
          <button 
            v-if="$route.name !== 'Profile'" 
            @click="navigateTo('/profile')" 
            class="menu-item"
          >
            Mi Perfil
          </button>
          <button @click="handleLogout" class="menu-item logout">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const showMenu = ref(false)
const isRotating = ref(false)
const settingsMenu = ref(null)

const toggleMenu = () => {
  isRotating.value = true
  showMenu.value = !showMenu.value
  
  // Detener la animación después de una vuelta completa
  setTimeout(() => {
    isRotating.value = false
  }, 500)
}

const navigateTo = (path) => {
  router.push(path)
  showMenu.value = false
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
    showMenu.value = false
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

// Cerrar menú al hacer clic fuera
const handleClickOutside = (event) => {
  if (settingsMenu.value && !settingsMenu.value.contains(event.target)) {
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
@import '../assets/styles/dashboard-header.css';

/* Estilos para el menú de configuración */
.settings-menu {
  position: relative;
}

.settings-gear {
  background: transparent;
  border: 2px solid var(--sky-primary);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--sky-primary);
}

.settings-gear:hover {
  background: var(--sky-primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.settings-gear.rotating {
  animation: rotate360 0.5s ease-in-out;
}

@keyframes rotate360 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(116, 185, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(116, 185, 255, 0.2);
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1000;
  margin-top: 0.5rem;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.menu-item {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  text-align: left;
  color: var(--sky-text);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 0.25rem;
}

.menu-item:hover {
  background: rgba(59, 130, 246, 0.1);
  color: var(--sky-primary);
  transform: translateX(4px);
}

.menu-item.logout {
  color: var(--sky-error);
  border-top: 1px solid rgba(116, 185, 255, 0.2);
  margin-top: 0.5rem;
  border-radius: 0 0 8px 8px;
}

.menu-item.logout:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

/* Responsive design */
@media (max-width: 768px) {
  .settings-gear {
    width: 40px;
    height: 40px;
  }
  
  .dropdown-menu {
    min-width: 180px;
    right: -10px;
  }
}
</style>