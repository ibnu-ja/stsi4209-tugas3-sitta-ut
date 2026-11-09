<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useBahanAjar } from '@/composables/useBahanAjar'
import { formatBuah } from '@/composables/useFormatters'
import { buttonVariants } from '@/lib/variants'

const { dashboardStats, stokList, onlyReorder } = useBahanAjar()

// Salam dinamis berdasarkan jam lokal
const sapaan = computed(() => {
  const jam = new Date().getHours()
  if (jam >= 4 && jam < 11) return 'Selamat Pagi'
  if (jam >= 11 && jam < 15) return 'Selamat Siang'
  if (jam >= 15 && jam < 18) return 'Selamat Sore'
  return 'Selamat Malam'
})

// Item yang butuh re-order segera untuk alert preview
const itemsPerluReorder = computed(() => {
  return stokList.value.filter((i) => i.qty < i.safety || i.qty === 0).slice(0, 4)
})

function navigateToReorder() {
  onlyReorder.value = true
}
</script>

<template>
  <div class="space-y-8">
    <!-- Hero Greeting Banner -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1859bc] via-[#154ea6] to-[#0d3470] p-6 sm:p-8 text-white shadow-md">
      <!-- Background pattern accent -->
      <div class="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-2xl" />
      <div class="absolute right-20 -top-10 w-48 h-48 rounded-full bg-[#f2a900]/15 pointer-events-none blur-xl" />

      <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-medium border border-white/15">
            <span class="w-2 h-2 rounded-full bg-[#f2a900] animate-pulse" />
            Portal Layanan Bahan Ajar UT
          </div>

          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {{ sapaan }}, Ibnu Jihad Aminuddin
          </h1>

          <p class="text-blue-100 text-xs sm:text-sm max-w-xl leading-relaxed">
            Selamat datang di Dashboard Sistem Informasi Tiras &amp; Transaksi Bahan Ajar (SITTA) Universitas Terbuka.
            Semua modul inventaris dan progres pengiriman dapat dipantau secara terpadu.
          </p>

          <div class="flex flex-wrap items-center gap-3 pt-2 text-xs text-blue-200">
            <span class="font-mono bg-blue-900/60 px-2 py-0.5 rounded border border-blue-700/50">NIM: 054890095</span>
            <span>&bull;</span>
            <span class="font-medium">UPBJJ: UT Serang</span>
            <span>&bull;</span>
            <span>Sistem Informasi (S1)</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
          <RouterLink
            to="/stok"
            :class="buttonVariants({ variant: 'secondary', size: 'md' })"
            class="bg-white hover:bg-slate-100 text-[#1859bc] font-semibold border-none shadow-sm text-center"
          >
            Kelola Stok Bahan Ajar
          </RouterLink>
          <RouterLink
            to="/tracking"
            :class="buttonVariants({ variant: 'outline', size: 'md' })"
            class="border-white/40 text-white hover:bg-white/10 text-center"
          >
            Tracking Pengiriman DO
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- 4 KPI Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Judul -->
      <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div class="space-y-1">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Total Judul Bahan Ajar
          </span>
          <div class="text-2xl font-bold text-slate-900 font-mono">
            {{ dashboardStats.totalJudul }}
          </div>
          <p class="text-[11px] text-slate-400">
            Tersebar di gudang daerah
          </p>
        </div>
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-[#1859bc] flex items-center justify-center shrink-0">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
      </div>

      <!-- Perlu Re-order -->
      <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div class="space-y-1">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Perlu Re-Order
          </span>
          <div
            :class="[
              'text-2xl font-bold font-mono',
              dashboardStats.totalReorder > 0 ? 'text-amber-600' : 'text-slate-900',
            ]"
          >
            {{ dashboardStats.totalReorder }}
          </div>
          <p class="text-[11px] text-slate-400">
            Stok &le; safety stock / habis
          </p>
        </div>
        <div
          :class="[
            'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
            dashboardStats.totalReorder > 0
              ? 'bg-amber-50 text-amber-600'
              : 'bg-emerald-50 text-emerald-600',
          ]"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>

      <!-- Total DO -->
      <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div class="space-y-1">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Delivery Order (DO)
          </span>
          <div class="text-2xl font-bold text-slate-900 font-mono">
            {{ dashboardStats.totalDO }}
          </div>
          <p class="text-[11px] text-slate-400">
            Pengiriman tercatat
          </p>
        </div>
        <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <svg
            class="w-6 h-6"
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
      </div>

      <!-- Total Stok Fisik -->
      <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div class="space-y-1">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Total Stok Fisik
          </span>
          <div class="text-2xl font-bold text-emerald-700 font-mono">
            {{ formatBuah(dashboardStats.totalStokFisik) }}
          </div>
          <p class="text-[11px] text-slate-400">
            Eksemplar modul siap kirim
          </p>
        </div>
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Alert Re-order Section if needed -->
    <div
      v-if="dashboardStats.totalReorder > 0"
      class="rounded-xl border border-amber-200 bg-amber-50/70 p-5 space-y-3"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <span class="flex h-3 w-3 relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
          </span>
          <h2 class="text-sm font-bold text-amber-900">
            Peringatan Pengendalian Persediaan: {{ dashboardStats.totalReorder }} Bahan Ajar Membutuhkan Pemesanan Ulang
          </h2>
        </div>

        <RouterLink
          to="/stok"
          class="text-xs font-semibold text-amber-800 hover:text-amber-950 underline underline-offset-2"
          @click="navigateToReorder"
        >
          Lihat Semua &rarr;
        </RouterLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          v-for="item in itemsPerluReorder"
          :key="item.kode"
          class="bg-white rounded-lg p-3 border border-amber-200/80 shadow-2xs space-y-1 text-xs"
        >
          <div class="font-bold text-slate-800 line-clamp-1">
            {{ item.judul }}
          </div>
          <div class="flex items-center justify-between text-slate-500 font-mono text-[11px]">
            <span>{{ item.kode }}</span>
            <span class="text-amber-700 font-semibold">
              Sisa: {{ item.qty }} / Min: {{ item.safety }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Navigation Slices -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Section 1: Stok Bahan Ajar -->
      <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
        <div class="space-y-2">
          <div class="w-10 h-10 rounded-lg bg-blue-50 text-[#1859bc] flex items-center justify-center font-bold">
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-900">
            Manajemen Stok &amp; Gudang Bahan Ajar
          </h3>
          <p class="text-xs text-slate-500 leading-relaxed">
            Pencarian modular bahan ajar dengan filter dinamis UT-Daerah dan kategori,
            pengecekan batas persediaan pengaman (safety stock), dan sanitasi catatan modul aman XSS.
          </p>
        </div>

        <RouterLink
          to="/stok"
          :class="buttonVariants({ variant: 'primary', size: 'md' })"
          class="inline-flex items-center gap-1.5 w-fit"
        >
          Buka Modul Stok
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </RouterLink>
      </div>

      <!-- Section 2: Tracking Pengiriman -->
      <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
        <div class="space-y-2">
          <div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
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
                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
              />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-900">
            Pelacakan Ekspedisi &amp; Transaksi DO
          </h3>
          <p class="text-xs text-slate-500 leading-relaxed">
            Pantau status riwayat perjalanan paket modul secara berurutan, sinkronisasi watcher paket otomatis,
            dan buat Delivery Order baru dengan penomoran standar DOYYYY-XXX.
          </p>
        </div>

        <RouterLink
          to="/tracking"
          :class="buttonVariants({ variant: 'outline', size: 'md' })"
          class="inline-flex items-center gap-1.5 w-fit"
        >
          Buka Pelacakan Pengiriman
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
