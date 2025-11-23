/**
 * Reward Entity
 *
 * Represents a reward pickup that spawns after completing a wave.
 * Players collect rewards by moving soldiers near them.
 *
 * Responsibilities:
 * - Render reward pickup on map
 * - Detect collection by player soldiers
 * - Visual effects (glow, pulse animation)
 */

import type { P5 } from "../p5-types";
import { RewardType } from "../enums";
import { REWARDS, REWARD_CONFIGS, PHYSICS } from "../config";
import type { Soldier } from "./Soldier";

export class Reward {
  x: number;
  y: number;
  type: RewardType;
  collected: boolean = false;
  pulseAnimation: number = 0;

  constructor(x: number, y: number, type: RewardType) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  /**
   * Update reward animation
   */
  update = (): void => {
    this.pulseAnimation += 0.1;
  };

  /**
   * Check if any player soldier is close enough to collect
   */
  checkCollection = (soldiers: Soldier[]): boolean => {
    if (this.collected) return false;

    for (const soldier of soldiers) {
      if (!soldier.alive || soldier.teamIndex !== 0) continue;

      const dx = soldier.x - this.x;
      const dy = soldier.y - this.y;
      const distSq = dx * dx + dy * dy;
      const collectionRadiusSq = REWARDS.COLLECTION_RADIUS * REWARDS.COLLECTION_RADIUS;

      if (distSq < collectionRadiusSq) {
        this.collected = true;
        return true;
      }
    }

    return false;
  };

  /**
   * Render the reward pickup
   */
  draw = (mapScale: number, p: P5): void => {
    if (this.collected) return;

    const config = REWARD_CONFIGS[this.type];
    const screenX = this.x * mapScale;
    const screenY = this.y * mapScale;
    const size = REWARDS.PICKUP_SIZE * mapScale;

    // Pulse effect
    const pulse = Math.sin(this.pulseAnimation) * 0.2 + 1;
    const glowSize = size * pulse;

    p.push();
    p.translate(screenX, screenY);

    // Outer glow based on rarity
    p.noStroke();
    if (config.rarity === "legendary") {
      p.fill(255, 215, 0, 100);
      p.circle(0, 0, glowSize * 2);
    } else if (config.rarity === "rare") {
      p.fill(147, 51, 234, 100);
      p.circle(0, 0, glowSize * 1.8);
    } else {
      p.fill(100, 200, 255, 80);
      p.circle(0, 0, glowSize * 1.5);
    }

    // Main pickup circle
    p.fill(config.color);
    p.stroke(255, 255, 255);
    p.strokeWeight(3 * mapScale);
    p.circle(0, 0, size);

    // Icon
    p.noStroke();
    p.fill(255, 255, 255);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(size * 0.6);
    p.text(config.icon, 0, 0);

    // Rotating particles for legendary rewards
    if (config.rarity === "legendary") {
      p.noStroke();
      p.fill(255, 215, 0);
      for (let i = 0; i < 6; i++) {
        const angle = this.pulseAnimation + (i / 6) * p.TWO_PI;
        const radius = size * 0.8;
        const px = p.cos(angle) * radius;
        const py = p.sin(angle) * radius;
        p.circle(px, py, 4 * mapScale);
      }
    }

    p.pop();
  };
}
