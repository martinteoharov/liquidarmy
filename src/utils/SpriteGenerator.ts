/**
 * Sprite Generator
 *
 * Generates soldier sprites programmatically using p5.js graphics buffers.
 * Creates sprite sheets with walk animations for each team color.
 *
 * Responsibilities:
 * - Generate soldier sprites for all teams
 * - Create walk animation frames (4 frames per soldier)
 * - Cache sprites for performance (generate once, use many times)
 *
 * Sprite details:
 * - Top-down view of medieval soldiers
 * - Walking animation with moving legs
 * - Team-colored armor and helmet
 * - Weapon (sword) visible
 */

import type { P5, P5Image, P5Graphics, P5Color } from '../p5-types';
import { SOLDIER, TEAM_COLORS, UI } from '../config';

/**
 * Generate all soldier sprites for all teams
 * Returns an array of sprite sheets (one per team)
 */
export const generateAllSoldierSprites = (p: P5): P5Graphics[] => {
  const sprites: P5Graphics[] = [];

  for (let teamIdx = 0; teamIdx < TEAM_COLORS.length; teamIdx++) {
    sprites.push(generateSoldierSpriteSheet(teamIdx, p));
  }

  return sprites;
};

/**
 * Generate a sprite sheet for a single team
 * Contains 4 frames of walk animation in a horizontal strip
 */
const generateSoldierSpriteSheet = (teamIdx: number, p: P5): P5Graphics => {
  const spriteSize = SOLDIER.spriteSize;
  const numFrames = UI.ANIMATION_FRAMES;

  // Create graphics buffer for sprite sheet
  const spriteSheet = p.createGraphics(spriteSize * numFrames, spriteSize);
  const teamColor = p.color(TEAM_COLORS[teamIdx].color);

  // Draw each animation frame
  for (let frame = 0; frame < numFrames; frame++) {
    const x = frame * spriteSize + spriteSize / 2;
    const y = spriteSize / 2;

    drawSoldierFrame(spriteSheet, x, y, frame, numFrames, teamColor, p);
  }

  return spriteSheet;
};

/**
 * Draw a single frame of soldier animation
 */
const drawSoldierFrame = (
  graphics: P5Graphics,
  x: number,
  y: number,
  frame: number,
  numFrames: number,
  teamColor: P5Color,
  p: P5
): void => {
  graphics.push();
  graphics.translate(x, y);

  // Walk phase (0 to 2π over all frames)
  const walkPhase = (frame / numFrames) * p.TWO_PI;

  // Legs/feet stepping animation (side-to-side from top view)
  const leftFootX = p.sin(walkPhase) * 2.5;
  const rightFootX = p.sin(walkPhase + p.PI) * 2.5;

  // Feet (darker ovals - visible from top)
  graphics.fill(p.red(teamColor) * 0.5, p.green(teamColor) * 0.5, p.blue(teamColor) * 0.5);
  graphics.noStroke();
  graphics.ellipse(-2 + leftFootX, 4, 2.5, 3.5);  // Left foot
  graphics.ellipse(2 + rightFootX, 4, 2.5, 3.5);  // Right foot

  // Legs (visible from top as trapezoid shape)
  graphics.fill(p.red(teamColor) * 0.7, p.green(teamColor) * 0.7, p.blue(teamColor) * 0.7);
  graphics.quad(
    -2.5, 0,              // Top left
    2.5, 0,               // Top right
    2 + rightFootX, 4,    // Bottom right
    -2 + leftFootX, 4     // Bottom left
  );

  // Main body/torso (rectangular from top)
  graphics.fill(teamColor);
  graphics.rect(-3, -4, 6, 6);

  // Shoulders/arms (darker rectangles on sides)
  graphics.fill(p.red(teamColor) * 0.8, p.green(teamColor) * 0.8, p.blue(teamColor) * 0.8);
  const armOffset = p.sin(walkPhase) * 0.8;
  graphics.rect(-4, -3 + armOffset, 1, 4);  // Left arm
  graphics.rect(3, -3 - armOffset, 1, 4);   // Right arm

  // Helmet/head (circle from top)
  graphics.fill(p.red(teamColor) * 0.6, p.green(teamColor) * 0.6, p.blue(teamColor) * 0.6);
  graphics.ellipse(0, -5, 4, 4.5);

  // Helmet highlight
  graphics.fill(p.red(teamColor) * 0.8, p.green(teamColor) * 0.8, p.blue(teamColor) * 0.8);
  graphics.ellipse(-0.5, -5.5, 1.5, 2);

  // Weapon (sword pointing down/forward)
  graphics.fill(200, 200, 200);
  graphics.noStroke();
  graphics.rect(3.5, -2, 3, 1);  // Sword handle/blade
  graphics.triangle(6.5, -2, 8, -2.5, 8, -1.5);  // Sword tip

  // Weapon grip
  graphics.fill(100, 80, 60);
  graphics.rect(3.5, -2, 1, 1);

  graphics.pop();
};
