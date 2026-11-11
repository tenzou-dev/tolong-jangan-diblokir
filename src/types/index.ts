export type MessageSender = "player" | "nindi";

export interface ChatMessage {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: string;
  status: "sending" | "sent" | "delivered" | "read";
  isTyping?: boolean;
}

export interface GameState {
  user_id: string;
  current_chapter: number;
  panic_level: number; // 1-10
  trust_level: number; // 1-10
}

export interface NindiResponse {
  reply: string;
  panic_level: number;
  trust_level: number;
  chapter: number;
}