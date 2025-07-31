<template>
  <div class="flex min-h-screen bg-zinc-900 text-white">
    <Sidebar :history="chatHistory" @select="selectHistory" class="flex-shrink-0 w-1/6 min-w-[80px] max-w-[300px]" />
    <div class="flex flex-col flex-1">
      <div class="px-8 pt-4 pb-4">
        <ChatHeader
          :status="health"
          :models="models"
          :model="selectedModel"
          @model="val => selectedModel = val"
        />
      </div>
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-xl flex flex-col flex-1">
          <section class="flex-1 overflow-y-auto mb-8">
            <ChatMessages :messages="messages" />
          </section>
          <ChatInput
            v-model="input"
            :disabled="loading || !selectedModel"
            @send="sendMessage"
          >
            {{ loading ? '...' : 'Send' }}
          </ChatInput>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Sidebar from './components/Sidebar.vue';
import ChatHeader from './components/ChatHeader.vue';
import ChatMessages from './components/ChatMessages.vue';
import ChatInput from './components/ChatInput.vue';
import axios from 'axios';

const health = ref('checking');
const models = ref([]);
const selectedModel = ref('');
const messages = ref([]);
const input = ref('');
const loading = ref(false);
const chatHistory = ref([]); // Placeholder for sidebar

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

onMounted(() => {
  fetchHealth();
  fetchModels();
});
</script>
