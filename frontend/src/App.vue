<template>
  <div :class="['flex h-screen w-screen overflow-hidden', theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-900']">
    <aside
      :class="[
        'flex flex-col bg-zinc-900 h-full z-10 transition-all duration-300 no-wrap',
        collapsed ? 'w-16 min-w-[4rem] max-w-[4rem]' : 'w-[300px] min-w-[200px] max-w-[320px]'
      ]"
    >
      <Sidebar
        :history="chatHistory"
        :collapsed="collapsed"
        @toggle-collapse="collapsed = !collapsed"
        @toggle-theme="toggleTheme"
      />
    </aside>
    <div class="flex flex-col flex-1 h-full transition-all duration-300 main-section gap-12">
      <header class="shrink-0 p-4 border-b border-zinc-800 main-section">
        <ChatHeader
          :status="health"
          :models="models"
          :model="selectedModel"
          @model="val => selectedModel = val"
        />
      </header>
      <section class="flex-1 flex flex-col justify-end items-center overflow-y-auto">
        <div class="w-full max-w-2xl flex-1 flex flex-col justify-end overflow-y-auto gap-5 py-5" ref="messagesContainer">
          <ChatMessages :messages="messages" />
          <TypingIndicator v-if="loading || true" />
        </div>
      </section>
      <footer class="shrink-0 p-4 flex justify-center main-section">
        <ChatInput
          v-model="input"
          :disabled="loading || !selectedModel"
          @send="sendMessage"
        >
          {{ loading ? '...' : 'Send' }}
        </ChatInput>
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

const health = ref('checking');
const models = ref([]);
const selectedModel = ref('');
const messages = ref([]);
const input = ref('');
const loading = ref(false);
const chatHistory = ref([]); // Placeholder for sidebar
const messagesContainer = ref(null);
const collapsed = ref(false);
const theme = ref(localStorage.getItem('theme') || 'dark');

function selectHistory(item) {
  // TODO: Load selected chat from history
}

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

onMounted(() => {
  fetchHealth();
  fetchModels();
});

async function sendMessage() {
  if (!input.value || !selectedModel.value) return;
  loading.value = true;
  messages.value.push({ role: 'user', content: input.value });
  const chatHistory = messages.value.map(m => ({ role: m.role, content: m.content }));
  try {
    const res = await axios.post('/api/chat', {
      model: selectedModel.value,
      messages: chatHistory
    });
    messages.value.push({ role: 'assistant', content: res.data.response });
  } catch {
    messages.value.push({ role: 'assistant', content: '[Error: Failed to get response]' });
  }
  input.value = '';
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
