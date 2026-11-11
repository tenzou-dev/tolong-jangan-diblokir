import React from "react";
import type { ChatMessage } from "@/types";

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isPlayer = message.sender === "player";

  return (
    <div className={`message-wrapper ${isPlayer ? "player" : "nindi"}`}>
      <div className={`chat-bubble ${isPlayer ? "player" : "nindi"}`}>
        {message.text}
      </div>
      <div className="message-meta">
        <span className="timestamp">{message.timestamp}</span>
        {isPlayer && (
          <div className="checkmarks">
            {message.status === "read" || message.status === "delivered" ? (
              <>
                <span className="checkmark read" aria-label="Read"></span>
                <span className="checkmark read" aria-label="Read"></span>
              </>
            ) : (
              <>
                <span className="checkmark sent" aria-label="Sent"></span>
                <span className="checkmark sent" aria-label="Sent"></span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
