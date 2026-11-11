import { useState, useCallback, useEffect, useRef } from "react";
import type { ChatMessage, GameState } from "@/types";

export const INITIAL_GAME_STATE: GameState = {
  user_id: "player_1",
  current_chapter: 1,
  panic_level: 3,
  trust_level: 5,
  chapter1_ending: "none",
  player_name: "",
  player_gender: "laki-laki",
  nindi_survived: false,
  dimas_contacted: false,
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
  const [showEnding, setShowEnding] = useState<"survived" | "missing" | "possessed" | null>(null);

  const chatAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chatArea = chatAreaRef.current;
    if (chatArea) {
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  }, [messages, isNindiTyping]);

  const determineEnding = useCallback((panic: number, trust: number): "survived" | "missing" | "possessed" => {
    if (panic >= 7 && trust <= 3) return "possessed";
    if (panic <= 4 && trust >= 7) return "survived";
    return "missing";
  }, []);

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

  const getNindiResponse = useCallback((playerText: string, panic: number, trust: number): string => {
    const lower = playerText.toLowerCase();

    if (panic >= 7) {
      if (lower.includes("tolong") || lower.includes("bantu")) {
        return "tolongggg.. aku takut banget.. ada sesuatu di sini..";
      }
      if (lower.includes("dimana") || lower.includes("mana")) {
        return "gedung kampus.. lantai 3.. ruang server.. gelap banget..";
      }
      return "huuu.. ngga tahu harus ngapain.. aku takut..";
    }

    if (trust >= 7) {
      if (lower.includes("siapa")) {
        return "aku nindi. mahasiswa semester 3. kamu temen gue kan?";
      }
      if (lower.includes("kabar")) {
        return "kabar jelek. aku terjebak disini. tolong bantu gue..";
      }
      return "terima kasih udah mau dengerin cerita gue..";
    }

    if (trust <= 3) {
      if (lower.includes("siapa")) {
        return "siapa kamu? kenapa ngasih nomer gue?";
      }
      return "ngga percaya sama kamu..";
    }

    if (lower.includes("siapa")) {
      return "aku nindi.. mahasiswa kampus ini..";
    }
    if (lower.includes("dimana") || lower.includes("mana")) {
      return "gedung kampus yang lama. depan masjid..";
    }
    if (lower.includes("tolong") || lower.includes("bantu")) {
      return "tolong ya.. aku ngga bisa gerak.. pintu terkunci..";
    }
    if (lower.includes("kabar")) {
      return "kabar jelek banget..";
    }

    return "aku masih disini.. tolong jangan diblokir..";
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      setInputError(null);

      addPlayerMessage(text);

      const stopTyping = simulateTyping(2500);

      try {
        setTimeout(() => {
          stopTyping();
          const response = getNindiResponse(text, gameState.panic_level, gameState.trust_level);
          addNindiMessage(response);

          if (messages.length >= 8 && gameState.current_chapter === 1) {
            const ending = determineEnding(gameState.panic_level, gameState.trust_level);
            setTimeout(() => {
              setShowEnding(ending);
            }, 2000);
          }
        }, 2500);
      } catch (err) {
        stopTyping();
        setInputError("Gagal mengirim pesan. Coba lagi.");
      }
    },
    [addPlayerMessage, addNindiMessage, simulateTyping, getNindiResponse, gameState, messages.length, determineEnding]
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

  const restartChapter = useCallback(() => {
    setMessages([...INITIAL_MESSAGES]);
    setGameState(INITIAL_GAME_STATE);
    setShowEnding(null);
  }, []);

  return {
    messages,
    gameState,
    isNindiTyping,
    inputError,
    showEnding,
    chatAreaRef,
    sendMessage,
    updateGameState,
    markMessageAsRead,
    restartChapter,
  };
};
