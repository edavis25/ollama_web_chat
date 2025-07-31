<template>
  <div class="pb-5 mb-3 bg-zinc-900">
    <h1 class="text-xl font-bold mb-2">
      Ollama Web UI
    </h1>
    <div class="flex items-center gap-2">
      <select
        id="model-select"
        class="bg-zinc-800 border border-zinc-700 text-white rounded px-2 py-1"
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
  </div>
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
