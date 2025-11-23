// src/config.ts
var PHYSICS = {
  MAP_SIZE: 1000,
  FRICTION: 0.92,
  SEPARATION_FORCE: 0.6,
  CURSOR_ATTRACTION: 0.25,
  GRID_CELL_SIZE: 20,
  MIN_SEPARATION_DISTANCE: 0.5,
  VELOCITY_STOP_THRESHOLD: 0.05
};
var SOLDIER = {
  name: "Soldier",
  size: 8,
  spacing: 16,
  maxSpeed: 2.5,
  health: 100,
  damage: 20,
  attackRange: 20,
  spriteSize: 16,
  attackCooldown: 15,
  xpPerKill: 10
};
var COMBAT = {
  CRIT_CHANCE: 0.1,
  CRIT_MULTIPLIER: 2,
  XP_PER_LEVEL: 100,
  LEVEL_HEALTH_MULTIPLIER: 1.15,
  LEVEL_DAMAGE_MULTIPLIER: 1.1,
  LEVEL_SPEED_MULTIPLIER: 1.05,
  MORALE_DECREASE_RATE: 2,
  MORALE_INCREASE_RATE: 0.5,
  FLEE_MORALE_THRESHOLD: 20,
  RECOVER_MORALE_THRESHOLD: 40
};
var TEAM_COLORS = [
  { name: "Red", color: "#E74C3C" },
  { name: "Blue", color: "#3498DB" },
  { name: "Green", color: "#2ECC71" },
  { name: "Yellow", color: "#F1C40F" }
];
var DIFFICULTY_CONFIGS = [
  {
    name: "Easy",
    difficulty: "easy" /* EASY */,
    description: "Perfect for beginners - more time, weaker enemies",
    waveConfig: {
      baseEnemyCount: 15,
      enemyCountIncrease: 3,
      statMultiplierPerWave: 1.08,
      waveDuration: 90,
      waveTransitionDelay: 3
    },
    enemyHealthMultiplier: 0.8,
    enemyDamageMultiplier: 0.7,
    enemySpeedMultiplier: 0.9,
    pointsMultiplier: 1
  },
  {
    name: "Medium",
    difficulty: "medium" /* MEDIUM */,
    description: "Balanced challenge for experienced players",
    waveConfig: {
      baseEnemyCount: 20,
      enemyCountIncrease: 5,
      statMultiplierPerWave: 1.12,
      waveDuration: 75,
      waveTransitionDelay: 2
    },
    enemyHealthMultiplier: 1,
    enemyDamageMultiplier: 1,
    enemySpeedMultiplier: 1,
    pointsMultiplier: 1.5
  },
  {
    name: "Hard",
    difficulty: "hard" /* HARD */,
    description: "Extreme challenge - fast, strong enemies",
    waveConfig: {
      baseEnemyCount: 30,
      enemyCountIncrease: 8,
      statMultiplierPerWave: 1.15,
      waveDuration: 60,
      waveTransitionDelay: 2
    },
    enemyHealthMultiplier: 1.2,
    enemyDamageMultiplier: 1.3,
    enemySpeedMultiplier: 1.1,
    pointsMultiplier: 2
  }
];
var SCORING = {
  POINTS_PER_KILL: 10,
  WAVE_COMPLETION_BONUS: 100,
  TIME_BONUS_MULTIPLIER: 2,
  SURVIVAL_BONUS: 50
};
var UI = {
  ANIMATION_FRAMES: 4,
  MIN_LEVEL_FOR_STARS: 3,
  MAX_STARS: 5,
  CANVAS_ASPECT_RATIO: 4 / 3
};
var ANIMATION = {
  SOLDIER_FRAME_SPEED: 8,
  BLOOD_SPLATTER_LIFESPAN: 90,
  DEATH_ANIMATION_DURATION: 15,
  LEVELUP_EFFECT_DURATION: 25
};
var AUDIO = {
  HIT_SOUND_VOLUME: 0.15,
  POP_SOUND_DURATION: 0.1
};
var SPAWN_POSITIONS = [
  { x: 100, y: 100 },
  { x: 900, y: 100 },
  { x: 100, y: 900 },
  { x: 900, y: 900 }
];
var REWARDS = {
  PICKUP_SIZE: 30,
  COLLECTION_RADIUS: 40,
  NOTIFICATION_DURATION: 5000,
  BASE_COMMON_CHANCE: 0.6,
  BASE_RARE_CHANCE: 0.3,
  BASE_LEGENDARY_CHANCE: 0.1,
  RARE_CHANCE_PER_WAVE: 0.05,
  LEGENDARY_CHANCE_PER_WAVE: 0.03,
  SHADOW_TROOP_STATS_MULTIPLIER: 3,
  CHAMPION_STATS_MULTIPLIER: 5
};
var REWARD_CONFIGS = {
  damage_boost: {
    name: "Damage Boost",
    description: "2x damage for 60 seconds",
    rarity: "common",
    color: "#FF6B6B",
    icon: "⚔"
  },
  speed_boost: {
    name: "Speed Boost",
    description: "1.5x speed for 45 seconds",
    rarity: "common",
    color: "#4ECDC4",
    icon: "⚡"
  },
  troop_reinforcement: {
    name: "Reinforcements",
    description: "Add 50 troops to your army",
    rarity: "common",
    color: "#95E1D3",
    icon: "\uD83D\uDEE1"
  },
  health_regen: {
    name: "Health Regeneration",
    description: "Heal all troops to full health",
    rarity: "common",
    color: "#A8E6CF",
    icon: "\uD83D\uDC9A"
  },
  critical_mastery: {
    name: "Critical Mastery",
    description: "50% crit chance for 30 seconds",
    rarity: "rare",
    color: "#FFD93D",
    icon: "\uD83D\uDCA5"
  },
  divine_shield: {
    name: "Divine Shield",
    description: "50% damage reduction for 45 seconds",
    rarity: "rare",
    color: "#6BCB77",
    icon: "\uD83D\uDEE1"
  },
  berserker_rage: {
    name: "Berserker Rage",
    description: "3x damage but 0.5x speed for 30 seconds",
    rarity: "rare",
    color: "#FF6B9D",
    icon: "\uD83D\uDCA2"
  },
  shadow_troops: {
    name: "Shadow Troops",
    description: "Add 10 elite shadow warriors",
    rarity: "legendary",
    color: "#9D84B7",
    icon: "\uD83D\uDC64"
  },
  immortal_champion: {
    name: "Immortal Champion",
    description: "1 invincible champion for 20 seconds",
    rarity: "legendary",
    color: "#F6D365",
    icon: "\uD83D\uDC51"
  },
  army_expansion: {
    name: "Army Expansion",
    description: "Add 100 regular troops",
    rarity: "legendary",
    color: "#FFA94D",
    icon: "⚔"
  }
};

// src/utils/SpatialGrid.ts
class SpatialGrid {
  cellSize;
  cols;
  rows;
  cells;
  constructor(width, height, cellSize = PHYSICS.GRID_CELL_SIZE) {
    this.cellSize = cellSize;
    this.cols = Math.ceil(width / cellSize);
    this.rows = Math.ceil(height / cellSize);
    this.cells = [];
    this.clear();
  }
  clear = () => {
    this.cells = [];
    for (let i = 0;i < this.cols * this.rows; i++) {
      this.cells[i] = [];
    }
  };
  getIndex = (x, y) => {
    let col = Math.floor(x / this.cellSize);
    let row = Math.floor(y / this.cellSize);
    col = Math.max(0, Math.min(col, this.cols - 1));
    row = Math.max(0, Math.min(row, this.rows - 1));
    return row * this.cols + col;
  };
  insert = (soldier) => {
    const index = this.getIndex(soldier.x, soldier.y);
    this.cells[index].push(soldier);
  };
  getNearby = (soldier, radius) => {
    const nearby = [];
    const minCol = Math.floor((soldier.x - radius) / this.cellSize);
    const maxCol = Math.floor((soldier.x + radius) / this.cellSize);
    const minRow = Math.floor((soldier.y - radius) / this.cellSize);
    const maxRow = Math.floor((soldier.y + radius) / this.cellSize);
    const minColClamped = Math.max(0, Math.min(minCol, this.cols - 1));
    const maxColClamped = Math.max(0, Math.min(maxCol, this.cols - 1));
    const minRowClamped = Math.max(0, Math.min(minRow, this.rows - 1));
    const maxRowClamped = Math.max(0, Math.min(maxRow, this.rows - 1));
    for (let row = minRowClamped;row <= maxRowClamped; row++) {
      for (let col = minColClamped;col <= maxColClamped; col++) {
        const index = row * this.cols + col;
        nearby.push(...this.cells[index]);
      }
    }
    return nearby;
  };
}

// src/systems/Physics.ts
class PhysicsSystem {
  spatialGrid;
  rewardSystem = null;
  constructor() {
    this.spatialGrid = new SpatialGrid(PHYSICS.MAP_SIZE, PHYSICS.MAP_SIZE);
  }
  setRewardSystem = (rewardSystem) => {
    this.rewardSystem = rewardSystem;
  };
  update = (soldiers, obstacles, teams, p) => {
    this.spatialGrid.clear();
    for (const soldier of soldiers) {
      if (soldier.alive) {
        this.spatialGrid.insert(soldier);
      }
    }
    for (const soldier of soldiers) {
      if (!soldier.alive)
        continue;
      soldier.update(teams, obstacles, this.spatialGrid, p, this.rewardSystem);
      soldier.separate(this.spatialGrid);
      soldier.updateMorale(this.spatialGrid);
    }
  };
  getSpatialGrid = () => {
    return this.spatialGrid;
  };
}

// src/utils/Audio.ts
var audioContext = null;
var initAudio = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext);
  }
};
var playPopSound = () => {
  initAudio();
  if (!audioContext)
    return;
  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.frequency.setValueAtTime(300, now);
  oscillator.frequency.exponentialRampToValueAtTime(50, now + AUDIO.POP_SOUND_DURATION);
  gainNode.gain.setValueAtTime(AUDIO.HIT_SOUND_VOLUME, now);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + AUDIO.POP_SOUND_DURATION);
  oscillator.type = "sine";
  oscillator.start(now);
  oscillator.stop(now + AUDIO.POP_SOUND_DURATION);
};

// src/systems/Combat.ts
class CombatSystem {
  bloodSplatters = [];
  deathAnimations = [];
  levelUpEffects = [];
  rewardSystem = null;
  setRewardSystem = (rewardSystem) => {
    this.rewardSystem = rewardSystem;
  };
  update = (soldiers, teams, spatialGrid, p) => {
    for (const soldier of soldiers) {
      if (!soldier.alive)
        continue;
      soldier.checkEnemyCollision(spatialGrid, teams, this.bloodSplatters, this.deathAnimations, playPopSound, p, this.rewardSystem);
    }
    this.updateEffects();
  };
  updateEffects = () => {
    for (const splatter of this.bloodSplatters) {
      splatter.update();
    }
    this.bloodSplatters = this.bloodSplatters.filter((s) => s.alive);
    for (const anim of this.deathAnimations) {
      anim.update();
    }
    this.deathAnimations = this.deathAnimations.filter((a) => a.alive);
    for (const effect of this.levelUpEffects) {
      effect.update();
    }
    this.levelUpEffects = this.levelUpEffects.filter((e) => e.alive);
  };
  addLevelUpEffect = (effect) => {
    this.levelUpEffects.push(effect);
  };
  draw = (mapScale, p) => {
    for (const splatter of this.bloodSplatters) {
      splatter.draw(mapScale, p);
    }
    for (const anim of this.deathAnimations) {
      anim.draw(mapScale, p);
    }
    for (const effect of this.levelUpEffects) {
      effect.draw(mapScale, p);
    }
  };
  clear = () => {
    this.bloodSplatters = [];
    this.deathAnimations = [];
    this.levelUpEffects = [];
  };
}

// src/systems/AI.ts
class AISystem {
  updateTeamTargets = (playerTeam, enemyTeam, soldiers, mapScale, offsetX, offsetY, p) => {
    playerTeam.targetX = (p.mouseX - offsetX) / mapScale;
    playerTeam.targetY = (p.mouseY - offsetY) / mapScale;
    enemyTeam.targetUpdateTimer--;
    if (enemyTeam.targetUpdateTimer <= 0) {
      this.updateEnemyTarget(enemyTeam, soldiers, p);
      enemyTeam.targetUpdateTimer = 60;
    }
  };
  updateEnemyTarget = (enemyTeam, soldiers, p) => {
    const playerCenter = this.calculatePlayerCenter(soldiers);
    if (!playerCenter)
      return;
    const enemyCenter = this.calculateEnemyCenter(soldiers);
    if (!enemyCenter) {
      enemyTeam.targetX = playerCenter.x;
      enemyTeam.targetY = playerCenter.y;
      return;
    }
    const angle = p.frameCount * 0.02;
    const offsetAngle = angle + p.sin(p.frameCount * 0.01) * 0.5;
    const offsetDist = 80 + p.sin(p.frameCount * 0.015) * 40;
    const targetX = playerCenter.x + Math.cos(offsetAngle) * offsetDist;
    const targetY = playerCenter.y + Math.sin(offsetAngle) * offsetDist;
    const smoothing = 0.15;
    enemyTeam.targetX = enemyTeam.targetX * (1 - smoothing) + targetX * smoothing;
    enemyTeam.targetY = enemyTeam.targetY * (1 - smoothing) + targetY * smoothing;
  };
  calculatePlayerCenter = (soldiers) => {
    let count = 0;
    let sumX = 0;
    let sumY = 0;
    for (const soldier of soldiers) {
      if (soldier.isAlive && soldier.teamIndex === 0 /* RED */) {
        sumX += soldier.x;
        sumY += soldier.y;
        count++;
      }
    }
    if (count === 0)
      return null;
    return {
      x: sumX / count,
      y: sumY / count
    };
  };
  calculateEnemyCenter = (soldiers) => {
    let count = 0;
    let sumX = 0;
    let sumY = 0;
    for (const soldier of soldiers) {
      if (soldier.isAlive && soldier.teamIndex === 1 /* BLUE */) {
        sumX += soldier.x;
        sumY += soldier.y;
        count++;
      }
    }
    if (count === 0)
      return null;
    return {
      x: sumX / count,
      y: sumY / count
    };
  };
}

// src/entities/Effects.ts
class BloodSplatter {
  x;
  y;
  color;
  alpha = 200;
  size;
  alive = true;
  lifespan = ANIMATION.BLOOD_SPLATTER_LIFESPAN;
  constructor(x, y, teamColor) {
    this.x = x;
    this.y = y;
    this.color = teamColor;
    this.size = Math.random() * 7 + 5;
  }
  update = () => {
    this.lifespan--;
    this.alpha -= 2;
    if (this.lifespan <= 0 || this.alpha <= 0) {
      this.alive = false;
    }
  };
  draw = (mapScale, p) => {
    if (!this.alive)
      return;
    p.push();
    const teamColorObj = p.color(this.color);
    const r = p.red(teamColorObj);
    p.fill(r * 0.5, 0, 0, this.alpha);
    p.noStroke();
    for (let i = 0;i < 5; i++) {
      const angle = i / 5 * Math.PI * 2;
      const radius = this.size * (Math.random() * 0.5 + 0.5);
      p.ellipse((this.x + Math.cos(angle) * radius) * mapScale, (this.y + Math.sin(angle) * radius) * mapScale, this.size * 0.5 * mapScale);
    }
    p.pop();
  };
}

class DeathAnimation {
  x;
  y;
  color;
  radius = 0;
  maxRadius = 15;
  alpha = 255;
  alive = true;
  constructor(x, y, teamColor) {
    this.x = x;
    this.y = y;
    this.color = teamColor;
  }
  update = () => {
    this.radius += 1.5;
    this.alpha -= 15;
    if (this.alpha <= 0 || this.radius >= this.maxRadius) {
      this.alive = false;
    }
  };
  draw = (mapScale, p) => {
    if (!this.alive)
      return;
    const teamColorObj = p.color(this.color);
    const r = p.red(teamColorObj);
    const g = p.green(teamColorObj);
    const b = p.blue(teamColorObj);
    p.noFill();
    p.stroke(r, g, b, this.alpha);
    p.strokeWeight(2);
    p.circle(this.x * mapScale, this.y * mapScale, this.radius * 2 * mapScale);
    p.stroke(255, 255, 255, this.alpha * 0.5);
    p.strokeWeight(1);
    p.circle(this.x * mapScale, this.y * mapScale, this.radius * 1.5 * mapScale);
  };
}

class LevelUpEffect {
  x;
  y;
  radius = 0;
  maxRadius = 25;
  alpha = 255;
  alive = true;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  update = () => {
    this.radius += 2;
    this.alpha -= 10;
    if (this.alpha <= 0 || this.radius >= this.maxRadius) {
      this.alive = false;
    }
  };
  draw = (mapScale, p) => {
    if (!this.alive)
      return;
    p.push();
    p.noFill();
    p.stroke(255, 215, 0, this.alpha);
    p.strokeWeight(3);
    p.circle(this.x * mapScale, this.y * mapScale, this.radius * 2 * mapScale);
    for (let i = 0;i < 8; i++) {
      const angle = i / 8 * Math.PI * 2;
      const r = this.radius * 0.7;
      p.fill(255, 255, 0, this.alpha);
      p.noStroke();
      p.ellipse((this.x + Math.cos(angle) * r) * mapScale, (this.y + Math.sin(angle) * r) * mapScale, 3 * mapScale);
    }
    p.pop();
  };
}

// src/entities/Soldier.ts
class Soldier {
  x;
  y;
  vx = 0;
  vy = 0;
  teamIndex;
  teamColor;
  size = SOLDIER.size;
  maxSpeed = SOLDIER.maxSpeed;
  health = SOLDIER.health;
  maxHealth = SOLDIER.health;
  baseDamage = SOLDIER.damage;
  damage = SOLDIER.damage;
  attackRange = SOLDIER.attackRange;
  attackCooldown = 0;
  hitCooldown = 0;
  xp = 0;
  level = 1;
  kills = 0;
  isAlive = true;
  alive = true;
  morale = 100;
  isFleeing = false;
  currentFrame;
  frameCounter = 0;
  frameSpeed = ANIMATION.SOLDIER_FRAME_SPEED;
  rotation = 0;
  constructor(p, x, y, teamIndex, teamColor) {
    this.x = x + p.random(-20, 20);
    this.y = y + p.random(-20, 20);
    this.teamIndex = teamIndex;
    this.teamColor = teamColor;
    this.currentFrame = Math.floor(p.random(4));
  }
  gainXP = (amount) => {
    this.xp += amount;
    const xpNeeded = this.level * COMBAT.XP_PER_LEVEL;
    if (this.xp >= xpNeeded) {
      this.levelUp();
    }
  };
  levelUp = () => {
    this.level++;
    this.xp = 0;
    this.maxHealth = Math.floor(this.maxHealth * COMBAT.LEVEL_HEALTH_MULTIPLIER);
    this.health = this.maxHealth;
    this.damage = Math.floor(this.damage * COMBAT.LEVEL_DAMAGE_MULTIPLIER);
    this.maxSpeed *= COMBAT.LEVEL_SPEED_MULTIPLIER;
    return new LevelUpEffect(this.x, this.y);
  };
  update = (teams, obstacles, spatialGrid, p, rewardSystem) => {
    if (!this.alive || this.health <= 0) {
      this.alive = false;
      return;
    }
    if (this.hitCooldown > 0)
      this.hitCooldown--;
    if (this.attackCooldown > 0)
      this.attackCooldown--;
    if (this.isInsideObstacle(obstacles)) {
      this.escapeFromObstacle(obstacles, p);
      this.vx = 0;
      this.vy = 0;
      return;
    }
    let targetX = teams[this.teamIndex].targetX;
    let targetY = teams[this.teamIndex].targetY;
    if (this.isFleeing) {
      const nearestEnemy = this.findNearestEnemy(spatialGrid);
      if (nearestEnemy) {
        targetX = this.x + (this.x - nearestEnemy.x) * 2;
        targetY = this.y + (this.y - nearestEnemy.y) * 2;
      }
    }
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 0) {
      const force = teams[this.teamIndex].isPlayer ? PHYSICS.CURSOR_ATTRACTION : 0.2;
      const actualForce = this.isFleeing ? force * 1.5 : force;
      this.vx += dx / distance * actualForce;
      this.vy += dy / distance * actualForce;
    }
    this.vx *= PHYSICS.FRICTION;
    this.vy *= PHYSICS.FRICTION;
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed < PHYSICS.VELOCITY_STOP_THRESHOLD && distance < 5) {
      this.vx = 0;
      this.vy = 0;
      return;
    }
    let effectiveMaxSpeed = this.maxSpeed;
    if (this.teamIndex === 0 && rewardSystem) {
      effectiveMaxSpeed *= rewardSystem.getSpeedMultiplier();
    }
    if (speed > effectiveMaxSpeed) {
      this.vx = this.vx / speed * effectiveMaxSpeed;
      this.vy = this.vy / speed * effectiveMaxSpeed;
    }
    const oldX = this.x;
    const oldY = this.y;
    this.x += this.vx;
    this.y += this.vy;
    this.checkObstacleCollision(oldX, oldY, obstacles);
    this.constrainToMap();
    this.updateAnimation();
    if (speed > 0.1) {
      this.rotation = Math.atan2(this.vy, this.vx);
    }
  };
  updateAnimation = () => {
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
  separate = (spatialGrid) => {
    const nearby = spatialGrid.getNearby(this, SOLDIER.spacing * 4);
    const minDistSq = this.size * 2 * (this.size * 2);
    for (const other of nearby) {
      if (other === this || !other.alive)
        continue;
      const dx = this.x - other.x;
      const dy = this.y - other.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < PHYSICS.MIN_SEPARATION_DISTANCE)
        continue;
      const isEnemy = other.teamIndex !== this.teamIndex;
      if (isEnemy) {
        if (distSq < minDistSq && distSq > 0.1) {
          const distance = Math.sqrt(distSq);
          const minDistance = this.size * 2;
          const overlap = minDistance - distance;
          const invDist = 1 / distance;
          const pushDistance = overlap * 0.3;
          this.x += dx * invDist * pushDistance;
          this.y += dy * invDist * pushDistance;
          const force = 0.8;
          this.vx += dx * invDist * force;
          this.vy += dx * invDist * force;
          this.vx *= 0.85;
          this.vy *= 0.85;
        }
      } else {
        if (distSq < minDistSq && distSq > 0.1) {
          const distance = Math.sqrt(distSq);
          const minDistance = this.size * 2;
          const overlap = minDistance - distance;
          const invDist = 1 / distance;
          const pushDistance = overlap * 0.4;
          this.x += dx * invDist * pushDistance;
          this.y += dy * invDist * pushDistance;
          const force = 0.5;
          this.vx += dx * invDist * force;
          this.vy += dy * invDist * force;
        } else {
          const mediumRangeSq = SOLDIER.spacing * 2 * (SOLDIER.spacing * 2);
          if (distSq < mediumRangeSq && distSq > 0.1) {
            const distance = Math.sqrt(distSq);
            const force = (SOLDIER.spacing * 2 - distance) / (SOLDIER.spacing * 2);
            const actualForce = force * PHYSICS.SEPARATION_FORCE * 0.5;
            const invDist = 1 / distance;
            this.vx += dx * invDist * actualForce;
            this.vy += dy * invDist * actualForce;
          }
        }
      }
    }
  };
  checkEnemyCollision = (spatialGrid, teams, bloodSplatters, deathAnimations, playPopSound2, p, rewardSystem) => {
    if (this.attackCooldown > 0)
      return;
    const nearest = this.findNearestEnemy(spatialGrid);
    if (nearest) {
      const dx = this.x - nearest.x;
      const dy = this.y - nearest.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.size * 2) {
        let baseCritChance = COMBAT.CRIT_CHANCE;
        let damageMultiplier = 1;
        let damageReduction = 0;
        if (this.teamIndex === 0 && rewardSystem) {
          baseCritChance += rewardSystem.getCritChanceBonus();
          damageMultiplier = rewardSystem.getDamageMultiplier();
        }
        if (nearest.teamIndex === 0 && rewardSystem) {
          damageReduction = rewardSystem.getDamageReduction();
        }
        const isCrit = p.random() < baseCritChance;
        let finalDamage = isCrit ? this.damage * COMBAT.CRIT_MULTIPLIER : this.damage;
        finalDamage *= damageMultiplier;
        finalDamage *= 1 - damageReduction;
        if (rewardSystem && rewardSystem.isChampionInvincible(nearest)) {
          finalDamage = 0;
        }
        nearest.health -= finalDamage;
        nearest.hitCooldown = 10;
        this.attackCooldown = SOLDIER.attackCooldown;
        if (finalDamage > 0) {
          bloodSplatters.push(new BloodSplatter(nearest.x, nearest.y, teams[nearest.teamIndex].color));
        }
        if (nearest.health <= 0) {
          nearest.alive = false;
          this.kills++;
          this.gainXP(SOLDIER.xpPerKill);
          deathAnimations.push(new DeathAnimation(nearest.x, nearest.y, teams[nearest.teamIndex].color));
          playPopSound2();
        }
      }
    }
  };
  updateMorale = (spatialGrid) => {
    let nearbyAllies = 0;
    let nearbyEnemies = 0;
    const nearby = spatialGrid.getNearby(this, 100);
    for (const other of nearby) {
      if (!other.alive)
        continue;
      if (other.teamIndex === this.teamIndex) {
        nearbyAllies++;
      } else {
        nearbyEnemies++;
      }
    }
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
  draw = (sprite, mapScale, p) => {
    if (!this.alive)
      return;
    const screenX = this.x * mapScale;
    const screenY = this.y * mapScale;
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
    if (this.level >= 3) {
      this.drawLevelStars(screenX, screenY, mapScale, p);
    }
    if (this.isFleeing) {
      this.drawFleeingIndicator(screenX, screenY, mapScale, p);
    }
    if (this.xp > 0 && this.level < 10) {
      this.drawXPBar(screenX, screenY, mapScale, p);
    }
  };
  findNearestEnemy = (spatialGrid) => {
    let nearest = null;
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
  isInsideObstacle = (obstacles) => {
    for (const obstacle of obstacles) {
      if (this.collidesWithObstacle(obstacle)) {
        return true;
      }
    }
    return false;
  };
  escapeFromObstacle = (obstacles, p) => {
    let bestDistance = Infinity;
    let bestX = this.x;
    let bestY = this.y;
    for (let angle = 0;angle < Math.PI * 2; angle += Math.PI / 4) {
      for (let radius = this.size + 3;radius < 50; radius += 3) {
        const testX = this.x + Math.cos(angle) * radius;
        const testY = this.y + Math.sin(angle) * radius;
        if (testX < this.size || testX > PHYSICS.MAP_SIZE - this.size || testY < this.size || testY > PHYSICS.MAP_SIZE - this.size) {
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
      if (bestDistance < 15)
        break;
    }
    const moveSpeed = 0.3;
    this.x = p.lerp(this.x, bestX, moveSpeed);
    this.y = p.lerp(this.y, bestY, moveSpeed);
  };
  checkObstacleCollision = (oldX, oldY, obstacles) => {
    for (const obstacle of obstacles) {
      if (this.collidesWithObstacle(obstacle)) {
        const closestPoint = obstacle.getClosestPoint(this);
        if (closestPoint) {
          const dx = this.x - closestPoint.x;
          const dy = this.y - closestPoint.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > 0.1) {
            const dist = Math.sqrt(distSq);
            const pushDistance = this.size + 3;
            const invDist = 1 / dist;
            this.x = closestPoint.x + dx * invDist * pushDistance;
            this.y = closestPoint.y + dy * invDist * pushDistance;
            const dotProduct = (this.vx * dx + this.vy * dy) * invDist;
            if (dotProduct < 0) {
              this.vx -= dx * invDist * dotProduct;
              this.vy -= dy * invDist * dotProduct;
            }
            this.vx *= 0.95;
            this.vy *= 0.95;
          } else {
            this.x = oldX;
            this.y = oldY;
            this.vx *= 0.5;
            this.vy *= 0.5;
          }
        }
        return;
      }
    }
  };
  collidesWithObstacle = (obstacle) => {
    const buffer = this.size + 1;
    return obstacle.collidesWith(this, buffer).collides;
  };
  constrainToMap = () => {
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
  drawLevelStars = (screenX, screenY, mapScale, p) => {
    p.push();
    p.translate(screenX, screenY);
    const starCount = Math.min(this.level - 2, 5);
    const starSize = 4 * mapScale;
    const yOffset = -this.size * mapScale - 8 * mapScale;
    for (let i = 0;i < starCount; i++) {
      const xOffset = (i - (starCount - 1) / 2) * 6 * mapScale;
      p.fill(255, 215, 0);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(starSize * 2);
      p.text("★", xOffset, yOffset);
    }
    p.pop();
  };
  drawFleeingIndicator = (screenX, screenY, mapScale, p) => {
    p.push();
    p.translate(screenX, screenY);
    p.fill(255, 50, 50);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(8 * mapScale);
    p.text("⚑", 0, -this.size * mapScale - 6 * mapScale);
    p.pop();
  };
  drawXPBar = (screenX, screenY, mapScale, p) => {
    p.push();
    p.translate(screenX, screenY);
    const barWidth = this.size * 2 * mapScale;
    const barHeight = 2 * mapScale;
    const yOffset = this.size * mapScale + 4 * mapScale;
    const xpNeeded = this.level * COMBAT.XP_PER_LEVEL;
    const xpProgress = this.xp / xpNeeded;
    p.fill(40, 40, 40, 150);
    p.noStroke();
    p.rect(-barWidth / 2, yOffset, barWidth, barHeight);
    p.fill(255, 215, 0, 200);
    p.rect(-barWidth / 2, yOffset, barWidth * xpProgress, barHeight);
    p.pop();
  };
}

// src/systems/GameState.ts
class GameStateManager {
  gameState = "playing" /* PLAYING */;
  initializeTeams = () => {
    const playerTeam = {
      name: TEAM_COLORS[0 /* RED */].name,
      color: TEAM_COLORS[0 /* RED */].color,
      active: true,
      isPlayer: true,
      targetX: 500,
      targetY: 500,
      targetUpdateTimer: 0
    };
    const enemyTeam = {
      name: "Enemies",
      color: TEAM_COLORS[1 /* BLUE */].color,
      active: true,
      isPlayer: false,
      targetX: 100,
      targetY: 100,
      targetUpdateTimer: 0
    };
    return { playerTeam, enemyTeam };
  };
  spawnPlayerSoldiers = (particlesPerTeam, p) => {
    const soldiers = [];
    const spawnPos = SPAWN_POSITIONS[0 /* RED */];
    for (let j = 0;j < particlesPerTeam; j++) {
      const angle = j / particlesPerTeam * Math.PI * 2;
      const radius = 50 + Math.floor(j / 8) * 30;
      const offsetX = Math.cos(angle) * radius;
      const offsetY = Math.sin(angle) * radius;
      soldiers.push(new Soldier(p, spawnPos.x + offsetX, spawnPos.y + offsetY, 0 /* RED */, TEAM_COLORS[0 /* RED */].color));
    }
    return soldiers;
  };
  checkLoseCondition = (soldiers) => {
    const hasPlayerSoldiers = soldiers.some((s) => s.isAlive && s.teamIndex === 0 /* RED */);
    if (!hasPlayerSoldiers) {
      this.gameState = "game_over" /* GAME_OVER */;
      return true;
    }
    return false;
  };
  getTeamCounts = (soldiers) => {
    const playerCount = soldiers.filter((s) => s.isAlive && s.teamIndex === 0 /* RED */).length;
    const enemyCount = soldiers.filter((s) => s.isAlive && s.teamIndex === 1 /* BLUE */).length;
    return { player: playerCount, enemy: enemyCount };
  };
  reset = () => {
    this.gameState = "playing" /* PLAYING */;
  };
}

// src/systems/WaveSystem.ts
class WaveSystem {
  p;
  context;
  constructor(p, context) {
    this.p = p;
    this.context = context;
  }
  initializeWaveState = () => {
    const difficultyConfig = DIFFICULTY_CONFIGS.find((config) => config.difficulty === this.context.difficulty);
    return {
      currentWave: 1,
      enemiesInWave: difficultyConfig.waveConfig.baseEnemyCount,
      enemiesRemaining: difficultyConfig.waveConfig.baseEnemyCount,
      waveStartTime: this.p.millis(),
      waveDuration: difficultyConfig.waveConfig.waveDuration * 1000,
      isTransitioning: false,
      transitionStartTime: 0
    };
  };
  initializeScoreState = () => {
    return {
      totalScore: 0,
      kills: 0,
      wavesCompleted: 0
    };
  };
  update = (soldiers) => {
    const { waveState, enemyTeam } = this.context;
    const enemyCount = soldiers.filter((s) => s.isAlive && s.teamIndex === 1 /* BLUE */).length;
    waveState.enemiesRemaining = enemyCount;
    if (enemyCount === 0 && !waveState.isTransitioning) {
      this.completeWave();
      return false;
    }
    if (waveState.isTransitioning) {
      const transitionDuration = this.getTransitionDuration();
      if (this.p.millis() - waveState.transitionStartTime >= transitionDuration) {
        this.startNextWave(soldiers);
      }
      return false;
    }
    const elapsedTime = this.p.millis() - waveState.waveStartTime;
    if (elapsedTime >= waveState.waveDuration) {
      this.awardSurvivalBonus();
      this.completeWave();
      return false;
    }
    return false;
  };
  completeWave = () => {
    const { waveState, scoreState } = this.context;
    const difficultyConfig = DIFFICULTY_CONFIGS.find((config) => config.difficulty === this.context.difficulty);
    const baseBonus = SCORING.WAVE_COMPLETION_BONUS;
    const elapsedTime = this.p.millis() - waveState.waveStartTime;
    const timeRatio = 1 - elapsedTime / waveState.waveDuration;
    const timeBonus = Math.floor(baseBonus * SCORING.TIME_BONUS_MULTIPLIER * Math.max(0, timeRatio));
    const totalBonus = Math.floor((baseBonus + timeBonus) * difficultyConfig.pointsMultiplier);
    scoreState.totalScore += totalBonus;
    scoreState.wavesCompleted += 1;
    waveState.isTransitioning = true;
    waveState.transitionStartTime = this.p.millis();
  };
  awardSurvivalBonus = () => {
    const { scoreState } = this.context;
    const difficultyConfig = DIFFICULTY_CONFIGS.find((config) => config.difficulty === this.context.difficulty);
    const bonus = Math.floor(SCORING.SURVIVAL_BONUS * difficultyConfig.pointsMultiplier);
    scoreState.totalScore += bonus;
  };
  startNextWave = (soldiers) => {
    const { waveState } = this.context;
    waveState.currentWave += 1;
    const difficultyConfig = DIFFICULTY_CONFIGS.find((config) => config.difficulty === this.context.difficulty);
    waveState.enemiesInWave = difficultyConfig.waveConfig.baseEnemyCount + (waveState.currentWave - 1) * difficultyConfig.waveConfig.enemyCountIncrease;
    waveState.enemiesRemaining = waveState.enemiesInWave;
    this.spawnWaveEnemies(soldiers);
    waveState.waveStartTime = this.p.millis();
    waveState.isTransitioning = false;
  };
  spawnWaveEnemies = (soldiers) => {
    const { waveState, enemyTeam } = this.context;
    const enemyStats = this.calculateEnemyStats(waveState.currentWave);
    const spawnPos = SPAWN_POSITIONS[1 /* BLUE */];
    for (let i = 0;i < waveState.enemiesInWave; i++) {
      const angle = i / waveState.enemiesInWave * Math.PI * 2;
      const radius = 50 + Math.floor(i / 8) * 30;
      const offsetX = Math.cos(angle) * radius;
      const offsetY = Math.sin(angle) * radius;
      const soldier = new Soldier(this.p, spawnPos.x + offsetX, spawnPos.y + offsetY, 1 /* BLUE */, enemyTeam.color);
      soldier.maxHealth = enemyStats.health;
      soldier.health = enemyStats.health;
      soldier.baseDamage = enemyStats.damage;
      soldier.damage = enemyStats.damage;
      soldier.maxSpeed = enemyStats.speed;
      soldiers.push(soldier);
    }
  };
  calculateEnemyStats = (waveNumber) => {
    const difficultyConfig = DIFFICULTY_CONFIGS.find((config) => config.difficulty === this.context.difficulty);
    let health = SOLDIER.health * difficultyConfig.enemyHealthMultiplier;
    let damage = SOLDIER.damage * difficultyConfig.enemyDamageMultiplier;
    let speed = SOLDIER.maxSpeed * difficultyConfig.enemySpeedMultiplier;
    const waveMultiplier = Math.pow(difficultyConfig.waveConfig.statMultiplierPerWave, waveNumber - 1);
    health *= waveMultiplier;
    damage *= waveMultiplier;
    speed = Math.min(speed * waveMultiplier, SOLDIER.maxSpeed * 2);
    return {
      health: Math.floor(health),
      damage: Math.floor(damage),
      speed
    };
  };
  awardKillPoints = () => {
    const { scoreState } = this.context;
    const difficultyConfig = DIFFICULTY_CONFIGS.find((config) => config.difficulty === this.context.difficulty);
    const points = Math.floor(SCORING.POINTS_PER_KILL * difficultyConfig.pointsMultiplier);
    scoreState.totalScore += points;
    scoreState.kills += 1;
  };
  getRemainingTime = () => {
    const { waveState } = this.context;
    const elapsed = this.p.millis() - waveState.waveStartTime;
    const remaining = Math.max(0, waveState.waveDuration - elapsed);
    return Math.ceil(remaining / 1000);
  };
  getTransitionDuration = () => {
    const difficultyConfig = DIFFICULTY_CONFIGS.find((config) => config.difficulty === this.context.difficulty);
    return difficultyConfig.waveConfig.waveTransitionDelay * 1000;
  };
  getTransitionRemainingTime = () => {
    const { waveState } = this.context;
    if (!waveState.isTransitioning)
      return 0;
    const elapsed = this.p.millis() - waveState.transitionStartTime;
    const remaining = Math.max(0, this.getTransitionDuration() - elapsed);
    return Math.ceil(remaining / 1000);
  };
}

// src/entities/Reward.ts
class Reward {
  x;
  y;
  type;
  collected = false;
  pulseAnimation = 0;
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
  update = () => {
    this.pulseAnimation += 0.1;
  };
  checkCollection = (soldiers) => {
    if (this.collected)
      return false;
    for (const soldier of soldiers) {
      if (!soldier.alive || soldier.teamIndex !== 0)
        continue;
      const dx = soldier.x - this.x;
      const dy = soldier.y - this.y;
      const distSq = dx * dx + dy * dy;
      const collectionRadiusSq = REWARDS.COLLECTION_RADIUS * REWARDS.COLLECTION_RADIUS;
      if (distSq < collectionRadiusSq) {
        this.collected = true;
        return true;
      }
    }
    return false;
  };
  draw = (mapScale, p) => {
    if (this.collected)
      return;
    const config = REWARD_CONFIGS[this.type];
    const screenX = this.x * mapScale;
    const screenY = this.y * mapScale;
    const size = REWARDS.PICKUP_SIZE * mapScale;
    const pulse = Math.sin(this.pulseAnimation) * 0.2 + 1;
    const glowSize = size * pulse;
    p.push();
    p.translate(screenX, screenY);
    p.noStroke();
    if (config.rarity === "legendary") {
      p.fill(255, 215, 0, 100);
      p.circle(0, 0, glowSize * 2);
    } else if (config.rarity === "rare") {
      p.fill(147, 51, 234, 100);
      p.circle(0, 0, glowSize * 1.8);
    } else {
      p.fill(100, 200, 255, 80);
      p.circle(0, 0, glowSize * 1.5);
    }
    p.fill(config.color);
    p.stroke(255, 255, 255);
    p.strokeWeight(3 * mapScale);
    p.circle(0, 0, size);
    p.noStroke();
    p.fill(255, 255, 255);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(size * 0.6);
    p.text(config.icon, 0, 0);
    if (config.rarity === "legendary") {
      p.noStroke();
      p.fill(255, 215, 0);
      for (let i = 0;i < 6; i++) {
        const angle = this.pulseAnimation + i / 6 * p.TWO_PI;
        const radius = size * 0.8;
        const px = p.cos(angle) * radius;
        const py = p.sin(angle) * radius;
        p.circle(px, py, 4 * mapScale);
      }
    }
    p.pop();
  };
}

// src/systems/RewardSystem.ts
class RewardSystem {
  p;
  context;
  activeRewards = [];
  constructor(p, context) {
    this.p = p;
    this.context = context;
  }
  initializeRewardState = () => {
    return {
      activeRewards: [],
      notifications: []
    };
  };
  spawnReward = (waveNumber) => {
    const rewardType = this.selectRandomReward(waveNumber);
    const centerX = PHYSICS.MAP_SIZE / 2;
    const centerY = PHYSICS.MAP_SIZE / 2;
    const offsetX = this.p.random(-100, 100);
    const offsetY = this.p.random(-100, 100);
    const reward = new Reward(centerX + offsetX, centerY + offsetY, rewardType);
    this.activeRewards.push(reward);
  };
  selectRandomReward = (waveNumber) => {
    const legendaryChance = Math.min(0.4, REWARDS.BASE_LEGENDARY_CHANCE + (waveNumber - 1) * REWARDS.LEGENDARY_CHANCE_PER_WAVE);
    const rareChance = Math.min(0.5, REWARDS.BASE_RARE_CHANCE + (waveNumber - 1) * REWARDS.RARE_CHANCE_PER_WAVE);
    const commonChance = 1 - legendaryChance - rareChance;
    const roll = this.p.random();
    let rarity;
    if (roll < legendaryChance) {
      rarity = "legendary";
    } else if (roll < legendaryChance + rareChance) {
      rarity = "rare";
    } else {
      rarity = "common";
    }
    const availableRewards = Object.entries(REWARD_CONFIGS).filter(([_, config]) => config.rarity === rarity).map(([type, _]) => type);
    const randomIndex = Math.floor(this.p.random() * availableRewards.length);
    return availableRewards[randomIndex];
  };
  update = (soldiers) => {
    const { rewardState } = this.context;
    for (let i = this.activeRewards.length - 1;i >= 0; i--) {
      const reward = this.activeRewards[i];
      reward.update();
      if (reward.checkCollection(soldiers)) {
        this.applyReward(reward.type, soldiers);
        this.activeRewards.splice(i, 1);
      }
    }
    const currentTime = this.p.millis();
    rewardState.activeRewards = rewardState.activeRewards.filter((reward) => currentTime - reward.startTime < reward.duration);
    rewardState.notifications = rewardState.notifications.filter((notif) => currentTime - notif.startTime < notif.duration);
  };
  applyReward = (type, soldiers) => {
    const { rewardState, playerTeam } = this.context;
    const config = REWARD_CONFIGS[type];
    const currentTime = this.p.millis();
    rewardState.notifications.push({
      message: `${config.icon} ${config.name}: ${config.description}`,
      startTime: currentTime,
      duration: REWARDS.NOTIFICATION_DURATION
    });
    switch (type) {
      case "damage_boost" /* DAMAGE_BOOST */:
        rewardState.activeRewards.push({
          type,
          startTime: currentTime,
          duration: 60000
        });
        break;
      case "speed_boost" /* SPEED_BOOST */:
        rewardState.activeRewards.push({
          type,
          startTime: currentTime,
          duration: 45000
        });
        break;
      case "troop_reinforcement" /* TROOP_REINFORCEMENT */:
        this.spawnReinforcements(50, soldiers);
        break;
      case "shadow_troops" /* SHADOW_TROOPS */:
        this.spawnShadowTroops(10, soldiers);
        break;
      case "health_regen" /* HEALTH_REGENERATION */:
        this.healAllTroops(soldiers);
        break;
      case "critical_mastery" /* CRITICAL_MASTERY */:
        rewardState.activeRewards.push({
          type,
          startTime: currentTime,
          duration: 30000
        });
        break;
      case "immortal_champion" /* IMMORTAL_CHAMPION */:
        this.spawnChampion(soldiers);
        rewardState.activeRewards.push({
          type,
          startTime: currentTime,
          duration: 20000
        });
        break;
      case "army_expansion" /* ARMY_EXPANSION */:
        this.spawnReinforcements(100, soldiers);
        break;
      case "berserker_rage" /* BERSERKER_RAGE */:
        rewardState.activeRewards.push({
          type,
          startTime: currentTime,
          duration: 30000
        });
        break;
      case "divine_shield" /* DIVINE_SHIELD */:
        rewardState.activeRewards.push({
          type,
          startTime: currentTime,
          duration: 45000
        });
        break;
    }
  };
  spawnReinforcements = (count, soldiers) => {
    const spawnPos = SPAWN_POSITIONS[0 /* RED */];
    for (let i = 0;i < count; i++) {
      const angle = i / count * Math.PI * 2;
      const radius = 50 + Math.floor(i / 8) * 30;
      const offsetX = Math.cos(angle) * radius;
      const offsetY = Math.sin(angle) * radius;
      const soldier = new Soldier(this.p, spawnPos.x + offsetX, spawnPos.y + offsetY, 0 /* RED */, this.context.playerTeam.color);
      soldiers.push(soldier);
    }
  };
  spawnShadowTroops = (count, soldiers) => {
    const spawnPos = SPAWN_POSITIONS[0 /* RED */];
    for (let i = 0;i < count; i++) {
      const angle = i / count * Math.PI * 2;
      const radius = 60;
      const offsetX = Math.cos(angle) * radius;
      const offsetY = Math.sin(angle) * radius;
      const soldier = new Soldier(this.p, spawnPos.x + offsetX, spawnPos.y + offsetY, 0 /* RED */, "#1a1a2e");
      soldier.maxHealth = SOLDIER.health * REWARDS.SHADOW_TROOP_STATS_MULTIPLIER;
      soldier.health = soldier.maxHealth;
      soldier.damage = SOLDIER.damage * REWARDS.SHADOW_TROOP_STATS_MULTIPLIER;
      soldier.baseDamage = soldier.damage;
      soldier.maxSpeed = SOLDIER.maxSpeed * 1.8;
      soldier.attackRange = SOLDIER.attackRange * 1.5;
      soldier.isShadowTroop = true;
      soldiers.push(soldier);
    }
  };
  spawnChampion = (soldiers) => {
    const spawnPos = SPAWN_POSITIONS[0 /* RED */];
    const champion = new Soldier(this.p, spawnPos.x, spawnPos.y, 0 /* RED */, "#FFD700");
    champion.maxHealth = SOLDIER.health * REWARDS.CHAMPION_STATS_MULTIPLIER;
    champion.health = champion.maxHealth;
    champion.damage = SOLDIER.damage * REWARDS.CHAMPION_STATS_MULTIPLIER;
    champion.baseDamage = champion.damage;
    champion.maxSpeed = SOLDIER.maxSpeed * 1.5;
    champion.size = SOLDIER.size * 1.5;
    champion.attackRange = SOLDIER.attackRange * 2;
    champion.isChampion = true;
    champion.championStartTime = this.p.millis();
    soldiers.push(champion);
  };
  healAllTroops = (soldiers) => {
    for (const soldier of soldiers) {
      if (soldier.alive && soldier.teamIndex === 0 /* RED */) {
        soldier.health = soldier.maxHealth;
      }
    }
  };
  isRewardActive = (type) => {
    return this.context.rewardState.activeRewards.some((r) => r.type === type);
  };
  getDamageMultiplier = () => {
    let multiplier = 1;
    if (this.isRewardActive("damage_boost" /* DAMAGE_BOOST */)) {
      multiplier *= 2;
    }
    if (this.isRewardActive("berserker_rage" /* BERSERKER_RAGE */)) {
      multiplier *= 3;
    }
    return multiplier;
  };
  getSpeedMultiplier = () => {
    let multiplier = 1;
    if (this.isRewardActive("speed_boost" /* SPEED_BOOST */)) {
      multiplier *= 1.5;
    }
    if (this.isRewardActive("berserker_rage" /* BERSERKER_RAGE */)) {
      multiplier *= 0.5;
    }
    return multiplier;
  };
  getCritChanceBonus = () => {
    if (this.isRewardActive("critical_mastery" /* CRITICAL_MASTERY */)) {
      return 0.5;
    }
    return 0;
  };
  getDamageReduction = () => {
    if (this.isRewardActive("divine_shield" /* DIVINE_SHIELD */)) {
      return 0.5;
    }
    return 0;
  };
  isChampionInvincible = (soldier) => {
    if (!soldier.isChampion)
      return false;
    const championStartTime = soldier.championStartTime;
    if (!championStartTime)
      return false;
    const activeChampion = this.context.rewardState.activeRewards.find((r) => r.type === "immortal_champion" /* IMMORTAL_CHAMPION */);
    if (!activeChampion)
      return false;
    const currentTime = this.p.millis();
    return currentTime - activeChampion.startTime < activeChampion.duration;
  };
  draw = (mapScale) => {
    for (const reward of this.activeRewards) {
      reward.draw(mapScale, this.p);
    }
  };
  clear = () => {
    this.activeRewards = [];
  };
}

// src/rendering/GameRenderer.ts
class GameRenderer {
  backgroundImg = null;
  mapScale = 1;
  offsetX = 0;
  offsetY = 0;
  setBackground = (img) => {
    this.backgroundImg = img;
  };
  updateMapScale = (p) => {
    this.mapScale = Math.min(p.width / PHYSICS.MAP_SIZE, p.height / PHYSICS.MAP_SIZE);
    const displayWidth = PHYSICS.MAP_SIZE * this.mapScale;
    const displayHeight = PHYSICS.MAP_SIZE * this.mapScale;
    this.offsetX = (p.width - displayWidth) / 2;
    this.offsetY = (p.height - displayHeight) / 2;
  };
  render = (soldiers, obstacles, teams, combatSystem, soldierSprites, playerTeamIndex, p) => {
    this.updateMapScale(p);
    p.background(30);
    if (this.backgroundImg) {
      p.image(this.backgroundImg, 0, 0, p.width, p.height);
    }
    p.fill(20, 15, 10, 150);
    p.noStroke();
    p.rect(0, 0, p.width, p.height);
    p.push();
    p.translate(this.offsetX, this.offsetY);
    for (const obstacle of obstacles) {
      obstacle.draw(this.mapScale, p);
    }
    combatSystem.draw(this.mapScale, p);
    for (const soldier of soldiers) {
      if (soldier.alive) {
        const sprite = soldierSprites[soldier.teamIndex];
        soldier.draw(sprite, this.mapScale, p);
      }
    }
    this.drawCursorIndicator(teams[playerTeamIndex], p);
    p.pop();
  };
  drawCursorIndicator = (playerTeam, p) => {
    if (!playerTeam.active)
      return;
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

// src/rendering/UIRenderer.ts
class UIRenderer {
  renderGameUI = (context, playerCount, enemyCount, remainingTime, p) => {
    const { waveState, scoreState, rewardState } = context;
    const barHeight = 60;
    p.fill(20, 20, 30, 230);
    p.noStroke();
    p.rect(0, 0, p.width, barHeight);
    p.noFill();
    p.stroke(255, 215, 0);
    p.strokeWeight(2);
    p.rect(0, 0, p.width, barHeight);
    p.fill(255, 215, 0);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(24);
    p.textStyle(p.BOLD);
    p.noStroke();
    p.text(`Score: ${scoreState.totalScore}`, 20, barHeight / 2 - 8);
    p.fill(200, 200, 200);
    p.textSize(14);
    p.textStyle(p.NORMAL);
    p.text(`Kills: ${scoreState.kills}`, 20, barHeight / 2 + 12);
    p.fill(255, 255, 255);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(28);
    p.textStyle(p.BOLD);
    if (waveState.isTransitioning) {
      p.fill(100, 255, 100);
      p.text(`Wave ${waveState.currentWave} Complete!`, p.width / 2, barHeight / 2 - 8);
      p.fill(200, 200, 200);
      p.textSize(14);
      p.textStyle(p.NORMAL);
      p.text(`Next wave in ${this.formatTime(remainingTime)}`, p.width / 2, barHeight / 2 + 12);
    } else {
      p.text(`Wave ${waveState.currentWave}`, p.width / 2, barHeight / 2 - 8);
      const timeColor = this.getTimeColor(remainingTime, waveState.waveDuration / 1000);
      p.fill(timeColor);
      p.textSize(16);
      p.textStyle(p.NORMAL);
      p.text(`Time: ${this.formatTime(remainingTime)}`, p.width / 2, barHeight / 2 + 12);
    }
    p.textAlign(p.RIGHT, p.CENTER);
    p.textSize(20);
    p.textStyle(p.BOLD);
    p.fill(100, 255, 100);
    p.text(`Your Army: ${playerCount}`, p.width - 20, barHeight / 2 - 8);
    p.fill(255, 100, 100);
    p.textSize(16);
    p.textStyle(p.NORMAL);
    p.text(`Enemies: ${enemyCount}`, p.width - 20, barHeight / 2 + 12);
    this.renderRewardNotifications(rewardState, p);
  };
  renderRewardNotifications = (rewardState, p) => {
    const currentTime = p.millis();
    const notifications = rewardState.notifications;
    for (let i = 0;i < notifications.length; i++) {
      const notif = notifications[i];
      const elapsed = currentTime - notif.startTime;
      const progress = elapsed / notif.duration;
      let alpha = 255;
      if (progress < 0.1) {
        alpha = progress / 0.1 * 255;
      } else if (progress > 0.8) {
        alpha = (1 - progress) / 0.2 * 255;
      }
      const yOffset = 80 + i * 70;
      const bannerHeight = 60;
      const bannerWidth = p.width * 0.6;
      const bannerX = p.width / 2 - bannerWidth / 2;
      p.fill(20, 20, 40, alpha * 0.9);
      p.stroke(255, 215, 0, alpha);
      p.strokeWeight(2);
      p.rect(bannerX, yOffset, bannerWidth, bannerHeight, 10);
      p.noStroke();
      p.fill(255, 215, 0, alpha);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(24);
      p.textStyle(p.BOLD);
      p.text(notif.message, p.width / 2, yOffset + bannerHeight / 2);
    }
  };
  renderGameOver = (context, p) => {
    const { scoreState, waveState } = context;
    p.fill(0, 0, 0, 220);
    p.noStroke();
    p.rect(0, 0, p.width, p.height);
    p.fill(255, 100, 100);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(72);
    p.textStyle(p.BOLD);
    p.stroke(50, 30, 10);
    p.strokeWeight(6);
    p.text("⚔ DEFEATED ⚔", p.width / 2, p.height / 2 - 150);
    const boxWidth = 500;
    const boxHeight = 300;
    const boxX = p.width / 2 - boxWidth / 2;
    const boxY = p.height / 2 - 50;
    p.fill(40, 40, 50);
    p.stroke(255, 215, 0);
    p.strokeWeight(3);
    p.rect(boxX, boxY, boxWidth, boxHeight, 10);
    p.noStroke();
    p.fill(255, 215, 0);
    p.textSize(48);
    p.text(`Final Score: ${scoreState.totalScore}`, p.width / 2, boxY + 60);
    p.fill(200, 200, 200);
    p.textSize(24);
    p.textStyle(p.NORMAL);
    p.text(`Waves Survived: ${scoreState.wavesCompleted}`, p.width / 2, boxY + 120);
    p.text(`Total Kills: ${scoreState.kills}`, p.width / 2, boxY + 160);
    p.text(`Highest Wave: ${waveState.currentWave}`, p.width / 2, boxY + 200);
    p.fill(150, 150, 150);
    p.textSize(18);
    p.text("Click to try again", p.width / 2, p.height / 2 + 200);
    p.fill(255, 215, 0, 80);
    for (let i = 0;i < 15; i++) {
      const angle = i / 15 * p.TWO_PI;
      const radius = 200 + p.sin(p.frameCount * 0.02 + i) * 30;
      const x = p.width / 2 + p.cos(angle) * radius;
      const y = p.height / 2 - 50 + p.sin(angle) * radius;
      p.textSize(20);
      p.text(i % 2 === 0 ? "⚔" : "\uD83D\uDC80", x, y);
    }
  };
  renderWaveTransition = (waveNumber, remainingTime, p) => {
    p.fill(0, 0, 0, 150);
    p.noStroke();
    p.rect(0, 0, p.width, p.height);
    p.fill(100, 255, 100);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(64);
    p.textStyle(p.BOLD);
    p.stroke(20, 100, 20);
    p.strokeWeight(5);
    p.text(`Wave ${waveNumber - 1} Complete!`, p.width / 2, p.height / 2 - 80);
    p.fill(255, 215, 0);
    p.textSize(48);
    p.stroke(50, 30, 10);
    p.strokeWeight(4);
    p.text(`Wave ${waveNumber} Incoming`, p.width / 2, p.height / 2);
    p.fill(255, 255, 255);
    p.textSize(36);
    p.noStroke();
    p.text(`Get ready... ${remainingTime}`, p.width / 2, p.height / 2 + 60);
    p.fill(200, 200, 200);
    p.textSize(20);
    p.textStyle(p.NORMAL);
    p.text("Position your army!", p.width / 2, p.height / 2 + 110);
  };
  formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  getTimeColor = (remainingTime, totalTime) => {
    const ratio = remainingTime / totalTime;
    if (ratio > 0.5) {
      return [100, 255, 100];
    } else if (ratio > 0.25) {
      return [255, 215, 0];
    } else {
      return [255, 100, 100];
    }
  };
}

// src/utils/SpriteGenerator.ts
var generateAllSoldierSprites = (p) => {
  const sprites = [];
  for (let teamIdx = 0;teamIdx < TEAM_COLORS.length; teamIdx++) {
    sprites.push(generateSoldierSpriteSheet(teamIdx, p));
  }
  return sprites;
};
var generateSoldierSpriteSheet = (teamIdx, p) => {
  const spriteSize = SOLDIER.spriteSize;
  const numFrames = UI.ANIMATION_FRAMES;
  const spriteSheet = p.createGraphics(spriteSize * numFrames, spriteSize);
  const teamColor = p.color(TEAM_COLORS[teamIdx].color);
  for (let frame = 0;frame < numFrames; frame++) {
    const x = frame * spriteSize + spriteSize / 2;
    const y = spriteSize / 2;
    drawSoldierFrame(spriteSheet, x, y, frame, numFrames, teamColor, p);
  }
  return spriteSheet;
};
var drawSoldierFrame = (graphics, x, y, frame, numFrames, teamColor, p) => {
  graphics.push();
  graphics.translate(x, y);
  const walkPhase = frame / numFrames * p.TWO_PI;
  const leftFootX = p.sin(walkPhase) * 2.5;
  const rightFootX = p.sin(walkPhase + p.PI) * 2.5;
  graphics.fill(p.red(teamColor) * 0.5, p.green(teamColor) * 0.5, p.blue(teamColor) * 0.5);
  graphics.noStroke();
  graphics.ellipse(-2 + leftFootX, 4, 2.5, 3.5);
  graphics.ellipse(2 + rightFootX, 4, 2.5, 3.5);
  graphics.fill(p.red(teamColor) * 0.7, p.green(teamColor) * 0.7, p.blue(teamColor) * 0.7);
  graphics.quad(-2.5, 0, 2.5, 0, 2 + rightFootX, 4, -2 + leftFootX, 4);
  graphics.fill(teamColor);
  graphics.rect(-3, -4, 6, 6);
  graphics.fill(p.red(teamColor) * 0.8, p.green(teamColor) * 0.8, p.blue(teamColor) * 0.8);
  const armOffset = p.sin(walkPhase) * 0.8;
  graphics.rect(-4, -3 + armOffset, 1, 4);
  graphics.rect(3, -3 - armOffset, 1, 4);
  graphics.fill(p.red(teamColor) * 0.6, p.green(teamColor) * 0.6, p.blue(teamColor) * 0.6);
  graphics.ellipse(0, -5, 4, 4.5);
  graphics.fill(p.red(teamColor) * 0.8, p.green(teamColor) * 0.8, p.blue(teamColor) * 0.8);
  graphics.ellipse(-0.5, -5.5, 1.5, 2);
  graphics.fill(200, 200, 200);
  graphics.noStroke();
  graphics.rect(3.5, -2, 3, 1);
  graphics.triangle(6.5, -2, 8, -2.5, 8, -1.5);
  graphics.fill(100, 80, 60);
  graphics.rect(3.5, -2, 1, 1);
  graphics.pop();
};

// src/entities/Obstacle.ts
class Obstacle {
  x;
  y;
  width;
  height;
  isPolygon = false;
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  collidesWith = (soldier, buffer = 0) => {
    const collides = soldier.x + buffer > this.x && soldier.x - buffer < this.x + this.width && soldier.y + buffer > this.y && soldier.y - buffer < this.y + this.height;
    return { collides };
  };
  getClosestPoint = (soldier) => {
    const cx = Math.max(this.x, Math.min(soldier.x, this.x + this.width));
    const cy = Math.max(this.y, Math.min(soldier.y, this.y + this.height));
    return { x: cx, y: cy };
  };
  draw = (mapScale, p) => {
    p.fill(60, 60, 70);
    p.stroke(80, 80, 90);
    p.strokeWeight(2);
    p.rect(this.x * mapScale, this.y * mapScale, this.width * mapScale, this.height * mapScale);
  };
}

class CastleObstacle {
  x;
  y;
  size;
  isPolygon = true;
  rects;
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.rects = [
      { x: x - size * 0.3, y: y - size * 0.4, w: size * 0.6, h: size * 0.8 },
      { x: x - size * 0.6, y: y - size * 0.3, w: size * 0.35, h: size * 0.6 },
      { x: x + size * 0.25, y: y - size * 0.3, w: size * 0.35, h: size * 0.6 },
      { x: x - size * 0.6, y: y + size * 0.2, w: size * 0.35, h: size * 0.2 },
      { x: x + size * 0.25, y: y + size * 0.2, w: size * 0.35, h: size * 0.2 },
      { x: x - size * 0.25, y: y + size * 0.25, w: size * 0.5, h: size * 0.15 }
    ];
  }
  collidesWith = (soldier, buffer = 0) => {
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
  getClosestPoint = (soldier) => {
    let closestDist = Infinity;
    let closestPoint = { x: soldier.x, y: soldier.y };
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
  draw = (mapScale, p) => {
    p.fill(70, 60, 50);
    p.stroke(90, 80, 70);
    p.strokeWeight(2);
    for (const castleRect of this.rects) {
      p.rect(castleRect.x * mapScale, castleRect.y * mapScale, castleRect.w * mapScale, castleRect.h * mapScale);
    }
    p.fill(80, 70, 60);
    p.noStroke();
    for (let i = 0;i < 3; i++) {
      const bx1 = (this.x - this.size * 0.5 + i * this.size * 0.15) * mapScale;
      const by1 = (this.y - this.size * 0.4) * mapScale;
      p.rect(bx1, by1, this.size * 0.08 * mapScale, this.size * 0.08 * mapScale);
      const bx2 = (this.x + this.size * 0.3 + i * this.size * 0.15) * mapScale;
      p.rect(bx2, by1, this.size * 0.08 * mapScale, this.size * 0.08 * mapScale);
    }
  };
}

// src/utils/MapGenerator.ts
var MAP_SIZE = PHYSICS.MAP_SIZE;
var generateMap = (p) => {
  const obstacles = [];
  obstacles.push(new CastleObstacle(MAP_SIZE / 2, MAP_SIZE / 2, 120));
  obstacles.push(...generateMazeWalls(p));
  obstacles.push(...generateCoverPoints(p));
  obstacles.push(...generateCornerStructures(p));
  return obstacles;
};
var generateMazeWalls = (p) => {
  const obstacles = [];
  const wallThickness = 25;
  const wallLength = 120;
  for (let i = 2;i <= 6; i++) {
    const x = i / 8 * MAP_SIZE;
    if (i !== 4) {
      obstacles.push(new Obstacle(x - wallThickness / 2, MAP_SIZE * 0.15, wallThickness, wallLength + p.random(-20, 20)));
    }
    if (i !== 4) {
      obstacles.push(new Obstacle(x - wallThickness / 2, MAP_SIZE * 0.75, wallThickness, wallLength + p.random(-20, 20)));
    }
  }
  for (let i = 2;i <= 6; i++) {
    const y = i / 8 * MAP_SIZE;
    if (i !== 4 && !isNearSpawnCorner(MAP_SIZE * 0.15, y)) {
      obstacles.push(new Obstacle(MAP_SIZE * 0.15, y - wallThickness / 2, wallLength + p.random(-20, 20), wallThickness));
    }
    if (i !== 4 && !isNearSpawnCorner(MAP_SIZE * 0.75, y)) {
      obstacles.push(new Obstacle(MAP_SIZE * 0.75, y - wallThickness / 2, wallLength + p.random(-20, 20), wallThickness));
    }
  }
  obstacles.push(...generateLShapes(p));
  obstacles.push(...generateTShapes(p));
  return obstacles;
};
var generateLShapes = (p) => {
  const obstacles = [];
  const armLength = 60;
  const thickness = 20;
  const positions = [
    { x: MAP_SIZE * 0.3, y: MAP_SIZE * 0.3 },
    { x: MAP_SIZE * 0.7, y: MAP_SIZE * 0.3 },
    { x: MAP_SIZE * 0.3, y: MAP_SIZE * 0.7 },
    { x: MAP_SIZE * 0.7, y: MAP_SIZE * 0.7 }
  ];
  for (const pos of positions) {
    if (isNearSpawnCorner(pos.x, pos.y) || isNearCenter(pos.x, pos.y))
      continue;
    obstacles.push(new Obstacle(pos.x, pos.y, armLength, thickness));
    obstacles.push(new Obstacle(pos.x, pos.y, thickness, armLength));
  }
  return obstacles;
};
var generateTShapes = (p) => {
  const obstacles = [];
  const armLength = 70;
  const thickness = 18;
  const positions = [
    { x: MAP_SIZE * 0.5, y: MAP_SIZE * 0.2 },
    { x: MAP_SIZE * 0.2, y: MAP_SIZE * 0.5 },
    { x: MAP_SIZE * 0.8, y: MAP_SIZE * 0.5 },
    { x: MAP_SIZE * 0.5, y: MAP_SIZE * 0.8 }
  ];
  for (const pos of positions) {
    if (isNearSpawnCorner(pos.x, pos.y) || isNearCenter(pos.x, pos.y))
      continue;
    obstacles.push(new Obstacle(pos.x - armLength / 2, pos.y - thickness / 2, armLength, thickness));
    obstacles.push(new Obstacle(pos.x - thickness / 2, pos.y, thickness, armLength / 2));
  }
  return obstacles;
};
var generateCoverPoints = (p) => {
  const obstacles = [];
  const coverSize = 30;
  const spacing = 140;
  for (let x = spacing;x < MAP_SIZE; x += spacing) {
    for (let y = spacing;y < MAP_SIZE; y += spacing) {
      if (isNearSpawnCorner(x, y) || isNearCenter(x, y))
        continue;
      if (p.random() > 0.6) {
        const offsetX = p.random(-25, 25);
        const offsetY = p.random(-25, 25);
        const shapeType = p.random();
        if (shapeType < 0.33) {
          obstacles.push(new Obstacle(x + offsetX - coverSize / 2, y + offsetY - coverSize / 2, coverSize, coverSize));
        } else if (shapeType < 0.66) {
          obstacles.push(new Obstacle(x + offsetX - coverSize, y + offsetY - coverSize / 3, coverSize * 2, coverSize / 1.5));
        } else {
          obstacles.push(new Obstacle(x + offsetX - coverSize / 3, y + offsetY - coverSize, coverSize / 1.5, coverSize * 2));
        }
      }
    }
  }
  return obstacles;
};
var generateCornerStructures = (p) => {
  const obstacles = [];
  const wallLength = 80;
  const wallThickness = 20;
  const offset = 200;
  obstacles.push(new Obstacle(offset - wallLength, offset - wallThickness / 2, wallLength, wallThickness));
  obstacles.push(new Obstacle(offset - wallThickness / 2, offset - wallLength, wallThickness, wallLength));
  obstacles.push(new Obstacle(MAP_SIZE - offset, offset - wallThickness / 2, wallLength, wallThickness));
  obstacles.push(new Obstacle(MAP_SIZE - offset - wallThickness / 2, offset - wallLength, wallThickness, wallLength));
  obstacles.push(new Obstacle(offset - wallLength, MAP_SIZE - offset - wallThickness / 2, wallLength, wallThickness));
  obstacles.push(new Obstacle(offset - wallThickness / 2, MAP_SIZE - offset, wallThickness, wallLength));
  obstacles.push(new Obstacle(MAP_SIZE - offset, MAP_SIZE - offset - wallThickness / 2, wallLength, wallThickness));
  obstacles.push(new Obstacle(MAP_SIZE - offset - wallThickness / 2, MAP_SIZE - offset, wallThickness, wallLength));
  return obstacles;
};
var isNearSpawnCorner = (x, y) => {
  const cornerMargin = 150;
  return x < cornerMargin && y < cornerMargin || x > MAP_SIZE - cornerMargin && y < cornerMargin || x < cornerMargin && y > MAP_SIZE - cornerMargin || x > MAP_SIZE - cornerMargin && y > MAP_SIZE - cornerMargin;
};
var isNearCenter = (x, y) => {
  const centerMargin = 180;
  const dx = x - MAP_SIZE / 2;
  const dy = y - MAP_SIZE / 2;
  return Math.sqrt(dx * dx + dy * dy) < centerMargin;
};

// src/main.ts
var sketch = (p) => {
  let context;
  let soldiers = [];
  let obstacles = [];
  let difficulty = "medium" /* MEDIUM */;
  let particlesPerTeam = 80;
  let physics;
  let combat;
  let ai;
  let gameStateManager;
  let waveSystem;
  let rewardSystem;
  let gameRenderer;
  let uiRenderer;
  let backgroundImg;
  let soldierSprites = [];
  p.preload = () => {
    backgroundImg = p.loadImage("background.svg", () => console.log("Background loaded"), () => console.error("Failed to load background"));
  };
  p.setup = () => {
    console.log("p5.js setup() called");
    if (window.gameConfig && window.gameConfig.startFromWebsite) {
      difficulty = window.gameConfig.difficulty;
      particlesPerTeam = window.gameConfig.armySize;
      console.log("Starting from website with config:", window.gameConfig);
      const canvasParent = document.getElementById("gameCanvas");
      let canvasWidth, canvasHeight;
      if (window.gameConfig.embeddedMode && canvasParent) {
        canvasWidth = canvasParent.offsetWidth;
        canvasHeight = canvasParent.offsetHeight;
        console.log("Embedded mode - canvas size:", canvasWidth, "x", canvasHeight);
      } else {
        canvasWidth = p.windowWidth;
        canvasHeight = p.windowHeight;
      }
      const canvas = p.createCanvas(canvasWidth, canvasHeight);
      if (canvasParent) {
        canvas.parent("gameCanvas");
      }
    } else {
      p.createCanvas(p.windowWidth, p.windowHeight);
    }
    p.textFont("Arial");
    physics = new PhysicsSystem;
    combat = new CombatSystem;
    ai = new AISystem;
    gameStateManager = new GameStateManager;
    gameRenderer = new GameRenderer;
    gameRenderer.setBackground(backgroundImg);
    uiRenderer = new UIRenderer;
    soldierSprites = generateAllSoldierSprites(p);
    console.log("Generated soldier sprites");
    startGame();
  };
  const startGame = () => {
    console.log("Starting game with difficulty:", difficulty);
    gameStateManager.reset();
    combat.clear();
    const { playerTeam, enemyTeam } = gameStateManager.initializeTeams();
    context = {
      gameState: "playing" /* PLAYING */,
      difficulty,
      particlesPerTeam,
      teams: [playerTeam, enemyTeam],
      playerTeam,
      enemyTeam,
      mapScale: 1,
      waveState: {
        currentWave: 1,
        enemiesInWave: 0,
        enemiesRemaining: 0,
        waveStartTime: 0,
        waveDuration: 0,
        isTransitioning: false,
        transitionStartTime: 0
      },
      scoreState: {
        totalScore: 0,
        kills: 0,
        wavesCompleted: 0
      },
      rewardState: {
        activeRewards: [],
        notifications: []
      }
    };
    waveSystem = new WaveSystem(p, context);
    context.waveState = waveSystem.initializeWaveState();
    context.scoreState = waveSystem.initializeScoreState();
    rewardSystem = new RewardSystem(p, context);
    context.rewardState = rewardSystem.initializeRewardState();
    combat.setRewardSystem(rewardSystem);
    physics.setRewardSystem(rewardSystem);
    obstacles = generateMap(p);
    console.log(`Generated maze map with ${obstacles.length} obstacles`);
    soldiers = gameStateManager.spawnPlayerSoldiers(particlesPerTeam, p);
    console.log(`Spawned ${soldiers.length} player soldiers`);
    waveSystem.spawnWaveEnemies(soldiers);
    console.log(`Spawned wave ${context.waveState.currentWave} with ${context.waveState.enemiesInWave} enemies`);
    context.gameState = "playing" /* PLAYING */;
  };
  p.windowResized = () => {
    if (window.gameConfig && window.gameConfig.embeddedMode) {
      const canvasParent = document.getElementById("gameCanvas");
      if (canvasParent) {
        p.resizeCanvas(canvasParent.offsetWidth, canvasParent.offsetHeight);
      }
    } else {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    }
  };
  p.draw = () => {
    if (context.gameState === "playing" /* PLAYING */ || context.gameState === "wave_transition" /* WAVE_TRANSITION */) {
      physics.update(soldiers, obstacles, context.teams, p);
      ai.updateTeamTargets(context.playerTeam, context.enemyTeam, soldiers, gameRenderer.mapScale, gameRenderer.offsetX, gameRenderer.offsetY, p);
      rewardSystem.update(soldiers);
      const beforeKills = context.scoreState.kills;
      combat.update(soldiers, context.teams, physics.getSpatialGrid(), p);
      const newKills = context.scoreState.kills;
      const playerSoldiers = soldiers.filter((s) => s.isAlive && s.teamIndex === 0);
      for (const soldier of playerSoldiers) {
        if (soldier.kills > 0) {
          const killsSinceLastCheck = soldier.kills - soldier.lastKillCount || 0;
          if (killsSinceLastCheck > 0) {
            for (let i = 0;i < killsSinceLastCheck; i++) {
              waveSystem.awardKillPoints();
            }
            soldier.lastKillCount = soldier.kills;
          }
        }
      }
      const previousWave = context.waveState.currentWave;
      const wasTransitioning = context.waveState.isTransitioning;
      waveSystem.update(soldiers);
      if (!wasTransitioning && context.waveState.isTransitioning) {
        rewardSystem.spawnReward(previousWave);
      }
      if (context.waveState.isTransitioning) {
        context.gameState = "wave_transition" /* WAVE_TRANSITION */;
      } else if (context.gameState === "wave_transition" /* WAVE_TRANSITION */) {
        context.gameState = "playing" /* PLAYING */;
      }
      gameStateManager.checkLoseCondition(soldiers);
      if (gameStateManager.gameState === "game_over" /* GAME_OVER */) {
        context.gameState = "game_over" /* GAME_OVER */;
      }
      gameRenderer.render(soldiers, obstacles, context.teams, combat, soldierSprites, 0, p);
      p.push();
      p.translate(gameRenderer.offsetX, gameRenderer.offsetY);
      rewardSystem.draw(gameRenderer.mapScale);
      p.pop();
      const teamCounts = gameStateManager.getTeamCounts(soldiers);
      const remainingTime = context.waveState.isTransitioning ? waveSystem.getTransitionRemainingTime() : waveSystem.getRemainingTime();
      if (context.waveState.isTransitioning) {
        uiRenderer.renderWaveTransition(context.waveState.currentWave, remainingTime, p);
      }
      uiRenderer.renderGameUI(context, teamCounts.player, teamCounts.enemy, remainingTime, p);
    } else if (context.gameState === "game_over" /* GAME_OVER */) {
      gameRenderer.render(soldiers, obstacles, context.teams, combat, soldierSprites, 0, p);
      uiRenderer.renderGameOver(context, p);
    }
  };
  p.mousePressed = () => {
    if (context.gameState === "game_over" /* GAME_OVER */) {
      startGame();
    }
  };
  window.restartGame = () => {
    if (window.gameConfig) {
      difficulty = window.gameConfig.difficulty;
      particlesPerTeam = window.gameConfig.armySize;
      startGame();
    }
  };
};
var initGame = () => {
  if (typeof p5 !== "undefined") {
    new p5(sketch);
    console.log("Wave-based Liquid Wars initialized");
  } else {
    console.log("Waiting for p5...");
    setTimeout(initGame, 50);
  }
};
initGame();
