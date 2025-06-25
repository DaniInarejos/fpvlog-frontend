<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Sección del Proyecto -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 class="text-4xl font-bold text-blue-600 mb-6">Acerca de SkySphere</h1>
        
        <div class="space-y-6 text-gray-700">
          <p class="text-lg">
            SkySphere es projecto personal diseñado específicamente para la comunidad de pilotos de drones FPV. 
            La plataforma proporciona todas las herramientas necesarias para documentar, gestionar y compartir 
            tus experiencias de vuelo, esta en continuo desarrollo y se iran añadiendo nuevas caracteristicas.
          </p>

          <h2 class="text-2xl font-semibold text-blue-500 mt-8">Características Principales</h2>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li>Registro detallado de vuelos con información de ubicación y condiciones</li>
            <li>Gestión completa de tu flota de drones</li>
            <li>Comunidad activa de pilotos FPV</li>
            <li>Compartir experiencias y aprender de otros pilotos</li>
            <li>Interfaz intuitiva y moderna</li>
          </ul>

          <h2 class="text-2xl font-semibold text-blue-500 mt-8">Tecnologías Utilizadas</h2>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li>Vue.js 3 con Composition API</li>
            <li>Tailwind CSS para un diseño moderno y responsive</li>
            <li>Vite como build tool para un desarrollo rápido</li>
            <li>Claude-3.5 como IA asistente en el desarrollo del frontend</li>
            <li>Bunjs + hono como servidor de Backend</li>
            <li>DDBB mongo Atlas y en redis upstash</li>
            <li>Integracion de despliegues automaticos con Render</li>
            <li>Todo el proyecto esta desplegado actualmente en tiers gratuitos de las Herramientas mencionadas,
              ten paciencia si el proyecto tarda un par de minutos en responder, seguramente el backend este sin una instancia lista para trabajar
            </li>
          </ul>
        </div>
      </div>

      <!-- Sección del Desarrollador -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-3xl font-bold text-blue-600 mb-6">Sobre el Desarrollador</h2>
        
        <div class="flex flex-col md:flex-row gap-8 items-start">
          <div class="w-full md:w-1/3">
            <img 
              src="/images/foto-perfil.jpg" 
              alt="Foto del desarrollador" 
              class="w-full rounded-lg shadow-md"
            />
          </div>
          
          <div class="w-full md:w-2/3 space-y-4 text-gray-700">
            <p class="text-lg">
              Mi nombre es Daniel Inarejos Aroca, aunque mis amigos me llaman Danico, Soy un desarrollador de software  con mas de 12 años de experiencia y entusiasta de los drones FPV. 
              Creé SkySphere para resolver la necesidad de tener una plataforma moderna y completa para la 
              comunidad de pilotos FPV.
            </p>

            <p>
              Como piloto de FPV, entiendo las necesidades específicas de nuestra comunidad y trabajo 
              constantemente para mejorar esta plataforma con nuevas características y mejoras.
            </p>

            <div class="pt-4">
              <h3 class="text-xl font-semibold text-blue-500 mb-3">Contacto y Redes Sociales</h3>
              <div class="flex space-x-4">
                <a 
                  href="https://github.com/DaniInarejos" 
                  target="_blank" 
                  class="text-gray-600 hover:text-blue-500 transition-colors"
                >
                  <i class="fab fa-github text-2xl"></i>
                </a>
                <a 
                  href="https://www.linkedin.com/in/daniel-inarejos/" 
                  target="_blank" 
                  class="text-gray-600 hover:text-blue-500 transition-colors"
                >
                  <i class="fab fa-linkedin text-2xl"></i>
                </a>
                <a 
                  href="mailto:danielinarejosaroca@gmail.com" 
                  class="text-gray-600 hover:text-blue-500 transition-colors"
                >
                  <i class="fas fa-envelope text-2xl"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
