import React from "react";

export const TypingIndicator: React.FC = () => {
  return (
    <div className="typing-indicator" role="status" aria-label="Nindi sedang mengetik...">
      <span>Nindi sedang mengetik...</span>
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />
    </div>
  );
};