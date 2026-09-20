/**
 * MatheReality - UI Sound & Light Musical Background System
 * Lightweight, non-intrusive sound design using Web Audio API synthesis.
 * 
 * Musical Direction:
 * - Curious → Playful → Intelligent → Calming → Discovery
 * - Light, modern, beautiful musical composition (NOT a monotonous drone)
 * - Instruments: Soft felt piano, delicate marimba/kalimba, airy flute, light bell chimes, soft atmospheric pad
 * - Gentle rhythmic movement (~76 BPM) with memorable, simple musical motif
 * - Seamless loop with subtle variation
 * - Zero autoplay on page load (activates only after user toggles ON and interacts)
 * - User-controlled Sound ON / OFF toggle persisted in localStorage
 * - Soft tactile sound effects for meaningful interactions
 */

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
    this.tempo = 76; // BPM (Curious, gentle, intelligent pace)
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

  /**
   * ==================================================
   * LIGHT, BEAUTIFUL MUSICAL BGM ENGINE
   * Procedural composition in D Major / Lydian (76 BPM)
   * Felt Piano + Delicate Kalimba/Marimba + Airy Flute + Soft Pad + Light Bells
   * ==================================================
   */

  async startAmbientBGM() {
    if (!this.enabled || this.bgmPlaying) return;
    await this.ensureAudioContext();
    if (!this.ctx || this.ctx.state !== 'running' || !this.enabled || this.bgmPlaying) return;

    try {
      const now = this.ctx.currentTime;
      this.bgmMasterGain = this.ctx.createGain();
      this.bgmMasterGain.gain.setValueAtTime(0.0001, now);
      // Gentle fade-in over 2.5 seconds to a whisper-quiet, immersive level (0.026)
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

    // Lookahead scheduling: schedule up to 0.45s into the future
    const scheduleAheadTime = 0.45;
    while (this.nextStepTime < currentTime + scheduleAheadTime) {
      this.playCompositionStep(this.currentStep, this.nextStepTime);
      this.nextStepTime += this.stepDuration;
      this.currentStep = (this.currentStep + 1) % 128; // 8 bars = 128 sixteenth steps
      if (this.currentStep === 0) {
        this.cycleCount++;
      }
    }

    this.bgmTimer = setTimeout(() => this.scheduleLoop(), 120);
  }

  /**
   * 8-Bar Composition Architecture:
   * Bar 1: Dmaj9  (Steps 0-15)   - Curious, luminous opening
   * Bar 2: Gmaj7  (Steps 16-31)  - Playful, expansive
   * Bar 3: Bm9    (Steps 32-47)  - Intelligent, focused
   * Bar 4: Aadd9  (Steps 48-63)  - Calming resolution
   * Bar 5: Dmaj9  (Steps 64-79)  - Discovery motif (high flute + bell)
   * Bar 6: Em9    (Steps 80-95)  - Stepping forward
   * Bar 7: Gmaj7  (Steps 96-111) - Harmonic expansion
   * Bar 8: Asus4  (Steps 112-127)- Gentle breath back to Bar 1
   */
  playCompositionStep(step, time) {
    if (!this.bgmMasterGain) return;

    // Frequencies (Hz)
    const D3 = 146.83, Fs3 = 185.00, G3 = 196.00, A3 = 220.00, B3 = 246.94;
    const Cs4 = 277.18, D4 = 293.66, E4 = 329.63, Fs4 = 369.99, G4 = 392.00, A4 = 440.00, B4 = 493.88;
    const Cs5 = 554.37, D5 = 587.33, E5 = 659.25, Fs5 = 739.99, A5 = 880.00;
    const D6 = 1174.66;

    // 1. SOFT ATMOSPHERIC CHORD PADS (every bar = 16 steps)
    if (step % 16 === 0) {
      const bar = Math.floor(step / 16);
      let chord;
      switch (bar) {
        case 0: chord = [D3, A3, Cs4, Fs4]; break;      // Dmaj9
        case 1: chord = [G3, D4, Fs4, B4]; break;       // Gmaj7
        case 2: chord = [B3, Fs4, A4, Cs5]; break;      // Bm9
        case 3: chord = [A3, E4, A4, Cs5]; break;       // Aadd9
        case 4: chord = [D3, A3, E4, Fs4]; break;       // Dmaj9
        case 5: chord = [G3, B3, E4, G4]; break;        // Em9
        case 6: chord = [G3, D4, Fs4, A4]; break;       // Gmaj7
        case 7: chord = [A3, D4, E4, A4]; break;        // Asus4
      }
      this.playSynthPad(chord, time, this.stepDuration * 15.5);
    }

    // 2. GENTLE FELT PULSE (Low acoustic heartbeat on beat 1 of each bar)
    if (step % 16 === 0) {
      this.playFeltPulse(time);
    }

    // 3. SOFT FELT PIANO MOTIF (Memorable, curious, intelligent)
    const pianoNotes = {
      // Bar 1: Dmaj9
      0:  { freq: Fs4, dur: 3, vel: 0.75 },
      6:  { freq: A4,  dur: 2, vel: 0.65 },
      10: { freq: Cs5, dur: 2, vel: 0.70 },
      12: { freq: E5,  dur: 4, vel: 0.82 },

      // Bar 2: Gmaj7
      16: { freq: D5,  dur: 3, vel: 0.75 },
      22: { freq: B4,  dur: 2, vel: 0.60 },
      26: { freq: Fs5, dur: 4, vel: 0.85 },

      // Bar 3: Bm9
      32: { freq: Cs5, dur: 3, vel: 0.72 },
      38: { freq: A4,  dur: 2, vel: 0.62 },
      42: { freq: Fs4, dur: 2, vel: 0.68 },
      44: { freq: D5,  dur: 4, vel: 0.78 },

      // Bar 4: Aadd9
      48: { freq: E5,  dur: 3, vel: 0.75 },
      54: { freq: Cs5, dur: 3, vel: 0.65 },
      60: { freq: A4,  dur: 4, vel: 0.70 },

      // Bar 5: Discovery (High motif arc)
      64: { freq: Fs5, dur: 3, vel: 0.85 },
      70: { freq: E5,  dur: 2, vel: 0.70 },
      74: { freq: D5,  dur: 2, vel: 0.72 },
      76: { freq: A4,  dur: 4, vel: 0.75 },

      // Bar 6: Em9
      80: { freq: B4,  dur: 3, vel: 0.70 },
      86: { freq: G4,  dur: 2, vel: 0.60 },
      90: { freq: E5,  dur: 4, vel: 0.78 },

      // Bar 7: Gmaj7
      96:  { freq: Fs5, dur: 3, vel: 0.82 },
      102: { freq: D5,  dur: 2, vel: 0.68 },
      106: { freq: B4,  dur: 4, vel: 0.70 },

      // Bar 8: Asus4 -> A (Soft resolution)
      112: { freq: E5,  dur: 3, vel: 0.72 },
      118: { freq: Cs5, dur: 3, vel: 0.65 },
      122: { freq: A4,  dur: 2, vel: 0.60 },
      124: { freq: Fs4, dur: 4, vel: 0.65 }
    };

    if (pianoNotes[step]) {
      const p = pianoNotes[step];
      this.playFeltPiano(p.freq, time, p.dur * this.stepDuration, p.vel);
    }

    // 4. DELICATE KALIMBA / MARIMBA (Playful mathematical droplets)
    // Plays light syncopated arpeggio notes on off-beats
    const kalimbaNotes = {
      // Bar 1 & 2
      4:  A4, 8: Fs4, 14: D5,
      20: G4, 24: D5, 28: B4,
      // Bar 3 & 4
      36: Fs4, 40: Cs5, 46: A4,
      52: E4, 56: A4, 62: Cs5,
      // Bar 5 & 6 (Discovery playful cascade)
      66: D5, 68: Fs5, 72: A4, 78: E5,
      82: G4, 84: B4, 88: D5, 94: G4,
      // Bar 7 & 8
      100: Fs4, 104: A4, 108: D5,
      114: E4, 116: A4, 120: Cs5, 126: Fs4
    };

    if (kalimbaNotes[step]) {
      // Vary velocity subtly for an organic acoustic feel
      const vel = 0.45 + (step % 3) * 0.08;
      this.playKalimba(kalimbaNotes[step], time, vel);
    }

    // 5. AIRY FLUTE (Atmospheric curiosity & breath of discovery in Bars 5 & 7)
    if (step === 64) {
      this.playAiryFlute(A5, time, this.stepDuration * 8, 0.55);
    } else if (step === 96) {
      this.playAiryFlute(Fs5, time, this.stepDuration * 8, 0.50);
    }

    // 6. LIGHT BELL CHIMES (Pristine mathematical focal accents)
    if (step === 12 || step === 76) {
      this.playBellChime(D6, time, 0.4);
    } else if (step === 44 || step === 108) {
      this.playBellChime(A5, time, 0.35);
    }
  }

  /**
   * Instrument 1: Soft Felt Piano
   * Dual detuned sine/triangle with velocity-sensitive lowpass warmth.
   */
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

      // Warm low-pass filter (felt damping)
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700 + velocity * 500, time);
      filter.Q.setValueAtTime(1.1, time);

      // Dynamic envelope: soft attack, natural exponential decay
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

  /**
   * Instrument 2: Delicate Marimba / Kalimba
   * Additive synthesis with characteristic metallic/wooden partial (ratio 2.76)
   */
  playKalimba(freq, time, velocity = 0.5) {
    if (!this.ctx || !this.bgmMasterGain) return;
    try {
      const oscFundamental = this.ctx.createOscillator();
      const oscOvertone = this.ctx.createOscillator();
      const gainF = this.ctx.createGain();
      const gainO = this.ctx.createGain();

      oscFundamental.type = 'sine';
      oscFundamental.frequency.setValueAtTime(freq, time);

      // 2.76x overtone (pure physical resonance of a kalimba tine)
      oscOvertone.type = 'sine';
      oscOvertone.frequency.setValueAtTime(freq * 2.76, time);

      const peakF = 0.38 * velocity;
      gainF.gain.setValueAtTime(0.0001, time);
      gainF.gain.linearRampToValueAtTime(peakF, time + 0.006);
      gainF.gain.exponentialRampToValueAtTime(0.0001, time + 0.42);

      // Overtone decays much faster (tactile acoustic pluck)
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

  /**
   * Instrument 3: Soft Atmospheric Pad
   * Gentle, breathing chord bed that provides continuous warmth.
   */
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

        // Slow swelling envelope (breathing chord)
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

  /**
   * Instrument 4: Airy Flute
   * Sine wave with 5Hz vibrato and soft, breathy attack.
   */
  playAiryFlute(freq, time, duration, velocity = 0.5) {
    if (!this.ctx || !this.bgmMasterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      // Subtle vibrato (5Hz, ±3.5 cents)
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(5, time);
      lfoGain.gain.setValueAtTime(3.5, time);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(time);
      lfo.stop(time + duration + 0.5);

      const peak = 0.22 * velocity;
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(peak, time + 0.15); // soft airy swell
      gain.gain.setValueAtTime(peak * 0.8, time + duration - 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration + 0.4);

      osc.connect(gain);
      gain.connect(this.bgmMasterGain);

      osc.start(time);
      osc.stop(time + duration + 0.5);
    } catch (e) {}
  }

  /**
   * Instrument 5: Light Bell Chimes
   * Pure high sine wave with long, crystalline decay.
   */
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

  /**
   * Gentle Felt Pulse (Subtle acoustic weight on beat 1)
   */
  playFeltPulse(time) {
    if (!this.ctx || !this.bgmMasterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(73.42, time); // D2
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

  /**
   * ==================================================
   * SOUND EFFECTS (INTERACTIONS & FEEDBACK)
   * ==================================================
   */

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

export const Sound = new SoundController();
