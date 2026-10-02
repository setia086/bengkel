<script setup>
import { onMounted, ref } from "vue";
import api from "../api/axios";

const sparepart = ref([]);
const loading = ref(false);
const error = ref("");
const search = ref("");
const showModal = ref(false);
const editingId = ref(null);
const form = ref({
  kategoriId: "",
  nama: "",
  merk: "",
  stok: "",
  harga: "",
});
const kategoriOptions = ref([]);

const resetForm = () => {
  form.value = {
    kategoriId: "",
    nama: "",
    merk: "",
    stok: "",
    harga: "",
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
    kategoriId: item.kategoriId || "",
    nama: item.nama || "",
    merk: item.merk || "",
    stok: item.stok || 0,
    harga: item.harga || "",
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const loadKategoriOptions = async () => {
  try {
    const response = await api.get("/kategori-sparepart", { params: { limit: 100 } });
    const payload = response.data?.data ?? response.data ?? [];
    const items = Array.isArray(payload) ? payload : Array.isArray(payload.data) ? payload.data : [];
    kategoriOptions.value = items;
  } catch (err) {
    console.error(err);
  }
};

const loadSparepart = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await api.get("/sparepart", {
      params: {
        search: search.value,
      },
    });

    const payload = response?.data?.data ?? response?.data ?? {};
    const items = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.items)
          ? payload.items
          : [];

    sparepart.value = items;
  } catch (err) {
    console.error(err);

    error.value =
      err.response?.data?.message ||
      "Gagal mengambil data sparepart";

    sparepart.value = [];
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  const payload = {
    kategoriId: Number(form.value.kategoriId),
    nama: form.value.nama.trim(),
    merk: form.value.merk?.trim() || "",
    stok: Number(form.value.stok || 0),
    harga: Number(form.value.harga),
  };

  if (!payload.kategoriId || !payload.nama || !payload.harga) {
    alert("Kategori, nama, dan harga wajib diisi");
    return;
  }

  try {
    if (editingId.value) {
      await api.put(`/sparepart/${editingId.value}`, payload);
    } else {
      await api.post("/sparepart", payload);
    }

    await loadSparepart();
    closeModal();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Gagal menyimpan sparepart");
  }
};

const hapusSparepart = async (id) => {
  if (!confirm("Yakin ingin menghapus sparepart ini?")) return;

  try {
    await api.delete(`/sparepart/${id}`);
    await loadSparepart();
  } catch (err) {
    console.error(err);

    alert(err.response?.data?.message || "Gagal menghapus sparepart");
  }
};

const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

onMounted(() => {
  loadSparepart();
  loadKategoriOptions();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Sparepart</h1>
        <p class="mt-1 text-slate-500">Kelola stok dan harga sparepart bengkel.</p>
      </div>

      <button @click="openCreate" class="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800">
        + Tambah Sparepart
      </button>
    </div>

    <div class="rounded-2xl bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-3 md:flex-row">
        <input
          v-model="search"
          @keyup.enter="loadSparepart"
          type="text"
          placeholder="Cari nama atau merk sparepart..."
          class="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
        />

        <button @click="loadSparepart" class="rounded-xl bg-slate-700 px-6 py-3 font-medium text-white hover:bg-slate-800">Cari</button>
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
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Merk</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Kategori</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Stok</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Harga</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr v-for="(item, index) in sparepart" :key="item.id" class="hover:bg-slate-50">
              <td class="px-6 py-4 text-slate-500">{{ index + 1 }}</td>
              <td class="px-6 py-4">
                <p class="font-semibold text-slate-800">{{ item.nama }}</p>
              </td>
              <td class="px-6 py-4 text-slate-600">{{ item.merk || "-" }}</td>
              <td class="px-6 py-4">
                <span class="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600">{{ item.kategori?.nama || "-" }}</span>
              </td>
              <td class="px-6 py-4">
                <span :class="Number(item.stok) <= 5 ? 'rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600' : 'rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-600'">
                  {{ item.stok }}
                </span>
              </td>
              <td class="px-6 py-4 font-medium text-slate-700">{{ formatRupiah(item.harga) }}</td>
              <td class="px-6 py-4 text-right">
                <button @click="openEdit(item)" class="mr-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">Edit</button>
                <button @click="hapusSparepart(item.id)" class="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Hapus</button>
              </td>
            </tr>

            <tr v-if="loading">
              <td colspan="7" class="px-6 py-10 text-center text-slate-500">Memuat data...</td>
            </tr>

            <tr v-else-if="sparepart.length === 0">
              <td colspan="7" class="px-6 py-10 text-center text-slate-400">Belum ada sparepart.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
      <div class="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 class="text-xl font-bold text-slate-800">{{ editingId ? "Edit Sparepart" : "Tambah Sparepart" }}</h2>
            <p class="text-sm text-slate-500">Masukkan data stok dan harga sparepart.</p>
          </div>
          <button @click="closeModal" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Tutup</button>
        </div>

        <div class="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Kategori</label>
            <select v-model="form.kategoriId" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200">
              <option value="">Pilih kategori</option>
              <option v-for="item in kategoriOptions" :key="item.id" :value="item.id">{{ item.nama }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Nama Sparepart</label>
            <input v-model="form.nama" type="text" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Merk</label>
            <input v-model="form.merk" type="text" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Stok</label>
            <input v-model="form.stok" type="number" min="0" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Harga</label>
            <input v-model="form.harga" type="number" min="0" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200" />
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