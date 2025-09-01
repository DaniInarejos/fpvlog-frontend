<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from './stores/user'
import { useGlobalLoginModal } from './composables/useGlobalLoginModal'
import NavBar from './components/layout/NavBar.vue'
import SideMenu from './components/layout/SideMenu.vue'
import LoginModal from './components/common/LoginModal.vue'

const route = useRoute()
const { showLoginModal, closeLoginModal, handleLoginSuccess } = useGlobalLoginModal()

const isAuthPage = computed(() => route.meta.layout === 'auth')
const isLandingPage = computed(() => route.name === 'landing')

// Función para actualizar el título, metadescripciones y Open Graph
const updatePageMeta = () => {
  const baseTitle = 'SkySphere'
  const pageTitle = route.meta.title
  const pageDescription = route.meta.description || 'Plataforma social para pilotos de drones FPV'
  const fullTitle = pageTitle ? `${pageTitle} | ${baseTitle}` : baseTitle
  const currentUrl = window.location.href
  const siteName = 'SkySphere'
  const defaultImage = `${window.location.origin}/images/placeholder.png`
  
  // Actualizar el título de la página
  document.title = fullTitle
  
  // Función helper para crear o actualizar meta tags
  const updateMetaTag = (selector, attribute, attributeValue, content) => {
    let metaTag = document.querySelector(selector)
    if (!metaTag) {
      metaTag = document.createElement('meta')
      metaTag.setAttribute(attribute, attributeValue)
      document.head.appendChild(metaTag)
    }
    metaTag.setAttribute('content', content)
  }
  
  // Meta descripción estándar
  updateMetaTag('meta[name="description"]', 'name', 'description', pageDescription)
  
  // Open Graph básico
  updateMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle)
  updateMetaTag('meta[property="og:description"]', 'property', 'og:description', pageDescription)
  updateMetaTag('meta[property="og:url"]', 'property', 'og:url', currentUrl)
  updateMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', siteName)
  updateMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website')
  updateMetaTag('meta[property="og:image"]', 'property', 'og:image', defaultImage)
  updateMetaTag('meta[property="og:image:width"]', 'property', 'og:image:width', '1200')
  updateMetaTag('meta[property="og:image:height"]', 'property', 'og:image:height', '630')
  updateMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', pageDescription)
  
  // Twitter Cards
  updateMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
  updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle)
  updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', pageDescription)
  updateMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', defaultImage)
  updateMetaTag('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', pageDescription)
  
  // Meta tags adicionales para SEO
  updateMetaTag('meta[name="robots"]', 'name', 'robots', 'index, follow')
  updateMetaTag('meta[name="author"]', 'name', 'author', 'SkySphere')
  updateMetaTag('meta[name="viewport"]', 'name', 'viewport', 'width=device-width, initial-scale=1.0')
  
  // Canonical URL
  let canonicalLink = document.querySelector('link[rel="canonical"]')
  if (!canonicalLink) {
    canonicalLink = document.createElement('link')
    canonicalLink.setAttribute('rel', 'canonical')
    document.head.appendChild(canonicalLink)
  }
  canonicalLink.setAttribute('href', currentUrl)
  
  // Add structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'SkySphere',
    'description': route.meta.description || 'Plataforma social para pilotos de drones FPV',
    'url': window.location.href,
    'applicationCategory': 'SocialNetworkingApplication',
    'operatingSystem': 'Web'
  }
  
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]')
  if (existingScript) {
    existingScript.remove()
  }
  
  // Add new structured data
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(structuredData)
  document.head.appendChild(script)
}

// Actualizar metadatos cuando cambia la ruta
watch(() => route.path, updatePageMeta, { immediate: true })

// También actualizar metadatos al montar el componente
onMounted(() => {
  updatePageMeta()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-sky-500/20 to-indigo-500/20 dark:from-gray-900 dark:to-gray-800">
    <!-- Layout para páginas de autenticación -->
    <template v-if="isAuthPage">
      <main class="container mx-auto px-3 sm:px-4 py-4 sm:py-8 min-h-screen">
        <router-view />
      </main>
    </template>

    <!-- Layout para landing page (sin navegación) -->
    <template v-else-if="isLandingPage">
      <main class="min-h-screen">
        <router-view />
      </main>
    </template>

    <!-- Layout principal con navegación -->
    <template v-else>
      <NavBar class="fixed top-0 left-0 right-0 z-50" />
      <div class="flex flex-col sm:flex-row min-h-screen">
        <SideMenu 
          class="w-full sm:w-64 fixed bottom-0 sm:fixed sm:top-[3.5rem] sm:bottom-0 sm:left-0 h-16 sm:h-[calc(100vh-3.5rem)] z-40 border-t sm:border-t-0 sm:border-r border-gray-200/20 dark:border-gray-700/20" 
        />
        <main class="flex-1 sm:ml-64 px-3 sm:px-4 py-4 pb-20 sm:pb-4 sm:py-8 mt-16">
          <router-view />
        </main>
      </div>
    </template>
    
    <!-- Modal de Login Global -->
    <LoginModal
      :show="showLoginModal"
      @close="closeLoginModal"
      @login-success="handleLoginSuccess"
    />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
