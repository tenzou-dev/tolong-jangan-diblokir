import { useState, useCallback, useEffect, useRef } from "react";
import type { ChatMessage, GameState } from "@/types";

export const INITIAL_GAME_STATE: GameState = {
  user_id: "player_1",
  current_chapter: 1,
  panic_level: 3,
  trust_level: 5,
};

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg_1",
    text: "hai, nanti malam ya jan diblokir, aku butuh bantuan…",
    sender: "nindi",
    timestamp: "23:42",
    status: "read",
  },
  {
    id: "msg_2",
    text: "eh, siapa ini? aku ngga kenal kamu..",
    sender: "player",
    timestamp: "23:43",
    status: "read",
  },
  {
    id: "msg_3",
    text: "eh? kamu ngga ada nama aku di kontak? aku nindi..",
    sender: "nindi",
    timestamp: "23:44",
    status: "read",
  },
  {
    id: "msg_4",
    text: "maaf, aku ngga ada temen yang namanya nindi. salah nomer nih",
    sender: "player",
    timestamp: "23:45",
    status: "read",
  },
  {
    id: "msg_5",
    text: "tolong jangan diblokir ya.. aku di gedung kampus yang gelap, ngga ada orang, aku takut banget..",
    sender: "nindi",
    timestamp: "23:46",
    status: "read",
  },
];

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [isNindiTyping, setIsNindiTyping] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);

  const chatAreaRef = useRef<HTMLDivElement>(null);

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

      addPlayerMessage(text);

      const stopTyping = simulateTyping(2500);

      try {
        setTimeout(() => {
          stopTyping();
          addNindiMessage(
            "tolong.. aku takut banget disini. tolong bantu aku.."
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
      setGameState((prev: GameState) => ({ ...prev, ...updates }));
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
