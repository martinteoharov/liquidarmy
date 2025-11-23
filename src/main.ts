/**
 * Main Entry Point
 *
 * Initializes and runs the wave-based survival game.
 * Sets up p5.js sketch with all game systems and manages the game loop.
 *
 * Responsibilities:
 * - Initialize p5.js sketch
 * - Load assets (background image, sprites)
 * - Create all game systems
 * - Run game loop (update + render)
 * - Handle window resize
 * - Handle game restart
 */

// Use global p5 from script tag instead of importing
declare const p5: any;
import { GameState, Difficulty } from "./enums";
import type { GameContext } from "./types";
import type { P5Image, P5Graphics } from "./p5-types";

// Systems
import { PhysicsSystem } from "./systems/Physics";
import { CombatSystem } from "./systems/Combat";
import { AISystem } from "./systems/AI";
import { GameStateManager } from "./systems/GameState";
import { WaveSystem } from "./systems/WaveSystem";
import { RewardSystem } from "./systems/RewardSystem";

// Rendering
import { GameRenderer } from "./rendering/GameRenderer";
import { UIRenderer } from "./rendering/UIRenderer";

// Entities
import type { Soldier } from "./entities/Soldier";
import type { Obstacle, CastleObstacle } from "./entities/Obstacle";

// Utilities
import { generateAllSoldierSprites } from "./utils/SpriteGenerator";
import { generateMap } from "./utils/MapGenerator";

/**
 * Main p5.js sketch
 */
const sketch = (p: any) => {
  // Game context
  let context: GameContext;
  let soldiers: Soldier[] = [];
  let obstacles: Array<Obstacle | CastleObstacle> = [];

  // Configuration
  let difficulty: Difficulty = Difficulty.MEDIUM;
  let particlesPerTeam: number = 80;

  // Systems
  let physics: PhysicsSystem;
  let combat: CombatSystem;
  let ai: AISystem;
  let gameStateManager: GameStateManager;
  let waveSystem: WaveSystem;
  let rewardSystem: RewardSystem;

  // Rendering
  let gameRenderer: GameRenderer;
  let uiRenderer: UIRenderer;

  // Assets
  let backgroundImg: P5Image;
  let soldierSprites: P5Graphics[] = [];

  /**
   * Preload assets
   */
  p.preload = () => {
    backgroundImg = p.loadImage(
      "background.svg",
      () => console.log("Background loaded"),
      () => console.error("Failed to load background"),
    );
  };

  /**
   * Setup - called once at start
   */
  p.setup = () => {
    console.log("p5.js setup() called");

    // Check if started from website with config
    if (window.gameConfig && window.gameConfig.startFromWebsite) {
      difficulty = window.gameConfig.difficulty;
      particlesPerTeam = window.gameConfig.armySize;

      console.log("Starting from website with config:", window.gameConfig);

      // Create canvas with appropriate size for embedded mode
      const canvasParent = document.getElementById("gameCanvas");
      let canvasWidth: number, canvasHeight: number;

      if (window.gameConfig.embeddedMode && canvasParent) {
        // Embedded mode - use container dimensions
        canvasWidth = canvasParent.offsetWidth;
        canvasHeight = canvasParent.offsetHeight;
        console.log(
          "Embedded mode - canvas size:",
          canvasWidth,
          "x",
          canvasHeight,
        );
      } else {
        // Fullscreen mode
        canvasWidth = p.windowWidth;
        canvasHeight = p.windowHeight;
      }

      const canvas = p.createCanvas(canvasWidth, canvasHeight);
      if (canvasParent) {
        canvas.parent("gameCanvas");
      }
    } else {
      // Normal mode - create fullscreen canvas
      p.createCanvas(p.windowWidth, p.windowHeight);
    }

    p.textFont("Arial");

    // Initialize systems
    physics = new PhysicsSystem();
    combat = new CombatSystem();
    ai = new AISystem();
    gameStateManager = new GameStateManager();

    // Initialize renderers
    gameRenderer = new GameRenderer();
    gameRenderer.setBackground(backgroundImg);
    uiRenderer = new UIRenderer();

    // Generate sprites
    soldierSprites = generateAllSoldierSprites(p);
    console.log("Generated soldier sprites");

    // Start game
    startGame();
  };

  /**
   * Start/restart game with current configuration
   */
  const startGame = () => {
    console.log("Starting game with difficulty:", difficulty);

    // Reset systems
    gameStateManager.reset();
    combat.clear();

    // Initialize teams
    const { playerTeam, enemyTeam } = gameStateManager.initializeTeams();

    // Initialize game context
    context = {
      gameState: GameState.PLAYING,
      difficulty,
      particlesPerTeam,
      teams: [playerTeam, enemyTeam],
      playerTeam,
      enemyTeam,
      mapScale: 1.0,
      waveState: {
        currentWave: 1,
        enemiesInWave: 0,
        enemiesRemaining: 0,
        waveStartTime: 0,
        waveDuration: 0,
        isTransitioning: false,
        transitionStartTime: 0,
      },
      scoreState: {
        totalScore: 0,
        kills: 0,
        wavesCompleted: 0,
      },
      rewardState: {
        activeRewards: [],
        notifications: [],
      },
    };

    // Initialize wave system
    waveSystem = new WaveSystem(p, context);
    context.waveState = waveSystem.initializeWaveState();
    context.scoreState = waveSystem.initializeScoreState();

    // Initialize reward system
    rewardSystem = new RewardSystem(p, context);
    context.rewardState = rewardSystem.initializeRewardState();

    // Generate map
    obstacles = generateMap(p);
    console.log(`Generated maze map with ${obstacles.length} obstacles`);

    // Connect reward system to other systems and obstacles
    combat.setRewardSystem(rewardSystem);
    physics.setRewardSystem(rewardSystem);
    rewardSystem.setObstacles(obstacles);

    // Spawn player soldiers
    soldiers = gameStateManager.spawnPlayerSoldiers(particlesPerTeam, p);
    console.log(`Spawned ${soldiers.length} player soldiers`);

    // Spawn first wave of enemies directly (don't call update)
    waveSystem.spawnWaveEnemies(soldiers);
    console.log(
      `Spawned wave ${context.waveState.currentWave} with ${context.waveState.enemiesInWave} enemies`,
    );

    context.gameState = GameState.PLAYING;
  };

  /**
   * Window resize handler
   */
  p.windowResized = () => {
    // Handle resize differently for embedded vs fullscreen mode
    if (window.gameConfig && window.gameConfig.embeddedMode) {
      // Embedded mode - resize to container
      const canvasParent = document.getElementById("gameCanvas");
      if (canvasParent) {
        p.resizeCanvas(canvasParent.offsetWidth, canvasParent.offsetHeight);
      }
    } else {
      // Fullscreen or menu mode - resize to window
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    }
  };

  /**
   * Main game loop
   */
  p.draw = () => {
    if (
      context.gameState === GameState.PLAYING ||
      context.gameState === GameState.WAVE_TRANSITION
    ) {
      // Update physics
      physics.update(soldiers, obstacles, context.teams, p);

      // Update AI (pass mapScale and offset for correct mouse coordinate conversion)
      ai.updateTeamTargets(
        context.playerTeam,
        context.enemyTeam,
        soldiers,
        gameRenderer.mapScale,
        gameRenderer.offsetX,
        gameRenderer.offsetY,
        p,
      );

      // Update reward system
      rewardSystem.update(soldiers);

      // Update combat (and award kill points)
      const beforeKills = context.scoreState.kills;
      combat.update(soldiers, context.teams, physics.getSpatialGrid(), p);

      // Check if player got kills and award points
      const newKills = context.scoreState.kills;
      const playerSoldiers = soldiers.filter(
        (s) => s.isAlive && s.teamIndex === 0,
      );
      for (const soldier of playerSoldiers) {
        if (soldier.kills > 0) {
          const killsSinceLastCheck =
            soldier.kills - (soldier as any).lastKillCount || 0;
          if (killsSinceLastCheck > 0) {
            for (let i = 0; i < killsSinceLastCheck; i++) {
              waveSystem.awardKillPoints();
            }
            (soldier as any).lastKillCount = soldier.kills;
          }
        }
      }

      // Update wave system
      const previousWave = context.waveState.currentWave;
      const wasTransitioning = context.waveState.isTransitioning;
      waveSystem.update(soldiers);

      // Check if wave just completed - spawn reward
      if (!wasTransitioning && context.waveState.isTransitioning) {
        rewardSystem.spawnReward(previousWave);
      }

      // Check if wave is transitioning
      if (context.waveState.isTransitioning) {
        context.gameState = GameState.WAVE_TRANSITION;
      } else if (context.gameState === GameState.WAVE_TRANSITION) {
        context.gameState = GameState.PLAYING;
      }

      // Check lose condition
      gameStateManager.checkLoseCondition(soldiers);
      if (gameStateManager.gameState === GameState.GAME_OVER) {
        context.gameState = GameState.GAME_OVER;
      }

      // Render game
      gameRenderer.render(
        soldiers,
        obstacles,
        context.teams,
        combat,
        soldierSprites,
        0, // Player is always team 0 (RED)
        p,
      );

      // Render rewards on top of game
      p.push();
      p.translate(gameRenderer.offsetX, gameRenderer.offsetY);
      rewardSystem.draw(gameRenderer.mapScale);
      p.pop();

      // Render UI
      const teamCounts = gameStateManager.getTeamCounts(soldiers);
      const remainingTime = context.waveState.isTransitioning
        ? waveSystem.getTransitionRemainingTime()
        : waveSystem.getRemainingTime();

      if (context.waveState.isTransitioning) {
        uiRenderer.renderWaveTransition(
          context.waveState.currentWave,
          remainingTime,
          p,
        );
      }

      uiRenderer.renderGameUI(
        context,
        teamCounts.player,
        teamCounts.enemy,
        remainingTime,
        p,
      );
    } else if (context.gameState === GameState.GAME_OVER) {
      // Continue rendering game in background
      gameRenderer.render(
        soldiers,
        obstacles,
        context.teams,
        combat,
        soldierSprites,
        0,
        p,
      );

      // Render game over screen
      uiRenderer.renderGameOver(context, p);
    }
  };

  /**
   * Mouse click handler
   */
  p.mousePressed = () => {
    if (context.gameState === GameState.GAME_OVER) {
      // Restart game on click
      startGame();
    }
  };

  /**
   * Touch support for mobile devices
   * Map touch events to mouse events for gameplay
   */
  p.touchMoved = () => {
    // Prevent default scrolling on mobile
    return false;
  };

  p.touchStarted = () => {
    // Handle game over restart on touch
    if (context.gameState === GameState.GAME_OVER) {
      startGame();
      return false;
    }
    // Prevent default behavior
    return false;
  };

  p.touchEnded = () => {
    // Prevent default behavior
    return false;
  };

  /**
   * Expose restart function to window for HTML integration
   */
  window.restartGame = () => {
    if (window.gameConfig) {
      difficulty = window.gameConfig.difficulty;
      particlesPerTeam = window.gameConfig.armySize;

      startGame();
    }
  };
};

// Wait for p5 to be available, then create sketch
const initGame = () => {
  if (typeof p5 !== "undefined") {
    new p5(sketch);
    console.log("Wave-based Liquid Wars initialized");
  } else {
    console.log("Waiting for p5...");
    setTimeout(initGame, 50);
  }
};

initGame();
