<script setup>
import { onMounted, onUnmounted } from 'vue'
import { buttonVariants } from '@/lib/variants'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Konfirmasi Penghapusan',
  },
  message: {
    type: String,
    default: 'Apakah Anda yakin ingin menghapus data ini?',
  },
  itemName: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['confirm', 'cancel'])

function handleKeyDown(e) {
  if (e.key === 'Escape' && props.isOpen) {
    emit('cancel')
  }
}

onMounted(() => window.addEventListener('keydown', handleKeyDown))
onUnmounted(() => window.removeEventListener('keydown', handleKeyDown))
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      @click.self="emit('cancel')"
    >
      <div
        class="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 transform transition-all"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-800">
              {{ title }}
            </h3>
            <p class="text-xs text-slate-500">
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        </div>

        <p class="text-sm text-slate-600 mb-4">
          {{ message }}
          <span
            v-if="itemName"
            class="font-bold text-slate-800 block mt-1 bg-slate-50 p-2 rounded border border-slate-200"
          >
            {{ itemName }}
          </span>
        </p>

        <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            :class="buttonVariants({ variant: 'secondary', size: 'sm' })"
            @click="emit('cancel')"
          >
            Batal
          </button>
          <button
            type="button"
            :class="buttonVariants({ variant: 'danger', size: 'sm' })"
            @click="emit('confirm')"
          >
            Ya, Hapus Data
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
