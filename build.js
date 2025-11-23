#!/usr/bin/env node

/**
 * Build script for Digital Ocean deployment
 * Uses esbuild (available in Node.js) instead of Bun
 */

import { build } from 'esbuild';
import { copyFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

async function buildGame() {
  try {
    console.log('🔨 Building game with esbuild...');

    // Ensure dist directory exists
    if (!existsSync('dist')) {
      await mkdir('dist');
    }

    // Build with esbuild
    await build({
      entryPoints: ['src/main.ts'],
      bundle: true,
      outfile: 'dist/main.js',
      format: 'esm',
      target: 'es2020',
      platform: 'browser',
      minify: false,
      sourcemap: false,
    });

    console.log('✅ Built dist/main.js');

    // Copy to game.js
    await copyFile('dist/main.js', 'game.js');
    console.log('✅ Copied to game.js');

    console.log('🎮 Build complete!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildGame();
