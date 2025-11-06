<template>
  <div class="w-full max-w-md select-none">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-1">
        <button
          type="button"
          class="px-2 py-1 rounded hover:bg-slate-100"
          @click="goPrevYear"
          aria-label="Previous year"
        >
          «
        </button>
        <button
          type="button"
          class="px-2 py-1 rounded hover:bg-slate-100"
          @click="goPrevMonth"
          aria-label="Previous month"
        >
          ‹
        </button>
      </div>

      <div class="text-lg font-semibold text-slate-800" aria-live="polite">
        {{ monthName }} {{ currentYear }}
      </div>

      <div class="flex items-center gap-1">
        <button
          type="button"
          class="px-2 py-1 rounded hover:bg-slate-100"
          @click="goNextMonth"
          aria-label="Next month"
        >
          ›
        </button>
        <button
          type="button"
          class="px-2 py-1 rounded hover:bg-slate-100"
          @click="goNextYear"
          aria-label="Next year"
        >
          »
        </button>
      </div>
    </div>

    <div class="grid grid-cols-7 text-center text-slate-500 text-sm mb-1">
      <div v-for="(wd, i) in weekdaysHeader" :key="i" class="py-1">
        {{ wd }}
      </div>
    </div>

    <div class="border border-slate-200 rounded-lg p-2 bg-white text-slate-700">
      <div class="grid grid-cols-7 gap-1">
        <button
          v-for="(d, idx) in monthDays"
          :key="idx"
          type="button"
          class="h-8 w-8 md:h-9 md:w-9 rounded-md text-sm flex items-center justify-center hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          :aria-current="d.isToday ? 'date' : undefined"
          :aria-pressed="isSelected(d.date) ? 'true' : 'false'"
          :title="d.iso"
          :class="[
            !d.inCurrentMonth ? 'text-slate-300' : 'text-slate-800',
            isSelected(d.date) ? 'ring-2 ring-indigo-500 bg-indigo-50' : '',
            d.isToday && !isSelected(d.date) ? 'border border-indigo-300' : '',
          ]"
          @click="onDayClick(d)"
        >
          {{ d.date.getDate() }}
        </button>
      </div>
    </div>

    <div class="mt-3">
      <button
        type="button"
        class="px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700"
        @click="goToday"
      >
        {{ t("labelToday") }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch, onMounted } from "vue";
import { LOCALES } from "../locales";
import {
  parseISO,
  toISO,
  addMonths,
  addYears,
  getMonthMatrix,
} from "../utils/date";

onMounted(() => {
  if (!props.modelValue && props.autoSelectOnMonth && state.selected) {
    const iso = toISO(state.selected);
    emit("update:modelValue", iso);
    emit("select", iso);
  }
});

const props = defineProps({
  locale: { type: String, default: "ru" },
  modelValue: { type: String, default: null },
  autoSelectOnMonth: { type: Boolean, default: true },
});
const emit = defineEmits(["update:modelValue", "select"]);

const state = reactive({
  current: new Date(),
  selected: null,
});

const initSelected = computed(() => parseISO(props.modelValue) ?? new Date());
state.current = new Date(
  initSelected.value.getFullYear(),
  initSelected.value.getMonth(),
  1
);
state.selected = parseISO(props.modelValue) ?? new Date();

const t = (key) => {
  const dict = LOCALES[props.locale] ?? LOCALES.ru;
  return dict[key];
};
const monthName = computed(() => {
  const dict = LOCALES[props.locale] ?? LOCALES.ru;
  return dict.months[state.current.getMonth()];
});
const currentYear = computed(() => state.current.getFullYear());
const weekdaysHeader = computed(() => {
  const dict = LOCALES[props.locale] ?? LOCALES.ru;
  const { weekdays, weekStartsOn } = dict;
  return [...weekdays.slice(weekStartsOn), ...weekdays.slice(0, weekStartsOn)];
});

const monthDays = computed(() => {
  const dict = LOCALES[props.locale] ?? LOCALES.ru;
  return getMonthMatrix(state.current, dict.weekStartsOn);
});

function goPrevMonth() {
  state.current = addMonths(state.current, -1);
}
function goNextMonth() {
  state.current = addMonths(state.current, 1);
}
function goPrevYear() {
  state.current = addYears(state.current, -1);
}
function goNextYear() {
  state.current = addYears(state.current, 1);
}
function goToday() {
  const today = new Date();
  state.current = new Date(today.getFullYear(), today.getMonth(), 1);
  selectDate(today);
}

function onDayClick(d) {
  if (!d.inCurrentMonth) {
    state.current = new Date(d.date.getFullYear(), d.date.getMonth(), 1);
  }
  selectDate(d.date);
}

function selectDate(date) {
  state.selected = new Date(date);
  const iso = toISO(state.selected);
  emit("update:modelValue", iso);
  emit("select", iso);
}

function isSelected(date) {
  if (!state.selected) return false;
  return (
    state.selected.getFullYear() === date.getFullYear() &&
    state.selected.getMonth() === date.getMonth() &&
    state.selected.getDate() === date.getDate()
  );
}

watch(
  () => props.modelValue,
  (nv) => {
    const parsed = parseISO(nv);
    if (parsed) {
      state.selected = parsed;
      state.current = new Date(parsed.getFullYear(), parsed.getMonth(), 1);
    }
  }
);
</script>
