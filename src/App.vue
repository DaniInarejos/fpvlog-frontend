<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Inicializar autenticación al cargar la app
onMounted(async () => {
  await authStore.initializeAuth()
})
</script>

<template>
  <div id="app">
    <!-- Mostrar loading mientras se verifica el token -->
    <div v-if="authStore.isLoading" class="loading-screen">
      <div class="loading-content">
        <div class="spinner"></div>
        <p>Verificando sesión...</p>
      </div>
    </div>
    
    <!-- Renderizar rutas cuando no está cargando -->
    <router-view v-else />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #2c3e50;
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 50%, #6c5ce7 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  position: relative;
}

/* Efecto de nubes de fondo */
#app::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: -1;
}

/* Variables CSS para el tema de cielo */
:root {
  --sky-primary: #74b9ff;
  --sky-secondary: #0984e3;
  --sky-accent: #6c5ce7;
  --sky-light: #ddd6fe;
  --sky-white: #ffffff;
  --sky-cloud: rgba(255, 255, 255, 0.9);
  --sky-shadow: rgba(116, 185, 255, 0.2);
  --sky-text: #2c3e50;
  --sky-text-light: #636e72;
  --sky-success: #00b894;
  --sky-warning: #fdcb6e;
  --sky-error: #e84393;
}

/* Estilos globales para botones */
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  font-size: 0.95rem;
  box-shadow: 0 4px 15px var(--sky-shadow);
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn:hover::before {
  left: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, var(--sky-primary), var(--sky-secondary));
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--sky-shadow);
}

.btn-secondary {
  background: linear-gradient(135deg, var(--sky-accent), #a29bfe);
  color: white;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(108, 92, 231, 0.3);
}

.btn-outline {
  background: var(--sky-cloud);
  color: var(--sky-secondary);
  border: 2px solid var(--sky-primary);
}

.btn-outline:hover {
  background: var(--sky-primary);
  color: white;
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Estilos para formularios */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--sky-text);
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid rgba(116, 185, 255, 0.3);
  border-radius: 15px;
  font-size: 1rem;
  background: var(--sky-cloud);
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--sky-primary);
  box-shadow: 0 0 0 3px rgba(116, 185, 255, 0.1);
  transform: translateY(-1px);
}

/* Tarjetas con efecto de cielo */
.card {
  background: var(--sky-cloud);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(116, 185, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(116, 185, 255, 0.2);
}

/* Mensajes */
.message {
  padding: 1rem;
  border-radius: 15px;
  margin: 1rem 0;
  font-weight: 500;
}

.message.success {
  background: rgba(0, 184, 148, 0.1);
  color: var(--sky-success);
  border: 1px solid rgba(0, 184, 148, 0.3);
}

.message.error {
  background: rgba(232, 67, 147, 0.1);
  color: var(--sky-error);
  border: 1px solid rgba(232, 67, 147, 0.3);
}
</style>

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

<style>
/* Pantalla de carga */
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 50%, #6c5ce7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-content p {
  font-size: 1.1rem;
  font-weight: 500;
}
</style>
