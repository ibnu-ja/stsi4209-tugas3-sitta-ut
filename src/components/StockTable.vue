<script setup>
import StatusBadge from '@/components/StatusBadge.vue'
import { formatRupiah, formatBuah } from '@/composables/useFormatters'
import { buttonVariants } from '@/lib/variants'

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
    <table class="w-full text-left border-collapse text-xs sm:text-sm">
      <!-- Table Header -->
      <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
        <tr>
          <th
            scope="col"
            class="py-3.5 px-4"
          >
            Bahan Ajar
          </th>
          <th
            scope="col"
            class="py-3.5 px-3"
          >
            Kategori
          </th>
          <th
            scope="col"
            class="py-3.5 px-3"
          >
            UT Daerah
          </th>
          <th
            scope="col"
            class="py-3.5 px-3"
          >
            Lokasi Rak
          </th>
          <th
            scope="col"
            class="py-3.5 px-3 text-right"
          >
            Harga
          </th>
          <th
            scope="col"
            class="py-3.5 px-3 text-center"
          >
            Stok
          </th>
          <th
            scope="col"
            class="py-3.5 px-3 text-center"
          >
            Safety
          </th>
          <th
            scope="col"
            class="py-3.5 px-3 text-center"
          >
            Status
          </th>
          <th
            scope="col"
            class="py-3.5 px-4 text-center"
          >
            Aksi
          </th>
        </tr>
      </thead>

      <!-- Table Body -->
      <tbody class="divide-y divide-slate-100 text-slate-700">
        <tr
          v-for="item in items"
          :key="item.kode"
          class="hover:bg-slate-50/80 transition-colors"
        >
          <!-- Kode & Judul -->
          <td class="py-3.5 px-4">
            <div class="font-bold text-slate-900 leading-tight">
              {{ item.judul }}
            </div>
            <div class="text-[11px] font-mono text-[#1859bc] mt-0.5">
              {{ item.kode }}
            </div>
          </td>

          <!-- Kategori -->
          <td class="py-3.5 px-3 whitespace-nowrap">
            <span class="inline-block px-2 py-0.5 rounded text-[11px] bg-slate-100 font-medium text-slate-600">
              {{ item.kategori }}
            </span>
          </td>

          <!-- UT Daerah -->
          <td class="py-3.5 px-3 whitespace-nowrap font-medium text-slate-800">
            {{ item.upbjj }}
          </td>

          <!-- Lokasi Rak -->
          <td class="py-3.5 px-3 whitespace-nowrap font-mono text-xs text-slate-500">
            {{ item.lokasiRak || '-' }}
          </td>

          <!-- Harga -->
          <td class="py-3.5 px-3 text-right whitespace-nowrap font-medium text-slate-900">
            {{ formatRupiah(item.harga) }}
          </td>

          <!-- Jumlah Stok -->
          <td class="py-3.5 px-3 text-center whitespace-nowrap">
            <span
              class="font-semibold"
              :class="item.qty === 0 ? 'text-rose-600 font-bold' : item.qty < item.safety ? 'text-amber-600' : 'text-slate-800'"
            >
              {{ formatBuah(item.qty) }}
            </span>
          </td>

          <!-- Safety Stock -->
          <td class="py-3.5 px-3 text-center whitespace-nowrap text-slate-500">
            {{ formatBuah(item.safety) }}
          </td>

          <!-- Status & Tooltip Catatan -->
          <td class="py-3.5 px-3 text-center whitespace-nowrap">
            <StatusBadge
              :qty="item.qty"
              :safety="item.safety"
              :catatan-h-t-m-l="item.catatanHTML"
            />
          </td>

          <!-- Aksi (Edit & Hapus) -->
          <td class="py-3.5 px-4 text-center whitespace-nowrap">
            <div class="flex items-center justify-center gap-1.5">
              <button
                type="button"
                title="Edit Stok"
                :class="buttonVariants({ variant: 'secondary', size: 'sm' })"
                class="px-2 py-1 text-xs"
                @click="emit('edit', item)"
              >
                <svg
                  class="w-3.5 h-3.5 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                type="button"
                title="Hapus Data"
                :class="buttonVariants({ variant: 'danger', size: 'sm' })"
                class="px-2 py-1 text-xs bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100"
                @click="emit('delete', item)"
              >
                <svg
                  class="w-3.5 h-3.5"
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
              </button>
            </div>
          </td>
        </tr>

        <!-- Empty State -->
        <tr v-if="items.length === 0">
          <td
            colspan="9"
            class="py-12 text-center text-slate-400"
          >
            <svg
              class="w-10 h-10 mx-auto mb-2 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p class="font-medium text-sm text-slate-600">
              Tidak ada data bahan ajar
            </p>
            <p class="text-xs text-slate-400 mt-0.5">
              Cobalah mengatur ulang filter atau kata kunci pencarian
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
