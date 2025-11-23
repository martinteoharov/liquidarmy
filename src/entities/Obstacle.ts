/**
 * Obstacle Entities
 *
 * Static obstacles that provide cover and strategic positioning on the battlefield.
 * Includes simple rectangular obstacles and complex castle structures.
 *
 * Responsibilities:
 * - Collision detection with soldiers
 * - Provide closest point calculations for collision resolution
 * - Render obstacle graphics
 */

import type { P5, P5Image, P5Graphics, P5Color } from '../p5-types';
import type { Soldier } from './Soldier';
import type { Position, Rectangle, CollisionResult } from '../types';

/**
 * Simple rectangular obstacle
 */
export class Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  readonly isPolygon: boolean = false;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Check if a soldier collides with this obstacle
   */
  collidesWith = (soldier: Soldier, buffer: number = 0): CollisionResult => {
    const collides = (
      soldier.x + buffer > this.x &&
      soldier.x - buffer < this.x + this.width &&
      soldier.y + buffer > this.y &&
      soldier.y - buffer < this.y + this.height
    );

    return { collides };
  };

  /**
   * Get the closest point on the obstacle to a given position
   */
  getClosestPoint = (soldier: Soldier): Position => {
    const cx = Math.max(this.x, Math.min(soldier.x, this.x + this.width));
    const cy = Math.max(this.y, Math.min(soldier.y, this.y + this.height));
    return { x: cx, y: cy };
  };

  /**
   * Render the obstacle
   */
  draw = (mapScale: number, p: P5): void => {
    p.fill(60, 60, 70);
    p.stroke(80, 80, 90);
    p.strokeWeight(2);
    p.rect(this.x * mapScale, this.y * mapScale, this.width * mapScale, this.height * mapScale);
  };
}

/**
 * Complex castle obstacle composed of multiple rectangles
 */
export class CastleObstacle {
  x: number;
  y: number;
  size: number;
  readonly isPolygon: boolean = true;
  readonly rects: Rectangle[];

  constructor(x: number, y: number, size: number) {
    this.x = x;
    this.y = y;
    this.size = size;

    // Create castle shape from multiple rectangles
    this.rects = [
      // Main keep (center)
      { x: x - size * 0.3, y: y - size * 0.4, w: size * 0.6, h: size * 0.8 },
      // Left tower
      { x: x - size * 0.6, y: y - size * 0.3, w: size * 0.35, h: size * 0.6 },
      // Right tower
      { x: x + size * 0.25, y: y - size * 0.3, w: size * 0.35, h: size * 0.6 },
      // Base wall (left)
      { x: x - size * 0.6, y: y + size * 0.2, w: size * 0.35, h: size * 0.2 },
      // Base wall (right)
      { x: x + size * 0.25, y: y + size * 0.2, w: size * 0.35, h: size * 0.2 },
      // Connecting wall
      { x: x - size * 0.25, y: y + size * 0.25, w: size * 0.5, h: size * 0.15 }
    ];
  }

  /**
   * Check if a soldier collides with any part of the castle
   */
  collidesWith = (soldier: Soldier, buffer: number = 0): CollisionResult => {
    for (const rect of this.rects) {
      const closestX = Math.max(rect.x, Math.min(soldier.x, rect.x + rect.w));
      const closestY = Math.max(rect.y, Math.min(soldier.y, rect.y + rect.h));

      const dx = soldier.x - closestX;
      const dy = soldier.y - closestY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < soldier.size + buffer) {
        return { collides: true, closestX, closestY, distance };
      }
    }
    return { collides: false };
  };

  /**
   * Get the closest point on the castle to a given position
   */
  getClosestPoint = (soldier: Soldier): Position => {
    let closestDist = Infinity;
    let closestPoint: Position = { x: soldier.x, y: soldier.y };

    for (const rect of this.rects) {
      const cx = Math.max(rect.x, Math.min(soldier.x, rect.x + rect.w));
      const cy = Math.max(rect.y, Math.min(soldier.y, rect.y + rect.h));
      const dx = soldier.x - cx;
      const dy = soldier.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < closestDist) {
        closestDist = dist;
        closestPoint = { x: cx, y: cy };
      }
    }

    return closestPoint;
  };

  /**
   * Render the castle with all its parts
   */
  draw = (mapScale: number, p: P5): void => {
    // Draw all castle parts
    p.fill(70, 60, 50);
    p.stroke(90, 80, 70);
    p.strokeWeight(2);

    for (const castleRect of this.rects) {
      p.rect(
        castleRect.x * mapScale,
        castleRect.y * mapScale,
        castleRect.w * mapScale,
        castleRect.h * mapScale
      );
    }

    // Draw battlements on towers
    p.fill(80, 70, 60);
    p.noStroke();

    for (let i = 0; i < 3; i++) {
      // Left tower battlements
      const bx1 = (this.x - this.size * 0.5 + i * this.size * 0.15) * mapScale;
      const by1 = (this.y - this.size * 0.4) * mapScale;
      p.rect(bx1, by1, this.size * 0.08 * mapScale, this.size * 0.08 * mapScale);

      // Right tower battlements
      const bx2 = (this.x + this.size * 0.3 + i * this.size * 0.15) * mapScale;
      p.rect(bx2, by1, this.size * 0.08 * mapScale, this.size * 0.08 * mapScale);
    }
  };
}
