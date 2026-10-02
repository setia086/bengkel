<script setup>
import {
  HomeIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  DocumentChartBarIcon,
  ArrowLeftOnRectangleIcon,
  UserGroupIcon,
} from "@heroicons/vue/24/outline";

import { RouterLink, useRouter } from "vue-router";
import { clearAuthToken } from "../../api/axios";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["close"]);
const router = useRouter();

const handleLogout = () => {
  clearAuthToken();
  emit("close");
  router.push("/login");
};

const menus = [
  { name: "Dashboard", icon: HomeIcon, to: "/dashboard" },
  { name: "Pelanggan", icon: UserGroupIcon, to: "/pelanggan" },
  { name: "Kendaraan", icon: TruckIcon, to: "/kendaraan" },
  { name: "Mekanik", icon: WrenchScrewdriverIcon, to: "/mekanik" },
  { name: "Sparepart", icon: CubeIcon, to: "/sparepart" },
  { name: "Servis", icon: ClipboardDocumentListIcon, to: "/servis" },
  { name: "Pembayaran", icon: CreditCardIcon, to: "/pembayaran" },
  { name: "Laporan", icon: DocumentChartBarIcon, to: "/laporan" },
];
</script>

<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-50 flex h-screen w-64 min-w-[16rem] shrink-0 flex-col bg-slate-900 text-white transition-transform duration-300 lg:static lg:translate-x-0',
      props.isOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <div class="flex items-center justify-between border-b border-slate-700 p-6">
      <h1 class="text-2xl font-bold">🔧 Bengkel App</h1>

      <button class="rounded-lg p-2 hover:bg-slate-800 lg:hidden" @click="emit('close')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <nav class="flex-1 p-4">
      <RouterLink
        v-for="menu in menus"
        :key="menu.name"
        :to="menu.to"
        class="mb-2 flex items-center gap-3 rounded-lg p-3 transition hover:bg-slate-700"
        @click="emit('close')"
      >
        <component :is="menu.icon" class="h-6 w-6" />
        {{ menu.name }}
      </RouterLink>
    </nav>

    <div class="border-t border-slate-700 p-4">
      <button
        @click="handleLogout"
        class="mb-2 flex w-full items-center gap-3 rounded-lg bg-red-600 p-3 font-semibold text-white shadow-sm transition hover:bg-red-700"
      >
        <ArrowLeftOnRectangleIcon class="h-6 w-6" />
        Logout
      </button>
    </div>
  </aside>
</template>