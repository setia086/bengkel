<script setup>
import { onMounted, ref } from "vue";
import api from "../api/axios";

const mekanik = ref([]);
const loading = ref(false);
const error = ref("");
const search = ref("");
const showModal = ref(false);
const editingId = ref(null);
const form = ref({
  nama: "",
  telepon: "",
  spesialis: "",
});

const resetForm = () => {
  form.value = {
    nama: "",
    telepon: "",
    spesialis: "",
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
    nama: item.nama || "",
    telepon: item.telepon || "",
    spesialis: item.spesialis || "",
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const loadMekanik = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await api.get("/mekanik", {
      params: {
        search: search.value,
      },
    });

    mekanik.value =
      response.data.data?.data ||
      response.data.data ||
      [];
  } catch (err) {
    console.error(err);

    error.value =
      err.response?.data?.message ||
      "Gagal mengambil data mekanik";
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  const payload = {
    nama: form.value.nama.trim(),
    telepon: form.value.telepon?.trim() || "",
    spesialis: form.value.spesialis?.trim() || "",
  };

  if (!payload.nama) {
    alert("Nama mekanik wajib diisi");
    return;
  }

  try {
    if (editingId.value) {
      await api.put(`/mekanik/${editingId.value}`, payload);
    } else {
      await api.post("/mekanik", payload);
    }

    await loadMekanik();
    closeModal();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Gagal menyimpan mekanik");
  }
};

const hapusMekanik = async (id) => {
  if (!confirm("Yakin ingin menghapus mekanik ini?")) return;

  try {
    await api.delete(`/mekanik/${id}`);
    await loadMekanik();
  } catch (err) {
    console.error(err);

    alert(err.response?.data?.message || "Gagal menghapus mekanik");
  }
};

onMounted(() => {
  loadMekanik();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Mekanik</h1>
        <p class="mt-1 text-slate-500">Kelola data mekanik dan spesialisasinya.</p>
      </div>

      <button @click="openCreate" class="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800">
        + Tambah Mekanik
      </button>
    </div>

    <div class="rounded-2xl bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-3 md:flex-row">
        <input
          v-model="search"
          @keyup.enter="loadMekanik"
          type="text"
          placeholder="Cari nama, telepon, atau spesialisasi..."
          class="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
        />

        <button @click="loadMekanik" class="rounded-xl bg-slate-700 px-6 py-3 font-medium text-white hover:bg-slate-800">
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
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Nama</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Telepon</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Spesialisasi</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr v-for="(item, index) in mekanik" :key="item.id" class="transition hover:bg-slate-50">
              <td class="px-6 py-4 text-slate-500">{{ index + 1 }}</td>
              <td class="px-6 py-4">
                <p class="font-semibold text-slate-800">{{ item.nama }}</p>
              </td>
              <td class="px-6 py-4 text-slate-600">{{ item.telepon || "-" }}</td>
              <td class="px-6 py-4">
                <span v-if="item.spesialis" class="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600">{{ item.spesialis }}</span>
                <span v-else class="text-slate-400">-</span>
              </td>
              <td class="px-6 py-4 text-right">
                <button @click="openEdit(item)" class="mr-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">Edit</button>
                <button @click="hapusMekanik(item.id)" class="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Hapus</button>
              </td>
            </tr>

            <tr v-if="loading">
              <td colspan="5" class="px-6 py-10 text-center text-slate-500">Memuat data...</td>
            </tr>

            <tr v-else-if="mekanik.length === 0">
              <td colspan="5" class="px-6 py-10 text-center text-slate-400">Belum ada data mekanik.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
      <div class="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 class="text-xl font-bold text-slate-800">{{ editingId ? "Edit Mekanik" : "Tambah Mekanik" }}</h2>
            <p class="text-sm text-slate-500">Isi detail mekanik untuk bengkel.</p>
          </div>
          <button @click="closeModal" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Tutup</button>
        </div>

        <div class="mt-5 space-y-4">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Nama</label>
            <input v-model="form.nama" type="text" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Telepon</label>
            <input v-model="form.telepon" type="text" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Spesialisasi</label>
            <input v-model="form.spesialis" type="text" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200" />
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