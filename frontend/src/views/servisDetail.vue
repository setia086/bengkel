<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api/axios";

const route = useRoute();
const router = useRouter();

const servis = ref(null);
const loading = ref(false);
const error = ref("");

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
    month: "long",
    year: "numeric",
  });
};

const totalPekerjaan = computed(() => {
  return (servis.value?.detailServis || []).reduce(
    (total, item) => total + Number(item.biaya || 0),
    0
  );
});

const totalSparepart = computed(() => {
  return (servis.value?.detailSparepart || []).reduce(
    (total, item) => total + Number(item.subtotal || 0),
    0
  );
});

const total = computed(() => {
  return totalPekerjaan.value + totalSparepart.value;
});

const loadDetail = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await api.get(`/servis/${route.params.id}`);

    const payload = response.data;
    const data =
      payload?.data?.data ??
      payload?.data ??
      payload ??
      null;

    servis.value = data;
  } catch (err) {
    console.error(err);

    error.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Gagal mengambil detail servis";
  } finally {
    loading.value = false;
  }
};

onMounted(loadDetail);
</script>

<template>
  <div class="space-y-6">

    <!-- HEADER -->
    <div class="flex items-center justify-between">

      <div>
        <button
          @click="router.push('/servis')"
          class="mb-3 text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          ← Kembali ke Servis
        </button>

        <h1 class="text-3xl font-bold text-slate-800">
          Detail Servis
        </h1>

        <p class="mt-1 text-slate-500">
          Informasi lengkap pekerjaan dan sparepart servis.
        </p>
      </div>

      <div
        v-if="servis"
        class="rounded-xl bg-slate-100 px-4 py-3 text-right"
      >
        <p class="text-xs text-slate-500">
          Kode Servis
        </p>

        <p class="font-bold text-slate-800">
          {{ servis.kodeServis }}
        </p>
      </div>

    </div>

    <!-- LOADING -->
    <div
      v-if="loading"
      class="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm"
    >
      Memuat detail servis...
    </div>

    <!-- ERROR -->
    <div
      v-else-if="error"
      class="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600"
    >
      {{ error }}
    </div>

    <template v-else-if="servis">

      <!-- INFORMASI SERVIS -->
      <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <div class="rounded-2xl bg-white p-5 shadow-sm">
          <p class="text-sm text-slate-500">
            Pelanggan
          </p>

          <p class="mt-2 font-bold text-slate-800">
            {{ servis.kendaraan?.pelanggan?.nama || "-" }}
          </p>

          <p class="mt-1 text-sm text-slate-500">
            {{ servis.kendaraan?.pelanggan?.telepon || "-" }}
          </p>
        </div>

        <div class="rounded-2xl bg-white p-5 shadow-sm">
          <p class="text-sm text-slate-500">
            Kendaraan
          </p>

          <p class="mt-2 font-bold text-slate-800">
            {{ servis.kendaraan?.platNomor || "-" }}
          </p>

          <p class="mt-1 text-sm text-slate-500">
            {{ servis.kendaraan?.merk || "" }}
            {{ servis.kendaraan?.tipe || "" }}
          </p>
        </div>

        <div class="rounded-2xl bg-white p-5 shadow-sm">
          <p class="text-sm text-slate-500">
            Mekanik
          </p>

          <p class="mt-2 font-bold text-slate-800">
            {{ servis.mekanik?.nama || "-" }}
          </p>

          <p class="mt-1 text-sm text-slate-500">
            {{ servis.mekanik?.spesialis || "Mekanik" }}
          </p>
        </div>

        <div class="rounded-2xl bg-white p-5 shadow-sm">
          <p class="text-sm text-slate-500">
            Status
          </p>

          <p class="mt-2">
            <span
              class="inline-block rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700"
            >
              {{ servis.status }}
            </span>
          </p>

          <p class="mt-1 text-sm text-slate-500">
            {{ formatTanggal(servis.tanggal) }}
          </p>
        </div>

      </div>

      <!-- KELUHAN -->
      <div class="rounded-2xl bg-white p-6 shadow-sm">

        <h2 class="text-lg font-bold text-slate-800">
          Keluhan Pelanggan
        </h2>

        <p class="mt-3 text-slate-600">
          {{ servis.keluhan || "Tidak ada keluhan." }}
        </p>

        <div class="mt-4 text-sm text-slate-500">
          Kilometer:
          <span class="font-semibold text-slate-700">
            {{ servis.kilometer?.toLocaleString("id-ID") || "-" }} km
          </span>
        </div>

      </div>

      <!-- DETAIL PEKERJAAN -->
      <div class="rounded-2xl bg-white shadow-sm">

        <div class="border-b p-6">
          <h2 class="text-lg font-bold text-slate-800">
            Detail Pekerjaan
          </h2>

          <p class="mt-1 text-sm text-slate-500">
            Jasa atau pekerjaan yang dilakukan mekanik.
          </p>
        </div>

        <div class="overflow-x-auto">

          <table class="w-full text-left">

            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-4 text-sm font-semibold text-slate-600">
                  No
                </th>

                <th class="px-6 py-4 text-sm font-semibold text-slate-600">
                  Pekerjaan
                </th>

                <th class="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                  Biaya
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">

              <tr
                v-for="(item, index) in servis.detailServis"
                :key="item.id"
              >
                <td class="px-6 py-4 text-slate-500">
                  {{ index + 1 }}
                </td>

                <td class="px-6 py-4 font-medium text-slate-800">
                  {{ item.namaPekerjaan }}
                </td>

                <td class="px-6 py-4 text-right font-medium text-slate-700">
                  {{ formatRupiah(item.biaya) }}
                </td>
              </tr>

              <tr v-if="!servis.detailServis?.length">
                <td
                  colspan="3"
                  class="px-6 py-8 text-center text-slate-400"
                >
                  Belum ada detail pekerjaan.
                </td>
              </tr>

            </tbody>

            <tfoot class="border-t bg-slate-50">
              <tr>
                <td colspan="2" class="px-6 py-4 text-right font-semibold">
                  Total Pekerjaan
                </td>

                <td class="px-6 py-4 text-right font-bold text-slate-800">
                  {{ formatRupiah(totalPekerjaan) }}
                </td>
              </tr>
            </tfoot>

          </table>

        </div>

      </div>

      <!-- DETAIL SPAREPART -->
      <div class="rounded-2xl bg-white shadow-sm">

        <div class="border-b p-6">
          <h2 class="text-lg font-bold text-slate-800">
            Detail Sparepart
          </h2>

          <p class="mt-1 text-sm text-slate-500">
            Sparepart yang digunakan dalam servis.
          </p>
        </div>

        <div class="overflow-x-auto">

          <table class="w-full text-left">

            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-4 text-sm font-semibold text-slate-600">
                  No
                </th>

                <th class="px-6 py-4 text-sm font-semibold text-slate-600">
                  Sparepart
                </th>

                <th class="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                  Jumlah
                </th>

                <th class="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                  Harga
                </th>

                <th class="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                  Subtotal
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">

              <tr
                v-for="(item, index) in servis.detailSparepart"
                :key="item.id"
              >
                <td class="px-6 py-4 text-slate-500">
                  {{ index + 1 }}
                </td>

                <td class="px-6 py-4">
                  <p class="font-medium text-slate-800">
                    {{ item.sparepart?.nama || "-" }}
                  </p>

                  <p class="text-sm text-slate-500">
                    {{ item.sparepart?.merk || "" }}
                  </p>
                </td>

                <td class="px-6 py-4 text-center">
                  {{ item.jumlah }}
                </td>

                <td class="px-6 py-4 text-right text-slate-600">
                  {{ formatRupiah(item.harga) }}
                </td>

                <td class="px-6 py-4 text-right font-semibold text-slate-800">
                  {{ formatRupiah(item.subtotal) }}
                </td>
              </tr>

              <tr v-if="!servis.detailSparepart?.length">
                <td
                  colspan="5"
                  class="px-6 py-8 text-center text-slate-400"
                >
                  Tidak ada sparepart yang digunakan.
                </td>
              </tr>

            </tbody>

            <tfoot class="border-t bg-slate-50">
              <tr>
                <td colspan="4" class="px-6 py-4 text-right font-semibold">
                  Total Sparepart
                </td>

                <td class="px-6 py-4 text-right font-bold text-slate-800">
                  {{ formatRupiah(totalSparepart) }}
                </td>
              </tr>
            </tfoot>

          </table>

        </div>

      </div>

      <!-- TOTAL -->
      <div class="rounded-2xl bg-slate-900 p-6 text-white shadow-sm">

        <div class="flex items-center justify-between">

          <div>
            <p class="text-sm text-slate-300">
              Total Biaya Servis
            </p>

            <p class="mt-1 text-3xl font-bold">
              {{ formatRupiah(total) }}
            </p>
          </div>

          <div class="text-right text-sm text-slate-300">
            <p>
              Jasa:
              {{ formatRupiah(totalPekerjaan) }}
            </p>

            <p>
              Sparepart:
              {{ formatRupiah(totalSparepart) }}
            </p>
          </div>

        </div>

      </div>

    </template>

  </div>
</template>