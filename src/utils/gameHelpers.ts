import { useStore } from '../store';
import { Game } from '../types';

// Helper to get game name from ID
export function useGameName(gameId: string): string {
  const game = useStore(state => state.games.find(g => g.id === gameId));
  return game?.name || gameId;
}

// Helper to get game object from ID
export function useGame(gameId: string): Game | undefined {
  return useStore(state => state.games.find(g => g.id === gameId));
}

// Helper to get game names from IDs
export function useGameNames(gameIds: string[]): string[] {
  const games = useStore(state => state.games);
  return gameIds.map(id => games.find(g => g.id === id)?.name || id);
}

// Category helpers
export const categoryLabels: Record<string, string> = {
  TRADITIONAL_SPORT: '🏅 Sports',
  BOARD_GAME: '♟ Mind Games',
  ONLINE_GAME: '🎮 Online Games',
  BATTLE_ROYALE: '🔥 Battle Royale',
};

export const formatLabels: Record<string, string> = {
  SET_BASED: 'Set Based',
  POINT_BASED: 'Point Based',
  GOAL_BASED: 'Goal Based',
  RUN_BASED: 'Run Based',
  WIN_DRAW_LOSS: 'Win/Draw/Loss',
  PLACEMENT_BASED: 'Placement Based',
  PLACEMENT_AND_KILLS: 'Placement + Kills',
  ROUND_BASED: 'Round Based',
  TIME_BASED: 'Time Based',
  CUSTOM: 'Custom',
};

export const participationLabels: Record<string, string> = {
  INDIVIDUAL: 'Individual',
  TEAM: 'Team',
  SQUAD: 'Squad',
  BOTH: 'Individual & Team',
};
