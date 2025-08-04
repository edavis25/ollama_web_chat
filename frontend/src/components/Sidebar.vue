<template>
  <nav
    :class="[
      'flex flex-col bg-zinc-900 text-white h-screen transition-all duration-200',
      collapsed ? 'w-16 min-w-[4rem] max-w-[4rem]' : 'w-[300px] min-w-[200px] max-w-[320px]'
    ]"
  >
    <div class="flex items-center gap-2 p-4 border-b border-zinc-800">
      <button
        @click="$emit('toggle-collapse')"
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
    },
    collapsed: {
      type: Boolean,
      default: false
    }
  }
}
</script>
