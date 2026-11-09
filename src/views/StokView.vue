<script setup>
import { ref } from 'vue'
import { useBahanAjar } from '@/composables/useBahanAjar'
import StockTable from '@/components/StockTable.vue'
import StockModal from '@/components/StockModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { buttonVariants, inputVariants } from '@/lib/variants'

const {
  stokList,
  upbjjList,
  kategoriList,
  selectedUpbjj,
  selectedKategori,
  onlyReorder,
  sortBy,
  sortOrder,
  availableKategoriList,
  filteredStok,
  resetStokFilter,
  addStok,
  updateStok,
  deleteStok,
} = useBahanAjar()

// State Modal Tambah/Edit
const isStockModalOpen = ref(false)
const modalMode = ref('add') // 'add' | 'edit'
const selectedItem = ref({})

// State Modal Konfirmasi Hapus
const isConfirmModalOpen = ref(false)
const itemToDelete = ref(null)

// Toast Feedback State
const toast = ref({
  show: false,
  message: '',
  type: 'success', // 'success' | 'error'
})

let toastTimeout = null
function showToast(message, type = 'success') {
  if (toastTimeout) clearTimeout(toastTimeout)
  toast.value = { show: true, message, type }
  toastTimeout = setTimeout(() => {
    toast.value.show = false
  }, 4000)
}

// Buka Modal Tambah
function openAddModal() {
  modalMode.value = 'add'
  selectedItem.value = {}
  isStockModalOpen.value = true
}

// Buka Modal Edit
function handleEdit(item) {
  modalMode.value = 'edit'
  selectedItem.value = { ...item }
  isStockModalOpen.value = true
}

// Simpan Tambah/Edit
function handleSaveStock(formData) {
  try {
    if (modalMode.value === 'add') {
      addStok(formData)
      showToast(`Bahan ajar "${formData.judul}" (${formData.kode}) berhasil ditambahkan.`)
    } else {
      updateStok(formData.kode, formData)
      showToast(`Bahan ajar "${formData.judul}" (${formData.kode}) berhasil diperbarui.`)
    }
    isStockModalOpen.value = false
  } catch (err) {
    showToast(err.message || 'Terjadi kesalahan saat menyimpan data.', 'error')
  }
}

// Buka Modal Hapus
function handleDelete(item) {
  itemToDelete.value = item
  isConfirmModalOpen.value = true
}

// Konfirmasi Hapus
function confirmDelete() {
  if (!itemToDelete.value) return
  const kode = itemToDelete.value.kode
  const judul = itemToDelete.value.judul
  deleteStok(kode)
  isConfirmModalOpen.value = false
  itemToDelete.value = null
  showToast(`Bahan ajar "${judul}" (${kode}) berhasil dihapus.`)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header Page & Primary Action -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">
          Stok Bahan Ajar SITTA
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Kelola inventaris fisik bahan ajar Universitas Terbuka di seluruh gudang UT-Daerah.
        </p>
      </div>

      <button
        type="button"
        :class="buttonVariants({ variant: 'primary', size: 'md' })"
        @click="openAddModal"
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
        Tambah Bahan Ajar
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

    <!-- Filter & Sort Control Panel -->
    <div class="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 class="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <svg
            class="w-4 h-4 text-[#1859bc]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filter & Pengurutan Stok
        </h2>

        <button
          type="button"
          :class="buttonVariants({ variant: 'ghost', size: 'sm' })"
          @click="resetStokFilter"
        >
          Reset Filter
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Filter UT-Daerah (Independent) -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">
            UT-Daerah
          </label>
          <select
            v-model="selectedUpbjj"
            :class="inputVariants()"
          >
            <option value="">
              Semua UT-Daerah
            </option>
            <option
              v-for="u in upbjjList"
              :key="u"
              :value="u"
            >
              {{ u }}
            </option>
          </select>
        </div>

        <!-- Filter Kategori (Dependent Watcher) -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span>Kategori</span>
            <span
              v-if="selectedUpbjj"
              class="text-[10px] font-normal text-[#1859bc] bg-blue-50 px-1.5 py-0.2 rounded"
            >
              Dinamis
            </span>
          </label>
          <select
            v-model="selectedKategori"
            :class="inputVariants()"
          >
            <option value="">
              Semua Kategori
            </option>
            <option
              v-for="k in availableKategoriList"
              :key="k"
              :value="k"
            >
              {{ k }}
            </option>
          </select>
        </div>

        <!-- Pengurutan Berdasarkan -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">
            Urutkan Berdasarkan
          </label>
          <select
            v-model="sortBy"
            :class="inputVariants()"
          >
            <option value="judul">
              Judul Bahan Ajar
            </option>
            <option value="qty">
              Jumlah Stok
            </option>
            <option value="harga">
              Harga Satuan
            </option>
          </select>
        </div>

        <!-- Arah Urutan -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">
            Arah Urutan
          </label>
          <select
            v-model="sortOrder"
            :class="inputVariants()"
          >
            <option value="asc">
              Menaik (A-Z / Rendah-Tinggi)
            </option>
            <option value="desc">
              Menurun (Z-A / Tinggi-Rendah)
            </option>
          </select>
        </div>
      </div>

      <!-- Reorder Checkbox & Summary Pill -->
      <div class="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-100">
        <label class="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            v-model="onlyReorder"
            type="checkbox"
            class="w-4 h-4 rounded text-[#1859bc] focus:ring-[#1859bc] border-slate-300"
          >
          <span class="text-xs sm:text-sm font-medium text-slate-700">
            Hanya tampilkan stok yang perlu re-order (stok &lt; safety atau habis)
          </span>
        </label>

        <div class="text-xs text-slate-500 font-medium">
          Menampilkan <span class="text-slate-900 font-bold">{{ filteredStok.length }}</span> dari
          <span class="text-slate-900 font-bold">{{ stokList.length }}</span> total judul bahan ajar
        </div>
      </div>
    </div>

    <!-- Stock Table -->
    <StockTable
      :items="filteredStok"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Modal Form Tambah / Edit Stok -->
    <StockModal
      :is-open="isStockModalOpen"
      :mode="modalMode"
      :initial-data="selectedItem"
      :upbjj-list="upbjjList"
      :kategori-list="kategoriList"
      @save="handleSaveStock"
      @close="isStockModalOpen = false"
    />

    <!-- Modal Konfirmasi Hapus Data -->
    <ConfirmModal
      :is-open="isConfirmModalOpen"
      title="Hapus Bahan Ajar"
      message="Apakah Anda yakin ingin menghapus data bahan ajar ini dari inventaris SITTA?"
      :item-name="itemToDelete ? `${itemToDelete.judul} (${itemToDelete.kode})` : ''"
      @confirm="confirmDelete"
      @cancel="isConfirmModalOpen = false"
    />
  </div>
</template>
