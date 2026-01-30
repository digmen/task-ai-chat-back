export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at?: string;
}

export interface Chat {
  id: number;
  title: string;
  created_at: string;
}