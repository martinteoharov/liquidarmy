/**
 * Spatial Grid for Collision Optimization
 *
 * Partitions the game map into a grid to dramatically reduce collision detection cost.
 * Instead of checking every soldier against every other soldier (O(n²)),
 * we only check soldiers in nearby grid cells (O(n)).
 *
 * Responsibilities:
 * - Divide map into fixed-size grid cells
 * - Insert soldiers into appropriate cells each frame
 * - Query nearby soldiers efficiently
 * - Clear grid between frames
 *
 * Performance:
 * - Without spatial grid: 1000 soldiers = 1,000,000 checks per frame
 * - With spatial grid: 1000 soldiers ≈ 5,000 checks per frame (200x faster!)
 */

import type { Soldier } from '../entities/Soldier';
import { PHYSICS } from '../config';

export class SpatialGrid {
  private cellSize: number;
  private cols: number;
  private rows: number;
  private cells: Soldier[][];

  constructor(width: number, height: number, cellSize: number = PHYSICS.GRID_CELL_SIZE) {
    this.cellSize = cellSize;
    this.cols = Math.ceil(width / cellSize);
    this.rows = Math.ceil(height / cellSize);
    this.cells = [];
    this.clear();
  }

  /**
   * Clear all cells - call at the start of each frame
   */
  clear = (): void => {
    this.cells = [];
    for (let i = 0; i < this.cols * this.rows; i++) {
      this.cells[i] = [];
    }
  };

  /**
   * Get the grid cell index for a given position
   */
  private getIndex = (x: number, y: number): number => {
    let col = Math.floor(x / this.cellSize);
    let row = Math.floor(y / this.cellSize);

    // Clamp to grid bounds
    col = Math.max(0, Math.min(col, this.cols - 1));
    row = Math.max(0, Math.min(row, this.rows - 1));

    return row * this.cols + col;
  };

  /**
   * Insert a soldier into the grid
   */
  insert = (soldier: Soldier): void => {
    const index = this.getIndex(soldier.x, soldier.y);
    this.cells[index].push(soldier);
  };

  /**
   * Get all soldiers within a radius of the given soldier
   * Only checks cells that could contain soldiers within the radius
   */
  getNearby = (soldier: Soldier, radius: number): Soldier[] => {
    const nearby: Soldier[] = [];

    // Calculate which cells to check
    const minCol = Math.floor((soldier.x - radius) / this.cellSize);
    const maxCol = Math.floor((soldier.x + radius) / this.cellSize);
    const minRow = Math.floor((soldier.y - radius) / this.cellSize);
    const maxRow = Math.floor((soldier.y + radius) / this.cellSize);

    // Clamp to grid bounds
    const minColClamped = Math.max(0, Math.min(minCol, this.cols - 1));
    const maxColClamped = Math.max(0, Math.min(maxCol, this.cols - 1));
    const minRowClamped = Math.max(0, Math.min(minRow, this.rows - 1));
    const maxRowClamped = Math.max(0, Math.min(maxRow, this.rows - 1));

    // Collect soldiers from all relevant cells
    for (let row = minRowClamped; row <= maxRowClamped; row++) {
      for (let col = minColClamped; col <= maxColClamped; col++) {
        const index = row * this.cols + col;
        nearby.push(...this.cells[index]);
      }
    }

    return nearby;
  };
}
