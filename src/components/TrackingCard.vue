<script setup>
import { ref } from 'vue'
import { formatRupiah, formatTanggal } from '@/composables/useFormatters'
import { buttonVariants, inputVariants } from '@/lib/variants'

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['add-progress'])

const isAddingStatus = ref(false)
const newKeterangan = ref('')
const errorMessage = ref('')

function handleAddStatus() {
  const trimmed = newKeterangan.value.trim()
  if (!trimmed) {
    errorMessage.value = 'Keterangan status tidak boleh kosong.'
    return
  }

  emit('add-progress', {
    nomorDO: props.order.nomorDO,
    keterangan: trimmed,
  })

  newKeterangan.value = ''
  errorMessage.value = ''
  isAddingStatus.value = false
}

// Status Color Helper
function getStatusBadgeClass(status, progress) {
  if (progress >= 100 || status.toLowerCase().includes('diterima')) {
    return 'bg-emerald-100 text-emerald-800 border-emerald-200'
  }
  if (progress >= 50 || status.toLowerCase().includes('perjalanan')) {
    return 'bg-blue-100 text-blue-800 border-blue-200'
  }
  return 'bg-amber-100 text-amber-800 border-amber-200'
}

// Progress Bar Color
function getProgressBarColor(progress) {
  if (progress >= 100) return 'bg-emerald-500'
  if (progress >= 50) return 'bg-[#1859bc]'
  return 'bg-amber-500'
}
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden">
    <!-- Card Header -->
    <div class="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-blue-100/70 text-[#1859bc] flex items-center justify-center shrink-0">
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
              d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
            />
          </svg>
        </div>

        <div>
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-slate-900 font-mono tracking-tight text-base sm:text-lg">
              {{ order.nomorDO }}
            </h3>
            <span
              :class="[
                'text-xs font-semibold px-2.5 py-0.5 rounded-full border',
                getStatusBadgeClass(order.status, order.progress),
              ]"
            >
              {{ order.status }}
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">
            Dikirim via <span class="font-medium text-slate-700">{{ order.ekspedisi }}</span> &bull;
            Tanggal: <span class="font-medium text-slate-700">{{ order.tanggalKirim }}</span>
          </p>
        </div>
      </div>

      <!-- Total Harga Pill -->
      <div class="text-left sm:text-right">
        <div class="text-[11px] text-slate-500 font-medium uppercase tracking-wider">
          Total Pembayaran
        </div>
        <div class="text-base font-bold text-emerald-700">
          {{ formatRupiah(order.total) }}
        </div>
      </div>
    </div>

    <!-- Card Body: Penerima & Paket Info -->
    <div class="p-5 space-y-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50 rounded-lg p-3.5 border border-slate-100 text-xs">
        <div>
          <span class="text-slate-500 block mb-0.5">Nama Mahasiswa</span>
          <span class="font-semibold text-slate-900 text-sm">{{ order.nama }}</span>
        </div>
        <div>
          <span class="text-slate-500 block mb-0.5">Nomor Induk Mahasiswa (NIM)</span>
          <span class="font-mono font-semibold text-slate-800 text-sm">{{ order.nim }}</span>
        </div>
        <div>
          <span class="text-slate-500 block mb-0.5">Paket Bahan Ajar</span>
          <span class="font-semibold text-[#1859bc] text-sm">{{ order.paket }}</span>
        </div>
      </div>

      <!-- Progress Bar Section -->
      <div>
        <div class="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
          <span>Progres Pengantaran</span>
          <span class="font-mono font-bold">{{ order.progress }}%</span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            :class="['h-2.5 rounded-full transition-all duration-500', getProgressBarColor(order.progress)]"
            :style="{ width: `${Math.min(100, Math.max(0, order.progress))}%` }"
          />
        </div>
      </div>

      <!-- Timeline Riwayat Perjalanan -->
      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <svg
            class="w-3.5 h-3.5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Riwayat Perjalanan Bahan Ajar
        </h4>

        <div class="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          <div
            v-for="(step, idx) in order.perjalanan"
            :key="idx"
            class="relative text-xs"
          >
            <!-- Timeline bullet -->
            <div
              :class="[
                'absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center',
                idx === order.perjalanan.length - 1
                  ? 'border-[#1859bc] ring-2 ring-blue-100'
                  : 'border-slate-300',
              ]"
            >
              <div
                v-if="idx === order.perjalanan.length - 1"
                class="w-1.5 h-1.5 rounded-full bg-[#1859bc]"
              />
            </div>

            <!-- Content -->
            <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <span class="font-semibold text-slate-800">
                {{ step.keterangan }}
              </span>
              <span class="font-mono text-[11px] text-slate-500 shrink-0">
                {{ formatTanggal(step.waktu) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action: Tambah Status Pengiriman Baru -->
      <div class="pt-3 border-t border-slate-100">
        <div v-if="!isAddingStatus">
          <button
            v-if="order.progress < 100"
            type="button"
            :class="buttonVariants({ variant: 'outline', size: 'sm' })"
            @click="isAddingStatus = true"
          >
            <svg
              class="w-3.5 h-3.5 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Perbarui Status Pengiriman
          </button>
          <span
            v-else
            class="inline-flex items-center text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-md"
          >
            <svg
              class="w-4 h-4 mr-1 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Pengiriman telah selesai dan diterima sepenuhnya oleh mahasiswa.
          </span>
        </div>

        <div
          v-else
          class="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2.5"
        >
          <label class="block text-xs font-semibold text-slate-700">
            Keterangan Posisi / Status Terkini:
          </label>
          <input
            v-model="newKeterangan"
            type="text"
            :class="inputVariants({ state: errorMessage ? 'error' : 'default' })"
            placeholder="Contoh: Paket telah tiba di Hub UT Serang dan disiapkan untuk kurir"
            @keydown.enter.prevent="handleAddStatus"
          >
          <p
            v-if="errorMessage"
            class="text-xs text-rose-600"
          >
            {{ errorMessage }}
          </p>

          <div class="flex items-center gap-2 pt-1">
            <button
              type="button"
              :class="buttonVariants({ variant: 'primary', size: 'sm' })"
              @click="handleAddStatus"
            >
              Simpan Pembaruan
            </button>
            <button
              type="button"
              :class="buttonVariants({ variant: 'secondary', size: 'sm' })"
              @click="isAddingStatus = false; errorMessage = ''"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
