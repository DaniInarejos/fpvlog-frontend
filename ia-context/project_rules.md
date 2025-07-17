# Project Rules and AI Development Guidelines

## Purpose
This document defines the fundamental rules and coding style that the AI must follow to maintain a consistent, clean, and maintainable codebase throughout the project.

## General Principles
- Follow Vue 3 Composition API style consistently.
- Use TypeScript where applicable (if used in the project).
- Maintain clear separation of concerns in components.
- Use descriptive and consistent naming conventions.
- Keep components small and focused.
- Use Tailwind CSS utility classes for styling.
- Ensure accessibility best practices.
- Write comments only where necessary to explain complex logic.

## Component Development
- Use `<script setup>` syntax.
- Define props and emits explicitly.
- Use composables and stores for shared state.
- Use Base components for reusable UI elements.

## State Management
- Use Pinia or Vuex stores consistently.
- Keep stores modular and focused.

## API and Services
- Use centralized service files for API calls.
- Handle errors gracefully and provide user feedback.

## Code Reviews
- Ensure code follows these guidelines.
- Check for performance and security issues.