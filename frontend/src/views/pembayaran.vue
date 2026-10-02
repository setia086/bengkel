<script setup>
import { onMounted, ref } from "vue";
import api from "../api/axios";

const pembayaran = ref([]);
const loading = ref(false);
const error = ref("");
const search = ref("");
const showDetail = ref(false);
const selectedPembayaran = ref(null);
const showModal = ref(false);
const editingId = ref(null);
const form = ref({
  servisId: "",
  metode: "Tunai",
  dibayar: "",
});
const servisOptions = ref([]);

const resetForm = () => {
  form.value = {
    servisId: "",
    metode: "Tunai",
    dibayar: "",
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
    servisId: item.servisId || "",
    metode: item.metode || "Tunai",
    dibayar: item.dibayar || "",
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const loadServisOptions = async () => {
  try {
    const response = await api.get("/servis");
    const payload = response.data?.data ?? response.data ?? [];
    const items = Array.isArray(payload) ? payload : Array.isArray(payload.data) ? payload.data : [];
    servisOptions.value = items;
  } catch (err) {
    console.error(err);
  }
};

const loadPembayaran = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await api.get("/pembayaran", {
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

    pembayaran.value = data;
  } catch (err) {
    console.error(err);

    error.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Gagal mengambil data pembayaran";
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  const payload = {
    servisId: Number(form.value.servisId),
    metode: form.value.metode,
    dibayar: Number(form.value.dibayar),
  };

  if (!payload.servisId || !payload.dibayar) {
    alert("Servis dan nominal dibayar wajib diisi");
    return;
  }

  try {
    if (editingId.value) {
      await api.put(`/pembayaran/${editingId.value}`, payload);
    } else {
      await api.post("/pembayaran", payload);
    }

    await loadPembayaran();
    closeModal();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Gagal menyimpan pembayaran");
  }
};

const hapusPembayaran = async (id) => {
  if (!confirm("Yakin ingin menghapus pembayaran ini?")) return;

  try {
    await api.delete(`/pembayaran/${id}`);
    await loadPembayaran();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Gagal menghapus pembayaran");
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

const bukaDetail = (item) => {
  selectedPembayaran.value = item;
  showDetail.value = true;
};

const tutupDetail = () => {
  showDetail.value = false;
  selectedPembayaran.value = null;
};

const getInvoiceHtml = () => {
  const data = selectedPembayaran.value;

  if (!data) return "";

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Kwitansi Pembayaran</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 24px; color: #111827; background: white; }
          .container { border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb; }
          .title { font-size: 22px; font-weight: 700; }
          .meta { font-size: 13px; color: #6b7280; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 18px; }
          .box { border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px; }
          .box h3 { margin: 0 0 8px 0; font-size: 15px; }
          .box p { margin: 4px 0; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 10px 12px; border-top: 1px solid #e5e7eb; font-size: 13px; }
          .total { font-weight: 700; }
          .footer { margin-top: 18px; padding: 12px; border-radius: 12px; background: #ecfdf3; color: #047857; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <div class="title">Kwitansi Pembayaran</div>
              <div class="meta">Bengkel Management System</div>
            </div>
            <div class="meta">
              <div>No. Kwitansi: #${data.id}</div>
              <div>Tanggal: ${formatTanggal(data.tanggalBayar || data.createdAt)}</div>
            </div>
          </div>

          <div class="grid">
            <div class="box">
              <h3>Data Pelanggan</h3>
              <p><strong>Nama:</strong> ${data.servis?.kendaraan?.pelanggan?.nama || "-"}</p>
              <p><strong>Telepon:</strong> ${data.servis?.kendaraan?.pelanggan?.telepon || "-"}</p>
              <p><strong>Kendaraan:</strong> ${data.servis?.kendaraan?.platNomor || "-"}</p>
            </div>
            <div class="box">
              <h3>Informasi Servis</h3>
              <p><strong>Kode Servis:</strong> ${data.servis?.kodeServis || "-"}</p>
              <p><strong>Mekanik:</strong> ${data.servis?.mekanik?.nama || "-"}</p>
              <p><strong>Status:</strong> ${data.status || "-"}</p>
            </div>
          </div>

          <table>
            <tr><td>Total Tagihan</td><td class="total" style="text-align:right">${formatRupiah(data.total)}</td></tr>
            <tr><td>Jumlah Dibayar</td><td class="total" style="text-align:right">${formatRupiah(data.dibayar)}</td></tr>
            <tr><td>Kembalian</td><td class="total" style="text-align:right">${formatRupiah(data.kembalian)}</td></tr>
            <tr><td>Metode Pembayaran</td><td class="total" style="text-align:right">${data.metode || "-"}</td></tr>
          </table>

          <div class="footer">Terima kasih atas kepercayaan Anda menggunakan layanan bengkel kami.</div>
        </div>
      </body>
    </html>
  `;
};

const cetakKwitansi = () => {
  if (typeof window === "undefined") return;

  const printWindow = window.open("", "_blank", "width=900,height=700");

  if (!printWindow) {
    alert("Popup diblokir. Izinkan popup browser untuk mencetak kwitansi.");
    return;
  }

  printWindow.document.write(getInvoiceHtml());
  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
  }, 250);
};

onMounted(() => {
  loadPembayaran();
  loadServisOptions();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Pembayaran</h1>
        <p class="mt-1 text-slate-500">Kelola transaksi pembayaran servis pelanggan.</p>
      </div>

      <button @click="openCreate" class="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800">
        + Pembayaran Baru
      </button>
    </div>

    <div class="rounded-2xl bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-3 md:flex-row">
        <input
          v-model="search"
          @keyup.enter="loadPembayaran"
          type="text"
          placeholder="Cari kode servis atau pelanggan..."
          class="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
        />

        <button @click="loadPembayaran" class="rounded-xl bg-slate-700 px-6 py-3 font-medium text-white hover:bg-slate-800">Cari</button>
      </div>
    </div>

    <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">{{ error }}</div>

    <div class="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="border-b bg-slate-50">
            <tr>
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">No</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Kode Servis</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Pelanggan</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Total</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Dibayar</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Kembalian</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Metode</th>
              <th class="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr v-for="(item, index) in pembayaran" :key="item.id" class="transition hover:bg-slate-50">
              <td class="px-6 py-4 text-slate-500">{{ index + 1 }}</td>
              <td class="px-6 py-4">
                <span class="font-semibold text-slate-800">{{ item.servis?.kodeServis || "-" }}</span>
              </td>
              <td class="px-6 py-4">
                <p class="font-medium text-slate-800">{{ item.servis?.kendaraan?.pelanggan?.nama || "-" }}</p>
                <p class="text-sm text-slate-500">{{ item.servis?.kendaraan?.platNomor || "-" }}</p>
              </td>
              <td class="px-6 py-4 font-semibold text-slate-700">{{ formatRupiah(item.total) }}</td>
              <td class="px-6 py-4 text-slate-600">{{ formatRupiah(item.dibayar) }}</td>
              <td class="px-6 py-4 text-slate-600">{{ formatRupiah(item.kembalian) }}</td>
              <td class="px-6 py-4">
                <span class="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">{{ item.metode }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">{{ item.status }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <button @click="openEdit(item)" class="mr-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">Edit</button>
                <button @click="bukaDetail(item)" class="mr-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">Detail</button>
                <button @click="hapusPembayaran(item.id)" class="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Hapus</button>
              </td>
            </tr>

            <tr v-if="loading">
              <td colspan="9" class="px-6 py-10 text-center text-slate-500">Memuat data pembayaran...</td>
            </tr>

            <tr v-else-if="pembayaran.length === 0">
              <td colspan="9" class="px-6 py-10 text-center text-slate-400">Belum ada data pembayaran.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
      <div class="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 class="text-xl font-bold text-slate-800">{{ editingId ? "Edit Pembayaran" : "Tambah Pembayaran" }}</h2>
            <p class="text-sm text-slate-500">Catat pembayaran untuk servis yang sudah selesai.</p>
          </div>
          <button @click="closeModal" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Tutup</button>
        </div>

        <div class="mt-5 space-y-4">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Servis</label>
            <select v-model="form.servisId" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200">
              <option value="">Pilih servis</option>
              <option v-for="item in servisOptions" :key="item.id" :value="item.id">{{ item.kodeServis }} - {{ item.kendaraan?.platNomor || "-" }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Metode Pembayaran</label>
            <select v-model="form.metode" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200">
              <option value="Tunai">Tunai</option>
              <option value="Transfer">Transfer</option>
              <option value="QRIS">QRIS</option>
              <option value="Debit">Debit</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Nominal Dibayar</label>
            <input v-model="form.dibayar" type="number" min="0" class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200" />
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button @click="closeModal" class="rounded-xl border border-slate-300 px-4 py-2.5 font-medium text-slate-600 hover:bg-slate-100">Batal</button>
          <button @click="submitForm" class="rounded-xl bg-slate-900 px-4 py-2.5 font-semibold text-white hover:bg-slate-800">Simpan</button>
        </div>
      </div>
    </div>

    <div v-if="showDetail && selectedPembayaran" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-8">
      <div class="no-print w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 class="text-xl font-bold text-slate-800">Kwitansi Pembayaran</h2>
            <p class="text-sm text-slate-500">Bengkel Management System</p>
          </div>

          <button @click="tutupDetail" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Tutup</button>
        </div>

        <div id="kwitansi-print" class="space-y-6 p-6 md:p-8">
          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p class="text-sm text-slate-500">No. Kwitansi</p>
                <p class="text-lg font-bold text-slate-800">#{{ selectedPembayaran.id }}</p>
              </div>

              <div class="text-left md:text-right">
                <p class="text-sm text-slate-500">Tanggal Bayar</p>
                <p class="font-semibold text-slate-800">{{ formatTanggal(selectedPembayaran.tanggalBayar || selectedPembayaran.createdAt) }}</p>
              </div>
            </div>
          </div>

          <div class="grid gap-5 md:grid-cols-2">
            <div class="rounded-2xl border border-slate-200 p-5">
              <h3 class="font-semibold text-slate-800">Data Pelanggan</h3>
              <div class="mt-3 space-y-2 text-sm text-slate-600">
                <p><span class="font-medium text-slate-700">Nama:</span> {{ selectedPembayaran.servis?.kendaraan?.pelanggan?.nama || "-" }}</p>
                <p><span class="font-medium text-slate-700">Telepon:</span> {{ selectedPembayaran.servis?.kendaraan?.pelanggan?.telepon || "-" }}</p>
                <p><span class="font-medium text-slate-700">Kendaraan:</span> {{ selectedPembayaran.servis?.kendaraan?.platNomor || "-" }}</p>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 p-5">
              <h3 class="font-semibold text-slate-800">Informasi Servis</h3>
              <div class="mt-3 space-y-2 text-sm text-slate-600">
                <p><span class="font-medium text-slate-700">Kode Servis:</span> {{ selectedPembayaran.servis?.kodeServis || "-" }}</p>
                <p><span class="font-medium text-slate-700">Mekanik:</span> {{ selectedPembayaran.servis?.mekanik?.nama || "-" }}</p>
                <p><span class="font-medium text-slate-700">Status:</span> {{ selectedPembayaran.status || "-" }}</p>
              </div>
            </div>
          </div>

          <div class="overflow-hidden rounded-2xl border border-slate-200">
            <table class="w-full text-left">
              <tbody class="divide-y divide-slate-200">
                <tr>
                  <td class="px-5 py-3 text-slate-600">Total Tagihan</td>
                  <td class="px-5 py-3 text-right font-semibold text-slate-800">{{ formatRupiah(selectedPembayaran.total) }}</td>
                </tr>
                <tr>
                  <td class="px-5 py-3 text-slate-600">Jumlah Dibayar</td>
                  <td class="px-5 py-3 text-right font-semibold text-slate-800">{{ formatRupiah(selectedPembayaran.dibayar) }}</td>
                </tr>
                <tr>
                  <td class="px-5 py-3 text-slate-600">Kembalian</td>
                  <td class="px-5 py-3 text-right font-semibold text-slate-800">{{ formatRupiah(selectedPembayaran.kembalian) }}</td>
                </tr>
                <tr>
                  <td class="px-5 py-3 text-slate-600">Metode Pembayaran</td>
                  <td class="px-5 py-3 text-right font-semibold text-slate-800">{{ selectedPembayaran.metode || "-" }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-700">
            Terima kasih atas kepercayaan Anda menggunakan layanan bengkel kami.
          </div>
        </div>

        <div class="no-print flex flex-col gap-3 border-t border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-end">
          <button @click="cetakKwitansi" class="rounded-xl bg-slate-900 px-4 py-2.5 font-semibold text-white hover:bg-slate-800">Cetak / Simpan PDF</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  body {
    background: white;
  }

  .no-print {
    display: none !important;
  }

  .fixed {
    position: static !important;
    display: block !important;
    background: white !important;
    padding: 0 !important;
  }

  .shadow-2xl {
    box-shadow: none !important;
  }
}
</style>