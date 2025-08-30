<template>
  <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
    <div class="flex items-center justify-center mb-2">
      <svg class="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      <span class="text-blue-700 dark:text-blue-300 font-medium">{{ message }}</span>
    </div>
    <button 
      @click="$emit('login')"
      class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
    >
      Iniciar Sesión
    </button>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Necesitas iniciar sesión para realizar esta acción'
  }
})

defineEmits(['login'])
</script>