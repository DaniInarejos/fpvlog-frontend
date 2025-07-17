# Internationalization (i18n) Guidelines

## Translation Structure

### Directory Organization
The file structure for translations is organized as follows:

src/locales/
├── common/              # Shared common translations
│   ├── en.js           # English
│   └── es.js           # Spanish
├── views/              # View-specific translations
│   ├── flights/        # Translations for flights view
│   │   ├── en.js
│   │   └── es.js
│   ├── drones/         # Translations for drones view
│   │   ├── en.js
│   │   └── es.js
│   └── spots/          # Translations for spots view
│       ├── en.js
│       └── es.js
└── index.js           # i18n configuration and translation loading

### Translation File Structure

Each translation file must follow a clear hierarchical structure:

```javascript
// src/locales/views/flights/en.js
export default {
  title: "Flight Log",
  form: {
    labels: {
      date: "Flight Date",
      duration: "Duration",
      location: "Location"
    },
    buttons: {
      save: "Save Flight",
      cancel: "Cancel"
    },
    validation: {
      required: "This field is required"
    }
  },
  list: {
    empty: "No flights recorded",
    count: "No flights | One flight | {n} flights"
  }
}
```

## Key Naming Conventions

### General Rules

1. Use camelCase for key names
2. Keep keys descriptive but concise
3. Avoid excessive nesting (maximum 3 levels)
4. Use consistent names across views

### Naming Pattern

- For common keys: `common.{category}.{element}.{state}`
- For views: `{view}.{section}.{element}.{state}`

### Usage Examples

```javascript
// src/locales/common/en.js
export default {
  buttons: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete"
  },
  validation: {
    required: "This field is required",
    email: "Please enter a valid email"
  }
}

// src/locales/views/drones/en.js
export default {
  form: {
    title: "Drone Details",
    submitButton: {
      default: "Save Drone",
      loading: "Saving...",
      success: "Drone Saved!"
    }
  }
}
```

## Translation Loading

### Lazy Loading by View

```javascript
// src/locales/index.js
import common_en from './common/en'
import common_es from './common/es'

export const loadViewTranslations = async (viewName, lang) => {
  const messages = await import(`./views/${viewName}/${lang}.js`)
  i18n.mergeLocaleMessage(lang, {
    [viewName]: messages.default
  })
}

export default {
  locale: 'es',
  fallbackLocale: 'en',
  messages: {
    en: { common: common_en },
    es: { common: common_es }
  }
}
```

## Best Practices

### 1. Component Usage

```vue
<template>
  <div>
    <h1>{{ $t('flights.title') }}</h1>
    <p>{{ $tc('flights.list.count', totalFlights) }}</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { loadViewTranslations } from '@/locales'

onMounted(async () => {
  await loadViewTranslations('flights', i18n.locale)
})
</script>
```

### 2. Maintenance

- Organize translations by view for better maintainability
- Keep common translations centralized
- Document structure and conventions per view
- Perform periodic reviews of unused translations
- Maintain consistency in capitalization and punctuation

### 3. Version Control

- Maintain a changelog per view
- Document important structure changes
- Coordinate updates between related views

### 4. Performance

- Load translations on demand by view
- Keep common translations always available
- Optimize translation file sizes
- Implement translation cache