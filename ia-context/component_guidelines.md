# Vue 3 Component Guidelines

## Base Component Structure

### File Organization
- One component per file
- Use PascalCase for filenames (e.g., `UserProfile.vue`)
- Use descriptive names that indicate functionality

### Component Structure
```vue
<script setup>
// 1. Imports
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// 2. Props and Emits
const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update'])

// 3. Composables
const { t } = useI18n()

// 4. References and State
const isLoading = ref(false)

// 5. Computed Properties
const formattedTitle = computed(() => props.title.toUpperCase())

// 6. Methods
const handleUpdate = () => {
  emit('update')
}

// 7. Lifecycle Hooks
onMounted(() => {
  // Initialization
})
</script>

<template>
  <div class="component-wrapper">
    <!-- Component content -->
  </div>
</template>
```

## Best Practices

### Props
- Define explicit types and validations
- Use descriptive camelCase names
- Document each prop's purpose
- Set default values when appropriate

### Emits
- Declare all emitted events
- Use descriptive kebab-case names
- Document emitted data structure
- Validate data before emitting

### Composables
- Extract reusable logic into composables
- Keep composables focused on single functionality
- Name with 'use' prefix (e.g., `useUserData`)
- Document parameters and return values

### State and References
- Use `ref()` for primitive values
- Use `reactive()` for complex objects
- Avoid direct state mutations
- Keep state as simple as possible

### Computed Properties
- Use for data transformations
- Keep logic simple and focused
- Avoid side effects
- Use descriptive naming

### Methods
- Small, focused functions
- Descriptive camelCase names
- Document parameters and behavior
- Handle errors appropriately

## Design Patterns

### Base Components
- Create reusable base components
- Maintain consistent API
- Document usage and examples
- Place in `components/base` folder

### Component Composition
- Prefer composition over inheritance
- Use slots for flexible content
- Implement conditional rendering patterns
- Maintain clear component hierarchy

### Form Handling
- Use v-model for two-way binding
- Implement form validation
- Handle loading and error states
- Provide user feedback

## Optimization

### Performance
- Use `v-show` for frequent toggles
- Implement lazy loading when appropriate
- Avoid unnecessary computations
- Use `v-once` for static content

### Maintainability
- Follow consistent structure
- Document design decisions
- Keep code DRY
- Implement unit tests

## Accessibility

### Basic Practices
- Use semantic elements
- Provide alternative texts
- Implement keyboard navigation
- Maintain adequate contrast

### ARIA
- Use appropriate ARIA roles and attributes
- Implement live regions when needed
- Maintain clear heading structure
- Provide action feedback

## Internationalization

### i18n
- Use the `useI18n` composable
- Extract all text to translation files
- Keep translation keys organized
- Handle pluralization and formats