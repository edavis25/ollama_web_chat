// ChatMessage:
// {
//   role: 'user' | 'assistant',
//   content: string,
// }
//
// ChatSession: {
//   id: string,
//   title: string,
//   messages: ChatMessage[],
//   createdAt: number,
//   updatedAt: number
// }

const STORAGE_KEY = 'chat_sessions';

export class LocalStorageChatDriver {
  async loadSessions() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  async loadSession(id) {
    const sessions = await this.loadSessions();
    return sessions.find(s => s.id === id) || null;
  }

  async saveSession(session) {
    const sessions = await this.loadSessions();
    const idx = sessions.findIndex(s => s.id === session.id);
    if (idx >= 0) {
      sessions[idx] = session;
    } else {
      sessions.push(session);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }

  async deleteSession(id) {
    const sessions = await this.loadSessions();
    const filtered = sessions.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
}
