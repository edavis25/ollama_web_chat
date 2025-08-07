import { ref } from 'vue';
import { LocalStorageChatDriver } from '../storage/chatStorage.js';
import axios from 'axios';

const chatStorage = new LocalStorageChatDriver();

// Singleton state: shared between all consumers of this composable
const chatHistory = ref([]); // Sidebar session list
const currentSessionId = ref(null);
const messages = ref([]);

export function useChatSessions() {
  async function loadSessions() {
    const sessions = await chatStorage.loadSessions();
    chatHistory.value = sessions.map(s => ({
      id: s.id,
      title: s.title,
      updatedAt: s.updatedAt
    }));
    if (sessions.length > 0) {
      sessions.sort((a, b) => b.updatedAt - a.updatedAt);
      const current = sessions[0];
      currentSessionId.value = current.id;
      messages.value = current.messages || [];
    } else {
      await createNewSession();
    }
  }

  async function createNewSession() {
    const sessions = await chatStorage.loadSessions();
    const newTitle = generateNewChatTitle(sessions);

    const newSession = {
      id: `session-${Date.now()}`,
      title: newTitle,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await chatStorage.saveSession(newSession);

    chatHistory.value.push({ id: newSession.id, title: newSession.title, updatedAt: newSession.updatedAt });
    currentSessionId.value = newSession.id;
    messages.value = [];
  }

  async function selectSession(id) {
    const session = await chatStorage.loadSession(id);
    if (session) {
      currentSessionId.value = session.id;
      messages.value = session.messages || [];
    }
  }

  async function sendMessage({ input, selectedModel }) {
    if (!input.value || !selectedModel.value) return;

    if (!currentSessionId.value) {
      await createNewSession();
    }

    messages.value.push({ role: 'user', content: input.value });
    const chatHistoryArr = messages.value.map(m => ({ role: m.role, content: m.content }));
    input.value = '';
    let response = '';

    try {
      const res = await axios.post('/api/chat', {
        model: selectedModel.value,
        messages: chatHistoryArr
      });
      response = res.data.response;
      messages.value.push({ role: 'assistant', content: response });
    } catch {
      response = '[Error: Failed to get response]';
      messages.value.push({ role: 'assistant', content: response });
    } finally {
      if (currentSessionId.value) {
        const sessions = await chatStorage.loadSessions();
        const existing = sessions.find(s => s.id === currentSessionId.value);
        const sessionToSave = {
          id: currentSessionId.value,
          title: existing ? existing.title : 'New Chat',
          messages: messages.value,
          createdAt: existing ? existing.createdAt : Date.now(),
          updatedAt: Date.now()
        };
        await chatStorage.saveSession(sessionToSave);
        const updatedSessions = await chatStorage.loadSessions();
        chatHistory.value = updatedSessions.map(s => ({
          id: s.id,
          title: s.title,
          updatedAt: s.updatedAt
        }));
      }
    }

    return response;
  }

  async function renameSession(id, newTitle) {
    const sessions = await chatStorage.loadSessions();
    const idx = sessions.findIndex(s => s.id === id);
    if (idx === -1) return false;
    sessions[idx].title = newTitle;
    sessions[idx].updatedAt = Date.now();
    await chatStorage.saveSession(sessions[idx]);
    const updatedSessions = await chatStorage.loadSessions();
    chatHistory.value = [...updatedSessions.map(s => ({
      id: s.id,
      title: s.title,
      updatedAt: s.updatedAt
    }))];
    return true;
  }

  function generateNewChatTitle(sessions) {
    // when generating new chats, just suffix a number to "New Chat"
    // until more advanced title generation is implemented
    const baseTitle = 'New Chat';
    let maxNum = 0;

    for (const s of sessions) {
      if (s.title === baseTitle) {
        if (maxNum === 0) {
          maxNum = 1;
        }
      } else if (s.title.startsWith(baseTitle + ' ')) {
        const num = parseInt(s.title.slice(baseTitle.length + 1), 10);
        if (!isNaN(num) && num >= maxNum) {
          maxNum = num + 1;
        }
      }
    }

    return maxNum === 0 ? baseTitle : `${baseTitle} ${maxNum}`;
  }

  return {
    chatHistory,
    currentSessionId,
    messages,
    loadSessions,
    createNewSession,
    selectSession,
    sendMessage,
    renameSession
  };
}
