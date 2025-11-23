# ⚔ Liquid Wars - Wave Survival ⚔

A wave-based survival game where you command the Red Legion against endless waves of enemies. Built with TypeScript and p5.js.

## 🎮 Play Online

**Live Demo**: [Your Digital Ocean URL]

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
bun install

# Build the game
bun run build

# Start dev server
bun run dev

# Visit http://localhost:3000
```

### Build for Production

```bash
# Build everything
bun run build

# This creates:
# - game.js (compiled game code)
# - p5.min.js (p5.js library)
# - dist/main.js (intermediate build)
```

## 📦 Deployment

This project deploys to Digital Ocean as a static site.

### See Full Deployment Guide
👉 **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment instructions

### Quick Deploy

```bash
# 1. Make your changes
# 2. Build locally
bun run build

# 3. Commit and push
git add .
git commit -m "Your changes"
git push origin main

# Digital Ocean automatically deploys!
```

## 🏗️ Project Structure

```
vibes-game/
├── src/                    # TypeScript source
│   ├── main.ts            # Entry point
│   ├── entities/          # Game entities (Soldier, Reward, etc.)
│   ├── systems/           # Game systems (Physics, Combat, AI, etc.)
│   ├── rendering/         # Rendering (GameRenderer, UIRenderer)
│   └── utils/             # Utilities (SpatialGrid, Audio, etc.)
├── dist/                  # Compiled output (generated)
├── index.html             # Main HTML
├── game.js               # Compiled game (generated)
├── p5.min.js            # p5.js library (generated)
└── background.svg        # Background asset
```

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Complete codebase architecture and guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Digital Ocean deployment guide

## 🛠️ Tech Stack

- **TypeScript** - Type-safe game code
- **p5.js** - Canvas rendering and game loop
- **Bun** - Fast build tooling and dev server
- **Digital Ocean** - Static site hosting

## 🎯 Features

- ⚔️ Wave-based survival gameplay
- 🏆 10 unique power-up rewards (damage boost, speed boost, shadow troops, etc.)
- 💪 Progressive difficulty (Easy, Medium, Hard)
- ⚡ Spatial grid optimization for smooth performance
- 🎨 Medieval-themed UI with particle effects
- 📊 Score tracking and leaderboards

## 🧪 Testing Build Locally

Test the exact build process Digital Ocean uses:

```bash
# Install doctl (Digital Ocean CLI)
brew install doctl

# Test build
doctl apps dev build
```

## 🔧 Configuration

All game balance and configuration is in `src/config.ts`:
- Soldier stats (health, damage, speed)
- Physics (friction, separation force)
- Combat (crit chance, leveling)
- Rewards (power-up configs)
- Difficulty settings

## 📝 Scripts

```bash
bun run build       # Build for production
bun run dev         # Build + start dev server
bun run typecheck   # Check TypeScript types
bun run start       # Start server only
npm run do:build    # Test DO build process
```

## 🐛 Troubleshooting

### Game doesn't start
- Check browser console for errors
- Verify `game.js` and `p5.min.js` exist in root
- Run `bun run build` to regenerate files

### Build fails
- Run `bun run typecheck` to check for TypeScript errors
- Ensure all dependencies installed: `bun install`

### Deployment fails on Digital Ocean
- See [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting section
- Test locally: `doctl apps dev build`

## 👥 Authors

- **ogip** - Game design and development
- **msteohrv** - Development

## 📄 License

MIT
