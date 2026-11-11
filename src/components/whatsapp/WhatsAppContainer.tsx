import React from "react";
import { WhatsAppHeader } from "./WhatsAppHeader";
import { ChatArea } from "./ChatArea";
import { MessageInput } from "./MessageInput";
import type { ChatMessage, GameState } from "@/types";

interface WhatsAppContainerProps {
  messages: ChatMessage[];
  gameState: GameState;
  isNindiTyping: boolean;
  onSendMessage: (text: string) => void;
  onBack: () => void;
}

export const WhatsAppContainer: React.FC<WhatsAppContainerProps> = ({
  messages,
  isNindiTyping,
  onSendMessage,
  onBack,
}) => {
  const status = isNindiTyping ? "typing" : ("online" as const);

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
