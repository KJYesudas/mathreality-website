/**
 * MatheReality - UI Sound Effect System
 * Lightweight, non-intrusive sound design using Web Audio API synthesis
 * with external audio asset fallback.
 * 
 * Rules:
 * - NO autoplay on page load
 * - Unlocked only after first user interaction
 * - Extremely low volume (~0.04 to 0.08)
 * - User-controlled Sound ON / OFF toggle persisted in localStorage
 */

class SoundController {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('mathereality_sound') === 'true'; // default muted until enabled or toggled
    this.unlocked = false;
    this.lastTickTime = 0;

    // Asset paths for future custom audio files
    this.soundPaths = {
      hover: 'assets/sounds/ui-hover.mp3',
      click: 'assets/sounds/ui-click.mp3',
      theme: 'assets/sounds/theme-toggle.mp3',
      interaction: 'assets/sounds/interaction.mp3',
      transition: 'assets/sounds/transition.mp3'
    };

    this.initUnlockListener();
  }

  initUnlockListener() {
    const unlock = () => {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.unlocked = true;
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };

    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
  }

  toggleSound() {
    this.enabled = !this.enabled;
    localStorage.setItem('mathereality_sound', this.enabled ? 'true' : 'false');
    if (this.enabled && !this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.enabled) {
      this.playThemeToggle();
    }
    return this.enabled;
  }

  isSoundEnabled() {
    return this.enabled;
  }

  /**
   * 1. Navigation Hover: Very soft high-frequency micro-tick
   */
  playNavHover() {
    if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.025);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {}
  }

  /**
   * 2. Navigation Click: Subtle tactile confirmation
   */
  playNavClick() {
    if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.04);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch (e) {}
  }

  /**
   * 3. Theme Toggle: Soft electronic chime (ascending dual tone)
   */
  playThemeToggle() {
    if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      [523.25, 783.99].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.04, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.13);
      });
    } catch (e) {}
  }

  /**
   * 4. Interactive Math Controls: Very subtle slider tick (rate-limited)
   */
  playSliderTick() {
    if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
    const nowMs = performance.now();
    if (nowMs - this.lastTickTime < 45) return; // limit to prevent rapid buzzing
    this.lastTickTime = nowMs;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.015);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.02);
    } catch (e) {}
  }

  /**
   * 5. Interactive Experiments: Soft tactile click
   */
  playExperimentClick() {
    if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.035);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch (e) {}
  }

  /**
   * 6. Button Release: Soft confirmation tick
   */
  playButtonRelease() {
    if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.025);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {}
  }

  /**
   * 7. Interactive Math Objects: Micro digital tick for dragging / exploration
   */
  playMathInteraction() {
    if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
    const nowMs = performance.now();
    if (nowMs - this.lastTickTime < 60) return;
    this.lastTickTime = nowMs;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1600, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.012);

      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.015);
    } catch (e) {}
  }

  /**
   * 8. Major Discovery / Aha Moment: Very subtle soft harmonic chime
   */
  playDiscoveryChime() {
    if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      // C5, E5, G5 major triad (soft, restrained, educational)
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.028, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.36);
      });
    } catch (e) {}
  }
}

export const Sound = new SoundController();
