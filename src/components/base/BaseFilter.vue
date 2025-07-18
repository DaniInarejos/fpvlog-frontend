<script setup>
import { ref, watch } from 'vue'
import BaseInput from './BaseInput.vue'
import BaseCheckbox from './BaseCheckbox.vue'

const props = defineProps({
  fields: {
    type: Array,
    required: true,
    default: () => []
  },
  fieldLabels: {
    type: Object,
    required: true,
    default: () => ({})
  },
  placeholder: {
    type: String,
    default: 'Buscar...'
  }
})

const emit = defineEmits(['filter-change'])

const searchText = ref('')
const selectedFields = ref([])

// Inicializar los campos seleccionados
selectedFields.value = props.fields.map(() => true)

// Observar cambios en el texto de búsqueda y campos seleccionados
watch([searchText, selectedFields], ([newSearchText, newSelectedFields]) => {
  emit('filter-change', {
    searchText: newSearchText,
    selectedFields: props.fields.filter((_, index) => newSelectedFields[index])
  })
}, { deep: true })
</script>

<template>
  <div class="space-y-4">
    <!-- Campo de búsqueda -->
    <BaseInput
      v-model="searchText"
      :placeholder="placeholder"
      class="w-full"
    />

    <!-- Lista de checkboxes -->
    <div class="flex flex-wrap gap-4">
      <div
        v-for="(field, index) in fields"
        :key="field"
        class="flex items-center"
      >
        <BaseCheckbox
          v-model="selectedFields[index]"
          :label="fieldLabels[field] || field"
        />
      </div>
    </div>
  </div>
</template>