<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '../components/base/BaseCard.vue'

const { t } = useI18n()

// Estado para el control de aceptación
const hasAccepted = ref(false)
const showPrintVersion = ref(false)
const showFullContent = ref(true)

// Método para manejar la aceptación de términos
const handleAcceptTerms = () => {
  hasAccepted.value = true
  // Aquí se podría implementar la lógica para guardar la aceptación
}

// Método para imprimir los términos
const printTerms = () => {
  window.print()
}

// Método para descargar PDF
const downloadPdf = () => {
  // Implementar lógica de descarga PDF
  console.log('Downloading PDF...')
}
</script>

<template>
  <div class="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="space-y-8">
      <!-- Encabezado Expandido -->
      <div class="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-8 rounded-2xl">
        <h1 class="text-4xl font-bold mb-4">
          {{ t('terms.title') }}
        </h1>
        <p class="text-xl opacity-90 mb-2">
          {{ t('terms.lastUpdated') }}: {{ t('terms.updateDate') }}
        </p>
        <p class="text-sm opacity-75">
          {{ t('terms.effectiveDate') }}: {{ t('terms.updateDate') }}
        </p>
      </div>


      <!-- Contenido Expandido de los términos -->
      <div class="space-y-8">
        <!-- Introducción -->
        <BaseCard class="border-l-4 border-blue-500">
          <h2 class="text-3xl font-bold mb-6 text-blue-600">{{ t('terms.introduction.title') }}</h2>
          <div class="prose dark:prose-invert max-w-none space-y-6">
            <div>
              <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">{{ t('terms.introduction.welcome') }}</h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.introduction.welcomeDesc') }}</p>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">{{ t('terms.introduction.acceptance') }}</h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.introduction.acceptanceDesc') }}</p>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">{{ t('terms.introduction.updates') }}</h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.introduction.updatesDesc') }}</p>
            </div>
          </div>
        </BaseCard>

        <!-- Definiciones Expandidas -->
        <BaseCard class="border-l-4 border-green-500">
          <h2 class="text-3xl font-bold mb-6 text-green-600">{{ t('terms.definitions.title') }}</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">{{ t('terms.definitions.intro') }}</p>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 class="font-semibold text-gray-800 dark:text-gray-200">{{ t('terms.definitions.user') }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('terms.definitions.userDesc') }}</p>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 class="font-semibold text-gray-800 dark:text-gray-200">{{ t('terms.definitions.fpvPilot') }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('terms.definitions.fpvPilotDesc') }}</p>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 class="font-semibold text-gray-800 dark:text-gray-200">{{ t('terms.definitions.content') }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('terms.definitions.contentDesc') }}</p>
              </div>
            </div>
            <div class="space-y-4">
              <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 class="font-semibold text-gray-800 dark:text-gray-200">{{ t('terms.definitions.services') }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('terms.definitions.servicesDesc') }}</p>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 class="font-semibold text-gray-800 dark:text-gray-200">{{ t('terms.definitions.platform') }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('terms.definitions.platformDesc') }}</p>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 class="font-semibold text-gray-800 dark:text-gray-200">{{ t('terms.definitions.spot') }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('terms.definitions.spotDesc') }}</p>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Registro Expandido -->
        <BaseCard class="border-l-4 border-purple-500">
          <h2 class="text-3xl font-bold mb-6 text-purple-600">{{ t('terms.registration.title') }}</h2>
          <div class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.registration.requirements') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.registration.requirementsDesc') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.registration.verification') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.registration.verificationDesc') }}</p>
              </div>
            </div>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.registration.security') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.registration.securityDesc') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.registration.suspension') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.registration.suspensionDesc') }}</p>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Continuar con todas las demás secciones expandidas... -->
        <!-- Contenido -->
        <BaseCard class="border-l-4 border-red-500">
          <h2 class="text-3xl font-bold mb-6 text-red-600">{{ t('terms.content.title') }}</h2>
          <div class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.content.rules') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.content.rulesDesc') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.content.safety') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.content.safetyDesc') }}</p>
              </div>
            </div>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.content.intellectual') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.content.intellectualDesc') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.content.moderation') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.content.moderationDesc') }}</p>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Programa de Afiliados Expandido -->
        <BaseCard class="border-l-4 border-yellow-500">
          <h2 class="text-3xl font-bold mb-6 text-yellow-600">{{ t('terms.affiliates.title') }}</h2>
          <div class="space-y-6">
            <div>
              <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.affiliates.overview') }}</h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.affiliates.overviewDesc') }}</p>
            </div>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.affiliates.disclosure') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.affiliates.disclosureDesc') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.affiliates.commission') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.affiliates.commissionDesc') }}</p>
              </div>
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.affiliates.conduct') }}</h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.affiliates.conductDesc') }}</p>
            </div>
          </div>
        </BaseCard>

        <!-- Privacidad Expandida -->
        <BaseCard class="border-l-4 border-indigo-500">
          <h2 class="text-3xl font-bold mb-6 text-indigo-600">{{ t('terms.privacy.title') }}</h2>
          <div class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.privacy.data') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.privacy.dataDesc') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.privacy.location') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.privacy.locationDesc') }}</p>
              </div>
            </div>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.privacy.sharing') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.privacy.sharingDesc') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.privacy.rights') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.privacy.rightsDesc') }}</p>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Responsabilidad Expandida -->
        <BaseCard class="border-l-4 border-orange-500">
          <h2 class="text-3xl font-bold mb-6 text-orange-600">{{ t('terms.liability.title') }}</h2>
          <div class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.liability.disclaimer') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.liability.disclaimerDesc') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.liability.compliance') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.liability.complianceDesc') }}</p>
              </div>
            </div>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.liability.limitation') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.liability.limitationDesc') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.liability.indemnification') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.liability.indemnificationDesc') }}</p>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Ofertas Expandidas -->
        <BaseCard class="border-l-4 border-pink-500">
          <h2 class="text-3xl font-bold mb-6 text-pink-600">{{ t('terms.offers.title') }}</h2>
          <div class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.offers.conditions') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.offers.conditionsDesc') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.offers.validity') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.offers.validityDesc') }}</p>
              </div>
            </div>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.offers.transactions') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.offers.transactionsDesc') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.offers.returns') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.offers.returnsDesc') }}</p>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Modificaciones Expandidas -->
        <BaseCard class="border-l-4 border-teal-500">
          <h2 class="text-3xl font-bold mb-6 text-teal-600">{{ t('terms.modifications.title') }}</h2>
          <div class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.modifications.changes') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.modifications.changesDesc') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.modifications.service') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.modifications.serviceDesc') }}</p>
              </div>
            </div>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.modifications.termination') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.modifications.terminationDesc') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.modifications.survival') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.modifications.survivalDesc') }}</p>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Disposiciones Legales -->
        <BaseCard class="border-l-4 border-gray-500">
          <h2 class="text-3xl font-bold mb-6 text-gray-600">{{ t('terms.legal.title') }}</h2>
          <div class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.legal.jurisdiction') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.legal.jurisdictionDesc') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.legal.disputes') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.legal.disputesDesc') }}</p>
              </div>
            </div>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.legal.severability') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.legal.severabilityDesc') }}</p>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('terms.legal.entire') }}</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ t('terms.legal.entireDesc') }}</p>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Información de Contacto -->
        <BaseCard class="border-l-4 border-cyan-500">
          <h2 class="text-3xl font-bold mb-6 text-cyan-600">{{ t('terms.contact.title') }}</h2>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">{{ t('terms.contact.support') }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('terms.contact.supportDesc') }}</p>
            </div>
            <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">{{ t('terms.contact.business') }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('terms.contact.businessDesc') }}</p>
            </div>
            <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">{{ t('terms.contact.legal') }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('terms.contact.legalDesc') }}</p>
            </div>
          </div>
        </BaseCard>
      </div>


    </div>
  </div>
</template>

<style scoped>
@media print {
  .print\:hidden {
    display: none !important;
  }
  
  .prose {
    max-width: none !important;
  }
  
  .space-y-8 > * + * {
    margin-top: 1rem !important;
  }
}

.prose {
  line-height: 1.7;
}

.prose h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.prose p {
  margin-bottom: 1rem;
}
</style>