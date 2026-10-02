<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import api from "../api/axios";
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  CreditCardIcon,
  UserCircleIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps({ section: { type: String, required: true } });
const router = useRouter();
const loading = ref(true);
const submitting = ref(false);
const error = ref("");
const success = ref("");
const data = ref({ user: {}, kendaraan: [], servis: [], pembayaran: [] });
const mechanics = ref([]);
const booking = ref({ kendaraanId: "", mekanikId: "", tanggal: "", keluhan: "" });
const payment = ref({ servisId: "", metode: "QRIS - BCA", dibayar: 0 });
const receipt = ref(null);

const pages = {
  vehicles: { title: "Kendaraan Saya", description: "Daftar kendaraan yang terhubung dengan akun Anda.", icon: TruckIcon },
  booking: { title: "Booking Servis", description: "Pilih kendaraan dan jadwalkan kunjungan servis.", icon: CalendarDaysIcon },
  services: { title: "Servis Saya", description: "Pantau servis yang sedang berjalan.", icon: WrenchScrewdriverIcon },
  payments: { title: "Pembayaran", description: "Lihat pembayaran servis Anda.", icon: CreditCardIcon },
  history: { title: "Riwayat Servis", description: "Arsip servis kendaraan Anda.", icon: CheckCircleIcon },
  profile: { title: "Profil", description: "Informasi akun pelanggan Anda.", icon: UserCircleIcon },
};
const page = computed(() => pages[props.section] || pages.vehicles);
const services = computed(() => props.section === "history" ? data.value.servis.filter((item) => String(item.status).toLowerCase() === "selesai") : data.value.servis.filter((item) => String(item.status).toLowerCase() !== "selesai"));
const completedUnpaid = computed(() => data.value.servis.filter((item) => String(item.status).toLowerCase() === "selesai" && !data.value.pembayaran.some((paymentItem) => paymentItem.servisId === item.id)));
const formatCurrency = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));
const formatDate = (value) => value ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(value)) : "-";
const unwrap = (response) => response?.data?.data ?? response?.data ?? {};

const loadData = async () => {
  loading.value = true;
  error.value = "";
  try {
    const response = await api.get("/dashboard/user");
    data.value = unwrap(response);
    if (props.section === "booking") {
      mechanics.value = unwrap(await api.get("/mekanik"));
      if (!Array.isArray(mechanics.value)) mechanics.value = mechanics.value.data || [];
    }
  } catch (requestError) {
    error.value = requestError.response?.data?.message || "Data belum dapat dimuat.";
  } finally {
    loading.value = false;
  }
};

const submitBooking = async () => {
  error.value = "";
  success.value = "";
  if (!booking.value.kendaraanId || !booking.value.mekanikId) {
    error.value = "Kendaraan dan mekanik wajib dipilih.";
    return;
  }
  submitting.value = true;
  try {
    await api.post("/servis", {
      kodeServis: `BOOK-${Date.now()}`,
      kendaraanId: Number(booking.value.kendaraanId),
      mekanikId: Number(booking.value.mekanikId),
      tanggal: booking.value.tanggal || undefined,
      keluhan: booking.value.keluhan || undefined,
      status: "Menunggu",
      totalBiaya: 0,
    });
    success.value = "Booking servis berhasil dibuat.";
    booking.value = { kendaraanId: "", mekanikId: "", tanggal: "", keluhan: "" };
    await loadData();
  } catch (requestError) {
    error.value = requestError.response?.data?.message || requestError.response?.data?.error || "Booking servis gagal dibuat.";
  } finally {
    submitting.value = false;
  }
};

const submitPayment = async () => {
  error.value = "";
  success.value = "";
  const selected = completedUnpaid.value.find((item) => item.id === Number(payment.value.servisId));
  if (!selected) {
    error.value = "Pilih servis selesai yang belum dibayar.";
    return;
  }
  if (Number(selected.totalBiaya) <= 0) {
    error.value = "Pembayaran belum tersedia karena total biaya servis belum ditetapkan admin.";
    return;
  }
  submitting.value = true;
  try {
    const response = await api.post("/pembayaran/user", {
      servisId: selected.id,
      metode: payment.value.metode,
      dibayar: Number(payment.value.dibayar || selected.totalBiaya),
    });
    receipt.value = response.data?.data;
    success.value = "Pembayaran berhasil. Struk tersedia di bawah.";
    await loadData();
  } catch (requestError) {
    error.value = requestError.response?.data?.message || "Pembayaran gagal diproses.";
  } finally {
    submitting.value = false;
  }
};

const printReceipt = () => window.print();

onMounted(loadData);
watch(() => props.section, loadData);
watch(() => payment.value.servisId, (serviceId) => {
  const selected = completedUnpaid.value.find((item) => item.id === Number(serviceId));
  payment.value.dibayar = selected ? Number(selected.totalBiaya) : 0;
});
</script>

<template>
  <div class="mx-auto max-w-6xl space-y-6">
    <header class="flex items-start gap-4">
      <div class="rounded-2xl bg-cyan-50 p-3 text-cyan-700"><component :is="page.icon" class="h-7 w-7" /></div>
      <div><h1 class="text-3xl font-bold text-slate-900">{{ page.title }}</h1><p class="mt-1 text-slate-500">{{ page.description }}</p></div>
    </header>

    <div v-if="loading" class="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">Memuat data...</div>
    <div v-else-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{{ error }}</div>
    <div v-if="success" class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">{{ success }}</div>

    <template v-if="!loading">
      <section v-if="section === 'booking'" class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
        <form class="grid gap-5 md:grid-cols-2" @submit.prevent="submitBooking">
          <label class="text-sm font-semibold text-slate-700">Kendaraan<select v-model="booking.kendaraanId" class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-cyan-500" required><option value="">Pilih kendaraan</option><option v-for="vehicle in data.kendaraan" :key="vehicle.id" :value="vehicle.id">{{ vehicle.platNomor }} · {{ vehicle.merk }} {{ vehicle.tipe }}</option></select></label>
          <label class="text-sm font-semibold text-slate-700">Mekanik<select v-model="booking.mekanikId" class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-cyan-500" required><option value="">Pilih mekanik</option><option v-for="mechanic in mechanics" :key="mechanic.id" :value="mechanic.id">{{ mechanic.nama }}{{ mechanic.spesialis ? ` · ${mechanic.spesialis}` : '' }}</option></select></label>
          <label class="text-sm font-semibold text-slate-700">Tanggal kunjungan<input v-model="booking.tanggal" type="date" class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-cyan-500" /></label>
          <label class="text-sm font-semibold text-slate-700">Keluhan<textarea v-model="booking.keluhan" rows="1" placeholder="Ceritakan kebutuhan servis" class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-cyan-500" /></label>
          <button class="rounded-xl bg-cyan-600 px-5 py-3 font-bold text-white transition hover:bg-cyan-700 disabled:opacity-50 md:col-span-2" :disabled="submitting || !data.kendaraan.length">{{ submitting ? "Mengirim..." : "Buat Booking Servis" }}</button>
        </form>
        <p v-if="!data.kendaraan.length" class="mt-4 text-sm text-amber-700">Tambahkan kendaraan melalui admin terlebih dahulu sebelum membuat booking.</p>
      </section>

      <section v-else-if="section === 'vehicles'" class="grid gap-4 md:grid-cols-2"><div v-for="vehicle in data.kendaraan" :key="vehicle.id" class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70"><div class="flex items-center gap-4"><div class="rounded-xl bg-cyan-50 p-3 text-cyan-700"><TruckIcon class="h-6 w-6" /></div><div><h2 class="font-bold text-slate-900">{{ vehicle.merk }} {{ vehicle.tipe }}</h2><p class="mt-1 text-sm text-slate-500">{{ vehicle.platNomor }}{{ vehicle.tahun ? ` · ${vehicle.tahun}` : '' }}</p></div></div></div><p v-if="!data.kendaraan.length" class="rounded-2xl bg-white p-10 text-center text-slate-400 md:col-span-2">Belum ada kendaraan terdaftar.</p></section>

      <section v-else-if="section === 'profile'" class="max-w-2xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70"><div class="grid gap-5 sm:grid-cols-2"><div><p class="text-sm text-slate-500">Nama</p><p class="mt-1 font-semibold text-slate-900">{{ data.user?.nama || '-' }}</p></div><div><p class="text-sm text-slate-500">Email</p><p class="mt-1 font-semibold text-slate-900">{{ data.user?.email || '-' }}</p></div><div><p class="text-sm text-slate-500">Status akun</p><p class="mt-1 font-semibold capitalize text-cyan-700">{{ data.user?.role || 'user' }}</p></div></div></section>

      <section v-else-if="section === 'payments'" class="space-y-6">
        <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
          <h2 class="font-bold text-slate-900">Bayar servis selesai</h2>
          <p class="mt-1 text-sm text-slate-500">Pembayaran hanya dapat dilakukan setelah admin mengubah status servis menjadi selesai.</p>
          <form class="mt-5 grid gap-4 md:grid-cols-3" @submit.prevent="submitPayment">
            <select v-model="payment.servisId" class="rounded-xl border border-slate-300 px-4 py-3" required><option value="">Pilih servis</option><option v-for="service in completedUnpaid" :key="service.id" :value="service.id">{{ service.kodeServis }} · {{ formatCurrency(service.totalBiaya) }}</option></select>
            <select v-model="payment.metode" class="rounded-xl border border-slate-300 px-4 py-3"><option>QRIS - BCA</option><option>QRIS - BNI</option><option>QRIS - BRI</option><option>QRIS - Mandiri</option><option>QRIS - CIMB Niaga</option><option>QRIS - Permata</option><option>Transfer Bank</option></select>
            <input v-model.number="payment.dibayar" type="number" min="1" step="1000" :placeholder="completedUnpaid.length ? `Minimal ${formatCurrency(completedUnpaid[0].totalBiaya)}` : 'Nominal pembayaran'" class="rounded-xl border border-slate-300 px-4 py-3" required />
            <button class="rounded-xl bg-cyan-600 px-5 py-3 font-bold text-white hover:bg-cyan-700 disabled:opacity-50" :disabled="submitting || !completedUnpaid.length">{{ submitting ? "Memproses..." : "Bayar Sekarang" }}</button>
          </form>
          <p v-if="!completedUnpaid.length" class="mt-4 text-sm text-slate-400">Belum ada servis selesai yang menunggu pembayaran.</p>
          <p v-else-if="completedUnpaid.some((service) => Number(service.totalBiaya) <= 0)" class="mt-4 text-sm text-amber-700">Servis dengan total Rp0 belum bisa dibayar. Tunggu admin menetapkan total biaya terlebih dahulu.</p>
        </div>
        <div class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70"><div v-for="paymentItem in data.pembayaran" :key="paymentItem.id" class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 last:border-0"><div><p class="font-semibold text-slate-900">{{ paymentItem.servis?.kodeServis || `Pembayaran #${paymentItem.id}` }}</p><p class="mt-1 text-sm text-slate-500">{{ paymentItem.metode }} · {{ formatDate(paymentItem.tanggalBayar) }}</p></div><div class="text-right"><p class="font-bold text-slate-900">{{ formatCurrency(paymentItem.dibayar) }}</p><span class="text-xs font-semibold text-emerald-600">{{ paymentItem.status }}</span></div></div><p v-if="!data.pembayaran.length" class="p-10 text-center text-slate-400">Belum ada pembayaran.</p></div>
        <div v-if="receipt" class="rounded-2xl border border-emerald-200 bg-emerald-50 p-6" id="payment-receipt"><div class="flex items-center justify-between"><div><h2 class="font-bold text-emerald-900">Bukti Pembayaran</h2><p class="mt-1 text-sm text-emerald-700">{{ receipt.servis?.kodeServis }} · {{ formatDate(receipt.tanggalBayar) }}</p></div><button class="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white" @click="printReceipt">Cetak / Simpan PDF</button></div><div class="mt-4 grid gap-3 text-sm text-emerald-900 sm:grid-cols-3"><p>Metode<br><strong>{{ receipt.metode }}</strong></p><p>Total<br><strong>{{ formatCurrency(receipt.total) }}</strong></p><p>Status<br><strong>{{ receipt.status }}</strong></p></div></div>
      </section>

      <section v-else class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70"><div v-for="service in services" :key="service.id" class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 last:border-0"><div><p class="font-semibold text-slate-900">{{ service.kodeServis }}</p><p class="mt-1 text-sm text-slate-500">{{ service.kendaraan?.platNomor || '-' }} · {{ formatDate(service.tanggal) }}</p></div><div class="text-right"><p class="font-bold text-slate-900">{{ formatCurrency(service.totalBiaya) }}</p><span class="text-xs font-semibold text-cyan-700">{{ service.status }}</span></div></div><p v-if="!services.length" class="p-10 text-center text-slate-400">Belum ada data servis.</p></section>
    </template>
  </div>
</template>