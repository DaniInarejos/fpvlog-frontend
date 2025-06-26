<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- Sección del Proyecto -->
      <div class="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/20 dark:border-gray-700/20 p-8 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent mb-6">Acerca de SkySphere</h1>
        
        <div class="space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-lg">
            SkySphere es projecto personal diseñado específicamente para la comunidad de pilotos de drones FPV. 
            La plataforma proporciona todas las herramientas necesarias para documentar, gestionar y compartir 
            tus experiencias de vuelo, esta en continuo desarrollo y se iran añadiendo nuevas caracteristicas.
          </p>

          <h2 class="text-2xl font-semibold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent mt-8">Características Principales</h2>
          <ul class="list-none space-y-3 ml-4">
            <li class="flex items-center space-x-2">
              <span class="text-sky-500 dark:text-sky-400">✈️</span>
              <span>Registro detallado de vuelos con información de ubicación y condiciones</span>
            </li>
            <li class="flex items-center space-x-2">
              <span class="text-sky-500 dark:text-sky-400">🛠️</span>
              <span>Gestión completa de tu flota de drones</span>
            </li>
            <li class="flex items-center space-x-2">
              <span class="text-sky-500 dark:text-sky-400">👥</span>
              <span>Comunidad activa de pilotos FPV</span>
            </li>
            <li class="flex items-center space-x-2">
              <span class="text-sky-500 dark:text-sky-400">🔄</span>
              <span>Compartir experiencias y aprender de otros pilotos</span>
            </li>
            <li class="flex items-center space-x-2">
              <span class="text-sky-500 dark:text-sky-400">💫</span>
              <span>Interfaz intuitiva y moderna</span>
            </li>
          </ul>

          <h2 class="text-2xl font-semibold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent mt-8">Tecnologías Utilizadas</h2>
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
            <li class="flex items-center space-x-2 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]">
              <span class="text-sky-500 dark:text-sky-400">⚡</span>
              <span>Vue.js 3 con Composition API</span>
            </li>
            <li class="flex items-center space-x-2 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]">
              <span class="text-sky-500 dark:text-sky-400">🎨</span>
              <span>Tailwind CSS</span>
            </li>
            <li class="flex items-center space-x-2 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]">
              <span class="text-sky-500 dark:text-sky-400">🚀</span>
              <span>Vite</span>
            </li>
            <li class="flex items-center space-x-2 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]">
              <span class="text-sky-500 dark:text-sky-400">🤖</span>
              <span>Claude-3.5 IA</span>
            </li>
            <li class="flex items-center space-x-2 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]">
              <span class="text-sky-500 dark:text-sky-400">🔧</span>
              <span>Bunjs + hono Backend</span>
            </li>
            <li class="flex items-center space-x-2 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]">
              <span class="text-sky-500 dark:text-sky-400">💾</span>
              <span>MongoDB Atlas + Redis Upstash</span>
            </li>
          </ul>

          <div class="mt-6 p-4 rounded-lg bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800">
            <p class="text-sm text-sky-800 dark:text-sky-200">
              <span class="text-sky-500 dark:text-sky-400">ℹ️</span>
              El proyecto está desplegado en tiers gratuitos. Si experimenta alguna demora en la respuesta, 
              esto puede deberse a que el backend está inicializando una nueva instancia.
            </p>
          </div>
        </div>
      </div>

      <!-- Sección del Desarrollador -->
      <div class="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/20 dark:border-gray-700/20 p-8 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
        <h2 class="text-3xl font-bold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent mb-6">Sobre el Desarrollador</h2>
        
        <div class="flex flex-col md:flex-row gap-8 items-start">
          <div class="w-full md:w-1/3 group">
            <div class="relative overflow-hidden rounded-xl">
              <img 
                src="/images/foto-perfil.jpg" 
                alt="Foto del desarrollador" 
                class="w-full transform transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
          
          <div class="w-full md:w-2/3 space-y-4 text-gray-700 dark:text-gray-300">
            <p class="text-lg">
              Mi nombre es Daniel Inarejos Aroca, aunque mis amigos me llaman Danico, Soy un desarrollador de software 
              con mas de 12 años de experiencia y entusiasta de los drones FPV. 
              Creé SkySphere para resolver la necesidad de tener una plataforma moderna y completa para la 
              comunidad de pilotos FPV.
            </p>

            <p>
              Como piloto de FPV, entiendo las necesidades específicas de nuestra comunidad y trabajo 
              constantemente para mejorar esta plataforma con nuevas características y mejoras.
            </p>

            <div class="pt-6">
              <h3 class="text-xl font-semibold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent mb-4">Contacto y Redes Sociales</h3>
              <div class="flex space-x-6">
                <a 
                  href="https://github.com/DaniInarejos" 
                  target="_blank" 
                  class="text-gray-600 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-all duration-300 transform hover:scale-110"
                >
                  <i class="fab fa-github text-3xl"></i>
                </a>
                <a 
                  href="https://www.linkedin.com/in/daniel-inarejos/" 
                  target="_blank" 
                  class="text-gray-600 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-all duration-300 transform hover:scale-110"
                >
                  <i class="fab fa-linkedin text-3xl"></i>
                </a>
                <a 
                  href="mailto:danielinarejosaroca@gmail.com" 
                  class="text-gray-600 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-all duration-300 transform hover:scale-110"
                >
                  <i class="fas fa-envelope text-3xl"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
