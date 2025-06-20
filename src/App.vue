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

onMounted(async () => {
  await userStore.initAuth()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Layout para páginas de autenticación -->
    <template v-if="isAuthPage">
      <main class="container mx-auto px-4 py-8">
        <router-view />
      </main>
    </template>

    <!-- Layout principal con navegación -->
    <template v-else>
      <NavBar />
      <div class="flex">
        <SideMenu v-if="isAuthenticated" />
        <main class="flex-1 container mx-auto px-4 py-8">
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
