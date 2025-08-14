<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {{ label }}
    </label>
    <div class="quill-wrapper" :class="wrapperClasses">
      <QuillEditor
        v-model:content="content"
        :options="editorOptions"
        :style="{ minHeight: height + 'px' }"
        @textChange="handleTextChange"
        @blur="handleBlur"
        contentType="html"
      />
    </div>
    <div v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  height: {
    type: Number,
    default: 200
  },
  toolbar: {
    type: String,
    default: 'basic'
  },
  plugins: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'blur'])

const content = ref(props.modelValue)

// Configuraciones de toolbar expandidas
const toolbarConfigs = {
  basic: [
    ['bold', 'italic', 'underline'],
    ['link'],
    ['clean']
  ],
  standard: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link'],
    ['clean']
  ],
  advanced: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    ['blockquote', 'code-block'],
    ['clean']
  ],
  full: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }, { 'size': [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'align': [] }],
    ['link', 'image', 'video', 'formula'],
    ['blockquote', 'code-block'],
    ['clean']
  ],
  forum: [
    [{ 'header': [2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'image'],
    ['blockquote', 'code-block'],
    [{ 'align': ['', 'center', 'right'] }],
    ['clean']
  ]
}

const editorOptions = computed(() => ({
  theme: 'snow',
  placeholder: props.placeholder,
  modules: {
    toolbar: toolbarConfigs[props.toolbar] || toolbarConfigs.basic
  }
}))

const wrapperClasses = computed(() => [
  'border border-gray-300 rounded-md shadow-sm overflow-hidden',
  'focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500',
  'dark:border-gray-600 dark:focus-within:ring-blue-400 dark:focus-within:border-blue-400',
  'transition-colors duration-200',
  props.error ? 'border-red-500 focus-within:ring-red-500 focus-within:border-red-500' : ''
])

const handleTextChange = () => {
  emit('update:modelValue', content.value)
}

const handleBlur = () => {
  emit('blur')
}

watch(() => props.modelValue, (newValue) => {
  if (newValue !== content.value) {
    content.value = newValue
  }
})
</script>

<style>
/* Estilos para el tema oscuro */
.dark .ql-toolbar {
  @apply bg-gray-700 border-gray-600;
}

.dark .ql-toolbar .ql-stroke {
  stroke: #e5e7eb;
}

.dark .ql-toolbar .ql-fill {
  fill: #e5e7eb;
}

.dark .ql-container {
  @apply bg-gray-800 border-gray-600 text-white;
}

.dark .ql-editor {
  @apply text-white;
}

.dark .ql-editor.ql-blank::before {
  @apply text-gray-400;
}

/* Estilos personalizados */
.quill-wrapper .ql-toolbar {
  @apply border-b border-gray-300 dark:border-gray-600;
}

.quill-wrapper .ql-container {
  @apply border-0;
}

.quill-wrapper .ql-editor {
  font-family: -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  font-size: 14px;
  line-height: 1.5;
}

/* Ajustar altura mínima */
.quill-wrapper .ql-editor {
  min-height: inherit;
}
</style>
