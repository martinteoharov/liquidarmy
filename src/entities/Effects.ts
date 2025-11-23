/**
 * Visual Effects
 *
 * Particle effects and animations for combat feedback and visual polish.
 * All effects are temporary and self-managing (update their own lifespan).
 *
 * Responsibilities:
 * - Blood splatters when soldiers are hit
 * - Death animations when soldiers are killed
 * - Level-up visual feedback
 * - Menu background particles for animated menus
 */

import type { P5, P5Image, P5Graphics, P5Color } from '../p5-types';
import { ANIMATION } from '../config';

/**
 * Blood splatter effect when soldiers take damage
 */
export class BloodSplatter {
  x: number;
  y: number;
  color: string;
  alpha: number = 200;
  size: number;
  alive: boolean = true;
  lifespan: number = ANIMATION.BLOOD_SPLATTER_LIFESPAN;

  constructor(x: number, y: number, teamColor: string) {
    this.x = x;
    this.y = y;
    this.color = teamColor;
    this.size = Math.random() * 7 + 5; // 5-12
  }

  update = (): void => {
    this.lifespan--;
    this.alpha -= 2;

    if (this.lifespan <= 0 || this.alpha <= 0) {
      this.alive = false;
    }
  };

  draw = (mapScale: number, p: P5): void => {
    if (!this.alive) return;

    p.push();
    const teamColorObj = p.color(this.color);
    const r = p.red(teamColorObj);
    p.fill(r * 0.5, 0, 0, this.alpha);
    p.noStroke();

    // Splatter shape (5 random circles)
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const radius = this.size * (Math.random() * 0.5 + 0.5);
      p.ellipse(
        (this.x + Math.cos(angle) * radius) * mapScale,
        (this.y + Math.sin(angle) * radius) * mapScale,
        this.size * 0.5 * mapScale
      );
    }

    p.pop();
  };
}

/**
 * Expanding ring animation when soldiers die
 */
export class DeathAnimation {
  x: number;
  y: number;
  color: string;
  radius: number = 0;
  maxRadius: number = 15;
  alpha: number = 255;
  alive: boolean = true;

  constructor(x: number, y: number, teamColor: string) {
    this.x = x;
    this.y = y;
    this.color = teamColor;
  }

  update = (): void => {
    this.radius += 1.5;
    this.alpha -= 15;

    if (this.alpha <= 0 || this.radius >= this.maxRadius) {
      this.alive = false;
    }
  };

  draw = (mapScale: number, p: P5): void => {
    if (!this.alive) return;

    const teamColorObj = p.color(this.color);
    const r = p.red(teamColorObj);
    const g = p.green(teamColorObj);
    const b = p.blue(teamColorObj);

    // Outer ring
    p.noFill();
    p.stroke(r, g, b, this.alpha);
    p.strokeWeight(2);
    p.circle(this.x * mapScale, this.y * mapScale, this.radius * 2 * mapScale);

    // Inner glow
    p.stroke(255, 255, 255, this.alpha * 0.5);
    p.strokeWeight(1);
    p.circle(this.x * mapScale, this.y * mapScale, this.radius * 1.5 * mapScale);
  };
}

/**
 * Gold ring effect when soldiers level up
 */
export class LevelUpEffect {
  x: number;
  y: number;
  radius: number = 0;
  maxRadius: number = 25;
  alpha: number = 255;
  alive: boolean = true;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update = (): void => {
    this.radius += 2;
    this.alpha -= 10;

    if (this.alpha <= 0 || this.radius >= this.maxRadius) {
      this.alive = false;
    }
  };

  draw = (mapScale: number, p: P5): void => {
    if (!this.alive) return;

    p.push();

    // Gold ring
    p.noFill();
    p.stroke(255, 215, 0, this.alpha);
    p.strokeWeight(3);
    p.circle(this.x * mapScale, this.y * mapScale, this.radius * 2 * mapScale);

    // Inner star particles (8 stars)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const r = this.radius * 0.7;
      p.fill(255, 255, 0, this.alpha);
      p.noStroke();
      p.ellipse(
        (this.x + Math.cos(angle) * r) * mapScale,
        (this.y + Math.sin(angle) * r) * mapScale,
        3 * mapScale
      );
    }

    p.pop();
  };
}

/**
 * Animated background particles for menu screens
 */
export class MenuParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  targetX: number;
  targetY: number;

  constructor(x: number, y: number, teamColor: string, p: P5) {
    this.x = x;
    this.y = y;
    this.vx = p.random(-0.5, 0.5);
    this.vy = p.random(-0.5, 0.5);
    this.color = teamColor;
    this.size = p.random(2, 4);
    this.targetX = x;
    this.targetY = y;
  }

  update = (width: number, height: number, p: P5): void => {
    // Random wandering
    this.targetX += p.random(-2, 2);
    this.targetY += p.random(-2, 2);

    // Keep within screen bounds
    this.targetX = p.constrain(this.targetX, 0, width);
    this.targetY = p.constrain(this.targetY, 0, height);

    // Move towards target
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    this.vx += dx * 0.001;
    this.vy += dy * 0.001;

    // Apply velocity
    this.x += this.vx;
    this.y += this.vy;

    // Friction
    this.vx *= 0.95;
    this.vy *= 0.95;

    // Wrap around screen
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  };

  draw = (p: P5): void => {
    p.fill(this.color);
    p.noStroke();
    p.circle(this.x, this.y, this.size * 2);
  };

  /**
   * Check for nearby enemy particles and push away (for menu fighting effect)
   */
  checkNearby = (others: MenuParticle[]): void => {
    for (const other of others) {
      if (other === this) continue;
      if (other.color === this.color) continue; // Same team

      const dx = other.x - this.x;
      const dy = other.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 30 && dist > 0) {
        // Push away from enemies
        const angle = Math.atan2(-dy, -dx);
        this.vx += Math.cos(angle) * 0.1;
        this.vy += Math.sin(angle) * 0.1;
      }
    }
  };
}
