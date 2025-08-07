<template>
  <nav
    :class="[
      'flex flex-col h-screen transition-all duration-200',
      collapsed ? 'w-16 min-w-[4rem] max-w-[4rem]' : 'w-[300px] min-w-[200px] max-w-[320px]',
    ]"
  >
    <div class="flex items-center gap-2 h-[56px] p-4 border-b border-gray-200 dark:border-zinc-800">
      <button
        @click="$emit('toggle-collapse')"
        class="text-xl focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      <ThemeToggle
        v-if="!collapsed"
        @toggle-theme="$emit('toggle-theme')"
      />
    </div>
    <div v-if="!collapsed" class="flex flex-col gap-2 p-4 pt-2">
      <span>
        <button
            @click="$emit('new-chat')"
            class="inline-flex items-center gap-1 px-0 py-1 text-sm hover:text-zinc-950 dark:hover:text-zinc-300"
            style="justify-content: flex-start;"
            title="New Chat"
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        New Chat
      </button>
      </span>
    </div>
    <div v-if="!collapsed" class="px-4 pb-2">
      <h2 class="text-xs tracking-wider uppercase text-zinc-500">Chat History</h2>
    </div>
    <ul
      v-if="!collapsed"
      class="flex-1 overflow-y-auto p-4 pt-0 space-y-2"
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
    (a, b) => (b.updatedAt || b.timestamp || 0) - (a.updatedAt || a.timestamp || 0)
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
