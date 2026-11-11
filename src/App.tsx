import React, { useState, useCallback, useEffect } from "react";
import { WhatsAppContainer } from "./components/whatsapp/WhatsAppContainer";
import { useChat, INITIAL_MESSAGES, INITIAL_GAME_STATE } from "./hooks/useChat";
import { ChatMessage, GameState } from "./types";
import "./index.css";

function App() {
  const [backButtonVisible, setBackButtonVisible] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);

  const { messages, isNindiTyping, inputError, sendMessage, updateGameState } = useChat();

  const handleSendMessage = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage]
  );

  const handleBack = () => {
    setBackButtonVisible(false);
  };

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
        gameState={gameState}
        isNindiTyping={isNindiTyping}
        onSendMessage={handleSendMessage}
        onBack={handleBack}
      />
    </div>
  );
}

export default App;
