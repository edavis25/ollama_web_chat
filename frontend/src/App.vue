<template>
  <div :class="[
      'flex h-screen w-screen overflow-hidden',
      'bg-white text-zinc-900',
      'dark:bg-zinc-800 dark:text-zinc-100'
    ]"
  >
    <aside
      :class="[
        'flex flex-col h-full z-10 transition-all duration-300 no-wrap',
        'bg-gray-100 dark:bg-zinc-900',
      ]"
    >
      <Sidebar
        :history="chatHistory"
        :collapsed="collapsed"
        :renameSession="renameSession"
        @toggle-collapse="collapsed = !collapsed"
        @toggle-theme="toggleTheme"
        @new-chat="createNewSession"
        @select="selectSession"
      />
    </aside>
    <div class="flex flex-col flex-1 h-full transition-all duration-300 main-section gap-12">
      <header class="shrink-0 p-4 main-section">
        <ChatHeader
          :status="health"
          :models="models"
          :model="selectedModel"
          @model="val => selectedModel = val"
        />
      </header>
      <section class="flex-1 flex flex-col justify-end items-center overflow-y-auto">
        <div
            class="w-full max-w-2xl flex-1 flex flex-col justify-end overflow-y-auto gap-5 py-5"
            ref="messagesContainer"
        >
          <ChatMessages :messages="messages" />
          <TypingIndicator v-if="loading" />
        </div>
      </section>
      <footer class="pb-8 self-center w-full max-w-2xl">
        <ChatInput
          v-model="input"
          :disabled="loading || !selectedModel"
          @send="sendMessage"
        />
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import Sidebar from './components/Sidebar.vue';
import ChatHeader from './components/ChatHeader.vue';
import ChatMessages from './components/ChatMessages.vue';
import ChatInput from './components/ChatInput.vue';
import TypingIndicator from './components/TypingIndicator.vue';
import axios from 'axios';
import { useChatSessions } from './composables/useChatSessions.js';

const health = ref('checking');
const models = ref([]);
const selectedModel = ref('');
const input = ref('');
const loading = ref(false);
const messagesContainer = ref(null);
const collapsed = ref(false);
const theme = ref(localStorage.getItem('theme') || 'light');

const {
  chatHistory,
  messages,
  loadSessions,
  createNewSession,
  selectSession,
  sendMessage: sendChatMessage,
  renameSession
} = useChatSessions();

onMounted(async () => {
  await Promise.all([
      fetchHealth(),
      fetchModels(),
      loadSessions()
  ])
});

async function fetchHealth() {
  health.value = 'checking';
  try {
    const res = await axios.get('/api/health');
    health.value = res.data.status;
  } catch {
    health.value = 'offline';
  }
}

async function fetchModels() {
  try {
    const res = await axios.get('/api/models');
    models.value = res.data.models || [];
    if (models.value.length > 0) {
      selectedModel.value = models.value[0].name;
    }
  } catch {
    models.value = [];
  }
}

async function sendMessage() {
  loading.value = true;
  await sendChatMessage({ input, selectedModel });
  loading.value = false;
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', theme.value);
}

watch(messages, async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
});

watch(theme, (val) => {
  const root = document.documentElement;
  if (val === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
}, { immediate: true });
</script>
