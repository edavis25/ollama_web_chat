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
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
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
      <SessionListItem
        v-for="(item, idx) in sessionList"
        :class="`${currentSessionId === item.id ? 'font-semibold' : ''}`"
        :key="idx"
        :item="item"
        :isEditing="isItemEditing(item.id)"
        :editValue="getEditValue(item.id, item.title)"
        :collapsed="collapsed"
        @select="$emit('select', $event)"
        @edit="onEdit"
        @rename="onRename"
        @cancel="clearEditState"
        @update-edit-value="updateEditValue"
      />
    </ul>
  </nav>
</template>

<script setup>
import { computed, ref } from "vue";
import SessionListItem from "./SessionListItem.vue";
import ThemeToggle from './ThemeToggle.vue';
import { useChatSessions } from '../composables/useChatSessions.js';

const props = defineProps({
  history: { type: Array, required: true },
  collapsed: { type: Boolean, default: false },
  renameSession: { type: Function, required: true }
});

defineEmits(["select", "toggle-collapse", "toggle-theme", "new-chat"]);

const { currentSessionId, loadSessions } = useChatSessions();

const sessionList = computed(() => {
  return [...props.history].sort(
    (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
  );
});

const editingId = ref(null);
const editValues = ref({});

function isItemEditing(id) {
  return editingId.value === id;
}

function getEditValue(id, defaultTitle) {
  return editingId.value === id ? editValues.value[id] || defaultTitle : '';
}

function onEdit(id) {
  editingId.value = id;
  const session = sessionList.value.find(s => s.id === id);
  if (session) {
    editValues.value[id] = session.title;
  }
}

function updateEditValue(id, value) {
  editValues.value[id] = value;
}

async function onRename({ id, title }) {
  if (title && title.trim() && id) {
    await props.renameSession(id, title.trim());
  }
  clearEditState();
}

function clearEditState() {
  editingId.value = null;
  editValues.value = {};
}
</script>
