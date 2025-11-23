/**
 * Soldier Entity
 *
 * Represents an individual soldier unit in the game.
 * Handles movement, combat, leveling, morale, and rendering.
 *
 * Responsibilities:
 * - Physics-based movement with liquid behavior
 * - Collision detection and obstacle avoidance
 * - Melee combat with enemies
 * - XP and leveling system
 * - Morale and fleeing behavior
 * - Sprite animation and rendering
 */

import type { P5, P5Image, P5Graphics, P5Color } from "../p5-types";
import { SOLDIER, PHYSICS, COMBAT, ANIMATION } from "../config";
import type { Team } from "../types";
import type { Obstacle, CastleObstacle } from "./Obstacle";
import type { SpatialGrid } from "../utils/SpatialGrid";
import { DeathAnimation, BloodSplatter, LevelUpEffect } from "./Effects";

export class Soldier {
  // Position and movement
  x: number;
  y: number;
  vx: number = 0;
  vy: number = 0;

  // Team and identity
  teamIndex: number;
  teamColor: string;
  size: number = SOLDIER.size;

  // Combat stats
  maxSpeed: number = SOLDIER.maxSpeed;
  health: number = SOLDIER.health;
  maxHealth: number = SOLDIER.health;
  baseDamage: number = SOLDIER.damage;
  damage: number = SOLDIER.damage;
  attackRange: number = SOLDIER.attackRange;
  attackCooldown: number = 0;
  hitCooldown: number = 0;

  // Progression
  xp: number = 0;
  level: number = 1;
  kills: number = 0;

  // State
  isAlive: boolean = true;
  alive: boolean = true; // Keep for backward compatibility
  morale: number = 100;
  isFleeing: boolean = false;

  // Animation
  currentFrame: number;
  frameCounter: number = 0;
  frameSpeed: number = ANIMATION.SOLDIER_FRAME_SPEED;
  rotation: number = 0;

  constructor(
    p: P5,
    x: number,
    y: number,
    teamIndex: number,
    teamColor: string,
  ) {
    this.x = x + p.random(-20, 20); // Small random offset
    this.y = y + p.random(-20, 20);
    this.teamIndex = teamIndex;
    this.teamColor = teamColor;
    this.currentFrame = Math.floor(p.random(4));
  }

  /**
   * Gain experience points and potentially level up
   */
  gainXP = (amount: number): void => {
    this.xp += amount;
    const xpNeeded = this.level * COMBAT.XP_PER_LEVEL;

    if (this.xp >= xpNeeded) {
      this.levelUp();
    }
  };

  /**
   * Level up and increase stats
   */
  levelUp = (): LevelUpEffect => {
    this.level++;
    this.xp = 0;

    // Stat increases
    this.maxHealth = Math.floor(
      this.maxHealth * COMBAT.LEVEL_HEALTH_MULTIPLIER,
    );
    this.health = this.maxHealth; // Full heal
    this.damage = Math.floor(this.damage * COMBAT.LEVEL_DAMAGE_MULTIPLIER);
    this.maxSpeed *= COMBAT.LEVEL_SPEED_MULTIPLIER;

    // Return visual effect
    return new LevelUpEffect(this.x, this.y);
  };

  /**
   * Main update loop - handles movement, physics, and state
   */
  update = (
    teams: Team[],
    obstacles: Array<Obstacle | CastleObstacle>,
    spatialGrid: SpatialGrid,
    p: P5,
    rewardSystem?: any,
  ): void => {
    // Skip if dead
    if (!this.alive || this.health <= 0) {
      this.alive = false;
      return;
    }

    // Decrease cooldowns
    if (this.hitCooldown > 0) this.hitCooldown--;
    if (this.attackCooldown > 0) this.attackCooldown--;

    // Escape if stuck in obstacle
    if (this.isInsideObstacle(obstacles)) {
      this.escapeFromObstacle(obstacles, p);
      this.vx = 0;
      this.vy = 0;
      return;
    }

    // Determine target based on morale
    let targetX = teams[this.teamIndex].targetX;
    let targetY = teams[this.teamIndex].targetY;

    if (this.isFleeing) {
      // Find nearest enemy and run away
      const nearestEnemy = this.findNearestEnemy(spatialGrid);
      if (nearestEnemy) {
        targetX = this.x + (this.x - nearestEnemy.x) * 2;
        targetY = this.y + (this.y - nearestEnemy.y) * 2;
      }
    }

    // Move toward target
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      const force = teams[this.teamIndex].isPlayer
        ? PHYSICS.CURSOR_ATTRACTION
        : PHYSICS.CURSOR_ATTRACTION * 1.1; // Enemies are slightly more aggressive
      const actualForce = this.isFleeing ? force * 1.5 : force;
      this.vx += (dx / distance) * actualForce;
      this.vy += (dy / distance) * actualForce;
    }

    // Apply friction
    this.vx *= PHYSICS.FRICTION;
    this.vy *= PHYSICS.FRICTION;

    // Stop very small movements to reduce jitter when clustered
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (
      speed < PHYSICS.VELOCITY_STOP_THRESHOLD &&
      distance < PHYSICS.TARGET_STOP_DISTANCE
    ) {
      this.vx *= 0.5;
      this.vy *= 0.5;

      // If velocity is extremely small, just stop completely
      if (speed < PHYSICS.VELOCITY_STOP_THRESHOLD * 0.3) {
        this.vx = 0;
        this.vy = 0;
        return;
      }
    }

    // Apply extra damping when near target to reduce jitter
    if (distance < PHYSICS.TARGET_STOP_DISTANCE * 2) {
      this.vx *= PHYSICS.NEAR_TARGET_DAMPING;
      this.vy *= PHYSICS.NEAR_TARGET_DAMPING;
    }

    // Apply speed multiplier from rewards (player team only)
    let effectiveMaxSpeed = this.maxSpeed;
    if (this.teamIndex === 0 && rewardSystem) {
      effectiveMaxSpeed *= rewardSystem.getSpeedMultiplier();
    }

    // Limit speed
    if (speed > effectiveMaxSpeed) {
      this.vx = (this.vx / speed) * effectiveMaxSpeed;
      this.vy = (this.vy / speed) * effectiveMaxSpeed;
    }

    // Store old position for collision resolution
    const oldX = this.x;
    const oldY = this.y;

    // Apply velocity
    this.x += this.vx;
    this.y += this.vy;

    // Check obstacle collision
    this.checkObstacleCollision(oldX, oldY, obstacles);

    // Keep within map bounds
    this.constrainToMap();

    // Update animation
    this.updateAnimation();

    // Update rotation based on velocity
    if (speed > 0.1) {
      this.rotation = Math.atan2(this.vy, this.vx);
    }
  };

  /**
   * Update walk animation based on movement
   */
  updateAnimation = (): void => {
    const speedSq = this.vx * this.vx + this.vy * this.vy;

    if (speedSq > 0.01) {
      this.frameCounter++;
      if (this.frameCounter >= this.frameSpeed) {
        this.currentFrame = (this.currentFrame + 1) % 4;
        this.frameCounter = 0;
      }
    } else {
      this.currentFrame = 0;
      this.frameCounter = 0;
    }
  };

  /**
   * Liquid-like separation from nearby soldiers
   */
  separate = (spatialGrid: SpatialGrid): void => {
    const nearby = spatialGrid.getNearby(this, SOLDIER.spacing * 4);
    const minDistSq = this.size * 2 * (this.size * 2);

    // Check if this unit is essentially stopped
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    const isStopped = speed < PHYSICS.VELOCITY_STOP_THRESHOLD * 0.5;

    for (const other of nearby) {
      if (other === this || !other.alive) continue;

      const dx = this.x - other.x;
      const dy = this.y - other.y;
      const distSq = dx * dx + dy * dy;

      // Skip separation if soldiers are very close (reduces jitter)
      if (distSq < PHYSICS.MIN_SEPARATION_DISTANCE_SQ) continue;

      const isEnemy = other.teamIndex !== this.teamIndex;

      if (isEnemy) {
        // Hard boundary for enemies - prevent penetration
        if (distSq < minDistSq && distSq > 1) {
          const distance = Math.sqrt(distSq);
          const minDistance = this.size * 2;
          const overlap = minDistance - distance;

          if (overlap > 0 && !isStopped) {
            const invDist = 1 / distance;

            // Gentle position correction to prevent overlap
            const pushDistance = overlap * 0.12;
            this.x += dx * invDist * pushDistance;
            this.y += dy * invDist * pushDistance;

            // Gentle repulsive force
            const force = 0.25;
            this.vx += dx * invDist * force;
            this.vy += dy * invDist * force;
          }
        }
      } else {
        // Ally separation - very gentle to prevent jitter
        if (distSq < minDistSq && distSq > 1) {
          const distance = Math.sqrt(distSq);
          const minDistance = this.size * 2;
          const overlap = minDistance - distance;

          if (overlap > 0 && !isStopped) {
            const invDist = 1 / distance;

            // Minimal position correction for allies
            const pushDistance = overlap * 0.06;
            this.x += dx * invDist * pushDistance;
            this.y += dy * invDist * pushDistance;

            // Very gentle force
            const force = 0.1;
            this.vx += dx * invDist * force;
            this.vy += dy * invDist * force;
          }
        } else {
          // Medium range soft separation (only apply if moving)
          if (!isStopped) {
            const mediumRangeSq = SOLDIER.spacing * 2 * (SOLDIER.spacing * 2);
            if (distSq < mediumRangeSq && distSq > minDistSq) {
              const distance = Math.sqrt(distSq);
              const force =
                (SOLDIER.spacing * 2 - distance) / (SOLDIER.spacing * 2);
              const actualForce = force * PHYSICS.SEPARATION_FORCE * 0.15;
              const invDist = 1 / distance;
              this.vx += dx * invDist * actualForce;
              this.vy += dy * invDist * actualForce;
            }
          }
        }
      }
    }
  };

  /**
   * Check for enemies in range and attack
   */
  checkEnemyCollision = (
    spatialGrid: SpatialGrid,
    teams: Team[],
    bloodSplatters: BloodSplatter[],
    deathAnimations: DeathAnimation[],
    playPopSound: () => void,
    p: P5,
    rewardSystem?: any,
  ): void => {
    if (this.attackCooldown > 0) return;

    const nearest = this.findNearestEnemy(spatialGrid);

    if (nearest) {
      const dx = this.x - nearest.x;
      const dy = this.y - nearest.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Melee attack if very close
      if (distance < this.size * 2) {
        // Apply reward modifiers for player soldiers
        let baseCritChance = COMBAT.CRIT_CHANCE;
        let damageMultiplier = 1.0;
        let damageReduction = 0;

        if (this.teamIndex === 0 && rewardSystem) {
          baseCritChance += rewardSystem.getCritChanceBonus();
          damageMultiplier = rewardSystem.getDamageMultiplier();
        }

        if (nearest.teamIndex === 0 && rewardSystem) {
          damageReduction = rewardSystem.getDamageReduction();
        }

        const isCrit = p.random() < baseCritChance;
        let finalDamage = isCrit
          ? this.damage * COMBAT.CRIT_MULTIPLIER
          : this.damage;

        // Apply damage multiplier
        finalDamage *= damageMultiplier;

        // Apply damage reduction to target
        finalDamage *= 1 - damageReduction;

        // Check if target is invincible champion
        if (rewardSystem && rewardSystem.isChampionInvincible(nearest)) {
          finalDamage = 0; // Champion takes no damage
        }

        nearest.health -= finalDamage;
        nearest.hitCooldown = 10;
        this.attackCooldown = SOLDIER.attackCooldown;

        // Blood splatter (unless champion is invincible)
        if (finalDamage > 0) {
          bloodSplatters.push(
            new BloodSplatter(
              nearest.x,
              nearest.y,
              teams[nearest.teamIndex].color,
            ),
          );
        }

        // Check if killed
        if (nearest.health <= 0) {
          nearest.alive = false;
          this.kills++;
          this.gainXP(SOLDIER.xpPerKill);

          deathAnimations.push(
            new DeathAnimation(
              nearest.x,
              nearest.y,
              teams[nearest.teamIndex].color,
            ),
          );
          playPopSound();
        }
      }
    }
  };

  /**
   * Update morale based on nearby allies vs enemies
   */
  updateMorale = (spatialGrid: SpatialGrid): void => {
    let nearbyAllies = 0;
    let nearbyEnemies = 0;
    const nearby = spatialGrid.getNearby(this, 100);

    for (const other of nearby) {
      if (!other.alive) continue;
      if (other.teamIndex === this.teamIndex) {
        nearbyAllies++;
      } else {
        nearbyEnemies++;
      }
    }

    // Update morale
    if (nearbyEnemies > nearbyAllies * 2 && nearbyEnemies > 5) {
      this.morale -= COMBAT.MORALE_DECREASE_RATE;
      if (this.morale < COMBAT.FLEE_MORALE_THRESHOLD) {
        this.isFleeing = true;
      }
    } else {
      this.morale = Math.min(100, this.morale + COMBAT.MORALE_INCREASE_RATE);
      if (this.morale > COMBAT.RECOVER_MORALE_THRESHOLD) {
        this.isFleeing = false;
      }
    }
  };

  /**
   * Render the soldier sprite
   */
  draw = (sprite: P5Graphics, mapScale: number, p: P5): void => {
    if (!this.alive) return;

    const screenX = this.x * mapScale;
    const screenY = this.y * mapScale;

    // Calculate sprite coordinates
    const sx = this.currentFrame * SOLDIER.spriteSize;
    const sy = 0;
    const sw = SOLDIER.spriteSize;
    const sh = SOLDIER.spriteSize;
    const drawSize = this.size * 2 * mapScale;

    p.push();
    p.translate(screenX, screenY);
    p.rotate(this.rotation);
    p.imageMode(p.CENTER);
    p.image(sprite, 0, 0, drawSize, drawSize, sx, sy, sw, sh);
    p.pop();

    // Draw level stars for veterans
    if (this.level >= 3) {
      this.drawLevelStars(screenX, screenY, mapScale, p);
    }

    // Draw fleeing indicator
    if (this.isFleeing) {
      this.drawFleeingIndicator(screenX, screenY, mapScale, p);
    }

    // Draw XP bar
    if (this.xp > 0 && this.level < 10) {
      this.drawXPBar(screenX, screenY, mapScale, p);
    }
  };

  /**
   * Helper methods
   */

  private findNearestEnemy = (spatialGrid: SpatialGrid): Soldier | null => {
    let nearest: Soldier | null = null;
    let nearestDist = Infinity;
    const nearby = spatialGrid.getNearby(this, this.attackRange);

    for (const other of nearby) {
      if (other === this || !other.alive || other.teamIndex === this.teamIndex)
        continue;

      const dx = this.x - other.x;
      const dy = this.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.attackRange && distance < nearestDist) {
        nearest = other;
        nearestDist = distance;
      }
    }

    return nearest;
  };

  private isInsideObstacle = (
    obstacles: Array<Obstacle | CastleObstacle>,
  ): boolean => {
    for (const obstacle of obstacles) {
      if (this.collidesWithObstacle(obstacle)) {
        return true;
      }
    }
    return false;
  };

  private escapeFromObstacle = (
    obstacles: Array<Obstacle | CastleObstacle>,
    p: P5,
  ): void => {
    let bestDistance = Infinity;
    let bestX = this.x;
    let bestY = this.y;

    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
      for (let radius = this.size + 3; radius < 50; radius += 3) {
        const testX = this.x + Math.cos(angle) * radius;
        const testY = this.y + Math.sin(angle) * radius;

        if (
          testX < this.size ||
          testX > PHYSICS.MAP_SIZE - this.size ||
          testY < this.size ||
          testY > PHYSICS.MAP_SIZE - this.size
        ) {
          continue;
        }

        const tempX = this.x;
        const tempY = this.y;
        this.x = testX;
        this.y = testY;

        if (!this.isInsideObstacle(obstacles)) {
          if (radius < bestDistance) {
            bestDistance = radius;
            bestX = testX;
            bestY = testY;
          }
          this.x = tempX;
          this.y = tempY;
          break;
        }

        this.x = tempX;
        this.y = tempY;
      }

      if (bestDistance < 15) break;
    }

    const moveSpeed = 0.3;
    this.x = p.lerp(this.x, bestX, moveSpeed);
    this.y = p.lerp(this.y, bestY, moveSpeed);
  };

  private checkObstacleCollision = (
    oldX: number,
    oldY: number,
    obstacles: Array<Obstacle | CastleObstacle>,
  ): void => {
    for (const obstacle of obstacles) {
      if (this.collidesWithObstacle(obstacle)) {
        const closestPoint = obstacle.getClosestPoint(this);

        if (closestPoint) {
          const dx = this.x - closestPoint.x;
          const dy = this.y - closestPoint.y;
          const distSq = dx * dx + dy * dy;

          if (distSq > 1) {
            const dist = Math.sqrt(distSq);
            const pushDistance = this.size + 2;
            const invDist = 1 / dist;

            // Smoothly push away from obstacle
            const targetX = closestPoint.x + dx * invDist * pushDistance;
            const targetY = closestPoint.y + dy * invDist * pushDistance;

            // Lerp to target position to reduce jitter
            this.x = this.x * 0.7 + targetX * 0.3;
            this.y = this.y * 0.7 + targetY * 0.3;

            // Slide along obstacle surface instead of bouncing
            const dotProduct = (this.vx * dx + this.vy * dy) * invDist;
            if (dotProduct < 0) {
              // Remove velocity component going into obstacle
              this.vx -= dx * invDist * dotProduct * 1.1;
              this.vy -= dy * invDist * dotProduct * 1.1;
            }

            // Less aggressive damping
            this.vx *= 0.85;
            this.vy *= 0.85;
          } else {
            // Very close to obstacle - just stop
            this.x = oldX;
            this.y = oldY;
            this.vx = 0;
            this.vy = 0;
          }
        }
        return;
      }
    }
  };

  private collidesWithObstacle = (
    obstacle: Obstacle | CastleObstacle,
  ): boolean => {
    const buffer = this.size + 1;
    return obstacle.collidesWith(this, buffer).collides;
  };

  private constrainToMap = (): void => {
    if (this.x < this.size) {
      this.x = this.size;
      this.vx *= -0.5;
    }
    if (this.x > PHYSICS.MAP_SIZE - this.size) {
      this.x = PHYSICS.MAP_SIZE - this.size;
      this.vx *= -0.5;
    }
    if (this.y < this.size) {
      this.y = this.size;
      this.vy *= -0.5;
    }
    if (this.y > PHYSICS.MAP_SIZE - this.size) {
      this.y = PHYSICS.MAP_SIZE - this.size;
      this.vy *= -0.5;
    }
  };

  private drawLevelStars = (
    screenX: number,
    screenY: number,
    mapScale: number,
    p: P5,
  ): void => {
    p.push();
    p.translate(screenX, screenY);

    const starCount = Math.min(this.level - 2, 5);
    const starSize = 4 * mapScale;
    const yOffset = -this.size * mapScale - 8 * mapScale;

    for (let i = 0; i < starCount; i++) {
      const xOffset = (i - (starCount - 1) / 2) * 6 * mapScale;
      p.fill(255, 215, 0);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(starSize * 2);
      p.text("★", xOffset, yOffset);
    }

    p.pop();
  };

  private drawFleeingIndicator = (
    screenX: number,
    screenY: number,
    mapScale: number,
    p: P5,
  ): void => {
    p.push();
    p.translate(screenX, screenY);
    p.fill(255, 50, 50);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(8 * mapScale);
    p.text("⚑", 0, -this.size * mapScale - 6 * mapScale);
    p.pop();
  };

  private drawXPBar = (
    screenX: number,
    screenY: number,
    mapScale: number,
    p: P5,
  ): void => {
    p.push();
    p.translate(screenX, screenY);

    const barWidth = this.size * 2 * mapScale;
    const barHeight = 2 * mapScale;
    const yOffset = this.size * mapScale + 4 * mapScale;
    const xpNeeded = this.level * COMBAT.XP_PER_LEVEL;
    const xpProgress = this.xp / xpNeeded;

    // Background
    p.fill(40, 40, 40, 150);
    p.noStroke();
    p.rect(-barWidth / 2, yOffset, barWidth, barHeight);

    // Progress
    p.fill(255, 215, 0, 200);
    p.rect(-barWidth / 2, yOffset, barWidth * xpProgress, barHeight);

    p.pop();
  };
}
