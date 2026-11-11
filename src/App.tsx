import { useState, useCallback, useEffect } from "react";
import { WhatsAppContainer } from "./components/whatsapp/WhatsAppContainer";
import { useChat } from "./hooks/useChat";
import { GameMenu } from "./components/game/GameMenu";
import "./index.css";

function App() {
  const [showMenu, setShowMenu] = useState(true);
  const [playerData, setPlayerData] = useState<{ name: string; gender: string } | null>(null);

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

  const handleStartGame = useCallback((data: { name: string; gender: string }) => {
    setPlayerData(data);
    setShowMenu(false);
  }, []);

  if (showMenu) {
    return <GameMenu onStart={handleStartGame} />;
  }

  return (
    <div className="app-wrapper">
      <WhatsAppContainer
        messages={messages}
        gameState={{ user_id: playerData?.name || "player_1", current_chapter: 1, panic_level: 3, trust_level: 5 }}
        isNindiTyping={isNindiTyping}
        onSendMessage={handleSendMessage}
        onBack={() => setShowMenu(true)}
      />
    </div>
  );
}

export default App;
