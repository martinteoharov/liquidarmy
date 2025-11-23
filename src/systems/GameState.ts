/**
 * Game State Management
 *
 * Manages the overall game state and team management for wave-based gameplay.
 * Tracks player and enemy teams, manages game over conditions.
 *
 * Responsibilities:
 * - Initialize player and enemy teams
 * - Spawn initial player soldiers
 * - Check lose conditions (player eliminated)
 * - Restart game with new settings
 */

import { GameState, TeamId, Difficulty } from "../enums";
import { Soldier } from "../entities/Soldier";
import type { Team } from "../types";
import { TEAM_COLORS, SPAWN_POSITIONS } from "../config";
import type { P5 } from "../p5-types";

export class GameStateManager {
  gameState: GameState = GameState.PLAYING;

  /**
   * Initialize teams for wave-based gameplay
   * Player is always RED (team 0), enemies are BLUE (team 1)
   */
  initializeTeams = (): { playerTeam: Team; enemyTeam: Team } => {
    const playerTeam: Team = {
      name: TEAM_COLORS[TeamId.RED].name,
      color: TEAM_COLORS[TeamId.RED].color,
      active: true,
      isPlayer: true,
      targetX: 500,
      targetY: 500,
      targetUpdateTimer: 0,
    };

    const enemyTeam: Team = {
      name: "Enemies",
      color: TEAM_COLORS[TeamId.BLUE].color,
      active: true,
      isPlayer: false,
      targetX: 100,
      targetY: 100,
      targetUpdateTimer: 0,
    };

    return { playerTeam, enemyTeam };
  };

  /**
   * Spawn soldiers for player team only
   * Enemies are spawned by WaveSystem
   */
  spawnPlayerSoldiers = (particlesPerTeam: number, p: P5): Soldier[] => {
    const soldiers: Soldier[] = [];
    const spawnPos = SPAWN_POSITIONS[TeamId.RED]; // Bottom-left corner

    for (let j = 0; j < particlesPerTeam; j++) {
      // Spread soldiers in a circle around spawn point
      const angle = (j / particlesPerTeam) * Math.PI * 2;
      const radius = 50 + Math.floor(j / 8) * 30;
      const offsetX = Math.cos(angle) * radius;
      const offsetY = Math.sin(angle) * radius;

      soldiers.push(
        new Soldier(
          p,
          spawnPos.x + offsetX,
          spawnPos.y + offsetY,
          TeamId.RED,
          TEAM_COLORS[TeamId.RED].color,
        ),
      );
    }

    return soldiers;
  };

  /**
   * Check if the game is over (player defeated)
   */
  checkLoseCondition = (soldiers: Soldier[]): boolean => {
    // Check if player has any alive soldiers
    const hasPlayerSoldiers = soldiers.some(
      (s) => s.isAlive && s.teamIndex === TeamId.RED,
    );

    if (!hasPlayerSoldiers) {
      this.gameState = GameState.GAME_OVER;
      return true;
    }

    return false;
  };

  /**
   * Get count of alive soldiers per team
   */
  getTeamCounts = (soldiers: Soldier[]): { player: number; enemy: number } => {
    const playerCount = soldiers.filter(
      (s) => s.isAlive && s.teamIndex === TeamId.RED,
    ).length;
    const enemyCount = soldiers.filter(
      (s) => s.isAlive && s.teamIndex === TeamId.BLUE,
    ).length;

    return { player: playerCount, enemy: enemyCount };
  };

  /**
   * Reset game state for restart
   */
  reset = (): void => {
    this.gameState = GameState.PLAYING;
  };
}
