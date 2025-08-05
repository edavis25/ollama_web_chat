<template>
  <nav
    :class="[
      'flex flex-col h-screen transition-all duration-200',
      collapsed ? 'w-16 min-w-[4rem] max-w-[4rem]' : 'w-[300px] min-w-[200px] max-w-[320px]',
      'bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 border-r border-zinc-800 dark:border-zinc-200'
    ]"
  >
    <div class="flex items-center gap-2 p-4 border-b border-zinc-800 dark:border-zinc-200">
      <button
        @click="$emit('toggle-collapse')"
        class="text-xl focus:outline-none"
      >
        ☰
      </button>
      <span
        v-if="!collapsed"
        class="font-semibold flex-1"
      >
        Chat History
      </span>
      <button
        v-if="!collapsed"
        @click="$emit('toggle-theme')"
        class="ml-auto px-2 py-1 rounded text-xs border border-zinc-700 dark:border-zinc-200 bg-zinc-800 dark:bg-zinc-100 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition"
        aria-label="Toggle dark/light mode"
      >
        🌓
      </button>
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

<script>
export default {
  name: 'Sidebar',
  props: {
    history: {
      type: Array,
      default: () => []
    },
    collapsed: {
      type: Boolean,
      default: false
    }
  }
}
</script>
