<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { formatRupiah } from '@/composables/useFormatters'
import { buttonVariants, inputVariants } from '@/lib/variants'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  nextDoNumber: {
    type: String,
    default: 'DO2025-001',
  },
  paketList: {
    type: Array,
    default: () => [],
  },
  pengirimanList: {
    type: Array,
    default: () => [],
  },
  upbjjList: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['save', 'close'])

// Form State
const form = ref({
  nim: '',
  nama: '',
  paketKode: '',
  ekspedisi: '',
  upbjj: '',
})

// Validation Error State
const errors = ref({})

// Computed Selected Paket details
const selectedPaket = computed(() => {
  return props.paketList.find((p) => p.kode === form.value.paketKode) || null
})

// Watcher pada paket: otomatis sinkronkan data harga & reset error paket
watch(
  () => form.value.paketKode,
  (newKode) => {
    if (newKode && errors.value.paketKode) {
      delete errors.value.paketKode
    }
  },
)

// Reset form saat modal dibuka
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      form.value = {
        nim: '',
        nama: '',
        paketKode: props.paketList.length > 0 ? props.paketList[0].kode : '',
        ekspedisi: props.pengirimanList.length > 0 ? props.pengirimanList[0].nama : 'Reguler (3-5 hari)',
        upbjj: props.upbjjList.length > 0 ? props.upbjjList[0] : 'Jakarta',
      }
      errors.value = {}
    }
  },
  { immediate: true },
)

// Validasi Form
function validate() {
  const errs = {}

  if (!form.value.nim.trim()) {
    errs.nim = 'NIM mahasiswa wajib diisi.'
  } else if (!/^\d{9,10}$/.test(form.value.nim.trim())) {
    errs.nim = 'NIM harus berupa 9 sampai 10 digit angka.'
  }

  if (!form.value.nama.trim()) {
    errs.nama = 'Nama mahasiswa wajib diisi.'
  } else if (form.value.nama.trim().length < 3) {
    errs.nama = 'Nama mahasiswa minimal 3 karakter.'
  }

  if (!form.value.paketKode) {
    errs.paketKode = 'Silakan pilih paket bahan ajar.'
  }

  if (!form.value.ekspedisi) {
    errs.ekspedisi = 'Pilih metode ekspedisi pengiriman.'
  }

  if (!form.value.upbjj) {
    errs.upbjj = 'Pilih UT-Daerah pendaftaran.'
  }

  errors.value = errs
  return Object.keys(errs).length === 0
}

function handleSave() {
  if (!validate()) return

  const paket = selectedPaket.value
  const orderData = {
    nim: form.value.nim.trim(),
    nama: form.value.nama.trim(),
    paket: paket ? `${paket.kode} - ${paket.nama}` : form.value.paketKode,
    ekspedisi: form.value.ekspedisi,
    upbjj: form.value.upbjj,
    total: paket ? paket.harga : 0,
  }

  emit('save', orderData)
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
        class="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 transform transition-all my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-new-do-title"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-100/70 text-[#1859bc] flex items-center justify-center font-bold">
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div>
              <h2
                id="modal-new-do-title"
                class="text-lg font-bold text-slate-900"
              >
                Pendaftaran Delivery Order (DO) Baru
              </h2>
              <p class="text-xs text-slate-500">
                Nomor DO dihasilkan secara otomatis oleh sistem SITTA UT.
              </p>
            </div>
          </div>

          <button
            type="button"
            class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
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

        <!-- Form Body -->
        <form
          class="space-y-4 pt-4"
          @submit.prevent="handleSave"
        >
          <!-- Nomor DO Auto-generated -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">
              Nomor Delivery Order (Auto-generated)
            </label>
            <input
              type="text"
              :value="nextDoNumber"
              readonly
              class="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-mono font-bold text-[#1859bc] cursor-not-allowed"
            >
          </div>

          <!-- NIM & Nama Mahasiswa -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">
                NIM Mahasiswa <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.nim"
                type="text"
                maxlength="10"
                placeholder="Contoh: 054890095"
                :class="inputVariants({ state: errors.nim ? 'error' : 'default' })"
              >
              <p
                v-if="errors.nim"
                class="text-[11px] text-rose-600 mt-1"
              >
                {{ errors.nim }}
              </p>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">
                Nama Mahasiswa <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.nama"
                type="text"
                placeholder="Contoh: Ibnu Jihad Aminuddin"
                :class="inputVariants({ state: errors.nama ? 'error' : 'default' })"
              >
              <p
                v-if="errors.nama"
                class="text-[11px] text-rose-600 mt-1"
              >
                {{ errors.nama }}
              </p>
            </div>
          </div>

          <!-- Pilihan Paket Bahan Ajar & Watcher Effect Preview -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">
              Pilihan Paket Bahan Ajar <span class="text-rose-500">*</span>
            </label>
            <select
              v-model="form.paketKode"
              :class="inputVariants({ state: errors.paketKode ? 'error' : 'default' })"
            >
              <option
                value=""
                disabled
              >
                Pilih salah satu paket
              </option>
              <option
                v-for="pkt in paketList"
                :key="pkt.kode"
                :value="pkt.kode"
              >
                {{ pkt.kode }} - {{ pkt.nama }} ({{ formatRupiah(pkt.harga) }})
              </option>
            </select>
            <p
              v-if="errors.paketKode"
              class="text-[11px] text-rose-600 mt-1"
            >
              {{ errors.paketKode }}
            </p>

            <!-- Preview Isi Paket Otomatis (Watcher Outcome) -->
            <div
              v-if="selectedPaket"
              class="mt-2.5 p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-xs space-y-1.5"
            >
              <div class="flex items-center justify-between font-semibold text-slate-800">
                <span>Rincian Modul Paket:</span>
                <span class="text-emerald-700 font-bold">
                  Total: {{ formatRupiah(selectedPaket.harga) }}
                </span>
              </div>
              <div class="flex flex-wrap gap-1.5 pt-0.5">
                <span
                  v-for="modulKode in selectedPaket.isi"
                  :key="modulKode"
                  class="px-2 py-0.5 rounded bg-white border border-blue-200 text-[#1859bc] font-mono text-[11px]"
                >
                  {{ modulKode }}
                </span>
              </div>
            </div>
          </div>

          <!-- Ekspedisi & UT-Daerah -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">
                Layanan Ekspedisi <span class="text-rose-500">*</span>
              </label>
              <select
                v-model="form.ekspedisi"
                :class="inputVariants({ state: errors.ekspedisi ? 'error' : 'default' })"
              >
                <option
                  v-for="exp in pengirimanList"
                  :key="exp.kode"
                  :value="exp.nama"
                >
                  {{ exp.nama }}
                </option>
              </select>
              <p
                v-if="errors.ekspedisi"
                class="text-[11px] text-rose-600 mt-1"
              >
                {{ errors.ekspedisi }}
              </p>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">
                Lokasi UT-Daerah <span class="text-rose-500">*</span>
              </label>
              <select
                v-model="form.upbjj"
                :class="inputVariants({ state: errors.upbjj ? 'error' : 'default' })"
              >
                <option
                  v-for="u in upbjjList"
                  :key="u"
                  :value="u"
                >
                  {{ u }}
                </option>
              </select>
              <p
                v-if="errors.upbjj"
                class="text-[11px] text-rose-600 mt-1"
              >
                {{ errors.upbjj }}
              </p>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              :class="buttonVariants({ variant: 'secondary', size: 'md' })"
              @click="emit('close')"
            >
              Batal
            </button>
            <button
              type="submit"
              :class="buttonVariants({ variant: 'primary', size: 'md' })"
            >
              Daftarkan DO Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
