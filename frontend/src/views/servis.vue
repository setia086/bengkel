<script setup>
import { onMounted, ref } from "vue";
import api from "../api/axios";

const servis = ref([]);
const loading = ref(false);
const error = ref("");
const search = ref("");
const showModal = ref(false);
const editingId = ref(null);
const form = ref({
  kodeServis: "",
  kendaraanId: "",
  mekanikId: "",
  tanggal: "",
  keluhan: "",
  kilometer: "",
  status: "Menunggu",
});
const kendaraanOptions = ref([]);
const mekanikOptions = ref([]);

const resetForm = () => {
  form.value = {
    kodeServis: "",
    kendaraanId: "",
    mekanikId: "",
    tanggal: "",
    keluhan: "",
    kilometer: "",
    status: "Menunggu",
  };
  editingId.value = null;
};

const openCreate = () => {
  resetForm();
  showModal.value = true;
};

const openEdit = (item) => {
  editingId.value = item.id;
  form.value = {
    kodeServis: item.kodeServis || "",
    kendaraanId: item.kendaraanId || "",
    mekanikId: item.mekanikId || "",
    tanggal: item.tanggal ? new Date(item.tanggal).toISOString().slice(0, 10) : "",
    keluhan: item.keluhan || "",
    kilometer: item.kilometer || "",
    status: item.status || "Menunggu",
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const loadKendaraanOptions = async () => {
  try {
    const response = await api.get("/kendaraan");
    const payload = response.data?.data ?? response.data ?? [];
    const items = Array.isArray(payload) ? payload : Array.isArray(payload.data) ? payload.data : [];
    kendaraanOptions.value = items;
  } catch (err) {
    console.error(err);
  }
};

const loadMekanikOptions = async () => {
  try {
    const response = await api.get("/mekanik");
    const payload = response.data?.data ?? response.data ?? [];
    const items = Array.isArray(payload) ? payload : Array.isArray(payload.data) ? payload.data : [];
    mekanikOptions.value = items;
  } catch (err) {
    console.error(err);
  }
};

const loadServis = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await api.get("/servis", {
      params: {
        search: search.value,
      },
    });

    const payload = response.data;
    const data = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.data?.data)
          ? payload.data.data
          : [];

    servis.value = data;
  } catch (err) {
    console.error(err);

    error.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Gagal mengambil data servis";
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  const payload = {
    kodeServis: form.value.kodeServis.trim(),
    kendaraanId: Number(form.value.kendaraanId),
    mekanikId: Number(form.value.mekanikId),
    tanggal: form.value.tanggal ? new Date(form.value.tanggal).toISOString() : new Date().toISOString(),
    keluhan: form.value.keluhan?.trim() || "",
    kilometer: form.value.kilometer ? Number(form.value.kilometer) : null,
    status: form.value.status || "Menunggu",
    totalBiaya: 0,
  };

  if (!payload.kodeServis || !payload.kendaraanId || !payload.mekanikId) {
    alert("Kode servis, kendaraan, dan mekanik wajib diisi");
    return;
  }

  try {
    if (editingId.value) {
      await api.put(`/servis/${editingId.value}`, payload);
    } else {
      await api.post("/servis", payload);
    }

    await loadServis();
    closeModal();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Gagal menyimpan servis");
  }
};

const hapusServis = async (id) => {
  if (!confirm("Yakin ingin menghapus servis ini?")) return;

  try {
    await api.delete(`/servis/${id}`);
    await loadServis();
  } catch (err) {
    console.error(err);

    alert(
      err.response?.data?.message ||
      "Gagal menghapus data servis"
    );
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

onMounted(() => {
  loadServis();
  loadKendaraanOptions();
  loadMekanikOptions();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Servis</h1>
        <p class="mt-1 text-slate-500">Kelola pekerjaan servis kendaraan pelanggan.</p>
      </div>

      <button @click="openCreate" class="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800">
        + Buat Servis
      </button>
    </div>

    <div class="rounded-2xl bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-3 md:flex-row">
        <input
          v-model="search"
          @keyup.enter="loadServis"
          type="text"
          placeholder="Cari kode servis, plat nomor, atau nama pelanggan..."
          class="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
        />

        <button @click="loadServis" class="rounded-xl bg-slate-700 px-6 py-3 font-medium text-white hover:bg-slate-800">
          Cari
        </button>
      </div>
    </div>

    <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">{{ error }}</div>

    <div class="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="border-b bg-slate-50">
            <tr>
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">No</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Kode</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Pelanggan</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Kendaraan</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Mekanik</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Tanggal</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Total</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr v-for="(item, index) in servis" :key="item.id" class="transition hover:bg-slate-50">
              <td class="px-6 py-4 text-slate-500">{{ index + 1 }}</td>
              <td class="px-6 py-4">
                <span class="font-semibold text-slate-800">{{ item.kodeServis }}</span>
              </td>
              <td class="px-6 py-4">
                <p class="font-medium text-slate-800">{{ item.kendaraan?.pelanggan?.nama || "-" }}</p>
                <p class="text-sm text-slate-500">{{ item.kendaraan?.pelanggan?.telepon || "-" }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="font-medium text-slate-800">{{ item.kendaraan?.platNomor || "-" }}</p>
                <p class="text-sm text-slate-500">{{ item.kendaraan?.merk || "" }} {{ item.kendaraan?.tipe || "" }}</p>
              </td>
              <td class="px-6 py-4 text-slate-600">{{ item.mekanik?.nama || "-" }}</td>
              <td class="px-6 py-4 text-slate-600">{{ formatTanggal(item.tanggal) }}</td>
              <td class="px-6 py-4">
                <span :class="{ 'rounded-lg bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-700': String(item.status).toLowerCase() === 'menunggu', 'rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700': String(item.status).toLowerCase() === 'proses', 'rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700': String(item.status).toLowerCase() === 'selesai' }">
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 font-semibold text-slate-700">{{ formatRupiah(item.totalBiaya) }}</td>
              <td class="px-6 py-4 text-right">
                <button @click="openEdit(item)" class="mr-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">Edit</button>
                <button @click="$router.push(`/servis/${item.id}`)" class="mr-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">Detail</button>
                <button @click="hapusServis(item.id)" class="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Hapus</button>
              </td>
            </tr>

            <tr v-if="loading">
              <td colspan="9" class="px-6 py-10 text-center text-slate-500">Memuat data servis...</td>
            </tr>

            <tr v-else-if="servis.length === 0">
              <td colspan="9" class="px-6 py-10 text-center text-slate-400">Belum ada data servis.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
      <div class="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 class="text-xl font-bold text-slate-800">{{ editingId ? "Edit Servis" : "Tambah Servis" }}</h2>
            <p class="text-sm text-slate-500">Isi informasi servis dan penugasan mekanik.</p>
          </div>
          <button @click="closeModal" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Tutup</button>
        </div>

        <div class="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Kode Servis</label>
            <input v-model="form.kodeServis" type="text" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Status</label>
            <select v-model="form.status" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200">
              <option value="Menunggu">Menunggu</option>
              <option value="Proses">Proses</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Kendaraan</label>
            <select v-model="form.kendaraanId" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200">
              <option value="">Pilih kendaraan</option>
              <option v-for="item in kendaraanOptions" :key="item.id" :value="item.id">{{ item.platNomor }} - {{ item.pelanggan?.nama || "-" }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Mekanik</label>
            <select v-model="form.mekanikId" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200">
              <option value="">Pilih mekanik</option>
              <option v-for="item in mekanikOptions" :key="item.id" :value="item.id">{{ item.nama }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Tanggal</label>
            <input v-model="form.tanggal" type="date" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Kilometer</label>
            <input v-model="form.kilometer" type="number" min="0" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200" />
          </div>
          <div class="md:col-span-2">
            <label class="mb-1 block text-sm font-medium text-slate-700">Keluhan</label>
            <textarea v-model="form.keluhan" rows="3" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200"></textarea>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button @click="closeModal" class="rounded-xl border border-slate-300 px-4 py-2.5 font-medium text-slate-600 hover:bg-slate-100">Batal</button>
          <button @click="submitForm" class="rounded-xl bg-slate-900 px-4 py-2.5 font-semibold text-white hover:bg-slate-800">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>