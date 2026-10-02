<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api/axios";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  PlusIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/vue/24/outline";

const router = useRouter();
const loading = ref(true);
const error = ref("");
const user = ref({});
const vehicles = ref([]);
const services = ref([]);
const payments = ref([]);

const decodeToken = () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    return token ? JSON.parse(atob(token.split(".")[1])) : {};
  } catch {
    return {};
  }
};

const unwrap = (response) => response?.data?.data ?? response?.data ?? [];
const request = async (url, fallback) => {
  try {
    return unwrap(await api.get(url));
  } catch {
    return fallback;
  }
};

const activeServices = computed(() => services.value.filter((item) => ["menunggu", "proses", "booking", "booked"].includes(String(item.status || "").toLowerCase())));
const completedServices = computed(() => services.value.filter((item) => String(item.status || "").toLowerCase() === "selesai"));
const totalPayment = computed(() => payments.value.reduce((sum, item) => sum + Number(item.dibayar ?? item.total ?? 0), 0));
const latestBookings = computed(() => activeServices.value.slice(0, 4));
const latestHistory = computed(() => services.value.slice(0, 4));
const displayName = computed(() => user.value.nama || user.value.name || user.value.email?.split("@")[0] || decodeToken().nama || "Pelanggan");

const formatCurrency = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));
const formatDate = (value) => value ? new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)) : "-";
const statusClass = (status) => String(status).toLowerCase() === "selesai" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700";

const loadDashboard = async () => {
  loading.value = true;
  error.value = "";
  const result = await request("/dashboard/user", {});
  user.value = result?.user ?? {};
  vehicles.value = result?.kendaraan ?? [];
  services.value = result?.servis ?? [];
  payments.value = result?.pembayaran ?? [];
  if (!user.value.id && !vehicles.value.length && !services.value.length) error.value = "Data dashboard belum dapat dimuat.";
  loading.value = false;
};

onMounted(loadDashboard);
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-6">
    <section class="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-8">
      <div class="absolute -right-10 -top-16 h-48 w-48 rounded-full border-[26px] border-cyan-400/20" />
      <div class="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm font-medium text-cyan-300">Selamat datang kembali</p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{{ displayName }}</h1>
          <p class="mt-2 max-w-lg text-sm leading-6 text-slate-300">Pantau kendaraan, jadwal servis, dan pembayaran Anda dari satu tempat.</p>
        </div>
        <button class="inline-flex w-fit items-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300" @click="router.push('/user/booking')">
          <PlusIcon class="h-5 w-5" /> Booking Servis
        </button>
      </div>
    </section>

    <div v-if="loading" class="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">Memuat dashboard...</div>
    <div v-else-if="error" class="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800">{{ error }}</div>

    <template v-else>
      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div v-for="card in [
          { label: 'Total kendaraan', value: vehicles.length, icon: TruckIcon, color: 'bg-cyan-50 text-cyan-700' },
          { label: 'Booking aktif', value: activeServices.length, icon: CalendarDaysIcon, color: 'bg-amber-50 text-amber-700' },
          { label: 'Servis selesai', value: completedServices.length, icon: CheckCircleIcon, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Total pembayaran', value: formatCurrency(totalPayment), icon: CreditCardIcon, color: 'bg-blue-50 text-blue-700' },
        ]" :key="card.label" class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <div class="flex items-start justify-between gap-3"><div><p class="text-sm text-slate-500">{{ card.label }}</p><p class="mt-2 text-2xl font-bold text-slate-900">{{ card.value }}</p></div><component :is="card.icon" :class="['h-11 w-11 rounded-xl p-2.5', card.color]" /></div>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div class="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
          <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 class="font-bold text-slate-900">Booking terbaru</h2><p class="mt-1 text-sm text-slate-500">Pantau status kunjungan servis Anda.</p></div><CalendarDaysIcon class="h-6 w-6 text-cyan-600" /></div>
          <div v-if="latestBookings.length" class="divide-y divide-slate-100"><div v-for="item in latestBookings" :key="item.id" class="flex items-center justify-between gap-4 px-5 py-4"><div><p class="font-semibold text-slate-800">{{ item.kodeServis || `Booking #${item.id}` }}</p><p class="mt-1 text-sm text-slate-500">{{ item.kendaraan?.platNomor || "Kendaraan" }} · {{ formatDate(item.tanggal || item.createdAt) }}</p></div><span :class="['rounded-full px-3 py-1 text-xs font-bold', statusClass(item.status)]">{{ item.status || "Menunggu" }}</span></div></div>
          <p v-else class="px-5 py-10 text-center text-sm text-slate-400">Belum ada booking aktif.</p>
        </div>

        <div class="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70"><div class="border-b border-slate-100 px-5 py-4"><h2 class="font-bold text-slate-900">Kendaraan saya</h2><p class="mt-1 text-sm text-slate-500">{{ vehicles.length }} kendaraan terdaftar</p></div><div v-if="vehicles.length" class="divide-y divide-slate-100"><div v-for="vehicle in vehicles.slice(0, 3)" :key="vehicle.id" class="flex items-center gap-3 px-5 py-4"><div class="rounded-xl bg-slate-100 p-2.5"><TruckIcon class="h-5 w-5 text-slate-600" /></div><div><p class="font-semibold text-slate-800">{{ vehicle.merk }} {{ vehicle.tipe }}</p><p class="mt-1 text-sm text-slate-500">{{ vehicle.platNomor }}<span v-if="vehicle.tahun"> · {{ vehicle.tahun }}</span></p></div></div></div><p v-else class="px-5 py-10 text-center text-sm text-slate-400">Belum ada kendaraan.</p></div>
      </section>

      <section class="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70"><div class="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 class="font-bold text-slate-900">Riwayat servis terbaru</h2><p class="mt-1 text-sm text-slate-500">Aktivitas servis terakhir kendaraan Anda.</p></div><WrenchScrewdriverIcon class="h-6 w-6 text-cyan-600" /></div><div v-if="latestHistory.length" class="grid divide-y divide-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0"><div v-for="item in latestHistory" :key="item.id" class="flex items-center justify-between gap-4 px-5 py-4"><div><p class="font-semibold text-slate-800">{{ item.kodeServis || `Servis #${item.id}` }}</p><p class="mt-1 text-sm text-slate-500">{{ item.kendaraan?.platNomor || "-" }} · {{ formatDate(item.tanggal || item.createdAt) }}</p></div><div class="text-right"><span :class="['rounded-full px-3 py-1 text-xs font-bold', statusClass(item.status)]">{{ item.status || "-" }}</span><p class="mt-2 text-sm font-semibold text-slate-700">{{ formatCurrency(item.totalBiaya) }}</p></div></div></div><p v-else class="px-5 py-10 text-center text-sm text-slate-400">Belum ada riwayat servis.</p></section>
    </template>
  </div>
</template>