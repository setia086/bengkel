<script setup>
import { computed, onMounted, ref } from "vue";
import api from "../api/axios";

const loading = ref(false);
const error = ref("");
const dashboard = ref({
  totalPelanggan: 0,
  totalKendaraan: 0,
  totalMekanik: 0,
  totalServis: 0,
  totalPembayaran: 0,
  servis: {
    menunggu: 0,
    proses: 0,
    selesai: 0,
  },
  servisTerbaru: [],
  pembayaranTerbaru: [],
});

const loadDashboard = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await api.get("/dashboard");
    const payload = response.data;

    dashboard.value = {
      ...dashboard.value,
      ...(payload?.data || payload || {}),
    };
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.message || "Gagal mengambil data laporan";
  } finally {
    loading.value = false;
  }
};

const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

const formatTanggal = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const totalStatus = computed(() => {
  const { menunggu = 0, proses = 0, selesai = 0 } = dashboard.value.servis || {};
  return [
    { label: "Menunggu", value: menunggu, color: "bg-amber-100 text-amber-700" },
    { label: "Proses", value: proses, color: "bg-blue-100 text-blue-700" },
    { label: "Selesai", value: selesai, color: "bg-emerald-100 text-emerald-700" },
  ];
});

onMounted(loadDashboard);
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Laporan</h1>
        <p class="mt-1 text-slate-500">Ringkasan performa dan transaksi bengkel.</p>
      </div>
    </div>

    <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
      {{ error }}
    </div>

    <div v-if="loading" class="rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">
      Memuat data laporan...
    </div>

    <template v-else>
      <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-2xl bg-white p-5 shadow-sm">
          <p class="text-sm text-slate-500">Total Pelanggan</p>
          <p class="mt-2 text-3xl font-bold text-slate-800">{{ dashboard.totalPelanggan }}</p>
        </div>

        <div class="rounded-2xl bg-white p-5 shadow-sm">
          <p class="text-sm text-slate-500">Total Kendaraan</p>
          <p class="mt-2 text-3xl font-bold text-slate-800">{{ dashboard.totalKendaraan }}</p>
        </div>

        <div class="rounded-2xl bg-white p-5 shadow-sm">
          <p class="text-sm text-slate-500">Total Mekanik</p>
          <p class="mt-2 text-3xl font-bold text-slate-800">{{ dashboard.totalMekanik }}</p>
        </div>

        <div class="rounded-2xl bg-white p-5 shadow-sm">
          <p class="text-sm text-slate-500">Total Servis</p>
          <p class="mt-2 text-3xl font-bold text-slate-800">{{ dashboard.totalServis }}</p>
        </div>
      </div>

      <div class="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div class="rounded-2xl bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-slate-800">Status Servis</h2>
              <p class="text-sm text-slate-500">Distribusi pekerjaan servis saat ini.</p>
            </div>
          </div>

          <div class="mt-6 grid gap-4 md:grid-cols-3">
            <div v-for="item in totalStatus" :key="item.label" class="rounded-2xl border border-slate-200 p-4">
              <div :class="['inline-flex rounded-full px-3 py-1 text-sm font-semibold', item.color]">
                {{ item.label }}
              </div>
              <p class="mt-4 text-3xl font-bold text-slate-800">{{ item.value }}</p>
            </div>
          </div>
        </div>

        <div class="rounded-2xl bg-white p-6 shadow-sm">
          <h2 class="text-lg font-bold text-slate-800">Ringkasan Keuangan</h2>
          <p class="mt-1 text-sm text-slate-500">Total penerimaan transaksi pembayaran.</p>

          <div class="mt-6 space-y-4">
            <div class="rounded-2xl bg-slate-50 p-4">
              <p class="text-sm text-slate-500">Total Pembayaran</p>
              <p class="mt-1 text-2xl font-bold text-slate-800">{{ formatRupiah(dashboard.totalPembayaran) }}</p>
            </div>
            <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p class="text-sm text-emerald-700">Status</p>
              <p class="mt-1 text-xl font-semibold text-emerald-800">Transaksi berjalan baik</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid gap-5 xl:grid-cols-2">
        <div class="rounded-2xl bg-white p-6 shadow-sm">
          <h2 class="text-lg font-bold text-slate-800">Servis Terbaru</h2>
          <p class="mt-1 text-sm text-slate-500">Aktivitas servis terakhir.</p>

          <div class="mt-4 space-y-3">
            <div v-for="item in dashboard.servisTerbaru.slice(0, 5)" :key="item.id" class="rounded-xl border border-slate-200 p-4">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="font-semibold text-slate-800">{{ item.kodeServis }}</p>
                  <p class="text-sm text-slate-500">{{ item.kendaraan?.platNomor || "-" }}</p>
                </div>
                <span class="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  {{ item.status }}
                </span>
              </div>
            </div>

            <div v-if="dashboard.servisTerbaru.length === 0" class="rounded-xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-400">
              Belum ada servis terbaru.
            </div>
          </div>
        </div>

        <div class="rounded-2xl bg-white p-6 shadow-sm">
          <h2 class="text-lg font-bold text-slate-800">Pembayaran Terbaru</h2>
          <p class="mt-1 text-sm text-slate-500">Riwayat transaksi pembayaran terbaru.</p>

          <div class="mt-4 space-y-3">
            <div v-for="item in dashboard.pembayaranTerbaru.slice(0, 5)" :key="item.id" class="rounded-xl border border-slate-200 p-4">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="font-semibold text-slate-800">{{ item.servis?.kodeServis || "-" }}</p>
                  <p class="text-sm text-slate-500">{{ formatTanggal(item.tanggalBayar || item.createdAt) }}</p>
                </div>
                <span class="font-semibold text-slate-700">{{ formatRupiah(item.total) }}</span>
              </div>
            </div>

            <div v-if="dashboard.pembayaranTerbaru.length === 0" class="rounded-xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-400">
              Belum ada pembayaran terbaru.
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
