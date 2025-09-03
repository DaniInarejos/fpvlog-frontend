<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-foreground mb-2">
      {{ label }}
    </label>
    <div class="quill-wrapper" :class="wrapperClasses">
      <QuillEditor
        ref="quillEditor"
        v-model:content="content"
        :options="editorOptions"
        :style="{ minHeight: height + 'px' }"
        @textChange="handleTextChange"
        @blur="handleBlur"
        @ready="handleEditorReady"
        contentType="html"
      />
    </div>
    <div v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
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
const quillEditor = ref(null)

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
    ['link'],
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
    ['link', 'formula'],
    ['blockquote', 'code-block'],
    ['clean']
  ],
  forum: [
    [{ 'header': [2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link'],
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
  'border border-border rounded-xl shadow-sm overflow-hidden bg-card',
  'focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary',
  'transition-all duration-200',
  props.error ? 'border-red-500 focus-within:ring-red-500/20 focus-within:border-red-500' : ''
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

const handleEditorReady = (quill) => {
  // Configurar el manejo de pegado para HTML
  quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
    // Permitir que las etiquetas HTML básicas se mantengan
    const allowedTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'u', 'br']
    
    if (allowedTags.includes(node.tagName.toLowerCase())) {
      return delta
    }
    
    return delta
  })
  
  // Manejar pegado de HTML
  quill.root.addEventListener('paste', (e) => {
    const clipboardData = e.clipboardData || window.clipboardData
    const htmlData = clipboardData.getData('text/html')
    
    if (htmlData) {
      e.preventDefault()
      
      // Limpiar y procesar el HTML pegado
      const cleanHtml = cleanPastedHtml(htmlData)
      
      // Insertar el HTML limpio
      const range = quill.getSelection()
      if (range) {
        quill.clipboard.dangerouslyPasteHTML(range.index, cleanHtml)
      }
    }
  })
}

const cleanPastedHtml = (html) => {
  // Crear un elemento temporal para limpiar el HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  
  // Convertir etiquetas escapadas de vuelta a HTML
  let cleanedHtml = tempDiv.innerHTML
  
  // Decodificar entidades HTML comunes
  cleanedHtml = cleanedHtml
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
  
  return cleanedHtml
}
</script>

<style>
/* Estilos base para el editor */
.quill-wrapper .ql-toolbar {
  @apply bg-card border-b border-border;
}

.quill-wrapper .ql-container {
  @apply bg-slate-100 border-0;
}

.quill-wrapper .ql-editor {
  @apply text-gray-100 bg-slate-100;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  min-height: inherit;
}

.quill-wrapper .ql-editor.ql-blank::before {
  @apply text-gray-500;
  font-style: normal;
}

/* Estilos para la toolbar */
.quill-wrapper .ql-toolbar .ql-stroke {
  stroke: hsl(var(--foreground));
}

.quill-wrapper .ql-toolbar .ql-fill {
  fill: hsl(var(--foreground));
}

.quill-wrapper .ql-toolbar button:hover {
  @apply bg-slate-200;
}

.quill-wrapper .ql-toolbar button.ql-active {
  @apply bg-primary text-white;
}

.quill-wrapper .ql-toolbar button.ql-active .ql-stroke {
  stroke: white;
}

.quill-wrapper .ql-toolbar button.ql-active .ql-fill {
  fill: white;
}

/* Estilos para dropdowns */
.quill-wrapper .ql-picker {
  @apply text-foreground;
}

.quill-wrapper .ql-picker-options {
  @apply bg-white border border-border shadow-lg rounded-lg;
}

.quill-wrapper .ql-picker-item:hover {
  @apply bg-gray-100;
}

/* Mejorar contraste del contenido */
.quill-wrapper .ql-editor h1,
.quill-wrapper .ql-editor h2,
.quill-wrapper .ql-editor h3,
.quill-wrapper .ql-editor h4,
.quill-wrapper .ql-editor h5,
.quill-wrapper .ql-editor h6 {
  @apply text-gray-900 font-semibold;
}

.quill-wrapper .ql-editor p {
  @apply text-gray-900;
}

.quill-wrapper .ql-editor strong {
  @apply text-gray-900 font-semibold;
}

.quill-wrapper .ql-editor blockquote {
  @apply border-l-4 border-primary/30 bg-slate-200 text-gray-800 pl-4 py-2 my-2;
}

.quill-wrapper .ql-editor code {
  @apply bg-slate-200 text-gray-900 px-1 py-0.5 rounded text-sm;
}

.quill-wrapper .ql-editor pre {
  @apply bg-slate-200 text-gray-900 p-3 rounded-lg overflow-x-auto;
}

/* Estilos para listas */
.quill-wrapper .ql-editor ul,
.quill-wrapper .ql-editor ol {
  @apply text-gray-900;
}

.quill-wrapper .ql-editor li {
  @apply text-gray-900;
}

/* Enlaces */
.quill-wrapper .ql-editor a {
  @apply text-primary hover:text-primary/80 underline;
}
</style>
