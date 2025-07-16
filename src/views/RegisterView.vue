<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useI18n } from 'vue-i18n'
import BaseInput from '../components/base/BaseInput.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseAlert from '../components/base/BaseAlert.vue'
import BaseCard from '../components/base/BaseCard.vue'

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  lastName: '',
  privacySettings: {
    allowFollowersToSeeFlights: true,
    allowFollowersToSeeDrones: true,
    profileVisibility: 'public'
  }
})

const errors = ref({})
const isLoading = ref(false)
const showSuccessAlert = ref(false)
const showTermsModal = ref(false)

const validateForm = () => {
  errors.value = {}
  if (!formData.value.username) errors.value.username = 'El nombre de usuario es requerido'
  if (!formData.value.name) errors.value.name = 'El nombre es requerido'
  if (!formData.value.lastName) errors.value.lastName = 'El apellido es requerido'
  if (!formData.value.email) errors.value.email = 'El email es requerido'
  if (!formData.value.password) errors.value.password = 'La contraseña es requerida'
  if (formData.value.password.length < 6) errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
  if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden'
  }
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  try {
    await userStore.register({
      username: formData.value.username,
      email: formData.value.email.toLowerCase().trim(),
      password: formData.value.password,
      name: formData.value.name,
      lastName: formData.value.lastName,
      privacySettings: formData.value.privacySettings
    })
    showSuccessAlert.value = true
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    errors.value.submit = error.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Crear una cuenta
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?
        <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
          Inicia sesión
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <BaseAlert
            v-if="showSuccessAlert"
            type="success"
            message="Registro exitoso. Redirigiendo..."
          />
          <BaseAlert
            v-if="errors.submit"
            type="error"
            :message="errors.submit"
          />

          <BaseInput
            v-model="formData.username"
            label="Nombre de usuario"
            :error="errors.username"
            required
          />

          <BaseInput
            v-model="formData.name"
            label="Nombre"
            :error="errors.name"
            required
          />

          <BaseInput
            v-model="formData.lastName"
            label="Apellido"
            :error="errors.lastName"
            required
          />

          <BaseInput
            v-model="formData.email"
            label="Email"
            type="email"
            :error="errors.email"
            required
          />

          <BaseInput
            v-model="formData.password"
            label="Contraseña"
            type="password"
            :error="errors.password"
            required
          />

          <BaseInput
            v-model="formData.confirmPassword"
            label="Confirmar contraseña"
            type="password"
            :error="errors.confirmPassword"
            required
          />

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="terms" class="ml-2 block text-sm text-gray-900">
                Acepto los
                <button
                  type="button"
                  @click="showTermsModal = true"
                  class="font-medium text-primary-600 hover:text-primary-500"
                >
                  términos y condiciones
                </button>
              </label>
            </div>
          </div>

          <div>
            <BaseButton
              type="submit"
              :loading="isLoading"
              class="w-full"
            >
              Registrarse
            </BaseButton>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Términos y Condiciones -->
    <div v-if="showTermsModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Fondo oscuro del modal -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showTermsModal = false"></div>

        <!-- Contenedor del modal -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[80vh] overflow-y-auto">
            <!-- Contenido de los términos -->
            <div class="space-y-8">
              <div class="text-center">
                <h2 class="text-3xl font-bold text-gray-900">{{ t('terms.title') }}</h2>
                <p class="mt-4 text-gray-500">{{ t('terms.lastUpdated') }}: {{ t('terms.updateDate') }}</p>
              </div>

              <!-- Secciones de términos -->
              <BaseCard v-for="section in ['definitions', 'registration', 'content', 'affiliates', 'privacy', 'liability', 'offers', 'modifications']" :key="section">
                <h3 class="text-2xl font-semibold mb-4">{{ t(`terms.${section}.title`) }}</h3>
                <div class="prose max-w-none">
                  <template v-if="section === 'definitions'">
                    <h4>{{ t('terms.definitions.user') }}</h4>
                    <p>{{ t('terms.definitions.userDesc') }}</p>
                    <h4>{{ t('terms.definitions.fpvPilot') }}</h4>
                    <p>{{ t('terms.definitions.fpvPilotDesc') }}</p>
                    <h4>{{ t('terms.definitions.content') }}</h4>
                    <p>{{ t('terms.definitions.contentDesc') }}</p>
                    <h4>{{ t('terms.definitions.services') }}</h4>
                    <p>{{ t('terms.definitions.servicesDesc') }}</p>
                  </template>
                  <template v-else-if="section === 'registration'">
                    <h4>{{ t('terms.registration.requirements') }}</h4>
                    <p>{{ t('terms.registration.requirementsDesc') }}</p>
                    <h4>{{ t('terms.registration.verification') }}</h4>
                    <p>{{ t('terms.registration.verificationDesc') }}</p>
                  </template>
                  <template v-else-if="section === 'content'">
                    <h4>{{ t('terms.content.rules') }}</h4>
                    <p>{{ t('terms.content.rulesDesc') }}</p>
                    <h4>{{ t('terms.content.safety') }}</h4>
                    <p>{{ t('terms.content.safetyDesc') }}</p>
                  </template>
                  <template v-else-if="section === 'affiliates'">
                    <h4>{{ t('terms.affiliates.disclosure') }}</h4>
                    <p>{{ t('terms.affiliates.disclosureDesc') }}</p>
                    <h4>{{ t('terms.affiliates.commission') }}</h4>
                    <p>{{ t('terms.affiliates.commissionDesc') }}</p>
                  </template>
                  <template v-else-if="section === 'privacy'">
                    <h4>{{ t('terms.privacy.data') }}</h4>
                    <p>{{ t('terms.privacy.dataDesc') }}</p>
                    <h4>{{ t('terms.privacy.location') }}</h4>
                    <p>{{ t('terms.privacy.locationDesc') }}</p>
                  </template>
                  <template v-else-if="section === 'liability'">
                    <h4>{{ t('terms.liability.disclaimer') }}</h4>
                    <p>{{ t('terms.liability.disclaimerDesc') }}</p>
                    <h4>{{ t('terms.liability.compliance') }}</h4>
                    <p>{{ t('terms.liability.complianceDesc') }}</p>
                  </template>
                  <template v-else-if="section === 'offers'">
                    <h4>{{ t('terms.offers.conditions') }}</h4>
                    <p>{{ t('terms.offers.conditionsDesc') }}</p>
                    <h4>{{ t('terms.offers.validity') }}</h4>
                    <p>{{ t('terms.offers.validityDesc') }}</p>
                  </template>
                  <template v-else-if="section === 'modifications'">
                    <h4>{{ t('terms.modifications.changes') }}</h4>
                    <p>{{ t('terms.modifications.changesDesc') }}</p>
                    <h4>{{ t('terms.modifications.termination') }}</h4>
                    <p>{{ t('terms.modifications.terminationDesc') }}</p>
                  </template>
                </div>
              </BaseCard>
            </div>
          </div>

          <!-- Botones del modal -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              @click="showTermsModal = false"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>