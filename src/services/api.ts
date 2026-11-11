import type { GameState, NindiResponse } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://tolong-jangan-diblokir.tenzou-dev.workers.dev";

export const sendMessageToNindi = async (
  playerMessage: string,
  gameState: GameState
): Promise<NindiResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: playerMessage,
      user_id: gameState.user_id,
      current_chapter: gameState.current_chapter,
      panic_level: gameState.panic_level,
      trust_level: gameState.trust_level,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
};

export const getGameState = async (userId: string): Promise<GameState> => {
  const response = await fetch(`${API_BASE_URL}/api/state/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch game state");
  }
  return response.json();
};

export const saveGameState = async (state: GameState): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/state`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state),
  });
  if (!response.ok) {
    throw new Error("Failed to save game state");
  }
};
