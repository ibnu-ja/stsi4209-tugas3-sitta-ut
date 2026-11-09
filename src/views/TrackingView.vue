<script setup>
import { ref, computed } from 'vue'
import { useBahanAjar } from '@/composables/useBahanAjar'
import TrackingSearch from '@/components/TrackingSearch.vue'
import TrackingCard from '@/components/TrackingCard.vue'
import NewOrderModal from '@/components/NewOrderModal.vue'
import { buttonVariants } from '@/lib/variants'

const {
  daftarDO,
  paketList,
  pengirimanList,
  upbjjList,
  getNextDONumber,
  addDeliveryOrder,
  addTrackingProgress,
} = useBahanAjar()

// Search and Filter State
const searchQuery = ref('')
const statusFilter = ref('ALL') // 'ALL' | 'DIDAFTARKAN' | 'PERJALANAN' | 'DITERIMA'

// Modal State
const isNewOrderModalOpen = ref(false)

// Toast Feedback State
const toast = ref({
  show: false,
  message: '',
  type: 'success',
})

let toastTimeout = null
function showToast(message, type = 'success') {
  if (toastTimeout) clearTimeout(toastTimeout)
  toast.value = { show: true, message, type }
  toastTimeout = setTimeout(() => {
    toast.value.show = false
  }, 4000)
}

// Pure Computed: Filtered Delivery Orders
const filteredOrders = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const filter = statusFilter.value

  return daftarDO.value.filter((order) => {
    // 1. Text Search matching
    const matchText =
      !query ||
      order.nomorDO.toLowerCase().includes(query) ||
      order.nim.toLowerCase().includes(query) ||
      order.nama.toLowerCase().includes(query)

    if (!matchText) return false

    // 2. Status Category Matching
    if (filter === 'DIDAFTARKAN') {
      return (
        order.progress < 50 &&
        (order.status.toLowerCase().includes('didaftarkan') ||
          order.status.toLowerCase().includes('dikemas'))
      )
    }
    if (filter === 'PERJALANAN') {
      return (
        order.progress >= 50 &&
        order.progress < 100 &&
        (order.status.toLowerCase().includes('perjalanan') ||
          order.status.toLowerCase().includes('pengiriman'))
      )
    }
    if (filter === 'DITERIMA') {
      return (
        order.progress >= 100 ||
        order.status.toLowerCase().includes('diterima')
      )
    }

    return true
  })
})

// Handler: Simpan DO Baru
function handleSaveNewOrder(orderData) {
  try {
    const createdDO = addDeliveryOrder(orderData)
    isNewOrderModalOpen.value = false
    showToast(`Delivery Order ${createdDO} untuk ${orderData.nama} berhasil didaftarkan.`)
  } catch (err) {
    showToast(err.message || 'Gagal mendaftarkan Delivery Order baru.', 'error')
  }
}

// Handler: Tambah Progress Status
function handleAddProgress({ nomorDO, keterangan }) {
  try {
    addTrackingProgress(nomorDO, keterangan)
    showToast(`Status pengiriman untuk ${nomorDO} berhasil diperbarui.`)
  } catch (err) {
    showToast(err.message || 'Gagal memperbarui status pengiriman.', 'error')
  }
}

// Reset Filter
function resetSearch() {
  searchQuery.value = ''
  statusFilter.value = 'ALL'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header Page & Primary Action -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">
          Tracking Pengiriman Bahan Ajar
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Pantau status distribusi Delivery Order (DO) bahan ajar ke mahasiswa secara real-time.
        </p>
      </div>

      <button
        type="button"
        :class="buttonVariants({ variant: 'primary', size: 'md' })"
        @click="isNewOrderModalOpen = true"
      >
        <svg
          class="w-4 h-4 mr-2"
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
        Buat DO Baru
      </button>
    </div>

    <!-- Toast Notification Banner -->
    <transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="toast.show"
        :class="[
          'p-4 rounded-xl border flex items-center justify-between shadow-xs',
          toast.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800',
        ]"
      >
        <div class="flex items-center gap-3">
          <svg
            v-if="toast.type === 'success'"
            class="w-5 h-5 text-emerald-600 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5 text-rose-600 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="text-sm font-medium">{{ toast.message }}</span>
        </div>
        <button
          type="button"
          class="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          @click="toast.show = false"
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
    </transition>

    <!-- Search & Filter Controls -->
    <TrackingSearch
      v-model="searchQuery"
      v-model:status-filter="statusFilter"
      @clear="resetSearch"
    />

    <!-- Summary Count -->
    <div class="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
      <div>
        Menampilkan <span class="text-slate-900 font-bold">{{ filteredOrders.length }}</span> dari
        <span class="text-slate-900 font-bold">{{ daftarDO.length }}</span> pengiriman
      </div>
      <div
        v-if="searchQuery || statusFilter !== 'ALL'"
        class="text-[#1859bc]"
      >
        Hasil pencarian disaring
      </div>
    </div>

    <!-- Tracking List -->
    <div
      v-if="filteredOrders.length > 0"
      class="space-y-4"
    >
      <TrackingCard
        v-for="order in filteredOrders"
        :key="order.nomorDO"
        :order="order"
        @add-progress="handleAddProgress"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs space-y-4"
    >
      <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
        <svg
          class="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div>
        <h3 class="text-base font-bold text-slate-800">
          Tidak Ada Pengiriman Ditemukan
        </h3>
        <p class="text-sm text-slate-500 mt-1 max-w-md mx-auto">
          Tidak ditemukan pengiriman yang cocok dengan kriteria pencarian atau filter status yang dipilih.
        </p>
      </div>
      <div class="pt-2">
        <button
          type="button"
          :class="buttonVariants({ variant: 'outline', size: 'sm' })"
          @click="resetSearch"
        >
          Bersihkan Pencarian &amp; Filter
        </button>
      </div>
    </div>

    <!-- Modal Pendaftaran DO Baru -->
    <NewOrderModal
      :is-open="isNewOrderModalOpen"
      :next-do-number="getNextDONumber()"
      :paket-list="paketList"
      :pengiriman-list="pengirimanList"
      :upbjj-list="upbjjList"
      @save="handleSaveNewOrder"
      @close="isNewOrderModalOpen = false"
    />
  </div>
</template>
