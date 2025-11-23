# Liquid Wars - Wave Survival - Codebase Architecture

## Overview

Liquid Wars is a wave-based survival game where players control the Red Legion against endless waves of increasingly powerful enemies. The codebase is built with TypeScript, p5.js for rendering, and follows a modular architecture with clear separation of concerns.

## Core Principles

1. **Separation of Concerns**: Each module has ONE clear responsibility
2. **Configuration Centralization**: ALL magic numbers live in `config.ts`
3. **Type Safety**: Full TypeScript with interfaces and enums
4. **Immutability**: Use `readonly` and `const` where possible
5. **Performance**: Spatial grid optimization for O(n) collision detection
6. **Modern Style**: Arrow functions, enums instead of strings

## Directory Structure

```
vibes-game/
├── src/                      # TypeScript source files
│   ├── enums.ts              # Type enumerations (GameState, MapPathType, TeamId)
│   ├── config.ts             # ALL configurable values (physics, combat, UI, etc.)
│   ├── types.ts              # TypeScript interfaces
│   │
│   ├── entities/             # Game entity classes
│   │   ├── Soldier.ts        # Soldier unit (movement, combat, leveling)
│   │   ├── Obstacle.ts       # Static obstacles (simple & castle)
│   │   └── Effects.ts        # Visual effects (blood, death, level-up, menu particles)
│   │
│   ├── systems/              # Game logic systems
│   │   ├── Physics.ts        # Movement and collision
│   │   ├── Combat.ts         # Fighting and damage
│   │   ├── AI.ts             # Enemy AI (targets player)
│   │   ├── GameState.ts      # State management and lose conditions
│   │   └── WaveSystem.ts     # Wave spawning, timing, and scoring
│   │
│   ├── rendering/            # Rendering modules
│   │   ├── GameRenderer.ts   # Main game rendering
│   │   └── UIRenderer.ts     # HUD and game over screen
│   │
│   ├── utils/                # Utility modules
│   │   ├── SpatialGrid.ts    # Collision optimization
│   │   ├── Audio.ts          # Sound effects
│   │   ├── SpriteGenerator.ts # Generate soldier sprites
│   │   └── MapGenerator.ts   # Generate obstacle layouts
│   │
│   └── main.ts               # Entry point (p5.js setup and game loop)
│
├── dist/                     # Compiled JavaScript (generated)
│   └── main.js               # Bundled game code
│
├── index.html                # Game website
├── index.ts                  # Bun web server
├── background.svg            # Background asset
├── package.json              # Dependencies and build scripts
└── tsconfig.json             # TypeScript configuration
```

## Module Documentation

### Core Configuration

#### `src/enums.ts`
Type-safe enumerations:
- **GameState**: Difficulty selection, playing, wave transition, game over
- **Difficulty**: Easy, medium, hard (affects enemy stats and wave progression)
- **TeamId**: Team identifiers (red = player, blue = enemies, green/yellow unused)

#### `src/config.ts`
Centralized configuration organized by category:
- **PHYSICS**: Map size, friction, separation force, cursor attraction, grid cell size
- **SOLDIER**: Size, speed, health, damage, attack range, cooldown, XP
- **COMBAT**: Crit chance/multiplier, XP rates, leveling multipliers, morale thresholds
- **TEAM_COLORS**: Color definitions for all teams
- **DIFFICULTY_CONFIGS**: Wave configs for each difficulty (enemy count, stat scaling, time limits)
- **SCORING**: Points per kill, wave bonuses, time bonuses
- **UI**: Animation frames, star display thresholds, aspect ratio
- **ANIMATION**: Frame speeds, effect lifespans
- **AUDIO**: Volume and sound duration settings
- **SPAWN_POSITIONS**: Starting positions (player bottom-left, enemies top-right)

**Key principle**: If it's a number that affects gameplay, it belongs here.

#### `src/types.ts`
TypeScript interfaces for type safety:
- **Team**: Team state (name, color, active, target position)
- **GameConfig**: Configuration from website (difficulty, army size)
- **GameContext**: Overall game state (includes wave state and score state)
- **WaveState**: Current wave number, enemy counts, timers, transition status
- **ScoreState**: Total score, kills, waves completed
- **Position**, **Velocity**, **Rectangle**: Geometry types
- **CollisionResult**: Collision detection results
- **SpriteSheet**, **AnimationState**: Rendering types

### Entity Classes

#### `src/entities/Soldier.ts`
Individual soldier unit. Handles:
- **Movement**: Velocity, friction, attraction to target, obstacle avoidance
- **Combat**: Melee attacks, damage calculation, kill tracking
- **Progression**: XP, leveling, stat increases (health, damage, speed)
- **Morale**: Fleeing when outnumbered, recovery when safe
- **Liquid Physics**: Separation forces for flowing army behavior
- **Animation**: Walk cycles (4 frames), rotation based on movement
- **Rendering**: Sprite display, level stars (3+), XP bars, flee indicators

**Key methods**:
- `update()`: Main loop - movement, physics, state
- `separate()`: Liquid-like particle separation
- `checkEnemyCollision()`: Combat detection and execution
- `updateMorale()`: Fleeing behavior
- `draw()`: Render soldier and UI elements

#### `src/entities/Obstacle.ts`
Static obstacles on the battlefield:
- **Obstacle**: Simple rectangular obstacles
- **CastleObstacle**: Complex multi-rectangle castle structures with battlements

**Responsibilities**:
- Collision detection with soldiers
- Closest point calculations for collision resolution
- Rendering obstacle graphics

#### `src/entities/Effects.ts`
Visual effect classes:
- **BloodSplatter**: Blood effects when soldiers are hit (fades over time)
- **DeathAnimation**: Expanding ring when soldiers die
- **LevelUpEffect**: Gold ring with star particles when soldiers level up
- **MenuParticle**: Animated background particles for menu screens

### Game Systems

#### `src/systems/Physics.ts`
Physics simulation:
- Manages spatial grid for optimization
- Updates all soldier positions and velocities
- Applies separation forces for liquid behavior
- Ensures soldiers stay within map bounds

**Performance**: Spatial grid reduces collision checks from O(n²) to O(n)

#### `src/systems/Combat.ts`
Combat management:
- Processes all soldier attacks each frame
- Calculates damage and applies to targets
- Tracks kills and grants XP
- Creates and updates visual effects (blood, death animations, level-ups)
- Manages effect lifespans

#### `src/systems/AI.ts`
NPC team artificial intelligence:
- Updates target positions for non-player teams
- Finds nearest and weakest enemy teams
- Strategic positioning with flanking angles
- Smooth target transitions (prevents jitter)
- Periodic updates (every 60 frames) for performance

**AI Strategy**:
- Primarily targets weakest enemy (fewest soldiers)
- Falls back to nearest if significantly closer
- Adds positional offset for flanking from different angles
- Uses smoothing for natural-looking movement

#### `src/systems/GameState.ts`
Game state and team management:
- Initializes teams based on configuration
- Spawns soldiers for all active teams
- Checks win conditions (only one team remaining)
- Tracks soldier counts per team
- Handles game restart

### Rendering Modules

#### `src/rendering/GameRenderer.ts`
Main game rendering:
- Calculates map scale to fit 1000x1000 map to current canvas
- Renders background image with atmospheric overlay
- Renders all obstacles
- Renders combat effects (blood splatters)
- Renders all alive soldiers with proper z-ordering
- Renders player cursor indicator

**Handles**: Both embedded mode and fullscreen mode

#### `src/rendering/UIRenderer.ts`
User interface rendering:
- **Game HUD**: Team status bar with proportional widths based on soldier counts
- **Team Info**: Shows team names, unit counts, player indicator
- **Game Over Screen**: Winner announcement, victory/defeat message, decorative elements
- **Medieval Theme**: Gold text, dark backgrounds, stroke effects

### Utility Modules

#### `src/utils/SpatialGrid.ts`
Spatial partitioning for collision optimization:
- Divides map into fixed-size grid cells
- Inserts soldiers into appropriate cells each frame
- Queries nearby soldiers efficiently (only checks relevant cells)

**Key methods**:
- `clear()`: Reset grid for new frame
- `insert(soldier)`: Add soldier to grid
- `getNearby(soldier, radius)`: Get soldiers within radius

**Impact**: Reduces collision detection cost by ~200x

#### `src/utils/Audio.ts`
Sound effect generation using Web Audio API:
- `playPopSound()`: Generates pop sound for kills using oscillator
- Synthesizes sounds programmatically (no audio files needed)
- Manages audio context initialization

#### `src/utils/SpriteGenerator.ts`
Programmatic sprite generation:
- Generates sprite sheets for each team color
- Creates 4 frames of walk animation per soldier
- Top-down view: helmet, body, legs, arms, weapon
- Cached at startup for performance

#### `src/utils/MapGenerator.ts`
Obstacle layout generation:
- Generates obstacles based on map type
- **Cross**: Quadrant cover points with central castle
- **Maze**: Scattered obstacles throughout map
- **Open**: Minimal obstacles for pure combat
- **Fortress**: Broken fortress walls in circular pattern
- **Valley**: Diagonal rock formations
- **Rings**: Circular arc obstacles

**Safety**: Avoids blocking spawn corners and central area

### Entry Point

#### `src/main.ts`
Main game initialization and loop:
- Initializes p5.js sketch
- Loads assets (background image)
- Creates all game systems
- Generates soldier sprites
- Runs game loop: update → combat → AI → render
- Handles window resize (embedded vs fullscreen)
- Exposes `restartGame()` to HTML

**Game Loop Flow**:
1. Physics update (movement, collision, morale)
2. AI update (NPC target calculation)
3. Combat update (attacks, effects)
4. Win condition check
5. Render game (map, soldiers, effects)
6. Render UI (HUD, game over)

## Code Style Guide

### 1. Use Arrow Functions
```typescript
// ✅ Good
const updatePhysics = (): void => {
  // ...
};

// ❌ Bad
function updatePhysics() {
  // ...
}
```

### 2. Use Enums for String Constants
```typescript
// ✅ Good
if (gameState === GameState.PLAYING) { ... }

// ❌ Bad
if (gameState === 'playing') { ... }
```

### 3. Centralize Configuration
```typescript
// ✅ Good
soldier.health = SOLDIER.health;

// ❌ Bad
soldier.health = 100;
```

### 4. Type Everything
```typescript
// ✅ Good
const updateSoldier = (soldier: Soldier, deltaTime: number): void => {
  // ...
};

// ❌ Bad
function updateSoldier(soldier, deltaTime) {
  // ...
}
```

### 5. File Header Comments
Every file should have a header describing its purpose:
```typescript
/**
 * Module Name
 * 
 * Brief description of what this module does.
 * 
 * Responsibilities:
 * - Responsibility 1
 * - Responsibility 2
 */
```

## Build and Run

### Development
```bash
# Install dependencies
bun install

# Build TypeScript to JavaScript
bun run build

# Start server (also builds)
bun run dev
```

### Production
```bash
# Build and start
bun run build
bun run start
```

### File Watching
For development, use a tool like `watchexec`:
```bash
watchexec -e ts -r "bun run build"
```

## Common Tasks

### Adjust Game Balance
Edit `src/config.ts`:
- `SOLDIER.health` - soldier durability
- `SOLDIER.damage` - combat speed
- `PHYSICS.SEPARATION_FORCE` - army cohesion
- `COMBAT.CRIT_CHANCE` - critical hit frequency
- `COMBAT.XP_PER_LEVEL` - leveling speed

### Add New Map Type
1. Add enum value to `MapPathType` in `src/enums.ts`
2. Add map config to `MAPS` array in `src/config.ts`
3. Create generation function in `src/utils/MapGenerator.ts`
4. Add case to `generateMap()` switch statement

### Modify Soldier Behavior
Edit `src/entities/Soldier.ts`:
- `update()` - movement logic
- `checkEnemyCollision()` - combat behavior
- `updateMorale()` - morale system
- `draw()` - visual representation

### Change Visual Appearance
- **Sprites**: `src/utils/SpriteGenerator.ts`
- **Game rendering**: `src/rendering/GameRenderer.ts`
- **UI**: `src/rendering/UIRenderer.ts`
- **Colors**: `TEAM_COLORS` in `src/config.ts`

## Architecture Insights

### Why Spatial Grid?
Without spatial grid, checking 100 soldiers against each other requires 10,000 comparisons per frame. With spatial grid, we only check soldiers in nearby cells, reducing to ~500 comparisons. This 20x performance boost enables hundreds of soldiers without lag.

### Why Separate Systems?
Each system (Physics, Combat, AI, GameState) has a single responsibility. This makes the code:
- **Testable**: Each system can be tested independently
- **Maintainable**: Changes to one system don't affect others
- **Readable**: Clear where to look for specific functionality

### Why Config Centralization?
Having all magic numbers in `config.ts` means:
- **Balance tuning**: Change one file to adjust entire game
- **No searching**: Don't hunt through code for values
- **Type safety**: Constants are properly typed
- **Documentation**: All values are named and organized

### Why TypeScript?
TypeScript provides:
- **Compile-time errors**: Catch bugs before running
- **Autocomplete**: IDEs provide better suggestions
- **Refactoring safety**: Rename with confidence
- **Documentation**: Types serve as inline documentation

## Performance Considerations

### Spatial Grid
- **Impact**: 200x faster collision detection
- **Cost**: Minimal (array allocation per frame)
- **Trade-off**: Memory for massive speed gain

### Object Pooling
Effects (blood, death animations) are created frequently. Consider object pooling if performance degrades with many effects.

### Sprite Caching
Sprites are generated once at startup, not every frame. This saves significant rendering time.

### Minimal Allocations
The game loop avoids creating new objects where possible. Most operations mutate existing objects.

### Update Frequency
- **Physics**: Every frame (critical for smooth movement)
- **AI**: Every 60 frames (sufficient for strategic decisions)
- **Effects**: Variable based on lifespan

## Debugging Tips

### Canvas Not Appearing
- Check browser console for errors
- Verify `dist/main.js` exists after build
- Ensure p5.js loaded before game.js
- Check canvas parent element exists

### Soldiers Not Moving
- Check team.targetX/targetY are updating
- Verify physics system is being called
- Check PHYSICS.CURSOR_ATTRACTION value
- Ensure soldiers aren't stuck in obstacles

### Performance Issues
- Check soldier count (reduce if needed)
- Verify spatial grid is being used
- Look for excessive object creation in game loop
- Profile using browser dev tools

### Build Errors
- Run `bun install` to ensure dependencies
- Check TypeScript errors in terminal
- Verify all imports use correct paths
- Ensure @types/p5 is installed

## Future Enhancements

Consider these architectural improvements:
- **Entity Component System**: More flexible entity composition
- **Event System**: Decouple systems with events
- **Save/Load**: Serialize game state
- **Replay System**: Record and playback games
- **Network Multiplayer**: Deterministic simulation for sync
