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
      <button
        v-if="!collapsed"
        @click="$emit('new-chat')"
        class="ml-2 px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-xs text-zinc-700 dark:text-zinc-200"
        title="New Chat"
      >
        + New Chat
      </button>
    </div>
    <ul
      v-if="!collapsed"
      class="flex-1 overflow-y-auto p-4 space-y-2"
    >
      <li v-for="(item, idx) in history" :key="idx">
        <a
          class="block hover:text-zinc-600 dark:hover:text-zinc-300 transition"
          href="#"
          @click.prevent="$emit('select', item.id)"
        >
          {{ item.title }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import ThemeToggle from './ThemeToggle.vue';

defineEmits(['toggle-collapse', 'toggle-theme', 'select', 'new-chat']);

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
