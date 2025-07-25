<script setup>
import { defineProps, defineEmits } from 'vue'
import BaseButton from './BaseButton.vue'

defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  showAcceptButton: {
    type: Boolean,
    default: true
  },
  showCancelButton: {
    type: Boolean,
    default: true
  },
  showDeleteButton: {
    type: Boolean,
    default: false
  },
  acceptButtonText: {
    type: String,
    default: 'Aceptar'
  },
  cancelButtonText: {
    type: String,
    default: 'Cancelar'
  },
  deleteButtonText: {
    type: String,
    default: 'Eliminar'
  },
  showWarningIcon: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'full'].includes(value)
  }
})

const emit = defineEmits(['close', 'confirm', 'accept'])
</script>

<template>
  <Transition
    enter-active-class="ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-40" />
  </Transition>

  <Transition
    enter-active-class="ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    enter-to-class="opacity-100 translate-y-0 sm:scale-100"
    leave-active-class="ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0 sm:scale-100"
    leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  >
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full"
          :class="{
            'sm:max-w-lg sm:p-6 px-4 pb-4 pt-5': size === 'default',
            'sm:max-w-[95%] sm:p-8 px-6 pb-6 pt-6': size === 'full'
          }"
        >
          <div class="sm:flex sm:items-start">
            <div v-if="showWarningIcon" class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 class="text-base font-semibold leading-6 text-gray-900">
                {{ title }}
              </h3>
              <div class="mt-2">
                <slot></slot>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
            <BaseButton
              v-if="showDeleteButton"
              variant="danger"
              @click="emit('confirm')"
            >
              {{ deleteButtonText }}
            </BaseButton>
            <BaseButton
              v-if="showAcceptButton"
              variant="primary"
              @click="emit('close')"
            >
              {{ acceptButtonText }}
            </BaseButton>
            <BaseButton
              v-if="showCancelButton"
              variant="secondary"
              @click="emit('close')"
            >
              {{ cancelButtonText }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>