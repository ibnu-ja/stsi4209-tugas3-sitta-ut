<script setup>
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-blue-100 selection:text-[#1859bc]">
    <AppNavbar />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
      <RouterView />
    </main>

    <footer class="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
      <div class="max-w-7xl mx-auto px-4 space-y-1">
        <p class="font-medium text-slate-700">
          Sistem Informasi Tiras dan Transaksi Bahan Ajar (SITTA) • Universitas Terbuka
        </p>
        <p>
          Tugas Praktik 3 Pemrograman Berbasis Web (STSI4209) • Ibnu Jihad Aminuddin (054890095)
        </p>
      </div>
    </footer>
  </div>
</template>
