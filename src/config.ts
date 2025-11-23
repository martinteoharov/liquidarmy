/**
 * Game Configuration
 *
 * This file contains ALL configurable values for the game.
 * Modify values here to adjust game balance, physics, visual settings, etc.
 *
 * Organization:
 * - Physics constants
 * - Map configuration
 * - Team configuration
 * - Soldier configuration
 * - Combat settings
 * - UI settings
 */

import { Difficulty } from "./enums";

// ============================================================================
// PHYSICS CONSTANTS
// ============================================================================

export const PHYSICS = {
  /** Size of the game map (square) - the actual game world */
  MAP_SIZE: 1000,

  /** Velocity damping per frame (0-1, lower = more friction) */
  FRICTION: 0.92,

  /** Force pushing soldiers apart (liquid physics) */
  SEPARATION_FORCE: 0.6,

  /** Attraction force toward cursor for player team */
  CURSOR_ATTRACTION: 0.25,

  /** Spatial grid cell size for collision optimization */
  GRID_CELL_SIZE: 20,

  /** Minimum distance before soldiers stop separating (reduces jitter) */
  MIN_SEPARATION_DISTANCE: 0.5,

  /** Velocity threshold for stopping movement (reduces jitter) */
  VELOCITY_STOP_THRESHOLD: 0.05,
} as const;

// ============================================================================
// SOLDIER CONFIGURATION
// ============================================================================

export interface SoldierStats {
  readonly name: string;
  readonly size: number;
  readonly spacing: number;
  readonly maxSpeed: number;
  readonly health: number;
  readonly damage: number;
  readonly attackRange: number;
  readonly spriteSize: number;
  readonly attackCooldown: number;
  readonly xpPerKill: number;
}

export const SOLDIER: SoldierStats = {
  name: "Soldier",
  size: 8,
  spacing: 16,
  maxSpeed: 2.5,
  health: 100,
  damage: 20,
  attackRange: 20,
  spriteSize: 16,
  attackCooldown: 15,
  xpPerKill: 10,
} as const;

// ============================================================================
// COMBAT SETTINGS
// ============================================================================

export const COMBAT = {
  /** Chance for critical hit (0-1) */
  CRIT_CHANCE: 0.1,

  /** Critical hit damage multiplier */
  CRIT_MULTIPLIER: 2.0,

  /** XP required per level (multiplied by current level) */
  XP_PER_LEVEL: 100,

  /** Health increase per level (multiplier) */
  LEVEL_HEALTH_MULTIPLIER: 1.15,

  /** Damage increase per level (multiplier) */
  LEVEL_DAMAGE_MULTIPLIER: 1.1,

  /** Speed increase per level (multiplier) */
  LEVEL_SPEED_MULTIPLIER: 1.05,

  /** Morale decrease per frame when outnumbered */
  MORALE_DECREASE_RATE: 2,

  /** Morale increase per frame when not fleeing */
  MORALE_INCREASE_RATE: 0.5,

  /** Morale threshold to start fleeing */
  FLEE_MORALE_THRESHOLD: 20,

  /** Morale threshold to stop fleeing */
  RECOVER_MORALE_THRESHOLD: 40,
} as const;

// ============================================================================
// TEAM CONFIGURATION
// ============================================================================

export interface TeamColor {
  readonly name: string;
  readonly color: string;
}

export const TEAM_COLORS: readonly TeamColor[] = [
  { name: "Red", color: "#E74C3C" },
  { name: "Blue", color: "#3498DB" },
  { name: "Green", color: "#2ECC71" },
  { name: "Yellow", color: "#F1C40F" },
] as const;

// ============================================================================
// WAVE SYSTEM CONFIGURATION
// ============================================================================

export interface WaveConfig {
  /** Base number of enemies in first wave */
  readonly baseEnemyCount: number;
  /** Enemy count increase per wave */
  readonly enemyCountIncrease: number;
  /** Enemy stat multiplier per wave */
  readonly statMultiplierPerWave: number;
  /** Time limit per wave in seconds */
  readonly waveDuration: number;
  /** Delay between waves in seconds */
  readonly waveTransitionDelay: number;
}

export interface DifficultyConfig {
  readonly name: string;
  readonly difficulty: Difficulty;
  readonly description: string;
  readonly waveConfig: WaveConfig;
  /** Enemy health multiplier */
  readonly enemyHealthMultiplier: number;
  /** Enemy damage multiplier */
  readonly enemyDamageMultiplier: number;
  /** Enemy speed multiplier */
  readonly enemySpeedMultiplier: number;
  /** Points multiplier */
  readonly pointsMultiplier: number;
}

export const DIFFICULTY_CONFIGS: readonly DifficultyConfig[] = [
  {
    name: "Easy",
    difficulty: Difficulty.EASY,
    description: "Perfect for beginners - more time, weaker enemies",
    waveConfig: {
      baseEnemyCount: 15,
      enemyCountIncrease: 3,
      statMultiplierPerWave: 1.08,
      waveDuration: 90,
      waveTransitionDelay: 5,
    },
    enemyHealthMultiplier: 0.8,
    enemyDamageMultiplier: 0.7,
    enemySpeedMultiplier: 0.9,
    pointsMultiplier: 1.0,
  },
  {
    name: "Medium",
    difficulty: Difficulty.MEDIUM,
    description: "Balanced challenge for experienced players",
    waveConfig: {
      baseEnemyCount: 20,
      enemyCountIncrease: 5,
      statMultiplierPerWave: 1.12,
      waveDuration: 75,
      waveTransitionDelay: 4,
    },
    enemyHealthMultiplier: 1.0,
    enemyDamageMultiplier: 1.0,
    enemySpeedMultiplier: 1.0,
    pointsMultiplier: 1.5,
  },
  {
    name: "Hard",
    difficulty: Difficulty.HARD,
    description: "Extreme challenge - fast, strong enemies",
    waveConfig: {
      baseEnemyCount: 30,
      enemyCountIncrease: 8,
      statMultiplierPerWave: 1.15,
      waveDuration: 60,
      waveTransitionDelay: 3,
    },
    enemyHealthMultiplier: 1.2,
    enemyDamageMultiplier: 1.3,
    enemySpeedMultiplier: 1.1,
    pointsMultiplier: 2.0,
  },
] as const;

// ============================================================================
// SCORING CONFIGURATION
// ============================================================================

export const SCORING = {
  /** Points per enemy killed */
  POINTS_PER_KILL: 10,

  /** Bonus points for completing a wave */
  WAVE_COMPLETION_BONUS: 100,

  /** Bonus multiplier based on remaining time (0-1) */
  TIME_BONUS_MULTIPLIER: 2.0,

  /** Points for surviving wave without kills */
  SURVIVAL_BONUS: 50,
} as const;

// ============================================================================
// UI SETTINGS
// ============================================================================

export const UI = {
  /** Number of animation frames for soldier sprites */
  ANIMATION_FRAMES: 4,

  /** Minimum stars to display on veteran units */
  MIN_LEVEL_FOR_STARS: 3,

  /** Maximum stars to display */
  MAX_STARS: 5,

  /** Default canvas aspect ratio (width / height) */
  CANVAS_ASPECT_RATIO: 4 / 3,
} as const;

// ============================================================================
// ANIMATION SETTINGS
// ============================================================================

export const ANIMATION = {
  /** Frames between soldier walk animation updates */
  SOLDIER_FRAME_SPEED: 8,

  /** Lifespan of blood splatters (frames) */
  BLOOD_SPLATTER_LIFESPAN: 90,

  /** Lifespan of death animations (frames) */
  DEATH_ANIMATION_DURATION: 15,

  /** Lifespan of level-up effects (frames) */
  LEVELUP_EFFECT_DURATION: 25,
} as const;

// ============================================================================
// AUDIO SETTINGS
// ============================================================================

export const AUDIO = {
  /** Volume for hit sounds (0-1) */
  HIT_SOUND_VOLUME: 0.15,

  /** Duration of pop sound in seconds */
  POP_SOUND_DURATION: 0.1,
} as const;

// ============================================================================
// SPAWN CONFIGURATION
// ============================================================================

export interface SpawnPosition {
  readonly x: number;
  readonly y: number;
}

export const SPAWN_POSITIONS: readonly SpawnPosition[] = [
  { x: 100, y: 100 }, // Top-left (Red)
  { x: 900, y: 100 }, // Top-right (Blue)
  { x: 100, y: 900 }, // Bottom-left (Green)
  { x: 900, y: 900 }, // Bottom-right (Yellow)
] as const;

// ============================================================================
// REWARD SYSTEM CONFIGURATION
// ============================================================================

export const REWARDS = {
  /** Size of reward pickup on map */
  PICKUP_SIZE: 30,

  /** Collection radius for automatic pickup */
  COLLECTION_RADIUS: 40,

  /** Duration for notification banner (milliseconds) */
  NOTIFICATION_DURATION: 5000,

  /** Base chance for common rewards (wave 1-3) */
  BASE_COMMON_CHANCE: 0.6,

  /** Base chance for rare rewards (wave 1-3) */
  BASE_RARE_CHANCE: 0.3,

  /** Base chance for legendary rewards (wave 1-3) */
  BASE_LEGENDARY_CHANCE: 0.1,

  /** Chance increase per wave for rare rewards */
  RARE_CHANCE_PER_WAVE: 0.05,

  /** Chance increase per wave for legendary rewards */
  LEGENDARY_CHANCE_PER_WAVE: 0.03,

  /** Shadow troop stats multiplier */
  SHADOW_TROOP_STATS_MULTIPLIER: 3.0,

  /** Champion stats multiplier */
  CHAMPION_STATS_MULTIPLIER: 5.0,
} as const;

export interface RewardConfig {
  readonly name: string;
  readonly description: string;
  readonly rarity: "common" | "rare" | "legendary";
  readonly color: string;
  readonly icon: string;
}

export const REWARD_CONFIGS: Record<string, RewardConfig> = {
  damage_boost: {
    name: "Damage Boost",
    description: "2x damage for 60 seconds",
    rarity: "common",
    color: "#FF6B6B",
    icon: "⚔",
  },
  speed_boost: {
    name: "Speed Boost",
    description: "1.5x speed for 45 seconds",
    rarity: "common",
    color: "#4ECDC4",
    icon: "⚡",
  },
  troop_reinforcement: {
    name: "Reinforcements",
    description: "Add 50 troops to your army",
    rarity: "common",
    color: "#95E1D3",
    icon: "🛡",
  },
  health_regen: {
    name: "Health Regeneration",
    description: "Heal all troops to full health",
    rarity: "common",
    color: "#A8E6CF",
    icon: "💚",
  },
  critical_mastery: {
    name: "Critical Mastery",
    description: "50% crit chance for 30 seconds",
    rarity: "rare",
    color: "#FFD93D",
    icon: "💥",
  },
  divine_shield: {
    name: "Divine Shield",
    description: "50% damage reduction for 45 seconds",
    rarity: "rare",
    color: "#6BCB77",
    icon: "🛡",
  },
  berserker_rage: {
    name: "Berserker Rage",
    description: "3x damage but 0.5x speed for 30 seconds",
    rarity: "rare",
    color: "#FF6B9D",
    icon: "💢",
  },
  shadow_troops: {
    name: "Shadow Troops",
    description: "Add 10 elite shadow warriors",
    rarity: "legendary",
    color: "#9D84B7",
    icon: "👤",
  },
  immortal_champion: {
    name: "Immortal Champion",
    description: "1 invincible champion for 20 seconds",
    rarity: "legendary",
    color: "#F6D365",
    icon: "👑",
  },
  army_expansion: {
    name: "Army Expansion",
    description: "Add 100 regular troops",
    rarity: "legendary",
    color: "#FFA94D",
    icon: "⚔",
  },
} as const;
