<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api/axios";

const router = useRouter();

const form = ref({
  name: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const loading = ref(false);
const error = ref("");

const handleRegister = async () => {
  error.value = "";

  if (form.value.password !== form.value.confirmPassword) {
    error.value = "Password dan konfirmasi password tidak sama.";
    return;
  }

  loading.value = true;

  try {
    const response = await api.post("/auth/register", {
      nama: form.value.name,
      telepon: form.value.phone,
      email: form.value.email,
      password: form.value.password,
    });

    if (response.data?.success) {
      router.push("/login");
    } else {
      throw new Error(response.data?.message || "Gagal membuat akun");
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || "Gagal membuat akun. Coba lagi.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white text-2xl font-bold">
            B
          </div>

          <h1 class="mt-5 text-2xl font-bold text-slate-800">
            Daftar Akun
          </h1>

          <p class="text-center text-gray-500 mt-2">
            Buat akun untuk mulai mengelola bengkel Anda
          </p>
        </div>

        <div v-if="error" class="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {{ error }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap</label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Masukkan nama lengkap"
              class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Nomor Telepon</label>
            <input
              v-model="form.phone"
              type="tel"
              required
              minlength="10"
              maxlength="15"
              placeholder="08xxxxxxxxxx"
              class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="contoh@email.com"
              class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input
              v-model="form.password"
              type="password"
              required
              placeholder="Minimal 6 karakter"
              class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Konfirmasi Password</label>
            <input
              v-model="form.confirmPassword"
              type="password"
              required
              placeholder="Ulangi password"
              class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-xl bg-slate-900 py-3.5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ loading ? "Memproses..." : "Daftar" }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-slate-500">
          Sudah punya akun?
          <router-link to="/login" class="font-semibold text-slate-900 hover:underline">
            Masuk di sini
          </router-link>
        </p>
      </div>

      <p class="mt-6 text-center text-sm text-slate-400">
        © 2026 Bengkel Management System
      </p>
    </div>
  </div>
</template>
