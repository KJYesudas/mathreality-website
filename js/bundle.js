/**
 * MatheReality - Standalone Production Bundle
 * Complete 21-section cinematic interactive experience.
 * Features:
 * - Fullscreen Hero video with single minimal welcome headline ("Welcome to MatheReality.")
 * - Cursor-based 3D video floating with spring inertia (stable welcome text)
 * - 3-Color Educational Palette: Deep Blue (#2563EB), Soft Teal (#14B8A6), Warm Yellow (#F5C542) on neutral backgrounds
 * - Animated Dark Mode / Light Mode theme system
 * - Web Audio API procedural sound engine with dedicated acoustic types & nav sound toggle
 * - Magnetic button physics (hover scale 1.02, tap scale 0.97) and tactile sound effects
 * - Mathematical SVG visuals and interactive experiments following the 3-color visual language
 * - Zero CORS, works via file:/// and HTTP protocols natively.
 */

(function() {
  'use strict';

  /* ==================================================
     1. UI SOUND EFFECT SYSTEM (Web Audio API Synthesizer)
     - Zero autoplay on page load
     - Activated only on user interaction
     - Extremely subtle volume (~0.015 to 0.045)
     - Tactile, non-game-like sound design
     ================================================== */
  class SoundController {
    constructor() {
      this.ctx = null;
      this.enabled = localStorage.getItem('mathereality_sound') === 'true';
      this.unlocked = false;
      this.lastTickTime = 0;

      this.initUnlockListener();
    }

    initUnlockListener() {
      const unlock = () => {
        if (!this.ctx) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) this.ctx = new AudioCtx();
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

    /* 1. Navigation / Button Hover: Very soft high-frequency UI tick */
    playNavHover() {
      if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1100, now);
        osc.frequency.exponentialRampToValueAtTime(850, now + 0.022);

        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.025);
      } catch (e) {}
    }

    /* 2. Button / Navigation Click: Short tactile click */
    playNavClick() {
      if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(240, now + 0.035);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);
      } catch (e) {}
    }

    /* 3. Button Release: Soft confirmation tick */
    playButtonRelease() {
      if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(360, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.02);

        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.025);
      } catch (e) {}
    }

    /* 4. Theme Toggle: Soft tonal transition (harmonic dual-sine chord) */
    playThemeToggle() {
      if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
      try {
        const now = this.ctx.currentTime;
        [523.25, 783.99].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);

          gain.gain.setValueAtTime(0.035, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.12);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.13);
        });
      } catch (e) {}
    }

    /* 5. Slider Tick: Tiny digital/educational tick (rate-limited) */
    playSliderTick() {
      if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
      const nowMs = performance.now();
      if (nowMs - this.lastTickTime < 45) return;
      this.lastTickTime = nowMs;

      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.015);

        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.02);
      } catch (e) {}
    }

    /* 6. Interactive Experiment Control Click */
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

    /* 7. Interactive Math Dragging / Micro Digital Tick */
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

    /* 8. Major Discovery / Aha Moment: Very subtle soft harmonic chime */
    playDiscoveryChime() {
      if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
      try {
        const now = this.ctx.currentTime;
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
          // Moon Icon
          this.iconEl.innerHTML = `
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          `;
          this.toggleBtn?.setAttribute('aria-label', 'Switch to Light Mode');
        } else {
          // Sun Icon
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
     - Fullscreen Hero video responds subtly to cursor position
     - Cursor floating applied to video frame ONLY (stable text)
     - Welcome headline ("Welcome to MatheReality.") entrance animation & scroll fade
     ================================================== */
  class HeroMotionController {
    constructor() {
      this.heroSec = document.querySelector('.hero-section');
      this.videoFrame = document.querySelector('.hero-video-frame');
      this.welcomeText = document.querySelector('.hero-welcome-text');
      if (!this.heroSec || !this.videoFrame) return;

      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      this.initWelcomeAnimation();

      if (this.isReducedMotion) return;

      // Target values based on cursor
      this.target = { tx: 0, ty: 0, rx: 0, ry: 0 };
      // Current values with spring inertia
      this.current = { tx: 0, ty: 0, rx: 0, ry: 0 };

      // Spring damping constants
      this.damping = 0.065;

      this.initCursorTracking();
      this.initScrollMotion();
      this.render();
    }

    initWelcomeAnimation() {
      if (!this.welcomeText) return;

      if (typeof gsap !== 'undefined') {
        gsap.fromTo(this.welcomeText, 
          { opacity: 0, y: 12, scale: 0.98 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 1.4, 
            delay: 0.3, 
            ease: 'power2.out' 
          }
        );
      } else {
        setTimeout(() => {
          this.welcomeText.classList.add('is-visible');
        }, 300);
      }
    }

    initCursorTracking() {
      if (window.innerWidth < 1024) return; // Desktop showcase only

      window.addEventListener('mousemove', (e) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;

        // Subtle, expensive values applied to video only
        this.target.tx = nx * 8;       // -8px to +8px
        this.target.ty = ny * 6;       // -6px to +6px
        this.target.ry = nx * 1.2;     // -1.2deg to +1.2deg
        this.target.rx = -ny * 1.0;    // -1deg to +1deg
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

      // Cinematic camera pull-back on scroll for video
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

      // Welcome headline scroll fade-out
      if (this.welcomeText) {
        gsap.to(this.welcomeText, {
          opacity: 0,
          y: -40,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: this.heroSec,
            start: 'top top',
            end: '45% top',
            scrub: 1
          }
        });
      }
    }

    render() {
      // Lerp with spring physics
      this.current.tx += (this.target.tx - this.current.tx) * this.damping;
      this.current.ty += (this.target.ty - this.current.ty) * this.damping;
      this.current.rx += (this.target.rx - this.current.rx) * this.damping;
      this.current.ry += (this.target.ry - this.current.ry) * this.damping;

      // Apply 3D floating transformation to video frame only
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
     4. MATHEMATICAL SVG VISUALS
     3-Color Visual Language:
     - Blue (#2563EB): Knowledge, primary geometry, circle outline
     - Teal (#14B8A6): Discovery, orbits, transformations, waves
     - Yellow (#F5C542): Curiosity, discovery points, highlighted values
     ================================================== */
  const MathVisuals = {
    initEditorialMoments() {
      const v1 = document.getElementById('vis-explanation-svg');
      if (v1) {
        v1.innerHTML = `
          <polygon points="40,140 160,140 160,20" fill="none" stroke="#2563EB" stroke-width="2" />
          <rect x="40" y="140" width="120" height="40" fill="rgba(37, 99, 235, 0.08)" stroke="#121214" stroke-opacity="0.2" />
          <rect x="160" y="20" width="40" height="120" fill="rgba(20, 184, 166, 0.08)" stroke="#121214" stroke-opacity="0.2" />
          <line x1="40" y1="140" x2="160" y2="20" stroke="#14B8A6" stroke-width="2.5" />
          <circle cx="160" cy="20" r="4" fill="#F5C542" />
          <text x="75" y="70" font-family="'JetBrains Mono', monospace" font-size="11" fill="#2563EB">a² + b² = c²</text>
        `;
      }

      const v2 = document.getElementById('vis-interactive-svg');
      if (v2) {
        v2.innerHTML = `
          <circle cx="100" cy="80" r="50" fill="none" stroke="#121214" stroke-opacity="0.15" stroke-dasharray="4 4" />
          <circle cx="65" cy="45" r="5" fill="#2563EB" />
          <circle cx="135" cy="115" r="5" fill="#14B8A6" />
          <line x1="65" y1="45" x2="135" y2="115" stroke="#2563EB" stroke-width="2" />
          <path d="M 65 45 Q 100 20 135 115" fill="none" stroke="#14B8A6" stroke-width="1.5" stroke-dasharray="3 3" />
          <circle cx="100" cy="45" r="4" fill="#F5C542" />
          <text x="100" y="150" font-family="'JetBrains Mono', monospace" font-size="10" fill="#585860" text-anchor="middle">Δx, Δy → f'(x)</text>
        `;
      }

      const v3 = document.getElementById('vis-realworld-svg');
      if (v3) {
        v3.innerHTML = `
          <polygon points="20,130 180,130 100,30" fill="none" stroke="#2563EB" stroke-width="2" />
          <line x1="60" y1="80" x2="140" y2="80" stroke="#121214" stroke-opacity="0.3" />
          <line x1="100" y1="30" x2="100" y2="130" stroke="#14B8A6" stroke-dasharray="4 4" />
          <circle cx="100" cy="30" r="4" fill="#F5C542" />
          <text x="100" y="150" font-family="'JetBrains Mono', monospace" font-size="10" fill="#585860" text-anchor="middle">TRUSS LOAD = 0</text>
        `;
      }

      const v4 = document.getElementById('vis-experiments-svg');
      if (v4) {
        v4.innerHTML = `
          <path d="M 20 80 Q 60 20 100 80 T 180 80" fill="none" stroke="#2563EB" stroke-width="2.5" />
          <path d="M 20 80 Q 60 140 100 80 T 180 80" fill="none" stroke="#14B8A6" stroke-width="1.5" stroke-opacity="0.8" />
          <line x1="20" y1="80" x2="180" y2="80" stroke="#121214" stroke-opacity="0.1" />
          <circle cx="100" cy="80" r="4" fill="#F5C542" />
          <text x="100" y="150" font-family="'JetBrains Mono', monospace" font-size="10" fill="#585860" text-anchor="middle">y = A sin(ωt + φ)</text>
        `;
      }
    },

    initWhatYouGetVisuals() {
      const w1 = document.getElementById('wyg-vis-1');
      if (w1) {
        w1.innerHTML = `
          <polygon points="150,40 240,105 205,210 95,210 60,105" fill="none" stroke="#2563EB" stroke-width="2" />
          <line x1="150" y1="40" x2="205" y2="210" stroke="#121214" stroke-opacity="0.25" />
          <line x1="150" y1="40" x2="95" y2="210" stroke="#121214" stroke-opacity="0.25" />
          <line x1="60" y1="105" x2="240" y2="105" stroke="#14B8A6" stroke-width="1.5" />
          <circle cx="150" cy="40" r="5" fill="#F5C542" />
          <circle cx="205" cy="210" r="4" fill="#2563EB" />
          <circle cx="95" cy="210" r="4" fill="#2563EB" />
        `;
      }

      const w2 = document.getElementById('wyg-vis-2');
      if (w2) {
        w2.innerHTML = `
          <ellipse cx="150" cy="130" rx="100" ry="50" transform="rotate(30 150 130)" fill="none" stroke="#2563EB" stroke-width="2" />
          <ellipse cx="150" cy="130" rx="100" ry="50" transform="rotate(-30 150 130)" fill="none" stroke="#14B8A6" stroke-width="2" stroke-opacity="0.7" />
          <circle cx="150" cy="130" r="5" fill="#2563EB" />
          <circle cx="210" cy="95" r="5" fill="#F5C542" />
        `;
      }

      const w3 = document.getElementById('wyg-vis-3');
      if (w3) {
        w3.innerHTML = `
          <circle cx="150" cy="130" r="50" fill="rgba(37, 99, 235, 0.06)" stroke="#121214" stroke-width="2" />
          <ellipse cx="150" cy="130" rx="110" ry="36" transform="rotate(-20 150 130)" fill="none" stroke="#14B8A6" stroke-width="2" stroke-dasharray="5 5" />
          <circle cx="230" cy="100" r="7" fill="#F5C542" />
        `;
      }

      const w4 = document.getElementById('wyg-vis-4');
      if (w4) {
        w4.innerHTML = `
          <rect x="70" y="50" width="160" height="160" fill="none" stroke="#121214" stroke-opacity="0.15" />
          <path d="M 70 210 A 160 160 0 0 1 230 50" fill="none" stroke="#2563EB" stroke-width="2.5" />
          <path d="M 230 50 A 100 100 0 0 1 130 150" fill="none" stroke="#14B8A6" stroke-width="2" />
          <circle cx="130" cy="150" r="5" fill="#F5C542" />
          <text x="150" y="240" font-family="'JetBrains Mono', monospace" font-size="12" fill="#F5C542" font-weight="600" text-anchor="middle">φ ≈ 1.6180339887...</text>
        `;
      }

      const w5 = document.getElementById('wyg-vis-5');
      if (w5) {
        w5.innerHTML = `
          <line x1="50" y1="130" x2="250" y2="130" stroke="#121214" stroke-opacity="0.1" />
          <line x1="150" y1="30" x2="150" y2="230" stroke="#121214" stroke-opacity="0.1" />
          <polygon points="150,60 210,170 90,170" fill="none" stroke="#2563EB" stroke-width="2" />
          <circle cx="150" cy="130" r="30" fill="rgba(20, 184, 166, 0.08)" stroke="#14B8A6" stroke-dasharray="3 3" />
          <circle cx="150" cy="60" r="5" fill="#F5C542" />
          <circle cx="210" cy="170" r="4" fill="#2563EB" />
          <circle cx="90" cy="170" r="4" fill="#2563EB" />
        `;
      }
    },

    initPricingVisuals() {
      const p1 = document.getElementById('price-vis-1');
      if (p1) {
        p1.innerHTML = `
          <polygon points="100,20 170,120 30,120" fill="rgba(37, 99, 235, 0.05)" stroke="#2563EB" stroke-width="2" />
          <circle cx="100" cy="85" r="32" fill="none" stroke="#14B8A6" stroke-opacity="0.6" stroke-dasharray="3 3" />
          <circle cx="100" cy="20" r="5" fill="#F5C542" />
        `;
      }

      const p2 = document.getElementById('price-vis-2');
      if (p2) {
        p2.innerHTML = `
          <polygon points="100,20 160,55 100,90 40,55" fill="rgba(37, 99, 235, 0.08)" stroke="#2563EB" stroke-width="2" />
          <polygon points="100,90 160,55 160,115 100,150" stroke="#14B8A6" stroke-opacity="0.7" fill="none" />
          <polygon points="100,90 40,55 40,115 100,150" stroke="#121214" stroke-opacity="0.6" fill="none" />
          <circle cx="100" cy="90" r="5" fill="#F5C542" />
        `;
      }

      const p3 = document.getElementById('price-vis-3');
      if (p3) {
        p3.innerHTML = `
          <circle cx="100" cy="85" r="60" fill="none" stroke="#2563EB" stroke-width="2" />
          <ellipse cx="100" cy="85" rx="80" ry="25" transform="rotate(30 100 85)" fill="none" stroke="#14B8A6" stroke-width="1.8" />
          <ellipse cx="100" cy="85" rx="80" ry="25" transform="rotate(-30 100 85)" fill="none" stroke="#14B8A6" stroke-width="1.8" />
          <circle cx="100" cy="85" r="16" fill="#F5C542" opacity="0.9" />
        `;
      }
    },

    initSeeMathVisual(svgEl) {
      if (!svgEl) return;
      svgEl.innerHTML = `
        <g id="sm-stage-group" transform="translate(240, 240)">
          <!-- 1. CIRCLE (Blue outline) -->
          <circle id="sm-circle" r="130" fill="none" stroke="#2563EB" stroke-width="2.5" />

          <!-- 2. WHEEL (Blue rim + Teal spokes + Yellow hub) -->
          <g id="sm-wheel" opacity="0" stroke="#121214" stroke-width="1.5">
            <circle r="130" fill="none" stroke="#2563EB" stroke-width="3.5" />
            <circle r="32" fill="#FAF9F6" stroke="#14B8A6" stroke-width="2.5" />
            <line x1="0" y1="-130" x2="0" y2="130" stroke="#14B8A6" stroke-width="1.5" />
            <line x1="-130" y1="0" x2="130" y2="0" stroke="#14B8A6" stroke-width="1.5" />
            <line x1="-92" y1="-92" x2="92" y2="92" stroke="#14B8A6" stroke-width="1.5" />
            <line x1="-92" y1="92" x2="92" y2="-92" stroke="#14B8A6" stroke-width="1.5" />
            <circle r="6" fill="#F5C542" />
          </g>

          <!-- 3. PLANET / ORBIT (Blue planet + Teal orbit + Yellow point) -->
          <g id="sm-planet" opacity="0">
            <circle r="100" fill="rgba(37, 99, 235, 0.05)" stroke="#2563EB" stroke-width="2" />
            <ellipse cx="0" cy="0" rx="100" ry="30" fill="none" stroke="#121214" stroke-width="1" stroke-opacity="0.3" />
            <ellipse cx="0" cy="0" rx="160" ry="48" fill="none" stroke="#14B8A6" stroke-width="2" transform="rotate(-22)" />
            <circle cx="130" cy="-50" r="7" fill="#F5C542" />
          </g>

          <!-- 4. CAMERA LENS (Blue aperture blades + Teal inner + Yellow focus) -->
          <g id="sm-lens" opacity="0" stroke="#2563EB" stroke-width="1.8" fill="none">
            <circle r="130" stroke="#121214" stroke-width="3" stroke-opacity="0.4" />
            <path d="M 0 -130 L 90 -40" stroke="#2563EB" stroke-opacity="0.8" />
            <path d="M 90 -40 L 70 80" stroke="#2563EB" stroke-opacity="0.8" />
            <path d="M 70 80 L -70 80" stroke="#2563EB" stroke-opacity="0.8" />
            <path d="M -70 80 L -90 -40" stroke="#2563EB" stroke-opacity="0.8" />
            <path d="M -90 -40 L 0 -130" stroke="#2563EB" stroke-opacity="0.8" />
            <circle r="44" fill="rgba(20, 184, 166, 0.1)" stroke="#14B8A6" stroke-width="2" />
            <circle r="5" fill="#F5C542" />
          </g>

          <!-- 5. PATTERN (Rotated Teal/Blue ellipses + Yellow discovery center) -->
          <g id="sm-pattern" opacity="0" stroke="#2563EB" stroke-width="1.2" fill="none">
            <circle r="160" stroke="#121214" stroke-opacity="0.1" stroke-dasharray="5 5" />
            <ellipse rx="150" ry="80" transform="rotate(0)" stroke="#2563EB" stroke-opacity="0.7" />
            <ellipse rx="150" ry="80" transform="rotate(45)" stroke="#14B8A6" stroke-opacity="0.7" />
            <ellipse rx="150" ry="80" transform="rotate(90)" stroke="#2563EB" stroke-opacity="0.7" />
            <ellipse rx="150" ry="80" transform="rotate(135)" stroke="#14B8A6" stroke-opacity="0.7" />
            <circle r="7" fill="#F5C542" />
          </g>
        </g>
      `;
    },

    initTransformationVisual(svgEl) {
      if (!svgEl) return;
      svgEl.innerHTML = `
        <g id="t-stage-group" transform="translate(250, 250)">
          <circle id="t-circle" r="140" fill="none" stroke="#2563EB" stroke-width="2.5" />

          <g id="t-wheel" opacity="0" stroke="#121214" stroke-width="1.5">
            <circle r="140" fill="none" stroke="#2563EB" stroke-width="3.5" />
            <circle r="36" fill="#FAF9F6" stroke="#14B8A6" stroke-width="2.5" />
            <line x1="0" y1="-140" x2="0" y2="140" stroke="#14B8A6" stroke-width="1.5" />
            <line x1="-140" y1="0" x2="140" y2="0" stroke="#14B8A6" stroke-width="1.5" />
            <line x1="-99" y1="-99" x2="99" y2="99" stroke="#14B8A6" stroke-width="1.5" />
            <line x1="-99" y1="99" x2="99" y2="-99" stroke="#14B8A6" stroke-width="1.5" />
            <circle r="6" fill="#F5C542" />
          </g>

          <g id="t-planet" opacity="0">
            <circle r="110" fill="rgba(37, 99, 235, 0.05)" stroke="#2563EB" stroke-width="2" />
            <ellipse cx="0" cy="0" rx="110" ry="35" fill="none" stroke="#121214" stroke-width="1" stroke-opacity="0.3" />
            <ellipse cx="0" cy="0" rx="190" ry="55" fill="none" stroke="#14B8A6" stroke-width="2" transform="rotate(-20)" />
            <circle cx="160" cy="-60" r="8" fill="#F5C542" />
          </g>

          <g id="t-orbit" opacity="0" stroke="#2563EB" stroke-width="1.5" fill="none">
            <circle r="60" stroke="#121214" stroke-opacity="0.2" />
            <circle r="110" stroke="#2563EB" stroke-opacity="0.5" stroke-dasharray="6 6" />
            <circle r="160" stroke="#14B8A6" stroke-opacity="0.8" />
            <circle cx="110" cy="0" r="6" fill="#F5C542" />
            <circle cx="-113" cy="113" r="5" fill="#14B8A6" />
          </g>

          <g id="t-pattern" opacity="0" stroke="#2563EB" stroke-width="1.2" fill="none">
            <circle r="180" stroke="#121214" stroke-opacity="0.1" stroke-dasharray="5 5" />
            <ellipse rx="170" ry="90" transform="rotate(0)" stroke="#2563EB" stroke-opacity="0.7" />
            <ellipse rx="170" ry="90" transform="rotate(45)" stroke="#14B8A6" stroke-opacity="0.7" />
            <ellipse rx="170" ry="90" transform="rotate(90)" stroke="#2563EB" stroke-opacity="0.7" />
            <ellipse rx="170" ry="90" transform="rotate(135)" stroke="#14B8A6" stroke-opacity="0.7" />
            <circle r="7" fill="#F5C542" />
          </g>
        </g>
      `;
    },

    initConceptVisual(svgEl) {
      if (!svgEl) return;
      svgEl.innerHTML = `
        <g id="c-stage-group" transform="translate(260, 260)">
          <circle r="180" fill="none" stroke="#121214" stroke-opacity="0.05" stroke-dasharray="6 6" />
          <line x1="-220" y1="0" x2="220" y2="0" stroke="#121214" stroke-opacity="0.08" />
          <line x1="0" y1="-220" x2="0" y2="220" stroke="#121214" stroke-opacity="0.08" />

          <circle id="c-circumference" r="160" fill="none" stroke="#2563EB" stroke-width="3" stroke-dasharray="1005" stroke-dashoffset="0" />
          <line id="c-diameter" x1="-160" y1="0" x2="160" y2="0" stroke="#121214" stroke-width="2.5" opacity="0" />
          <line id="c-radius" x1="0" y1="0" x2="113" y2="-113" stroke="#14B8A6" stroke-width="3" opacity="0" />
          <circle id="c-radius-tip" cx="113" cy="-113" r="5" fill="#F5C542" opacity="0" />
          <circle id="c-center" cx="0" cy="0" r="5" fill="#2563EB" />

          <g id="c-pi-label" opacity="0" transform="translate(0, 0)">
            <rect x="-85" y="-30" width="170" height="60" rx="10" fill="rgba(255, 255, 255, 0.95)" stroke="#2563EB" stroke-width="1.5" />
            <text x="0" y="8" font-family="'JetBrains Mono', monospace" font-size="22" font-weight="700" fill="#2563EB" text-anchor="middle">π = C / d</text>
            <text x="0" y="46" font-family="'JetBrains Mono', monospace" font-size="12" fill="#F5C542" font-weight="600" text-anchor="middle">≈ 3.14159265...</text>
          </g>

          <text id="label-radius" x="65" y="-70" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="600" fill="#14B8A6" opacity="0">RADIUS (r)</text>
          <text id="label-diameter" x="-120" y="-12" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="600" fill="#121214" opacity="0">DIAMETER (2r)</text>
          <text id="label-circumference" x="0" y="-175" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="600" fill="#2563EB" text-anchor="middle" opacity="0">CIRCUMFERENCE (2πr)</text>
        </g>
      `;
    },

    initMathAroundVisual(svgEl) {
      if (!svgEl) return;
      svgEl.innerHTML = `
        <g id="env-base" stroke="#121214" stroke-opacity="0.3" stroke-width="1.5" fill="none">
          <path d="M 80 440 L 80 180 L 260 180 L 260 440" />
          <path d="M 260 440 L 260 120 L 520 120 L 520 440" />
          <path d="M 520 440 L 520 220 L 760 220 L 760 440" />
          <line x1="120" y1="220" x2="220" y2="220" stroke-opacity="0.15" />
          <line x1="120" y1="260" x2="220" y2="260" stroke-opacity="0.15" />
          <line x1="120" y1="300" x2="220" y2="300" stroke-opacity="0.15" />
          <circle cx="200" cy="400" r="32" stroke-opacity="0.4" />
          <path d="M 550 440 L 550 400 L 590 400 L 590 360 L 630 360 L 630 320 L 670 320 L 670 280" />
        </g>

        <g id="env-math-overlays" opacity="0" stroke="#2563EB" stroke-width="1.5" fill="none">
          <circle cx="390" cy="180" r="5" fill="#F5C542" />
          <line x1="390" y1="180" x2="0" y2="100" stroke-dasharray="4 4" stroke="#14B8A6" stroke-opacity="0.6" />
          <line x1="390" y1="180" x2="840" y2="100" stroke-dasharray="4 4" stroke="#14B8A6" stroke-opacity="0.6" />
          <line x1="390" y1="180" x2="80" y2="440" stroke-dasharray="4 4" stroke="#2563EB" stroke-opacity="0.8" />
          <line x1="390" y1="180" x2="760" y2="440" stroke-dasharray="4 4" stroke="#2563EB" stroke-opacity="0.8" />

          <path d="M 520 120 A 260 260 0 0 1 260 380 A 160 160 0 0 1 360 440 A 100 100 0 0 1 440 380" stroke="#14B8A6" stroke-width="2" />
          <text x="530" y="140" font-family="'JetBrains Mono', monospace" font-size="11" fill="#F5C542" font-weight="600">φ ≈ 1.618</text>

          <path d="M 550 440 L 670 280" stroke="#2563EB" stroke-width="2" stroke-dasharray="6 3" />
          <text x="630" y="270" font-family="'JetBrains Mono', monospace" font-size="11" fill="#2563EB">θ = 36.87° [3:4:5]</text>

          <line x1="140" y1="432" x2="260" y2="432" stroke="#14B8A6" stroke-width="2" />
          <text x="210" y="420" font-family="'JetBrains Mono', monospace" font-size="10" fill="#14B8A6">TANGENT // dy/dx = 0</text>
        </g>
      `;
    },

    initFinalVisual(svgEl) {
      if (!svgEl) return;
      svgEl.innerHTML = `
        <g id="f-stage-group" transform="translate(250, 250)">
          <circle id="f-point" cx="0" cy="0" r="6" fill="#F5C542" />
          <line id="f-line" x1="-120" y1="0" x2="120" y2="0" stroke="#2563EB" stroke-width="2.5" opacity="0" />
          <polygon id="f-shape" points="0,-130 112,65 -112,65" fill="rgba(37, 99, 235, 0.06)" stroke="#2563EB" stroke-width="2" opacity="0" />

          <g id="f-object" opacity="0" stroke="#121214" stroke-width="1.8" fill="none">
            <polygon points="0,-120 104,-60 0,0 -104,-60" fill="rgba(37, 99, 235, 0.08)" stroke="#2563EB" stroke-width="2" />
            <polygon points="0,0 104,-60 104,60 0,120" stroke="#14B8A6" stroke-opacity="0.7" />
            <polygon points="0,0 -104,-60 -104,60 0,120" stroke="#121214" stroke-opacity="0.8" />
          </g>

          <g id="f-world" opacity="0">
            <circle r="120" fill="rgba(37, 99, 235, 0.04)" stroke="#2563EB" stroke-width="2.5" />
            <ellipse rx="120" ry="40" fill="none" stroke="#121214" stroke-width="1" stroke-opacity="0.4" />
            <ellipse rx="40" ry="120" fill="none" stroke="#121214" stroke-width="1" stroke-opacity="0.4" />
            <ellipse rx="180" ry="50" fill="none" stroke="#14B8A6" stroke-width="1.5" stroke-dasharray="4 4" transform="rotate(-25)" />
            <circle cx="150" cy="-60" r="7" fill="#F5C542" />
            <circle cx="-130" cy="70" r="5" fill="#2563EB" />
          </g>
        </g>
      `;
    }
  };

  /* ==================================================
     5. BIG INTERACTIVE GRID CANVAS
     - Blue & Teal coordinate grid points
     - Yellow cursor coordinates HUD
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
        Sound.playMathInteraction();
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
          this.points.push({
            originX,
            originY,
            currentX: originX,
            currentY: originY,
            color: (r % 4 === 0 && c % 4 === 0) ? '#2563EB' : '#14B8A6'
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
        POINT: (<span style="color: #F5C542;">${cartesianX}</span>, <span style="color: #F5C542;">${cartesianY}</span>) &nbsp;|&nbsp; 
        r: <span style="color: #F5C542;">${dist}px</span> &nbsp;|&nbsp; 
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
        this.ctx.globalAlpha = p.color === '#2563EB' ? 0.65 : 0.22;
        this.ctx.beginPath();
        this.ctx.arc(p.currentX, p.currentY, p.color === '#2563EB' ? 2.5 : 1.5, 0, Math.PI * 2);
        this.ctx.fill();

        if (this.mouse.active && dist < 95) {
          this.ctx.strokeStyle = '#2563EB';
          this.ctx.globalAlpha = (1 - dist / 95) * 0.45;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(p.currentX, p.currentY);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.stroke();
        }
      }

      if (this.mouse.active) {
        this.ctx.strokeStyle = '#14B8A6';
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

        const arcRadius = 40;
        const arcStartX = bx + arcRadius;
        const arcStartY = by;
        const arcEndX = bx + arcRadius * Math.cos(Math.PI - rad);
        const arcEndY = by - arcRadius * Math.sin(Math.PI - rad);
        const largeArc = degrees > 180 ? 1 : 0;

        svg.innerHTML = `
          <defs>
            <linearGradient id="triGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2563EB" stop-opacity="0.15" />
              <stop offset="100%" stop-color="#14B8A6" stop-opacity="0.03" />
            </linearGradient>
          </defs>
          <line x1="20" y1="${by}" x2="300" y2="${by}" stroke="#121214" stroke-opacity="0.08" stroke-dasharray="3 3" />
          <polygon points="${bx},${by} ${cx},${cy} ${ax},${ay}" fill="url(#triGrad)" stroke="#2563EB" stroke-width="2.5" stroke-linejoin="round" />
          <path d="M ${arcStartX} ${arcStartY} A ${arcRadius} ${arcRadius} 0 ${largeArc} 0 ${arcEndX} ${arcEndY}" fill="rgba(20, 184, 166, 0.15)" stroke="#14B8A6" stroke-width="1.8" />
          <circle cx="${bx}" cy="${by}" r="4" fill="#121214" />
          <circle cx="${cx}" cy="${cy}" r="4" fill="#121214" />
          <circle cx="${ax}" cy="${ay}" r="5" fill="#F5C542" />
          <text x="${bx + 20}" y="${by - 12}" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" fill="#F5C542">${degrees}°</text>
          <g font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#585860">
            <text x="20" y="30">sin(${degrees}°) = ${(Math.sin(rad)).toFixed(3)}</text>
            <text x="20" y="46">cos(${degrees}°) = ${(Math.cos(rad)).toFixed(3)}</text>
          </g>
        `;
      };

      slider.addEventListener('input', (e) => {
        updateAngle(parseInt(e.target.value, 10));
        Sound.playSliderTick();
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
              Sound.playDiscoveryChime();
            }
            const experimentalPct = Math.round((targetHits / totalTrials) * 100);

            if (statTrials) statTrials.textContent = `TRIALS: ${totalTrials}`;
            if (statRate) statRate.textContent = `P(▲): ${experimentalPct}% (Theor: 16.7%)`;

            btn.disabled = false;
          }
        }, 60);
      });
    }

    initFractionExperiment() {
      const slider = document.getElementById('fraction-slider');
      const svg = document.getElementById('fraction-svg');
      const buttons = document.querySelectorAll('.fraction-btn');
      const fractionLabel = document.getElementById('fraction-label');
      if (!slider || !svg) return;

      const renderFraction = (numerator, denominator = 4) => {
        if (fractionLabel) fractionLabel.textContent = `${numerator}/${denominator}`;

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
          const fillColor = isFilled ? '#2563EB' : 'rgba(18, 18, 20, 0.04)';
          const strokeColor = isFilled ? '#FFFFFF' : 'rgba(18, 18, 20, 0.12)';

          paths += `
            <path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z" 
                  fill="${fillColor}" 
                  stroke="${strokeColor}" 
                  stroke-width="1.5" 
                  style="transition: fill 0.3s ease;" />
          `;
        }

        svg.innerHTML = `
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#121214" stroke-opacity="0.1" stroke-width="1" />
          ${paths}
          <circle cx="${cx}" cy="${cy}" r="16" fill="#FAF9F6" stroke="#14B8A6" stroke-width="2" />
          <circle cx="${cx}" cy="${cy}" r="4" fill="#F5C542" />
        `;

        buttons.forEach(btn => {
          const val = parseInt(btn.getAttribute('data-val'), 10);
          btn.classList.toggle('active', val === numerator);
        });
      };

      slider.addEventListener('input', (e) => {
        renderFraction(parseInt(e.target.value, 10), 4);
        Sound.playSliderTick();
      });

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const val = parseInt(btn.getAttribute('data-val'), 10);
          slider.value = val;
          renderFraction(val, 4);
          Sound.playSliderTick();
        });
      });

      renderFraction(parseInt(slider.value, 10), 4);
    }
  }

  /* ==================================================
     7. SCROLL & MOTION CONTROLLER
     Framer Motion & Apple-style scroll-linked transitions across 21 sections.
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
            end: '+=220%',
            pin: true,
            scrub: 0.8,
          }
        });

        const tText = document.querySelector('.transformation-stage-text');
        const tWheel = document.querySelector('#t-wheel');
        const tPlanet = document.querySelector('#t-planet');
        const tOrbit = document.querySelector('#t-orbit');
        const tPattern = document.querySelector('#t-pattern');
        const tFinal = document.querySelector('.transformation-final-text');

        tTl.to(tWheel, { opacity: 1, duration: 1 })
           .call(() => { if (tText) tText.textContent = 'Wheel'; })
           .to(tWheel, { opacity: 0, duration: 0.8 })
           .to(tPlanet, { opacity: 1, duration: 1 })
           .call(() => { if (tText) tText.textContent = 'Planet Orbit'; })
           .to(tPlanet, { opacity: 0, duration: 0.8 })
           .to(tOrbit, { opacity: 1, duration: 1 })
           .call(() => { if (tText) tText.textContent = 'Harmonic Orbits'; })
           .to(tOrbit, { opacity: 0, duration: 0.8 })
           .to(tPattern, { opacity: 1, duration: 1 })
           .call(() => { if (tText) tText.textContent = 'Universal Geometry'; })
           .to(tPattern, { opacity: 0.2, duration: 1 })
           .to(tFinal, { opacity: 1, y: 0, duration: 1.2 });
      }

      /* 08 — ONE CONCEPT */
      const conceptSec = document.querySelector('.section-concept');
      if (conceptSec) {
        const cTl = gsap.timeline({
          scrollTrigger: {
            trigger: conceptSec,
            start: 'top top',
            end: '+=250%',
            pin: true,
            scrub: 0.8,
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

      /* 09 — MATH AROUND YOU */
      const aroundSec = document.querySelector('.section-around');
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

      /* 13 — THE JOURNEY (Horizontal Scroll + Traveling Discovery Point) */
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

      /* 14 — FINAL EXPERIENCE (Pinned sequence) */
      const finalSec = document.querySelector('.section-final-experience');
      if (finalSec) {
        const fTl = gsap.timeline({
          scrollTrigger: {
            trigger: finalSec,
            start: 'top top',
            end: '+=250%',
            pin: true,
            scrub: 0.8,
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

      const seeMathSvg = document.getElementById('see-math-svg');
      if (seeMathSvg) MathVisuals.initSeeMathVisual(seeMathSvg);

      const transformSvg = document.getElementById('transformation-svg');
      if (transformSvg) MathVisuals.initTransformationVisual(transformSvg);

      const conceptSvg = document.getElementById('concept-svg');
      if (conceptSvg) MathVisuals.initConceptVisual(conceptSvg);

      const aroundSvg = document.getElementById('around-svg');
      if (aroundSvg) MathVisuals.initMathAroundVisual(aroundSvg);

      const finalSvg = document.getElementById('final-svg');
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

      btn.addEventListener('click', () => {
        const isEnabled = Sound.toggleSound();
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
          Sound.playNavClick();
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
          Sound.playNavClick();
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
