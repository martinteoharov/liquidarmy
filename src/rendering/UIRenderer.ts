/**
 * UI Renderer
 *
 * Renders all user interface elements including:
 * - Score display
 * - Wave number and timer
 * - Team status
 * - Game over screen
 *
 * Responsibilities:
 * - Draw HUD elements during gameplay
 * - Display score, wave, and time information
 * - Render game over screen
 * - Style UI with medieval theme
 */

import type { P5 } from "../p5-types";
import type { GameContext } from "../types";

export class UIRenderer {
  /**
   * Render the gameplay HUD
   */
  renderGameUI = (
    context: GameContext,
    playerCount: number,
    enemyCount: number,
    remainingTime: number,
    p: P5,
  ): void => {
    const { waveState, scoreState, rewardState } = context;

    // Top bar background
    const barHeight = 60;
    p.fill(20, 20, 30, 230);
    p.noStroke();
    p.rect(0, 0, p.width, barHeight);

    // Gold border
    p.noFill();
    p.stroke(255, 215, 0);
    p.strokeWeight(2);
    p.rect(0, 0, p.width, barHeight);

    // Left side - Score
    p.fill(255, 215, 0);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(24);
    p.textStyle(p.BOLD);
    p.noStroke();
    p.text(`Score: ${scoreState.totalScore}`, 20, barHeight / 2 - 8);

    // Kills count
    p.fill(200, 200, 200);
    p.textSize(14);
    p.textStyle(p.NORMAL);
    p.text(`Kills: ${scoreState.kills}`, 20, barHeight / 2 + 12);

    // Center - Wave number and timer
    p.fill(255, 255, 255);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(28);
    p.textStyle(p.BOLD);

    if (waveState.isTransitioning) {
      p.fill(100, 255, 100);
      p.text(
        `Wave ${waveState.currentWave} Complete!`,
        p.width / 2,
        barHeight / 2 - 8,
      );
      p.fill(200, 200, 200);
      p.textSize(14);
      p.textStyle(p.NORMAL);
      p.text(
        `Next wave in ${this.formatTime(remainingTime)}`,
        p.width / 2,
        barHeight / 2 + 12,
      );
    } else {
      p.text(`Wave ${waveState.currentWave}`, p.width / 2, barHeight / 2 - 8);

      // Timer with color coding
      const timeColor = this.getTimeColor(
        remainingTime,
        waveState.waveDuration / 1000,
      );
      p.fill(timeColor);
      p.textSize(16);
      p.textStyle(p.NORMAL);
      p.text(
        `Time: ${this.formatTime(remainingTime)}`,
        p.width / 2,
        barHeight / 2 + 12,
      );
    }

    // Right side - Unit counts
    p.textAlign(p.RIGHT, p.CENTER);
    p.textSize(20);
    p.textStyle(p.BOLD);

    // Player count (green)
    p.fill(100, 255, 100);
    p.text(`Your Army: ${playerCount}`, p.width - 20, barHeight / 2 - 8);

    // Enemy count (red)
    p.fill(255, 100, 100);
    p.textSize(16);
    p.textStyle(p.NORMAL);
    p.text(`Enemies: ${enemyCount}`, p.width - 20, barHeight / 2 + 12);

    // Render reward notifications
    this.renderRewardNotifications(rewardState, p);
  };

  /**
   * Render reward notification banners
   */
  private renderRewardNotifications = (
    rewardState: {
      notifications: { message: string; startTime: number; duration: number }[];
    },
    p: P5,
  ): void => {
    const currentTime = p.millis();
    const notifications = rewardState.notifications;

    for (let i = 0; i < notifications.length; i++) {
      const notif = notifications[i];
      const elapsed = currentTime - notif.startTime;
      const progress = elapsed / notif.duration;

      // Fade in and out
      let alpha = 255;
      if (progress < 0.1) {
        // Fade in (first 10%)
        alpha = (progress / 0.1) * 255;
      } else if (progress > 0.8) {
        // Fade out (last 20%)
        alpha = ((1 - progress) / 0.2) * 255;
      }

      // Position from top (below HUD)
      const yOffset = 80 + i * 70;
      const bannerHeight = 60;
      const bannerWidth = p.width * 0.6;
      const bannerX = p.width / 2 - bannerWidth / 2;

      // Semi-transparent background
      p.fill(20, 20, 40, alpha * 0.9);
      p.stroke(255, 215, 0, alpha);
      p.strokeWeight(2);
      p.rect(bannerX, yOffset, bannerWidth, bannerHeight, 10);

      // Message text
      p.noStroke();
      p.fill(255, 215, 0, alpha);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(24);
      p.textStyle(p.BOLD);
      p.text(notif.message, p.width / 2, yOffset + bannerHeight / 2);
    }
  };

  /**
   * Render game over screen
   */
  renderGameOver = (context: GameContext, p: P5): void => {
    const { scoreState, waveState } = context;

    // Semi-transparent overlay
    p.fill(0, 0, 0, 220);
    p.noStroke();
    p.rect(0, 0, p.width, p.height);

    // Title
    p.fill(255, 100, 100);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(72);
    p.textStyle(p.BOLD);
    p.stroke(50, 30, 10);
    p.strokeWeight(6);
    p.text("⚔ DEFEATED ⚔", p.width / 2, p.height / 2 - 150);

    // Final score box
    const boxWidth = 500;
    const boxHeight = 300;
    const boxX = p.width / 2 - boxWidth / 2;
    const boxY = p.height / 2 - 50;

    // Box background
    p.fill(40, 40, 50);
    p.stroke(255, 215, 0);
    p.strokeWeight(3);
    p.rect(boxX, boxY, boxWidth, boxHeight, 10);

    // Stats
    p.noStroke();
    p.fill(255, 215, 0);
    p.textSize(48);
    p.text(`Final Score: ${scoreState.totalScore}`, p.width / 2, boxY + 60);

    p.fill(200, 200, 200);
    p.textSize(24);
    p.textStyle(p.NORMAL);
    p.text(
      `Waves Survived: ${scoreState.wavesCompleted}`,
      p.width / 2,
      boxY + 120,
    );
    p.text(`Total Kills: ${scoreState.kills}`, p.width / 2, boxY + 160);
    p.text(`Highest Wave: ${waveState.currentWave}`, p.width / 2, boxY + 200);

    // Instructions
    p.fill(150, 150, 150);
    p.textSize(18);
    p.text("Click to try again", p.width / 2, p.height / 2 + 200);

    // Decorative elements (floating skulls/swords)
    p.fill(255, 215, 0, 80);
    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * p.TWO_PI;
      const radius = 200 + p.sin(p.frameCount * 0.02 + i) * 30;
      const x = p.width / 2 + p.cos(angle) * radius;
      const y = p.height / 2 - 50 + p.sin(angle) * radius;
      p.textSize(20);
      p.text(i % 2 === 0 ? "⚔" : "💀", x, y);
    }
  };

  /**
   * Render wave transition screen
   */
  renderWaveTransition = (
    waveNumber: number,
    remainingTime: number,
    p: P5,
  ): void => {
    // Semi-transparent overlay
    p.fill(0, 0, 0, 150);
    p.noStroke();
    p.rect(0, 0, p.width, p.height);

    // Wave complete message
    p.fill(100, 255, 100);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(64);
    p.textStyle(p.BOLD);
    p.stroke(20, 100, 20);
    p.strokeWeight(5);
    p.text(`Wave ${waveNumber - 1} Complete!`, p.width / 2, p.height / 2 - 80);

    // Next wave announcement
    p.fill(255, 215, 0);
    p.textSize(48);
    p.stroke(50, 30, 10);
    p.strokeWeight(4);
    p.text(`Wave ${waveNumber} Incoming`, p.width / 2, p.height / 2);

    // Countdown
    p.fill(255, 255, 255);
    p.textSize(36);
    p.noStroke();
    p.text(`Get ready... ${remainingTime}`, p.width / 2, p.height / 2 + 60);

    // Prepare message
    p.fill(200, 200, 200);
    p.textSize(20);
    p.textStyle(p.NORMAL);
    p.text("Position your army!", p.width / 2, p.height / 2 + 110);
  };

  /**
   * Format time in MM:SS format
   */
  private formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  /**
   * Get color for time display based on remaining time
   */
  private getTimeColor = (
    remainingTime: number,
    totalTime: number,
  ): [number, number, number] => {
    const ratio = remainingTime / totalTime;

    if (ratio > 0.5) {
      return [100, 255, 100]; // Green - plenty of time
    } else if (ratio > 0.25) {
      return [255, 215, 0]; // Yellow - time running low
    } else {
      return [255, 100, 100]; // Red - critical time
    }
  };
}
