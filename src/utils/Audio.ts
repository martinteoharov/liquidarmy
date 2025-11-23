/**
 * Audio System
 *
 * Generates sound effects using the Web Audio API.
 * All sounds are synthesized programmatically (no audio files needed).
 *
 * Responsibilities:
 * - Initialize audio context
 * - Generate impact/hit sounds
 * - Manage audio playback
 */

import { AUDIO } from '../config';

let audioContext: AudioContext | null = null;

/**
 * Initialize the audio context (call once at game start)
 */
const initAudio = (): void => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
};

/**
 * Play a "pop" sound when soldiers are killed
 * Uses frequency sweep for satisfying impact feedback
 */
export const playPopSound = (): void => {
  initAudio();
  if (!audioContext) return;

  const now = audioContext.currentTime;

  // Create oscillator for the "pop"
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Quick frequency drop for pop effect (300Hz -> 50Hz)
  oscillator.frequency.setValueAtTime(300, now);
  oscillator.frequency.exponentialRampToValueAtTime(50, now + AUDIO.POP_SOUND_DURATION);

  // Quick volume envelope
  gainNode.gain.setValueAtTime(AUDIO.HIT_SOUND_VOLUME, now);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + AUDIO.POP_SOUND_DURATION);

  oscillator.type = 'sine';
  oscillator.start(now);
  oscillator.stop(now + AUDIO.POP_SOUND_DURATION);
};
