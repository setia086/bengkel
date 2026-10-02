<script setup>
import {
  ArrowLeftOnRectangleIcon,
  CalendarDaysIcon,
  TruckIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { useRouter, RouterLink } from "vue-router";
import { clearAuthToken } from "../../api/axios";

defineProps({
  isOpen: { type: Boolean, default: false },
});

const emit = defineEmits(["close"]);
const router = useRouter();

const menus = [
  { name: "Dashboard", icon: ChartBarIcon, to: "/user/dashboard" },
  { name: "Kendaraan Saya", icon: TruckIcon, to: "/user/vehicles" },
  { name: "Booking Servis", icon: CalendarDaysIcon, to: "/user/booking" },
  { name: "Servis Saya", icon: ClipboardDocumentListIcon, to: "/user/services" },
  { name: "Pembayaran", icon: CreditCardIcon, to: "/user/payments" },
  { name: "Riwayat Servis", icon: ClipboardDocumentListIcon, to: "/user/history" },
  { name: "Profil", icon: UserCircleIcon, to: "/user/profile" },
];

const handleLogout = () => {
  clearAuthToken();
  emit("close");
  router.push("/login");
};
</script>

<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-950 text-white shadow-xl transition-transform duration-300 lg:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <div class="border-b border-white/10 px-6 py-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Bengkel App</p>
          <h1 class="mt-2 text-xl font-bold">Ruang Pelanggan</h1>
        </div>
        <button class="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden" aria-label="Tutup menu" @click="emit('close')">
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
    </div>

    <nav class="flex-1 space-y-1 overflow-y-auto p-4">
      <RouterLink
        v-for="menu in menus"
        :key="menu.name"
        :to="menu.to"
        class="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
        active-class="bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/20"
        @click="emit('close')"
      >
        <component :is="menu.icon" class="h-5 w-5" />
        {{ menu.name }}
      </RouterLink>
    </nav>

    <div class="border-t border-white/10 p-4">
      <button class="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-400/10" @click="handleLogout">
        <ArrowLeftOnRectangleIcon class="h-5 w-5" />
        Logout
      </button>
    </div>
  </aside>
</template>