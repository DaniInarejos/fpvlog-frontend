<script setup>
import { ref, onMounted, watch } from 'vue' 
import { useI18n } from 'vue-i18n'
import { useUserStore } from '../../stores/user'
import BaseInput from '../base/BaseInput.vue'
import BaseSelect from '../base/BaseSelect.vue' 
import BaseButton from '../base/BaseButton.vue'
import BaseAlert from '../base/BaseAlert.vue'
import BaseCard from '../base/BaseCard.vue'
import droneService from '../../services/droneService'
import componentService from '../../services/componentService'
import BaseCheckbox from '../base/BaseCheckbox.vue'
import BaseDivider from '../base/BaseDivider.vue'
import BaseImageUpload from '../base/BaseImageUpload.vue'

const props = defineProps({
  drone: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const { t } = useI18n()
const isLoading = ref(false)
const droneTypes = ref([])
const droneBrands = ref([])
const imageFile = ref(null)
const errors = ref({})

const formData = ref({
  name: '',
  typeId: '',
  brandId: '',
  originType: 'BRANDED',
  model: '',
  weight: '',
  frameSize: '',
  notes: '',
  description: '',
  visibility: {
    isVisibleToFollowers: true,
    isPublic: false
  },
  components: {
    frameId: null,
    motors: [],
    flightControllerId: null,
    escId: null,
    vtxId: null,
    cameraId: null,
    antennaId: null,
    receiverId: null,
    batteryId: null,
    propsId: null,
    mountId: null,
    others: []
  },
  betaflightId: null
})
const handleCreateComponent = async (typeComponent, inputValue) => {
  try {
    const newComponent = {
      name: inputValue, 
      type: typeComponent,
      createdBy: userStore.user._id
    }
    
    const createdComponent = await componentService.createComponent(newComponent)
    
    if (createdComponent) {
      components.value[typeComponent] = [...components.value[typeComponent], createdComponent]
      formData.value.components[typeComponent.toLowerCase() + 'Id'] = createdComponent._id
    }
  } catch (error) {
    errors.value.components = t('message.components.error.create')
  }
}
const fetchDroneTypes = async () => {
  try {
    droneTypes.value = await droneService.getDroneTypes()
  } catch (error) {
    errors.value.types = 'Error cargando tipos de drones'
  }
}

const fetchDroneBrands = async () => {
  try {
    droneBrands.value = await droneService.getDroneBrands()
  } catch (error) {
    errors.value.brands = 'Error cargando marcas de drones'
  }
}

const validateForm = () => {
  errors.value = {}
  if (!formData.value.name) errors.value.name = t('message.drones.validation.name')
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  try {
    let droneId
    if (props.drone) {
      await droneService.updateDrone(props.drone._id, formData.value)
      droneId = props.drone._id
    } else {
      const newDrone = await droneService.createDrone(formData.value)
      droneId = newDrone._id
    }
    
    if (imageFile.value) {
      const imageFormData = new FormData()
      imageFormData.append('image', imageFile.value)
      await droneService.uploadDroneImage(droneId, imageFormData)
    }
    
    emit('saved')
  } catch (error) {
    errors.value.submit = error.message
  } finally {
    isLoading.value = false
  }
}

const userStore = useUserStore()
const components = ref({
  FRAME: [],
  MOTOR: [],
  ESC: [],
  FC: [],
  CAMERA: [],
  VTX: [],
  ANTENNA: [],
  RECEIVER: [],
  BATTERY: [],
  PROPS: [],
  MOUNT: [],
  OTHER: []
})

const fetchUserComponents = async () => {
  try {
    const response = await componentService.getUserComponents(userStore.user._id)
    if (response) {
      components.value = {
        FRAME: response.FRAME || [],
        MOTOR: response.MOTOR || [],
        ESC: response.ESC || [],
        FC: response.FC || [],
        CAMERA: response.CAMERA || [],
        VTX: response.VTX || [],
        ANTENNA: response.ANTENNA || [],
        RECEIVER: response.RECEIVER || [],
        BATTERY: response.BATTERY || [],
        PROPS: response.PROPS || [],
        MOUNT: response.MOUNT || [],
        OTHER: response.OTHER || []
      }
    }
  } catch (error) {
    errors.value.components = 'Error cargando componentes'
  }
}

onMounted(() => {
  if (props.drone) {
    formData.value = { 
      ...props.drone,
      originType: props.drone.originType || 'BRANDED',
      components: {
        frameId: props.drone.components?.frameId || null,
        motors: props.drone.components?.motors || [],
        flightControllerId: props.drone.components?.flightControllerId || null,
        escId: props.drone.components?.escId || null,
        vtxId: props.drone.components?.vtxId || null,
        cameraId: props.drone.components?.cameraId || null,
        antennaId: props.drone.components?.antennaId || null,
        receiverId: props.drone.components?.receiverId || null,
        batteryId: props.drone.components?.batteryId || null,
        propsId: props.drone.components?.propsId || null,
        mountId: props.drone.components?.mountId || null,
        others: props.drone.components?.others || []
      }
    }
  }
  fetchDroneTypes()
  fetchDroneBrands()
  fetchUserComponents()
})

// Agregar después de la definición de formData
watch(() => formData.value.originType, (newValue) => {
  if (newValue !== 'BRANDED') {
    formData.value.brandId = null
    formData.value.model = ''
  }
  if(newValue !== 'CUSTOM') {
    // Asegurarse de que todos los componentes se reseteen a null o array vacío según corresponda
    formData.value.components = {
      frameId: null,
      motors: [],
      flightControllerId: null,
      escId: null,
      vtxId: null,
      cameraId: null,
      antennaId: null,
      receiverId: null,
      batteryId: null,
      propsId: null,
      mountId: null,
      others: []
    }
  }
})

const handleImageUpload = async (file) => {
  try {
    const formData = new FormData()
    formData.append('image', file)
    
    if (props.drone?._id) {
      await droneService.uploadDroneImage(props.drone._id, formData)
    } else {
      formData.value.imageFile = file
    }
  } catch (err) {
    error.value = t('message.drones.form.imageError')
  }
}
</script>

<template>
  <BaseCard class="p-6">
    <h2 class="text-xl font-semibold mb-4">
      {{ props.drone ? t('message.drones.editDrone') : t('message.drones.newDrone') }}
    </h2>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <BaseAlert
        v-if="errors.submit"
        type="error"
        :message="errors.submit"
      />
    <BaseDivider title="Informacion Basica" />    
     <BaseImageUpload
          v-model="formData.image"
          :alt="formData.name || t('message.drones.form.droneImage')"
          @file-selected="handleImageUpload"
        />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Campos básicos -->
         
        <BaseInput
          v-model="formData.name"
          :label="t('message.drones.form.name')"
          :error="errors.name"
          required
        />
        <BaseSelect
          v-model="formData.typeId"
          :label="t('message.drones.form.type')"
          :options="droneTypes"
          :error="errors.typeId"
          required
        />
        
         <BaseInput
          v-model="formData.weight"
          :label="t('message.drones.form.weight')"
          type="number"
        />

        <BaseInput
          v-model="formData.frameSize"
          :label="t('message.drones.form.frameSize')"
          type="number"
        />
      </div>
        <BaseInput
          :label="t('message.drones.form.description')"
          v-model="formData.description"
          type="textarea"
        />
           <BaseDivider title="Privacidad" />    

        <div class="md:col-span-2 space-y-2">
          <BaseCheckbox
            v-model="formData.visibility.isVisibleToFollowers"
            :label="t('message.drones.form.visibility.followers')"
          />
          <BaseCheckbox
            v-model="formData.visibility.isPublic"
            :label="t('message.drones.form.visibility.public')"
          />
        </div>

        <BaseDivider title="Informacion Avanzada" />    

        <BaseSelect
          v-model="formData.originType"
          :label="t('message.drones.form.originType')"
          :options="[
            { name: 'BRANDED', label: 'Marca Comercial' },
            { name: 'CUSTOM', label: 'Personalizado' }
          ]"
          :error="errors.originType"
          required
        />

        <BaseSelect
        v-if="formData.originType === 'BRANDED'"
          v-model="formData.brandId"
          :class="{ 'border-red-500': errors.brandId }"
          :label="t('message.drones.form.brand')"
          :options="droneBrands"
          :error="errors.brandId"
          required
        />
      
        <BaseInput
         v-if="formData.originType === 'BRANDED'"
          v-model="formData.model"
          :label="t('message.drones.form.model')"
        />
       

      <!-- Sección de componentes (solo visible si es CUSTOM) -->
      <div v-if="formData.originType === 'CUSTOM'" class="space-y-4 mt-6">
        <h3 class="text-lg font-medium">{{ t('message.drones.form.components') }}</h3>
        
        <div v-if="errors.components" class="text-red-600 text-sm mb-4">
          {{ errors.components }}
        </div>

        <div class="space-y-4">
          <!-- Frame -->
          <BaseSelect
            v-model="formData.components.frameId"
            label="Frame"
            :options="components.FRAME"
            :error="errors.frameId"
            placeholder="Seleccionar Frame"
            filterable
            canCreate
            @create="(value) => handleCreateComponent('FRAME', value)"
          />

          <!-- Motors -->
          <BaseSelect
            v-model="formData.components.motors"
            label="Motors"
            :options="components.MOTOR"
            :error="errors.motors"
            placeholder="Seleccionar Motors"
            filterable
            canCreate
            @create="(value) => handleCreateComponent('MOTOR', value)"
          />
          <BaseSelect
            v-model="formData.components.esc"
            label="ESC"
            :options="components.ESC"
            :error="errors.esc"
            placeholder="Seleccionar ESC"
            filterable
            canCreate
            @create="(value) => handleCreateComponent('ESC', value)"
          />
          <!-- FC -->
          <BaseSelect
            v-model="formData.components.fc"
            label="FC"
            :options="components.FC"
            :error="errors.fc"
            placeholder="Seleccionar FC"
            filterable
            canCreate
            @create="(value) => handleCreateComponent('FC', value)"
          />
          <!-- VTX -->
          <BaseSelect
            v-model="formData.components.vtx"
            label="VTX"
            :options="components.VTX"
            :error="errors.vtx"
            placeholder="Seleccionar VTX"
            filterable
            canCreate
            @create="(value) => handleCreateComponent('VTX', value)"
          />
          <!-- ANTENNA -->
          <BaseSelect
            v-model="formData.components.antenna"
            label="ANTENNA"
            :options="components.ANTENNA"
            :error="errors.antenna"
            placeholder="Seleccionar ANTENNA"
            filterable
            canCreate
            @create="(value) => handleCreateComponent('ANTENNA', value)"
          />
          <!-- RECEIVER -->
          <BaseSelect
            v-model="formData.components.receiver"
            label="RECEIVER"
            :options="components.RECEIVER"
            :error="errors.receiver"
            placeholder="Seleccionar RECEIVER"
            filterable
            canCreate
            @create="(value) => handleCreateComponent('RECEIVER', value)"
          />
          <!-- BATTERY -->
          <BaseSelect
            v-model="formData.components.battery"
            label="BATTERY"
            :options="components.BATTERY"
            :error="errors.battery"
            placeholder="Seleccionar BATTERY"
            filterable
            canCreate
            @create="(value) => handleCreateComponent('BATTERY', value)"
          />
          <!-- PROPS -->
          <BaseSelect
            v-model="formData.components.props"
            label="PROPS"
            :options="components.PROPS"
            :error="errors.props"
            placeholder="Seleccionar PROPS"
            filterable
            canCreate
            @create="(value) => handleCreateComponent('PROPS', value)"
          />
          <!-- MOUNT -->
          <BaseSelect
            v-model="formData.components.mount"
            label="MOUNT"
            :options="components.MOUNT"
            :error="errors.mount"
            placeholder="Seleccionar MOUNT"
            filterable
            canCreate
            @create="(value) => handleCreateComponent('MOUNT', value)"
          />    
          <!-- OTHER -->
          <BaseSelect
            v-model="formData.components.others"
            label="OTHERS"
            :options="components.OTHER"
            :error="errors.other"
            placeholder="Seleccionar OTHERS"
            filterable
            canCreate
            @create="(value) => handleCreateComponent('OTHER', value)"
          />    
         
        </div>
      </div>

      <!-- Selector de imagen -->
     

      <!-- Botones de acción -->
      <div class="flex justify-end space-x-4 mt-6">
        <BaseButton
          type="button"
          variant="secondary"
          @click="emit('close')"
        >
          {{ t('message.common.cancel') }}
        </BaseButton>

        <BaseButton
          type="submit"
          :loading="isLoading"
        >
          {{ props.drone ? t('message.common.save') : t('message.drones.addDrone') }}
        </BaseButton>
      </div>
    </form>
  </BaseCard>
</template>