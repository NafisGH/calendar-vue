<script setup>
import { ref } from "vue";
import Calendar from "./components/Calendar.vue";

const locale = ref("ru");
const value = ref(null); // Стартовая дата

function onSelect(iso) {
  console.log("selected:", iso);
}
</script>

<template>
  <div class="min-h-screen p-6 bg-slate-50">
    <div class="mx-auto max-w-3xl grid gap-6 md:grid-cols-2">
      <div class="space-y-4">
        <h1 class="text-2xl font-bold text-slate-800">Демо: Календарь</h1>

        <div class="flex items-center gap-3">
          <label class="text-sm text-slate-600">Язык:</label>
          <select v-model="locale" class="px-2 py-1 rounded border bg-white">
            <option value="ru">ru</option>
            <option value="en">en</option>
          </select>
        </div>

        <div class="flex items-center gap-3">
          <label class="text-sm text-slate-600">Текущая выбранная дата:</label>
          <code class="text-indigo-700">{{ value || "—" }}</code>
        </div>

        <Calendar v-model="value" :locale="locale" @select="onSelect" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
