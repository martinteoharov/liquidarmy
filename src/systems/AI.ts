/**
 * AI System
 *
 * Controls enemy behavior with power-based strategic decision making.
 * AI adapts tactics based on relative army strength.
 *
 * Responsibilities:
 * - Update target positions for enemy team
 * - Calculate relative power (troop counts, levels)
 * - Choose strategy based on power differential
 * - Execute tactical maneuvers (charge, flank, kite, regroup)
 *
 * AI Strategies:
 * - OVERWHELMING (2x+ advantage): Aggressive surround and crush
 * - STRONG (1.3x+ advantage): Confident flanking and encirclement
 * - EVEN (0.7x-1.3x): Tactical positioning and hit-and-run
 * - WEAK (0.4x-0.7x): Kiting, retreat, and guerrilla tactics
 * - DESPERATE (<0.4x): Full retreat with evasive maneuvers
 */

import type { Soldier } from "../entities/Soldier";
import type { Team } from "../types";
import type { Position } from "../types";
import type { P5 } from "../p5-types";
import { TeamId } from "../enums";

enum AIStrategy {
  OVERWHELMING = "overwhelming",
  STRONG = "strong",
  EVEN = "even",
  WEAK = "weak",
  DESPERATE = "desperate",
}

export class AISystem {
  private currentStrategy: AIStrategy = AIStrategy.EVEN;
  private strategicPosition: Position | null = null;

  /**
   * Update team targets
   * Player follows mouse/touch, enemies use power-based AI
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
    // Player team follows mouse/touch - convert screen coords to map coords
    // p5.js automatically maps first touch to mouseX/mouseY for mobile support
    // Account for map centering offset
    playerTeam.targetX = (p.mouseX - offsetX) / mapScale;
    playerTeam.targetY = (p.mouseY - offsetY) / mapScale;

    // Enemy team uses power-based AI
    enemyTeam.targetUpdateTimer--;
    if (enemyTeam.targetUpdateTimer <= 0) {
      this.updateEnemyTarget(enemyTeam, soldiers, p);
      enemyTeam.targetUpdateTimer = 15; // Update every 15 frames (4x per second)
    }
  };

  /**
   * Calculate optimal target position for enemy team
   * Uses power-based strategic decision making
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

    // Calculate power differential
    const power = this.calculatePowerRatio(soldiers);
    this.currentStrategy = this.selectStrategy(power);

    // Calculate distance to player
    const dx = playerCenter.x - enemyCenter.x;
    const dy = playerCenter.y - enemyCenter.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angleToPlayer = Math.atan2(dy, dx);

    let targetX: number;
    let targetY: number;

    // Execute strategy-specific tactics
    let targetPos: Position;
    switch (this.currentStrategy) {
      case AIStrategy.OVERWHELMING:
        // 2x+ advantage: Aggressive surround and crush
        targetPos = this.executeOverwhelmingStrategy(
          playerCenter,
          enemyCenter,
          dist,
          angleToPlayer,
          p,
        );
        targetX = targetPos.x;
        targetY = targetPos.y;
        break;

      case AIStrategy.STRONG:
        // 1.3x+ advantage: Confident flanking and encirclement
        targetPos = this.executeStrongStrategy(
          playerCenter,
          enemyCenter,
          dist,
          angleToPlayer,
          p,
        );
        targetX = targetPos.x;
        targetY = targetPos.y;
        break;

      case AIStrategy.EVEN:
        // Even match: Tactical positioning and calculated aggression
        targetPos = this.executeEvenStrategy(
          playerCenter,
          enemyCenter,
          dist,
          angleToPlayer,
          p,
        );
        targetX = targetPos.x;
        targetY = targetPos.y;
        break;

      case AIStrategy.WEAK:
        // 0.4x-0.7x: Kiting and hit-and-run tactics
        targetPos = this.executeWeakStrategy(
          playerCenter,
          enemyCenter,
          dist,
          angleToPlayer,
          p,
        );
        targetX = targetPos.x;
        targetY = targetPos.y;
        break;

      case AIStrategy.DESPERATE:
        // <0.4x: Full retreat with evasive maneuvers
        targetPos = this.executeDesperateStrategy(
          playerCenter,
          enemyCenter,
          angleToPlayer,
          p,
        );
        targetX = targetPos.x;
        targetY = targetPos.y;
        break;
    }

    // Apply smoothing based on strategy (desperate = more erratic)
    const smoothing = this.currentStrategy === AIStrategy.DESPERATE ? 0.5 : 0.3;
    enemyTeam.targetX =
      enemyTeam.targetX * (1 - smoothing) + targetX * smoothing;
    enemyTeam.targetY =
      enemyTeam.targetY * (1 - smoothing) + targetY * smoothing;
  };

  /**
   * OVERWHELMING: Surround and crush with superior numbers
   */
  private executeOverwhelmingStrategy = (
    playerCenter: Position,
    enemyCenter: Position,
    dist: number,
    angleToPlayer: number,
    p: P5,
  ): Position => {
    // Divide forces to surround from all sides
    const surroundAngle = angleToPlayer + p.sin(p.frameCount * 0.05) * Math.PI;
    const surroundDist = Math.max(30, dist - 80); // Close in aggressively

    return {
      x: playerCenter.x + Math.cos(surroundAngle) * surroundDist,
      y: playerCenter.y + Math.sin(surroundAngle) * surroundDist,
    };
  };

  /**
   * STRONG: Confident flanking and tactical encirclement
   */
  private executeStrongStrategy = (
    playerCenter: Position,
    enemyCenter: Position,
    dist: number,
    angleToPlayer: number,
    p: P5,
  ): Position => {
    if (dist > 150) {
      // Far: Advance with flanking
      const flankDir = Math.sin(p.frameCount * 0.03) > 0 ? 1 : -1;
      const flankAngle = angleToPlayer + (Math.PI / 4) * flankDir;
      return {
        x: playerCenter.x + Math.cos(flankAngle) * 80,
        y: playerCenter.y + Math.sin(flankAngle) * 80,
      };
    } else {
      // Close: Aggressive press
      return {
        x: playerCenter.x + Math.cos(angleToPlayer) * 40,
        y: playerCenter.y + Math.sin(angleToPlayer) * 40,
      };
    }
  };

  /**
   * EVEN: Tactical positioning with calculated aggression
   */
  private executeEvenStrategy = (
    playerCenter: Position,
    enemyCenter: Position,
    dist: number,
    angleToPlayer: number,
    p: P5,
  ): Position => {
    if (dist > 200) {
      // Far: Cautious advance
      return {
        x: enemyCenter.x + Math.cos(angleToPlayer) * 100,
        y: enemyCenter.y + Math.sin(angleToPlayer) * 100,
      };
    } else if (dist > 100) {
      // Medium: Dynamic flanking
      const flankDir = Math.sin(p.frameCount * 0.04) > 0 ? 1 : -1;
      const flankAngle = angleToPlayer + (Math.PI / 3) * flankDir;
      return {
        x: playerCenter.x + Math.cos(flankAngle) * 70,
        y: playerCenter.y + Math.sin(flankAngle) * 70,
      };
    } else {
      // Close: Controlled engagement
      const circleAngle = angleToPlayer + Math.sin(p.frameCount * 0.06) * 0.5;
      return {
        x: playerCenter.x + Math.cos(circleAngle) * 60,
        y: playerCenter.y + Math.sin(circleAngle) * 60,
      };
    }
  };

  /**
   * WEAK: Kiting and hit-and-run tactics
   */
  private executeWeakStrategy = (
    playerCenter: Position,
    enemyCenter: Position,
    dist: number,
    angleToPlayer: number,
    p: P5,
  ): Position => {
    if (dist < 120) {
      // Too close! Retreat while maintaining distance
      const retreatAngle = angleToPlayer + Math.PI; // Opposite direction
      return {
        x: enemyCenter.x + Math.cos(retreatAngle) * 80,
        y: enemyCenter.y + Math.sin(retreatAngle) * 80,
      };
    } else {
      // Maintain distance, poke from range
      const kiteAngle = angleToPlayer + Math.sin(p.frameCount * 0.08) * 1.2;
      return {
        x: playerCenter.x + Math.cos(kiteAngle) * 150,
        y: playerCenter.y + Math.sin(kiteAngle) * 150,
      };
    }
  };

  /**
   * DESPERATE: Full retreat with evasive maneuvers
   */
  private executeDesperateStrategy = (
    playerCenter: Position,
    enemyCenter: Position,
    angleToPlayer: number,
    p: P5,
  ): Position => {
    // Flee toward map corners away from player
    const retreatAngle =
      angleToPlayer + Math.PI + Math.sin(p.frameCount * 0.1) * 0.8;
    const retreatDist = 300;

    let targetX = enemyCenter.x + Math.cos(retreatAngle) * retreatDist;
    let targetY = enemyCenter.y + Math.sin(retreatAngle) * retreatDist;

    // Clamp to map bounds
    targetX = Math.max(100, Math.min(900, targetX));
    targetY = Math.max(100, Math.min(900, targetY));

    return { x: targetX, y: targetY };
  };

  /**
   * Calculate power ratio (enemy power / player power)
   * Considers both count and average level
   */
  private calculatePowerRatio = (soldiers: Soldier[]): number => {
    let playerCount = 0;
    let playerTotalLevel = 0;
    let enemyCount = 0;
    let enemyTotalLevel = 0;

    for (const soldier of soldiers) {
      if (!soldier.alive) continue;

      if (soldier.teamIndex === TeamId.RED) {
        playerCount++;
        playerTotalLevel += soldier.level;
      } else if (soldier.teamIndex === TeamId.BLUE) {
        enemyCount++;
        enemyTotalLevel += soldier.level;
      }
    }

    if (playerCount === 0) return 999; // Enemy won
    if (enemyCount === 0) return 0; // Player won

    // Calculate average levels
    const playerAvgLevel = playerTotalLevel / playerCount;
    const enemyAvgLevel = enemyTotalLevel / enemyCount;

    // Power = count * level modifier
    const playerPower = playerCount * (1 + playerAvgLevel * 0.1);
    const enemyPower = enemyCount * (1 + enemyAvgLevel * 0.1);

    return enemyPower / playerPower;
  };

  /**
   * Select strategy based on power ratio
   */
  private selectStrategy = (powerRatio: number): AIStrategy => {
    if (powerRatio >= 2.0) return AIStrategy.OVERWHELMING;
    if (powerRatio >= 1.3) return AIStrategy.STRONG;
    if (powerRatio >= 0.7) return AIStrategy.EVEN;
    if (powerRatio >= 0.4) return AIStrategy.WEAK;
    return AIStrategy.DESPERATE;
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
