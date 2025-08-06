<template>
  <div class="flex items-center group">
    <a
      class="block flex-1 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
      href="#"
      @click.prevent="$emit('select', item.id)"
    >
      <span
        v-if="!isEditing"
        @dblclick="$emit('edit', item.id)"
      >
        {{ item.title }}
      </span>
      <input
        v-else
        class="bg-transparent border-b border-zinc-400 focus:outline-none px-1 text-xs w-32"
        type="text"
        :value="editValue"
        @input="$emit('update-edit-value', item.id, $event.target.value)"
        @keydown.enter="$emit('rename', { id: item.id, title: editValue })"
        @blur="$emit('rename', { id: item.id, title: editValue })"
        @keydown.esc="$emit('cancel', item.id)"
        autofocus
      />
    </a>
    <button
      v-if="!collapsed && !isEditing"
      @click.stop="$emit('edit', item.id)"
      class="ml-1 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 opacity-0 group-hover:opacity-100 transition"
      title="Rename Chat"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
      </svg>
    </button>
    <button
      v-if="!collapsed && isEditing"
      @click.stop="$emit('rename', { id: item.id, title: editValue })"
      class="ml-1 text-xs text-zinc-400 hover:text-green-600 opacity-100 transition"
      title="Save Rename"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    </button>
    <button
      v-if="!collapsed && isEditing"
      @click.stop="$emit('cancel', item.id)"
      class="ml-1 text-xs text-zinc-400 hover:text-red-500 opacity-100 transition"
      title="Cancel Rename"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  item: { type: Object, required: true },
  isEditing: { type: Boolean, required: true },
  editValue: { type: String, required: true },
  collapsed: { type: Boolean, required: true }
});

defineEmits(['select', 'edit', 'rename', 'cancel', 'update-edit-value']);
</script>
