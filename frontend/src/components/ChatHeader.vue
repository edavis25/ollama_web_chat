<template>
  <header class="
    px-4 py-2 flex items-center justify-between
    bg-zinc-900 text-zinc-900 border-b border-zinc-800
    dark:text-zinc-100 dark:bg-white dark:border-zinc-200"
  >
    <h1 class="text-xl font-bold">Ollama Web Chat</h1>
    <div class="flex items-center gap-2">
      <select
        id="model-select"
        class="
          rounded px-2 py-1
          text-zinc-900 bg-zinc-900 border border-zinc-800
          dark:border-zinc-200 dark:text-zinc-100
        "
        v-model="model"
        @change="$emit('model', model)"
      >
        <option
          v-for="modelObj in models"
          :key="modelObj.name"
          :value="modelObj.name"
        >
          {{ modelObj.name }}
        </option>
      </select>
      <StatusBadge :status="status" class="ml-2" />
    </div>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue';
import StatusBadge from './StatusBadge.vue';

const props = defineProps({
  status: String,
  models: Array,
  model: String
});

defineEmits(['model']);

const model = ref(props.model);

watch(() => props.model, v => model.value = v);
</script>

<style scoped>
.dark select {
  color: #f4f4f5 !important; /* zinc-100 */
}
</style>