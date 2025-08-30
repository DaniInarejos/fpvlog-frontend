<template>
  <div class="landing-container">
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="floating-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
        <div class="orb orb-4"></div>
      </div>
      <div class="grid-overlay"></div>
    </div>

    <!-- Navigation -->
    <nav class="futuristic-nav">
      <div class="nav-container">
        <div class="logo-section" @click="scrollToTop" style="cursor: pointer;">
          <img src="/images/logoSkySphere.png" alt="SkySphere" class="logo" />
          <span class="logo-text">SkySphere</span>
        </div>
        
        <!-- Mobile Menu Toggle -->
        <button class="mobile-menu-toggle" @click="toggleMobileMenu" v-show="isMobile">
          <span class="hamburger-line" :class="{ active: showMobileMenu }"></span>
          <span class="hamburger-line" :class="{ active: showMobileMenu }"></span>
          <span class="hamburger-line" :class="{ active: showMobileMenu }"></span>
        </button>
        
        <!-- Desktop Navigation -->
        <div class="nav-links" :class="{ 'mobile-nav-open': showMobileMenu }">
          <button @click="showLoginModal = true; closeMobileMenu()" class="nav-link">{{ $t('navbar.login') }}</button>
          <button @click="showRegisterModal = true; closeMobileMenu()" class="nav-link nav-link-primary">{{ $t('navbar.register') }}</button>
          <router-link to="/about" class="nav-link" @click="closeMobileMenu()">{{ $t('navbar.about') }}</router-link>
          <!-- Language Selector moved after About -->
          <button @click="toggleLanguage" class="nav-link language-btn">
            {{ locale === 'es' ? 'ES' : 'EN' }}
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-text">🚁 {{ $t('landing.hero.badge') }}</span>
        </div>
        <h1 class="hero-title">
          <span class="gradient-text">{{ $t('landing.hero.title') }}</span>
          <br>
        </h1>
        <p class="hero-description">{{ $t('landing.hero.subtitle') }}</p>
        
        <div class="hero-actions">
          <button @click="showRegisterModal = true" class="btn-primary">
            <span>{{ $t('landing.hero.cta_primary') }}</span>
            <div class="btn-glow"></div>
          </button>
          <router-link to="/about" class="btn-secondary">
            <span>{{ $t('landing.hero.cta_secondary') }}</span>
          </router-link>
        </div>

        <!-- Drone Showcase -->
        <div class="drone-showcase">
          <div class="drone-container" :class="{ 'mobile-scroll': isMobile }">
            <div class="drone-card active" v-for="(drone, index) in drones" :key="index" :style="{animationDelay: index * 0.2 + 's'}">
              <div class="drone-image">
                <img :src="drone.image" :alt="drone.name" />
                <div class="hologram-effect"></div>
              </div>
              <div class="drone-info">
                <h3>{{ drone.name }}</h3>
                <p>{{ drone.type }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title gradient-text">{{ $t('landing.features.title') }}</h2>
          <p class="section-subtitle">{{ $t('landing.features.subtitle') }}</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card" v-for="(feature, index) in features" :key="index">
            <div class="feature-icon">
              <i :class="feature.icon"></i>
              <div class="icon-glow"></div>
            </div>
            <h3 class="feature-title">{{ $t(`landing.features.items.${feature.key}.title`) }}</h3>
            <p class="feature-description">{{ $t(`landing.features.items.${feature.key}.description`) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
 <!--  <section class="stats-section">
      <div class="section-container">
        <div class="stats-grid">
          <div class="stat-card" v-for="(stat, index) in stats" :key="index">
            <div class="stat-number">
              <span>0</span>
              <span class="stat-suffix">{{ stat.suffix }}</span>
            </div>
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-glow"></div>
          </div>
        </div>
      </div>
    </section>
  -->
    <!-- CTA Section -->
    <section class="cta-section">
      <div class="section-container">
        <div class="cta-content">
          <h2 class="cta-title gradient-text">{{ $t('landing.cta.title') }}</h2>
          <p class="cta-description">{{ $t('landing.cta.description') }}</p>
          <div class="cta-actions">
            <button @click="showRegisterModal = true" class="btn-primary btn-large">
              <span>{{ $t('landing.cta.button') }}</span>
              <div class="btn-glow"></div>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="futuristic-footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-logo">
            <img src="/images/logoSkySphere.png" alt="SkySphere" class="logo" />
            <span class="logo-text">SkySphere</span>
          </div>
          <div class="footer-links">
            <router-link to="/about" class="footer-link">{{ $t('navbar.about') }}</router-link>
            <router-link to="/terms" class="footer-link">{{ $t('landing.footer.terms') }}</router-link>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 SkySphere. {{ $t('landing.footer.rights') }}</p>
        </div>
      </div>
    </footer>

    <!-- Modal de Login -->
    <div v-if="showLoginModal" class="login-modal-overlay" @click="closeLoginModal">
      <div class="login-modal-container" @click.stop>
        <div class="login-modal-header">
          <h2 class="login-modal-title gradient-text">{{ $t('landing.modals.login.title') }}</h2>
          <button @click="closeLoginModal" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="login-modal-content">
          <p class="login-modal-subtitle">
            {{ $t('landing.modals.login.subtitle') }}
          </p>
          
          <form @submit.prevent="handleLoginSubmit" class="login-modal-form">
            <div v-if="loginErrors.submit" class="error-alert">
              {{ loginErrors.submit }}
            </div>
            <div v-if="showLoginSuccessAlert" class="success-alert">
              {{ $t('landing.modals.login.success') }}
            </div>

            <div class="form-group">
              <label for="loginEmail" class="form-label">{{ $t('landing.modals.login.email') }}</label>
              <input
                id="loginEmail"
                v-model="loginForm.email"
                type="text"
                class="form-input"
                :class="{ 'error': loginErrors.email }"
                :placeholder="$t('landing.modals.login.emailPlaceholder')"
                required
              />
              <span v-if="loginErrors.email" class="error-text">{{ loginErrors.email }}</span>
            </div>

            <div class="form-group">
              <label for="loginPassword" class="form-label">{{ $t('landing.modals.login.password') }}</label>
              <input
                id="loginPassword"
                v-model="loginForm.password"
                type="password"
                class="form-input"
                :class="{ 'error': loginErrors.password }"
                :placeholder="$t('landing.modals.login.passwordPlaceholder')"
                required
              />
              <span v-if="loginErrors.password" class="error-text">{{ loginErrors.password }}</span>
            </div>

            <div class="submit-section">
              <button
                type="submit"
                :disabled="isLoginLoading"
                class="login-submit-button"
              >
                <span v-if="!isLoginLoading">{{ $t('landing.modals.login.submit') }}</span>
                <span v-else>{{ $t('landing.modals.login.loading') }}</span>
                <div class="btn-glow"></div>
              </button>
            </div>
          </form>
          
          <p class="register-link">
            {{ $t('landing.modals.login.noAccount') }}
            <button @click="switchToRegister" class="link-primary">
              {{ $t('landing.modals.login.registerLink') }}
            </button>
          </p>
        </div>
      </div>
    </div>

    <!-- Modal de Registro -->
    <div v-if="showRegisterModal" class="register-modal-overlay" @click="closeRegisterModal">
      <div class="register-modal-container" @click.stop>
        <div class="register-modal-header">
          <h2 class="register-modal-title gradient-text">{{ $t('landing.modals.register.title') }}</h2>
          <button @click="closeRegisterModal" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="register-modal-content">
          <p class="register-modal-subtitle">
            {{ $t('landing.modals.register.subtitle') }}
          </p>
          
          <form @submit.prevent="handleRegisterSubmit" class="register-modal-form">
            <div v-if="registerErrors.submit" class="error-alert">
              {{ registerErrors.submit }}
            </div>
            <div v-if="showSuccessAlert" class="success-alert">
              {{ $t('landing.modals.register.success') }}
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label for="username" class="form-label">{{ $t('landing.modals.register.username') }}</label>
                <input
                  id="username"
                  v-model="registerForm.username"
                  type="text"
                  class="form-input"
                  :class="{ 'error': registerErrors.username }"
                  required
                />
                <span v-if="registerErrors.username" class="error-text">{{ registerErrors.username }}</span>
              </div>

              <div class="form-group">
                <label for="email" class="form-label">{{ $t('landing.modals.register.email') }}</label>
                <input
                  id="email"
                  v-model="registerForm.email"
                  type="email"
                  class="form-input"
                  :class="{ 'error': registerErrors.email }"
                  required
                />
                <span v-if="registerErrors.email" class="error-text">{{ registerErrors.email }}</span>
              </div>

              <div class="form-group">
                <label for="name" class="form-label">{{ $t('landing.modals.register.name') }}</label>
                <input
                  id="name"
                  v-model="registerForm.name"
                  type="text"
                  class="form-input"
                  :class="{ 'error': registerErrors.name }"
                  required
                />
                <span v-if="registerErrors.name" class="error-text">{{ registerErrors.name }}</span>
              </div>

              <div class="form-group">
                <label for="lastName" class="form-label">{{ $t('landing.modals.register.lastName') }}</label>
                <input
                  id="lastName"
                  v-model="registerForm.lastName"
                  type="text"
                  class="form-input"
                  :class="{ 'error': registerErrors.lastName }"
                  required
                />
                <span v-if="registerErrors.lastName" class="error-text">{{ registerErrors.lastName }}</span>
              </div>

              <div class="form-group">
                <label for="password" class="form-label">{{ $t('landing.modals.register.password') }}</label>
                <input
                  id="password"
                  v-model="registerForm.password"
                  type="password"
                  class="form-input"
                  :class="{ 'error': registerErrors.password }"
                  required
                />
                <span v-if="registerErrors.password" class="error-text">{{ registerErrors.password }}</span>
              </div>

              <div class="form-group">
                <label for="confirmPassword" class="form-label">{{ $t('landing.modals.register.confirmPassword') }}</label>
                <input
                  id="confirmPassword"
                  v-model="registerForm.confirmPassword"
                  type="password"
                  class="form-input"
                  :class="{ 'error': registerErrors.confirmPassword }"
                  required
                />
                <span v-if="registerErrors.confirmPassword" class="error-text">{{ registerErrors.confirmPassword }}</span>
              </div>
            </div>

            <div class="terms-section">
              <div class="checkbox-container">
                <input
                  id="terms"
                  v-model="acceptTerms"
                  type="checkbox"
                  class="custom-checkbox"
                  required
                />
                <label for="terms" class="checkbox-label">
                  {{ $t('landing.modals.register.acceptTerms') }}
                  <button
                    type="button"
                    @click="showTermsModal = true"
                    class="terms-link"
                  >
                    {{ $t('landing.modals.register.termsLink') }}
                  </button>
                </label>
              </div>
            </div>

            <div class="submit-section">
              <button
                type="submit"
                :disabled="isRegisterLoading || !acceptTerms"
                class="register-submit-button"
              >
                <span v-if="!isRegisterLoading">{{ $t('landing.modals.register.submit') }}</span>
                <span v-else>{{ $t('landing.modals.register.loading') }}</span>
                <div class="btn-glow"></div>
              </button>
            </div>
          </form>
          
          <p class="login-link">
            {{ $t('landing.modals.register.hasAccount') }}
            <button @click="switchToLogin" class="link-primary">
              {{ $t('landing.modals.register.loginLink') }}
            </button>
          </p>
        </div>
      </div>
    </div>

    <!-- Modal de Términos y Condiciones -->
    <div v-if="showTermsModal" class="terms-modal-overlay" @click="showTermsModal = false">
      <div class="terms-modal-container" @click.stop>
        <div class="terms-modal-header">
          <h2 class="terms-modal-title gradient-text">{{ $t('terms.title') }}</h2>
          <button @click="showTermsModal = false" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="terms-modal-content">
          <p class="terms-modal-subtitle">{{ $t('terms.lastUpdated') }}: {{ $t('terms.updateDate') }}</p>
          
          <div class="terms-sections">
            <div v-for="section in ['definitions', 'registration', 'content', 'affiliates', 'privacy', 'liability', 'offers', 'modifications']" :key="section" class="terms-card">
              <h3 class="section-title">{{ $t(`terms.${section}.title`) }}</h3>
              <div class="section-content">
                <template v-if="section === 'definitions'">
                  <h4>{{ $t('terms.definitions.user') }}</h4>
                  <p>{{ $t('terms.definitions.userDesc') }}</p>
                  <h4>{{ $t('terms.definitions.fpvPilot') }}</h4>
                  <p>{{ $t('terms.definitions.fpvPilotDesc') }}</p>
                  <h4>{{ $t('terms.definitions.content') }}</h4>
                  <p>{{ $t('terms.definitions.contentDesc') }}</p>
                  <h4>{{ $t('terms.definitions.services') }}</h4>
                  <p>{{ $t('terms.definitions.servicesDesc') }}</p>
                </template>
                <template v-else-if="section === 'registration'">
                  <h4>{{ $t('terms.registration.requirements') }}</h4>
                  <p>{{ $t('terms.registration.requirementsDesc') }}</p>
                  <h4>{{ $t('terms.registration.verification') }}</h4>
                  <p>{{ $t('terms.registration.verificationDesc') }}</p>
                </template>
                <template v-else-if="section === 'content'">
                  <h4>{{ $t('terms.content.rules') }}</h4>
                  <p>{{ $t('terms.content.rulesDesc') }}</p>
                  <h4>{{ $t('terms.content.safety') }}</h4>
                  <p>{{ $t('terms.content.safetyDesc') }}</p>
                </template>
                <template v-else-if="section === 'affiliates'">
                  <h4>{{ $t('terms.affiliates.disclosure') }}</h4>
                  <p>{{ $t('terms.affiliates.disclosureDesc') }}</p>
                  <h4>{{ $t('terms.affiliates.commission') }}</h4>
                  <p>{{ $t('terms.affiliates.commissionDesc') }}</p>
                </template>
                <template v-else-if="section === 'privacy'">
                  <h4>{{ $t('terms.privacy.data') }}</h4>
                  <p>{{ $t('terms.privacy.dataDesc') }}</p>
                  <h4>{{ $t('terms.privacy.location') }}</h4>
                  <p>{{ $t('terms.privacy.locationDesc') }}</p>
                </template>
                <template v-else-if="section === 'liability'">
                  <h4>{{ $t('terms.liability.disclaimer') }}</h4>
                  <p>{{ $t('terms.liability.disclaimerDesc') }}</p>
                  <h4>{{ $t('terms.liability.compliance') }}</h4>
                  <p>{{ $t('terms.liability.complianceDesc') }}</p>
                </template>
                <template v-else-if="section === 'offers'">
                  <h4>{{ $t('terms.offers.conditions') }}</h4>
                  <p>{{ $t('terms.offers.conditionsDesc') }}</p>
                  <h4>{{ $t('terms.offers.validity') }}</h4>
                  <p>{{ $t('terms.offers.validityDesc') }}</p>
                </template>
                <template v-else-if="section === 'modifications'">
                  <h4>{{ $t('terms.modifications.changes') }}</h4>
                  <p>{{ $t('terms.modifications.changesDesc') }}</p>
                  <h4>{{ $t('terms.modifications.termination') }}</h4>
                  <p>{{ $t('terms.modifications.terminationDesc') }}</p>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div class="terms-modal-footer">
          <button @click="showTermsModal = false" class="terms-close-button">
            <span>Cerrar</span>
            <div class="btn-glow"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const { t, locale } = useI18n()
const router = useRouter()
const userStore = useUserStore()

// Mobile responsiveness
const isMobile = ref(false)
const showMobileMenu = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) {
    showMobileMenu.value = false
  }
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

// Datos reactivos para la landing page
const drones = ref([
  {
    name: 'Spots',
    type: 'Conoce Spots',
    image: '/images/playa.jpg'
  },
  {
    name: 'Grupos',
    type: 'Haz comunidad', 
    image: '/images/grupos.png'
  },
  {
    name: 'Drones',
    type: 'Registra tus drones',
    image: '/images/drones.jpg'
  },
  {
    name: 'Perfil',
    type: 'Personaliza tu perfil',
    image: '/images/perfil.jpg '
  },
  {
    name: 'Componentes',
    type: 'Organiza componentes',
    image: '/images/motor.jpg'
  },
])

const features = ref([
  {
    key: 'tracking',
    icon: 'fas fa-map-marker-alt'
  },
  {
    key: 'community',
    icon: 'fas fa-users'
  },
  {
    key: 'analytics',
    icon: 'fas fa-chart-line'
  },
  {
    key: 'safety',
    icon: 'fas fa-shield-alt'
  }
])

const stats = ref([
  {
    number: 5,
    suffix: '+',
    label: 'Pilotos Activos'
  },
  {
    number: 5000,
    suffix: '+',
    label: 'Vuelos Registrados'
  },
  {
    number: 200,
    suffix: '+',
    label: 'Spots Descubiertos'
  },
  {
    number: 50,
    suffix: '+',
    label: 'Países'
  }
])


// Modal states
const showRegisterModal = ref(false)
const showLoginModal = ref(false)
const showTermsModal = ref(false)
const acceptTerms = ref(false)

// Login form data
const loginForm = ref({
  email: '',
  password: ''
})

const loginErrors = ref({})
const isLoginLoading = ref(false)
const showLoginSuccessAlert = ref(false)

// Register form data
const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  lastName: '',
  privacySettings: {
    allowFollowersToSeeFlights: true,
    allowFollowersToSeeDrones: true,
    profileVisibility: 'public'
  }
})

const registerErrors = ref({})
const isRegisterLoading = ref(false)
const showSuccessAlert = ref(false)

// Register form validation
const validateRegisterForm = () => {
  registerErrors.value = {}
  if (!registerForm.value.username) registerErrors.value.username = 'El nombre de usuario es requerido'
  if (!registerForm.value.name) registerErrors.value.name = 'El nombre es requerido'
  if (!registerForm.value.lastName) registerErrors.value.lastName = 'El apellido es requerido'
  if (!registerForm.value.email) registerErrors.value.email = 'El email es requerido'
  if (!registerForm.value.password) registerErrors.value.password = 'La contraseña es requerida'
  if (registerForm.value.password.length < 6) registerErrors.value.password = 'La contraseña debe tener al menos 6 caracteres'
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    registerErrors.value.confirmPassword = 'Las contraseñas no coinciden'
  }
  return Object.keys(registerErrors.value).length === 0
}

// Handle login form submission
const handleLoginSubmit = async () => {
  if (!validateLoginForm()) return
  
  isLoginLoading.value = true
  loginErrors.value = {} 
  
  try {
    const result = await userStore.login({
      email: loginForm.value.email.toLowerCase().trim(),
      password: loginForm.value.password
    })
    
    if (result.success) {
      showLoginSuccessAlert.value = true
      setTimeout(() => {
        closeLoginModal()
        // Redirigir al dashboard del usuario autenticado
        const username = userStore.user?.username
        if (username) {
          router.push(`/dashboard/${username}`)
        } else {
          router.push('/dashboard')
        }
      }, 1500)
    } else {
      loginErrors.value.submit = result.error || 'Error al iniciar sesión'
    }
  } catch (error) {
    console.error('Error en login:', error)
    loginErrors.value.submit = error.message || 'Error al iniciar sesión'
  } finally {
    isLoginLoading.value = false
  }
}

// Login form validation
const validateLoginForm = () => {
  loginErrors.value = {}
  if (!loginForm.value.email) loginErrors.value.email = 'El email o nombre de usuario es requerido'
  if (!loginForm.value.password) loginErrors.value.password = 'La contraseña es requerida'
  return Object.keys(loginErrors.value).length === 0
}

// Close login modal
const closeLoginModal = () => {
  showLoginModal.value = false
  loginForm.value = {
    email: '',
    password: ''
  }
  loginErrors.value = {}
  showLoginSuccessAlert.value = false
}

// Switch between modals
const switchToRegister = () => {
  closeLoginModal()
  showRegisterModal.value = true
}

const switchToLogin = () => {
  closeRegisterModal()
  showLoginModal.value = true
}

// Handle register form submission
const handleRegisterSubmit = async () => {
  if (!validateRegisterForm()) return
  
  isRegisterLoading.value = true
  registerErrors.value = {} // Limpiar errores previos
  
  try {
    const result = await userStore.register({
      username: registerForm.value.username,
      email: registerForm.value.email.toLowerCase().trim(),
      password: registerForm.value.password,
      name: registerForm.value.name,
      lastName: registerForm.value.lastName,
      privacySettings: registerForm.value.privacySettings
    })
    console.log(result)
    if (result.success) {
      showSuccessAlert.value = true
      setTimeout(() => {
        closeRegisterModal()
        router.push('/login')
      }, 2000)
    } else {
      // Mostrar el mensaje de error específico del servidor
      registerErrors.value.submit = result.error
    }
  } catch (error) {
    console.error('Error en registro:', error)
    // Extraer mensaje de error del servidor
    let errorMessage = 'Error al registrar usuario'
    
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error
    } else if (error.message) {
      errorMessage = error.message
    }
    
    registerErrors.value.submit = errorMessage
  } finally {
    isRegisterLoading.value = false
  }
}

// Close register modal
const closeRegisterModal = () => {
  showRegisterModal.value = false
  // Reset form
  registerForm.value = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    lastName: '',
    privacySettings: {
      allowFollowersToSeeFlights: true,
      allowFollowersToSeeDrones: true,
      profileVisibility: 'public'
    }
  }
  registerErrors.value = {}
  showSuccessAlert.value = false
  acceptTerms.value = false
}

// Scroll to top function
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Función para animar contadores
const animateCounters = () => {
  const statCards = document.querySelectorAll('.stat-card')
  
  statCards.forEach((card, index) => {
    const numberElement = card.querySelector('.stat-number')
    if (!numberElement) return
    
    const targetNumber = stats.value[index]?.number || 0
    const suffix = stats.value[index]?.suffix || ''
    let currentNumber = 0
    const increment = targetNumber / 50
    
    const timer = setInterval(() => {
      currentNumber += increment
      if (currentNumber >= targetNumber) {
        currentNumber = targetNumber
        clearInterval(timer)
      }
      numberElement.textContent = Math.floor(currentNumber) + suffix
    }, 40)
  })
}

// Función para efecto de escritura
const initTypingEffect = () => {
  const typingElement = document.querySelector('.typing-effect')
  if (!typingElement) return
  
  const texts = [
    'Conecta con pilotos',
    'Descubre nuevos spots',
    'Comparte tus vuelos',
    'Vive la experiencia FPV'
  ]
  
  let textIndex = 0
  let charIndex = 0
  let isDeleting = false
  
  const typeWriter = () => {
    const currentText = texts[textIndex]
    
    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, charIndex - 1)
      charIndex--
    } else {
      typingElement.textContent = currentText.substring(0, charIndex + 1)
      charIndex++
    }
    
    let typeSpeed = isDeleting ? 50 : 100
    
    if (!isDeleting && charIndex === currentText.length) {
      typeSpeed = 2000
      isDeleting = true
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false
      textIndex = (textIndex + 1) % texts.length
      typeSpeed = 500
    }
    
    setTimeout(typeWriter, typeSpeed)
  }
  
  typeWriter()
}

// Language switching - simplified
const toggleLanguage = () => {
  locale.value = locale.value === 'es' ? 'en' : 'es'
  localStorage.setItem('preferred-language', locale.value)
}

// Load saved language preference on mount
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  const savedLanguage = localStorage.getItem('preferred-language')
  if (savedLanguage && ['es', 'en'].includes(savedLanguage)) {
    locale.value = savedLanguage
  }
  // Initialize animations
  setTimeout(animateCounters, 1000)
  initTypingEffect()
  
  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
      }
    })
  })
  
  document.querySelectorAll('.feature-card, .stat-card').forEach(el => {
    observer.observe(el)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.language-selector {
  margin-right: 1rem;
}

.language-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.language-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.flag-icon {
  font-size: 1.2rem;
}

.lang-text {
  font-size: 0.875rem;
  font-weight: 600;
}

.landing-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  color: #ffffff;
  overflow-x: hidden;
  position: relative;
}

/* Animated Background */
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.floating-orbs {
  position: absolute;
  width: 100%;
  height: 100%;
}

.orb {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, transparent 70%);
  animation: float 6s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 200px;
  height: 200px;
  top: 60%;
  right: 10%;
  animation-delay: 2s;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%);
}

.orb-3 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%);
}

.orb-4 {
  width: 250px;
  height: 250px;
  top: 30%;
  right: 30%;
  animation-delay: 1s;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-30px) rotate(120deg); }
  66% { transform: translateY(30px) rotate(240deg); }
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

/* Navigation */
.futuristic-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(14, 165, 233, 0.2);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.logo-section:hover {
  transform: translateY(-2px);
  filter: drop-shadow(0 5px 15px rgba(14, 165, 233, 0.3));
}

.logo {
  width: 40px;
  height: 40px;
  filter: drop-shadow(0 0 10px rgba(14, 165, 233, 0.5));
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #0ea5e9, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: #ffffff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-link:hover {
  color: #0ea5e9;
  transform: translateY(-2px);
}

.nav-link-primary {
  background: linear-gradient(45deg, #0ea5e9, #6366f1);
  color: #000;
  font-weight: 600;
}

.nav-link-primary:hover {
  color: #000;
  box-shadow: 0 10px 30px rgba(14, 165, 233, 0.3);
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.hero-content {
  max-width: 1200px;
  width: 100%;
}

.hero-badge {
  display: inline-block;
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.3);
  border-radius: 50px;
  padding: 0.5rem 1.5rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.badge-text {
  color: #0ea5e9;
  font-size: 0.9rem;
  font-weight: 500;
}

.hero-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: linear-gradient(45deg, #0ea5e9, #6366f1, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
  animation: gradientShift 3s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.typing-effect {
  color: #ffffff;
}

.hero-description {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 4rem;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(45deg, #0ea5e9, #6366f1);
  color: #000;
  box-shadow: 0 10px 30px rgba(14, 165, 233, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(14, 165, 233, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.btn-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.btn-primary:hover .btn-glow {
  left: 100%;
}

.btn-large {
  padding: 1.25rem 3rem;
  font-size: 1.2rem;
}

/* Drone Showcase */
.drone-showcase {
  margin-top: 4rem;
}

.drone-container {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.drone-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: slideUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(50px);
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.drone-card:hover {
  transform: translateY(-10px);
  border-color: rgba(14, 165, 233, 0.5);
  box-shadow: 0 20px 40px rgba(14, 165, 233, 0.2);
}

.drone-image {
  position: relative;
  margin-bottom: 1rem;
}

.drone-image img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  filter: drop-shadow(0 0 20px rgba(14, 165, 233, 0.3));
}

.hologram-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(14, 165, 233, 0.1) 50%, transparent 70%);
  border-radius: 12px;
  animation: hologramScan 2s linear infinite;
}

@keyframes hologramScan {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.drone-info h3 {
  color: #0ea5e9;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.drone-info p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

/* Sections */
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 5rem 2rem; /* Aumentado de 4rem a 5rem */
}

.section-header {
  text-align: center;
  margin-bottom: 5rem; /* Aumentado de 4rem a 5rem */
  padding: 0 1rem; /* Añadido padding lateral */
}

.section-title {
  font-size: clamp(3rem, 6vw, 5rem); /* Aumentado de clamp(2.5rem, 5vw, 4rem) */
  font-weight: 700;
  margin-bottom: 2rem; /* Aumentado de 1rem a 2rem */
  line-height: 1.2; /* Añadido line-height para mejor espaciado */
  padding: 0 1rem; /* Añadido padding para evitar cortes en móviles */
}

.section-subtitle {
  font-size: 1.3rem; /* Aumentado de 1.2rem */
  color: rgba(255, 255, 255, 0.7);
  max-width: 700px; /* Aumentado de 600px */
  margin: 0 auto;
  line-height: 1.6; /* Añadido line-height */
  padding: 0 1rem; /* Añadido padding lateral */
}

/* Features Section */
.features-section {
  padding: 8rem 0; /* Aumentado de 6rem a 8rem */
  background: rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3rem 2rem;
  text-align: center;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
}

.feature-card.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.feature-card:hover {
  transform: translateY(-10px);
  border-color: rgba(14, 165, 233, 0.3);
  box-shadow: 0 20px 40px rgba(14, 165, 233, 0.1);
}

.feature-icon {
  position: relative;
  display: inline-block;
  margin-bottom: 2rem;
}

.feature-icon i {
  font-size: 3rem;
  color: #0ea5e9;
  position: relative;
  z-index: 2;
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.3; }
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #ffffff;
}

.feature-description {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

/* Stats Section */
.stats-section {
  padding: 6rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.stat-card {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(30px);
}

.stat-card.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: rgba(14, 165, 233, 0.4);
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  color: #0ea5e9;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
}

.stat-suffix {
  font-size: 2rem;
}

.stat-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  font-weight: 500;
}

.stat-glow {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #0ea5e9, transparent);
  animation: statGlow 2s ease-in-out infinite;
}

@keyframes statGlow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

/* CTA Section */
.cta-section {
  padding: 8rem 0; /* Aumentado de 6rem a 8rem */
  background: rgba(0, 0, 0, 0.5);
}

.cta-content {
  text-align: center;
  max-width: 900px; /* Aumentado de 800px a 900px */
  margin: 0 auto;
  padding: 0 2rem; /* Añadido padding lateral */
}

.cta-title {
  font-size: clamp(3rem, 6vw, 5rem); /* Aumentado el tamaño mínimo y máximo */
  font-weight: 700;
  margin-bottom: 2.5rem; /* Aumentado de 1.5rem a 2.5rem */
  line-height: 1.2; /* Añadido line-height para mejor espaciado */
  padding: 0 1rem; /* Añadido padding para evitar que se corte en móviles */
}

.cta-description {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 3.5rem; /* Aumentado de 3rem a 3.5rem */
  line-height: 1.6;
  max-width: 700px; /* Añadido max-width para mejor legibilidad */
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 3.5rem;
}

.cta-actions {
  display: flex;
  justify-content: center;
}

/* Footer */
.futuristic-footer {
  background: rgba(0, 0, 0, 0.8);
  border-top: 1px solid rgba(14, 165, 233, 0.2);
  padding: 3rem 0 1rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 2rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-links {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.footer-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #0ea5e9;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
}

/* Responsive Design */
/* Mobile Navigation Improvements */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1001;
}

.hamburger-line {
  width: 25px;
  height: 3px;
  background: #ffffff;
  margin: 3px 0;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.hamburger-line.active:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.hamburger-line.active:nth-child(2) {
  opacity: 0;
}

.hamburger-line.active:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Enhanced Mobile Responsive Design */
@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: flex;
  }
  
  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    height: 100vh;
    background: rgba(15, 23, 42, 0.98);
    backdrop-filter: blur(20px);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    transition: right 0.3s ease;
    border-left: 1px solid rgba(14, 165, 233, 0.3);
  }
  
  .nav-links.mobile-nav-open {
    right: 0;
  }
  
  .nav-link {
    font-size: 1.2rem;
    padding: 1rem 2rem;
    width: 200px;
    text-align: center;
    border-radius: 12px;
  }
  
  .language-btn {
    background: rgba(14, 165, 233, 0.2);
    border: 1px solid rgba(14, 165, 233, 0.4);
  }
  
  .nav-container {
    padding: 1rem;
  }
  
  .hero-section {
    padding: 1rem;
    min-height: 100vh;
  }
  
  .hero-title {
    font-size: clamp(2.5rem, 10vw, 4rem);
    margin-bottom: 1rem;
  }
  
  .hero-description {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    padding: 0 1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 3rem;
  }
  
  .btn-primary, .btn-secondary {
    width: 280px;
    max-width: 90vw;
    padding: 1.2rem 2rem;
    font-size: 1.1rem;
  }
  
  /* Mobile Drone Showcase */
  .drone-showcase {
    margin-top: 2rem;
    padding: 0 1rem;
  }
  
  .drone-container.mobile-scroll {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 1rem;
    padding: 1rem 0;
    -webkit-overflow-scrolling: touch;
  }
  
  .drone-container.mobile-scroll .drone-card {
    flex: 0 0 280px;
    scroll-snap-align: center;
  }
  
  .drone-card {
    padding: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .drone-image img {
    width: 100%;
    height: auto;
    max-width: 200px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .feature-card {
    padding: 2rem 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .section-container {
    padding: 2rem 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .footer-content {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: clamp(2rem, 12vw, 3rem);
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
    max-width: 320px;
  }
  
  .drone-container.mobile-scroll .drone-card {
    flex: 0 0 250px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .section-container {
    padding: 2rem 0.5rem;
  }
  
  .nav-links {
    width: 100vw;
    right: -100vw;
  }
  
  .nav-links.mobile-nav-open {
    right: 0;
  }
}

/* Touch-friendly improvements */
@media (hover: none) and (pointer: coarse) {
  .nav-link, .btn-primary, .btn-secondary {
    min-height: 44px;
    min-width: 44px;
  }
  
  .drone-card:hover {
    transform: none;
  }
  
  .drone-card:active {
    transform: scale(0.98);
  }
  
  .btn-primary:active, .btn-secondary:active {
    transform: scale(0.98);
  }
}

/* Improved Modal Responsiveness */
@media (max-width: 768px) {
  .register-modal-container,
  .terms-modal-container,
  .login-modal-container {
    margin: 1rem;
    max-width: calc(100% - 2rem);
    max-height: calc(100vh - 2rem);
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .register-modal-header,
  .terms-modal-header,
  .login-modal-header {
    padding: 1.5rem 1.5rem 1rem;
  }
  
  .register-modal-content,
  .terms-modal-content,
  .login-modal-content {
    padding: 1.5rem;
  }
  
  .form-group input,
  .form-group select {
    font-size: 16px; /* Prevents zoom on iOS */
    padding: 1rem;
  }
  
  .register-submit-button,
  .login-submit-button {
    padding: 1.2rem;
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .register-modal-container,
  .terms-modal-container,
  .login-modal-container {
    margin: 0.5rem;
    max-width: calc(100% - 1rem);
    border-radius: 16px;
  }
  
  .register-modal-header,
  .terms-modal-header,
  .login-modal-header {
    padding: 1rem 1rem 0.5rem;
  }
  
  .register-modal-title,
  .terms-modal-title,
  .login-modal-title {
    font-size: 1.5rem;
  }
  
  .register-modal-content,
  .terms-modal-content,
  .login-modal-content {
    padding: 1rem;
  }
}

/* Reduce animations on mobile for better performance */
@media (prefers-reduced-motion: reduce) {
  .orb, .grid-overlay, .gradient-text {
    animation: none;
  }
  
  .drone-card {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .section-container {
    padding: 3rem 1rem;
  }
}

/* Modal Styles */
.register-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.register-modal-container {
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(14, 165, 233, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.register-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.register-modal-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.register-modal-content {
  padding: 2rem;
}

.register-modal-subtitle {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  text-align: center;
  font-size: 1.1rem;
}

.register-modal-form {
  margin-bottom: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  background: rgba(255, 255, 255, 0.08);
}

.form-input.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.error-text {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.error-alert {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 1rem;
  color: #ef4444;
  margin-bottom: 1rem;
  text-align: center;
}

.success-alert {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 8px;
  padding: 1rem;
  color: #22c55e;
  margin-bottom: 1rem;
  text-align: center;
}

.terms-section {
  margin-bottom: 2rem;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.custom-checkbox {
  width: 18px;
  height: 18px;
  margin: 0;
  accent-color: #0ea5e9;
}

.checkbox-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.4;
}

.terms-link {
  background: none;
  border: none;
  color: #0ea5e9;
  text-decoration: underline;
  cursor: pointer;
  font-size: inherit;
  padding: 0;
}

.terms-link:hover {
  color: #38bdf8;
}

.submit-section {
  margin-bottom: 1rem;
}

.register-submit-button {
  width: 100%;
  background: linear-gradient(45deg, #0ea5e9, #6366f1);
  color: #000;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(14, 165, 233, 0.3);
}

.register-submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.login-link {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.link-primary {
  color: #0ea5e9;
  text-decoration: none;
}

.link-primary:hover {
  color: #38bdf8;
  text-decoration: underline;
}

/* Terms Modal Styles */
.terms-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.terms-modal-container {
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(14, 165, 233, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: modalSlideIn 0.3s ease-out;
}

.terms-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
}

.terms-modal-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.terms-modal-content {
  padding: 2rem;
}

.terms-modal-subtitle {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.terms-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.terms-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
}

.section-title {
  color: #0ea5e9;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.section-content h4 {
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  margin: 1rem 0 0.5rem;
}

.section-content p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.terms-modal-footer {
  padding: 1rem 2rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
}

.terms-close-button {
  background: linear-gradient(45deg, #0ea5e9, #6366f1);
  color: #000;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.terms-close-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(14, 165, 233, 0.3);
}

/* Login Modal Styles */
.login-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.login-modal-container {
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(14, 165, 233, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  max-width: 450px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: modalSlideIn 0.3s ease-out;
}

.login-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.login-modal-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.login-modal-content {
  padding: 2rem;
}

.login-modal-subtitle {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  text-align: center;
  font-size: 1.1rem;
}

.login-modal-form {
  margin-bottom: 2rem;
}

.login-modal-form .form-group {
  margin-bottom: 1.5rem;
}

.login-submit-button {
  width: 100%;
  background: linear-gradient(45deg, #0ea5e9, #6366f1);
  color: #000;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(14, 165, 233, 0.3);
}

.login-submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.register-link {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.register-link button {
  background: none;
  border: none;
  color: #0ea5e9;
  cursor: pointer;
  font-size: inherit;
  padding: 0;
  text-decoration: underline;
}

.register-link button:hover {
  color: #38bdf8;
}

/* Responsive Modal Styles */
@media (max-width: 768px) {
  .register-modal-container,
  .terms-modal-container {
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .register-modal-header,
  .terms-modal-header {
    padding: 1.5rem 1.5rem 1rem;
  }
  
  .register-modal-content,
  .terms-modal-content {
    padding: 1.5rem;
  }

}
</style>
