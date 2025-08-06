// Chat message and session types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

// Storage driver interface
export interface ChatStorageDriver {
  loadSessions(): Promise<ChatSession[]>;
  saveSession(session: ChatSession): Promise<void>;
  deleteSession(id: string): Promise<void>;
}

// LocalStorage implementation
const STORAGE_KEY = 'chat_sessions';

export class LocalStorageChatDriver implements ChatStorageDriver {
  async loadSessions(): Promise<ChatSession[]> {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  async saveSession(session: ChatSession): Promise<void> {
    const sessions = await this.loadSessions();
    const idx = sessions.findIndex(s => s.id === session.id);
    if (idx >= 0) {
      sessions[idx] = session;
    } else {
      sessions.push(session);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }

  async deleteSession(id: string): Promise<void> {
    const sessions = await this.loadSessions();
    const filtered = sessions.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
}
