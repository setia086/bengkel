<script setup>
import { onMounted, ref } from "vue";
import api from "../api/axios";

const kendaraan = ref([]);
const loading = ref(false);
const error = ref("");
const search = ref("");
const showModal = ref(false);
const editingId = ref(null);
const form = ref({
  pelangganId: "",
  platNomor: "",
  merk: "",
  tipe: "",
  tahun: "",
  warna: "",
  nomorRangka: "",
  nomorMesin: "",
});
const pelangganOptions = ref([]);

const resetForm = () => {
  form.value = {
    pelangganId: "",
    platNomor: "",
    merk: "",
    tipe: "",
    tahun: "",
    warna: "",
    nomorRangka: "",
    nomorMesin: "",
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
    pelangganId: item.pelangganId || "",
    platNomor: item.platNomor || "",
    merk: item.merk || "",
    tipe: item.tipe || "",
    tahun: item.tahun || "",
    warna: item.warna || "",
    nomorRangka: item.nomorRangka || "",
    nomorMesin: item.nomorMesin || "",
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const loadPelangganOptions = async () => {
  try {
    const response = await api.get("/pelanggan", { params: { limit: 100 } });
    const payload = response.data?.data ?? response.data ?? [];
    const items = Array.isArray(payload) ? payload : Array.isArray(payload.data) ? payload.data : [];
    pelangganOptions.value = items;
  } catch (err) {
    console.error(err);
  }
};

const loadKendaraan = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await api.get("/kendaraan", {
      params: {
        search: search.value,
      },
    });

    kendaraan.value =
      response.data.data?.data ||
      response.data.data ||
      [];
  } catch (err) {
    console.error(err);

    error.value =
      err.response?.data?.message ||
      "Gagal mengambil data kendaraan";
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  const payload = {
    pelangganId: Number(form.value.pelangganId),
    platNomor: form.value.platNomor.trim(),
    merk: form.value.merk.trim(),
    tipe: form.value.tipe.trim(),
    tahun: form.value.tahun ? Number(form.value.tahun) : null,
    warna: form.value.warna?.trim() || undefined,
    nomorRangka: form.value.nomorRangka?.trim() || undefined,
    nomorMesin: form.value.nomorMesin?.trim() || undefined,
  };

  if (!payload.pelangganId || !payload.platNomor || !payload.merk || !payload.tipe) {
    alert("Pemilik, plat nomor, merk, dan tipe wajib diisi");
    return;
  }

  try {
    if (editingId.value) {
      await api.put(`/kendaraan/${editingId.value}`, payload);
    } else {
      await api.post("/kendaraan", payload);
    }

    await loadKendaraan();
    closeModal();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Gagal menyimpan kendaraan");
  }
};

const hapusKendaraan = async (id) => {
  if (!confirm("Yakin ingin menghapus kendaraan ini?")) return;

  try {
    await api.delete(`/kendaraan/${id}`);
    await loadKendaraan();
  } catch (err) {
    console.error(err);

    alert(err.response?.data?.message || "Gagal menghapus kendaraan");
  }
};

onMounted(() => {
  loadKendaraan();
  loadPelangganOptions();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Kendaraan</h1>
        <p class="mt-1 text-slate-500">Kelola data kendaraan pelanggan.</p>
      </div>

      <button @click="openCreate" class="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800">
        + Tambah Kendaraan
      </button>
    </div>

    <div class="rounded-2xl bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-3 md:flex-row">
        <input
          v-model="search"
          @keyup.enter="loadKendaraan"
          type="text"
          placeholder="Cari plat nomor, merk, atau nama pelanggan..."
          class="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
        />

        <button @click="loadKendaraan" class="rounded-xl bg-slate-700 px-6 py-3 font-medium text-white hover:bg-slate-800">
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
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Plat Nomor</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Pemilik</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Kendaraan</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Tahun</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr v-for="(item, index) in kendaraan" :key="item.id" class="transition hover:bg-slate-50">
              <td class="px-6 py-4 text-slate-500">{{ index + 1 }}</td>
              <td class="px-6 py-4">
                <span class="rounded-lg bg-slate-100 px-3 py-2 font-semibold text-slate-700">{{ item.platNomor }}</span>
              </td>
              <td class="px-6 py-4">
                <p class="font-semibold text-slate-800">{{ item.pelanggan?.nama || "-" }}</p>
                <p class="text-sm text-slate-500">{{ item.pelanggan?.telepon || "-" }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="font-medium text-slate-800">{{ item.merk }} {{ item.tipe }}</p>
                <p class="text-sm text-slate-500">{{ item.warna || "-" }}</p>
              </td>
              <td class="px-6 py-4 text-slate-600">{{ item.tahun || "-" }}</td>
              <td class="px-6 py-4 text-right">
                <button @click="openEdit(item)" class="mr-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">Edit</button>
                <button @click="hapusKendaraan(item.id)" class="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Hapus</button>
              </td>
            </tr>

            <tr v-if="loading">
              <td colspan="6" class="px-6 py-10 text-center text-slate-500">Memuat data...</td>
            </tr>

            <tr v-else-if="kendaraan.length === 0">
              <td colspan="6" class="px-6 py-10 text-center text-slate-400">Belum ada data kendaraan.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
      <div class="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 class="text-xl font-bold text-slate-800">{{ editingId ? "Edit Kendaraan" : "Tambah Kendaraan" }}</h2>
            <p class="text-sm text-slate-500">Isi data kendaraan dan pilih pemilik.</p>
          </div>
          <button @click="closeModal" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Tutup</button>
        </div>

        <div class="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Pemilik</label>
            <select v-model="form.pelangganId" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200">
              <option value="">Pilih pelanggan</option>
              <option v-for="item in pelangganOptions" :key="item.id" :value="item.id">{{ item.nama }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Plat Nomor</label>
            <input v-model="form.platNomor" type="text" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Merk</label>
            <input v-model="form.merk" type="text" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Tipe</label>
            <input v-model="form.tipe" type="text" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Tahun</label>
            <input v-model="form.tahun" type="number" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Warna</label>
            <input v-model="form.warna" type="text" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Nomor Rangka</label>
            <input v-model="form.nomorRangka" type="text" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Nomor Mesin</label>
            <input v-model="form.nomorMesin" type="text" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200" />
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