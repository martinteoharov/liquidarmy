/**
 * Enums for Liquid Wars
 *
 * This file contains all enumerated types used throughout the game.
 * Enums provide type-safe constants for game states, map types, and team identifiers.
 */

/**
 * Game state enumeration
 * Defines all possible states the game can be in
 */
export enum GameState {
  DIFFICULTY_SELECTION = "difficulty_selection",
  PLAYING = "playing",
  WAVE_TRANSITION = "wave_transition",
  GAME_OVER = "game_over",
}

/**
 * Difficulty levels
 * Affects enemy stats, spawn rates, and wave progression
 */
export enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

/**
 * Team identifiers
 * Player is always RED, enemies use other colors
 */
export enum TeamId {
  RED = 0,
  BLUE = 1,
  GREEN = 2,
  YELLOW = 3,
}

/**
 * Reward types that can drop from waves
 */
export enum RewardType {
  DAMAGE_BOOST = "damage_boost", // 2x damage for 60 seconds
  SPEED_BOOST = "speed_boost", // 1.5x speed for 45 seconds
  TROOP_REINFORCEMENT = "troop_reinforcement", // Add 50 troops
  SHADOW_TROOPS = "shadow_troops", // Add 10 elite shadow troops
  HEALTH_REGENERATION = "health_regen", // Heal all troops to full
  CRITICAL_MASTERY = "critical_mastery", // 50% crit chance for 30 seconds
  IMMORTAL_CHAMPION = "immortal_champion", // 1 invincible champion for 20 seconds
  ARMY_EXPANSION = "army_expansion", // Add 100 regular troops
  BERSERKER_RAGE = "berserker_rage", // 3x damage but 0.5x speed for 30 seconds
  DIVINE_SHIELD = "divine_shield", // 50% damage reduction for 45 seconds
}
