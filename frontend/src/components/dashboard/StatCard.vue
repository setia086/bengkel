<script setup>
defineProps({
  title: String,
  value: [String, Number],
  color: {
    type: String,
    default: "bg-blue-600",
  },
});
</script>

<template>
  <div class="bg-white rounded-2xl shadow-md p-6">
    <div class="flex justify-between items-center">
      <div>
        <p class="text-gray-500 text-sm">
          {{ title }}
        </p>

        <h2 class="text-3xl font-bold mt-2">
          {{ value }}
        </h2>
      </div>

      <div
        :class="[color,'w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl']"
      >
        📊
      </div>
    </div>
  </div>
</template>