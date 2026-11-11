export type MessageSender = "player" | "nindi" | "dimas" | "entity";

export interface ChatMessage {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: string;
  status: "sending" | "sent" | "delivered" | "read";
  imageUrl?: string;
}

export type Chapter1Ending = "survived" | "missing" | "possessed" | "none";

export interface GameState {
  user_id: string;
  current_chapter: number;
  panic_level: number; // 1-10
  trust_level: number; // 1-10
  chapter1_ending: Chapter1Ending;
  player_name: string;
  player_gender: string;
  nindi_survived: boolean;
  dimas_contacted: boolean;
}

export interface NindiResponse {
  reply: string;
  panic_level: number;
  trust_level: number;
  chapter: number;
  imageUrl?: string;
  ending?: Chapter1Ending;
}

export interface ChapterConfig {
  id: number;
  title: string;
  character: string;
  description: string;
}
