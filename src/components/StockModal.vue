<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { buttonVariants, inputVariants } from '@/lib/variants'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: 'add', // 'add' | 'edit'
  },
  initialData: {
    type: Object,
    default: () => ({}),
  },
  upbjjList: {
    type: Array,
    default: () => [],
  },
  kategoriList: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['save', 'close'])

// Form State
const form = ref({
  kode: '',
  judul: '',
  kategori: '',
  upbjj: '',
  lokasiRak: '',
  harga: 0,
  qty: 0,
  safety: 0,
  catatanHTML: '',
})

// Validation Error State
const errors = ref({})

// Reset / populate form saat modal dibuka
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      errors.value = {}
      if (props.mode === 'edit' && props.initialData) {
        form.value = {
          kode: props.initialData.kode || '',
          judul: props.initialData.judul || '',
          kategori: props.initialData.kategori || '',
          upbjj: props.initialData.upbjj || '',
          lokasiRak: props.initialData.lokasiRak || '',
          harga: props.initialData.harga ?? 0,
          qty: props.initialData.qty ?? 0,
          safety: props.initialData.safety ?? 0,
          catatanHTML: props.initialData.catatanHTML || '',
        }
      } else {
        form.value = {
          kode: '',
          judul: '',
          kategori: props.kategoriList[0] || 'MK Wajib',
          upbjj: props.upbjjList[0] || 'Jakarta',
          lokasiRak: 'R1-A1',
          harga: 50000,
          qty: 10,
          safety: 10,
          catatanHTML: '',
        }
      }
    }
  },
)

// Validasi formulir inline
function validate() {
  const errs = {}
  if (!form.value.kode?.trim()) {
    errs.kode = 'Kode mata kuliah wajib diisi'
  }
  if (!form.value.judul?.trim()) {
    errs.judul = 'Judul bahan ajar wajib diisi'
  }
  if (!form.value.kategori) {
    errs.kategori = 'Kategori wajib dipilih'
  }
  if (!form.value.upbjj) {
    errs.upbjj = 'UT Daerah wajib dipilih'
  }
  if (form.value.harga === '' || Number(form.value.harga) < 0) {
    errs.harga = 'Harga tidak boleh negatif'
  }
  if (form.value.qty === '' || Number(form.value.qty) < 0) {
    errs.qty = 'Jumlah stok tidak boleh negatif'
  }
  if (form.value.safety === '' || Number(form.value.safety) < 0) {
    errs.safety = 'Safety stock tidak boleh negatif'
  }

  errors.value = errs
  return Object.keys(errs).length === 0
}

// Simpan formulir (Dipicu via tombol simpan atau tombol keyboard Enter)
function handleSubmit() {
  if (!validate()) return
  emit('save', { ...form.value })
}

function handleKeyDown(e) {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

onMounted(() => window.addEventListener('keydown', handleKeyDown))
onUnmounted(() => window.removeEventListener('keydown', handleKeyDown))
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto"
      @click.self="emit('close')"
    >
      <div
        class="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 my-8 transform transition-all text-slate-800"
        role="dialog"
        aria-modal="true"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <h3 class="text-base font-bold text-[#1859bc]">
            {{ mode === 'add' ? 'Tambah Bahan Ajar Baru' : 'Edit Data Stok Bahan Ajar' }}
          </h3>
          <button
            type="button"
            class="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md"
            @click="emit('close')"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Form Body (Mendukung event submit @keyup.enter) -->
        <form
          @submit.prevent="handleSubmit"
          @keyup.enter="handleSubmit"
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
            <!-- Kode MK -->
            <div>
              <label class="block font-medium text-slate-700 text-xs mb-1">Kode MK *</label>
              <input
                v-model.trim="form.kode"
                type="text"
                :disabled="mode === 'edit'"
                placeholder="EKMA4116"
                :class="inputVariants({ state: errors.kode ? 'error' : 'default' })"
              >
              <p
                v-if="errors.kode"
                class="text-rose-500 text-[11px] mt-0.5 font-medium"
              >
                {{ errors.kode }}
              </p>
            </div>

            <!-- Lokasi Rak -->
            <div>
              <label class="block font-medium text-slate-700 text-xs mb-1">Lokasi Rak *</label>
              <input
                v-model.trim="form.lokasiRak"
                type="text"
                placeholder="R1-A3"
                :class="inputVariants({ state: errors.lokasiRak ? 'error' : 'default' })"
              >
            </div>

            <!-- Judul MK (Full width) -->
            <div class="sm:col-span-2">
              <label class="block font-medium text-slate-700 text-xs mb-1">Judul Bahan Ajar *</label>
              <input
                v-model.trim="form.judul"
                type="text"
                placeholder="Pengantar Manajemen"
                :class="inputVariants({ state: errors.judul ? 'error' : 'default' })"
              >
              <p
                v-if="errors.judul"
                class="text-rose-500 text-[11px] mt-0.5 font-medium"
              >
                {{ errors.judul }}
              </p>
            </div>

            <!-- UT-Daerah -->
            <div>
              <label class="block font-medium text-slate-700 text-xs mb-1">UT-Daerah *</label>
              <select
                v-model="form.upbjj"
                :class="inputVariants({ state: errors.upbjj ? 'error' : 'default' })"
              >
                <option
                  v-for="upbjj in upbjjList"
                  :key="upbjj"
                  :value="upbjj"
                >
                  {{ upbjj }}
                </option>
              </select>
            </div>

            <!-- Kategori -->
            <div>
              <label class="block font-medium text-slate-700 text-xs mb-1">Kategori MK *</label>
              <select
                v-model="form.kategori"
                :class="inputVariants({ state: errors.kategori ? 'error' : 'default' })"
              >
                <option
                  v-for="kat in kategoriList"
                  :key="kat"
                  :value="kat"
                >
                  {{ kat }}
                </option>
              </select>
            </div>

            <!-- Harga -->
            <div>
              <label class="block font-medium text-slate-700 text-xs mb-1">Harga (Rp) *</label>
              <input
                v-model.number="form.harga"
                type="number"
                min="0"
                step="1000"
                placeholder="65000"
                :class="inputVariants({ state: errors.harga ? 'error' : 'default' })"
              >
              <p
                v-if="errors.harga"
                class="text-rose-500 text-[11px] mt-0.5 font-medium"
              >
                {{ errors.harga }}
              </p>
            </div>

            <!-- Jumlah Stok (Qty) -->
            <div>
              <label class="block font-medium text-slate-700 text-xs mb-1">Jumlah Stok (buah) *</label>
              <input
                v-model.number="form.qty"
                type="number"
                min="0"
                placeholder="25"
                :class="inputVariants({ state: errors.qty ? 'error' : 'default' })"
              >
              <p
                v-if="errors.qty"
                class="text-rose-500 text-[11px] mt-0.5 font-medium"
              >
                {{ errors.qty }}
              </p>
            </div>

            <!-- Safety Stock -->
            <div>
              <label class="block font-medium text-slate-700 text-xs mb-1">Safety Stock (buah) *</label>
              <input
                v-model.number="form.safety"
                type="number"
                min="0"
                placeholder="15"
                :class="inputVariants({ state: errors.safety ? 'error' : 'default' })"
              >
              <p
                v-if="errors.safety"
                class="text-rose-500 text-[11px] mt-0.5 font-medium"
              >
                {{ errors.safety }}
              </p>
            </div>

            <!-- Catatan HTML (Full width) -->
            <div class="sm:col-span-2">
              <label class="block font-medium text-slate-700 text-xs mb-1">
                Catatan (Tag format aman: &lt;em&gt;, &lt;strong&gt;, &lt;u&gt;)
              </label>
              <input
                v-model="form.catatanHTML"
                type="text"
                placeholder="contoh: <em>Edisi 2026, cetak ulang</em>"
                :class="inputVariants()"
              >
              <p class="text-[11px] text-slate-400 mt-0.5">
                *Tag HTML berbahaya (&lt;script&gt;, handler event) akan otomatis disaring demi keamanan.
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
            <span class="text-[11px] text-slate-400">
              Tekan <kbd class="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-600 font-mono text-[10px]">Enter</kbd> untuk simpan
            </span>
            <div class="flex items-center gap-2">
              <button
                type="button"
                :class="buttonVariants({ variant: 'secondary', size: 'sm' })"
                @click="emit('close')"
              >
                Batal
              </button>
              <button
                type="submit"
                :class="buttonVariants({ variant: 'primary', size: 'sm' })"
              >
                {{ mode === 'add' ? 'Simpan Bahan Ajar' : 'Perbarui Stok' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
