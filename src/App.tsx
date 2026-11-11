import { useState, useCallback, useEffect } from "react";
import { WhatsAppContainer } from "./components/whatsapp/WhatsAppContainer";
import { useChat } from "./hooks/useChat";
import { GameMenu } from "./components/game/GameMenu";
import "./index.css";

function App() {
  const [showMenu, setShowMenu] = useState(true);

  const { messages, isNindiTyping, inputError, sendMessage, showEnding, restartChapter, gameState } = useChat();

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

  const handleStartGame = useCallback(() => {
    setShowMenu(false);
  }, []);

  const handleNextChapter = useCallback(() => {
    alert("Chapter 2 segera hadir - Nindi akan menghubungi Dimas");
  }, []);

  if (showMenu) {
    return <GameMenu onStart={handleStartGame} />;
  }

  return (
    <div className="app-wrapper">
      <WhatsAppContainer
        messages={messages}
        gameState={gameState}
        isNindiTyping={isNindiTyping}
        onSendMessage={handleSendMessage}
        onBack={() => setShowMenu(true)}
        showEnding={showEnding}
        onNextChapter={handleNextChapter}
        onRestartChapter={restartChapter}
      />
    </div>
  );
}

export default App;
