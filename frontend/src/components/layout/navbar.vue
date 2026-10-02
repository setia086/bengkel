<template>
  <header class="flex h-16 items-center justify-between bg-white px-6 shadow">
    <div class="flex items-center gap-3">
      <button
        class="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        @click="emit('toggle-sidebar')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <h1 class="text-xl font-bold text-gray-800">
        Sistem Manajemen Bengkel
      </h1>
    </div>

    <div class="flex items-center gap-3">
      <button
        @click="handleLogout"
        class="flex rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
      >
        Logout
      </button>

      <div
        class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white"
      >
        A
      </div>

      <div>
        <p class="font-semibold">Administrator</p>
        <small class="text-gray-500">Admin</small>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from "vue-router";
import { clearAuthToken } from "../../api/axios";

const emit = defineEmits(["toggle-sidebar"]);
const router = useRouter();

const handleLogout = () => {
  clearAuthToken();
  router.push("/login");
};
</script>