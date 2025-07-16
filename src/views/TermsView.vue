<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '../components/base/BaseCard.vue'

const { t } = useI18n()

// Estado para el control de aceptación
const hasAccepted = ref(false)
const showPrintVersion = ref(false)

// Método para manejar la aceptación de términos
const handleAcceptTerms = () => {
  hasAccepted.value = true
  // Aquí se podría implementar la lógica para guardar la aceptación
}

// Método para imprimir los términos
const printTerms = () => {
  window.print()
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="space-y-8">
      <!-- Encabezado -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {{ t('terms.title') }}
        </h1>
        <p class="mt-4 text-gray-500 dark:text-gray-400">
          {{ t('terms.lastUpdated') }}: {{ t('terms.updateDate') }}
        </p>
      </div>

      <!-- Controles -->
      <div class="flex justify-end space-x-4 print:hidden">
        <button
          @click="showPrintVersion = !showPrintVersion"
          class="text-sm text-primary-600 hover:text-primary-500"
        >
          {{ showPrintVersion ? t('terms.viewNormal') : t('terms.viewPrint') }}
        </button>
        <button
          @click="printTerms"
          class="text-sm text-primary-600 hover:text-primary-500"
        >
          {{ t('terms.print') }}
        </button>
      </div>

      <!-- Contenido de los términos -->
      <div class="space-y-12">
        <!-- Sección 1: Definiciones -->
        <BaseCard>
          <h2 class="text-2xl font-semibold mb-4">{{ t('terms.definitions.title') }}</h2>
          <div class="prose dark:prose-invert max-w-none">
            <h3>{{ t('terms.definitions.user') }}</h3>
            <p>{{ t('terms.definitions.userDesc') }}</p>

            <h3>{{ t('terms.definitions.fpvPilot') }}</h3>
            <p>{{ t('terms.definitions.fpvPilotDesc') }}</p>

            <h3>{{ t('terms.definitions.content') }}</h3>
            <p>{{ t('terms.definitions.contentDesc') }}</p>

            <h3>{{ t('terms.definitions.services') }}</h3>
            <p>{{ t('terms.definitions.servicesDesc') }}</p>
          </div>
        </BaseCard>

        <!-- Sección 2: Registro -->
        <BaseCard>
          <h2 class="text-2xl font-semibold mb-4">{{ t('terms.registration.title') }}</h2>
          <div class="prose dark:prose-invert max-w-none">
            <h3>{{ t('terms.registration.requirements') }}</h3>
            <p>{{ t('terms.registration.requirementsDesc') }}</p>

            <h3>{{ t('terms.registration.verification') }}</h3>
            <p>{{ t('terms.registration.verificationDesc') }}</p>
          </div>
        </BaseCard>

        <!-- Sección 3: Contenido -->
        <BaseCard>
          <h2 class="text-2xl font-semibold mb-4">{{ t('terms.content.title') }}</h2>
          <div class="prose dark:prose-invert max-w-none">
            <h3>{{ t('terms.content.rules') }}</h3>
            <p>{{ t('terms.content.rulesDesc') }}</p>

            <h3>{{ t('terms.content.safety') }}</h3>
            <p>{{ t('terms.content.safetyDesc') }}</p>
          </div>
        </BaseCard>

        <!-- Sección 4: Programa de Afiliados -->
        <BaseCard>
          <h2 class="text-2xl font-semibold mb-4">{{ t('terms.affiliates.title') }}</h2>
          <div class="prose dark:prose-invert max-w-none">
            <h3>{{ t('terms.affiliates.disclosure') }}</h3>
            <p>{{ t('terms.affiliates.disclosureDesc') }}</p>

            <h3>{{ t('terms.affiliates.commission') }}</h3>
            <p>{{ t('terms.affiliates.commissionDesc') }}</p>
          </div>
        </BaseCard>

        <!-- Sección 5: Privacidad -->
        <BaseCard>
          <h2 class="text-2xl font-semibold mb-4">{{ t('terms.privacy.title') }}</h2>
          <div class="prose dark:prose-invert max-w-none">
            <h3>{{ t('terms.privacy.data') }}</h3>
            <p>{{ t('terms.privacy.dataDesc') }}</p>

            <h3>{{ t('terms.privacy.location') }}</h3>
            <p>{{ t('terms.privacy.locationDesc') }}</p>
          </div>
        </BaseCard>

        <!-- Sección 6: Responsabilidad -->
        <BaseCard>
          <h2 class="text-2xl font-semibold mb-4">{{ t('terms.liability.title') }}</h2>
          <div class="prose dark:prose-invert max-w-none">
            <h3>{{ t('terms.liability.disclaimer') }}</h3>
            <p>{{ t('terms.liability.disclaimerDesc') }}</p>

            <h3>{{ t('terms.liability.compliance') }}</h3>
            <p>{{ t('terms.liability.complianceDesc') }}</p>
          </div>
        </BaseCard>

        <!-- Sección 7: Ofertas -->
        <BaseCard>
          <h2 class="text-2xl font-semibold mb-4">{{ t('terms.offers.title') }}</h2>
          <div class="prose dark:prose-invert max-w-none">
            <h3>{{ t('terms.offers.conditions') }}</h3>
            <p>{{ t('terms.offers.conditionsDesc') }}</p>

            <h3>{{ t('terms.offers.validity') }}</h3>
            <p>{{ t('terms.offers.validityDesc') }}</p>
          </div>
        </BaseCard>

        <!-- Sección 8: Modificaciones -->
        <BaseCard>
          <h2 class="text-2xl font-semibold mb-4">{{ t('terms.modifications.title') }}</h2>
          <div class="prose dark:prose-invert max-w-none">
            <h3>{{ t('terms.modifications.changes') }}</h3>
            <p>{{ t('terms.modifications.changesDesc') }}</p>

            <h3>{{ t('terms.modifications.termination') }}</h3>
            <p>{{ t('terms.modifications.terminationDesc') }}</p>
          </div>
        </BaseCard>
      </div>

      <!-- Aceptación de términos -->
      <div class="mt-8 print:hidden">
        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="flex items-center">
            <input
              type="checkbox"
              id="accept-terms"
              v-model="hasAccepted"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            >
            <label for="accept-terms" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {{ t('terms.acceptanceText') }}
            </label>
          </div>
          <button
            @click="handleAcceptTerms"
            :disabled="!hasAccepted"
            class="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t('terms.acceptButton') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@media print {
  .print\:hidden {
    display: none !important;
  }
  
  .prose {
    max-width: none !important;
  }
}
</style>