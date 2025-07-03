<script setup>
defineProps({
  maxHeight: {
    type: String,
    default: '400px'
  }
})
</script>

<template>
  <div class="custom-scrollbar" :style="{ maxHeight }">
    <slot></slot>
  </div>
</template>

<style scoped>
.custom-scrollbar {
  overflow-y: auto;
  padding-right: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: #6366f1 transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 100vh;
  margin: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #6366f1;
  border-radius: 100vh;
  border: 2px solid transparent;
  background-clip: padding-box;
  transition: background-color 0.2s ease-in-out;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #4f46e5;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.dark .custom-scrollbar {
  scrollbar-color: #818cf8 transparent;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #818cf8;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #6366f1;
}
</style>