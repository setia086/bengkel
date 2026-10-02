<script setup>
import { onMounted } from "vue";
import { useDashboardStore } from "../stores/dashboard";
import VueApexCharts from "vue3-apexcharts";


import {
  UsersIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  BanknotesIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/vue/24/outline";

const dashboard = useDashboardStore();

onMounted(() => {
  dashboard.loadDashboard();
});

const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

const cards = [
  {
    title: "Pelanggan",
    key: "totalPelanggan",
    icon: UsersIcon,
    bg: "bg-blue-50",
    iconBg: "bg-blue-600",
  },
  {
    title: "Kendaraan",
    key: "totalKendaraan",
    icon: TruckIcon,
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-600",
  },
  {
    title: "Total Servis",
    key: "totalServis",
    icon: WrenchScrewdriverIcon,
    bg: "bg-amber-50",
    iconBg: "bg-amber-500",
  },
];

const revenueChart = {
  series: [
    {
      name: "Pendapatan",
      data: [0, 0, 0, 0, 0, 0, dashboard.statistik.pendapatan],
    },
  ],

  options: {
    chart: {
      type: "area",
      toolbar: {
        show: false,
      },
    },

    stroke: {
      curve: "smooth",
      width: 3,
    },

    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
      ],
    },

    yaxis: {
      labels: {
        formatter: (value) =>
          new Intl.NumberFormat("id-ID", {
            notation: "compact",
          }).format(value),
      },
    },

    tooltip: {
      y: {
        formatter: (value) =>
          new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          }).format(value),
      },
    },
  },
};
</script>

<template>
  <div class="space-y-8">

    <!-- HEADER -->
    <div>
      <h1 class="text-3xl font-bold text-slate-800">
        Dashboard
      </h1>

      <p class="mt-1 text-slate-500">
        Ringkasan aktivitas bengkel hari ini.
      </p>
    </div>

    <!-- LOADING -->
    <div
      v-if="dashboard.loading"
      class="rounded-2xl bg-white p-8 text-center shadow-sm"
    >
      <p class="text-slate-500">
        Memuat data dashboard...
      </p>
    </div>

    <!-- ERROR -->
    <div
      v-else-if="dashboard.error"
      class="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700"
    >
      {{ dashboard.error }}
    </div>

    <template v-else>

      <!-- STATISTIC CARDS -->
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

        <div
          v-for="card in cards"
          :key="card.key"
          class="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div class="flex items-center justify-between">

            <div>
              <p class="text-sm font-medium text-slate-500">
                {{ card.title }}
              </p>

              <h2 class="mt-2 text-3xl font-bold text-slate-800">
                {{ dashboard.statistik[card.key] }}
              </h2>
            </div>

            <div
              :class="[card.bg, 'rounded-2xl p-4']"
            >
              <component
                :is="card.icon"
                :class="[card.iconBg, 'h-12 w-12 rounded-xl p-3 text-white']"
              />
            </div>

          </div>
        </div>

        <!-- PENDAPATAN -->
        <div
          class="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div class="flex items-center justify-between">

            <div>
              <p class="text-sm font-medium text-slate-500">
                Pendapatan
              </p>

              <h2 class="mt-2 text-2xl font-bold text-slate-800">
                {{ formatRupiah(dashboard.statistik.pendapatan) }}
              </h2>
            </div>

            <div class="rounded-2xl bg-red-50 p-4">
              <BanknotesIcon
                class="h-12 w-12 rounded-xl bg-red-600 p-3 text-white"
              />
            </div>

          </div>
        </div>

      </div>

      <!-- STATUS SERVIS -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">

        <div class="rounded-2xl bg-white p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="rounded-xl bg-amber-100 p-3">
              <ClockIcon class="h-7 w-7 text-amber-600" />
            </div>

            <div>
              <p class="text-sm text-slate-500">
                Menunggu
              </p>

              <p class="text-2xl font-bold text-slate-800">
                {{ dashboard.servis.menunggu }}
              </p>
            </div>
          </div>
        </div>

        <div class="rounded-2xl bg-white p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="rounded-xl bg-blue-100 p-3">
              <WrenchScrewdriverIcon class="h-7 w-7 text-blue-600" />
            </div>

            <div>
              <p class="text-sm text-slate-500">
                Dalam Proses
              </p>

              <p class="text-2xl font-bold text-slate-800">
                {{ dashboard.servis.proses }}
              </p>
            </div>
          </div>
        </div>

        <div class="rounded-2xl bg-white p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="rounded-xl bg-emerald-100 p-3">
              <CheckCircleIcon class="h-7 w-7 text-emerald-600" />
            </div>

            <div>
              <p class="text-sm text-slate-500">
                Selesai
              </p>

              <p class="text-2xl font-bold text-slate-800">
                {{ dashboard.servis.selesai }}
              </p>
            </div>
          </div>
        </div>

      </div>

      <!-- INFO -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">

        <!-- SERVIS TERBARU -->
        <div class="rounded-2xl bg-white shadow-sm">

          <div class="border-b border-slate-100 p-6">
            <h2 class="text-lg font-bold text-slate-800">
              Servis Terbaru
            </h2>

            <p class="text-sm text-slate-500">
              Aktivitas servis terakhir
            </p>
          </div>

          <div class="divide-y divide-slate-100">

            <div
              v-for="item in dashboard.servisTerbaru.slice(0, 5)"
              :key="item.id"
              class="flex items-center justify-between p-5"
            >

              <div>
                <p class="font-semibold text-slate-800">
                  {{ item.kodeServis }}
                </p>

                <p class="text-sm text-slate-500">
                  {{ item.kendaraan?.pelanggan?.nama || "-" }}
                </p>
              </div>

              <div class="text-right">
                <p class="font-semibold text-slate-800">
                  {{ formatRupiah(item.totalBiaya) }}
                </p>

                <span
                  class="text-xs font-medium text-slate-500"
                >
                  {{ item.status }}
                </span>
              </div>

            </div>

            <div
              v-if="dashboard.servisTerbaru.length === 0"
              class="p-8 text-center text-slate-400"
            >
              Belum ada servis.
            </div>

          </div>
        </div>

        <!-- STOK -->
        <div class="rounded-2xl bg-white shadow-sm">

          <div class="border-b border-slate-100 p-6">
            <h2 class="text-lg font-bold text-slate-800">
              Stok Sparepart
            </h2>

            <p class="text-sm text-slate-500">
              Sparepart dengan stok menipis
            </p>
          </div>

          <div
            v-if="dashboard.stokMenipis.length"
            class="divide-y divide-slate-100"
          >
            <div
              v-for="item in dashboard.stokMenipis"
              :key="item.id"
              class="flex items-center justify-between p-5"
            >
              <p class="font-medium text-slate-800">
                {{ item.nama }}
              </p>

              <span class="rounded-lg bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
                Stok {{ item.stok }}
              </span>
            </div>
          </div>

          <div
            v-else
            class="flex min-h-40 items-center justify-center p-8 text-center"
          >
            <div>
              <ClipboardDocumentCheckIcon
                class="mx-auto h-12 w-12 text-emerald-500"
              />

              <p class="mt-3 font-medium text-slate-700">
                Stok aman
              </p>

              <p class="text-sm text-slate-400">
                Tidak ada sparepart yang menipis.
              </p>
            </div>
          </div>

        </div>

      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">

  <!-- Grafik Pendapatan -->
  <div class="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm">

    <div class="mb-6">
      <h2 class="text-lg font-bold text-slate-800">
        Pendapatan
      </h2>

      <p class="text-sm text-slate-500">
        Ringkasan pendapatan bengkel
      </p>
    </div>

    <VueApexCharts
      type="area"
      height="320"
      :options="revenueChart.options"
      :series="revenueChart.series"
    />

  </div>

  <!-- Status Servis -->
  <div class="rounded-2xl bg-white p-6 shadow-sm">

    <div class="mb-6">
      <h2 class="text-lg font-bold text-slate-800">
        Status Servis
      </h2>

      <p class="text-sm text-slate-500">
        Kondisi servis saat ini
      </p>
    </div>

    <VueApexCharts
      type="donut"
      height="300"
      :options="{
        labels: ['Menunggu', 'Proses', 'Selesai']
      }"
      :series="[
        dashboard.servis.menunggu,
        dashboard.servis.proses,
        dashboard.servis.selesai
      ]"
    />

  </div>

</div>

    </template>
  </div>
</template>