/**
 * Reward System
 *
 * Manages the reward system including:
 * - Spawning rewards after wave completion
 * - Applying reward effects to player soldiers
 * - Managing active timed buffs
 * - Tracking reward notifications
 *
 * Responsibilities:
 * - Generate random rewards based on wave number
 * - Apply reward effects (instant or timed)
 * - Update active buffs
 * - Spawn special troops (shadow, champion)
 */

import type { P5 } from "../p5-types";
import { RewardType, TeamId } from "../enums";
import { REWARDS, REWARD_CONFIGS, SOLDIER, SPAWN_POSITIONS, PHYSICS } from "../config";
import type { RewardState, ActiveReward, RewardNotification, GameContext } from "../types";
import { Reward } from "../entities/Reward";
import { Soldier } from "../entities/Soldier";

export class RewardSystem {
  private p: P5;
  private context: GameContext;
  private activeRewards: Reward[] = [];

  constructor(p: P5, context: GameContext) {
    this.p = p;
    this.context = context;
  }

  /**
   * Initialize reward state
   */
  public initializeRewardState = (): RewardState => {
    return {
      activeRewards: [],
      notifications: [],
    };
  };

  /**
   * Spawn a reward after wave completion
   */
  public spawnReward = (waveNumber: number): void => {
    const rewardType = this.selectRandomReward(waveNumber);

    // Spawn in center of map with some randomness
    const centerX = PHYSICS.MAP_SIZE / 2;
    const centerY = PHYSICS.MAP_SIZE / 2;
    const offsetX = this.p.random(-100, 100);
    const offsetY = this.p.random(-100, 100);

    const reward = new Reward(centerX + offsetX, centerY + offsetY, rewardType);
    this.activeRewards.push(reward);
  };

  /**
   * Select a random reward based on wave number (better rewards at higher waves)
   */
  private selectRandomReward = (waveNumber: number): RewardType => {
    // Calculate rarity chances based on wave
    const legendaryChance = Math.min(
      0.4,
      REWARDS.BASE_LEGENDARY_CHANCE + (waveNumber - 1) * REWARDS.LEGENDARY_CHANCE_PER_WAVE
    );
    const rareChance = Math.min(
      0.5,
      REWARDS.BASE_RARE_CHANCE + (waveNumber - 1) * REWARDS.RARE_CHANCE_PER_WAVE
    );
    const commonChance = 1 - legendaryChance - rareChance;

    // Roll for rarity
    const roll = this.p.random();
    let rarity: "common" | "rare" | "legendary";

    if (roll < legendaryChance) {
      rarity = "legendary";
    } else if (roll < legendaryChance + rareChance) {
      rarity = "rare";
    } else {
      rarity = "common";
    }

    // Filter rewards by rarity
    const availableRewards = Object.entries(REWARD_CONFIGS)
      .filter(([_, config]) => config.rarity === rarity)
      .map(([type, _]) => type as RewardType);

    // Select random reward from available
    const randomIndex = Math.floor(this.p.random() * availableRewards.length);
    return availableRewards[randomIndex];
  };

  /**
   * Update rewards and check for collection
   */
  public update = (soldiers: Soldier[]): void => {
    const { rewardState } = this.context;

    // Update and check collection for active rewards
    for (let i = this.activeRewards.length - 1; i >= 0; i--) {
      const reward = this.activeRewards[i];
      reward.update();

      if (reward.checkCollection(soldiers)) {
        this.applyReward(reward.type, soldiers);
        this.activeRewards.splice(i, 1);
      }
    }

    // Update active timed buffs
    const currentTime = this.p.millis();
    rewardState.activeRewards = rewardState.activeRewards.filter(
      (reward) => currentTime - reward.startTime < reward.duration
    );

    // Update notifications
    rewardState.notifications = rewardState.notifications.filter(
      (notif) => currentTime - notif.startTime < notif.duration
    );
  };

  /**
   * Apply reward effect to player
   */
  private applyReward = (type: RewardType, soldiers: Soldier[]): void => {
    const { rewardState, playerTeam } = this.context;
    const config = REWARD_CONFIGS[type];
    const currentTime = this.p.millis();

    // Add notification
    rewardState.notifications.push({
      message: `${config.icon} ${config.name}: ${config.description}`,
      startTime: currentTime,
      duration: REWARDS.NOTIFICATION_DURATION,
    });

    switch (type) {
      case RewardType.DAMAGE_BOOST:
        rewardState.activeRewards.push({
          type,
          startTime: currentTime,
          duration: 60000, // 60 seconds
        });
        break;

      case RewardType.SPEED_BOOST:
        rewardState.activeRewards.push({
          type,
          startTime: currentTime,
          duration: 45000, // 45 seconds
        });
        break;

      case RewardType.TROOP_REINFORCEMENT:
        this.spawnReinforcements(50, soldiers);
        break;

      case RewardType.SHADOW_TROOPS:
        this.spawnShadowTroops(10, soldiers);
        break;

      case RewardType.HEALTH_REGENERATION:
        this.healAllTroops(soldiers);
        break;

      case RewardType.CRITICAL_MASTERY:
        rewardState.activeRewards.push({
          type,
          startTime: currentTime,
          duration: 30000, // 30 seconds
        });
        break;

      case RewardType.IMMORTAL_CHAMPION:
        this.spawnChampion(soldiers);
        rewardState.activeRewards.push({
          type,
          startTime: currentTime,
          duration: 20000, // 20 seconds
        });
        break;

      case RewardType.ARMY_EXPANSION:
        this.spawnReinforcements(100, soldiers);
        break;

      case RewardType.BERSERKER_RAGE:
        rewardState.activeRewards.push({
          type,
          startTime: currentTime,
          duration: 30000, // 30 seconds
        });
        break;

      case RewardType.DIVINE_SHIELD:
        rewardState.activeRewards.push({
          type,
          startTime: currentTime,
          duration: 45000, // 45 seconds
        });
        break;
    }
  };

  /**
   * Spawn regular troop reinforcements
   */
  private spawnReinforcements = (count: number, soldiers: Soldier[]): void => {
    const spawnPos = SPAWN_POSITIONS[TeamId.RED];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 50 + Math.floor(i / 8) * 30;
      const offsetX = Math.cos(angle) * radius;
      const offsetY = Math.sin(angle) * radius;

      const soldier = new Soldier(
        this.p,
        spawnPos.x + offsetX,
        spawnPos.y + offsetY,
        TeamId.RED,
        this.context.playerTeam.color
      );

      soldiers.push(soldier);
    }
  };

  /**
   * Spawn elite shadow troops
   */
  private spawnShadowTroops = (count: number, soldiers: Soldier[]): void => {
    const spawnPos = SPAWN_POSITIONS[TeamId.RED];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 60;
      const offsetX = Math.cos(angle) * radius;
      const offsetY = Math.sin(angle) * radius;

      const soldier = new Soldier(
        this.p,
        spawnPos.x + offsetX,
        spawnPos.y + offsetY,
        TeamId.RED,
        "#1a1a2e" // Dark shadow color
      );

      // Enhanced stats
      soldier.maxHealth = SOLDIER.health * REWARDS.SHADOW_TROOP_STATS_MULTIPLIER;
      soldier.health = soldier.maxHealth;
      soldier.damage = SOLDIER.damage * REWARDS.SHADOW_TROOP_STATS_MULTIPLIER;
      soldier.baseDamage = soldier.damage;
      soldier.maxSpeed = SOLDIER.maxSpeed * 1.8;
      soldier.attackRange = SOLDIER.attackRange * 1.5;

      (soldier as any).isShadowTroop = true;

      soldiers.push(soldier);
    }
  };

  /**
   * Spawn an immortal champion
   */
  private spawnChampion = (soldiers: Soldier[]): void => {
    const spawnPos = SPAWN_POSITIONS[TeamId.RED];

    const champion = new Soldier(
      this.p,
      spawnPos.x,
      spawnPos.y,
      TeamId.RED,
      "#FFD700" // Gold color
    );

    // Massively enhanced stats
    champion.maxHealth = SOLDIER.health * REWARDS.CHAMPION_STATS_MULTIPLIER;
    champion.health = champion.maxHealth;
    champion.damage = SOLDIER.damage * REWARDS.CHAMPION_STATS_MULTIPLIER;
    champion.baseDamage = champion.damage;
    champion.maxSpeed = SOLDIER.maxSpeed * 1.5;
    champion.size = SOLDIER.size * 1.5;
    champion.attackRange = SOLDIER.attackRange * 2;

    (champion as any).isChampion = true;
    (champion as any).championStartTime = this.p.millis();

    soldiers.push(champion);
  };

  /**
   * Heal all player troops to full health
   */
  private healAllTroops = (soldiers: Soldier[]): void => {
    for (const soldier of soldiers) {
      if (soldier.alive && soldier.teamIndex === TeamId.RED) {
        soldier.health = soldier.maxHealth;
      }
    }
  };

  /**
   * Check if a reward type is currently active
   */
  public isRewardActive = (type: RewardType): boolean => {
    return this.context.rewardState.activeRewards.some((r) => r.type === type);
  };

  /**
   * Get damage multiplier from active rewards
   */
  public getDamageMultiplier = (): number => {
    let multiplier = 1.0;

    if (this.isRewardActive(RewardType.DAMAGE_BOOST)) {
      multiplier *= 2.0;
    }
    if (this.isRewardActive(RewardType.BERSERKER_RAGE)) {
      multiplier *= 3.0;
    }

    return multiplier;
  };

  /**
   * Get speed multiplier from active rewards
   */
  public getSpeedMultiplier = (): number => {
    let multiplier = 1.0;

    if (this.isRewardActive(RewardType.SPEED_BOOST)) {
      multiplier *= 1.5;
    }
    if (this.isRewardActive(RewardType.BERSERKER_RAGE)) {
      multiplier *= 0.5; // Berserker slows you down
    }

    return multiplier;
  };

  /**
   * Get crit chance from active rewards
   */
  public getCritChanceBonus = (): number => {
    if (this.isRewardActive(RewardType.CRITICAL_MASTERY)) {
      return 0.5; // 50% crit chance
    }
    return 0;
  };

  /**
   * Get damage reduction from active rewards
   */
  public getDamageReduction = (): number => {
    if (this.isRewardActive(RewardType.DIVINE_SHIELD)) {
      return 0.5; // 50% damage reduction
    }
    return 0;
  };

  /**
   * Check if soldier is an immortal champion and still invincible
   */
  public isChampionInvincible = (soldier: Soldier): boolean => {
    if (!(soldier as any).isChampion) return false;

    const championStartTime = (soldier as any).championStartTime;
    if (!championStartTime) return false;

    // Check if IMMORTAL_CHAMPION reward is still active
    const activeChampion = this.context.rewardState.activeRewards.find(
      (r) => r.type === RewardType.IMMORTAL_CHAMPION
    );

    if (!activeChampion) return false;

    const currentTime = this.p.millis();
    return currentTime - activeChampion.startTime < activeChampion.duration;
  };

  /**
   * Draw all active rewards
   */
  public draw = (mapScale: number): void => {
    for (const reward of this.activeRewards) {
      reward.draw(mapScale, this.p);
    }
  };

  /**
   * Clear all rewards (for game restart)
   */
  public clear = (): void => {
    this.activeRewards = [];
  };
}
