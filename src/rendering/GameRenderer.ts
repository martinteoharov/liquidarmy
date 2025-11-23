/**
 * Game Renderer
 *
 * Handles all rendering for the main gameplay view.
 * Scales the 1000x1000 game map to fit the current canvas size.
 *
 * Responsibilities:
 * - Calculate appropriate map scale for current canvas
 * - Render game background
 * - Render all obstacles
 * - Render all soldiers with proper z-ordering
 * - Render all combat effects
 * - Render player cursor indicator
 */

import type { P5, P5Image, P5Graphics, P5Color } from "../p5-types";
import type { Soldier } from "../entities/Soldier";
import type { Obstacle, CastleObstacle } from "../entities/Obstacle";
import type { Team } from "../types";
import type { CombatSystem } from "../systems/Combat";
import { PHYSICS } from "../config";

export class GameRenderer {
  private backgroundImg: P5Image | null = null;
  mapScale: number = 1;
  offsetX: number = 0;
  offsetY: number = 0;

  /**
   * Set background image (loaded in preload)
   */
  setBackground = (img: P5Image): void => {
    this.backgroundImg = img;
  };

  /**
   * Calculate map scale and offset to center the map
   */
  updateMapScale = (p: P5): void => {
    // Calculate scale to fit map in canvas while maintaining aspect ratio
    this.mapScale = Math.min(
      p.width / PHYSICS.MAP_SIZE,
      p.height / PHYSICS.MAP_SIZE,
    );

    // Calculate offset to center the map
    const displayWidth = PHYSICS.MAP_SIZE * this.mapScale;
    const displayHeight = PHYSICS.MAP_SIZE * this.mapScale;
    this.offsetX = (p.width - displayWidth) / 2;
    this.offsetY = (p.height - displayHeight) / 2;
  };

  /**
   * Render the complete game scene
   */
  render = (
    soldiers: Soldier[],
    obstacles: Array<Obstacle | CastleObstacle>,
    teams: Team[],
    combatSystem: CombatSystem,
    soldierSprites: P5Graphics[],
    playerTeamIndex: number,
    p: P5,
  ): void => {
    this.updateMapScale(p);

    // Background
    p.background(30);
    if (this.backgroundImg) {
      p.image(this.backgroundImg, 0, 0, p.width, p.height);
    }

    // Semi-transparent overlay for battlefield atmosphere
    p.fill(20, 15, 10, 150);
    p.noStroke();
    p.rect(0, 0, p.width, p.height);

    // Apply translation to center the map
    p.push();
    p.translate(this.offsetX, this.offsetY);

    // Render obstacles
    for (const obstacle of obstacles) {
      obstacle.draw(this.mapScale, p);
    }

    // Render combat effects (blood splatters - bottom layer)
    combatSystem.draw(this.mapScale, p);

    // Render all alive soldiers
    for (const soldier of soldiers) {
      if (soldier.alive) {
        const sprite = soldierSprites[soldier.teamIndex];
        soldier.draw(sprite, this.mapScale, p);
      }
    }

    // Render cursor indicator for player
    this.drawCursorIndicator(teams[playerTeamIndex], p);

    p.pop();
  };

  /**
   * Draw cursor position indicator for player team
   * Draws at the actual target position (converted from mouse coords)
   */
  private drawCursorIndicator = (playerTeam: Team, p: P5): void => {
    if (!playerTeam.active) return;

    // Draw cursor at the scaled map coordinates where soldiers actually target
    const screenX = playerTeam.targetX * this.mapScale;
    const screenY = playerTeam.targetY * this.mapScale;

    p.push();
    p.noFill();
    p.stroke(playerTeam.color);
    p.strokeWeight(3);
    p.circle(screenX, screenY, 25 * this.mapScale);
    p.strokeWeight(2);
    p.circle(screenX, screenY, 15 * this.mapScale);
    p.pop();
  };
}
