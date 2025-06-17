<template>
  <div class="home">
    <AppHeader />
    <div class="clouds-bg"></div>
    <div class="hero">
      <div class="hero-content">
        <h1>🚁 FPV Log</h1>
        <p>Registra tus aventuras en el cielo</p>
        <p class="subtitle">La aplicación definitiva para pilotos FPV</p>
        
        <div class="actions">
          <router-link v-if="!authStore.isLoggedIn" to="/login" class="btn btn-primary">
            🚁 Iniciar Sesión
          </router-link>
          <router-link v-else to="/dashboard" class="btn btn-primary">
            ✈️ Ir al Dashboard
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/AppHeader.vue'

const authStore = useAuthStore()
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.clouds-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 25%),
    radial-gradient(circle at 50% 10%, rgba(255, 255, 255, 0.15) 0%, transparent 30%);
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-10px) translateX(5px); }
  50% { transform: translateY(0px) translateX(-5px); }
  75% { transform: translateY(10px) translateX(5px); }
}

.hero {
  text-align: center;
  max-width: 700px;
  padding: 3rem;
  position: relative;
  z-index: 2;
}

.hero-content {
  background: rgba(255, 255, 255, 0.95);
  padding: 3rem;
  border-radius: 30px;
  box-shadow: 0 20px 60px rgba(116, 185, 255, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.hero h1 {
  font-size: 4rem;
  margin-bottom: 1rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--sky-primary), var(--sky-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 8px rgba(116, 185, 255, 0.3);
}

.hero p {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: var(--sky-text);
  font-weight: 500;
}

.subtitle {
  font-size: 1.1rem !important;
  color: var(--sky-text-light) !important;
  margin-bottom: 2.5rem !important;
}

.actions {
  margin-top: 2rem;
}

.btn {
  font-size: 1.1rem;
  padding: 1rem 2rem;
  margin: 0 0.5rem;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .hero-content {
    padding: 2rem;
    margin: 1rem;
  }
}
</style>