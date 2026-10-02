<script setup>
import { ref } from "vue";
import UserSidebar from "../components/layout/UserSidebar.vue";
import UserNavbar from "../components/layout/UserNavbar.vue";

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-900">
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 z-40 bg-slate-950/45 lg:hidden"
      @click="closeSidebar"
    />

    <UserSidebar :is-open="isSidebarOpen" @close="closeSidebar" />

    <div class="flex min-h-screen min-w-0 flex-col lg:pl-64">
      <UserNavbar @toggle-sidebar="toggleSidebar" />
      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>