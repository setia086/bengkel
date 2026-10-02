<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api, { setAuthToken } from "../api/axios";

const router = useRouter();

const email = ref("");
const password = ref("");

const loading = ref(false);
const error = ref("");

const handleLogin = async () => {
  error.value = "";
  loading.value = true;

  try {
    const response = await api.post("/auth/login", {
      email: email.value,
      password: password.value,
    });

    console.log("LOGIN RESPONSE:", response.data);

    const token =
      response.data?.data?.token ||
      response.data?.token ||
      response.data?.accessToken ||
      response.data?.data?.accessToken;

    if (!token) {
      throw new Error("Token tidak ditemukan dari response login");
    }

    setAuthToken(token);

    const role = response.data?.data?.user?.role || response.data?.user?.role;
    router.push(role === "admin" ? "/dashboard" : "/user/dashboard");
  } catch (err) {
    console.error("Login gagal:", err);

    error.value =
      err.response?.data?.message ||
      err.message ||
      "Email atau password salah";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div
            class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white text-2xl font-bold"
          >
            B
          </div>

          <h1 class="mt-5 text-2xl font-bold text-slate-800">
            Bengkel Management
          </h1>

          <p class="text-center text-gray-500 mt-2">
            Sistem Manajemen Bengkel
          </p>
        </div>

        <!-- Error -->
        <div
          v-if="error"
          class="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"
        >
          {{ error }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>

            <input
              v-model="email"
              type="email"
              required
              placeholder="admin@bengkel.com"
              class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>

            <input
              v-model="password"
              type="password"
              required
              placeholder="Masukkan password"
              class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-xl bg-slate-900 py-3.5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ loading ? "Memproses..." : "Login" }}
          </button>
        </form>
      </div>

      <p class="mt-6 text-center text-sm text-slate-400">
        © 2026 Bengkel Management System
      </p>
    </div>
  </div>
</template>