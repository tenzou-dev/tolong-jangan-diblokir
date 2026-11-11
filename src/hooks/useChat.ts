import { useState, useCallback, useEffect, useRef } from "react";
import { ChatMessage, GameState } from "@/types";

export const INITIAL_GAME_STATE: GameState = {
  user_id: "player_1",
  current_chapter: 1,
  panic_level: 3,
  trust_level: 5,
};

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg_1",
    text: "halo.. kamu ada disana?",
    sender: "nindi",
    timestamp: "09:12",
    status: "read",
  },
  {
    id: "msg_2",
    text: "hai nindi, aku di sini. kamu di mana?",
    sender: "player",
    timestamp: "09:13",
    status: "read",
  },
  {
    id: "msg_3",
    text: "aku di gedung kampus.. gelap banget, tidak ada orang disini.. tolong jangan diblokir ya",
    sender: "nindi",
    timestamp: "09:14",
    status: "read",
  },
];

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [isNindiTyping, setIsNindiTyping] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);

  const chatAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const chatArea = chatAreaRef.current;
    if (chatArea) {
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  }, [messages, isNindiTyping]);

  const addPlayerMessage = useCallback((text: string) => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const playerMsg: ChatMessage = {
      id: `msg_${Date.now()}_player`,
      text,
      sender: "player",
      timestamp,
      status: "sent",
    };

    setMessages((prev) => [...prev, playerMsg]);
    return playerMsg;
  }, []);

  const addNindiMessage = useCallback((text: string) => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const nindiMsg: ChatMessage = {
      id: `msg_${Date.now()}_nindi`,
      text,
      sender: "nindi",
      timestamp,
      status: "read",
    };

    setMessages((prev) => [...prev, nindiMsg]);
  }, []);

  const simulateTyping = useCallback((duration: number = 2000) => {
    setIsNindiTyping(true);
    const timer = setTimeout(() => {
      setIsNindiTyping(false);
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      setInputError(null);

      // Add player message immediately (optimistic)
      const playerMsg = addPlayerMessage(text);

      // Simulate Nindi typing
      const stopTyping = simulateTyping(2500);

      try {
        // TODO: Replace with actual API call to Cloudflare Worker + Gemini
        // const response = await fetchApi(text, gameState);
        setTimeout(() => {
          stopTyping();
          // Mock response for now
          addNindiMessage(
            "maaf ya.. aku masih nangis disini. kamu bisa bantu aku?"
          );
        }, 2500);
      } catch (err) {
        stopTyping();
        setInputError("Gagal mengirim pesan. Coba lagi.");
      }
    },
    [addPlayerMessage, addNindiMessage, simulateTyping, gameState]
  );

  const updateGameState = useCallback(
    (updates: Partial<GameState>) => {
      setGameState((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const markMessageAsRead = useCallback((messageId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId && m.sender === "player"
          ? { ...m, status: "read" as const }
          : m
      )
    );
  }, []);

  return {
    messages,
    gameState,
    isNindiTyping,
    inputError,
    chatAreaRef,
    sendMessage,
    updateGameState,
    markMessageAsRead,
  };
};