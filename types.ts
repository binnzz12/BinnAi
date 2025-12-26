
export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export type UserStatus = 'free' | 'pro';

export interface Message {
  id: string;
  role: Role;
  text: string;
  imageUrl?: string;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  userStatus: UserStatus;
  messageCount: number;
}
