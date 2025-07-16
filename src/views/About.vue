<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- Project Section -->
      <div class="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/20 dark:border-gray-700/20 p-8 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent mb-6">{{ $t('about.title') }}</h1>
        
        <div class="space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-lg">
            {{ $t('about.description') }}
          </p>

          <h2 class="text-2xl font-semibold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent mt-8">{{ $t('about.mainFeatures') }}</h2>
          <ul class="list-none space-y-3 ml-4">
            <li class="flex items-center space-x-2">
              <span class="text-sky-500 dark:text-sky-400">✈️</span>
              <span>{{ $t('about.features.flights') }}</span>
            </li>
            <li class="flex items-center space-x-2">
              <span class="text-sky-500 dark:text-sky-400">🛠️</span>
              <span>{{ $t('about.features.drones') }}</span>
            </li>
            <li class="flex items-center space-x-2">
              <span class="text-sky-500 dark:text-sky-400">👥</span>
              <span>{{ $t('about.features.community') }}</span>
            </li>
            <li class="flex items-center space-x-2">
              <span class="text-sky-500 dark:text-sky-400">🔄</span>
              <span>{{ $t('about.features.share') }}</span>
            </li>
            <li class="flex items-center space-x-2">
              <span class="text-sky-500 dark:text-sky-400">💫</span>
              <span>{{ $t('about.features.interface') }}</span>
            </li>
          </ul>

          <h2 class="text-2xl font-semibold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent mt-8">{{ $t('about.technologies') }}</h2>
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
            <li class="flex items-center space-x-2 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]">
              <span class="text-sky-500 dark:text-sky-400">⚡</span>
              <span>{{ $t('about.techs.vue') }}</span>
            </li>
            <li class="flex items-center space-x-2 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]">
              <span class="text-sky-500 dark:text-sky-400">🎨</span>
              <span>{{ $t('about.techs.tailwind') }}</span>
            </li>
            <li class="flex items-center space-x-2 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]">
              <span class="text-sky-500 dark:text-sky-400">🚀</span>
              <span>{{ $t('about.techs.vite') }}</span>
            </li>
            <li class="flex items-center space-x-2 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]">
              <span class="text-sky-500 dark:text-sky-400">🤖</span>
              <span>{{ $t('about.techs.claude') }}</span>
            </li>
            <li class="flex items-center space-x-2 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]">
              <span class="text-sky-500 dark:text-sky-400">🔧</span>
              <span>{{ $t('about.techs.backend') }}</span>
            </li>
            <li class="flex items-center space-x-2 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]">
              <span class="text-sky-500 dark:text-sky-400">💾</span>
              <span>{{ $t('about.techs.database') }}</span>
            </li>
          </ul>

          <div class="mt-6 p-4 rounded-lg bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800">
            <p class="text-sm text-sky-800 dark:text-sky-200">
              <span class="text-sky-500 dark:text-sky-400">ℹ️</span>
              {{ $t('about.performanceNote') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Developer Section -->
      <div class="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/20 dark:border-gray-700/20 p-8 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
        <h2 class="text-3xl font-bold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent mb-6">{{ $t('about.developer.title') }}</h2>
        
        <div class="flex flex-col md:flex-row gap-8 items-start">
          <div class="w-full md:w-1/3 group">
            <div class="relative overflow-hidden rounded-xl">
              <img 
                src="/images/foto-perfil.jpg" 
                :alt="$t('about.developer.name')" 
                class="w-full transform transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
          
          <div class="w-full md:w-2/3 space-y-4 text-gray-700 dark:text-gray-300">
            <p class="text-lg">
              {{ $t('about.developer.description') }}
            </p>
            <p>
              {{ $t('about.developer.motivation') }}
            </p>

            <div class="pt-6">
              <h3 class="text-xl font-semibold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent mb-4">{{ $t('about.developer.contact') }}</h3>
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
