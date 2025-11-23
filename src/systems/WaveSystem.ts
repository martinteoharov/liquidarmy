/**
 * Wave System
 *
 * Manages wave-based enemy spawning, timing, and progression.
 *
 * Responsibilities:
 * - Track current wave number and enemy counts
 * - Manage wave timers and transitions
 * - Calculate enemy stats based on wave and difficulty
 * - Spawn enemies for each wave
 * - Award points for kills and wave completion
 */

import { Soldier } from "../entities/Soldier";
import {
  DIFFICULTY_CONFIGS,
  SCORING,
  SPAWN_POSITIONS,
  SOLDIER,
} from "../config";
import { Difficulty, TeamId, GameState } from "../enums";
import type { WaveState, ScoreState, Team, GameContext } from "../types";
import type { P5 } from "../p5-types";

export class WaveSystem {
  private p: P5;
  private context: GameContext;

  constructor(p: P5, context: GameContext) {
    this.p = p;
    this.context = context;
  }

  /**
   * Initialize wave state for a new game
   */
  public initializeWaveState = (): WaveState => {
    const difficultyConfig = DIFFICULTY_CONFIGS.find(
      (config) => config.difficulty === this.context.difficulty,
    )!;

    return {
      currentWave: 1,
      enemiesInWave: difficultyConfig.waveConfig.baseEnemyCount,
      enemiesRemaining: difficultyConfig.waveConfig.baseEnemyCount,
      waveStartTime: this.p.millis(),
      waveDuration: difficultyConfig.waveConfig.waveDuration * 1000,
      isTransitioning: false,
      transitionStartTime: 0,
    };
  };

  /**
   * Initialize score state for a new game
   */
  public initializeScoreState = (): ScoreState => {
    return {
      totalScore: 0,
      kills: 0,
      wavesCompleted: 0,
    };
  };

  /**
   * Update wave system each frame
   * Returns true if game should end (player lost)
   */
  public update = (soldiers: Soldier[]): boolean => {
    const { waveState, enemyTeam } = this.context;

    // Count remaining enemy soldiers (use alive property)
    const enemyCount = soldiers.filter(
      (s) => s.alive && s.teamIndex === TeamId.BLUE,
    ).length;

    // Update enemy count in wave state
    waveState.enemiesRemaining = enemyCount;

    // Handle wave transition first
    if (waveState.isTransitioning) {
      const transitionDuration = this.getTransitionDuration();
      if (
        this.p.millis() - waveState.transitionStartTime >=
        transitionDuration
      ) {
        this.startNextWave(soldiers);
      }
      return false;
    }

    // Check if wave is complete (all enemies dead)
    if (enemyCount === 0 && !waveState.isTransitioning) {
      this.completeWave();
      return false;
    }

    // Check if time has run out
    const elapsedTime = this.p.millis() - waveState.waveStartTime;
    if (elapsedTime >= waveState.waveDuration) {
      // Time expired but enemies remain - player can survive
      // Award survival bonus
      this.awardSurvivalBonus();
      this.completeWave();
      return false;
    }

    return false;
  };

  /**
   * Complete current wave and start transition
   */
  private completeWave = (): void => {
    const { waveState, scoreState } = this.context;

    // Award wave completion bonus
    const difficultyConfig = DIFFICULTY_CONFIGS.find(
      (config) => config.difficulty === this.context.difficulty,
    )!;

    const baseBonus = SCORING.WAVE_COMPLETION_BONUS;

    // Calculate time bonus (faster completion = more points)
    const elapsedTime = this.p.millis() - waveState.waveStartTime;
    const timeRatio = 1 - elapsedTime / waveState.waveDuration;
    const timeBonus = Math.floor(
      baseBonus * SCORING.TIME_BONUS_MULTIPLIER * Math.max(0, timeRatio),
    );

    const totalBonus = Math.floor(
      (baseBonus + timeBonus) * difficultyConfig.pointsMultiplier,
    );

    scoreState.totalScore += totalBonus;
    scoreState.wavesCompleted += 1;

    // Start transition
    waveState.isTransitioning = true;
    waveState.transitionStartTime = this.p.millis();
  };

  /**
   * Award points for surviving wave without killing all enemies
   */
  private awardSurvivalBonus = (): void => {
    const { scoreState } = this.context;
    const difficultyConfig = DIFFICULTY_CONFIGS.find(
      (config) => config.difficulty === this.context.difficulty,
    )!;

    const bonus = Math.floor(
      SCORING.SURVIVAL_BONUS * difficultyConfig.pointsMultiplier,
    );

    scoreState.totalScore += bonus;
  };

  /**
   * Start the next wave
   */
  private startNextWave = (soldiers: Soldier[]): void => {
    const { waveState } = this.context;

    // Increment wave
    waveState.currentWave += 1;

    // Calculate enemy count for new wave
    const difficultyConfig = DIFFICULTY_CONFIGS.find(
      (config) => config.difficulty === this.context.difficulty,
    )!;

    waveState.enemiesInWave =
      difficultyConfig.waveConfig.baseEnemyCount +
      (waveState.currentWave - 1) *
        difficultyConfig.waveConfig.enemyCountIncrease;

    waveState.enemiesRemaining = waveState.enemiesInWave;

    // Spawn enemies
    this.spawnWaveEnemies(soldiers);

    // Reset wave timer
    waveState.waveStartTime = this.p.millis();
    waveState.isTransitioning = false;
  };

  /**
   * Spawn enemies for the current wave
   */
  public spawnWaveEnemies = (soldiers: Soldier[]): void => {
    const { waveState, enemyTeam } = this.context;

    // Calculate enemy stats based on wave and difficulty
    const enemyStats = this.calculateEnemyStats(waveState.currentWave);

    // Spawn position (enemies spawn at top-right corner)
    const spawnPos = SPAWN_POSITIONS[TeamId.BLUE];

    for (let i = 0; i < waveState.enemiesInWave; i++) {
      // Spread soldiers in a circle around spawn point
      const angle = (i / waveState.enemiesInWave) * Math.PI * 2;
      const radius = 50 + Math.floor(i / 8) * 30;
      const offsetX = Math.cos(angle) * radius;
      const offsetY = Math.sin(angle) * radius;

      const soldier = new Soldier(
        this.p,
        spawnPos.x + offsetX,
        spawnPos.y + offsetY,
        TeamId.BLUE,
        enemyTeam.color,
      );

      // Apply wave-based stat boosts
      soldier.maxHealth = enemyStats.health;
      soldier.health = enemyStats.health;
      soldier.baseDamage = enemyStats.damage;
      soldier.damage = enemyStats.damage; // Also set current damage
      soldier.maxSpeed = enemyStats.speed;

      soldiers.push(soldier);
    }
  };

  /**
   * Calculate enemy stats based on wave number and difficulty
   */
  private calculateEnemyStats = (
    waveNumber: number,
  ): { health: number; damage: number; speed: number } => {
    const difficultyConfig = DIFFICULTY_CONFIGS.find(
      (config) => config.difficulty === this.context.difficulty,
    )!;

    // Base stats from config
    let health = SOLDIER.health * difficultyConfig.enemyHealthMultiplier;
    let damage = SOLDIER.damage * difficultyConfig.enemyDamageMultiplier;
    let speed = SOLDIER.maxSpeed * difficultyConfig.enemySpeedMultiplier;

    // Apply wave multiplier (exponential growth)
    const waveMultiplier = Math.pow(
      difficultyConfig.waveConfig.statMultiplierPerWave,
      waveNumber - 1,
    );

    health *= waveMultiplier;
    damage *= waveMultiplier;
    speed = Math.min(speed * waveMultiplier, SOLDIER.maxSpeed * 2); // Cap speed at 2x base

    return {
      health: Math.floor(health),
      damage: Math.floor(damage),
      speed,
    };
  };

  /**
   * Award points for a kill
   */
  public awardKillPoints = (): void => {
    const { scoreState } = this.context;
    const difficultyConfig = DIFFICULTY_CONFIGS.find(
      (config) => config.difficulty === this.context.difficulty,
    )!;

    const points = Math.floor(
      SCORING.POINTS_PER_KILL * difficultyConfig.pointsMultiplier,
    );

    scoreState.totalScore += points;
    scoreState.kills += 1;
  };

  /**
   * Get remaining time in current wave (in seconds)
   */
  public getRemainingTime = (): number => {
    const { waveState } = this.context;
    const elapsed = this.p.millis() - waveState.waveStartTime;
    const remaining = Math.max(0, waveState.waveDuration - elapsed);
    return Math.ceil(remaining / 1000);
  };

  /**
   * Get transition duration in milliseconds
   */
  private getTransitionDuration = (): number => {
    const difficultyConfig = DIFFICULTY_CONFIGS.find(
      (config) => config.difficulty === this.context.difficulty,
    )!;

    return difficultyConfig.waveConfig.waveTransitionDelay * 1000;
  };

  /**
   * Get transition remaining time in seconds
   */
  public getTransitionRemainingTime = (): number => {
    const { waveState } = this.context;
    if (!waveState.isTransitioning) return 0;

    const elapsed = this.p.millis() - waveState.transitionStartTime;
    const remaining = Math.max(0, this.getTransitionDuration() - elapsed);
    return Math.ceil(remaining / 1000);
  };
}
