<template>
  <nav
    :class="[
      'flex flex-col h-screen transition-all duration-200',
      collapsed ? 'w-16 min-w-[4rem] max-w-[4rem]' : 'w-[300px] min-w-[200px] max-w-[320px]',
    ]"
  >
    <div class="flex items-center gap-2 p-4 border-b border-gray-300 dark:border-zinc-700">
      <button
        @click="$emit('toggle-collapse')"
        class="text-xl focus:outline-none"
      >
        ☰
      </button>
      <span
        v-if="!collapsed"
        class="font-semibold flex-1 whitespace-nowrap"
      >
        Chat History
      </span>
      <ThemeToggle @toggle-theme="$emit('toggle-theme')" />
    </div>
    <ul
      v-if="!collapsed"
      class="flex-1 overflow-y-auto p-4 space-y-2"
    >
      <li v-for="(item, idx) in history" :key="idx">
        <a
          class="block text-zinc-100 dark:text-zinc-900 hover:text-zinc-100 dark:hover:text-zinc-900 transition"
          href="#"
          @click.prevent="$emit('select', item)"
        >
          {{ item.title }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import ThemeToggle from './ThemeToggle.vue';

defineEmits(['toggle-collapse', 'toggle-theme', 'select']);

defineProps({
  history: {
    type: Array,
    default: () => []
  },
  collapsed: {
    type: Boolean,
    default: false
  }
});
</script>
