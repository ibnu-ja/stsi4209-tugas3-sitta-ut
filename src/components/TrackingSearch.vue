<script setup>
import { inputVariants, buttonVariants } from '@/lib/variants'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  statusFilter: {
    type: String,
    default: 'ALL',
  },
})

const emit = defineEmits(['update:modelValue', 'update:statusFilter', 'clear'])

function handleInput(event) {
  emit('update:modelValue', event.target.value)
}

function handleKeyDown(event) {
  if (event.key === 'Escape') {
    emit('clear')
  }
}
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
    <div class="flex flex-col sm:flex-row gap-3">
      <!-- Search Input -->
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          :value="modelValue"
          type="text"
          :class="[inputVariants(), 'pl-10 pr-9']"
          placeholder="Cari berdasarkan Nomor DO (contoh: DO2025-001), NIM, atau Nama Mahasiswa..."
          @input="handleInput"
          @keydown="handleKeyDown"
        >

        <button
          v-if="modelValue"
          type="button"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          title="Bersihkan pencarian (Esc)"
          @click="emit('clear')"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Clear Button if search query is active -->
      <button
        v-if="modelValue || statusFilter !== 'ALL'"
        type="button"
        :class="buttonVariants({ variant: 'secondary', size: 'md' })"
        @click="emit('clear')"
      >
        Reset Filter
      </button>
    </div>

    <!-- Quick Status Filter Pills -->
    <div class="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5 text-xs">
      <span class="text-slate-400 font-semibold uppercase tracking-wider text-[11px] mr-1 shrink-0">
        Status:
      </span>

      <button
        type="button"
        :class="[
          'px-3 py-1 rounded-full font-medium transition-colors shrink-0 cursor-pointer',
          statusFilter === 'ALL'
            ? 'bg-[#1859bc] text-white shadow-xs'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
        ]"
        @click="emit('update:statusFilter', 'ALL')"
      >
        Semua Pengiriman
      </button>

      <button
        type="button"
        :class="[
          'px-3 py-1 rounded-full font-medium transition-colors shrink-0 cursor-pointer',
          statusFilter === 'DIDAFTARKAN'
            ? 'bg-amber-600 text-white shadow-xs'
            : 'bg-amber-50 text-amber-700 hover:bg-amber-100',
        ]"
        @click="emit('update:statusFilter', 'DIDAFTARKAN')"
      >
        Didaftarkan / Dikemas
      </button>

      <button
        type="button"
        :class="[
          'px-3 py-1 rounded-full font-medium transition-colors shrink-0 cursor-pointer',
          statusFilter === 'PERJALANAN'
            ? 'bg-blue-600 text-white shadow-xs'
            : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
        ]"
        @click="emit('update:statusFilter', 'PERJALANAN')"
      >
        Dalam Perjalanan
      </button>

      <button
        type="button"
        :class="[
          'px-3 py-1 rounded-full font-medium transition-colors shrink-0 cursor-pointer',
          statusFilter === 'DITERIMA'
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
        ]"
        @click="emit('update:statusFilter', 'DITERIMA')"
      >
        Telah Diterima
      </button>
    </div>
  </div>
</template>
