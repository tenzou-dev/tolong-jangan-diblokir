import React from "react";
import { ChatBubble } from "./ChatBubble";
import { TypingIndicator } from "./TypingIndicator";
import type { ChatMessage } from "@/types";

interface ChatAreaProps {
  messages: ChatMessage[];
  isNindiTyping: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, isNindiTyping }) => {
  return (
    <div className="chat-area" data-testid="chat-area">
      {messages.length === 0 && (
        <div className="empty-chat">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <h3>Belum ada percakapan</h3>
          <p>Mulai obrolan dengan Nindi sekarang.</p>
        </div>
      )}
      {messages.map((msg) => (
        <ChatBubble key={msg.id} message={msg} />
      ))}
      {isNindiTyping && <TypingIndicator />}
      <div className="message-scroll-spacer" style={{ height: 80 }} />
    </div>
  );
};
