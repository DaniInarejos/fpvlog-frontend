# Style Guidelines

## Tailwind CSS Usage

### Base Configuration
- Use the project's Tailwind configuration file as the single source of truth
- Extend the theme only through `tailwind.config.js`
- Keep the base layer modifications minimal

### Color System
```js
// Primary Colors
primary: {
  50: '#f0f9ff',  // Lightest
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9', // Base
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e', // Darkest
}
```

### Utility Classes

#### Layout
- Use `container` class for main content wrappers
- Apply `mx-auto` for centered content
- Use `space-y-{size}` for vertical spacing
- Use `gap-{size}` for grid and flex spacing

#### Components
- Use `card` class for card-like elements:
  ```css
  .card {
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-md p-4;
  }
  ```
- Use `btn` classes for buttons:
  ```css
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-all duration-200;
  }
  
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-600 text-white;
  }
  ```

## Theme System

### Dark Mode
- Use `dark:` prefix for dark mode variants
- Follow this color mapping:
  - Background: `bg-gray-100 dark:bg-gray-900`
  - Text: `text-gray-800 dark:text-gray-200`
  - Cards: `bg-white dark:bg-gray-800`
  - Borders: `border-gray-300 dark:border-gray-600`

### CSS Variables
```css
:root {
  --primary: #3b82f6;
  --primary-dark: #2563eb;
  --secondary: #8b5cf6;
  --secondary-dark: #7c3aed;
  --text-primary: #1f2937;
  --text-secondary: #4b5563;
  --background: #f9fafb;
  --card-bg: #ffffff;
}
```

## Responsive Design

### Breakpoints
```js
screens: {
  'sm': '640px',   // Small devices
  'md': '768px',   // Medium devices
  'lg': '1024px',  // Large devices
  'xl': '1280px',  // Extra large devices
}
```

### Responsive Patterns
- Use mobile-first approach
- Stack elements vertically on mobile
- Use grid for responsive layouts:
  ```html
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  ```
- Adjust text sizes responsively:
  ```html
  <h1 class="text-xl md:text-2xl lg:text-3xl">
  ```

## Accessibility

### Color Contrast
- Maintain WCAG 2.1 AA standard minimum contrast ratios
- Use Tailwind's color scale appropriately:
  - Text on light: `text-gray-800`
  - Text on dark: `text-gray-200`

### Interactive Elements
- Ensure visible focus states:
  ```css
  .input {
    @apply focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none;
  }
  ```
- Provide hover states for interactive elements:
  ```css
  .link {
    @apply hover:text-blue-600 transition-colors;
  }
  ```

### Form Elements
- Use semantic HTML elements
- Provide clear focus indicators
- Include proper ARIA labels
- Style form elements consistently:
  ```css
  .input {
    @apply w-full px-4 py-2 rounded-lg border border-gray-300 
           dark:border-gray-600 bg-white dark:bg-gray-700 
           focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
  ```

## Animation and Transitions

### Default Transitions
- Use consistent durations:
  ```css
  .transition-default {
    @apply transition-all duration-200;
  }
  ```
- Apply to interactive elements:
  ```css
  .btn {
    @apply transition-colors duration-200;
  }
  ```

### Loading States
- Use consistent loading indicators
- Maintain layout stability during loading
- Provide visual feedback for actions

## Icons and Images

### Icon System
- Use consistent icon sizes
- Maintain alignment with text
- Provide appropriate padding

### Images
- Use responsive image classes
- Implement lazy loading
- Provide fallbacks and alt text