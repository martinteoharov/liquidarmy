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

    // Update HTML HUD elements instead of rendering on canvas
    const hudElement = document.getElementById("gameHUD");
    if (hudElement) {
      hudElement.classList.remove("hidden");

      // Update score
      const hudScore = document.getElementById("hudScore");
      if (hudScore) hudScore.textContent = scoreState.totalScore.toString();

      // Update wave label
      const hudWaveLabel = document.getElementById("hudWaveLabel");
      if (hudWaveLabel) {
        if (waveState.isTransitioning) {
          hudWaveLabel.textContent = `Wave ${waveState.currentWave} Complete!`;
          hudWaveLabel.style.color = "#64ff64";
        } else {
          hudWaveLabel.textContent = `Wave ${waveState.currentWave}`;
          hudWaveLabel.style.color = "#c9a668";
        }
      }

      // Update timer
      const hudTimer = document.getElementById("hudTimer");
      if (hudTimer) {
        const timeColor = this.getTimeColorHex(
          remainingTime,
          waveState.waveDuration / 1000,
        );
        hudTimer.textContent = this.formatTime(remainingTime);
        hudTimer.style.color = timeColor;
      }

      // Update player count
      const hudPlayerCount = document.getElementById("hudPlayerCount");
      if (hudPlayerCount)
        hudPlayerCount.textContent = `${playerCount} Warriors`;

      // Update enemy count
      const hudEnemyCount = document.getElementById("hudEnemyCount");
      if (hudEnemyCount) hudEnemyCount.textContent = `${enemyCount} Enemies`;
    }

    // Update reward notifications in HUD
    this.updateRewardNotification(rewardState, p);
  };

  /**
   * Update reward notification in HUD
   */
  private updateRewardNotification = (
    rewardState: {
      notifications: { message: string; startTime: number; duration: number }[];
    },
    p: P5,
  ): void => {
    const notificationElement = document.getElementById("rewardNotification");
    if (!notificationElement) return;

    const currentTime = p.millis();
    const notifications = rewardState.notifications;

    // Show the most recent notification
    if (notifications.length > 0) {
      const notif = notifications[notifications.length - 1];
      const elapsed = currentTime - notif.startTime;
      const progress = elapsed / notif.duration;

      if (progress < 1) {
        // Parse the message to extract icon, name, and description
        // Format: "icon Name: Description"
        const match = notif.message.match(/^(.+?)\s+([^:]+):\s+(.+)$/);

        if (match) {
          const [, icon, name, desc] = match;

          const iconElement = document.getElementById("rewardIcon");
          const textElement = document.getElementById("rewardText");

          if (iconElement) {
            iconElement.textContent = icon.trim();
          }

          // Update the text content properly
          if (textElement) {
            // Clear and rebuild with proper structure
            textElement.innerHTML = "";

            // Create text node for name
            const nameText = document.createTextNode(name.trim());
            textElement.appendChild(nameText);

            // Create and append description span
            const descSpan = document.createElement("span");
            descSpan.className = "reward-desc";
            descSpan.textContent = desc.trim();
            textElement.appendChild(descSpan);
          }

          // Show with animation
          notificationElement.classList.add("show");

          // Fade out when almost done
          if (progress > 0.85) {
            notificationElement.style.opacity = String((1 - progress) / 0.15);
          } else {
            notificationElement.style.opacity = "1";
          }
        } else {
          console.warn("Failed to parse notification:", notif.message);
        }
      } else {
        notificationElement.classList.remove("show");
      }
    } else {
      notificationElement.classList.remove("show");
    }
  };

  /**
   * Render game over screen
   */
  renderGameOver = (context: GameContext, p: P5): void => {
    const { scoreState, waveState } = context;

    // Hide HUD when game is over
    const hudElement = document.getElementById("gameHUD");
    if (hudElement) {
      hudElement.classList.add("hidden");
    }

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

  /**
   * Get hex color for time display (for HTML elements)
   */
  private getTimeColorHex = (
    remainingTime: number,
    totalTime: number,
  ): string => {
    const ratio = remainingTime / totalTime;

    if (ratio > 0.5) {
      return "#64ff64"; // Green - plenty of time
    } else if (ratio > 0.25) {
      return "#ffd700"; // Yellow - time running low
    } else {
      return "#ff6464"; // Red - critical time
    }
  };
}
