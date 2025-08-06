<template>
  <span :class="`${badgeClass} inline-flex items-center gap-0.5`">
    <span
      class="inline-block w-2 h-2 rounded-full mr-1"
      :class="dotClass"
    />
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  status: { type: String, required: true }
});

const label = computed(() => {
  switch (props.status) {
    case 'ok':
      return 'Online';
    case 'checking':
      return 'Checking...';
    case 'offline':
      return 'Offline';
    default:
      return 'Unknown';
  }
});

const badgeClass = computed(() => {
  switch (props.status) {
    case 'ok':
      return 'text-green-400';
    case 'offline':
      return 'text-red-400';
    case 'checking':
    default:
      return 'text-yellow-400';
  }
});

const dotClass = computed(() => {
  switch (props.status) {
    case 'ok':
      return 'bg-green-400';
    case 'offline':
      return 'bg-red-400';
    case 'checking':
    default:
      return 'bg-yellow-400';
  }
});
</script>
