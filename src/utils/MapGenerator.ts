/**
 * Map Generator
 *
 * Generates a single maze-style map with varied obstacles.
 * Creates strategic pathways and cover points for wave-based combat.
 *
 * Responsibilities:
 * - Create maze-like obstacle layouts
 * - Mix different obstacle shapes (rectangles, L-shapes, T-shapes)
 * - Ensure obstacles don't block spawn corners
 * - Generate balanced, playable layout
 */

import { Obstacle, CastleObstacle } from "../entities/Obstacle";
import { PHYSICS } from "../config";
import type { P5 } from "../p5-types";

const MAP_SIZE = PHYSICS.MAP_SIZE;

/**
 * Generate the single maze-style map
 */
export const generateMap = (p: P5): Array<Obstacle | CastleObstacle> => {
  const obstacles: Array<Obstacle | CastleObstacle> = [];

  // Add central fortress
  obstacles.push(new CastleObstacle(MAP_SIZE / 2, MAP_SIZE / 2, 120));

  // Add maze pathways
  obstacles.push(...generateMazeWalls(p));

  // Add scattered cover points
  obstacles.push(...generateCoverPoints(p));

  // Add corner fortifications (but not blocking spawns)
  obstacles.push(...generateCornerStructures(p));

  return obstacles;
};

/**
 * Generate maze-like wall structures
 */
const generateMazeWalls = (p: P5): Obstacle[] => {
  const obstacles: Obstacle[] = [];
  const wallThickness = 25;
  const wallLength = 120;

  // Vertical walls creating lanes
  for (let i = 2; i <= 6; i++) {
    const x = (i / 8) * MAP_SIZE;

    // Top section
    if (i !== 4) {
      // Skip center
      obstacles.push(
        new Obstacle(
          x - wallThickness / 2,
          MAP_SIZE * 0.15,
          wallThickness,
          wallLength + p.random(-20, 20),
        ),
      );
    }

    // Bottom section
    if (i !== 4) {
      obstacles.push(
        new Obstacle(
          x - wallThickness / 2,
          MAP_SIZE * 0.75,
          wallThickness,
          wallLength + p.random(-20, 20),
        ),
      );
    }
  }

  // Horizontal walls creating lanes
  for (let i = 2; i <= 6; i++) {
    const y = (i / 8) * MAP_SIZE;

    // Left section
    if (i !== 4 && !isNearSpawnCorner(MAP_SIZE * 0.15, y)) {
      obstacles.push(
        new Obstacle(
          MAP_SIZE * 0.15,
          y - wallThickness / 2,
          wallLength + p.random(-20, 20),
          wallThickness,
        ),
      );
    }

    // Right section
    if (i !== 4 && !isNearSpawnCorner(MAP_SIZE * 0.75, y)) {
      obstacles.push(
        new Obstacle(
          MAP_SIZE * 0.75,
          y - wallThickness / 2,
          wallLength + p.random(-20, 20),
          wallThickness,
        ),
      );
    }
  }

  // Add some L-shaped obstacles for variety
  obstacles.push(...generateLShapes(p));

  // Add some T-shaped obstacles
  obstacles.push(...generateTShapes(p));

  return obstacles;
};

/**
 * Generate L-shaped obstacles
 */
const generateLShapes = (p: P5): Obstacle[] => {
  const obstacles: Obstacle[] = [];
  const armLength = 60;
  const thickness = 20;

  // Place L-shapes at strategic positions
  const positions = [
    { x: MAP_SIZE * 0.3, y: MAP_SIZE * 0.3 },
    { x: MAP_SIZE * 0.7, y: MAP_SIZE * 0.3 },
    { x: MAP_SIZE * 0.3, y: MAP_SIZE * 0.7 },
    { x: MAP_SIZE * 0.7, y: MAP_SIZE * 0.7 },
  ];

  for (const pos of positions) {
    if (isNearSpawnCorner(pos.x, pos.y) || isNearCenter(pos.x, pos.y)) continue;

    // Horizontal arm
    obstacles.push(new Obstacle(pos.x, pos.y, armLength, thickness));

    // Vertical arm
    obstacles.push(new Obstacle(pos.x, pos.y, thickness, armLength));
  }

  return obstacles;
};

/**
 * Generate T-shaped obstacles
 */
const generateTShapes = (p: P5): Obstacle[] => {
  const obstacles: Obstacle[] = [];
  const armLength = 70;
  const thickness = 18;

  // Place T-shapes between main structures
  const positions = [
    { x: MAP_SIZE * 0.5, y: MAP_SIZE * 0.2 },
    { x: MAP_SIZE * 0.2, y: MAP_SIZE * 0.5 },
    { x: MAP_SIZE * 0.8, y: MAP_SIZE * 0.5 },
    { x: MAP_SIZE * 0.5, y: MAP_SIZE * 0.8 },
  ];

  for (const pos of positions) {
    if (isNearSpawnCorner(pos.x, pos.y) || isNearCenter(pos.x, pos.y)) continue;

    // Horizontal arm
    obstacles.push(
      new Obstacle(
        pos.x - armLength / 2,
        pos.y - thickness / 2,
        armLength,
        thickness,
      ),
    );

    // Vertical stem
    obstacles.push(
      new Obstacle(pos.x - thickness / 2, pos.y, thickness, armLength / 2),
    );
  }

  return obstacles;
};

/**
 * Generate scattered cover points
 */
const generateCoverPoints = (p: P5): Obstacle[] => {
  const obstacles: Obstacle[] = [];
  const coverSize = 30;
  const spacing = 140;

  // Grid of small cover obstacles
  for (let x = spacing; x < MAP_SIZE; x += spacing) {
    for (let y = spacing; y < MAP_SIZE; y += spacing) {
      // Skip spawn corners and center
      if (isNearSpawnCorner(x, y) || isNearCenter(x, y)) continue;

      // Random placement with 40% chance
      if (p.random() > 0.6) {
        const offsetX = p.random(-25, 25);
        const offsetY = p.random(-25, 25);

        // Vary the shape - square, rectangle, or small pillar
        const shapeType = p.random();
        if (shapeType < 0.33) {
          // Square
          obstacles.push(
            new Obstacle(
              x + offsetX - coverSize / 2,
              y + offsetY - coverSize / 2,
              coverSize,
              coverSize,
            ),
          );
        } else if (shapeType < 0.66) {
          // Horizontal rectangle
          obstacles.push(
            new Obstacle(
              x + offsetX - coverSize,
              y + offsetY - coverSize / 3,
              coverSize * 2,
              coverSize / 1.5,
            ),
          );
        } else {
          // Vertical rectangle
          obstacles.push(
            new Obstacle(
              x + offsetX - coverSize / 3,
              y + offsetY - coverSize,
              coverSize / 1.5,
              coverSize * 2,
            ),
          );
        }
      }
    }
  }

  return obstacles;
};

/**
 * Generate corner defensive structures (not blocking spawns)
 */
const generateCornerStructures = (p: P5): Obstacle[] => {
  const obstacles: Obstacle[] = [];
  const wallLength = 80;
  const wallThickness = 20;
  const offset = 200; // Far enough from spawn points

  // Top-left corner structure
  obstacles.push(
    new Obstacle(
      offset - wallLength,
      offset - wallThickness / 2,
      wallLength,
      wallThickness,
    ),
  );
  obstacles.push(
    new Obstacle(
      offset - wallThickness / 2,
      offset - wallLength,
      wallThickness,
      wallLength,
    ),
  );

  // Top-right corner structure
  obstacles.push(
    new Obstacle(
      MAP_SIZE - offset,
      offset - wallThickness / 2,
      wallLength,
      wallThickness,
    ),
  );
  obstacles.push(
    new Obstacle(
      MAP_SIZE - offset - wallThickness / 2,
      offset - wallLength,
      wallThickness,
      wallLength,
    ),
  );

  // Bottom-left corner structure
  obstacles.push(
    new Obstacle(
      offset - wallLength,
      MAP_SIZE - offset - wallThickness / 2,
      wallLength,
      wallThickness,
    ),
  );
  obstacles.push(
    new Obstacle(
      offset - wallThickness / 2,
      MAP_SIZE - offset,
      wallThickness,
      wallLength,
    ),
  );

  // Bottom-right corner structure
  obstacles.push(
    new Obstacle(
      MAP_SIZE - offset,
      MAP_SIZE - offset - wallThickness / 2,
      wallLength,
      wallThickness,
    ),
  );
  obstacles.push(
    new Obstacle(
      MAP_SIZE - offset - wallThickness / 2,
      MAP_SIZE - offset,
      wallThickness,
      wallLength,
    ),
  );

  return obstacles;
};

/**
 * Check if position is near a spawn corner (to avoid blocking spawns)
 */
const isNearSpawnCorner = (x: number, y: number): boolean => {
  const cornerMargin = 150;
  return (
    (x < cornerMargin && y < cornerMargin) ||
    (x > MAP_SIZE - cornerMargin && y < cornerMargin) ||
    (x < cornerMargin && y > MAP_SIZE - cornerMargin) ||
    (x > MAP_SIZE - cornerMargin && y > MAP_SIZE - cornerMargin)
  );
};

/**
 * Check if position is near map center (to avoid blocking central area)
 */
const isNearCenter = (x: number, y: number): boolean => {
  const centerMargin = 180;
  const dx = x - MAP_SIZE / 2;
  const dy = y - MAP_SIZE / 2;
  return Math.sqrt(dx * dx + dy * dy) < centerMargin;
};
