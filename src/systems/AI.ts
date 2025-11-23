/**
 * AI System
 *
 * Controls enemy behavior in wave-based gameplay.
 * Enemies always target the player's army.
 *
 * Responsibilities:
 * - Update target positions for enemy team
 * - Track player army location
 * - Add strategic positioning and flanking
 * - Smooth target transitions to avoid jitter
 *
 * AI Strategy:
 * - Always targets the player's army center
 * - Adds positional variation for flanking
 * - Updates targets periodically (not every frame) for performance
 * - Uses smoothing to create natural-looking movement
 */

import type { Soldier } from "../entities/Soldier";
import type { Team } from "../types";
import type { Position } from "../types";
import type { P5 } from "../p5-types";
import { TeamId } from "../enums";

export class AISystem {
  /**
   * Update team targets
   * Player follows mouse, enemies target player
   */
  updateTeamTargets = (
    playerTeam: Team,
    enemyTeam: Team,
    soldiers: Soldier[],
    mapScale: number,
    offsetX: number,
    offsetY: number,
    p: P5,
  ): void => {
    // Player team follows mouse - convert screen coords to map coords
    // Account for map centering offset
    playerTeam.targetX = (p.mouseX - offsetX) / mapScale;
    playerTeam.targetY = (p.mouseY - offsetY) / mapScale;

    // Enemy team uses AI to target player
    enemyTeam.targetUpdateTimer--;
    if (enemyTeam.targetUpdateTimer <= 0) {
      this.updateEnemyTarget(enemyTeam, soldiers, p);
      enemyTeam.targetUpdateTimer = 60; // Update every 60 frames (1 second at 60fps)
    }
  };

  /**
   * Calculate optimal target position for enemy team
   * Enemies always move toward player's army center
   */
  private updateEnemyTarget = (
    enemyTeam: Team,
    soldiers: Soldier[],
    p: P5,
  ): void => {
    const playerCenter = this.calculatePlayerCenter(soldiers);
    if (!playerCenter) return;

    const enemyCenter = this.calculateEnemyCenter(soldiers);
    if (!enemyCenter) {
      // No enemies yet, just target player center
      enemyTeam.targetX = playerCenter.x;
      enemyTeam.targetY = playerCenter.y;
      return;
    }

    // Add strategic offset for flanking
    // Create dynamic movement pattern
    const angle = p.frameCount * 0.02;
    const offsetAngle = angle + p.sin(p.frameCount * 0.01) * 0.5;
    const offsetDist = 80 + p.sin(p.frameCount * 0.015) * 40;

    const targetX = playerCenter.x + Math.cos(offsetAngle) * offsetDist;
    const targetY = playerCenter.y + Math.sin(offsetAngle) * offsetDist;

    // Smooth transition to new target
    const smoothing = 0.15;
    enemyTeam.targetX =
      enemyTeam.targetX * (1 - smoothing) + targetX * smoothing;
    enemyTeam.targetY =
      enemyTeam.targetY * (1 - smoothing) + targetY * smoothing;
  };

  /**
   * Calculate the average position of all player soldiers
   */
  private calculatePlayerCenter = (soldiers: Soldier[]): Position | null => {
    let count = 0;
    let sumX = 0;
    let sumY = 0;

    for (const soldier of soldiers) {
      if (soldier.isAlive && soldier.teamIndex === TeamId.RED) {
        sumX += soldier.x;
        sumY += soldier.y;
        count++;
      }
    }

    if (count === 0) return null;

    return {
      x: sumX / count,
      y: sumY / count,
    };
  };

  /**
   * Calculate the average position of all enemy soldiers
   */
  private calculateEnemyCenter = (soldiers: Soldier[]): Position | null => {
    let count = 0;
    let sumX = 0;
    let sumY = 0;

    for (const soldier of soldiers) {
      if (soldier.isAlive && soldier.teamIndex === TeamId.BLUE) {
        sumX += soldier.x;
        sumY += soldier.y;
        count++;
      }
    }

    if (count === 0) return null;

    return {
      x: sumX / count,
      y: sumY / count,
    };
  };
}
