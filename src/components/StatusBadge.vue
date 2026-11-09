<script setup>
import { computed } from 'vue'
import { badgeVariants, cn } from '@/lib/variants'
import { sanitizeHtml } from '@/composables/useFormatters'

const props = defineProps({
  qty: {
    type: Number,
    required: true,
  },
  safety: {
    type: Number,
    required: true,
  },
  catatanHTML: {
    type: String,
    default: '',
  },
})

// Hitung status stok
const status = computed(() => {
  if (props.qty === 0) return 'Kosong'
  if (props.qty < props.safety) return 'Menipis'
  return 'Aman'
})

// Sanitasi catatanHTML sebelum dirender ke tooltip
const sanitizedCatatan = computed(() => {
  return sanitizeHtml(props.catatanHTML) || '<em>Tidak ada catatan</em>'
})
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="relative inline-block group">
    <!-- Status Badge -->
    <span :class="cn(badgeVariants({ status }), 'cursor-pointer gap-1.5 select-none')">
      <!-- Icon Aman -->
      <svg
        v-if="status === 'Aman'"
        class="w-3.5 h-3.5 text-emerald-600 shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        />
      </svg>

      <!-- Icon Menipis -->
      <svg
        v-else-if="status === 'Menipis'"
        class="w-3.5 h-3.5 text-amber-600 shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>

      <!-- Icon Kosong -->
      <svg
        v-else
        class="w-3.5 h-3.5 text-rose-600 shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clip-rule="evenodd"
        />
      </svg>

      <span>{{ status }}</span>
    </span>

    <!-- Hover Tooltip Preview Catatan (Pemenuhan Soal Tugas 3 Hal 4) -->
    <div
      class="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 text-center"
      role="tooltip"
    >
      <div class="font-semibold text-slate-300 text-[10px] uppercase tracking-wider mb-1">
        Catatan Bahan Ajar
      </div>
      <!-- Disanitasi secara ketat via sanitizeHtml() di useFormatters.js (XSS Prevention) -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div
        class="text-slate-100 leading-snug"
        v-html="sanitizedCatatan"
      />
      <!-- Tooltip Arrow -->
      <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
    </div>
  </div>
</template>
