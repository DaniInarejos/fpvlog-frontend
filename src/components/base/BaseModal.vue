<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import BaseButton from './BaseButton.vue'

const props = defineProps({
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
  showCloseButton: {
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
  },
  closeOnClickOutside: {
    type: Boolean,
    default: true
  },
  requireDoubleClick: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'confirm', 'accept'])

// Estado para manejar el doble click
const clickCount = ref(0)
const clickTimer = ref(null)

// Función para manejar el clic en el overlay
const handleOverlayClick = (event) => {
  // Solo procesar si se hace clic directamente en el overlay (no en el contenido del modal)
  if (!props.closeOnClickOutside || event.target !== event.currentTarget) {
    return
  }

  if (props.requireDoubleClick) {
    clickCount.value++
    
    if (clickCount.value === 1) {
      // Primer click - iniciar timer
      clickTimer.value = setTimeout(() => {
        clickCount.value = 0
      }, 300) // 300ms para detectar doble click
    } else if (clickCount.value === 2) {
      // Segundo click - cerrar modal
      clearTimeout(clickTimer.value)
      clickCount.value = 0
      emit('close')
    }
  } else {
    // Comportamiento normal - cerrar con un click
    emit('close')
  }
}
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
    <div 
      v-if="show" 
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="handleOverlayClick"
    >
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/60 backdrop-blur-md transition-all duration-300" />
      
      <!-- Modal container -->
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <Transition
          enter-active-class="ease-out duration-300"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            v-if="show"
            class="relative transform overflow-hidden rounded-xl bg-card/95 backdrop-blur-xl border border-border/50 text-left shadow-2xl shadow-black/25 transition-all sm:my-8 w-full ring-1 ring-white/10"
            :class="{
              'sm:max-w-lg sm:p-6 px-4 pb-4 pt-5': size === 'default',
              'sm:max-w-4xl sm:max-h-[85vh] sm:p-8 px-6 pb-6 pt-6 overflow-y-auto': size === 'full'
            }"
            @click.stop
          >
            <!-- Botón de cerrar -->
            <button
              v-if="showCloseButton"
              @click="emit('close')"
              class="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors duration-200 p-1 rounded-full hover:bg-muted z-10"
              aria-label="Cerrar modal"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <div class="sm:flex sm:items-start">
              <div v-if="showWarningIcon" class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-destructive/10 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <!-- Header personalizable -->
                <slot name="header">
                  <h3 class="text-base font-semibold leading-6 text-foreground">
                    {{ title }}
                  </h3>
                </slot>
                
                <!-- Contenido del modal -->
                <div class="mt-2">
                  <slot></slot>
                </div>
              </div>
            </div>
            
            <!-- Botones del footer -->
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
        </Transition>
      </div>
    </div>
  </Transition>
</template>