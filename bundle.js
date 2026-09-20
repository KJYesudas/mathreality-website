/**
 * MatheReality - Standalone Production Bundle
 * Complete 21-section cinematic interactive experience.
 * Features:
 * - Clean Fullscreen Hero video with cursor-based 3D floating & spring inertia (no text overlays)
 * - Restrained 3-Color Educational Palette: Deep Blue (#2563EB), Soft Teal (#14B8A6), Warm Yellow (#F5C542) on neutral backgrounds
 * - Engaging, visible mathematical visual language with subtle transparency & soft gradients
 * - Dedicated interactive Keplerian planet/orbit apparatus with animated satellites, vectors, and cursor 3D tilt
 * - Calm, futuristic, procedural ambient BGM (Web Audio API synthesis, low-volume, zero autoplay)
 * - Meaningful sound effects: button clicks, slider ticks, object morph pops, discovery chimes, debounced section transitions
 * - Animated Dark Mode / Light Mode theme system persisted in localStorage
 * - Magnetic button physics and custom cursor
 * - Zero CORS, works via file:/// and HTTP protocols natively.
 */

(function() {
  'use strict';

  /* ==================================================
     1. UI SOUND & LIGHT MUSICAL BACKGROUND SYSTEM (Web Audio API)
     - Zero autoplay on page load (activates only after user toggles ON and interacts)
     - Light, beautiful, modern musical composition (76 BPM in D Major / Lydian)
     - Instruments: Soft felt piano, delicate kalimba/marimba, airy flute, soft pad, light bells
     - Controlled by Sound ON/OFF toggle persisted in localStorage
     - Meaningful tactile sound effects for interactions
     ================================================== */
  class SoundController {
    constructor() {
      this.ctx = null;
      // Default enabled for new visitors unless explicitly turned off by user
      const stored = localStorage.getItem('mathereality_sound');
      this.enabled = stored !== 'false';
      this.unlocked = false;
      this.lastTickTime = 0;
      this.lastTransitionTime = 0;
      this.lastObjectChangeTime = 0;

      // Musical BGM State
      this.bgmPlaying = false;
      this.bgmTimer = null;
      this.bgmMasterGain = null;
      this.currentStep = 0;
      this.nextStepTime = 0;
      this.cycleCount = 0;
      this.tempo = 76;
      this.stepDuration = (60 / this.tempo) / 4; // 16th note duration (~0.197s)

      this.initUnlockListener();
      this.initVisibilityListener();
    }

    async ensureAudioContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        try {
          await this.ctx.resume();
        } catch (e) {
          console.warn('AudioContext resume deferred:', e);
        }
      }
      return this.ctx;
    }

    initUnlockListener() {
      const events = ['click', 'pointerdown', 'touchstart', 'touchend', 'keydown'];
      const unlock = async () => {
        await this.ensureAudioContext();
        this.unlocked = true;

        // Start BGM on first user interaction if sound is enabled
        if (this.enabled && !this.bgmPlaying) {
          this.startAmbientBGM();
        }

        events.forEach(evt => window.removeEventListener(evt, unlock, { capture: true }));
      };

      events.forEach(evt => window.addEventListener(evt, unlock, { capture: true, passive: true }));
    }

    initVisibilityListener() {
      document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible' && this.enabled && this.bgmPlaying) {
          if (this.ctx && this.ctx.state === 'suspended') {
            try {
              await this.ctx.resume();
            } catch (e) {}
          }
        }
      });
    }

    async toggleSound() {
      this.enabled = !this.enabled;
      localStorage.setItem('mathereality_sound', this.enabled ? 'true' : 'false');

      if (this.enabled) {
        await this.ensureAudioContext();
        this.playButtonClick();
        this.startAmbientBGM();
      } else {
        this.stopAmbientBGM();
      }

      return this.enabled;
    }

    isSoundEnabled() {
      return this.enabled;
    }

    /* Light, Beautiful Musical BGM Engine (D Major / 76 BPM) */
    async startAmbientBGM() {
      if (!this.enabled || this.bgmPlaying) return;
      await this.ensureAudioContext();
      if (!this.ctx || this.ctx.state !== 'running' || !this.enabled || this.bgmPlaying) return;

      try {
        const now = this.ctx.currentTime;
        this.bgmMasterGain = this.ctx.createGain();
        this.bgmMasterGain.gain.setValueAtTime(0.0001, now);
        // Whisper-quiet, immersive level (0.026) with smooth 2.5s fade-in
        this.bgmMasterGain.gain.exponentialRampToValueAtTime(0.026, now + 2.5);
        this.bgmMasterGain.connect(this.ctx.destination);

        this.bgmPlaying = true;
        this.currentStep = 0;
        this.cycleCount = 0;
        this.nextStepTime = now + 0.1;

        this.scheduleLoop();
      } catch (e) {
        console.warn('Musical BGM deferred:', e);
      }
    }

    stopAmbientBGM() {
      if (!this.bgmPlaying && !this.bgmMasterGain) return;

      try {
        if (this.bgmTimer) {
          clearTimeout(this.bgmTimer);
          this.bgmTimer = null;
        }

        this.bgmPlaying = false;

        if (this.bgmMasterGain && this.ctx) {
          const now = this.ctx.currentTime;
          this.bgmMasterGain.gain.setValueAtTime(this.bgmMasterGain.gain.value, now);
          this.bgmMasterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

          const gainRef = this.bgmMasterGain;
          setTimeout(() => {
            if (this.bgmMasterGain === gainRef) {
              this.bgmMasterGain = null;
            }
          }, 1300);
        } else {
          this.bgmMasterGain = null;
        }
      } catch (e) {
        this.bgmPlaying = false;
        this.bgmMasterGain = null;
      }
    }

    scheduleLoop() {
      if (!this.bgmPlaying || !this.ctx || this.ctx.state !== 'running') return;

      const currentTime = this.ctx.currentTime;
      // Resynchronize clock if tab was backgrounded or delayed
      if (this.nextStepTime < currentTime) {
        this.nextStepTime = currentTime + 0.05;
      }

      const scheduleAheadTime = 0.45;
      while (this.nextStepTime < currentTime + scheduleAheadTime) {
        this.playCompositionStep(this.currentStep, this.nextStepTime);
        this.nextStepTime += this.stepDuration;
        this.currentStep = (this.currentStep + 1) % 128;
        if (this.currentStep === 0) {
          this.cycleCount++;
        }
      }

      this.bgmTimer = setTimeout(() => this.scheduleLoop(), 120);
    }

    playCompositionStep(step, time) {
      if (!this.bgmMasterGain) return;

      const D3 = 146.83, Fs3 = 185.00, G3 = 196.00, A3 = 220.00, B3 = 246.94;
      const Cs4 = 277.18, D4 = 293.66, E4 = 329.63, Fs4 = 369.99, G4 = 392.00, A4 = 440.00, B4 = 493.88;
      const Cs5 = 554.37, D5 = 587.33, E5 = 659.25, Fs5 = 739.99, A5 = 880.00;
      const D6 = 1174.66;

      // 1. Chords Pads (every 16 steps = 1 bar)
      if (step % 16 === 0) {
        const bar = Math.floor(step / 16);
        let chord;
        switch (bar) {
          case 0: chord = [D3, A3, Cs4, Fs4]; break;
          case 1: chord = [G3, D4, Fs4, B4]; break;
          case 2: chord = [B3, Fs4, A4, Cs5]; break;
          case 3: chord = [A3, E4, A4, Cs5]; break;
          case 4: chord = [D3, A3, E4, Fs4]; break;
          case 5: chord = [G3, B3, E4, G4]; break;
          case 6: chord = [G3, D4, Fs4, A4]; break;
          case 7: chord = [A3, D4, E4, A4]; break;
        }
        this.playSynthPad(chord, time, this.stepDuration * 15.5);
      }

      // 2. Felt pulse on beat 1 of each bar
      if (step % 16 === 0) {
        this.playFeltPulse(time);
      }

      // 3. Soft Felt Piano Motif
      const pianoNotes = {
        0:  { freq: Fs4, dur: 3, vel: 0.75 },
        6:  { freq: A4,  dur: 2, vel: 0.65 },
        10: { freq: Cs5, dur: 2, vel: 0.70 },
        12: { freq: E5,  dur: 4, vel: 0.82 },

        16: { freq: D5,  dur: 3, vel: 0.75 },
        22: { freq: B4,  dur: 2, vel: 0.60 },
        26: { freq: Fs5, dur: 4, vel: 0.85 },

        32: { freq: Cs5, dur: 3, vel: 0.72 },
        38: { freq: A4,  dur: 2, vel: 0.62 },
        42: { freq: Fs4, dur: 2, vel: 0.68 },
        44: { freq: D5,  dur: 4, vel: 0.78 },

        48: { freq: E5,  dur: 3, vel: 0.75 },
        54: { freq: Cs5, dur: 3, vel: 0.65 },
        60: { freq: A4,  dur: 4, vel: 0.70 },

        64: { freq: Fs5, dur: 3, vel: 0.85 },
        70: { freq: E5,  dur: 2, vel: 0.70 },
        74: { freq: D5,  dur: 2, vel: 0.72 },
        76: { freq: A4,  dur: 4, vel: 0.75 },

        80: { freq: B4,  dur: 3, vel: 0.70 },
        86: { freq: G4,  dur: 2, vel: 0.60 },
        90: { freq: E5,  dur: 4, vel: 0.78 },

        96:  { freq: Fs5, dur: 3, vel: 0.82 },
        102: { freq: D5,  dur: 2, vel: 0.68 },
        106: { freq: B4,  dur: 4, vel: 0.70 },

        112: { freq: E5,  dur: 3, vel: 0.72 },
        118: { freq: Cs5, dur: 3, vel: 0.65 },
        122: { freq: A4,  dur: 2, vel: 0.60 },
        124: { freq: Fs4, dur: 4, vel: 0.65 }
      };

      if (pianoNotes[step]) {
        const p = pianoNotes[step];
        this.playFeltPiano(p.freq, time, p.dur * this.stepDuration, p.vel);
      }

      // 4. Delicate Kalimba / Marimba (Sparse droplets)
      const kalimbaNotes = {
        4: A4, 8: Fs4, 14: D5,
        20: G4, 24: D5, 28: B4,
        36: Fs4, 40: Cs5, 46: A4,
        52: E4, 56: A4, 62: Cs5,
        66: D5, 68: Fs5, 72: A4, 78: E5,
        82: G4, 84: B4, 88: D5, 94: G4,
        100: Fs4, 104: A4, 108: D5,
        114: E4, 116: A4, 120: Cs5, 126: Fs4
      };

      if (kalimbaNotes[step]) {
        const vel = 0.45 + (step % 3) * 0.08;
        this.playKalimba(kalimbaNotes[step], time, vel);
      }

      // 5. Airy Flute (Discovery breath in Bars 5 & 7)
      if (step === 64) {
        this.playAiryFlute(A5, time, this.stepDuration * 8, 0.55);
      } else if (step === 96) {
        this.playAiryFlute(Fs5, time, this.stepDuration * 8, 0.50);
      }

      // 6. Light Bell Chimes
      if (step === 12 || step === 76) {
        this.playBellChime(D6, time, 0.4);
      } else if (step === 44 || step === 108) {
        this.playBellChime(A5, time, 0.35);
      }
    }

    playFeltPiano(freq, time, duration, velocity = 0.7) {
      if (!this.ctx || !this.bgmMasterGain) return;
      try {
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc1.type = 'sine';
        osc2.type = 'triangle';

        osc1.frequency.setValueAtTime(freq, time);
        osc2.frequency.setValueAtTime(freq, time);
        osc1.detune.setValueAtTime(-2, time);
        osc2.detune.setValueAtTime(2.5, time);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(700 + velocity * 500, time);
        filter.Q.setValueAtTime(1.1, time);

        const peak = 0.55 * velocity;
        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.linearRampToValueAtTime(peak, time + 0.015);
        gain.gain.exponentialRampToValueAtTime(peak * 0.35, time + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration + 0.5);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmMasterGain);

        osc1.start(time);
        osc2.start(time);
        osc1.stop(time + duration + 0.6);
        osc2.stop(time + duration + 0.6);
      } catch (e) {}
    }

    playKalimba(freq, time, velocity = 0.5) {
      if (!this.ctx || !this.bgmMasterGain) return;
      try {
        const oscFundamental = this.ctx.createOscillator();
        const oscOvertone = this.ctx.createOscillator();
        const gainF = this.ctx.createGain();
        const gainO = this.ctx.createGain();

        oscFundamental.type = 'sine';
        oscFundamental.frequency.setValueAtTime(freq, time);

        oscOvertone.type = 'sine';
        oscOvertone.frequency.setValueAtTime(freq * 2.76, time);

        const peakF = 0.38 * velocity;
        gainF.gain.setValueAtTime(0.0001, time);
        gainF.gain.linearRampToValueAtTime(peakF, time + 0.006);
        gainF.gain.exponentialRampToValueAtTime(0.0001, time + 0.42);

        const peakO = 0.12 * velocity;
        gainO.gain.setValueAtTime(0.0001, time);
        gainO.gain.linearRampToValueAtTime(peakO, time + 0.004);
        gainO.gain.exponentialRampToValueAtTime(0.0001, time + 0.07);

        oscFundamental.connect(gainF);
        oscOvertone.connect(gainO);
        gainF.connect(this.bgmMasterGain);
        gainO.connect(this.bgmMasterGain);

        oscFundamental.start(time);
        oscOvertone.start(time);
        oscFundamental.stop(time + 0.45);
        oscOvertone.stop(time + 0.1);
      } catch (e) {}
    }

    playSynthPad(chordFreqs, time, duration) {
      if (!this.ctx || !this.bgmMasterGain) return;
      try {
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(360, time);
        filter.Q.setValueAtTime(0.8, time);
        filter.connect(this.bgmMasterGain);

        chordFreqs.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, time);
          osc.detune.setValueAtTime((idx - 1.5) * 2, time);

          const peak = 0.09 / chordFreqs.length;
          gain.gain.setValueAtTime(0.0001, time);
          gain.gain.linearRampToValueAtTime(peak, time + 1.2);
          gain.gain.setValueAtTime(peak, time + duration - 0.8);
          gain.gain.exponentialRampToValueAtTime(0.0001, time + duration + 1.2);

          osc.connect(gain);
          gain.connect(filter);

          osc.start(time);
          osc.stop(time + duration + 1.3);
        });
      } catch (e) {}
    }

    playAiryFlute(freq, time, duration, velocity = 0.5) {
      if (!this.ctx || !this.bgmMasterGain) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(5, time);
        lfoGain.gain.setValueAtTime(3.5, time);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(time);
        lfo.stop(time + duration + 0.5);

        const peak = 0.22 * velocity;
        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.linearRampToValueAtTime(peak, time + 0.15);
        gain.gain.setValueAtTime(peak * 0.8, time + duration - 0.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration + 0.4);

        osc.connect(gain);
        gain.connect(this.bgmMasterGain);

        osc.start(time);
        osc.stop(time + duration + 0.5);
      } catch (e) {}
    }

    playBellChime(freq, time, velocity = 0.35) {
      if (!this.ctx || !this.bgmMasterGain) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        const peak = 0.18 * velocity;
        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.linearRampToValueAtTime(peak, time + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.8);

        osc.connect(gain);
        gain.connect(this.bgmMasterGain);

        osc.start(time);
        osc.stop(time + 1.9);
      } catch (e) {}
    }

    playFeltPulse(time) {
      if (!this.ctx || !this.bgmMasterGain) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(73.42, time);
        osc.frequency.exponentialRampToValueAtTime(36.71, time + 0.14);

        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.linearRampToValueAtTime(0.08, time + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.16);

        osc.connect(gain);
        gain.connect(this.bgmMasterGain);

        osc.start(time);
        osc.stop(time + 0.18);
      } catch (e) {}
    }

    /* Soft Tactile Click for buttons, links, controls */
    playButtonClick() {
      if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);
      } catch (e) {}
    }

    /* Tiny Tick for sliders (rate-limited) */
    playSliderTick() {
      if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
      const nowMs = performance.now();
      if (nowMs - this.lastTickTime < 45) return;
      this.lastTickTime = nowMs;

      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.012);

        gain.gain.setValueAtTime(0.018, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.015);
      } catch (e) {}
    }

    /* Subtle Pop when mathematical objects morph or change */
    playObjectChange() {
      if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
      const nowMs = performance.now();
      if (nowMs - this.lastObjectChangeTime < 180) return;
      this.lastObjectChangeTime = nowMs;

      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(840, now + 0.04);

        gain.gain.setValueAtTime(0.028, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
      } catch (e) {}
    }

    /* Gentle Chime when an experiment or discovery is completed */
    playDiscoveryChime() {
      if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
      try {
        const now = this.ctx.currentTime;
        [523.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);

          gain.gain.setValueAtTime(0.024, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.38);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.4);
        });
      } catch (e) {}
    }

    /* Very Subtle Transition Sound for major section milestones (debounced) */
    playSectionTransition() {
      if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
      const nowMs = performance.now();
      if (nowMs - this.lastTransitionTime < 2200) return;
      this.lastTransitionTime = nowMs;

      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(240, now);
        filter.frequency.exponentialRampToValueAtTime(480, now + 0.3);
        filter.Q.setValueAtTime(1.5, now);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.3);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.02, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
      } catch (e) {}
    }

    playNavHover() {
      if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1100, now);
        osc.frequency.exponentialRampToValueAtTime(850, now + 0.02);

        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.025);
      } catch (e) {}
    }

    playNavClick() {
      this.playButtonClick();
    }

    playThemeToggle() {
      this.playDiscoveryChime();
    }

    playExperimentClick() {
      this.playButtonClick();
    }

    playButtonRelease() {
      if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(340, now);
        osc.frequency.exponentialRampToValueAtTime(480, now + 0.02);

        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.025);
      } catch (e) {}
    }

    playMathInteraction() {
      this.playSliderTick();
    }
  }

  const Sound = new SoundController();

  /* ==================================================
     2. THEME CONTROLLER (Dark Mode + Light Mode)
     ================================================== */
  class ThemeController {
    constructor() {
      this.theme = localStorage.getItem('mathereality_theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

      this.toggleBtn = document.getElementById('theme-toggle-btn');
      this.iconEl = document.getElementById('theme-icon');

      this.applyTheme(this.theme, false);
      this.initListeners();
    }

    initListeners() {
      if (this.toggleBtn) {
        this.toggleBtn.addEventListener('click', () => {
          const nextTheme = this.theme === 'dark' ? 'light' : 'dark';
          this.applyTheme(nextTheme, true);
          Sound.playThemeToggle();
        });
      }

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('mathereality_theme')) {
          this.applyTheme(e.matches ? 'dark' : 'light', true);
        }
      });
    }

    applyTheme(theme, animate = true) {
      this.theme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('mathereality_theme', theme);

      if (this.iconEl) {
        if (theme === 'dark') {
          this.iconEl.innerHTML = `
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          `;
          this.toggleBtn?.setAttribute('aria-label', 'Switch to Light Mode');
        } else {
          this.iconEl.innerHTML = `
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          `;
          this.toggleBtn?.setAttribute('aria-label', 'Switch to Dark Mode');
        }

        if (animate) {
          this.iconEl.style.transform = 'scale(0.7) rotate(45deg)';
          setTimeout(() => {
            this.iconEl.style.transform = 'scale(1) rotate(0deg)';
          }, 150);
        }
      }
    }
  }

  /* ==================================================
     3. HERO MOTION CONTROLLER
     - Clean Fullscreen Hero video with cursor-based 3D floating & spring inertia
     ================================================== */
  class HeroMotionController {
    constructor() {
      this.heroSec = document.querySelector('.hero-section');
      this.videoFrame = document.querySelector('.hero-video-frame');
      if (!this.heroSec || !this.videoFrame) return;

      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (this.isReducedMotion) return;

      this.target = { tx: 0, ty: 0, rx: 0, ry: 0 };
      this.current = { tx: 0, ty: 0, rx: 0, ry: 0 };
      this.damping = 0.065;

      this.initCursorTracking();
      this.initScrollMotion();
      this.render();
    }

    initCursorTracking() {
      if (window.innerWidth < 1024) return;

      window.addEventListener('mousemove', (e) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;

        this.target.tx = nx * 8;
        this.target.ty = ny * 6;
        this.target.ry = nx * 1.2;
        this.target.rx = -ny * 1.0;
      }, { passive: true });

      window.addEventListener('mouseleave', () => {
        this.target.tx = 0;
        this.target.ty = 0;
        this.target.rx = 0;
        this.target.ry = 0;
      });
    }

    initScrollMotion() {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

      gsap.to(this.videoFrame, {
        scale: 0.94,
        y: -100,
        opacity: 0.88,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: this.heroSec,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2
        }
      });
    }

    render() {
      this.current.tx += (this.target.tx - this.current.tx) * this.damping;
      this.current.ty += (this.target.ty - this.current.ty) * this.damping;
      this.current.rx += (this.target.rx - this.current.rx) * this.damping;
      this.current.ry += (this.target.ry - this.current.ry) * this.damping;

      this.videoFrame.style.transform = `
        translate3d(${this.current.tx.toFixed(2)}px, ${this.current.ty.toFixed(2)}px, 0px)
        rotateX(${this.current.rx.toFixed(2)}deg)
        rotateY(${this.current.ry.toFixed(2)}deg)
        scale3d(1.03, 1.03, 1)
      `;

      requestAnimationFrame(() => this.render());
    }
  }

  /* ==================================================
     4. MATHEMATICAL SVG VISUALS & ORBIT SIMULATOR
     ================================================== */
  const MathVisuals = {
    orbitAnimFrame: null,

    initEditorialMoments() {
      const v1 = document.getElementById('vis-explanation-svg');
      if (v1) {
        v1.innerHTML = `
          <defs>
            <linearGradient id="bv1-grad-a" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2563EB" stop-opacity="0.16" />
              <stop offset="100%" stop-color="#14B8A6" stop-opacity="0.04" />
            </linearGradient>
            <linearGradient id="bv1-grad-b" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#14B8A6" stop-opacity="0.16" />
              <stop offset="100%" stop-color="#2563EB" stop-opacity="0.04" />
            </linearGradient>
          </defs>
          <rect x="40" y="140" width="120" height="40" fill="url(#bv1-grad-a)" stroke="#2563EB" stroke-width="1.2" stroke-opacity="0.45" />
          <rect x="160" y="20" width="40" height="120" fill="url(#bv1-grad-b)" stroke="#14B8A6" stroke-width="1.2" stroke-opacity="0.45" />
          <polygon points="40,140 160,140 160,20" fill="none" stroke="#2563EB" stroke-width="2.2" />
          <polyline points="148,140 148,128 160,128" fill="none" stroke="#14B8A6" stroke-width="1.5" />
          <line x1="40" y1="140" x2="160" y2="20" stroke="#14B8A6" stroke-width="2.6" />
          <circle cx="160" cy="20" r="5" fill="#F5C542" />
          <circle cx="40" cy="140" r="4" fill="#2563EB" />
          <circle cx="160" cy="140" r="4" fill="#14B8A6" />
          <text x="65" y="80" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="600" fill="#2563EB">a² + b² = <tspan fill="#F5C542">c²</tspan></text>
        `;
      }

      const v2 = document.getElementById('vis-interactive-svg');
      if (v2) {
        v2.innerHTML = `
          <defs>
            <linearGradient id="bv2-area" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#14B8A6" stop-opacity="0.18" />
              <stop offset="100%" stop-color="#2563EB" stop-opacity="0.03" />
            </linearGradient>
          </defs>
          <line x1="20" y1="130" x2="180" y2="130" stroke="#2563EB" stroke-opacity="0.2" stroke-width="1" />
          <line x1="40" y1="20" x2="40" y2="140" stroke="#2563EB" stroke-opacity="0.2" stroke-width="1" />
          <path d="M 30 120 Q 90 115 110 70 T 170 30 L 170 130 L 30 130 Z" fill="url(#bv2-area)" />
          <path d="M 30 120 Q 90 115 110 70 T 170 30" fill="none" stroke="#14B8A6" stroke-width="2.4" />
          <line x1="45" y1="110" x2="165" y2="30" stroke="#2563EB" stroke-width="1.8" />
          <line x1="85" y1="84" x2="135" y2="84" stroke="#14B8A6" stroke-opacity="0.5" stroke-dasharray="3 3" />
          <line x1="135" y1="84" x2="135" y2="48" stroke="#14B8A6" stroke-opacity="0.5" stroke-dasharray="3 3" />
          <circle cx="85" cy="84" r="4" fill="#2563EB" />
          <circle cx="135" cy="48" r="4" fill="#14B8A6" />
          <circle cx="105" cy="70" r="5" fill="#F5C542" />
          <text x="100" y="150" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#585860" text-anchor="middle">lim <tspan fill="#14B8A6">Δx→0</tspan> Δy/Δx = <tspan fill="#2563EB" font-weight="700">f'(x)</tspan></text>
        `;
      }

      const v3 = document.getElementById('vis-realworld-svg');
      if (v3) {
        v3.innerHTML = `
          <defs>
            <linearGradient id="bv3-truss" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2563EB" stop-opacity="0.12" />
              <stop offset="100%" stop-color="#14B8A6" stop-opacity="0.03" />
            </linearGradient>
          </defs>
          <line x1="10" y1="130" x2="190" y2="130" stroke="#2563EB" stroke-opacity="0.25" stroke-width="1.5" stroke-dasharray="4 4" />
          <polygon points="20,130 180,130 100,30" fill="url(#bv3-truss)" stroke="#2563EB" stroke-width="2.2" />
          <line x1="60" y1="80" x2="140" y2="80" stroke="#14B8A6" stroke-width="1.8" />
          <line x1="60" y1="80" x2="100" y2="130" stroke="#14B8A6" stroke-width="1.5" stroke-dasharray="3 3" />
          <line x1="140" y1="80" x2="100" y2="130" stroke="#14B8A6" stroke-width="1.5" stroke-dasharray="3 3" />
          <line x1="100" y1="30" x2="100" y2="130" stroke="#2563EB" stroke-width="1.8" />
          <line x1="100" y1="8" x2="100" y2="28" stroke="#F5C542" stroke-width="2.5" />
          <polygon points="97,24 103,24 100,30" fill="#F5C542" />
          <circle cx="100" cy="30" r="5" fill="#F5C542" />
          <circle cx="20" cy="130" r="3.5" fill="#2563EB" />
          <circle cx="180" cy="130" r="3.5" fill="#2563EB" />
          <circle cx="100" cy="130" r="3.5" fill="#14B8A6" />
          <text x="100" y="152" font-family="'JetBrains Mono', monospace" font-size="10" fill="#585860" text-anchor="middle">ΣF = 0 // <tspan fill="#14B8A6">EQUILIBRIUM</tspan></text>
        `;
      }

      const v4 = document.getElementById('vis-experiments-svg');
      if (v4) {
        v4.innerHTML = `
          <defs>
            <linearGradient id="bv4-wave" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#2563EB" stop-opacity="0.14" />
              <stop offset="100%" stop-color="#14B8A6" stop-opacity="0.02" />
            </linearGradient>
          </defs>
          <line x1="15" y1="80" x2="185" y2="80" stroke="#2563EB" stroke-opacity="0.22" stroke-width="1" />
          <path d="M 20 80 Q 60 20 100 80 T 180 80 L 180 80 L 20 80 Z" fill="url(#bv4-wave)" />
          <path d="M 20 80 Q 60 20 100 80 T 180 80" fill="none" stroke="#2563EB" stroke-width="2.5" />
          <path d="M 20 80 Q 60 140 100 80 T 180 80" fill="none" stroke="#14B8A6" stroke-width="1.8" stroke-opacity="0.85" stroke-dasharray="4 3" />
          <circle cx="60" cy="35" r="5" fill="#F5C542" />
          <circle cx="100" cy="80" r="4" fill="#2563EB" />
          <circle cx="140" cy="125" r="4" fill="#14B8A6" />
          <text x="100" y="152" font-family="'JetBrains Mono', monospace" font-size="10" fill="#585860" text-anchor="middle">y = A sin(<tspan fill="#2563EB">ωt</tspan> + <tspan fill="#14B8A6">φ</tspan>)</text>
        `;
      }
    },

    initWhatYouGetVisuals() {
      const w1 = document.getElementById('wyg-vis-1');
      if (w1) {
        w1.innerHTML = `
          <defs>
            <linearGradient id="bw1-star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2563EB" stop-opacity="0.12" />
              <stop offset="100%" stop-color="#14B8A6" stop-opacity="0.05" />
            </linearGradient>
          </defs>
          <polygon points="150,40 240,105 205,210 95,210 60,105" fill="none" stroke="#2563EB" stroke-width="2" />
          <polygon points="150,40 205,210 60,105 240,105 95,210" fill="url(#bw1-star-grad)" stroke="#14B8A6" stroke-width="1.8" stroke-linejoin="round" />
          <circle cx="150" cy="40" r="5.5" fill="#F5C542" />
          <circle cx="240" cy="105" r="4.5" fill="#2563EB" />
          <circle cx="205" cy="210" r="4.5" fill="#14B8A6" />
          <circle cx="95" cy="210" r="4.5" fill="#14B8A6" />
          <circle cx="60" cy="105" r="4.5" fill="#2563EB" />
        `;
      }

      const w2 = document.getElementById('wyg-vis-2');
      if (w2) {
        w2.innerHTML = `
          <defs>
            <linearGradient id="bw2-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2563EB" stop-opacity="0.1" />
              <stop offset="100%" stop-color="#14B8A6" stop-opacity="0.03" />
            </linearGradient>
          </defs>
          <ellipse cx="150" cy="130" rx="105" ry="52" transform="rotate(30 150 130)" fill="url(#bw2-grad)" stroke="#2563EB" stroke-width="2" />
          <ellipse cx="150" cy="130" rx="105" ry="52" transform="rotate(-30 150 130)" fill="none" stroke="#14B8A6" stroke-width="1.8" stroke-opacity="0.85" />
          <line x1="90" y1="130" x2="210" y2="130" stroke="#2563EB" stroke-opacity="0.25" stroke-dasharray="3 3" />
          <circle cx="150" cy="130" r="6" fill="#2563EB" />
          <circle cx="210" cy="95" r="5.5" fill="#F5C542" />
          <circle cx="90" cy="165" r="4.5" fill="#14B8A6" />
          <text x="150" y="215" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#585860" text-anchor="middle">e = c/a // <tspan fill="#14B8A6">ECCENTRICITY</tspan></text>
        `;
      }

      const w3 = document.getElementById('wyg-vis-3');
      if (w3) {
        w3.innerHTML = `
          <defs>
            <radialGradient id="bw3-core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#2563EB" stop-opacity="0.25" />
              <stop offset="60%" stop-color="#14B8A6" stop-opacity="0.08" />
              <stop offset="100%" stop-color="#2563EB" stop-opacity="0" />
            </radialGradient>
          </defs>
          <circle cx="150" cy="130" r="85" fill="url(#bw3-core-glow)" stroke="#2563EB" stroke-opacity="0.2" stroke-width="1" />
          <circle cx="150" cy="130" r="55" fill="none" stroke="#2563EB" stroke-opacity="0.35" stroke-width="1.5" />
          <circle cx="150" cy="130" r="30" fill="none" stroke="#14B8A6" stroke-opacity="0.45" stroke-dasharray="4 3" />
          <ellipse cx="150" cy="130" rx="115" ry="38" transform="rotate(-20 150 130)" fill="none" stroke="#14B8A6" stroke-width="2" stroke-dasharray="5 4" />
          <circle cx="150" cy="130" r="9" fill="#2563EB" />
          <circle cx="235" cy="98" r="7.5" fill="#F5C542" />
          <line x1="150" y1="130" x2="235" y2="98" stroke="#14B8A6" stroke-opacity="0.6" stroke-width="1.2" stroke-dasharray="3 3" />
          <text x="150" y="215" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#585860" text-anchor="middle">g = GM / r²</text>
        `;
      }

      const w4 = document.getElementById('wyg-vis-4');
      if (w4) {
        w4.innerHTML = `
          <defs>
            <linearGradient id="bw4-rect-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2563EB" stop-opacity="0.08" />
              <stop offset="100%" stop-color="#14B8A6" stop-opacity="0.04" />
            </linearGradient>
          </defs>
          <rect x="70" y="50" width="160" height="160" fill="url(#bw4-rect-grad)" stroke="#2563EB" stroke-opacity="0.3" stroke-width="1" />
          <rect x="70" y="50" width="100" height="100" fill="none" stroke="#14B8A6" stroke-opacity="0.4" stroke-width="1" />
          <rect x="170" y="50" width="60" height="60" fill="none" stroke="#2563EB" stroke-opacity="0.3" stroke-width="1" />
          <path d="M 70 210 A 160 160 0 0 1 230 50" fill="none" stroke="#2563EB" stroke-width="2.5" />
          <path d="M 230 50 A 100 100 0 0 1 130 150" fill="none" stroke="#14B8A6" stroke-width="2" />
          <circle cx="130" cy="150" r="5" fill="#F5C542" />
          <text x="150" y="240" font-family="'JetBrains Mono', monospace" font-size="11.5" fill="#F5C542" font-weight="600" text-anchor="middle">φ = (1+√5)/2 ≈ <tspan fill="#2563EB">1.618</tspan></text>
        `;
      }

      const w5 = document.getElementById('wyg-vis-5');
      if (w5) {
        w5.innerHTML = `
          <defs>
            <radialGradient id="bw5-incircle" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#14B8A6" stop-opacity="0.16" />
              <stop offset="100%" stop-color="#14B8A6" stop-opacity="0.02" />
            </radialGradient>
          </defs>
          <line x1="50" y1="130" x2="250" y2="130" stroke="#2563EB" stroke-opacity="0.15" />
          <line x1="150" y1="30" x2="150" y2="230" stroke="#2563EB" stroke-opacity="0.15" />
          <polygon points="150,60 210,170 90,170" fill="none" stroke="#2563EB" stroke-width="2" />
          <circle cx="150" cy="130" r="32" fill="url(#bw5-incircle)" stroke="#14B8A6" stroke-width="1.8" stroke-dasharray="3 3" />
          <line x1="150" y1="45" x2="150" y2="185" stroke="#14B8A6" stroke-width="1.4" stroke-opacity="0.8" />
          <circle cx="150" cy="60" r="5" fill="#F5C542" />
          <circle cx="150" cy="130" r="4.5" fill="#14B8A6" />
          <circle cx="210" cy="170" r="4" fill="#2563EB" />
          <circle cx="90" cy="170" r="4" fill="#2563EB" />
        `;
      }
    },

    initPricingVisuals() {
      const p1 = document.getElementById('price-vis-1');
      if (p1) {
        p1.innerHTML = `
          <defs>
            <linearGradient id="bp1-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2563EB" stop-opacity="0.12" />
              <stop offset="100%" stop-color="#14B8A6" stop-opacity="0.04" />
            </linearGradient>
          </defs>
          <polygon points="100,20 170,120 30,120" fill="url(#bp1-grad)" stroke="#2563EB" stroke-width="2" />
          <circle cx="100" cy="85" r="32" fill="none" stroke="#14B8A6" stroke-opacity="0.75" stroke-dasharray="3 3" stroke-width="1.5" />
          <circle cx="100" cy="20" r="5" fill="#F5C542" />
          <circle cx="100" cy="85" r="3.5" fill="#14B8A6" />
        `;
      }

      const p2 = document.getElementById('price-vis-2');
      if (p2) {
        p2.innerHTML = `
          <defs>
            <linearGradient id="bp2-top" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2563EB" stop-opacity="0.18" />
              <stop offset="100%" stop-color="#14B8A6" stop-opacity="0.08" />
            </linearGradient>
            <linearGradient id="bp2-side" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#14B8A6" stop-opacity="0.14" />
              <stop offset="100%" stop-color="#2563EB" stop-opacity="0.04" />
            </linearGradient>
          </defs>
          <polygon points="100,20 160,55 100,90 40,55" fill="url(#bp2-top)" stroke="#2563EB" stroke-width="2" />
          <polygon points="100,90 160,55 160,115 100,150" fill="url(#bp2-side)" stroke="#14B8A6" stroke-width="1.8" />
          <polygon points="100,90 40,55 40,115 100,150" fill="rgba(37, 99, 235, 0.06)" stroke="#2563EB" stroke-width="1.8" />
          <circle cx="100" cy="90" r="5" fill="#F5C542" />
        `;
      }

      const p3 = document.getElementById('price-vis-3');
      if (p3) {
        p3.innerHTML = `
          <defs>
            <radialGradient id="bp3-sphere" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#2563EB" stop-opacity="0.16" />
              <stop offset="70%" stop-color="#14B8A6" stop-opacity="0.06" />
              <stop offset="100%" stop-color="#2563EB" stop-opacity="0.01" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="85" r="60" fill="url(#bp3-sphere)" stroke="#2563EB" stroke-width="2" />
          <ellipse cx="100" cy="85" rx="80" ry="25" transform="rotate(30 100 85)" fill="none" stroke="#14B8A6" stroke-width="1.8" />
          <ellipse cx="100" cy="85" rx="80" ry="25" transform="rotate(-30 100 85)" fill="none" stroke="#14B8A6" stroke-width="1.8" />
          <circle cx="100" cy="85" r="14" fill="#F5C542" opacity="0.95" />
          <circle cx="100" cy="85" r="22" fill="none" stroke="#F5C542" stroke-opacity="0.4" stroke-dasharray="3 3" />
        `;
      }
    },

    /* 07 — TRANSFORMATION: CIRCLE -> WHEEL -> PLANET ORBIT -> UNIVERSAL GEOMETRY */
    initTransformationVisual(svgEl) {
      if (!svgEl) return;

      svgEl.innerHTML = `
        <defs>
          <radialGradient id="bt-circle-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#2563EB" stop-opacity="0.12" />
            <stop offset="70%" stop-color="#14B8A6" stop-opacity="0.03" />
            <stop offset="100%" stop-color="#2563EB" stop-opacity="0" />
          </radialGradient>

          <radialGradient id="b-planet-sphere" cx="36%" cy="34%" r="66%">
            <stop offset="0%" stop-color="#14B8A6" stop-opacity="0.35" />
            <stop offset="45%" stop-color="#2563EB" stop-opacity="0.22" />
            <stop offset="85%" stop-color="#2563EB" stop-opacity="0.08" />
            <stop offset="100%" stop-color="#2563EB" stop-opacity="0.02" />
          </radialGradient>

          <radialGradient id="b-planet-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#2563EB" stop-opacity="0.25" />
            <stop offset="60%" stop-color="#14B8A6" stop-opacity="0.06" />
            <stop offset="100%" stop-color="#2563EB" stop-opacity="0" />
          </radialGradient>
        </defs>

        <g id="t-stage-group" transform="translate(250, 250)">
          <!-- 1. CIRCLE -->
          <circle id="t-circle" r="140" fill="url(#bt-circle-glow)" stroke="#2563EB" stroke-width="2.5" />

          <!-- 2. WHEEL -->
          <g id="t-wheel" opacity="0">
            <circle r="140" fill="none" stroke="#2563EB" stroke-width="3.5" />
            <circle r="36" fill="var(--bg-primary)" stroke="#14B8A6" stroke-width="2.5" />
            <line x1="0" y1="-140" x2="0" y2="140" stroke="#14B8A6" stroke-width="1.6" />
            <line x1="-140" y1="0" x2="140" y2="0" stroke="#14B8A6" stroke-width="1.6" />
            <line x1="-99" y1="-99" x2="99" y2="99" stroke="#14B8A6" stroke-width="1.6" />
            <line x1="-99" y1="99" x2="99" y2="-99" stroke="#14B8A6" stroke-width="1.6" />
            <circle r="6.5" fill="#F5C542" />
          </g>

          <!-- 3. PLANET / ORBIT SYSTEM (ENGAGING, VISIBLE, ANIMATED) -->
          <g id="t-planet" opacity="0">
            <!-- Atmospheric Halo -->
            <circle r="115" fill="url(#b-planet-halo)" />

            <!-- Coordinate Axes & Compass -->
            <g stroke="#2563EB" stroke-opacity="0.12" stroke-width="1">
              <line x1="-220" y1="0" x2="220" y2="0" stroke-dasharray="3 3" />
              <line x1="0" y1="-220" x2="0" y2="220" stroke-dasharray="3 3" />
              <circle r="200" fill="none" stroke-dasharray="2 6" />
            </g>

            <!-- Outer Resonant Orbit -->
            <ellipse rx="210" ry="95" transform="rotate(20)" fill="none" stroke="#2563EB" stroke-width="1.4" stroke-opacity="0.38" stroke-dasharray="5 5" />

            <!-- Primary Keplerian Ellipse -->
            <ellipse rx="165" ry="75" transform="rotate(-18)" fill="none" stroke="#14B8A6" stroke-width="2" stroke-opacity="0.85" />

            <!-- Inner Fast Orbit -->
            <ellipse rx="95" ry="50" transform="rotate(35)" fill="none" stroke="#2563EB" stroke-width="1.2" stroke-opacity="0.3" stroke-dasharray="3 3" />

            <!-- Focal line & points -->
            <g transform="rotate(-18)">
              <line x1="-147" y1="0" x2="147" y2="0" stroke="#2563EB" stroke-opacity="0.25" stroke-dasharray="2 2" />
              <circle cx="-147" cy="0" r="3" fill="#2563EB" fill-opacity="0.6" />
              <circle cx="147" cy="0" r="3" fill="#2563EB" fill-opacity="0.6" />
            </g>

            <!-- Central Celestial Body -->
            <g id="central-planet">
              <circle r="52" fill="url(#b-planet-sphere)" stroke="#2563EB" stroke-width="2.5" />
              <ellipse rx="52" ry="18" fill="none" stroke="#14B8A6" stroke-width="1.4" stroke-opacity="0.5" transform="rotate(-23.5)" />
              <ellipse rx="18" ry="52" fill="none" stroke="#14B8A6" stroke-width="1.4" stroke-opacity="0.5" transform="rotate(-23.5)" />
              <line x1="-24" y1="-56" x2="24" y2="56" stroke="#2563EB" stroke-width="1.8" stroke-linecap="round" />
              <circle r="5" fill="#F5C542" />
              <circle r="8" fill="none" stroke="#F5C542" stroke-opacity="0.4" stroke-width="1" />
            </g>

            <!-- Satellite 1 (Primary - Warm Yellow with velocity & gravity vectors) -->
            <g id="b-sat-1">
              <line id="b-sat-rad-line" x1="0" y1="0" x2="140" y2="-45" stroke="#14B8A6" stroke-width="1.2" stroke-opacity="0.5" stroke-dasharray="3 3" />
              <line id="b-sat-grav-vec" x1="140" y1="-45" x2="105" y2="-34" stroke="#2563EB" stroke-width="2" />
              <line id="b-sat-vel-vec" x1="140" y1="-45" x2="128" y2="-82" stroke="#14B8A6" stroke-width="2.2" />
              <circle id="b-sat-body-1" cx="140" cy="-45" r="7" fill="#F5C542" />
              <circle id="b-sat-halo-1" cx="140" cy="-45" r="12" fill="none" stroke="#F5C542" stroke-opacity="0.4" stroke-dasharray="2 2" />
            </g>

            <!-- Satellite 2 (Outer Resonant - Soft Teal) -->
            <g id="b-sat-2">
              <circle id="b-sat-body-2" cx="-180" cy="50" r="5" fill="#14B8A6" />
              <circle cx="-180" cy="50" r="9" fill="none" stroke="#14B8A6" stroke-opacity="0.3" />
            </g>

            <!-- Satellite 3 (Inner Fast - Deep Blue) -->
            <g id="b-sat-3">
              <circle id="b-sat-body-3" cx="60" cy="30" r="4" fill="#2563EB" />
            </g>

            <!-- Mathematical Annotations -->
            <g font-family="'JetBrains Mono', monospace" font-size="10.5">
              <text x="-215" y="-180" fill="#2563EB" font-weight="600">KEPLERIAN ORBIT DYNAMICS</text>
              <text x="-215" y="-162" fill="#14B8A6">T² = (4π²/GM) · a³</text>
              <text x="-215" y="-144" fill="#585860">F_g = G(M·m)/r²</text>
              <text x="110" y="195" fill="#F5C542" font-weight="600">v_orbit = √(GM/r)</text>
            </g>
          </g>

          <!-- 4. PATTERN / UNIVERSAL GEOMETRY -->
          <g id="t-pattern" opacity="0" stroke="#2563EB" stroke-width="1.2" fill="none">
            <circle r="180" stroke="#2563EB" stroke-opacity="0.15" stroke-dasharray="5 5" />
            <ellipse rx="170" ry="90" transform="rotate(0)" stroke="#2563EB" stroke-opacity="0.75" />
            <ellipse rx="170" ry="90" transform="rotate(45)" stroke="#14B8A6" stroke-opacity="0.75" />
            <ellipse rx="170" ry="90" transform="rotate(90)" stroke="#2563EB" stroke-opacity="0.75" />
            <ellipse rx="170" ry="90" transform="rotate(135)" stroke="#14B8A6" stroke-opacity="0.75" />
            <circle r="7.5" fill="#F5C542" />
          </g>
        </g>
      `;

      this.startOrbitAnimation();
      this.initOrbitCursorTilt();
    },

    startOrbitAnimation() {
      if (this.orbitAnimFrame) cancelAnimationFrame(this.orbitAnimFrame);

      let t = 0;
      const tiltAngle1 = -18 * (Math.PI / 180);
      const cosTilt1 = Math.cos(tiltAngle1);
      const sinTilt1 = Math.sin(tiltAngle1);

      const tiltAngle2 = 20 * (Math.PI / 180);
      const cosTilt2 = Math.cos(tiltAngle2);
      const sinTilt2 = Math.sin(tiltAngle2);

      const tiltAngle3 = 35 * (Math.PI / 180);
      const cosTilt3 = Math.cos(tiltAngle3);
      const sinTilt3 = Math.sin(tiltAngle3);

      const satBody1 = document.getElementById('b-sat-body-1');
      const satHalo1 = document.getElementById('b-sat-halo-1');
      const satRadLine = document.getElementById('b-sat-rad-line');
      const satVelVec = document.getElementById('b-sat-vel-vec');
      const satGravVec = document.getElementById('b-sat-grav-vec');
      const satBody2 = document.getElementById('b-sat-body-2');
      const satBody3 = document.getElementById('b-sat-body-3');

      const animate = () => {
        t += 0.016;

        // 1. Primary Satellite
        const speed1 = 0.65;
        const angle1 = t * speed1;
        const unrotatedX1 = 165 * Math.cos(angle1);
        const unrotatedY1 = 75 * Math.sin(angle1);

        const x1 = unrotatedX1 * cosTilt1 - unrotatedY1 * sinTilt1;
        const y1 = unrotatedX1 * sinTilt1 + unrotatedY1 * cosTilt1;

        const unrotatedVx = -165 * Math.sin(angle1);
        const unrotatedVy = 75 * Math.cos(angle1);
        const vLen = Math.hypot(unrotatedVx, unrotatedVy);
        const normVx = (unrotatedVx / vLen) * 38;
        const normVy = (unrotatedVy / vLen) * 38;
        const vx = normVx * cosTilt1 - normVy * sinTilt1;
        const vy = normVx * sinTilt1 + normVy * cosTilt1;

        const rLen = Math.hypot(x1, y1);
        const gx = (-x1 / rLen) * 34;
        const gy = (-y1 / rLen) * 34;

        if (satBody1) {
          satBody1.setAttribute('cx', x1);
          satBody1.setAttribute('cy', y1);
        }
        if (satHalo1) {
          satHalo1.setAttribute('cx', x1);
          satHalo1.setAttribute('cy', y1);
        }
        if (satRadLine) {
          satRadLine.setAttribute('x2', x1);
          satRadLine.setAttribute('y2', y1);
        }
        if (satVelVec) {
          satVelVec.setAttribute('x1', x1);
          satVelVec.setAttribute('y1', y1);
          satVelVec.setAttribute('x2', x1 + vx);
          satVelVec.setAttribute('y2', y1 + vy);
        }
        if (satGravVec) {
          satGravVec.setAttribute('x1', x1);
          satGravVec.setAttribute('y1', y1);
          satGravVec.setAttribute('x2', x1 + gx);
          satGravVec.setAttribute('y2', y1 + gy);
        }

        // 2. Outer Satellite
        const speed2 = 0.35;
        const angle2 = t * speed2 + 2.4;
        const unrotatedX2 = 210 * Math.cos(angle2);
        const unrotatedY2 = 95 * Math.sin(angle2);
        const x2 = unrotatedX2 * cosTilt2 - unrotatedY2 * sinTilt2;
        const y2 = unrotatedX2 * sinTilt2 + unrotatedY2 * cosTilt2;

        if (satBody2) {
          satBody2.setAttribute('cx', x2);
          satBody2.setAttribute('cy', y2);
        }

        // 3. Inner Satellite
        const speed3 = 1.1;
        const angle3 = t * speed3 + 1.2;
        const unrotatedX3 = 95 * Math.cos(angle3);
        const unrotatedY3 = 50 * Math.sin(angle3);
        const x3 = unrotatedX3 * cosTilt3 - unrotatedY3 * sinTilt3;
        const y3 = unrotatedX3 * sinTilt3 + unrotatedY3 * cosTilt3;

        if (satBody3) {
          satBody3.setAttribute('cx', x3);
          satBody3.setAttribute('cy', y3);
        }

        this.orbitAnimFrame = requestAnimationFrame(animate);
      };

      this.orbitAnimFrame = requestAnimationFrame(animate);
    },

    initOrbitCursorTilt() {
      const stage = document.querySelector('.transformation-visual-box') || document.querySelector('.section-transformation');
      const group = document.getElementById('t-planet');
      if (!stage || !group) return;

      let targetRotX = 0;
      let targetRotY = 0;
      let currRotX = 0;
      let currRotY = 0;

      stage.addEventListener('mousemove', (e) => {
        const rect = stage.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width) - 0.5;
        const normY = ((e.clientY - rect.top) / rect.height) - 0.5;

        targetRotY = normX * 14;
        targetRotX = -normY * 14;
      });

      stage.addEventListener('mouseleave', () => {
        targetRotX = 0;
        targetRotY = 0;
      });

      const updateTilt = () => {
        currRotX += (targetRotX - currRotX) * 0.08;
        currRotY += (targetRotY - currRotY) * 0.08;

        if (group && (Math.abs(currRotX) > 0.01 || Math.abs(currRotY) > 0.01)) {
          group.style.transform = `perspective(600px) rotateX(${currRotX.toFixed(2)}deg) rotateY(${currRotY.toFixed(2)}deg)`;
          group.style.transformOrigin = 'center center';
        }
        requestAnimationFrame(updateTilt);
      };

      requestAnimationFrame(updateTilt);
    },

    initConceptVisual(svgEl) {
      if (!svgEl) return;
      svgEl.innerHTML = `
        <defs>
          <linearGradient id="bc-card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.98)" />
            <stop offset="100%" stop-color="rgba(250, 249, 246, 0.95)" />
          </linearGradient>
          <radialGradient id="bc-core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#2563EB" stop-opacity="0.1" />
            <stop offset="70%" stop-color="#14B8A6" stop-opacity="0.03" />
            <stop offset="100%" stop-color="#2563EB" stop-opacity="0" />
          </radialGradient>
        </defs>
        <g id="c-stage-group" transform="translate(260, 260)">
          <circle r="180" fill="url(#bc-core-glow)" stroke="#2563EB" stroke-opacity="0.12" stroke-dasharray="6 6" />
          <line x1="-220" y1="0" x2="220" y2="0" stroke="#2563EB" stroke-opacity="0.18" />
          <line x1="0" y1="-220" x2="0" y2="220" stroke="#2563EB" stroke-opacity="0.18" />

          <circle id="c-circumference" r="160" fill="none" stroke="#2563EB" stroke-width="3.2" stroke-dasharray="1005" stroke-dashoffset="0" />
          <line id="c-diameter" x1="-160" y1="0" x2="160" y2="0" stroke="#14B8A6" stroke-width="2.6" opacity="0" />
          <line id="c-radius" x1="0" y1="0" x2="113" y2="-113" stroke="#14B8A6" stroke-width="3" opacity="0" />
          <circle id="c-radius-tip" cx="113" cy="-113" r="5.5" fill="#F5C542" opacity="0" />
          <circle id="c-center" cx="0" cy="0" r="6" fill="#F5C542" />

          <g id="c-pi-label" opacity="0" transform="translate(0, 0)">
            <rect x="-90" y="-32" width="180" height="64" rx="12" fill="url(#bc-card-grad)" stroke="#2563EB" stroke-width="1.8" stroke-opacity="0.8" />
            <text x="0" y="8" font-family="'JetBrains Mono', monospace" font-size="22" font-weight="700" fill="#2563EB" text-anchor="middle">π = C / d</text>
            <text x="0" y="46" font-family="'JetBrains Mono', monospace" font-size="12" fill="#F5C542" font-weight="600" text-anchor="middle">≈ 3.14159265...</text>
          </g>

          <text id="label-radius" x="65" y="-70" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="600" fill="#14B8A6" opacity="0">RADIUS (r)</text>
          <text id="label-diameter" x="-120" y="-12" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="600" fill="#14B8A6" opacity="0">DIAMETER (2r)</text>
          <text id="label-circumference" x="0" y="-175" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="600" fill="#2563EB" text-anchor="middle" opacity="0">CIRCUMFERENCE (2πr)</text>
        </g>
      `;
    },

    initMathAroundVisual(svgEl) {
      if (!svgEl) return;
      svgEl.innerHTML = `
        <g id="env-base" stroke="#2563EB" stroke-opacity="0.25" stroke-width="1.5" fill="none">
          <path d="M 80 440 L 80 180 L 260 180 L 260 440" />
          <path d="M 260 440 L 260 120 L 520 120 L 520 440" />
          <path d="M 520 440 L 520 220 L 760 220 L 760 440" />
          <line x1="120" y1="220" x2="220" y2="220" stroke="#14B8A6" stroke-opacity="0.25" />
          <line x1="120" y1="260" x2="220" y2="260" stroke="#14B8A6" stroke-opacity="0.25" />
          <line x1="120" y1="300" x2="220" y2="300" stroke="#14B8A6" stroke-opacity="0.25" />
          <circle cx="200" cy="400" r="32" stroke="#2563EB" stroke-opacity="0.4" />
          <path d="M 550 440 L 550 400 L 590 400 L 590 360 L 630 360 L 630 320 L 670 320 L 670 280" stroke="#14B8A6" stroke-opacity="0.35" />
        </g>

        <g id="env-math-overlays" opacity="0" stroke="#2563EB" stroke-width="1.5" fill="none">
          <circle cx="390" cy="180" r="6" fill="#F5C542" />
          <line x1="390" y1="180" x2="0" y2="100" stroke-dasharray="4 4" stroke="#14B8A6" stroke-opacity="0.75" />
          <line x1="390" y1="180" x2="840" y2="100" stroke-dasharray="4 4" stroke="#14B8A6" stroke-opacity="0.75" />
          <line x1="390" y1="180" x2="80" y2="440" stroke-dasharray="4 4" stroke="#2563EB" stroke-opacity="0.85" />
          <line x1="390" y1="180" x2="760" y2="440" stroke-dasharray="4 4" stroke="#2563EB" stroke-opacity="0.85" />

          <path d="M 520 120 A 260 260 0 0 1 260 380 A 160 160 0 0 1 360 440 A 100 100 0 0 1 440 380" stroke="#14B8A6" stroke-width="2.4" />
          <text x="530" y="140" font-family="'JetBrains Mono', monospace" font-size="11" fill="#F5C542" font-weight="600">φ ≈ 1.618</text>

          <path d="M 550 440 L 670 280" stroke="#2563EB" stroke-width="2.2" stroke-dasharray="6 3" />
          <text x="630" y="270" font-family="'JetBrains Mono', monospace" font-size="11" fill="#2563EB" font-weight="600">θ = 36.87° [3:4:5]</text>

          <line x1="140" y1="432" x2="260" y2="432" stroke="#14B8A6" stroke-width="2" />
          <text x="210" y="420" font-family="'JetBrains Mono', monospace" font-size="10" fill="#14B8A6" font-weight="600">TANGENT // dy/dx = 0</text>
        </g>
      `;
    },

    initFinalVisual(svgEl) {
      if (!svgEl) return;
      svgEl.innerHTML = `
        <defs>
          <linearGradient id="bf-shape-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2563EB" stop-opacity="0.14" />
            <stop offset="100%" stop-color="#14B8A6" stop-opacity="0.04" />
          </linearGradient>
          <linearGradient id="bf-obj-side" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#14B8A6" stop-opacity="0.18" />
            <stop offset="100%" stop-color="#2563EB" stop-opacity="0.05" />
          </linearGradient>
        </defs>
        <g id="f-stage-group" transform="translate(250, 250)">
          <circle id="f-point" cx="0" cy="0" r="7" fill="#F5C542" />
          <line id="f-line" x1="-120" y1="0" x2="120" y2="0" stroke="#2563EB" stroke-width="2.8" opacity="0" />
          <polygon id="f-shape" points="0,-130 112,65 -112,65" fill="url(#bf-shape-grad)" stroke="#2563EB" stroke-width="2.2" opacity="0" />

          <g id="f-object" opacity="0" stroke-width="1.8" fill="none">
            <polygon points="0,-120 104,-60 0,0 -104,-60" fill="rgba(37, 99, 235, 0.14)" stroke="#2563EB" stroke-width="2.2" />
            <polygon points="0,0 104,-60 104,60 0,120" fill="url(#bf-obj-side)" stroke="#14B8A6" stroke-opacity="0.85" />
            <polygon points="0,0 -104,-60 -104,60 0,120" fill="rgba(37, 99, 235, 0.08)" stroke="#2563EB" stroke-opacity="0.85" />
          </g>

          <g id="f-world" opacity="0">
            <circle r="120" fill="rgba(37, 99, 235, 0.08)" stroke="#2563EB" stroke-width="2.5" />
            <ellipse rx="120" ry="40" fill="none" stroke="#2563EB" stroke-width="1.4" stroke-opacity="0.35" />
            <ellipse rx="40" ry="120" fill="none" stroke="#2563EB" stroke-width="1.4" stroke-opacity="0.35" />
            <ellipse rx="185" ry="52" fill="none" stroke="#14B8A6" stroke-width="2" stroke-dasharray="4 4" transform="rotate(-25)" />
            <circle cx="155" cy="-62" r="8" fill="#F5C542" />
            <circle cx="-135" cy="72" r="5" fill="#2563EB" />
          </g>
        </g>
      `;
    }
  };

  /* ==================================================
     5. BIG INTERACTIVE GRID CANVAS
     ================================================== */
  class BigInteractiveGrid {
    constructor(canvasEl, hudEl) {
      this.canvas = canvasEl;
      this.hud = hudEl;
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.points = [];
      this.spacing = 55;
      this.mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false };
      this.radius = 160;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.init();
    }

    init() {
      this.resize();
      this.createGrid();

      window.addEventListener('resize', () => {
        this.resize();
        this.createGrid();
      });

      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.targetX = e.clientX - rect.left;
        this.mouse.targetY = e.clientY - rect.top;
        this.mouse.active = true;
        this.updateHud(this.mouse.targetX, this.mouse.targetY);
        Sound.playSliderTick();
      });

      this.canvas.addEventListener('mouseleave', () => {
        this.mouse.active = false;
      });

      this.render();
    }

    resize() {
      const width = this.canvas.parentElement.clientWidth;
      const height = this.canvas.parentElement.clientHeight;
      this.canvas.width = width * this.dpr;
      this.canvas.height = height * this.dpr;
      this.ctx.scale(this.dpr, this.dpr);
      this.width = width;
      this.height = height;
    }

    createGrid() {
      this.points = [];
      const cols = Math.ceil(this.width / this.spacing) + 1;
      const rows = Math.ceil(this.height / this.spacing) + 1;

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const originX = c * this.spacing;
          const originY = r * this.spacing;
          const isMajor = (r % 4 === 0 && c % 4 === 0);
          const isMinor = (r % 2 === 0 && c % 2 === 0);
          this.points.push({
            originX,
            originY,
            currentX: originX,
            currentY: originY,
            color: isMajor ? '#2563EB' : (isMinor ? '#14B8A6' : '#2563EB'),
            isMajor,
            isMinor
          });
        }
      }
    }

    updateHud(x, y) {
      if (!this.hud) return;
      const cartesianX = Math.round(x - this.width / 2);
      const cartesianY = Math.round((this.height / 2) - y);
      const angle = Math.round((Math.atan2(cartesianY, cartesianX) * 180 / Math.PI + 360) % 360);
      const dist = Math.round(Math.hypot(cartesianX, cartesianY));

      this.hud.innerHTML = `
        POINT: (<span style="color: #2563EB;">${cartesianX}</span>, <span style="color: #2563EB;">${cartesianY}</span>) &nbsp;|&nbsp; 
        r: <span style="color: #14B8A6;">${dist}px</span> &nbsp;|&nbsp; 
        θ: <span style="color: #F5C542;">${angle}°</span>
      `;
    }

    render() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.15;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.15;

      const centerX = this.width / 2;
      const centerY = this.height / 2;

      this.ctx.strokeStyle = 'rgba(37, 99, 235, 0.12)';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, 0);
      this.ctx.lineTo(centerX, this.height);
      this.ctx.moveTo(0, centerY);
      this.ctx.lineTo(this.width, centerY);
      this.ctx.stroke();

      for (let i = 0; i < this.points.length; i++) {
        const p = this.points[i];
        let dx = this.mouse.x - p.originX;
        let dy = this.mouse.y - p.originY;
        let dist = Math.hypot(dx, dy);

        if (this.mouse.active && dist < this.radius && dist > 0) {
          let force = (1 - dist / this.radius) * 18;
          let angle = Math.atan2(dy, dx);
          p.currentX = p.originX + Math.cos(angle) * force;
          p.currentY = p.originY + Math.sin(angle) * force;
        } else {
          p.currentX += (p.originX - p.currentX) * 0.1;
          p.currentY += (p.originY - p.currentY) * 0.1;
        }

        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.isMajor ? 0.75 : (p.isMinor ? 0.4 : 0.15);
        this.ctx.beginPath();
        this.ctx.arc(p.currentX, p.currentY, p.isMajor ? 2.5 : (p.isMinor ? 2 : 1.4), 0, Math.PI * 2);
        this.ctx.fill();

        if (this.mouse.active && dist < 95) {
          this.ctx.strokeStyle = '#14B8A6';
          this.ctx.globalAlpha = (1 - dist / 95) * 0.55;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(p.currentX, p.currentY);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.stroke();
        }
      }

      if (this.mouse.active) {
        this.ctx.strokeStyle = '#2563EB';
        this.ctx.globalAlpha = 0.55;
        this.ctx.lineWidth = 1.2;
        this.ctx.beginPath();
        this.ctx.arc(this.mouse.x, this.mouse.y, 16, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.fillStyle = '#F5C542';
        this.ctx.globalAlpha = 0.95;
        this.ctx.beginPath();
        this.ctx.arc(this.mouse.x, this.mouse.y, 3.5, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.globalAlpha = 1.0;
      requestAnimationFrame(() => this.render());
    }
  }

  /* ==================================================
     6. INTERACTIVE MATHEMATICAL EXPERIMENTS
     ================================================== */
  class MathExperiments {
    constructor() {
      this.initAngleExperiment();
      this.initProbabilityExperiment();
      this.initFractionExperiment();
    }

    initAngleExperiment() {
      const slider = document.getElementById('angle-slider');
      const badge = document.getElementById('angle-degree-val');
      const svg = document.getElementById('angle-svg');
      if (!slider || !svg) return;

      let lastDeg = parseInt(slider.value, 10);

      const updateAngle = (degrees) => {
        const rad = (degrees * Math.PI) / 180;
        if (badge) badge.textContent = `${degrees}°`;

        const bx = 70;
        const by = 170;
        const sideA = 150;
        const cx = bx + sideA;
        const cy = by;

        const sideC = 140;
        const ax = bx + sideC * Math.cos(Math.PI - rad);
        const ay = by - sideC * Math.sin(Math.PI - rad);

        const arcRadius = 42;
        const arcStartX = bx + arcRadius;
        const arcStartY = by;
        const arcEndX = bx + arcRadius * Math.cos(Math.PI - rad);
        const arcEndY = by - arcRadius * Math.sin(Math.PI - rad);
        const largeArc = degrees > 180 ? 1 : 0;

        svg.innerHTML = `
          <defs>
            <linearGradient id="triGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2563EB" stop-opacity="0.16" />
              <stop offset="100%" stop-color="#14B8A6" stop-opacity="0.04" />
            </linearGradient>
          </defs>
          <line x1="20" y1="${by}" x2="300" y2="${by}" stroke="#2563EB" stroke-opacity="0.15" stroke-dasharray="3 3" />
          <polygon points="${bx},${by} ${cx},${cy} ${ax},${ay}" fill="url(#triGrad)" stroke="#2563EB" stroke-width="2.5" stroke-linejoin="round" />
          <path d="M ${arcStartX} ${arcStartY} A ${arcRadius} ${arcRadius} 0 ${largeArc} 0 ${arcEndX} ${arcEndY}" fill="rgba(20, 184, 166, 0.15)" stroke="#14B8A6" stroke-width="2" />
          <circle cx="${bx}" cy="${by}" r="4.5" fill="#2563EB" />
          <circle cx="${cx}" cy="${cy}" r="4.5" fill="#2563EB" />
          <circle cx="${ax}" cy="${ay}" r="5.5" fill="#F5C542" />
          <text x="${bx + 22}" y="${by - 14}" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" fill="#14B8A6">${degrees}°</text>
          <g font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#585860">
            <text x="20" y="30">sin(${degrees}°) = <tspan fill="#2563EB" font-weight="600">${(Math.sin(rad)).toFixed(3)}</tspan></text>
            <text x="20" y="46">cos(${degrees}°) = <tspan fill="#14B8A6" font-weight="600">${(Math.cos(rad)).toFixed(3)}</tspan></text>
          </g>
        `;
      };

      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        updateAngle(val);
        Sound.playSliderTick();

        if ((val === 90 || val === 180) && lastDeg !== val) {
          Sound.playDiscoveryChime();
        }
        lastDeg = val;
      });

      updateAngle(parseInt(slider.value, 10));
    }

    initProbabilityExperiment() {
      const btn = document.getElementById('prob-btn');
      const tokensContainer = document.getElementById('prob-tokens-container');
      const statTrials = document.getElementById('prob-stat-trials');
      const statRate = document.getElementById('prob-stat-rate');
      if (!btn || !tokensContainer) return;

      let totalTrials = 0;
      let targetHits = 0;
      const items = [
        { id: 1, shape: '▲' },
        { id: 2, shape: '■' },
        { id: 3, shape: '●' },
        { id: 4, shape: '◆' },
        { id: 5, shape: '⬡' },
        { id: 6, shape: '★' }
      ];

      const renderTokens = (selectedIdx = -1) => {
        tokensContainer.innerHTML = items.map((item, idx) => `
          <div class="prob-token ${idx === selectedIdx ? 'highlighted' : ''}" data-idx="${idx}">
            ${item.shape}
          </div>
        `).join('');
      };

      renderTokens(2);

      btn.addEventListener('click', () => {
        Sound.playExperimentClick();
        btn.disabled = true;
        let count = 0;
        const interval = setInterval(() => {
          const randomIdx = Math.floor(Math.random() * items.length);
          renderTokens(randomIdx);
          count++;

          if (count > 8) {
            clearInterval(interval);
            const finalIdx = Math.floor(Math.random() * items.length);
            renderTokens(finalIdx);

            totalTrials++;
            if (finalIdx === 0) {
              targetHits++;
            }
            const experimentalPct = Math.round((targetHits / totalTrials) * 100);

            if (statTrials) statTrials.textContent = `TRIALS: ${totalTrials}`;
            if (statRate) statRate.textContent = `P(▲): ${experimentalPct}% (Theor: 16.7%)`;

            btn.disabled = false;
            Sound.playDiscoveryChime();
          }
        }, 60);
      });
    }

    initFractionExperiment() {
      const slider = document.getElementById('fraction-slider');
      const svg = document.getElementById('fraction-svg');
      const buttons = document.querySelectorAll('.fraction-btn');
      const fractionLabel = document.getElementById('fraction-label');
      const decimalLabel = document.getElementById('fraction-decimal');
      if (!slider || !svg) return;

      const renderFraction = (numerator, denominator = 4) => {
        if (fractionLabel) fractionLabel.textContent = `${numerator}/${denominator}`;
        if (decimalLabel) decimalLabel.textContent = `(${(numerator / denominator).toFixed(2)} / ${(numerator / denominator * 100).toFixed(0)}%)`;

        const cx = 85;
        const cy = 85;
        const r = 72;
        const totalSlices = denominator;
        const anglePerSlice = (2 * Math.PI) / totalSlices;

        let paths = '';
        for (let i = 0; i < totalSlices; i++) {
          const startAngle = i * anglePerSlice - Math.PI / 2;
          const endAngle = (i + 1) * anglePerSlice - Math.PI / 2;

          const x1 = cx + r * Math.cos(startAngle);
          const y1 = cy + r * Math.sin(startAngle);
          const x2 = cx + r * Math.cos(endAngle);
          const y2 = cy + r * Math.sin(endAngle);

          const isFilled = i < numerator;
          const fillColor = isFilled ? '#2563EB' : 'rgba(37, 99, 235, 0.04)';
          const strokeColor = isFilled ? '#14B8A6' : 'rgba(37, 99, 235, 0.15)';

          paths += `
            <path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z" 
                  fill="${fillColor}" 
                  stroke="${strokeColor}" 
                  stroke-width="1.6" 
                  style="transition: fill 0.3s ease;" />
          `;
        }

        svg.innerHTML = `
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#2563EB" stroke-opacity="0.15" stroke-width="1" />
          ${paths}
          <circle cx="${cx}" cy="${cy}" r="16" fill="var(--bg-primary)" stroke="#14B8A6" stroke-width="2" />
          <circle cx="${cx}" cy="${cy}" r="4.5" fill="#F5C542" />
        `;

        buttons.forEach(btn => {
          const val = parseInt(btn.getAttribute('data-val'), 10);
          btn.classList.toggle('active', val === numerator);
        });
      };

      slider.addEventListener('input', (e) => {
        Sound.playSliderTick();
        renderFraction(parseInt(e.target.value, 10), 4);
      });

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          Sound.playObjectChange();
          const val = parseInt(btn.getAttribute('data-val'), 10);
          slider.value = val;
          renderFraction(val, 4);
        });
      });

      renderFraction(parseInt(slider.value, 10), 4);
    }
  }

  /* ==================================================
     7. SCROLL & MOTION CONTROLLER
     ================================================== */
  class ScrollController {
    constructor() {
      this.lenis = null;
      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.initLenis();
      this.initScrollTriggers();
    }

    initLenis() {
      if (this.isReducedMotion || typeof Lenis === 'undefined') return;

      this.lenis = new Lenis({
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        infinite: false,
      });

      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        this.lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
          this.lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      }
    }

    initScrollTriggers() {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      if (this.isReducedMotion) {
        document.querySelectorAll('.reality-card, .learn-card, .fact-moment, .what-you-get-item, .pricing-stage-card').forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
        return;
      }

      const isDesktop = window.innerWidth > 768;

      /* 02 — WHAT IS MATHEREALITY? */
      const whatIsSec = document.querySelector('.section-what-is');
      if (whatIsSec) {
        gsap.from('.what-is-headline', {
          y: 40,
          opacity: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: '.what-is-headline',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });

        gsap.from('.what-is-statement', {
          y: 30,
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: '.what-is-statement',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });

        document.querySelectorAll('.editorial-moment').forEach((moment) => {
          gsap.from(moment, {
            y: 50,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
              trigger: moment,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          });
        });
      }

      /* 03 — WHAT YOU GET */
      document.querySelectorAll('.what-you-get-item').forEach((item) => {
        const visual = item.querySelector('.what-you-get-visual-box');
        const text = item.querySelector('.what-you-get-text');

        gsap.from(visual, {
          scale: 0.92,
          opacity: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });

        gsap.from(text, {
          y: 40,
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });
      });

      /* 04 — DETAILS + PRICING */
      document.querySelectorAll('.pricing-stage-card').forEach((card) => {
        gsap.from(card, {
          y: 60,
          opacity: 0.3,
          scale: 0.96,
          duration: 1,
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            end: 'bottom 50%',
            toggleActions: 'play none none reverse'
          }
        });
      });

      /* 05 — THE QUESTION */
      const qSec = document.querySelector('.section-the-question');
      if (qSec) {
        ScrollTrigger.create({
          trigger: qSec,
          start: 'top 70%',
          onEnter: () => Sound.playSectionTransition()
        });

        gsap.from('.question-line-1', {
          opacity: 0,
          y: 30,
          duration: 1.2,
          scrollTrigger: {
            trigger: qSec,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        });

        gsap.from('.question-line-2', {
          opacity: 0,
          y: 40,
          duration: 1.4,
          delay: 0.3,
          scrollTrigger: {
            trigger: '.question-line-2',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });
      }

      /* 06 — MATH IN THE REAL WORLD (Horizontal Scroll) */
      const realitySec = document.querySelector('.section-reality');
      const realityTrack = document.querySelector('.reality-horizontal-track');
      if (realitySec && realityTrack && isDesktop) {
        gsap.to(realityTrack, {
          x: () => -(realityTrack.scrollWidth - window.innerWidth + 140),
          ease: 'none',
          scrollTrigger: {
            trigger: realitySec,
            start: 'top top',
            end: () => `+=${realityTrack.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });
      }

      /* 07 — TRANSFORMATION (Pinned Sequence) */
      const transformSec = document.querySelector('.section-transformation');
      if (transformSec) {
        const tTl = gsap.timeline({
          scrollTrigger: {
            trigger: transformSec,
            start: 'top top',
            end: '+=240%',
            pin: true,
            scrub: 0.8,
            onEnter: () => Sound.playSectionTransition()
          }
        });

        const tText = document.querySelector('.transformation-stage-text');
        const tWheel = document.querySelector('#t-wheel');
        const tPlanet = document.querySelector('#t-planet');
        const tPattern = document.querySelector('#t-pattern');
        const tFinal = document.querySelector('.transformation-final-text');

        // Circle -> Wheel
        tTl.to(tWheel, { 
              opacity: 1, 
              duration: 1,
              onStart: () => Sound.playObjectChange()
            })
           .call(() => { if (tText) tText.textContent = 'Wheel'; })

        // Wheel -> Planet Orbit
           .to(tWheel, { opacity: 0, duration: 0.8 })
           .to(tPlanet, { 
              opacity: 1, 
              duration: 1.2,
              onStart: () => Sound.playObjectChange()
            })
           .call(() => { if (tText) tText.textContent = 'Keplerian Orbit'; })

        // Planet -> Universal Geometry
           .to(tPlanet, { opacity: 0, duration: 0.8 })
           .to(tPattern, { 
              opacity: 1, 
              duration: 1,
              onStart: () => Sound.playObjectChange()
            })
           .call(() => { if (tText) tText.textContent = 'Universal Geometry'; })

        // Final Reveal
           .to(tPattern, { opacity: 0.15, duration: 1 })
           .to(tFinal, { opacity: 1, y: 0, duration: 1.2 });
      }

      /* 11 — ONE CONCEPT: WHY DOES A CIRCLE LOOK LIKE THIS? */
      const conceptSec = document.querySelector('.section-one-concept') || document.querySelector('.section-concept');
      if (conceptSec) {
        const cTl = gsap.timeline({
          scrollTrigger: {
            trigger: conceptSec,
            start: 'top top',
            end: '+=250%',
            pin: true,
            scrub: 0.8,
            onEnter: () => Sound.playSectionTransition()
          }
        });

        const cCirc = document.querySelector('#c-circumference');
        const cDiam = document.querySelector('#c-diameter');
        const cRad = document.querySelector('#c-radius');
        const cRadTip = document.querySelector('#c-radius-tip');
        const cPi = document.querySelector('#c-pi-label');
        const lRad = document.querySelector('#label-radius');
        const lDiam = document.querySelector('#label-diameter');
        const lCirc = document.querySelector('#label-circumference');

        cTl.fromTo(cCirc, { strokeDashoffset: 1005 }, { strokeDashoffset: 0, duration: 1.5 })
           .to(lCirc, { opacity: 1, duration: 0.5 })
           .to(cDiam, { opacity: 1, duration: 0.8 })
           .to(lDiam, { opacity: 1, duration: 0.5 })
           .to(cRad, { opacity: 1, duration: 0.8 })
           .to(cRadTip, { opacity: 1, duration: 0.4 })
           .to(lRad, { opacity: 1, duration: 0.5 })
           .to(cPi, { opacity: 1, scale: 1.05, duration: 1 });
      }

      /* 13 — MATH AROUND YOU */
      const aroundSec = document.querySelector('.section-math-around') || document.querySelector('.section-around');
      if (aroundSec) {
        gsap.to('#env-math-overlays', {
          opacity: 1,
          duration: 1.4,
          scrollTrigger: {
            trigger: aroundSec,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          }
        });
      }

      /* 10 — MATH, BUT DIFFERENT (Word-by-word reveal) */
      const diffWords = document.querySelectorAll('.different-word');
      if (diffWords.length > 0) {
        diffWords.forEach((word) => {
          gsap.to(word, {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: word,
              start: 'top 80%',
              end: 'bottom 60%',
              toggleActions: 'play none none reverse',
              onEnter: () => word.classList.add('active'),
              onLeaveBack: () => word.classList.remove('active')
            }
          });
        });

        gsap.to('.math-different-final', {
          opacity: 1,
          y: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: '.math-different-final',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
      }

      /* 11 — LEARN CARDS */
      document.querySelectorAll('.learn-card').forEach((card, idx) => {
        gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          delay: idx * 0.1,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
      });

      /* 12 — DISCOVER / SURPRISE */
      const surpriseBox = document.querySelector('.surprise-interactive-box');
      if (surpriseBox) {
        gsap.from(surpriseBox, {
          scale: 0.95,
          opacity: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: surpriseBox,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });
      }

      /* 17 — THE JOURNEY (Horizontal Scroll + Traveling Discovery Point) */
      const journeySec = document.querySelector('.section-journey');
      const journeyTrack = document.querySelector('.journey-track');
      const travelPoint = document.querySelector('.journey-traveling-point');
      if (journeySec && journeyTrack && isDesktop) {
        const jDistance = journeyTrack.scrollWidth - window.innerWidth + 140;

        const jTl = gsap.timeline({
          scrollTrigger: {
            trigger: journeySec,
            start: 'top top',
            end: () => `+=${jDistance}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });

        jTl.to(journeyTrack, {
          x: -jDistance,
          ease: 'none'
        }, 0);

        if (travelPoint) {
          jTl.to(travelPoint, {
            x: window.innerWidth * 0.75,
            ease: 'none'
          }, 0);
        }
      }

      /* 19 — FINAL EXPERIENCE (Pinned sequence) */
      const finalSec = document.querySelector('.section-final-experience');
      if (finalSec) {
        const fTl = gsap.timeline({
          scrollTrigger: {
            trigger: finalSec,
            start: 'top top',
            end: '+=250%',
            pin: true,
            scrub: 0.8,
            onEnter: () => Sound.playSectionTransition()
          }
        });

        const fPoint = document.querySelector('#f-point');
        const fLine = document.querySelector('#f-line');
        const fShape = document.querySelector('#f-shape');
        const fObject = document.querySelector('#f-object');
        const fWorld = document.querySelector('#f-world');
        const fText = document.querySelector('.final-sequence-text');

        fTl.to(fPoint, { scale: 1.5, duration: 0.8 })
           .call(() => { if (fText) fText.textContent = 'POINT'; })
           .to(fLine, { opacity: 1, duration: 1 })
           .call(() => { if (fText) fText.textContent = 'LINE'; })
           .to(fShape, { opacity: 1, duration: 1 })
           .call(() => { if (fText) fText.textContent = 'SHAPE'; })
           .to(fObject, { opacity: 1, duration: 1 })
           .call(() => { if (fText) fText.textContent = 'OBJECT'; })
           .to(fWorld, { opacity: 1, duration: 1.2 })
           .call(() => { if (fText) fText.textContent = 'WORLD'; });
      }
    }
  }

  /* ==================================================
     8. MATHEREALITY APPLICATION MASTER CONTROLLER
     ================================================== */
  class MatheRealityApp {
    constructor() {
      // 1. Initialize Sound Toggle
      this.initSoundToggle();

      // 2. Initialize Theme Controller
      this.theme = new ThemeController();

      // 3. Initialize Hero Motion Controller
      this.hero = new HeroMotionController();

      // 4. Initialize Mathematical SVG Visuals
      MathVisuals.initEditorialMoments();
      MathVisuals.initWhatYouGetVisuals();
      MathVisuals.initPricingVisuals();

      const transformSvg = document.getElementById('transformation-svg') || document.querySelector('.transform-svg-stage');
      if (transformSvg) MathVisuals.initTransformationVisual(transformSvg);

      const conceptSvg = document.getElementById('concept-svg') || document.querySelector('.concept-svg-circle');
      if (conceptSvg) MathVisuals.initConceptVisual(conceptSvg);

      const aroundSvg = document.getElementById('around-svg') || document.querySelector('.math-around-svg');
      if (aroundSvg) MathVisuals.initMathAroundVisual(aroundSvg);

      const finalSvg = document.getElementById('final-svg') || document.querySelector('.final-svg-element');
      if (finalSvg) MathVisuals.initFinalVisual(finalSvg);

      // 5. Initialize Section 14 Coordinate Grid Canvas
      const gridCanvas = document.getElementById('big-grid-canvas');
      const gridHud = document.getElementById('big-grid-hud');
      if (gridCanvas) {
        this.grid = new BigInteractiveGrid(gridCanvas, gridHud);
      }

      // 6. Initialize Interactive Math Experiments
      this.experiments = new MathExperiments();

      // 7. Initialize Smooth Scroll & Apple-style animations
      this.scroll = new ScrollController();

      // 8. Navigation & Header
      this.initHeader();

      // 9. Custom Cursor
      this.initCustomCursor();

      // 10. Magnetic Button Physics & Sound Feedback
      this.initMagneticButtons();
    }

    initSoundToggle() {
      const btn = document.getElementById('sound-toggle-btn');
      const dot = document.getElementById('sound-dot');
      const label = document.getElementById('sound-label');
      if (!btn) return;

      const updateUI = (enabled) => {
        if (dot) dot.classList.toggle('muted', !enabled);
        if (label) label.textContent = enabled ? 'SOUND ON' : 'SOUND OFF';
      };

      updateUI(Sound.isSoundEnabled());

      btn.addEventListener('click', async () => {
        const isEnabled = await Sound.toggleSound();
        updateUI(isEnabled);
      });
    }

    initHeader() {
      const header = document.querySelector('.site-header');
      if (!header) return;

      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }, { passive: true });

      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          Sound.playButtonClick();
          const targetId = anchor.getAttribute('href');
          if (targetId === '#') return;
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            if (this.scroll && this.scroll.lenis) {
              this.scroll.lenis.scrollTo(targetEl, { offset: -60, duration: 1.4 });
            } else {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          }
        });

        anchor.addEventListener('mouseenter', () => {
          Sound.playNavHover();
        });
      });
    }

    initMagneticButtons() {
      if (window.innerWidth < 1024) return;

      const buttons = document.querySelectorAll('button, .btn, .nav-link, a.btn, .fraction-btn, .btn-try-again, .pricing-select-btn, .theme-toggle-btn, .sound-toggle-btn');
      buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          btn.style.transform = `translate3d(${x * 0.15}px, ${y * 0.15}px, 0px) scale(1.02)`;
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.transform = 'translate3d(0px, 0px, 0px) scale(1)';
        });

        btn.addEventListener('mousedown', () => {
          btn.style.transform = 'translate3d(0px, 0px, 0px) scale(0.97)';
          Sound.playButtonClick();
        });

        btn.addEventListener('mouseup', () => {
          btn.style.transform = 'translate3d(0px, 0px, 0px) scale(1.02)';
          Sound.playButtonRelease();
        });

        btn.addEventListener('mouseenter', () => {
          Sound.playNavHover();
        });
      });
    }

    initCustomCursor() {
      const cursor = document.querySelector('.custom-cursor');
      const follower = document.querySelector('.custom-cursor-follower');
      if (!cursor || !follower || window.innerWidth < 1024) return;

      let mouseX = -100;
      let mouseY = -100;
      let followerX = -100;
      let followerY = -100;

      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      });

      const loop = () => {
        followerX += (mouseX - followerX) * 0.18;
        followerY += (mouseY - followerY) * 0.18;
        follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
        requestAnimationFrame(loop);
      };
      loop();

      const hoverElements = document.querySelectorAll('button, a, input, .learn-card, .reality-card, .fact-moment, .audience-card, .prob-token, .pricing-stage-card');
      hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.classList.add('active');
          follower.classList.add('active');
          Sound.playNavHover();
        });
        el.addEventListener('mouseleave', () => {
          cursor.classList.remove('active');
          follower.classList.remove('active');
        });
      });
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.matheRealityApp = new MatheRealityApp();
    });
  } else {
    window.matheRealityApp = new MatheRealityApp();
  }
})();
