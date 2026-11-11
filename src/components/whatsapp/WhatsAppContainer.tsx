import React from "react";
import { WhatsAppHeader } from "./WhatsAppHeader";
import { ChatArea } from "./ChatArea";
import { MessageInput } from "./MessageInput";
import { ChatEnding } from "./ChatEnding";
import type { ChatMessage, GameState } from "@/types";

interface WhatsAppContainerProps {
  messages: ChatMessage[];
  gameState: GameState;
  isNindiTyping: boolean;
  onSendMessage: (text: string) => void;
  onBack: () => void;
  showEnding: "survived" | "missing" | "possessed" | null;
  onNextChapter: () => void;
  onRestartChapter: () => void;
}

export const WhatsAppContainer: React.FC<WhatsAppContainerProps> = ({
  messages,
  isNindiTyping,
  onSendMessage,
  onBack,
  showEnding,
  onNextChapter,
  onRestartChapter,
}) => {
  const status = isNindiTyping ? "typing" : ("online" as const);

  if (showEnding) {
    return (
      <div className="whatsapp-container">
        <WhatsAppHeader
          contactName="Nindi"
          status="offline"
          onBack={onBack}
        />
        <ChatEnding
          ending={showEnding}
          onNextChapter={onNextChapter}
          onRestart={onRestartChapter}
        />
      </div>
    );
  }

  return (
    <div className="whatsapp-container">
      <WhatsAppHeader
        contactName="Nindi"
        status={status}
        onBack={onBack}
      />
      <ChatArea messages={messages} isNindiTyping={isNindiTyping} />
      <MessageInput onSend={onSendMessage} disabled={isNindiTyping} />
    </div>
  );
};
