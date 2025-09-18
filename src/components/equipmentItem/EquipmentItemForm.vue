<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '../base/BaseCard.vue'
import BaseInput from '../base/BaseInput.vue'
import BaseSelect from '../base/BaseSelect.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseAlert from '../base/BaseAlert.vue'
import equipmentItemService from '../../services/equipmentItemService'
import { useUserStore } from '../../stores/user'
import { EQUIPMENT_TYPES, EQUIPMENT_CONDITIONS } from '../../types/equipmentItem'

const props = defineProps({
  selectedType: {
    type: String,
    required: true
  },
  equipmentItem: {
    type: Object,
    default: null
  }
})

const userStore = useUserStore()
const emit = defineEmits(['close', 'saved'])
const { t } = useI18n()
const isLoading = ref(false)
const errors = ref({})

const formData = ref({
  name: props.equipmentItem?.name || '',
  type: props.equipmentItem?.type || props.selectedType,
  brand: props.equipmentItem?.brand || '',
  model: props.equipmentItem?.model || '',
  price: props.equipmentItem?.price || '',
  currency: props.equipmentItem?.currency || 'EUR',
  condition: props.equipmentItem?.condition || 'NEW',
  description: props.equipmentItem?.description || '',
  sourceUrl: props.equipmentItem?.sourceUrl || '',
  serialNumber: props.equipmentItem?.serialNumber || '',
  purchaseDate: props.equipmentItem?.purchaseDate ? new Date(props.equipmentItem.purchaseDate).toISOString().split('T')[0] : '',
  createdBy: userStore.user._id
})

// Opciones para los selects
const typeOptions = Object.keys(EQUIPMENT_TYPES).map(key => ({
  _id: key,
  name: t(`equipmentItems.types.${key.toLowerCase()}`)
}))

const conditionOptions = Object.keys(EQUIPMENT_CONDITIONS).map(key => ({
  _id: key,
  name: t(`equipmentItems.conditions.${key.toLowerCase()}`)
}))

const currencyOptions = [
  { _id: 'EUR', name: 'EUR (€)' },
  { _id: 'USD', name: 'USD ($)' },
  { _id: 'GBP', name: 'GBP (£)' }
]

const validateForm = () => {
  errors.value = {}
  if (!formData.value.name) errors.value.name = t('equipmentItems.validation.nameRequired')
  if (!formData.value.type) errors.value.type = t('equipmentItems.validation.typeRequired')
  if (formData.value.price && isNaN(Number(formData.value.price))) {
    errors.value.price = t('equipmentItems.validation.priceInvalid')
  }
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  try {
    const formDataToSubmit = {
      ...formData.value,
      price: formData.value.price ? Number(formData.value.price) : null,
      purchaseDate: formData.value.purchaseDate ? new Date(formData.value.purchaseDate) : null
    }

    if (props.equipmentItem) {
      await equipmentItemService.updateEquipmentItem(props.equipmentItem._id, formDataToSubmit)
    } else {
      await equipmentItemService.createUserEquipmentItem(userStore.user._id, formDataToSubmit)
    }
    emit('saved')
  } catch (error) {
    errors.value.submit = error.message
  } finally {
    isLoading.value = false
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <BaseCard class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">
        {{ props.equipmentItem ? t('equipmentItems.editItem') : t('equipmentItems.addItem') }} 
        - {{ t(`equipmentItems.types.${selectedCategory.toLowerCase()}`) }}
      </h2>
      <BaseButton
        variant="ghost"
        @click="handleClose"
        class="text-gray-500 hover:text-gray-700"
      >
        ✕
      </BaseButton>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <BaseAlert
        v-if="errors.submit"
        type="error"
        :message="errors.submit"
      />

      <!-- Información básica -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseInput
          v-model="formData.name"
          :label="t('equipmentItems.form.name')"
          :placeholder="t('equipmentItems.form.placeholders.name')"
          :error="errors.name"
          required
        />

        <BaseSelect
          v-model="formData.type"
          :options="typeOptions"
          :label="t('equipmentItems.form.type')"
          :placeholder="t('equipmentItems.form.typePlaceholder')"
          :error="errors.type"
          required
        />
      </div>

      <!-- Marca y modelo -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseInput
          v-model="formData.brand"
          :label="t('equipmentItems.form.brand')"
          :placeholder="t('equipmentItems.form.placeholders.brand')"
        />

        <BaseInput
          v-model="formData.model"
          :label="t('equipmentItems.form.model')"
          :placeholder="t('equipmentItems.form.placeholders.model')"
        />
      </div>

      <!-- Precio y condición -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BaseInput
          v-model="formData.price"
          type="number"
          step="0.01"
          :label="t('equipmentItems.form.price')"
          :placeholder="t('equipmentItems.form.placeholders.price')"
          :error="errors.price"
        />

        <BaseSelect
          v-model="formData.currency"
          :options="currencyOptions"
          :label="t('equipmentItems.form.currency')"
        />

        <BaseSelect
          v-model="formData.condition"
          :options="conditionOptions"
          :label="t('equipmentItems.form.condition')"
        />
      </div>

      <!-- Información adicional -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseInput
          v-model="formData.serialNumber"
          :label="t('equipmentItems.form.serialNumber')"
          :placeholder="t('equipmentItems.form.placeholders.serialNumber')"
        />

        <BaseInput
          v-model="formData.purchaseDate"
          type="date"
          :label="t('equipmentItems.form.purchaseDate')"
        />
      </div>

      <!-- URL de compra -->
      <BaseInput
        v-model="formData.sourceUrl"
        type="url"
        :label="t('equipmentItems.form.sourceUrl')"
        :placeholder="t('equipmentItems.form.placeholders.sourceUrl')"
      />

      <!-- Descripción -->
      <BaseInput
        v-model="formData.description"
        type="textarea"
        :label="t('equipmentItems.form.description')"
        :placeholder="t('equipmentItems.form.placeholders.description')"
        rows="3"
      />

      <!-- Botones de acción -->
      <div class="flex justify-end space-x-3 pt-4">
        <BaseButton
          type="button"
          variant="secondary"
          @click="handleClose"
          :disabled="isLoading"
        >
          {{ t('common.cancel') }}
        </BaseButton>
        
        <BaseButton
          type="submit"
          :loading="isLoading"
          :disabled="isLoading"
        >
          {{ props.equipmentItem ? t('common.update') : t('common.create') }}
        </BaseButton>
      </div>
    </form>
  </BaseCard>
</template>