# Digital Ocean Deployment Guide

This guide explains how to deploy Liquid Wars to Digital Ocean as a static site.

## Overview

Liquid Wars is deployed as a **static site** on Digital Ocean App Platform. The deployment automatically builds the TypeScript code and serves the compiled JavaScript files.

## Project Structure for Deployment

The static site needs these files in the root directory:
- `index.html` - Main HTML page (already in root)
- `game.js` - Compiled game code (generated from `dist/main.js`)
- `p5.min.js` - p5.js library (copied from node_modules)
- `background.svg` - Background asset (already in root)

## Build Process

### Automated Build (Digital Ocean)

When you push to GitHub, Digital Ocean automatically:

```bash
# 1. Installs dependencies
npm install

# 2. Runs the build script
npm run build
```

The `npm run build` script does:
1. Runs TypeScript type checking: `tsc --noEmit`
2. Compiles TypeScript: `bun build src/main.ts --outdir dist --target browser`
3. Copies compiled code: `cp dist/main.js game.js`
4. Copies p5.js library: `cp node_modules/p5/lib/p5.min.js p5.min.js`

### Manual Local Build

To test the deployment build locally:

```bash
# Run the production build
bun run build

# Or use the DO-specific command (uses npm)
npm run do:build
```

After building, verify these files exist in root:
```bash
ls -la game.js p5.min.js index.html background.svg
```

## Testing Build with Digital Ocean CLI

Install the Digital Ocean CLI (doctl):

```bash
# macOS
brew install doctl

# Linux
cd ~
wget https://github.com/digitalocean/doctl/releases/download/v1.146.0/doctl-1.146.0-linux-amd64.tar.gz
tar xf doctl-1.146.0-linux-amd64.tar.gz
sudo mv doctl /usr/local/bin

# Login to Digital Ocean
doctl auth init
```

Test the build locally (simulates DO build environment):

```bash
# Run a test build exactly like DO does
doctl apps dev build

# This will:
# - Clone your repo
# - Detect buildpacks (Node.js)
# - Run npm install && npm run build
# - Show any build errors
```

## Deployment Configuration

### App Configuration (`.do/app.yaml`)

```yaml
name: liquid-wars
region: nyc
static_sites:
  - name: web
    github:
      repo: martinteoharov/liquidarmy
      branch: main
      deploy_on_push: true
    build_command: npm install && npm run build
    output_dir: /
    index_document: index.html
    error_document: index.html
    environment_slug: node-js
```

### Package.json Scripts

```json
{
  "scripts": {
    "build": "npm run typecheck && npm run build:game",
    "build:game": "bun build src/main.ts --outdir dist --target browser && cp dist/main.js game.js && cp node_modules/p5/lib/p5.min.js p5.min.js",
    "typecheck": "tsc --noEmit",
    "do:build": "npm install && npm run build"
  }
}
```

## Deployment Workflow

### Standard Workflow

1. **Make changes** to TypeScript files in `src/`

2. **Build and test locally**:
   ```bash
   bun run build
   bun run dev
   # Visit http://localhost:3000
   ```

3. **Commit changes**:
   ```bash
   git add .
   git commit -m "Your changes"
   ```

4. **Push to GitHub**:
   ```bash
   git push origin main
   ```

5. **Digital Ocean automatically**:
   - Detects the push (deploy_on_push: true)
   - Runs build command
   - Deploys static files
   - Updates the live site

### Workflow with Pre-compiled Files

If you want to commit the compiled files:

1. **Build locally**:
   ```bash
   bun run build
   ```

2. **Verify output files**:
   ```bash
   ls -la game.js p5.min.js
   ```

3. **Commit everything including build output**:
   ```bash
   git add .
   git add game.js p5.min.js  # Force add if in .gitignore
   git commit -m "Deploy with pre-built files"
   git push origin main
   ```

## File Requirements

### Required Files in Root

After build, these must exist for deployment:

| File | Source | Purpose |
|------|--------|---------|
| `index.html` | Root (committed) | Main HTML page |
| `game.js` | Generated from `dist/main.js` | Compiled game code |
| `p5.min.js` | Copied from `node_modules/p5/lib/` | p5.js library |
| `background.svg` | Root (committed) | Background image |

### .gitignore Considerations

You can choose to:

**Option 1: Don't commit build files** (cleaner repo)
```gitignore
game.js
p5.min.js
dist/
```
Digital Ocean builds on each deploy.

**Option 2: Commit build files** (faster deploy)
```gitignore
# Don't ignore game.js and p5.min.js
dist/
```
Faster deployment but larger repo.

## Troubleshooting

### Build Fails on Digital Ocean

1. **Check build logs** in DO dashboard under "Build Logs"

2. **Test locally with DO CLI**:
   ```bash
   doctl apps dev build
   ```

3. **Common issues**:
   - Missing dependencies → Add to `package.json`
   - Bun not available → Build script uses npm-compatible commands
   - TypeScript errors → Run `npm run typecheck` locally

4. **Fix and retry**:
   ```bash
   # Fix the issue
   git add .
   git commit -m "Fix build issue"
   git push origin main
   ```

### Files Missing After Deploy

1. **Check build output**:
   ```bash
   # Locally verify build creates files
   bun run build
   ls -la game.js p5.min.js
   ```

2. **Verify app.yaml settings**:
   - `output_dir: /` (serves from root)
   - `build_command` runs successfully

3. **Check DO build logs** for copy command errors

### Game Doesn't Load

1. **Check browser console** (F12) for errors

2. **Verify files are accessible**:
   - Visit `https://your-app.ondigitalocean.app/game.js`
   - Visit `https://your-app.ondigitalocean.app/p5.min.js`
   - Should return JavaScript code, not 404

3. **Check index.html script tags**:
   ```html
   <!-- Must load p5.js first -->
   <script src="/p5.min.js"></script>
   
   <!-- Then load game as module -->
   <script type="module" src="/game.js"></script>
   ```

4. **Check for path issues**:
   - Use absolute paths: `/game.js` not `game.js`
   - Ensure `output_dir: /` in app.yaml

### Build Works Locally But Fails on DO

1. **Environment differences**:
   - Local: Uses Bun runtime
   - DO: Uses Node.js/npm

2. **Solution**: Test with npm locally:
   ```bash
   npm run do:build
   ```

3. **If still failing**: Check Node.js version compatibility
   ```bash
   # Add to app.yaml if needed:
   engines:
     node: "18.x"
   ```

## Manual Deployment (Emergency)

If automatic deployment is broken:

1. **Build locally**:
   ```bash
   bun run build
   ```

2. **Verify all files**:
   ```bash
   ls -la game.js p5.min.js index.html background.svg
   ```

3. **Force add build files**:
   ```bash
   git add -f game.js p5.min.js
   ```

4. **Commit and push**:
   ```bash
   git commit -m "Manual deployment build"
   git push origin main
   ```

5. **In DO dashboard**: Trigger manual deploy if auto-deploy is disabled

## Testing Checklist

Before deploying:

- [ ] Code builds locally: `bun run build`
- [ ] No TypeScript errors: `npm run typecheck`
- [ ] Game runs locally: `bun run dev`
- [ ] All required files generated: `ls game.js p5.min.js`
- [ ] Test with DO CLI (optional): `doctl apps dev build`
- [ ] Committed all changes: `git status`

## Environment-Specific Notes

### Local Development
- Uses **Bun** for fast builds and TypeScript execution
- Hot reload with `bun run dev`
- TypeScript runs directly without compilation

### Digital Ocean Production
- Uses **Node.js/npm** (Bun may not be in buildpacks)
- Runs `npm install && npm run build`
- Serves static files only (no Node.js server)

### Build Compatibility
- Build commands work with both Bun CLI and npm
- `bun build` → compiles TypeScript
- `cp` commands → shell commands (work in both environments)

## URLs and Access

- **Production**: `https://your-app-name.ondigitalocean.app`
- **Custom Domain**: Configure in DO dashboard → Settings → Domains
- **Build Logs**: DO dashboard → Activity → Build Logs
- **Deployments**: DO dashboard → Deployments (history of all deploys)

## Quick Reference

```bash
# Local development
bun install          # Install dependencies
bun run build        # Build for production
bun run dev          # Start dev server
bun run typecheck    # Check TypeScript

# Digital Ocean testing
doctl auth init           # Login to DO
doctl apps dev build      # Test build locally

# Deploy
git add .
git commit -m "Changes"
git push origin main      # Triggers auto-deploy

# Manual build for deploy
bun run build
git add -f game.js p5.min.js
git push origin main
```
