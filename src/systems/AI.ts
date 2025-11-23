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
      enemyTeam.targetUpdateTimer = 15; // Update every 15 frames (4x per second) for aggressive AI
    }
  };

  /**
   * Calculate optimal target position for enemy team
   * AGGRESSIVE AI: Enemies flank and surround the player
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
      // No enemies yet, charge directly at player
      enemyTeam.targetX = playerCenter.x;
      enemyTeam.targetY = playerCenter.y;
      return;
    }

    // Calculate vector from enemy to player
    const dx = playerCenter.x - enemyCenter.x;
    const dy = playerCenter.y - enemyCenter.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    let targetX: number;
    let targetY: number;

    if (dist > 200) {
      // FAR AWAY: Aggressive charge directly at player
      // Move PAST the player to surround them
      targetX = playerCenter.x + (dx / dist) * 50;
      targetY = playerCenter.y + (dy / dist) * 50;
    } else if (dist > 100) {
      // MEDIUM RANGE: Aggressive flanking
      // Calculate perpendicular direction for flanking
      const angleToPlayer = Math.atan2(dy, dx);

      // Choose flanking direction (alternate based on time for dynamic movement)
      const flankDirection = Math.sin(p.frameCount * 0.03) > 0 ? 1 : -1;
      const flankAngle = angleToPlayer + (Math.PI / 3) * flankDirection; // 60 degree flank

      // Target position that flanks the player
      const flankDist = 60;
      targetX = playerCenter.x + Math.cos(flankAngle) * flankDist;
      targetY = playerCenter.y + Math.sin(flankAngle) * flankDist;
    } else {
      // CLOSE RANGE: Surround and overwhelm
      // Spread out in a circle around player for maximum contact
      const spreadAngle =
        p.frameCount * 0.04 + enemyTeam.targetUpdateTimer * 0.1;
      const spreadRadius = 40;

      targetX = playerCenter.x + Math.cos(spreadAngle) * spreadRadius;
      targetY = playerCenter.y + Math.sin(spreadAngle) * spreadRadius;
    }

    // Minimal smoothing for aggressive, responsive movement
    const smoothing = 0.3;
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
