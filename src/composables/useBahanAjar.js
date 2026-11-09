import { ref, computed, watch } from 'vue'
import rawData from '@/data/dataBahanAjar.json'
import { sanitizeHtml } from '@/composables/useFormatters'

// Shared reactive state (Singleton across SPA)
const stokList = ref([...rawData.stok])
const trackingMap = ref({ ...rawData.tracking })
const upbjjList = ref([...rawData.upbjjList])
const kategoriList = ref([...rawData.kategoriList])
const pengirimanList = ref([...rawData.pengirimanList])
const paketList = ref([...rawData.paket])

// Filter and Sort states for Stok Bahan Ajar
const selectedUpbjj = ref('')
const selectedKategori = ref('')
const onlyReorder = ref(false)
const sortBy = ref('judul') // 'judul' | 'qty' | 'harga'
const sortOrder = ref('asc') // 'asc' | 'desc'

// ==========================================
// WATCHERS (Pemenuhan Indikator 5)
// ==========================================

// Watcher 1: Dependent Filter
// Ketika filter UT-Daerah berubah, reset pilihan kategori jika kategori tersebut tidak ada di UT-Daerah yang dipilih
watch(selectedUpbjj, (newVal) => {
  if (!newVal) {
    selectedKategori.value = ''
  } else {
    // Periksa apakah kategori yang sedang dipilih tersedia pada UT-Daerah baru
    const available = stokList.value
      .filter((item) => item.upbjj === newVal)
      .map((item) => item.kategori)
    if (selectedKategori.value && !available.includes(selectedKategori.value)) {
      selectedKategori.value = ''
    }
  }
})

// Watcher 2: Monitoring Item yang Berada di Bawah Safety Stock
const itemsUnderSafety = ref([])
watch(
  stokList,
  (newItems) => {
    itemsUnderSafety.value = newItems.filter((i) => i.qty < i.safety || i.qty === 0)
  },
  { immediate: true, deep: true },
)

export function useBahanAjar() {
  // ==========================================
  // PURE COMPUTED PROPERTIES (Catatan Dosen)
  // ==========================================

  // Daftar kategori yang tersedia secara dinamis berdasarkan UT-Daerah terpilih
  const availableKategoriList = computed(() => {
    if (!selectedUpbjj.value) return kategoriList.value
    const categoriesInRegion = new Set(
      stokList.value
        .filter((item) => item.upbjj === selectedUpbjj.value)
        .map((item) => item.kategori),
    )
    return kategoriList.value.filter((k) => categoriesInRegion.has(k))
  })

  // Pure computed: memfilter dan mengurutkan stok tanpa mutasi array asli
  const filteredStok = computed(() => {
    let result = [...stokList.value]

    // Filter UT-Daerah
    if (selectedUpbjj.value) {
      result = result.filter((item) => item.upbjj === selectedUpbjj.value)
    }

    // Filter Kategori (Dependent)
    if (selectedKategori.value) {
      result = result.filter((item) => item.kategori === selectedKategori.value)
    }

    // Filter Re-order (stok < safety atau stok === 0)
    if (onlyReorder.value) {
      result = result.filter((item) => item.qty < item.safety || item.qty === 0)
    }

    // Sorting Immutably
    result.sort((a, b) => {
      let valA = a[sortBy.value]
      let valB = b[sortBy.value]

      if (typeof valA === 'string') {
        valA = valA.toLowerCase()
        valB = String(valB).toLowerCase()
        return sortOrder.value === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA)
      }

      return sortOrder.value === 'asc' ? valA - valB : valB - valA
    })

    return result
  })

  // Pure computed: mapping daftar DO tanpa mutasi objek sumber
  const daftarDO = computed(() => {
    return Object.entries(trackingMap.value).map(([nomorDO, data]) => ({
      nomorDO,
      nim: data.nim || '-',
      nama: data.nama || '-',
      status: data.status || '-',
      progress: Number(data.progress) || 0,
      ekspedisi: data.ekspedisi || '-',
      tanggalKirim: data.tanggalKirim || '-',
      paket: data.paket || '-',
      total: Number(data.total) || 0,
      perjalanan: Array.isArray(data.perjalanan)
        ? data.perjalanan.map((p) => ({ ...p }))
        : [],
    }))
  })

  // Statistik dashboard
  const dashboardStats = computed(() => {
    const totalJudul = stokList.value.length
    const totalReorder = itemsUnderSafety.value.length
    const totalDO = Object.keys(trackingMap.value).length
    const totalStokFisik = stokList.value.reduce((acc, curr) => acc + (Number(curr.qty) || 0), 0)

    return {
      totalJudul,
      totalReorder,
      totalDO,
      totalStokFisik,
    }
  })

  // ==========================================
  // ACTIONS / METHODS (CRUD & Operations)
  // ==========================================

  // Reset filter stok
  function resetStokFilter() {
    selectedUpbjj.value = ''
    selectedKategori.value = ''
    onlyReorder.value = false
    sortBy.value = 'judul'
    sortOrder.value = 'asc'
  }

  // Tambah bahan ajar baru (validasi non-negatif & sanitasi XSS)
  function addStok(item) {
    const sanitizedCatatan = sanitizeHtml(item.catatanHTML || '')
    const cleanItem = {
      kode: String(item.kode || '').trim().toUpperCase(),
      judul: String(item.judul || '').trim(),
      kategori: String(item.kategori || '').trim(),
      upbjj: String(item.upbjj || '').trim(),
      lokasiRak: String(item.lokasiRak || '').trim().toUpperCase(),
      harga: Math.max(0, Number(item.harga) || 0),
      qty: Math.max(0, Number(item.qty) || 0),
      safety: Math.max(0, Number(item.safety) || 0),
      catatanHTML: sanitizedCatatan || '<em>Tidak ada catatan</em>',
    }

    // Cek apakah kode sudah terdaftar
    const existingIndex = stokList.value.findIndex((i) => i.kode === cleanItem.kode)
    if (existingIndex !== -1) {
      throw new Error(`Kode bahan ajar "${cleanItem.kode}" sudah terdaftar. Gunakan fitur edit untuk memperbarui.`)
    }

    stokList.value.unshift(cleanItem)
  }

  // Update data bahan ajar
  function updateStok(kode, updatedData) {
    const index = stokList.value.findIndex((i) => i.kode === kode)
    if (index === -1) {
      throw new Error(`Data bahan ajar dengan kode "${kode}" tidak ditemukan.`)
    }

    const current = stokList.value[index]
    const sanitizedCatatan = updatedData.catatanHTML !== undefined
      ? sanitizeHtml(updatedData.catatanHTML)
      : current.catatanHTML

    stokList.value[index] = {
      ...current,
      ...updatedData,
      harga: updatedData.harga !== undefined ? Math.max(0, Number(updatedData.harga)) : current.harga,
      qty: updatedData.qty !== undefined ? Math.max(0, Number(updatedData.qty)) : current.qty,
      safety: updatedData.safety !== undefined ? Math.max(0, Number(updatedData.safety)) : current.safety,
      catatanHTML: sanitizedCatatan,
    }
  }

  // Hapus data bahan ajar
  function deleteStok(kode) {
    stokList.value = stokList.value.filter((i) => i.kode !== kode)
  }

  // Standardisasi Generator Nomor DO Baru (Pola DOYYYY-XXX dengan 3 digit padStart)
  function getNextDONumber() {
    const year = new Date().getFullYear()
    const prefix = `DO${year}-`

    // Kumpulkan urutan angka dari DO tahun berjalan
    let maxSequence = 0
    Object.keys(trackingMap.value).forEach((key) => {
      if (key.startsWith(prefix)) {
        const seqPart = key.replace(prefix, '')
        const num = parseInt(seqPart, 10)
        if (!isNaN(num) && num > maxSequence) {
          maxSequence = num
        }
      }
    })

    const nextSeq = maxSequence + 1
    return `${prefix}${String(nextSeq).padStart(3, '0')}`
  }

  // Tambah Delivery Order baru
  function addDeliveryOrder(orderData) {
    const nomorDO = getNextDONumber()
    const now = new Date()
    const nowFormatted = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    const timeFormatted = now.toISOString().replace('T', ' ').substring(0, 19)

    trackingMap.value[nomorDO] = {
      nim: String(orderData.nim || '-').trim(),
      nama: String(orderData.nama || '-').trim(),
      status: 'Pesanan Didaftarkan',
      progress: 10,
      ekspedisi: orderData.ekspedisi || 'JNE Regular (3-5 hari)',
      tanggalKirim: orderData.tanggalKirim || nowFormatted,
      paket: orderData.paket || '-',
      total: Number(orderData.total) || 0,
      perjalanan: [
        {
          waktu: timeFormatted,
          keterangan: `Pendaftaran DO baru di Loket SITTA ${orderData.upbjj || 'Pusat'}`,
        },
      ],
    }

    return nomorDO
  }

  // Tambah riwayat progres perjalanan pengiriman
  function addTrackingProgress(nomorDO, keterangan) {
    if (!trackingMap.value[nomorDO]) {
      throw new Error(`Nomor DO "${nomorDO}" tidak ditemukan.`)
    }

    const now = new Date()
    const timeFormatted = now.toISOString().replace('T', ' ').substring(0, 19)
    const currentProgress = Number(trackingMap.value[nomorDO].progress) || 10
    const nextProgress = Math.min(100, currentProgress + 25)

    let nextStatus = trackingMap.value[nomorDO].status
    if (nextProgress >= 100) {
      nextStatus = 'Telah Diterima'
    } else if (nextProgress >= 50) {
      nextStatus = 'Dalam Perjalanan'
    }

    trackingMap.value[nomorDO].progress = nextProgress
    trackingMap.value[nomorDO].status = nextStatus
    trackingMap.value[nomorDO].perjalanan.push({
      waktu: timeFormatted,
      keterangan: String(keterangan || '').trim(),
    })
  }

  return {
    // State
    stokList,
    trackingMap,
    upbjjList,
    kategoriList,
    pengirimanList,
    paketList,
    selectedUpbjj,
    selectedKategori,
    onlyReorder,
    sortBy,
    sortOrder,

    // Computed
    availableKategoriList,
    filteredStok,
    daftarDO,
    dashboardStats,

    // Actions
    resetStokFilter,
    addStok,
    updateStok,
    deleteStok,
    getNextDONumber,
    addDeliveryOrder,
    addTrackingProgress,
  }
}
