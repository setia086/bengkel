<script setup>
import { ref } from "vue";
import Sidebar from "../components/layout/Sidebar.vue";
import Navbar from "../components/layout/Navbar.vue";

const isSidebarOpen = ref(true);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-slate-100">
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
      @click="closeSidebar"
    />

    <Sidebar
      :is-open="isSidebarOpen"
      @close="closeSidebar"
    />

    <div class="flex min-w-0 flex-1 flex-col">
      <Navbar @toggle-sidebar="toggleSidebar" />

      <main class="flex-1 overflow-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>