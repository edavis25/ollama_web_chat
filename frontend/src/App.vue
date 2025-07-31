<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
    <h1 class="text-3xl font-bold mb-6">Ollama Web UI</h1>
    <div class="mb-4 flex items-center gap-2">
      <span class="font-semibold">Ollama Server Status:</span>
      <span :class="badgeClass">
        <span class="inline-block w-2 h-2 rounded-full mr-1" :class="dotClass"></span>
        {{ healthLabel }}
      </span>
      <button @click="fetchHealth" class="ml-2 px-2 py-1 bg-gray-800 rounded hover:bg-gray-700 text-xs">Refresh</button>
    </div>
    <div class="mb-4 w-full max-w-xs">
      <label class="block mb-1 font-semibold">Select Model:</label>
      <select v-model="selectedModel" class="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white">
        <option v-for="model in models" :key="model.name" :value="model.name">{{ model.name }}</option>
      </select>
      <div v-if="models.length === 0" class="text-sm text-gray-400 mt-2">No models found.</div>
    </div>
    <div class="w-full max-w-xl bg-gray-800 rounded p-4 flex flex-col gap-2">
      <div class="flex-1 overflow-y-auto max-h-80 mb-2">
        <div v-for="(msg, idx) in messages" :key="idx" class="mb-2">
          <div :class="msg.role === 'user' ? 'text-blue-300 text-right' : 'text-green-300 text-left'">
            <span class="block whitespace-pre-line">{{ msg.content }}</span>
          </div>
        </div>
      </div>
      <form @submit.prevent="sendMessage" class="flex gap-2">
        <input v-model="input" class="flex-1 p-2 rounded bg-gray-700 border border-gray-600 text-white" placeholder="Type your message..." :disabled="loading || !selectedModel" />
        <button type="submit" class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700" :disabled="loading || !input || !selectedModel">
          {{ loading ? '...' : 'Send' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const health = ref('checking');
const models = ref([]);
const selectedModel = ref('');
const messages = ref([]);
const input = ref('');
const loading = ref(false);

const healthLabel = computed(() => {
  if (health.value === 'ok') return 'Online';
  if (health.value === 'checking') return 'Checking...';
  if (typeof health.value === 'string') return health.value.charAt(0).toUpperCase() + health.value.slice(1);
  return 'Offline';
});

const badgeClass = computed(() => {
  if (health.value === 'ok') return 'text-green-400';
  if (health.value === 'checking') return 'text-yellow-400';
  return 'text-red-400';
});

const dotClass = computed(() => {
  if (health.value === 'ok') return 'bg-green-400';
  if (health.value === 'checking') return 'bg-yellow-400';
  return 'bg-red-400';
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

<style>
</style>
