<template>
  <nav
    :class="[
      'flex flex-col bg-zinc-950 text-white h-screen transition-all duration-200',
      collapsed ? 'w-16' : 'w-60'
    ]"
  >
    <div class="flex items-center gap-2 p-4 border-b border-zinc-800">
      <button
        @click="toggleCollapse"
        class="text-xl focus:outline-none"
      >
        ☰
      </button>
      <span
        v-if="!collapsed"
        class="font-semibold"
      >
        Chat History
      </span>
    </div>
    <ul
      v-if="!collapsed"
      class="flex-1 overflow-y-auto p-4 space-y-2"
  >
      <li v-for="(item, idx) in history" :key="idx">
        <a
          class="block text-white/80 hover:text-white transition"
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
    }
  },
  data() {
    return {
      collapsed: false
    }
  },
  methods: {
    toggleCollapse() {
      this.collapsed = !this.collapsed;
    }
  }
}
</script>
