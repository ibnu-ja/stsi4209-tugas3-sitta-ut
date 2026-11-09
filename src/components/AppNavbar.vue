<script setup>
import { RouterLink } from 'vue-router'

const navItems = [
  { path: '/', label: 'Beranda' },
  { path: '/stok', label: 'Stok Bahan Ajar' },
  { path: '/tracking', label: 'Tracking DO' },
]
</script>

<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Brand & Logo -->
        <div class="flex items-center gap-3">
          <RouterLink
            to="/"
            class="flex items-center gap-2.5 group"
          >
            <div class="w-10 h-10 rounded-lg bg-[#1859bc] flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-[#124491] transition-colors">
              UT
            </div>
            <div>
              <span class="block text-base font-bold text-[#1859bc] leading-tight tracking-tight">SITTA UT</span>
              <span class="block text-[11px] text-slate-500 font-medium">Sistem Tiras & Transaksi Bahan Ajar</span>
            </div>
          </RouterLink>
        </div>

        <!-- Navigation Links -->
        <nav class="flex items-center gap-1 sm:gap-2">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="px-3.5 py-2 rounded-lg text-sm font-medium transition-all"
            active-class="bg-blue-50 text-[#1859bc] font-semibold shadow-xs"
            exact-active-class="bg-blue-50 text-[#1859bc] font-semibold shadow-xs"
          >
            {{ item.label }}
          </RouterLink>
        </nav>

        <!-- User Profile Pill -->
        <div class="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200 text-xs text-slate-600">
          <div class="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-semibold text-slate-700">
            IJ
          </div>
          <div class="text-left leading-tight">
            <span class="block font-semibold text-slate-800">Ibnu Jihad Aminuddin</span>
            <span class="text-slate-500">NIM: 054890095 • UT Serang</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
