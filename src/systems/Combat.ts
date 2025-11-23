/**
 * Combat System
 *
 * Manages all combat interactions between soldiers.
 * Handles damage calculation, kill tracking, and combat visual effects.
 *
 * Responsibilities:
 * - Process soldier attacks each frame
 * - Calculate damage and apply to targets
 * - Track kills and grant XP
 * - Create visual feedback (blood, death animations, level-ups)
 * - Clean up dead soldiers
 */

import type { Soldier } from "../entities/Soldier";
import type { Team } from "../types";
import {
  BloodSplatter,
  DeathAnimation,
  LevelUpEffect,
} from "../entities/Effects";
import type { SpatialGrid } from "../utils/SpatialGrid";
import { playPopSound } from "../utils/Audio";
import type { P5, P5Image, P5Graphics, P5Color } from "../p5-types";
import type { RewardSystem } from "./RewardSystem";

export class CombatSystem {
  bloodSplatters: BloodSplatter[] = [];
  deathAnimations: DeathAnimation[] = [];
  levelUpEffects: LevelUpEffect[] = [];
  private rewardSystem: RewardSystem | null = null;

  /**
   * Set reward system for applying combat modifiers
   */
  setRewardSystem = (rewardSystem: RewardSystem): void => {
    this.rewardSystem = rewardSystem;
  };

  /**
   * Process combat for all soldiers
   */
  update = (
    soldiers: Soldier[],
    teams: Team[],
    spatialGrid: SpatialGrid,
    p: P5,
  ): void => {
    // Check for combat interactions
    for (const soldier of soldiers) {
      if (!soldier.alive) continue;

      soldier.checkEnemyCollision(
        spatialGrid,
        teams,
        this.bloodSplatters,
        this.deathAnimations,
        playPopSound,
        p,
        this.rewardSystem,
      );
    }

    // Update visual effects
    this.updateEffects();
  };

  /**
   * Update all combat visual effects
   */
  private updateEffects = (): void => {
    // Update blood splatters
    for (const splatter of this.bloodSplatters) {
      splatter.update();
    }
    this.bloodSplatters = this.bloodSplatters.filter((s) => s.alive);

    // Update death animations
    for (const anim of this.deathAnimations) {
      anim.update();
    }
    this.deathAnimations = this.deathAnimations.filter((a) => a.alive);

    // Update level-up effects
    for (const effect of this.levelUpEffects) {
      effect.update();
    }
    this.levelUpEffects = this.levelUpEffects.filter((e) => e.alive);
  };

  /**
   * Add a level-up effect (called when soldier levels up)
   */
  addLevelUpEffect = (effect: LevelUpEffect): void => {
    this.levelUpEffects.push(effect);
  };

  /**
   * Render all combat effects
   */
  draw = (mapScale: number, p: P5): void => {
    // Draw in order: blood (bottom), death anims, level-ups (top)
    for (const splatter of this.bloodSplatters) {
      splatter.draw(mapScale, p);
    }

    for (const anim of this.deathAnimations) {
      anim.draw(mapScale, p);
    }

    for (const effect of this.levelUpEffects) {
      effect.draw(mapScale, p);
    }
  };

  /**
   * Clear all effects (for game restart)
   */
  clear = (): void => {
    this.bloodSplatters = [];
    this.deathAnimations = [];
    this.levelUpEffects = [];
  };
}
