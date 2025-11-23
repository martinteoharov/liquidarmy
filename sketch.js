// Game states
const GAME_STATE = {
  MAP_SELECTION: 'map_selection',
  TEAM_SELECTION: 'team_selection',
  OPPONENT_SELECTION: 'opponent_selection',
  PLAYING: 'playing',
  GAME_OVER: 'game_over'
};

// Team colors
const TEAM_COLORS = [
  { name: 'Red', color: '#E74C3C' },
  { name: 'Blue', color: '#3498DB' },
  { name: 'Green', color: '#2ECC71' },
  { name: 'Yellow', color: '#F1C40F' }
];

// Map configurations - all same size with unique path layouts
const MAPS = [
  { 
    name: 'Classic Arena', 
    pathType: 'cross',
    description: 'Full map access with strategic cover points'
  },
  { 
    name: 'Maze Castle', 
    pathType: 'maze',
    description: 'Scattered cover obstacles across entire map'
  },
  { 
    name: 'Open Plains', 
    pathType: 'open',
    description: 'Minimal obstacles - pure battlefield'
  },
  { 
    name: 'Fortress Siege', 
    pathType: 'fortress',
    description: 'Broken fortress ruins as cover'
  },
  { 
    name: 'Dragon Valley', 
    pathType: 'valley',
    description: 'Diagonal rock formations for cover'
  },
  { 
    name: 'Kingdom War', 
    pathType: 'rings',
    description: 'Circular arc obstacles - full mobility'
  }
];

// ============================================================================
// ENTITY TYPE DEFINITIONS
// ============================================================================

const ENTITY_TYPES = {
  SOLDIER: {
    name: 'Soldier',
    size: 8,
    spacing: 16,
    maxSpeed: 2.5,
    health: 100,
    damage: 20,
    attackRange: 20,
    cost: 1,
    spriteSize: 16,
    isRanged: false,
    attackCooldown: 15,
    xpPerKill: 10
  },
  TANK: {
    name: 'Tank',
    size: 12,
    spacing: 24,
    maxSpeed: 1.5,
    health: 300,
    damage: 50,
    attackRange: 35,
    cost: 5,
    spriteSize: 20,
    isRanged: true,
    projectileSpeed: 8,
    projectileType: 'shell',
    attackCooldown: 45,
    xpPerKill: 50
  },
  ARCHER: {
    name: 'Archer',
    size: 7,
    spacing: 14,
    maxSpeed: 2.0,
    health: 60,
    damage: 15,
    attackRange: 70,
    cost: 2,
    spriteSize: 14,
    isRanged: true,
    projectileSpeed: 6,
    projectileType: 'arrow',
    attackCooldown: 30,
    xpPerKill: 20
  }
};

// Game configuration
const MAP_SIZE = 1000; // Fixed large size for all maps
let selectedPathType = 'cross'; // Will be set by selected map
const FRICTION = 0.92;
const SEPARATION_FORCE = 0.6;
const CURSOR_ATTRACTION = 0.25;

// Game variables
let gameState = GAME_STATE.MAP_SELECTION;
let selectedMapIndex = null;
let playerTeamIndex = null;
let numOpponents = 3;
let particlesPerTeam = 100;
let teams = [];
let hoveredMapIndex = null;
let hoveredTeam = null;
let hoveredOpponentCount = null;
let hoveredParticleCount = null;
let winningTeam = null;
let showGameInfo = false;
let gameInfoButtonHovered = false;
let startedFromWebsite = false; // Track if started from website

// Game objects
let obstacles = [];
let particles = [];
let deathAnimations = [];
let menuParticles = [];
let projectiles = []; // NEW: Arrows, tank shells, etc.
let explosions = []; // NEW: Explosion effects
let bloodSplatters = []; // NEW: Blood effects
let spatialGrid = null;
let gridCellSize = 20;
let mapScale = 1;
let backgroundImg;
let audioContext;

// Sprite sheets for different entity types (indexed by [teamIndex][entityType])
let entitySprites = {
  soldier: [],
  tank: [],
  archer: []
};

function preload() {
  backgroundImg = loadImage('background.svg', 
    () => console.log('Background loaded successfully'),
    () => console.error('Failed to load background')
  );
}

// ============================================================================
// SPRITE GENERATION FUNCTIONS
// ============================================================================

function generateAllEntitySprites() {
  generateSoldierSprites();
  generateTankSprites();
  generateArcherSprites();
  console.log('Generated all entity sprites');
}

function generateSoldierSprites() {
  entitySprites.soldier = [];
  
  let spriteSize = ENTITY_TYPES.SOLDIER.spriteSize;
  let numFrames = 4;
  
  for (let teamIdx = 0; teamIdx < TEAM_COLORS.length; teamIdx++) {
    // Create a graphics buffer for this team's sprite sheet
    let spriteSheet = createGraphics(spriteSize * numFrames, spriteSize);
    let teamColor = color(TEAM_COLORS[teamIdx].color);
    
    // Draw 4 frames of walk animation
    for (let frame = 0; frame < numFrames; frame++) {
      let x = frame * spriteSize + spriteSize / 2;
      let y = spriteSize / 2;
      
      spriteSheet.push();
      spriteSheet.translate(x, y);
      
      // Top-down toy soldier view - walking animation
      let walkPhase = (frame / numFrames) * TWO_PI;
      
      // Legs/feet stepping animation (side-to-side from top view)
      let leftFootX = sin(walkPhase) * 2.5;
      let rightFootX = sin(walkPhase + PI) * 2.5;
      
      // Feet (darker ovals - visible from top)
      spriteSheet.fill(red(teamColor) * 0.5, green(teamColor) * 0.5, blue(teamColor) * 0.5);
      spriteSheet.noStroke();
      spriteSheet.ellipse(-2 + leftFootX, 4, 2.5, 3.5);  // Left foot
      spriteSheet.ellipse(2 + rightFootX, 4, 2.5, 3.5);  // Right foot
      
      // Legs (visible from top as trapezoid shape)
      spriteSheet.fill(red(teamColor) * 0.7, green(teamColor) * 0.7, blue(teamColor) * 0.7);
      spriteSheet.quad(
        -2.5, 0,  // Top left
        2.5, 0,   // Top right
        2 + rightFootX, 4,   // Bottom right
        -2 + leftFootX, 4    // Bottom left
      );
      
      // Main body/torso (rectangular from top)
      spriteSheet.fill(teamColor);
      spriteSheet.rect(-3, -4, 6, 6);
      
      // Shoulders/arms (darker rectangles on sides)
      spriteSheet.fill(red(teamColor) * 0.8, green(teamColor) * 0.8, blue(teamColor) * 0.8);
      let armOffset = sin(walkPhase) * 0.8;
      spriteSheet.rect(-4, -3 + armOffset, 1, 4);  // Left arm
      spriteSheet.rect(3, -3 - armOffset, 1, 4);   // Right arm
      
      // Helmet/head (circle from top)
      spriteSheet.fill(red(teamColor) * 0.6, green(teamColor) * 0.6, blue(teamColor) * 0.6);
      spriteSheet.ellipse(0, -5, 4, 4.5);
      
      // Helmet highlight
      spriteSheet.fill(red(teamColor) * 0.8, green(teamColor) * 0.8, blue(teamColor) * 0.8);
      spriteSheet.ellipse(-0.5, -5.5, 1.5, 2);
      
      // Weapon (sword pointing down/forward)
      spriteSheet.fill(200, 200, 200);
      spriteSheet.noStroke();
      spriteSheet.rect(3.5, -2, 3, 1);  // Sword handle/blade
      spriteSheet.triangle(6.5, -2, 8, -2.5, 8, -1.5);  // Sword tip
      
      // Weapon grip
      spriteSheet.fill(100, 80, 60);
      spriteSheet.rect(3.5, -2, 1, 1);
      
      spriteSheet.pop();
    }
    
    entitySprites.soldier.push(spriteSheet);
  }
}

function generateTankSprites() {
  entitySprites.tank = [];
  
  let spriteSize = ENTITY_TYPES.TANK.spriteSize;
  let numFrames = 4;
  
  for (let teamIdx = 0; teamIdx < TEAM_COLORS.length; teamIdx++) {
    let spriteSheet = createGraphics(spriteSize * numFrames, spriteSize);
    let teamColor = color(TEAM_COLORS[teamIdx].color);
    
    for (let frame = 0; frame < numFrames; frame++) {
      let x = frame * spriteSize + spriteSize / 2;
      let y = spriteSize / 2;
      
      spriteSheet.push();
      spriteSheet.translate(x, y);
      
      // Tank treads animation (alternating pattern)
      let treadPhase = (frame / numFrames) * TWO_PI;
      let treadOffset = sin(treadPhase) * 1.5;
      
      // Left tread
      spriteSheet.fill(50, 50, 50);
      spriteSheet.noStroke();
      spriteSheet.rect(-6, -2 + treadOffset, 2, 10);
      
      // Right tread
      spriteSheet.rect(4, -2 - treadOffset, 2, 10);
      
      // Tank body (main hull)
      spriteSheet.fill(teamColor);
      spriteSheet.rect(-5, -1, 10, 8);
      
      // Tank armor plating (darker edges)
      spriteSheet.fill(red(teamColor) * 0.6, green(teamColor) * 0.6, blue(teamColor) * 0.6);
      spriteSheet.rect(-5, -1, 10, 1);
      spriteSheet.rect(-5, 6, 10, 1);
      
      // Turret
      spriteSheet.fill(red(teamColor) * 0.8, green(teamColor) * 0.8, blue(teamColor) * 0.8);
      spriteSheet.ellipse(0, 2, 7, 6);
      
      // Gun barrel pointing forward
      spriteSheet.fill(80, 80, 80);
      spriteSheet.rect(3, 1, 5, 2);
      
      // Commander hatch
      spriteSheet.fill(red(teamColor) * 0.5, green(teamColor) * 0.5, blue(teamColor) * 0.5);
      spriteSheet.rect(-1, 1, 2, 2);
      
      spriteSheet.pop();
    }
    
    entitySprites.tank.push(spriteSheet);
  }
}

function generateArcherSprites() {
  entitySprites.archer = [];
  
  let spriteSize = ENTITY_TYPES.ARCHER.spriteSize;
  let numFrames = 4;
  
  for (let teamIdx = 0; teamIdx < TEAM_COLORS.length; teamIdx++) {
    let spriteSheet = createGraphics(spriteSize * numFrames, spriteSize);
    let teamColor = color(TEAM_COLORS[teamIdx].color);
    
    for (let frame = 0; frame < numFrames; frame++) {
      let x = frame * spriteSize + spriteSize / 2;
      let y = spriteSize / 2;
      
      spriteSheet.push();
      spriteSheet.translate(x, y);
      
      // Bow draw animation (frames 0-3: idle, quarter, half, full draw)
      let drawAmount = frame / numFrames;
      
      // Feet stepping
      let walkPhase = (frame / numFrames) * TWO_PI;
      let leftFootX = sin(walkPhase) * 1.5;
      let rightFootX = sin(walkPhase + PI) * 1.5;
      
      // Feet
      spriteSheet.fill(red(teamColor) * 0.5, green(teamColor) * 0.5, blue(teamColor) * 0.5);
      spriteSheet.noStroke();
      spriteSheet.ellipse(-1.5 + leftFootX, 3, 2, 2.5);
      spriteSheet.ellipse(1.5 + rightFootX, 3, 2, 2.5);
      
      // Body (smaller, lighter armor)
      spriteSheet.fill(teamColor);
      spriteSheet.rect(-2, -3, 4, 5);
      
      // Quiver on back
      spriteSheet.fill(100, 70, 40);
      spriteSheet.rect(1.5, -2, 1, 3);
      
      // Bow (wooden arc)
      spriteSheet.stroke(139, 90, 43);
      spriteSheet.strokeWeight(1);
      spriteSheet.noFill();
      spriteSheet.arc(3, 0, 4, 6 - drawAmount * 2, -HALF_PI, HALF_PI);
      
      // Bowstring
      if (drawAmount > 0) {
        spriteSheet.stroke(200, 200, 180);
        spriteSheet.strokeWeight(0.5);
        spriteSheet.line(3, -3 + drawAmount, 1 - drawAmount * 2, 0);
        spriteSheet.line(1 - drawAmount * 2, 0, 3, 3 - drawAmount);
      }
      
      // Arrow (when drawn back)
      if (drawAmount > 0.5) {
        spriteSheet.stroke(100, 70, 40);
        spriteSheet.strokeWeight(1);
        spriteSheet.line(1 - drawAmount * 2, 0, 4, 0);
        // Arrowhead
        spriteSheet.fill(150, 150, 150);
        spriteSheet.noStroke();
        spriteSheet.triangle(4, 0, 5, -0.5, 5, 0.5);
      }
      
      // Head/helmet
      spriteSheet.fill(red(teamColor) * 0.7, green(teamColor) * 0.7, blue(teamColor) * 0.7);
      spriteSheet.ellipse(0, -4, 3, 3);
      
      spriteSheet.pop();
    }
    
    entitySprites.archer.push(spriteSheet);
  }
}

// Generate pop sound using Web Audio API
function playPopSound() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  const now = audioContext.currentTime;
  
  // Create oscillator for the "pop"
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Quick frequency drop for pop effect
  oscillator.frequency.setValueAtTime(300, now);
  oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.1);
  
  // Quick volume envelope
  gainNode.gain.setValueAtTime(0.15, now);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
  
  oscillator.type = 'sine';
  oscillator.start(now);
  oscillator.stop(now + 0.1);
}

// Menu particle class for animated background
class MenuParticle {
  constructor(x, y, teamColor) {
    this.x = x;
    this.y = y;
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
    this.color = teamColor;
    this.size = random(2, 4);
    this.targetX = x;
    this.targetY = y;
  }
  
  update() {
    // Random wandering
    this.targetX += random(-2, 2);
    this.targetY += random(-2, 2);
    
    // Keep within screen bounds
    this.targetX = constrain(this.targetX, 0, width);
    this.targetY = constrain(this.targetY, 0, height);
    
    // Move towards target
    let dx = this.targetX - this.x;
    let dy = this.targetY - this.y;
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
  }
  
  draw() {
    fill(this.color);
    noStroke();
    circle(this.x, this.y, this.size * 2);
  }
  
  // Check if close to enemy particles (for fighting effect)
  checkNearby(others) {
    for (let other of others) {
      if (other === this) continue;
      if (other.color === this.color) continue; // Same team
      
      let dx = other.x - this.x;
      let dy = other.y - this.y;
      let dist = sqrt(dx * dx + dy * dy);
      
      if (dist < 30 && dist > 0) {
        // Push away from enemies
        let angle = atan2(-dy, -dx);
        this.vx += cos(angle) * 0.1;
        this.vy += sin(angle) * 0.1;
      }
    }
  }
}

// ============================================================================
// PROJECTILE & EFFECT CLASSES
// ============================================================================

class Projectile {
  constructor(x, y, targetX, targetY, damage, teamIndex, type = 'arrow', shooter = null) {
    this.x = x;
    this.y = y;
    this.damage = damage;
    this.teamIndex = teamIndex;
    this.type = type;
    this.alive = true;
    this.shooter = shooter; // Track who fired this projectile
    
    // Calculate velocity toward target
    let dx = targetX - x;
    let dy = targetY - y;
    let dist = sqrt(dx * dx + dy * dy);
    let speed = type === 'arrow' ? 6 : 8;
    
    if (dist > 0) {
      this.vx = (dx / dist) * speed;
      this.vy = (dy / dist) * speed;
    } else {
      this.vx = speed;
      this.vy = 0;
    }
    
    this.rotation = atan2(this.vy, this.vx);
    this.lifespan = 150; // Frames before despawn
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.lifespan--;
    
    if (this.lifespan <= 0 || this.x < 0 || this.x > MAP_SIZE || this.y < 0 || this.y > MAP_SIZE) {
      this.alive = false;
    }
    
    // Check collision with enemies
    for (let particle of particles) {
      if (!particle.alive || particle.teamIndex === this.teamIndex) continue;
      
      let dx = this.x - particle.x;
      let dy = this.y - particle.y;
      let dist = sqrt(dx * dx + dy * dy);
      
      if (dist < particle.size) {
        // Hit!
        let isCrit = random() < 0.15; // 15% crit chance
        let finalDamage = isCrit ? this.damage * 2 : this.damage;
        
        particle.health -= finalDamage;
        
        // Blood splatter
        bloodSplatters.push(new BloodSplatter(particle.x, particle.y, teams[particle.teamIndex].color));
        
        // Explosion for tank shells (use team color)
        if (this.type === 'shell') {
          explosions.push(new Explosion(this.x, this.y, 30, teams[this.teamIndex].color));
        }
        
        // Check if killed
        if (particle.health <= 0) {
          particle.alive = false;
          
          // Grant XP to shooter
          if (this.shooter && this.shooter.alive) {
            this.shooter.kills++;
            this.shooter.gainXP(ENTITY_TYPES[particle.entityType].xpPerKill);
          }
          
          // Create death animation
          deathAnimations.push(new DeathAnimation(particle.x, particle.y, teams[particle.teamIndex].color));
        }
        
        this.alive = false;
        playPopSound();
        break;
      }
    }
  }
  
  draw() {
    if (!this.alive) return;
    
    push();
    translate(this.x * mapScale, this.y * mapScale);
    rotate(this.rotation);
    
    if (this.type === 'arrow') {
      // Draw arrow
      stroke(100, 70, 40);
      strokeWeight(2 * mapScale);
      line(0, 0, -8 * mapScale, 0);
      
      // Arrowhead
      fill(150, 150, 150);
      noStroke();
      triangle(0, 0, -3 * mapScale, -2 * mapScale, -3 * mapScale, 2 * mapScale);
      
      // Trail
      stroke(255, 255, 200, 100);
      strokeWeight(1 * mapScale);
      line(-8 * mapScale, 0, -12 * mapScale, 0);
    } else if (this.type === 'shell') {
      // Draw tank shell
      fill(80, 80, 80);
      noStroke();
      ellipse(0, 0, 5 * mapScale, 5 * mapScale);
      
      // Muzzle flash trail
      fill(255, 150, 0, 150);
      ellipse(-3 * mapScale, 0, 4 * mapScale, 4 * mapScale);
    }
    
    pop();
  }
}

class Explosion {
  constructor(x, y, maxRadius, teamColor = null) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = maxRadius;
    this.alpha = 255;
    this.alive = true;
    this.teamColor = teamColor; // Store team color for explosion
  }
  
  update() {
    this.radius += 3;
    this.alpha -= 20;
    
    if (this.alpha <= 0 || this.radius >= this.maxRadius) {
      this.alive = false;
    }
  }
  
  draw() {
    if (!this.alive) return;
    
    push();
    noStroke();
    
    if (this.teamColor) {
      // Use team color for explosion
      let teamRed = red(this.teamColor);
      let teamGreen = green(this.teamColor);
      let teamBlue = blue(this.teamColor);
      
      // Outer explosion ring (team color)
      fill(teamRed, teamGreen, teamBlue, this.alpha);
      ellipse(this.x * mapScale, this.y * mapScale, this.radius * 2 * mapScale);
      
      // Inner brighter ring (lightened team color)
      fill(teamRed * 1.2, teamGreen * 1.2, teamBlue * 1.2, this.alpha * 1.5);
      ellipse(this.x * mapScale, this.y * mapScale, this.radius * mapScale);
      
      // White hot center
      fill(255, 255, 255, this.alpha * 0.8);
      ellipse(this.x * mapScale, this.y * mapScale, this.radius * 0.5 * mapScale);
    } else {
      // Default orange/yellow explosion
      // Outer orange fire
      fill(255, 100, 0, this.alpha);
      ellipse(this.x * mapScale, this.y * mapScale, this.radius * 2 * mapScale);
      
      // Inner yellow core
      fill(255, 255, 0, this.alpha * 1.5);
      ellipse(this.x * mapScale, this.y * mapScale, this.radius * mapScale);
      
      // White hot center
      fill(255, 255, 255, this.alpha * 0.8);
      ellipse(this.x * mapScale, this.y * mapScale, this.radius * 0.5 * mapScale);
    }
    
    pop();
  }
}

class BloodSplatter {
  constructor(x, y, teamColor) {
    this.x = x;
    this.y = y;
    this.color = teamColor;
    this.alpha = 200;
    this.size = random(5, 12);
    this.alive = true;
    this.lifespan = 90;
  }
  
  update() {
    this.lifespan--;
    this.alpha -= 2;
    
    if (this.lifespan <= 0 || this.alpha <= 0) {
      this.alive = false;
    }
  }
  
  draw() {
    if (!this.alive) return;
    
    push();
    fill(red(this.color) * 0.5, 0, 0, this.alpha);
    noStroke();
    
    // Splatter shape
    for (let i = 0; i < 5; i++) {
      let angle = (i / 5) * TWO_PI;
      let r = this.size * random(0.5, 1);
      ellipse(
        (this.x + cos(angle) * r) * mapScale,
        (this.y + sin(angle) * r) * mapScale,
        this.size * 0.5 * mapScale
      );
    }
    
    pop();
  }
}

// Death animation class
class DeathAnimation {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 0;
    this.maxRadius = 15;
    this.alpha = 255;
    this.alive = true;
  }
  
  update() {
    this.radius += 1.5;
    this.alpha -= 15;
    
    if (this.alpha <= 0 || this.radius >= this.maxRadius) {
      this.alive = false;
    }
  }
  
  draw() {
    if (!this.alive) return;
    
    // Draw expanding ring
    noFill();
    stroke(red(this.color), green(this.color), blue(this.color), this.alpha);
    strokeWeight(2);
    circle(this.x * mapScale, this.y * mapScale, this.radius * 2 * mapScale);
    
    // Draw inner glow
    stroke(255, 255, 255, this.alpha * 0.5);
    strokeWeight(1);
    circle(this.x * mapScale, this.y * mapScale, this.radius * 1.5 * mapScale);
  }
}

// Level up effect class
class LevelUpEffect {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = 25;
    this.alpha = 255;
    this.alive = true;
  }
  
  update() {
    this.radius += 2;
    this.alpha -= 10;
    
    if (this.alpha <= 0 || this.radius >= this.maxRadius) {
      this.alive = false;
    }
  }
  
  draw() {
    if (!this.alive) return;
    
    push();
    // Gold ring
    noFill();
    stroke(255, 215, 0, this.alpha);
    strokeWeight(3);
    circle(this.x * mapScale, this.y * mapScale, this.radius * 2 * mapScale);
    
    // Inner star particles
    for (let i = 0; i < 8; i++) {
      let angle = (i / 8) * TWO_PI;
      let r = this.radius * 0.7;
      fill(255, 255, 0, this.alpha);
      noStroke();
      ellipse(
        (this.x + cos(angle) * r) * mapScale,
        (this.y + sin(angle) * r) * mapScale,
        3 * mapScale
      );
    }
    pop();
  }
}

// Spatial grid for optimization
class SpatialGrid {
  constructor(width, height, cellSize) {
    this.cellSize = cellSize;
    this.cols = Math.ceil(width / cellSize);
    this.rows = Math.ceil(height / cellSize);
    this.cells = [];
    this.clear();
  }
  
  clear() {
    this.cells = [];
    for (let i = 0; i < this.cols * this.rows; i++) {
      this.cells[i] = [];
    }
  }
  
  getIndex(x, y) {
    let col = Math.floor(x / this.cellSize);
    let row = Math.floor(y / this.cellSize);
    col = constrain(col, 0, this.cols - 1);
    row = constrain(row, 0, this.rows - 1);
    return row * this.cols + col;
  }
  
  insert(particle) {
    let index = this.getIndex(particle.x, particle.y);
    this.cells[index].push(particle);
  }
  
  getNearby(particle, radius) {
    let nearby = [];
    let minCol = Math.floor((particle.x - radius) / this.cellSize);
    let maxCol = Math.floor((particle.x + radius) / this.cellSize);
    let minRow = Math.floor((particle.y - radius) / this.cellSize);
    let maxRow = Math.floor((particle.y + radius) / this.cellSize);
    
    minCol = constrain(minCol, 0, this.cols - 1);
    maxCol = constrain(maxCol, 0, this.cols - 1);
    minRow = constrain(minRow, 0, this.rows - 1);
    maxRow = constrain(maxRow, 0, this.rows - 1);
    
    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        let index = row * this.cols + col;
        nearby = nearby.concat(this.cells[index]);
      }
    }
    
    return nearby;
  }
}

// ============================================================================
// ENTITY CLASSES
// ============================================================================

// Base Entity class (represents soldiers, tanks, archers, etc.)
class Particle {
  constructor(x, y, teamIndex, entityType = 'SOLDIER') {
    this.x = x;
    this.y = y;
    this.teamIndex = teamIndex;
    this.entityType = entityType;
    
    // Get stats from entity type definition
    let stats = ENTITY_TYPES[entityType];
    this.size = stats.size;
    this.maxSpeed = stats.maxSpeed;
    this.health = stats.health;
    this.maxHealth = stats.health;
    this.damage = stats.damage;
    this.attackRange = stats.attackRange;
    this.spriteSize = stats.spriteSize;
    
    // Movement properties
    this.vx = 0;
    this.vy = 0;
    this.alive = true;
    this.hitCooldown = 0;
    this.attackCooldown = 0;
    
    // XP and Leveling System
    this.xp = 0;
    this.level = 1;
    this.kills = 0;
    
    // Animation properties
    this.currentFrame = floor(random(4));
    this.frameCounter = 0;
    this.frameSpeed = entityType === 'TANK' ? 10 : 8;
    this.rotation = 0;
    
    // Morale system
    this.morale = 100;
    this.isFleeing = false;
    
    // Add small random offset so entities don't overlap completely
    this.x += random(-20, 20);
    this.y += random(-20, 20);
  }
  
  // Gain XP and potentially level up
  gainXP(amount) {
    this.xp += amount;
    let xpNeeded = this.level * 100;
    
    if (this.xp >= xpNeeded) {
      this.levelUp();
    }
  }
  
  levelUp() {
    this.level++;
    this.xp = 0;
    
    // Stat increases per level
    this.maxHealth = floor(this.maxHealth * 1.15);
    this.health = this.maxHealth; // Full heal on level up
    this.damage = floor(this.damage * 1.1);
    this.maxSpeed *= 1.05;
    
    // Visual feedback - create gold ring
    deathAnimations.push(new LevelUpEffect(this.x, this.y));
  }
  
  update() {
    // Decrease hit cooldown
    if (this.hitCooldown > 0) {
      this.hitCooldown--;
    }
    
    // Check if particle is dead
    if (this.health <= 0) {
      this.alive = false;
      return;
    }
    
    // FIRST: Check if stuck inside obstacle and escape immediately
    if (this.isInsideObstacle()) {
      this.escapeFromObstacle();
      this.vx = 0;
      this.vy = 0;
      return; // Skip normal movement this frame
    }
    
    // Get team's target position OR flee from enemies if morale is low
    let targetX = teams[this.teamIndex].targetX;
    let targetY = teams[this.teamIndex].targetY;
    
    // FLEEING BEHAVIOR: If morale is low, run away from nearest enemies
    if (this.isFleeing) {
      // Find nearest enemy
      let nearestEnemy = null;
      let nearestDist = Infinity;
      let nearby = spatialGrid.getNearby(this, 150);
      
      for (let other of nearby) {
        if (other === this || !other.alive || other.teamIndex === this.teamIndex) continue;
        
        let dx = this.x - other.x;
        let dy = this.y - other.y;
        let dist = sqrt(dx * dx + dy * dy);
        
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestEnemy = other;
        }
      }
      
      // Run away from nearest enemy
      if (nearestEnemy) {
        targetX = this.x + (this.x - nearestEnemy.x) * 2; // Run in opposite direction
        targetY = this.y + (this.y - nearestEnemy.y) * 2;
      }
    }
    
    // Move towards target (or away from enemies if fleeing)
    let dx = targetX - this.x;
    let dy = targetY - this.y;
    let distance = sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
      // Normalize and apply force (fleeing units move faster)
      let force = teams[this.teamIndex].isPlayer ? CURSOR_ATTRACTION : 0.20;
      if (this.isFleeing) {
        force *= 1.5; // Boost speed when fleeing
      }
      this.vx += (dx / distance) * force;
      this.vy += (dy / distance) * force;
    }
    
    // Apply friction
    this.vx *= FRICTION;
    this.vy *= FRICTION;
    
    // Limit speed (use entity-specific max speed)
    let speed = sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > this.maxSpeed) {
      this.vx = (this.vx / speed) * this.maxSpeed;
      this.vy = (this.vy / speed) * this.maxSpeed;
    }
    
    // Store old position
    let oldX = this.x;
    let oldY = this.y;
    
    // Apply velocity with independent X/Y movement
    this.x += this.vx;
    this.y += this.vy;
    
    // Check collision with obstacles - handle X and Y independently
    this.checkObstacleCollisionIndependent(oldX, oldY);
    
    // Keep within map bounds
    if (this.x < this.size) {
      this.x = this.size;
      this.vx *= -0.5;
    }
    if (this.x > MAP_SIZE - this.size) {
      this.x = MAP_SIZE - this.size;
      this.vx *= -0.5;
    }
    if (this.y < this.size) {
      this.y = this.size;
      this.vy *= -0.5;
    }
    if (this.y > MAP_SIZE - this.size) {
      this.y = MAP_SIZE - this.size;
      this.vy *= -0.5;
    }
    
    // Update animation
    this.updateAnimation();
    
    // Update rotation based on velocity
    if (speed > 0.1) {
      this.rotation = atan2(this.vy, this.vx);
    }
  }
  
  updateAnimation() {
    // Use squared speed to avoid sqrt (faster)
    let speedSq = this.vx * this.vx + this.vy * this.vy;
    
    // Only animate if moving (0.1^2 = 0.01)
    if (speedSq > 0.01) {
      this.frameCounter++;
      if (this.frameCounter >= this.frameSpeed) {
        this.currentFrame = (this.currentFrame + 1) % 4; // 4 frames
        this.frameCounter = 0;
      }
    } else {
      // When idle, stay on frame 0
      this.currentFrame = 0;
      this.frameCounter = 0;
    }
  }
  
  // Separate from nearby particles (liquid-like behavior with enemy repulsion)
  separate() {
    let spacing = ENTITY_TYPES[this.entityType].spacing;
    let nearby = spatialGrid.getNearby(this, spacing * 4);
    let minDistSq = (this.size * 2) * (this.size * 2); // Pre-calculate squared distance
    
    for (let other of nearby) {
      if (other === this || !other.alive) continue;
      
      let dx = this.x - other.x;
      let dy = this.y - other.y;
      let distSq = dx * dx + dy * dy; // Use squared distance (faster)
      
      let isEnemy = other.teamIndex !== this.teamIndex;
      
      if (isEnemy) {
        // HARD WALL for enemy particles - absolutely no penetration
        if (distSq < minDistSq && distSq > 0.1) {
          let distance = sqrt(distSq);
          let minDistance = this.size * 2;
          
          // Push particles apart to maintain minimum distance
          let overlap = minDistance - distance;
          let invDist = 1 / distance;
          
          // Direct position correction (not just force) - gentler
          let pushDistance = overlap * 0.3;
          this.x += dx * invDist * pushDistance;
          this.y += dy * invDist * pushDistance;
          
          // Reduced repulsive force for smoother fighting
          let force = 0.8;
          this.vx += dx * invDist * force;
          this.vy += dy * invDist * force;
          
          // Add damping to reduce bouncing
          this.vx *= 0.85;
          this.vy *= 0.85;
        }
      } else {
        // Ally separation - maintain spacing but don't stack
        if (distSq < minDistSq && distSq > 0.1) {
          let distance = sqrt(distSq);
          let minDistance = this.size * 2;
          
          // Hard boundary for allies too - prevents stacking
          let overlap = minDistance - distance;
          let invDist = 1 / distance;
          
          // Position correction
          let pushDistance = overlap * 0.5;
          this.x += dx * invDist * pushDistance;
          this.y += dy * invDist * pushDistance;
          
          // Gentle force for smooth movement
          let force = 0.8;
          this.vx += dx * invDist * force;
          this.vy += dy * invDist * force;
        } else {
          let mediumRangeSq = (spacing * 2) * (spacing * 2);
          if (distSq < mediumRangeSq && distSq > 0.1) {
            // Normal separation at medium range
            let distance = sqrt(distSq);
            let force = (spacing * 2 - distance) / (spacing * 2);
            force *= SEPARATION_FORCE * 0.8;
            
            let invDist = 1 / distance;
            this.vx += dx * invDist * force;
            this.vy += dy * invDist * force;
          }
        }
      }
    }
  }
  
  // Check for collisions with enemy particles (NEW: Ranged & Melee combat)
  checkEnemyCollision() {
    // Decrease attack cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown--;
      return;
    }
    
    // Find nearest enemy
    let nearest = null;
    let nearestDist = Infinity;
    let nearby = spatialGrid.getNearby(this, this.attackRange);
    
    for (let other of nearby) {
      if (other === this || !other.alive || other.teamIndex === this.teamIndex) continue;
      
      let dx = this.x - other.x;
      let dy = this.y - other.y;
      let distance = sqrt(dx * dx + dy * dy);
      
      if (distance < this.attackRange && distance < nearestDist) {
        nearest = other;
        nearestDist = distance;
      }
    }
    
    if (nearest) {
      let stats = ENTITY_TYPES[this.entityType];
      
      if (stats.isRanged) {
        // RANGED ATTACK: Shoot projectile
        projectiles.push(new Projectile(
          this.x, 
          this.y, 
          nearest.x, 
          nearest.y, 
          this.damage,
          this.teamIndex,
          stats.projectileType,
          this  // Pass reference to shooter for XP credit
        ));
        this.attackCooldown = stats.attackCooldown;
        
      } else {
        // MELEE ATTACK: Direct damage (only if very close)
        if (nearestDist < this.size * 2) {
          let isCrit = random() < 0.1; // 10% crit chance
          let finalDamage = isCrit ? this.damage * 2 : this.damage;
          
          nearest.health -= finalDamage;
          nearest.hitCooldown = 10;
          this.attackCooldown = stats.attackCooldown;
          
          // Blood splatter
          bloodSplatters.push(new BloodSplatter(nearest.x, nearest.y, teams[nearest.teamIndex].color));
          
          // Check if killed
          if (nearest.health <= 0) {
            nearest.alive = false;
            this.kills++;
            this.gainXP(ENTITY_TYPES[nearest.entityType].xpPerKill);
            
            // Create death animation
            deathAnimations.push(new DeathAnimation(nearest.x, nearest.y, teams[nearest.teamIndex].color));
            playPopSound();
          }
        }
      }
    }
  }
  
  // Update morale based on nearby allies/enemies
  updateMorale() {
    let nearbyAllies = 0;
    let nearbyEnemies = 0;
    let nearby = spatialGrid.getNearby(this, 100);
    
    for (let other of nearby) {
      if (!other.alive) continue;
      if (other.teamIndex === this.teamIndex) {
        nearbyAllies++;
      } else {
        nearbyEnemies++;
      }
    }
    
    // Morale calculation
    if (nearbyEnemies > nearbyAllies * 2 && nearbyEnemies > 5) {
      this.morale -= 2;
      if (this.morale < 20) {
        this.isFleeing = true;
      }
    } else {
      this.morale = min(100, this.morale + 0.5);
      if (this.morale > 40) {
        this.isFleeing = false;
      }
    }
  }
  
  isInsideObstacle() {
    for (let obstacle of obstacles) {
      if (this.collidesWithObstacle(obstacle)) {
        return true;
      }
    }
    return false;
  }
  
  escapeFromObstacle() {
    // Find nearest safe position outside all obstacles
    let bestDistance = Infinity;
    let bestX = this.x;
    let bestY = this.y;
    let foundSafe = false;
    
    // Try 8 cardinal/diagonal directions first (faster)
    for (let angle = 0; angle < TWO_PI; angle += TWO_PI / 8) {
      for (let radius = this.size + 3; radius < 50; radius += 3) {
        let testX = this.x + cos(angle) * radius;
        let testY = this.y + sin(angle) * radius;
        
        // Bounds check first (faster than obstacle check)
        if (testX < this.size || testX > MAP_SIZE - this.size ||
            testY < this.size || testY > MAP_SIZE - this.size) {
          continue;
        }
        
        // Check if this position is safe
        let tempX = this.x;
        let tempY = this.y;
        this.x = testX;
        this.y = testY;
        
        if (!this.isInsideObstacleHelper()) {
          // Found a safe spot
          let dist = radius;
          if (dist < bestDistance) {
            bestDistance = dist;
            bestX = testX;
            bestY = testY;
            foundSafe = true;
          }
          this.x = tempX;
          this.y = tempY;
          break; // Found safe spot in this direction
        }
        
        this.x = tempX;
        this.y = tempY;
      }
      
      // Exit early if found a close safe spot
      if (foundSafe && bestDistance < 15) break;
    }
    
    // Smoothly interpolate to safe position to reduce glitchiness
    let moveSpeed = 0.3; // Move 30% toward safe spot per frame
    this.x = lerp(this.x, bestX, moveSpeed);
    this.y = lerp(this.y, bestY, moveSpeed);
  }
  
  isInsideObstacleHelper() {
    for (let obstacle of obstacles) {
      if (this.collidesWithObstacle(obstacle)) {
        return true;
      }
    }
    return false;
  }
  
  checkObstacleCollisionIndependent(oldX, oldY) {
    // Check collision with all obstacles
    for (let obstacle of obstacles) {
      if (this.collidesWithObstacle(obstacle)) {
        // Find closest point on obstacle to push particle out
        let closestPoint = this.getClosestPointOnObstacle(obstacle);
        
        if (closestPoint) {
          // Calculate push direction - away from obstacle
          let dx = this.x - closestPoint.x;
          let dy = this.y - closestPoint.y;
          let distSq = dx * dx + dy * dy; // Use squared distance (faster)
          
          if (distSq > 0.1) { // Small threshold to avoid division by zero
            let dist = sqrt(distSq);
            
            // Normalize and push particle out by size + buffer
            let pushDistance = this.size + 3;
            let invDist = 1 / dist; // Calculate once
            this.x = closestPoint.x + dx * invDist * pushDistance;
            this.y = closestPoint.y + dy * invDist * pushDistance;
            
            // Kill velocity in the direction of collision (dampen perpendicular movement)
            let dotProduct = (this.vx * dx + this.vy * dy) * invDist;
            if (dotProduct < 0) {
              // Moving into obstacle, cancel that velocity component
              this.vx -= dx * invDist * dotProduct;
              this.vy -= dy * invDist * dotProduct;
            }
            
            // Apply friction when sliding along walls
            this.vx *= 0.95;
            this.vy *= 0.95;
          } else {
            // Fallback: revert to old position
            this.x = oldX;
            this.y = oldY;
            this.vx *= 0.5;
            this.vy *= 0.5;
          }
        }
        return; // Handle one collision per frame
      }
    }
  }
  
  getClosestPointOnObstacle(obstacle) {
    if (obstacle.isPolygon) {
      // For castle obstacles, find closest point among all rectangles
      let closestDist = Infinity;
      let closestPoint = null;
      
      for (let rect of obstacle.rects) {
        let cx = constrain(this.x, rect.x, rect.x + rect.w);
        let cy = constrain(this.y, rect.y, rect.y + rect.h);
        let dx = this.x - cx;
        let dy = this.y - cy;
        let dist = sqrt(dx * dx + dy * dy);
        
        if (dist < closestDist) {
          closestDist = dist;
          closestPoint = {x: cx, y: cy};
        }
      }
      return closestPoint;
    } else {
      // For simple rectangular obstacles
      let cx = constrain(this.x, obstacle.x, obstacle.x + obstacle.width);
      let cy = constrain(this.y, obstacle.y, obstacle.y + obstacle.height);
      return {x: cx, y: cy};
    }
  }
  
  collidesWithObstacle(obstacle) {
    let buffer = this.size + 1;
    
    if (obstacle.isPolygon) {
      // Handle complex castle obstacles
      let collision = obstacle.collidesWith(this);
      return collision.collides;
    } else {
      // Handle simple rectangular obstacles with buffer
      return (
        this.x + buffer > obstacle.x &&
        this.x - buffer < obstacle.x + obstacle.width &&
        this.y + buffer > obstacle.y &&
        this.y - buffer < obstacle.y + obstacle.height
      );
    }
  }
  
  draw() {
    if (!this.alive) return;
    
    // Calculate screen position
    let screenX = this.x * mapScale;
    let screenY = this.y * mapScale;
    
    // Get sprite sheet for this entity type and team
    let spriteType = this.entityType.toLowerCase();
    let sprite = entitySprites[spriteType] ? entitySprites[spriteType][this.teamIndex] : null;
    if (!sprite) return; // Safety check
    
    // Calculate source rectangle for current frame
    let sx = this.currentFrame * this.spriteSize;
    let sy = 0;
    let sw = this.spriteSize;
    let sh = this.spriteSize;
    
    // Calculate destination size - match collision size (size * 2 for diameter)
    let drawSize = (this.size * 2) * mapScale;
    
    push();
    translate(screenX, screenY);
    rotate(this.rotation);
    
    // Draw sprite (centered)
    imageMode(CENTER);
    image(sprite, 0, 0, drawSize, drawSize, sx, sy, sw, sh);
    
    pop();
    
    // Draw level indicators for veteran units (level 3+)
    if (this.level >= 3) {
      push();
      translate(screenX, screenY);
      
      let starCount = min(this.level - 2, 5); // Max 5 stars
      let starSize = 4 * mapScale;
      let yOffset = -this.size * mapScale - 8 * mapScale;
      
      for (let i = 0; i < starCount; i++) {
        let xOffset = (i - (starCount - 1) / 2) * 6 * mapScale;
        
        // Draw gold star
        fill(255, 215, 0);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(starSize * 2);
        text('★', xOffset, yOffset);
      }
      
      pop();
    }
    
    // Draw morale indicator (only when fleeing - red flag)
    if (this.isFleeing) {
      push();
      translate(screenX, screenY);
      
      // Red flag above unit
      fill(255, 50, 50);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(8 * mapScale);
      text('⚑', 0, -this.size * mapScale - 6 * mapScale);
      
      pop();
    }
    
    // Draw XP bar for units that have gained XP (subtle, small)
    if (this.xp > 0 && this.level < 10) {
      push();
      translate(screenX, screenY);
      
      let barWidth = this.size * 2 * mapScale;
      let barHeight = 2 * mapScale;
      let yOffset = this.size * mapScale + 4 * mapScale;
      
      // XP progress
      let xpNeeded = this.level * 100;
      let xpProgress = this.xp / xpNeeded;
      
      // Background bar
      fill(40, 40, 40, 150);
      noStroke();
      rect(-barWidth / 2, yOffset, barWidth, barHeight);
      
      // Progress bar (gold)
      fill(255, 215, 0, 200);
      rect(-barWidth / 2, yOffset, barWidth * xpProgress, barHeight);
      
      pop();
    }
  }
}

// Determine winner of collision based on team directions
function determineCollisionWinner(particle1, particle2) {
  let team1 = teams[particle1.teamIndex];
  let team2 = teams[particle2.teamIndex];
  
  // Get direction from each particle to their team's target
  let dx1 = team1.targetX - particle1.x;
  let dy1 = team1.targetY - particle1.y;
  let angle1 = atan2(dy1, dx1);
  
  let dx2 = team2.targetX - particle2.x;
  let dy2 = team2.targetY - particle2.y;
  let angle2 = atan2(dy2, dx2);
  
  // Get direction from particle1 to particle2
  let dxBetween = particle2.x - particle1.x;
  let dyBetween = particle2.y - particle1.y;
  let angleBetween = atan2(dyBetween, dxBetween);
  
  // Calculate if each particle is "looking at" the other
  // Normalize angles to be between -PI and PI
  let diff1 = angleBetween - angle1;
  while (diff1 > PI) diff1 -= TWO_PI;
  while (diff1 < -PI) diff1 += TWO_PI;
  
  let diff2 = (angleBetween + PI) - angle2;
  while (diff2 > PI) diff2 -= TWO_PI;
  while (diff2 < -PI) diff2 += TWO_PI;
  
  // If angle difference is small (within 90 degrees), particle is "looking at" the other
  let threshold = PI / 2; // 90 degrees
  let particle1LooksAt2 = abs(diff1) < threshold;
  let particle2LooksAt1 = abs(diff2) < threshold;
  
  // Determine winner based on who is looking at whom
  if (particle1LooksAt2 && particle2LooksAt1) {
    // Both looking at each other - 50/50 chance
    return random() < 0.5 ? particle1 : particle2;
  } else if (particle1LooksAt2) {
    // Only particle1 looks at particle2 - particle1 wins
    return particle1;
  } else if (particle2LooksAt1) {
    // Only particle2 looks at particle1 - particle2 wins
    return particle2;
  } else {
    // Neither looking at each other - 50/50 chance
    return random() < 0.5 ? particle1 : particle2;
  }
}

// Obstacle class
class Obstacle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isPolygon = false;
  }
  
  draw() {
    fill(60, 60, 70);
    stroke(80, 80, 90);
    strokeWeight(2);
    rect(this.x * mapScale, this.y * mapScale, this.width * mapScale, this.height * mapScale);
  }
}

// Castle obstacle with complex shape
class CastleObstacle {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.isPolygon = true;
    
    // Create castle shape from multiple rectangles
    this.rects = [
      // Main keep (center)
      {x: x - size * 0.3, y: y - size * 0.4, w: size * 0.6, h: size * 0.8},
      // Left tower
      {x: x - size * 0.6, y: y - size * 0.3, w: size * 0.35, h: size * 0.6},
      // Right tower
      {x: x + size * 0.25, y: y - size * 0.3, w: size * 0.35, h: size * 0.6},
      // Base wall (left)
      {x: x - size * 0.6, y: y + size * 0.2, w: size * 0.35, h: size * 0.2},
      // Base wall (right)
      {x: x + size * 0.25, y: y + size * 0.2, w: size * 0.35, h: size * 0.2},
      // Connecting wall
      {x: x - size * 0.25, y: y + size * 0.25, w: size * 0.5, h: size * 0.15}
    ];
  }
  
  draw() {
    fill(70, 60, 50);
    stroke(90, 80, 70);
    strokeWeight(2);
    
    // Draw all castle parts
    for (let castleRect of this.rects) {
      rect(castleRect.x * mapScale, castleRect.y * mapScale, castleRect.w * mapScale, castleRect.h * mapScale);
    }
    
    // Draw battlements on towers
    fill(80, 70, 60);
    noStroke();
    for (let i = 0; i < 3; i++) {
      // Left tower battlements
      let bx1 = (this.x - this.size * 0.5 + i * this.size * 0.15) * mapScale;
      let by1 = (this.y - this.size * 0.4) * mapScale;
      rect(bx1, by1, this.size * 0.08 * mapScale, this.size * 0.08 * mapScale);
      
      // Right tower battlements
      let bx2 = (this.x + this.size * 0.3 + i * this.size * 0.15) * mapScale;
      rect(bx2, by1, this.size * 0.08 * mapScale, this.size * 0.08 * mapScale);
    }
  }
  
  // Check collision with particle
  collidesWith(particle) {
    for (let rect of this.rects) {
      let closestX = constrain(particle.x, rect.x, rect.x + rect.w);
      let closestY = constrain(particle.y, rect.y, rect.y + rect.h);
      
      let dx = particle.x - closestX;
      let dy = particle.y - closestY;
      let distance = sqrt(dx * dx + dy * dy);
      
      if (distance < particle.size + 1) {
        return {collides: true, closestX, closestY, distance};
      }
    }
    return {collides: false};
  }
}

function setup() {
  console.log('p5.js setup() called');
  
  // Check if started from website with config
  if (window.gameConfig && window.gameConfig.startFromWebsite) {
    startedFromWebsite = true;
    selectedMapIndex = window.gameConfig.map;
    playerTeamIndex = window.gameConfig.team;
    numOpponents = window.gameConfig.opponents;
    particlesPerTeam = window.gameConfig.armySize;
    selectedPathType = MAPS[selectedMapIndex].pathType;
    
    console.log('Starting from website with config:', window.gameConfig);
    
    // Create canvas with appropriate size for embedded mode
    let canvasParent = document.getElementById('gameCanvas');
    let canvasWidth, canvasHeight;
    
    if (window.gameConfig.embeddedMode) {
      // Embedded mode - use container dimensions
      canvasWidth = canvasParent.offsetWidth;
      canvasHeight = canvasParent.offsetHeight;
      console.log('Embedded mode - canvas size:', canvasWidth, 'x', canvasHeight);
    } else {
      // Fullscreen mode
      canvasWidth = windowWidth;
      canvasHeight = windowHeight;
    }
    
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('gameCanvas');
    
    textFont('Arial');
    
    // Generate all entity sprites
    generateAllEntitySprites();
    
    // Start game immediately
    startGame();
  } else {
    // Normal mode - create canvas in main
    let canvas = createCanvas(windowWidth, windowHeight);
    
    textFont('Arial');
    
    // Generate all entity sprites
    generateAllEntitySprites();
    
    // Initialize menu particles for animated background
    initMenuParticles();
  }
}

function initMenuParticles() {
  menuParticles = [];
  let colors = [TEAM_COLORS[0].color, TEAM_COLORS[1].color, TEAM_COLORS[2].color, TEAM_COLORS[3].color];
  
  // Create 4 groups of particles (one per team color)
  for (let i = 0; i < 4; i++) {
    let startX = (i % 2) * width;
    let startY = floor(i / 2) * height;
    
    for (let j = 0; j < 15; j++) {
      let x = startX + random(-50, 50);
      let y = startY + random(-50, 50);
      menuParticles.push(new MenuParticle(x, y, colors[i]));
    }
  }
}

function windowResized() {
  // Handle resize differently for embedded vs fullscreen mode
  if (window.gameConfig && window.gameConfig.embeddedMode) {
    // Embedded mode - resize to container
    let canvasParent = document.getElementById('gameCanvas');
    if (canvasParent) {
      resizeCanvas(canvasParent.offsetWidth, canvasParent.offsetHeight);
    }
  } else {
    // Fullscreen or menu mode - resize to window
    resizeCanvas(windowWidth, windowHeight);
  }
}

// Function to restart game with new config (called from website)
window.restartGame = function() {
  if (window.gameConfig) {
    selectedMapIndex = window.gameConfig.map;
    playerTeamIndex = window.gameConfig.team;
    numOpponents = window.gameConfig.opponents;
    particlesPerTeam = window.gameConfig.armySize;
    selectedPathType = MAPS[selectedMapIndex].pathType;
    
    // Restart the game
    startGame();
  }
};

function draw() {
  background(30);
  
  if (gameState === GAME_STATE.MAP_SELECTION) {
    drawMapSelection();
  } else if (gameState === GAME_STATE.TEAM_SELECTION) {
    drawTeamSelection();
  } else if (gameState === GAME_STATE.OPPONENT_SELECTION) {
    drawOpponentSelection();
  } else if (gameState === GAME_STATE.PLAYING) {
    drawGame();
  } else if (gameState === GAME_STATE.GAME_OVER) {
    drawGameOver();
  }
}

function drawMapSelection() {
  // Draw SVG background - fill entire screen
  if (backgroundImg) {
    image(backgroundImg, 0, 0, width, height);
  }
  
  // Update and draw animated menu particles (liquid fights)
  for (let particle of menuParticles) {
    particle.update();
    particle.checkNearby(menuParticles);
  }
  
  // Semi-transparent overlay for readability
  fill(45, 35, 25, 200);
  noStroke();
  rect(0, 0, width, height);
  
  // Draw menu particles on top of dark overlay
  for (let particle of menuParticles) {
    particle.draw();
  }
  
  // Decorative border
  stroke(139, 90, 43);
  strokeWeight(8);
  noFill();
  rect(20, 20, width - 40, height - 40, 15);
  
  // Inner border
  stroke(101, 67, 33);
  strokeWeight(3);
  rect(35, 35, width - 70, height - 70, 10);
  
  // Game title - medieval style
  fill(180, 140, 80);
  textAlign(CENTER);
  textSize(72);
  textStyle(BOLD);
  text('⚔ LIQUID WARS ⚔', width / 2, 120);
  
  // Decorative liquid drops
  fill(80, 120, 180, 100);
  noStroke();
  circle(width / 2 - 200, 110, 15);
  circle(width / 2 + 200, 110, 15);
  circle(width / 2 - 180, 130, 10);
  circle(width / 2 + 180, 130, 10);
  
  // Subtitle
  fill(200, 160, 100);
  textSize(28);
  textStyle(NORMAL);
  text('Choose Your Battlefield', width / 2, 180);
  
  // Game Info button (top right, inside border)
  let infoButtonX = width - 180;
  let infoButtonY = 70;
  let infoButtonW = 120;
  let infoButtonH = 40;
  
  gameInfoButtonHovered = mouseX > infoButtonX && mouseX < infoButtonX + infoButtonW &&
                          mouseY > infoButtonY && mouseY < infoButtonY + infoButtonH;
  
  // Stone frame for info button
  fill(80, 80, 80);
  rect(infoButtonX - 3, infoButtonY - 3, infoButtonW + 6, infoButtonH + 6, 8);
  
  if (gameInfoButtonHovered) {
    fill(101, 67, 33);
    stroke(220, 200, 150);
    strokeWeight(2);
  } else {
    fill(70, 50, 30);
    stroke(139, 90, 43);
    strokeWeight(2);
  }
  rect(infoButtonX, infoButtonY, infoButtonW, infoButtonH, 5);
  
  fill(220, 200, 150);
  noStroke();
  textSize(18);
  textStyle(BOLD);
  text('Game Info', infoButtonX + infoButtonW / 2, infoButtonY + infoButtonH / 2 + 6);
  
  // Draw map selection grid (3x2)
  let mapCardWidth = 280;
  let mapCardHeight = 140;
  let spacing = 30;
  let cols = 3;
  let rows = 2;
  let totalWidth = cols * mapCardWidth + (cols - 1) * spacing;
  let startX = (width - totalWidth) / 2;
  let startY = 240;
  
  hoveredMapIndex = null;
  
  for (let i = 0; i < MAPS.length; i++) {
    let col = i % cols;
    let row = floor(i / cols);
    let x = startX + col * (mapCardWidth + spacing);
    let y = startY + row * (mapCardHeight + spacing);
    
    let isHovered = mouseX > x && mouseX < x + mapCardWidth &&
                    mouseY > y && mouseY < y + mapCardHeight;
    
    if (isHovered) {
      hoveredMapIndex = i;
    }
    
    // Stone frame
    fill(90, 90, 90);
    rect(x - 5, y - 5, mapCardWidth + 10, mapCardHeight + 10, 12);
    
    // Map card background
    if (selectedMapIndex === i) {
      fill(139, 90, 43);
      stroke(255, 215, 0);
      strokeWeight(4);
    } else if (isHovered) {
      fill(101, 67, 33);
      stroke(180, 140, 80);
      strokeWeight(3);
    } else {
      fill(60, 50, 40);
      stroke(80, 70, 60);
      strokeWeight(2);
    }
    rect(x, y, mapCardWidth, mapCardHeight, 8);
    
    // Map name
    fill(220, 200, 150);
    noStroke();
    textAlign(CENTER);
    textSize(22);
    textStyle(BOLD);
    text(MAPS[i].name, x + mapCardWidth / 2, y + 35);
    
    // Map type
    fill(180, 160, 120);
    textSize(16);
    textStyle(NORMAL);
    text('Path Layout: ' + MAPS[i].pathType.toUpperCase(), x + mapCardWidth / 2, y + 65);
    
    // Map description
    fill(200, 180, 140);
    textSize(14);
    textStyle(ITALIC);
    // Word wrap for description
    let words = MAPS[i].description.split(' ');
    let line = '';
    let lineY = y + 90;
    for (let word of words) {
      let testLine = line + word + ' ';
      textSize(14);
      if (textWidth(testLine) > mapCardWidth - 20 && line.length > 0) {
        text(line, x + mapCardWidth / 2, lineY);
        line = word + ' ';
        lineY += 18;
      } else {
        line = testLine;
      }
    }
    text(line, x + mapCardWidth / 2, lineY);
  }
  
  // Credits at bottom
  fill(150, 120, 80);
  textAlign(CENTER);
  textSize(14);
  textStyle(NORMAL);
  text('Created by ogip & msteohrv', width / 2, height - 40);
  
  // Draw 90s-style game info modal if visible
  if (showGameInfo) {
    drawGameInfoModal();
  }
}

function drawGameInfoModal() {
  // Modal backdrop
  fill(0, 0, 0, 180);
  noStroke();
  rect(0, 0, width, height);
  
  // Modal window - 90s style
  let modalW = 600;
  let modalH = 500;
  let modalX = (width - modalW) / 2;
  let modalY = (height - modalH) / 2;
  
  // Outer border (dark gray)
  fill(50, 50, 50);
  rect(modalX - 4, modalY - 4, modalW + 8, modalH + 8);
  
  // Main window (light gray)
  fill(192, 192, 192);
  rect(modalX, modalY, modalW, modalH);
  
  // Title bar (blue gradient - Windows 95 style)
  let gradient = drawingContext.createLinearGradient(modalX, modalY, modalX, modalY + 30);
  gradient.addColorStop(0, '#000080');
  gradient.addColorStop(1, '#1084d0');
  drawingContext.fillStyle = gradient;
  drawingContext.fillRect(modalX, modalY, modalW, 30);
  
  // Title bar text
  fill(255);
  textAlign(LEFT);
  textSize(16);
  textStyle(BOLD);
  text('Game Information', modalX + 10, modalY + 20);
  
  // Close button (X) - top right
  let closeX = modalX + modalW - 30;
  let closeY = modalY + 5;
  let closeSize = 20;
  
  // Check if mouse over close button
  let closeHovered = mouseX > closeX && mouseX < closeX + closeSize &&
                     mouseY > closeY && mouseY < closeY + closeSize;
  
  fill(closeHovered ? 220 : 192);
  stroke(0);
  strokeWeight(1);
  rect(closeX, closeY, closeSize, closeSize);
  
  // X symbol
  stroke(0);
  strokeWeight(2);
  line(closeX + 5, closeY + 5, closeX + closeSize - 5, closeY + closeSize - 5);
  line(closeX + closeSize - 5, closeY + 5, closeX + 5, closeY + closeSize - 5);
  
  // Content area
  fill(255);
  noStroke();
  rect(modalX + 10, modalY + 40, modalW - 20, modalH - 50);
  
  // Content text
  fill(0);
  textAlign(LEFT);
  textSize(16);
  textStyle(BOLD);
  text('HOW TO PLAY:', modalX + 30, modalY + 70);
  
  textStyle(NORMAL);
  textSize(14);
  let contentX = modalX + 30;
  let lineHeight = 22;
  let y = modalY + 95;
  
  let instructions = [
    '• Select a map, then choose your legion color',
    '• Control your liquid army with your mouse cursor',
    '• Your particles will flow toward where you point',
    '',
    'COMBAT MECHANICS:',
    '• Particles deal damage when facing enemies',
    '• Each hit deals 20% damage (5 hits = kill)',
    '• Directional combat: face your target to attack',
    '• Keep your army cohesive for better defense',
    '',
    'STRATEGY TIPS:',
    '• Use obstacles for tactical positioning',
    '• Flank enemies from multiple angles',
    '• Protect your weakest units',
    '• Control the center castle for advantage',
    '',
    'Win by eliminating all enemy legions!'
  ];
  
  for (let line of instructions) {
    if (line.includes(':')) {
      textStyle(BOLD);
      fill(0, 0, 128);
    } else {
      textStyle(NORMAL);
      fill(0);
    }
    text(line, contentX, y);
    y += lineHeight;
  }
  
  // OK button at bottom
  let okButtonW = 100;
  let okButtonH = 30;
  let okButtonX = modalX + (modalW - okButtonW) / 2;
  let okButtonY = modalY + modalH - 45;
  
  let okHovered = mouseX > okButtonX && mouseX < okButtonX + okButtonW &&
                  mouseY > okButtonY && mouseY < okButtonY + okButtonH;
  
  // Button shadow (3D effect)
  fill(0);
  rect(okButtonX + 2, okButtonY + 2, okButtonW, okButtonH);
  
  fill(okHovered ? 220 : 192);
  stroke(0);
  strokeWeight(2);
  rect(okButtonX, okButtonY, okButtonW, okButtonH);
  
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(16);
  textStyle(BOLD);
  text('OK', okButtonX + okButtonW / 2, okButtonY + okButtonH / 2 + 6);
}

function drawTeamSelection() {
  // Draw SVG background - fill entire screen
  if (backgroundImg) {
    image(backgroundImg, 0, 0, width, height);
  }
  
  // Update and draw animated menu particles
  for (let particle of menuParticles) {
    particle.update();
    particle.checkNearby(menuParticles);
  }
  
  // Semi-transparent overlay for readability
  fill(45, 35, 25, 200);
  noStroke();
  rect(0, 0, width, height);
  
  // Draw menu particles on top of dark overlay
  for (let particle of menuParticles) {
    particle.draw();
  }
  
  // Decorative border
  stroke(139, 90, 43);
  strokeWeight(8);
  noFill();
  rect(20, 20, width - 40, height - 40, 15);
  
  // Inner border
  stroke(101, 67, 33);
  strokeWeight(3);
  rect(35, 35, width - 70, height - 70, 10);
  
  // Game title - medieval style
  fill(180, 140, 80);
  textAlign(CENTER);
  textSize(72);
  textStyle(BOLD);
  text('⚔ LIQUID WARS ⚔', width / 2, height / 2 - 200);
  
  // Decorative liquid drops
  fill(80, 120, 180, 100);
  noStroke();
  circle(width / 2 - 200, height / 2 - 210, 15);
  circle(width / 2 + 200, height / 2 - 210, 15);
  circle(width / 2 - 180, height / 2 - 190, 10);
  circle(width / 2 + 180, height / 2 - 190, 10);
  
  // Subtitle
  fill(200, 160, 100);
  textSize(24);
  textStyle(NORMAL);
  text('Choose Your Legion', width / 2, height / 2 - 140);
  
  // Draw team color boxes - centered
  let boxSize = 100;
  let spacing = 30;
  let startX = (width - (boxSize * 4 + spacing * 3)) / 2;
  let startY = height / 2 - 50;
  
  hoveredTeam = null;
  
  for (let i = 0; i < TEAM_COLORS.length; i++) {
    let x = startX + i * (boxSize + spacing);
    let y = startY;
    
    // Check if mouse is hovering
    let isHovered = mouseX > x && mouseX < x + boxSize &&
                    mouseY > y && mouseY < y + boxSize;
    
    if (isHovered) {
      hoveredTeam = i;
    }
    
    // Stone/metal frame
    fill(80, 80, 80);
    rect(x - 5, y - 5, boxSize + 10, boxSize + 10, 8);
    
    // Draw liquid-filled box with wave effect
    fill(TEAM_COLORS[i].color);
    if (isHovered) {
      stroke(220, 200, 150);
      strokeWeight(4);
    } else {
      stroke(60, 60, 60);
      strokeWeight(2);
    }
    rect(x, y, boxSize, boxSize, 5);
    
    // Liquid shimmer effect
    fill(255, 255, 255, 50);
    noStroke();
    ellipse(x + boxSize * 0.3, y + boxSize * 0.3, boxSize * 0.4, boxSize * 0.3);
    
    // Draw team name in medieval style
    fill(220, 200, 150);
    noStroke();
    textSize(20);
    textStyle(BOLD);
    text(TEAM_COLORS[i].name + ' Legion', x + boxSize / 2, y + boxSize + 30);
  }
  
  // Credits at bottom
  fill(150, 120, 80);
  textSize(14);
  textStyle(NORMAL);
  text('Created by ogip & msteohrv', width / 2, height - 60);
}

function drawOpponentSelection() {
  // Draw SVG background - fill entire screen
  if (backgroundImg) {
    image(backgroundImg, 0, 0, width, height);
  }
  
  // Update and draw animated menu particles
  for (let particle of menuParticles) {
    particle.update();
    particle.checkNearby(menuParticles);
  }
  
  // Semi-transparent overlay for readability
  fill(45, 35, 25, 200);
  noStroke();
  rect(0, 0, width, height);
  
  // Draw menu particles on top of dark overlay
  for (let particle of menuParticles) {
    particle.draw();
  }
  
  // Decorative border
  stroke(139, 90, 43);
  strokeWeight(8);
  noFill();
  rect(20, 20, width - 40, height - 40, 15);
  
  // Inner border
  stroke(101, 67, 33);
  strokeWeight(3);
  rect(35, 35, width - 70, height - 70, 10);
  
  // Title
  fill(180, 140, 80);
  textAlign(CENTER);
  textSize(56);
  textStyle(BOLD);
  text('⚔ BATTLE PREPARATION ⚔', width / 2, height / 2 - 240);
  
  // Show selected team with medieval style
  textSize(22);
  textStyle(NORMAL);
  fill(200, 160, 100);
  text('Your Legion:', width / 2, height / 2 - 180);
  fill(TEAM_COLORS[playerTeamIndex].color);
  textSize(28);
  textStyle(BOLD);
  text(TEAM_COLORS[playerTeamIndex].name + ' Legion', width / 2, height / 2 - 150);
  
  // Opponents section
  fill(200, 160, 100);
  textSize(22);
  textStyle(NORMAL);
  text('Enemy Legions (1-3)', width / 2, height / 2 - 100);
  
  // Draw opponent count buttons - centered
  let buttonWidth = 80;
  let buttonHeight = 60;
  let spacing = 30;
  let startX = (width - (buttonWidth * 3 + spacing * 2)) / 2;
  let startY = height / 2 - 60;
  
  hoveredOpponentCount = null;
  
  for (let i = 1; i <= 3; i++) {
    let x = startX + (i - 1) * (buttonWidth + spacing);
    let y = startY;
    
    let isHovered = mouseX > x && mouseX < x + buttonWidth &&
                    mouseY > y && mouseY < y + buttonHeight;
    
    if (isHovered) {
      hoveredOpponentCount = i;
    }
    
    // Stone frame
    fill(80, 80, 80);
    rect(x - 4, y - 4, buttonWidth + 8, buttonHeight + 8, 8);
    
    // Draw button - medieval style
    if (numOpponents === i) {
      fill(139, 90, 43);
      stroke(220, 200, 150);
      strokeWeight(3);
    } else if (isHovered) {
      fill(101, 67, 33);
      stroke(180, 140, 80);
      strokeWeight(3);
    } else {
      fill(70, 50, 30);
      stroke(60, 60, 60);
      strokeWeight(2);
    }
    
    rect(x, y, buttonWidth, buttonHeight, 5);
    
    // Draw number with medieval style
    fill(220, 200, 150);
    noStroke();
    textSize(36);
    textStyle(BOLD);
    text(i, x + buttonWidth / 2, y + buttonHeight / 2 + 12);
  }
  
  // Particles per team section - army size
  fill(200, 160, 100);
  textSize(22);
  textStyle(NORMAL);
  text('Army Size (Liquid Soldiers)', width / 2, height / 2 + 50);
  
  // Particle count options - centered
  let particleOptions = [50, 100, 200, 300];
  let particleButtonWidth = 80;
  let particleButtonHeight = 60;
  let particleStartX = (width - (particleButtonWidth * 4 + spacing * 3)) / 2;
  let particleStartY = height / 2 + 80;
  
  hoveredParticleCount = null;
  
  for (let i = 0; i < particleOptions.length; i++) {
    let x = particleStartX + i * (particleButtonWidth + spacing);
    let y = particleStartY;
    let count = particleOptions[i];
    
    let isHovered = mouseX > x && mouseX < x + particleButtonWidth &&
                    mouseY > y && mouseY < y + particleButtonHeight;
    
    if (isHovered) {
      hoveredParticleCount = count;
    }
    
    // Stone frame
    fill(80, 80, 80);
    rect(x - 4, y - 4, particleButtonWidth + 8, particleButtonHeight + 8, 8);
    
    // Draw button - medieval style
    if (particlesPerTeam === count) {
      fill(139, 90, 43);
      stroke(220, 200, 150);
      strokeWeight(3);
    } else if (isHovered) {
      fill(101, 67, 33);
      stroke(180, 140, 80);
      strokeWeight(3);
    } else {
      fill(70, 50, 30);
      stroke(60, 60, 60);
      strokeWeight(2);
    }
    
    rect(x, y, particleButtonWidth, particleButtonHeight, 5);
    
    // Draw number with medieval style
    fill(220, 200, 150);
    noStroke();
    textSize(24);
    textStyle(BOLD);
    text(count, x + particleButtonWidth / 2, y + particleButtonHeight / 2 + 8);
  }
  
  // Start button - centered
  let startButtonY = height / 2 + 180;
  let startButtonWidth = 240;
  let startButtonHeight = 70;
  let startButtonX = (width - startButtonWidth) / 2;
  
  let isStartHovered = mouseX > startButtonX && mouseX < startButtonX + startButtonWidth &&
                       mouseY > startButtonY && mouseY < startButtonY + startButtonHeight;
  
  // Stone frame for start button
  fill(90, 90, 90);
  rect(startButtonX - 6, startButtonY - 6, startButtonWidth + 12, startButtonHeight + 12, 12);
  
  if (isStartHovered) {
    fill(180, 70, 70);
    stroke(255, 200, 100);
    strokeWeight(4);
  } else {
    fill(139, 50, 50);
    stroke(180, 140, 80);
    strokeWeight(3);
  }
  
  rect(startButtonX, startButtonY, startButtonWidth, startButtonHeight, 8);
  
  fill(255, 240, 200);
  noStroke();
  textSize(32);
  textStyle(BOLD);
  text('⚔ BEGIN BATTLE ⚔', width / 2, startButtonY + startButtonHeight / 2 + 10);
}

function drawGame() {
  // Calculate scale to fit entire map on screen
  mapScale = min(width / MAP_SIZE, height / MAP_SIZE);
  
  // Update team targets
  updateTeamTargets();
  
  // Check for win condition
  checkWinCondition();
  
  // Draw map background
  fill(40, 45, 50);
  noStroke();
  rect(0, 0, width, height);
  
  // Draw map border (scaled to fit screen)
  noFill();
  stroke(100);
  strokeWeight(3);
  rect(0, 0, MAP_SIZE * mapScale, MAP_SIZE * mapScale);
  
  // Draw obstacles
  for (let obstacle of obstacles) {
    obstacle.draw();
  }
  
  // Clear and rebuild spatial grid
  spatialGrid.clear();
  for (let particle of particles) {
    if (particle.alive) {
      spatialGrid.insert(particle);
    }
  }
  
  // Update particles - first pass: movement
  for (let particle of particles) {
    if (particle.alive) {
      particle.update();
    }
  }
  
  // Update particles - second pass: separation (liquid physics)
  for (let particle of particles) {
    if (particle.alive) {
      particle.separate();
    }
  }
  
  // Update particles - third pass: morale system
  for (let particle of particles) {
    if (particle.alive) {
      particle.updateMorale();
    }
  }
  
  // Update particles - fourth pass: enemy collisions (combat)
  for (let particle of particles) {
    if (particle.alive) {
      particle.checkEnemyCollision();
    }
  }
  
  // Update projectiles (arrows, tank shells)
  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].update();
    
    // Remove dead projectiles
    if (!projectiles[i].alive) {
      projectiles.splice(i, 1);
    }
  }
  
  // Update explosions
  for (let i = explosions.length - 1; i >= 0; i--) {
    explosions[i].update();
    
    // Remove finished explosions
    if (!explosions[i].alive) {
      explosions.splice(i, 1);
    }
  }
  
  // Update blood splatters
  for (let i = bloodSplatters.length - 1; i >= 0; i--) {
    bloodSplatters[i].update();
    
    // Remove faded blood
    if (!bloodSplatters[i].alive) {
      bloodSplatters.splice(i, 1);
    }
  }
  
  // Draw blood splatters (underneath everything else)
  for (let splatter of bloodSplatters) {
    splatter.draw();
  }
  
  // Draw particles
  for (let particle of particles) {
    particle.draw();
  }
  
  // Draw projectiles (on top of units)
  for (let projectile of projectiles) {
    projectile.draw();
  }
  
  // Draw explosions (on top of projectiles)
  for (let explosion of explosions) {
    explosion.draw();
  }
  
  // Update and draw death animations
  for (let i = deathAnimations.length - 1; i >= 0; i--) {
    deathAnimations[i].update();
    deathAnimations[i].draw();
    
    // Remove finished animations
    if (!deathAnimations[i].alive) {
      deathAnimations.splice(i, 1);
    }
  }
  
  // Don't draw NPC team target indicators (hidden)
  
  // Draw UI overlay
  drawGameUI();
  
  // Draw cursor indicator for player
  drawCursorIndicator();
}

function updateTeamTargets() {
  for (let i = 0; i < teams.length; i++) {
    if (!teams[i].active) continue;
    
    if (teams[i].isPlayer) {
      // Player team follows cursor (convert screen coords to map coords)
      teams[i].targetX = mouseX / mapScale;
      teams[i].targetY = mouseY / mapScale;
    } else {
      // NPC teams use AI
      updateNPCTarget(i);
    }
  }
}

function updateNPCTarget(teamIndex) {
  // Initialize target and smoothing if not set
  if (!teams[teamIndex].targetX) {
    teams[teamIndex].targetX = MAP_SIZE / 2;
    teams[teamIndex].targetY = MAP_SIZE / 2;
    teams[teamIndex].desiredTargetX = MAP_SIZE / 2;
    teams[teamIndex].desiredTargetY = MAP_SIZE / 2;
    teams[teamIndex].targetUpdateTimer = 0;
  }
  
  teams[teamIndex].targetUpdateTimer++;
  
  // Update desired target every 90 frames (1.5 seconds at 60fps)
  if (teams[teamIndex].targetUpdateTimer > 90) {
    teams[teamIndex].targetUpdateTimer = 0;
    
    // AI Logic: Choose target based on strategy
    let myCenter = calculateTeamCenter(teamIndex);
    if (!myCenter) return;
    
    let nearestEnemy = findNearestEnemyTeamCenter(teamIndex);
    let weakestEnemy = findWeakestEnemyTeamCenter(teamIndex);
    
    // Strategy: Attack weakest enemy if they're nearby, otherwise attack nearest
    let targetEnemy = null;
    if (weakestEnemy && nearestEnemy) {
      let distToWeakest = dist(myCenter.x, myCenter.y, weakestEnemy.x, weakestEnemy.y);
      let distToNearest = dist(myCenter.x, myCenter.y, nearestEnemy.x, nearestEnemy.y);
      
      // If weakest is within 1.5x the distance to nearest, target them
      if (distToWeakest < distToNearest * 1.5) {
        targetEnemy = weakestEnemy;
      } else {
        targetEnemy = nearestEnemy;
      }
    } else {
      targetEnemy = nearestEnemy || weakestEnemy;
    }
    
    if (targetEnemy) {
      // Move towards enemy with tactical offset (flank slightly)
      let angle = atan2(targetEnemy.y - myCenter.y, targetEnemy.x - myCenter.x);
      let offsetAngle = angle + random(-0.3, 0.3); // Small random flank
      let offsetDist = random(50, 150);
      
      teams[teamIndex].desiredTargetX = targetEnemy.x + cos(offsetAngle) * offsetDist;
      teams[teamIndex].desiredTargetY = targetEnemy.y + sin(offsetAngle) * offsetDist;
    } else {
      // No enemies, move to center
      teams[teamIndex].desiredTargetX = MAP_SIZE / 2;
      teams[teamIndex].desiredTargetY = MAP_SIZE / 2;
    }
  }
  
  // Smoothly interpolate current target towards desired target
  let smoothing = 0.05; // Smooth cursor movement
  teams[teamIndex].targetX += (teams[teamIndex].desiredTargetX - teams[teamIndex].targetX) * smoothing;
  teams[teamIndex].targetY += (teams[teamIndex].desiredTargetY - teams[teamIndex].targetY) * smoothing;
}

function findNearestEnemyTeamCenter(teamIndex) {
  let nearestDist = Infinity;
  let nearest = null;
  
  // Calculate center of current team
  let myCenter = calculateTeamCenter(teamIndex);
  if (!myCenter) return null;
  
  // Find nearest enemy team center
  for (let i = 0; i < teams.length; i++) {
    if (!teams[i].active || i === teamIndex) continue;
    
    let enemyCenter = calculateTeamCenter(i);
    if (!enemyCenter) continue;
    
    let dx = enemyCenter.x - myCenter.x;
    let dy = enemyCenter.y - myCenter.y;
    let dist = sqrt(dx * dx + dy * dy);
    
    if (dist < nearestDist) {
      nearestDist = dist;
      nearest = enemyCenter;
    }
  }
  
  return nearest;
}

function calculateTeamCenter(teamIndex) {
  let count = 0;
  let sumX = 0;
  let sumY = 0;
  
  for (let particle of particles) {
    if (particle.alive && particle.teamIndex === teamIndex) {
      sumX += particle.x;
      sumY += particle.y;
      count++;
    }
  }
  
  if (count === 0) return null;
  
  return {
    x: sumX / count,
    y: sumY / count,
    count: count
  };
}

function findWeakestEnemyTeamCenter(teamIndex) {
  let weakest = null;
  let weakestCount = Infinity;
  
  // Calculate center of current team
  let myCenter = calculateTeamCenter(teamIndex);
  if (!myCenter) return null;
  
  // Find enemy team with fewest particles
  for (let i = 0; i < teams.length; i++) {
    if (!teams[i].active || i === teamIndex) continue;
    
    let enemyCenter = calculateTeamCenter(i);
    if (!enemyCenter) continue;
    
    if (enemyCenter.count < weakestCount) {
      weakestCount = enemyCenter.count;
      weakest = enemyCenter;
    }
  }
  
  return weakest;
}

function drawTeamTargets() {
  // Draw target indicators for NPC teams (not used - targets are hidden)
  for (let i = 0; i < teams.length; i++) {
    if (!teams[i].active || teams[i].isPlayer) continue;
    if (!teams[i].targetX) continue;
    
    let screenX = teams[i].targetX * mapScale;
    let screenY = teams[i].targetY * mapScale;
    
    noFill();
    stroke(teams[i].color);
    strokeWeight(2);
    circle(screenX, screenY, 20 * mapScale);
    
    strokeWeight(1);
    line(screenX - 10 * mapScale, screenY, screenX + 10 * mapScale, screenY);
    line(screenX, screenY - 10 * mapScale, screenX, screenY + 10 * mapScale);
  }
}

function drawCursorIndicator() {
  // Draw a circle around the cursor for player team
  noFill();
  stroke(teams[playerTeamIndex].color);
  strokeWeight(2);
  circle(mouseX, mouseY, 30);
  
  // Draw crosshair
  stroke(teams[playerTeamIndex].color);
  strokeWeight(1);
  line(mouseX - 15, mouseY, mouseX + 15, mouseY);
  line(mouseX, mouseY - 15, mouseX, mouseY + 15);
}

function drawGameUI() {
  // Count particles per team
  let teamCounts = {};
  for (let particle of particles) {
    if (particle.alive) {
      if (!teamCounts[particle.teamIndex]) {
        teamCounts[particle.teamIndex] = 0;
      }
      teamCounts[particle.teamIndex]++;
    }
  }
  
  // Get active teams
  let activeTeams = [];
  for (let i = 0; i < teams.length; i++) {
    if (teams[i].active) {
      activeTeams.push({
        index: i,
        name: teams[i].name,
        color: teams[i].color,
        count: teamCounts[i] || 0,
        isPlayer: teams[i].isPlayer
      });
    }
  }
  
  // Full-width top bar positioned just outside the map
  let barHeight = 60;
  let barY = -10; // Position slightly outside/above the map
  
  // Semi-transparent background for UI bar
  fill(0, 0, 0, 200);
  noStroke();
  rect(0, barY, width, barHeight);
  
  // Medieval border
  stroke(139, 90, 43);
  strokeWeight(2);
  line(0, barY + barHeight, width, barY + barHeight);
  
  // Calculate total soldiers
  let totalSoldiers = 0;
  for (let team of activeTeams) {
    totalSoldiers += team.count;
  }
  
  // Calculate proportional widths based on soldier count
  let teamWidths = [];
  let teamPositions = [];
  let currentX = 0;
  
  for (let i = 0; i < activeTeams.length; i++) {
    let team = activeTeams[i];
    let proportion = totalSoldiers > 0 ? team.count / totalSoldiers : 1 / activeTeams.length;
    let teamWidth = width * proportion;
    teamWidths.push(teamWidth);
    teamPositions.push(currentX);
    currentX += teamWidth;
  }
  
  // Draw each team side by side with proportional widths
  for (let i = 0; i < activeTeams.length; i++) {
    let team = activeTeams[i];
    let x = teamPositions[i];
    let teamWidth = teamWidths[i];
    let centerX = x + teamWidth / 2;
    
    // Highlight player team
    if (team.isPlayer) {
      fill(80, 60, 40, 150);
      noStroke();
      rect(x, barY, teamWidth, barHeight);
    }
    
    // Divider between teams (except last)
    if (i < activeTeams.length - 1) {
      stroke(100, 80, 60);
      strokeWeight(1);
      line(x + teamWidth, barY, x + teamWidth, barY + barHeight);
    }
    
    // Team color indicator (small circle)
    fill(team.color);
    noStroke();
    circle(centerX - 50, barY + barHeight / 2, 20);
    
    // Team name
    fill(220, 200, 150);
    textAlign(CENTER);
    textSize(18);
    textStyle(BOLD);
    text(team.name, centerX, barY + barHeight / 2 - 10);
    
    // Particle count
    fill(255);
    textSize(16);
    textStyle(NORMAL);
    text(team.count + ' soldiers', centerX, barY + barHeight / 2 + 12);
    
    // Crown for player team
    if (team.isPlayer) {
      fill(255, 215, 0);
      textSize(20);
      text('♔', centerX + 65, barY + barHeight / 2 + 5);
    }
  }
}

function checkWinCondition() {
  // Count alive teams
  let aliveTeams = [];
  for (let i = 0; i < teams.length; i++) {
    if (!teams[i].active) continue;
    
    let hasAliveParticles = particles.some(p => p.alive && p.teamIndex === i);
    if (hasAliveParticles) {
      aliveTeams.push(i);
    }
  }
  
  // If only one team remains, they win
  if (aliveTeams.length === 1) {
    winningTeam = aliveTeams[0];
    gameState = GAME_STATE.GAME_OVER;
  }
}

function drawGameOver() {
  // Calculate scale to fit entire map on screen
  mapScale = min(width / MAP_SIZE, height / MAP_SIZE);
  
  // Draw the final game state in the background
  fill(40, 45, 50);
  noStroke();
  rect(0, 0, width, height);
  
  // Draw map border (scaled)
  noFill();
  stroke(100);
  strokeWeight(3);
  rect(0, 0, MAP_SIZE * mapScale, MAP_SIZE * mapScale);
  
  // Draw obstacles
  for (let obstacle of obstacles) {
    obstacle.draw();
  }
  
  // Draw remaining particles
  for (let particle of particles) {
    particle.draw();
  }
  
  // Draw semi-transparent overlay
  fill(0, 0, 0, 200);
  noStroke();
  rect(0, 0, width, height);
  
  // Draw victory/defeat message
  fill(255);
  textAlign(CENTER);
  textSize(72);
  
  if (winningTeam === playerTeamIndex) {
    fill(50, 255, 50);
    text('VICTORY!', width / 2, height / 2 - 80);
  } else {
    fill(255, 50, 50);
    text('DEFEAT', width / 2, height / 2 - 80);
  }
  
  // Display winning team
  fill(teams[winningTeam].color);
  textSize(48);
  text(teams[winningTeam].name + ' Team Wins!', width / 2, height / 2);
  
  // Instructions to restart
  fill(200);
  textSize(24);
  text('Click to return to menu', width / 2, height / 2 + 80);
}

function mousePressed() {
  if (gameState === GAME_STATE.GAME_OVER) {
    // Reset to map selection
    gameState = GAME_STATE.MAP_SELECTION;
    selectedMapIndex = null;
    playerTeamIndex = null;
    winningTeam = null;
    particles = [];
    obstacles = [];
    teams = [];
  } else if (gameState === GAME_STATE.MAP_SELECTION) {
    // Check if game info modal is open
    if (showGameInfo) {
      // Check if close button or OK button clicked
      let modalW = 600;
      let modalH = 500;
      let modalX = (width - modalW) / 2;
      let modalY = (height - modalH) / 2;
      
      // Close button (X)
      let closeX = modalX + modalW - 30;
      let closeY = modalY + 5;
      let closeSize = 20;
      
      if (mouseX > closeX && mouseX < closeX + closeSize &&
          mouseY > closeY && mouseY < closeY + closeSize) {
        showGameInfo = false;
        return;
      }
      
      // OK button
      let okButtonW = 100;
      let okButtonH = 30;
      let okButtonX = modalX + (modalW - okButtonW) / 2;
      let okButtonY = modalY + modalH - 45;
      
      if (mouseX > okButtonX && mouseX < okButtonX + okButtonW &&
          mouseY > okButtonY && mouseY < okButtonY + okButtonH) {
        showGameInfo = false;
        return;
      }
    } else {
      // Check if Game Info button clicked
      let infoButtonX = width - 180;
      let infoButtonY = 70;
      let infoButtonW = 120;
      let infoButtonH = 40;
      
      if (mouseX > infoButtonX && mouseX < infoButtonX + infoButtonW &&
          mouseY > infoButtonY && mouseY < infoButtonY + infoButtonH) {
        showGameInfo = true;
        return;
      }
      
      // Check if map clicked
      if (hoveredMapIndex !== null) {
        selectedMapIndex = hoveredMapIndex;
        // Apply map settings
        selectedPathType = MAPS[selectedMapIndex].pathType;
        gameState = GAME_STATE.TEAM_SELECTION;
        console.log('Selected map:', MAPS[selectedMapIndex].name, 'with path type:', selectedPathType);
      }
    }
  } else if (gameState === GAME_STATE.TEAM_SELECTION && hoveredTeam !== null) {
    playerTeamIndex = hoveredTeam;
    gameState = GAME_STATE.OPPONENT_SELECTION;
    console.log('Selected team:', TEAM_COLORS[playerTeamIndex].name);
  } else if (gameState === GAME_STATE.OPPONENT_SELECTION) {
    // Check if opponent count button clicked
    if (hoveredOpponentCount !== null) {
      numOpponents = hoveredOpponentCount;
      console.log('Selected opponents:', numOpponents);
    }
    
    // Check if particle count button clicked
    if (hoveredParticleCount !== null) {
      particlesPerTeam = hoveredParticleCount;
      console.log('Particles per team:', particlesPerTeam);
    }
    
    // Check if start button clicked (must match drawOpponentSelection coordinates)
    let startButtonY = height / 2 + 180;
    let startButtonWidth = 240;
    let startButtonHeight = 70;
    let startButtonX = (width - startButtonWidth) / 2;
    
    if (mouseX > startButtonX && mouseX < startButtonX + startButtonWidth &&
        mouseY > startButtonY && mouseY < startButtonY + startButtonHeight) {
      startGame();
    }
  }
}

function startGame() {
  // Clear all game arrays
  deathAnimations = [];
  projectiles = [];
  explosions = [];
  bloodSplatters = [];
  
  // Initialize teams
  teams = [];
  
  for (let i = 0; i < TEAM_COLORS.length; i++) {
    teams.push({
      name: TEAM_COLORS[i].name,
      color: TEAM_COLORS[i].color,
      active: false,
      isPlayer: false,
      targetX: MAP_SIZE / 2,
      targetY: MAP_SIZE / 2,
      targetUpdateTimer: 0
    });
  }
  
  // Activate player team
  teams[playerTeamIndex].active = true;
  teams[playerTeamIndex].isPlayer = true;
  
  // Activate opponent teams
  let opponentsActivated = 0;
  for (let i = 0; i < teams.length && opponentsActivated < numOpponents; i++) {
    if (i !== playerTeamIndex) {
      teams[i].active = true;
      opponentsActivated++;
    }
  }
  
  // Initialize spatial grid for optimization
  spatialGrid = new SpatialGrid(MAP_SIZE, MAP_SIZE, gridCellSize);
  
  // Generate map
  generateMap();
  
  // Spawn particles for each team
  spawnTeamParticles();
  
  gameState = GAME_STATE.PLAYING;
  console.log('Game started!', teams);
}

function generateMap() {
  obstacles = [];
  
  // Add a smaller castle in the center
  let centerCastle = new CastleObstacle(MAP_SIZE / 2, MAP_SIZE / 2, 80);
  obstacles.push(centerCastle);
  
  // Generate path-based layout based on selected path type
  switch(selectedPathType) {
    case 'cross':
      generateCrossPath();
      break;
    case 'maze':
      generateMazePath();
      break;
    case 'open':
      generateOpenPath();
      break;
    case 'fortress':
      generateFortressPath();
      break;
    case 'valley':
      generateValleyPath();
      break;
    case 'rings':
      generateRingsPath();
      break;
    default:
      generateCrossPath();
  }
  
  console.log('Generated map with', obstacles.length, 'obstacles using', selectedPathType, 'path type');
}

// Cross-shaped paths - FULL MAP ACCESS with strategic cover points
function generateCrossPath() {
  // Only small cover obstacles - ENTIRE map is pathways
  let coverSize = 60;
  
  // Four quadrant cover points for flanking
  obstacles.push(new Obstacle(MAP_SIZE / 4 - coverSize / 2, MAP_SIZE / 4 - coverSize / 2, coverSize, coverSize));
  obstacles.push(new Obstacle(3 * MAP_SIZE / 4 - coverSize / 2, MAP_SIZE / 4 - coverSize / 2, coverSize, coverSize));
  obstacles.push(new Obstacle(MAP_SIZE / 4 - coverSize / 2, 3 * MAP_SIZE / 4 - coverSize / 2, coverSize, coverSize));
  obstacles.push(new Obstacle(3 * MAP_SIZE / 4 - coverSize / 2, 3 * MAP_SIZE / 4 - coverSize / 2, coverSize, coverSize));
  
  // Mid-edge cover points for flanking routes
  obstacles.push(new Obstacle(MAP_SIZE / 2 - coverSize / 2, MAP_SIZE / 6 - coverSize / 2, coverSize, coverSize));
  obstacles.push(new Obstacle(MAP_SIZE / 2 - coverSize / 2, 5 * MAP_SIZE / 6 - coverSize / 2, coverSize, coverSize));
  obstacles.push(new Obstacle(MAP_SIZE / 6 - coverSize / 2, MAP_SIZE / 2 - coverSize / 2, coverSize, coverSize));
  obstacles.push(new Obstacle(5 * MAP_SIZE / 6 - coverSize / 2, MAP_SIZE / 2 - coverSize / 2, coverSize, coverSize));
}

// Maze layout - FULL MAP ACCESS with scattered cover obstacles
function generateMazePath() {
  // Scattered small obstacles throughout - NO WALLS blocking paths
  let coverSize = 50;
  let spacing = MAP_SIZE / 7;
  
  // Grid of small cover obstacles (not walls!)
  for (let i = 1; i < 7; i++) {
    for (let j = 1; j < 7; j++) {
      let x = i * spacing - coverSize / 2;
      let y = j * spacing - coverSize / 2;
      
      // Skip center (castle is there) and spawn corners
      if (!isNearCenter(x, y) && !isNearSpawnCorner(x, y)) {
        // Only place some obstacles (checkerboard pattern)
        if ((i + j) % 2 === 0) {
          obstacles.push(new Obstacle(x, y, coverSize, coverSize));
        }
      }
    }
  }
}

function isNearSpawnCorner(x, y) {
  let cornerMargin = 150;
  return (
    (x < cornerMargin && y < cornerMargin) ||
    (x > MAP_SIZE - cornerMargin && y < cornerMargin) ||
    (x < cornerMargin && y > MAP_SIZE - cornerMargin) ||
    (x > MAP_SIZE - cornerMargin && y > MAP_SIZE - cornerMargin)
  );
}

function isNearCenter(x, y) {
  let centerMargin = 150;
  let dx = x - MAP_SIZE / 2;
  let dy = y - MAP_SIZE / 2;
  return sqrt(dx * dx + dy * dy) < centerMargin;
}

// Open plains - FULL MAP ACCESS with minimal cover pillars
function generateOpenPath() {
  // Very minimal obstacles - truly open battlefield
  let coverSize = 55;
  
  // Just a few strategic pillars scattered across the map
  obstacles.push(new Obstacle(MAP_SIZE / 4 - coverSize / 2, MAP_SIZE / 3 - coverSize / 2, coverSize, coverSize));
  obstacles.push(new Obstacle(3 * MAP_SIZE / 4 - coverSize / 2, MAP_SIZE / 3 - coverSize / 2, coverSize, coverSize));
  obstacles.push(new Obstacle(MAP_SIZE / 4 - coverSize / 2, 2 * MAP_SIZE / 3 - coverSize / 2, coverSize, coverSize));
  obstacles.push(new Obstacle(3 * MAP_SIZE / 4 - coverSize / 2, 2 * MAP_SIZE / 3 - coverSize / 2, coverSize, coverSize));
  
  // Mid-edge pillars
  obstacles.push(new Obstacle(MAP_SIZE / 6 - coverSize / 2, MAP_SIZE / 2 - coverSize / 2, coverSize, coverSize));
  obstacles.push(new Obstacle(5 * MAP_SIZE / 6 - coverSize / 2, MAP_SIZE / 2 - coverSize / 2, coverSize, coverSize));
  obstacles.push(new Obstacle(MAP_SIZE / 2 - coverSize / 2, MAP_SIZE / 6 - coverSize / 2, coverSize, coverSize));
  obstacles.push(new Obstacle(MAP_SIZE / 2 - coverSize / 2, 5 * MAP_SIZE / 6 - coverSize / 2, coverSize, coverSize));
}

// Fortress siege - FULL MAP ACCESS with broken wall sections as cover
function generateFortressPath() {
  // Broken fortress walls - small wall segments, not complete rings
  let wallLength = 100;
  let wallThickness = 40;
  let innerRadius = 300;
  let outerRadius = 450;
  
  // Inner broken ring - 8 short wall segments
  for (let i = 0; i < 8; i++) {
    let angle = (i * TWO_PI) / 8;
    let x = MAP_SIZE / 2 + cos(angle) * innerRadius - wallLength / 2;
    let y = MAP_SIZE / 2 + sin(angle) * innerRadius - wallThickness / 2;
    
    // Alternate horizontal and vertical segments
    if (i % 2 === 0) {
      obstacles.push(new Obstacle(x, y, wallLength, wallThickness));
    } else {
      obstacles.push(new Obstacle(x, y, wallThickness, wallLength));
    }
  }
  
  // Outer broken ring - 8 short wall segments (offset)
  for (let i = 0; i < 8; i++) {
    let angle = (i * TWO_PI) / 8 + PI / 8; // Offset by half
    let x = MAP_SIZE / 2 + cos(angle) * outerRadius - wallLength / 2;
    let y = MAP_SIZE / 2 + sin(angle) * outerRadius - wallThickness / 2;
    
    // Alternate horizontal and vertical segments
    if (i % 2 === 0) {
      obstacles.push(new Obstacle(x, y, wallLength, wallThickness));
    } else {
      obstacles.push(new Obstacle(x, y, wallThickness, wallLength));
    }
  }
  
  // Corner pillars
  let cornerSize = 50;
  obstacles.push(new Obstacle(150, 150, cornerSize, cornerSize));
  obstacles.push(new Obstacle(MAP_SIZE - 200, 150, cornerSize, cornerSize));
  obstacles.push(new Obstacle(150, MAP_SIZE - 200, cornerSize, cornerSize));
  obstacles.push(new Obstacle(MAP_SIZE - 200, MAP_SIZE - 200, cornerSize, cornerSize));
}

// Valley paths - FULL MAP ACCESS with diagonal rock formations as cover
function generateValleyPath() {
  // Scattered diagonal rock formations - NOT blocking walls
  let rockSize = 60;
  
  // Diagonal pattern of rock cover points (NW to SE)
  for (let i = 0; i < 5; i++) {
    let x = 150 + i * 170;
    let y = 150 + i * 170;
    if (!isNearCenter(x, y) && !isNearSpawnCorner(x, y)) {
      obstacles.push(new Obstacle(x - rockSize / 2, y - rockSize / 2, rockSize, rockSize));
    }
  }
  
  // Diagonal pattern of rock cover points (NE to SW)
  for (let i = 0; i < 5; i++) {
    let x = MAP_SIZE - 150 - i * 170;
    let y = 150 + i * 170;
    if (!isNearCenter(x, y) && !isNearSpawnCorner(x, y)) {
      obstacles.push(new Obstacle(x - rockSize / 2, y - rockSize / 2, rockSize, rockSize));
    }
  }
  
  // Additional scattered rocks for variety
  obstacles.push(new Obstacle(MAP_SIZE / 3 - rockSize / 2, MAP_SIZE / 4 - rockSize / 2, rockSize, rockSize));
  obstacles.push(new Obstacle(2 * MAP_SIZE / 3 - rockSize / 2, 3 * MAP_SIZE / 4 - rockSize / 2, rockSize, rockSize));
}

// Concentric rings - FULL MAP ACCESS with arc-shaped cover obstacles
function generateRingsPath() {
  // Small arc-shaped obstacles arranged in circles - NOT blocking rings
  let arcLength = 80;
  let arcThickness = 40;
  
  // Inner ring of arc obstacles (12 positions)
  let innerRadius = 250;
  for (let i = 0; i < 12; i++) {
    let angle = (i * TWO_PI) / 12;
    let x = MAP_SIZE / 2 + cos(angle) * innerRadius - arcLength / 2;
    let y = MAP_SIZE / 2 + sin(angle) * innerRadius - arcThickness / 2;
    
    if (!isNearSpawnCorner(x + arcLength / 2, y + arcThickness / 2)) {
      // Alternate between horizontal and vertical arcs
      if (i % 2 === 0) {
        obstacles.push(new Obstacle(x, y, arcLength, arcThickness));
      } else {
        obstacles.push(new Obstacle(x, y, arcThickness, arcLength));
      }
    }
  }
  
  // Outer ring of arc obstacles (16 positions)
  let outerRadius = 400;
  for (let i = 0; i < 16; i++) {
    let angle = (i * TWO_PI) / 16 + PI / 16; // Offset from inner ring
    let x = MAP_SIZE / 2 + cos(angle) * outerRadius - arcLength / 2;
    let y = MAP_SIZE / 2 + sin(angle) * outerRadius - arcThickness / 2;
    
    if (!isNearSpawnCorner(x + arcLength / 2, y + arcThickness / 2)) {
      // Alternate between horizontal and vertical arcs
      if (i % 2 === 0) {
        obstacles.push(new Obstacle(x, y, arcLength, arcThickness));
      } else {
        obstacles.push(new Obstacle(x, y, arcThickness, arcLength));
      }
    }
  }
}

function spawnTeamParticles() {
  particles = [];
  
  // Corner spawn positions (clockwise from top-left)
  let spawnPositions = [
    {x: 80, y: 80},              // Top-left (Red - index 0)
    {x: MAP_SIZE - 80, y: 80},   // Top-right (Blue - index 1)
    {x: MAP_SIZE - 80, y: MAP_SIZE - 80},  // Bottom-right (Green - index 2)
    {x: 80, y: MAP_SIZE - 80}    // Bottom-left (Yellow - index 3)
  ];
  
  for (let i = 0; i < teams.length; i++) {
    if (teams[i].active) {
      let spawnPos = spawnPositions[i];
      
      // Spawn mixed army composition
      let soldierCount = floor(particlesPerTeam * 0.6);  // 60% soldiers
      let tankCount = floor(particlesPerTeam * 0.2);     // 20% tanks
      let archerCount = particlesPerTeam - soldierCount - tankCount; // 20% archers
      
      // Spawn soldiers
      for (let j = 0; j < soldierCount; j++) {
        particles.push(new Particle(spawnPos.x, spawnPos.y, i, 'SOLDIER'));
      }
      
      // Spawn tanks
      for (let j = 0; j < tankCount; j++) {
        particles.push(new Particle(spawnPos.x, spawnPos.y, i, 'TANK'));
      }
      
      // Spawn archers
      for (let j = 0; j < archerCount; j++) {
        particles.push(new Particle(spawnPos.x, spawnPos.y, i, 'ARCHER'));
      }
      
      console.log('Spawned army for', teams[i].name, ':', soldierCount, 'soldiers,', tankCount, 'tanks,', archerCount, 'archers');
    }
  }
}
