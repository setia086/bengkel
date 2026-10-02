<script setup>
import { Bars3Icon, BellIcon } from "@heroicons/vue/24/outline";
import { computed } from "vue";

const emit = defineEmits(["toggle-sidebar"]);

const user = computed(() => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    return token ? JSON.parse(atob(token.split(".")[1])) : {};
  } catch {
    return {};
  }
});

const initials = computed(() => (user.value.nama || user.value.email || "U").slice(0, 1).toUpperCase());
</script>

<template>
  <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur sm:px-6">
    <div class="flex items-center gap-3">
      <button class="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Buka menu" @click="emit('toggle-sidebar')">
        <Bars3Icon class="h-6 w-6" />
      </button>
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">Portal pelanggan</p>
        <h2 class="hidden text-sm font-bold text-slate-800 sm:block">Panel Kendaraan & Servis</h2>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <button class="rounded-xl p-2 text-slate-400 hover:bg-slate-100" aria-label="Notifikasi">
        <BellIcon class="h-5 w-5" />
      </button>
      <div class="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-600 text-sm font-bold text-white">{{ initials }}</div>
      <div class="hidden sm:block">
        <p class="text-sm font-semibold text-slate-800">{{ user.nama || "Pelanggan" }}</p>
        <p class="text-xs text-slate-500">Akun pelanggan</p>
      </div>
    </div>
  </header>
</template>