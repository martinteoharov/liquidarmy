/**
 * Physics System
 *
 * Handles all physics simulation for soldiers including:
 * - Position and velocity updates
 * - Liquid-like separation forces
 * - Spatial grid management for optimization
 *
 * Responsibilities:
 * - Update soldier positions each frame
 * - Apply separation forces for liquid behavior
 * - Manage spatial grid for efficient collision detection
 * - Ensure soldiers stay within map bounds
 */

import type { Soldier } from "../entities/Soldier";
import type { Obstacle, CastleObstacle } from "../entities/Obstacle";
import type { Team } from "../types";
import { SpatialGrid } from "../utils/SpatialGrid";
import { PHYSICS } from "../config";
import type { P5, P5Image, P5Graphics, P5Color } from "../p5-types";

export class PhysicsSystem {
  private spatialGrid: SpatialGrid;
  private rewardSystem: any = null;

  constructor() {
    this.spatialGrid = new SpatialGrid(PHYSICS.MAP_SIZE, PHYSICS.MAP_SIZE);
  }

  /**
   * Set reward system for applying physics modifiers
   */
  setRewardSystem = (rewardSystem: any): void => {
    this.rewardSystem = rewardSystem;
  };

  /**
   * Update all soldier physics for this frame
   */
  update = (
    soldiers: Soldier[],
    obstacles: Array<Obstacle | CastleObstacle>,
    teams: Team[],
    p: P5,
  ): void => {
    // Clear and rebuild spatial grid
    this.spatialGrid.clear();
    for (const soldier of soldiers) {
      if (soldier.alive) {
        this.spatialGrid.insert(soldier);
      }
    }

    // Update each soldier
    for (const soldier of soldiers) {
      if (!soldier.alive) continue;

      // Update position, velocity, and handle obstacles
      soldier.update(teams, obstacles, this.spatialGrid, p, this.rewardSystem);

      // Apply separation forces for liquid behavior
      soldier.separate(this.spatialGrid);

      // Update morale based on nearby forces
      soldier.updateMorale(this.spatialGrid);
    }
  };

  /**
   * Get the spatial grid for other systems to use
   */
  getSpatialGrid = (): SpatialGrid => {
    return this.spatialGrid;
  };
}
