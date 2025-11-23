/**
 * TypeScript Type Definitions
 *
 * This file contains all TypeScript interfaces and types used throughout the game.
 * These provide type safety and documentation for complex data structures.
 */

import { GameState, Difficulty, RewardType } from "./enums";
import type { P5, P5Image, P5Graphics, P5Color } from "./p5-types";

// ============================================================================
// GAME STATE TYPES
// ============================================================================

export interface Team {
  name: string;
  color: string;
  active: boolean;
  isPlayer: boolean;
  targetX: number;
  targetY: number;
  targetUpdateTimer: number;
}

export interface GameConfig {
  difficulty: Difficulty;
  armySize: number;
  startFromWebsite: boolean;
  embeddedMode: boolean;
}

export interface WaveState {
  currentWave: number;
  enemiesInWave: number;
  enemiesRemaining: number;
  waveStartTime: number;
  waveDuration: number;
  isTransitioning: boolean;
  transitionStartTime: number;
}

export interface ScoreState {
  totalScore: number;
  kills: number;
  wavesCompleted: number;
}

export interface ActiveReward {
  type: RewardType;
  startTime: number;
  duration: number; // in milliseconds
}

export interface RewardNotification {
  message: string;
  startTime: number;
  duration: number; // in milliseconds
}

export interface RewardState {
  activeRewards: ActiveReward[];
  notifications: RewardNotification[];
}

export interface GameContext {
  gameState: GameState;
  difficulty: Difficulty;
  particlesPerTeam: number;
  teams: Team[];
  playerTeam: Team;
  enemyTeam: Team;
  mapScale: number;
  waveState: WaveState;
  scoreState: ScoreState;
  rewardState: RewardState;
}

// ============================================================================
// ENTITY INTERFACES
// ============================================================================

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  vx: number;
  vy: number;
}

export interface Rectangle {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CollisionResult {
  collides: boolean;
  closestX?: number;
  closestY?: number;
  distance?: number;
}

// ============================================================================
// SPRITE TYPES
// ============================================================================

export interface SpriteSheet {
  soldier: P5Graphics[];
}

export interface AnimationState {
  currentFrame: number;
  frameCounter: number;
  frameSpeed: number;
  rotation: number;
}

// ============================================================================
// MENU TYPES
// ============================================================================

export interface MenuState {
  hoveredMapIndex: number | null;
  hoveredTeam: number | null;
  hoveredOpponentCount: number | null;
  hoveredParticleCount: number | null;
  showGameInfo: boolean;
  gameInfoButtonHovered: boolean;
}

// ============================================================================
// GLOBAL WINDOW INTERFACE
// ============================================================================

declare global {
  interface Window {
    gameConfig?: GameConfig;
    sketchLoaded?: boolean;
    restartGame?: () => void;
  }
}
