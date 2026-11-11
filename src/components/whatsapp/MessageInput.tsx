import React, { useRef, useState } from "react";

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled }) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    inputRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="input-area">
      <button className="emoji-button" aria-label="Emoji" disabled={disabled}>
        😊
      </button>
      <div className="input-wrapper">
        <textarea
          ref={inputRef}
          className="message-input"
          placeholder="Ketik pesan..."
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
      </div>
      <button className="attach-button" aria-label="Lampirkan" disabled={disabled}>
        📎
      </button>
      <button className="camera-button" aria-label="Kamera" disabled={disabled}>
        📷
      </button>
      <button
        className="send-button"
        onClick={handleSend}
        disabled={disabled || text.trim() === ""}
        aria-label="Kirim"
      >
        <svg className="send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  );
};
