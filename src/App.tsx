import { useCallback, useEffect } from "react";
import { WhatsAppContainer } from "./components/whatsapp/WhatsAppContainer";
import { useChat } from "./hooks/useChat";
import "./index.css";

function App() {
  const { messages, isNindiTyping, inputError, sendMessage } = useChat();

  const handleSendMessage = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage]
  );

  const handleInputError = useCallback(() => {
    if (inputError) {
      alert(inputError);
    }
  }, [inputError]);

  useEffect(() => {
    handleInputError();
  }, [inputError, handleInputError]);

  return (
    <div className="app-wrapper">
      <WhatsAppContainer
        messages={messages}
        gameState={{ user_id: "player_1", current_chapter: 1, panic_level: 3, trust_level: 5 }}
        isNindiTyping={isNindiTyping}
        onSendMessage={handleSendMessage}
        onBack={() => {}}
      />
    </div>
  );
}

export default App;
