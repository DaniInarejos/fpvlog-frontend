<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from './stores/user'
import NavBar from './components/layout/NavBar.vue'
import SideMenu from './components/layout/SideMenu.vue'

const route = useRoute()
const userStore = useUserStore()

const isAuthPage = computed(() => route.meta.layout === 'auth')
const isAuthenticated = computed(() => userStore.isAuthenticated)

</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-sky-500/20 to-indigo-500/20 dark:from-gray-900 dark:to-gray-800">
    <!-- Layout para páginas de autenticación -->
    <template v-if="isAuthPage">
      <main class="container mx-auto px-3 sm:px-4 py-4 sm:py-8 min-h-screen">
        <router-view />
      </main>
    </template>

    <!-- Layout principal con navegación -->
    <template v-else>
      <NavBar />
      <div class="flex flex-col sm:flex-row min-h-screen">
        <SideMenu 
          v-if="isAuthenticated" 
          class="w-full sm:w-64 fixed bottom-0 sm:static sm:h-screen z-40 border-t sm:border-t-0 sm:border-r border-gray-200/20 dark:border-gray-700/20" 
        />
        <main class="flex-1 container mx-auto px-3 sm:px-4 py-4 pb-20 sm:pb-4 sm:py-8">
          <router-view />
        </main>
      </div>
    </template>
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
