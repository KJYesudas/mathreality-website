/**
 * MatheReality - Mathematical Visuals & SVG Generator
 * Refined 3-Color Visual Language:
 * - Deep Blue (#2563EB): Structure, coordinates, central mass, primary contours
 * - Soft Teal (#14B8A6): Orbits, velocity vectors, wave harmonics, tangent lines
 * - Warm Yellow (#F5C542): Moving satellites, focal points, discovery nodes, key constants
 * 
 * Features:
 * - Visually rich, engaging mathematical diagrams
 * - Complete, animated Keplerian planet/orbit simulation with velocity & gravity vectors
 * - Interactive cursor-driven 3D tilt
 * - Support for both class and ID selectors
 */

import { Sound } from './sound.js';

export const MathVisuals = {
  // Active animation frame handle
  orbitAnimFrame: null,

  initEditorialMoments() {
    // 02 What is MatheReality visuals
    const v1 = document.getElementById('vis-explanation-svg');
    if (v1) {
      v1.innerHTML = `
        <defs>
          <linearGradient id="v1-grad-a" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2563EB" stop-opacity="0.16" />
            <stop offset="100%" stop-color="#14B8A6" stop-opacity="0.04" />
          </linearGradient>
          <linearGradient id="v1-grad-b" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#14B8A6" stop-opacity="0.16" />
            <stop offset="100%" stop-color="#2563EB" stop-opacity="0.04" />
          </linearGradient>
        </defs>
        <!-- Triangle legs squares -->
        <rect x="40" y="140" width="120" height="40" fill="url(#v1-grad-a)" stroke="#2563EB" stroke-width="1.2" stroke-opacity="0.45" />
        <rect x="160" y="20" width="40" height="120" fill="url(#v1-grad-b)" stroke="#14B8A6" stroke-width="1.2" stroke-opacity="0.45" />
        <!-- Main right triangle -->
        <polygon points="40,140 160,140 160,20" fill="none" stroke="#2563EB" stroke-width="2.2" />
        <!-- Right angle marker -->
        <polyline points="148,140 148,128 160,128" fill="none" stroke="#14B8A6" stroke-width="1.5" />
        <!-- Hypotenuse -->
        <line x1="40" y1="140" x2="160" y2="20" stroke="#14B8A6" stroke-width="2.6" />
        <!-- Focal discovery apex -->
        <circle cx="160" cy="20" r="5" fill="#F5C542" />
        <circle cx="40" cy="140" r="4" fill="#2563EB" />
        <circle cx="160" cy="140" r="4" fill="#14B8A6" />
        <!-- Equation label -->
        <text x="65" y="80" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="600" fill="#2563EB">a² + b² = <tspan fill="#F5C542">c²</tspan></text>
      `;
    }

    const v2 = document.getElementById('vis-interactive-svg');
    if (v2) {
      v2.innerHTML = `
        <defs>
          <linearGradient id="v2-area" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#14B8A6" stop-opacity="0.18" />
            <stop offset="100%" stop-color="#2563EB" stop-opacity="0.03" />
          </linearGradient>
        </defs>
        <!-- Auxiliary coordinate grid -->
        <line x1="20" y1="130" x2="180" y2="130" stroke="#2563EB" stroke-opacity="0.2" stroke-width="1" />
        <line x1="40" y1="20" x2="40" y2="140" stroke="#2563EB" stroke-opacity="0.2" stroke-width="1" />
        <!-- Area under derivative curve -->
        <path d="M 30 120 Q 90 115 110 70 T 170 30 L 170 130 L 30 130 Z" fill="url(#v2-area)" />
        <!-- Function curve f(x) -->
        <path d="M 30 120 Q 90 115 110 70 T 170 30" fill="none" stroke="#14B8A6" stroke-width="2.4" />
        <!-- Tangent line at P -->
        <line x1="45" y1="110" x2="165" y2="30" stroke="#2563EB" stroke-width="1.8" />
        <!-- Delta projections -->
        <line x1="85" y1="84" x2="135" y2="84" stroke="#14B8A6" stroke-opacity="0.5" stroke-dasharray="3 3" />
        <line x1="135" y1="84" x2="135" y2="48" stroke="#14B8A6" stroke-opacity="0.5" stroke-dasharray="3 3" />
        <!-- Point P & Q -->
        <circle cx="85" cy="84" r="4" fill="#2563EB" />
        <circle cx="135" cy="48" r="4" fill="#14B8A6" />
        <!-- Instantaneous rate discovery node -->
        <circle cx="105" cy="70" r="5" fill="#F5C542" />
        <text x="100" y="150" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#585860" text-anchor="middle">lim <tspan fill="#14B8A6">Δx→0</tspan> Δy/Δx = <tspan fill="#2563EB" font-weight="700">f'(x)</tspan></text>
      `;
    }

    const v3 = document.getElementById('vis-realworld-svg');
    if (v3) {
      v3.innerHTML = `
        <defs>
          <linearGradient id="v3-truss" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2563EB" stop-opacity="0.12" />
            <stop offset="100%" stop-color="#14B8A6" stop-opacity="0.03" />
          </linearGradient>
        </defs>
        <!-- Ground support line -->
        <line x1="10" y1="130" x2="190" y2="130" stroke="#2563EB" stroke-opacity="0.25" stroke-width="1.5" stroke-dasharray="4 4" />
        <!-- Truss polygon with subtle fill -->
        <polygon points="20,130 180,130 100,30" fill="url(#v3-truss)" stroke="#2563EB" stroke-width="2.2" />
        <!-- Internal web members (tension & compression) -->
        <line x1="60" y1="80" x2="140" y2="80" stroke="#14B8A6" stroke-width="1.8" />
        <line x1="60" y1="80" x2="100" y2="130" stroke="#14B8A6" stroke-width="1.5" stroke-dasharray="3 3" />
        <line x1="140" y1="80" x2="100" y2="130" stroke="#14B8A6" stroke-width="1.5" stroke-dasharray="3 3" />
        <line x1="100" y1="30" x2="100" y2="130" stroke="#2563EB" stroke-width="1.8" />
        <!-- Load force vector -->
        <line x1="100" y1="8" x2="100" y2="28" stroke="#F5C542" stroke-width="2.5" />
        <polygon points="97,24 103,24 100,30" fill="#F5C542" />
        <!-- Apex joint node -->
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
          <linearGradient id="v4-wave" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#2563EB" stop-opacity="0.14" />
            <stop offset="100%" stop-color="#14B8A6" stop-opacity="0.02" />
          </linearGradient>
        </defs>
        <!-- Center equilibrium axis -->
        <line x1="15" y1="80" x2="185" y2="80" stroke="#2563EB" stroke-opacity="0.22" stroke-width="1" />
        <!-- Wave area fill -->
        <path d="M 20 80 Q 60 20 100 80 T 180 80 L 180 80 L 20 80 Z" fill="url(#v4-wave)" />
        <!-- Primary Harmonic Wave -->
        <path d="M 20 80 Q 60 20 100 80 T 180 80" fill="none" stroke="#2563EB" stroke-width="2.5" />
        <!-- Phase-Shifted Wave -->
        <path d="M 20 80 Q 60 140 100 80 T 180 80" fill="none" stroke="#14B8A6" stroke-width="1.8" stroke-opacity="0.85" stroke-dasharray="4 3" />
        <!-- Constructive interference crest node -->
        <circle cx="60" cy="35" r="5" fill="#F5C542" />
        <circle cx="100" cy="80" r="4" fill="#2563EB" />
        <circle cx="140" cy="125" r="4" fill="#14B8A6" />
        <text x="100" y="152" font-family="'JetBrains Mono', monospace" font-size="10" fill="#585860" text-anchor="middle">y = A sin(<tspan fill="#2563EB">ωt</tspan> + <tspan fill="#14B8A6">φ</tspan>)</text>
      `;
    }
  },

  initWhatYouGetVisuals() {
    // 03 What You Get visuals
    const w1 = document.getElementById('wyg-vis-1');
    if (w1) {
      w1.innerHTML = `
        <defs>
          <linearGradient id="w1-star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2563EB" stop-opacity="0.12" />
            <stop offset="100%" stop-color="#14B8A6" stop-opacity="0.05" />
          </linearGradient>
        </defs>
        <!-- Outer pentagon -->
        <polygon points="150,40 240,105 205,210 95,210 60,105" fill="none" stroke="#2563EB" stroke-width="2" />
        <!-- Internal diagonals / golden star -->
        <polygon points="150,40 205,210 60,105 240,105 95,210" fill="url(#w1-star-grad)" stroke="#14B8A6" stroke-width="1.8" stroke-linejoin="round" />
        <!-- Golden division nodes -->
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
          <linearGradient id="w2-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2563EB" stop-opacity="0.1" />
            <stop offset="100%" stop-color="#14B8A6" stop-opacity="0.03" />
          </linearGradient>
        </defs>
        <!-- Orbital ellipses with Keplerian resonance -->
        <ellipse cx="150" cy="130" rx="105" ry="52" transform="rotate(30 150 130)" fill="url(#w2-grad)" stroke="#2563EB" stroke-width="2" />
        <ellipse cx="150" cy="130" rx="105" ry="52" transform="rotate(-30 150 130)" fill="none" stroke="#14B8A6" stroke-width="1.8" stroke-opacity="0.85" />
        <!-- Auxiliary focal lines -->
        <line x1="90" y1="130" x2="210" y2="130" stroke="#2563EB" stroke-opacity="0.25" stroke-dasharray="3 3" />
        <!-- Foci & center nodes -->
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
          <radialGradient id="w3-core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#2563EB" stop-opacity="0.25" />
            <stop offset="60%" stop-color="#14B8A6" stop-opacity="0.08" />
            <stop offset="100%" stop-color="#2563EB" stop-opacity="0" />
          </radialGradient>
        </defs>
        <!-- Spacetime curvature concentric rings -->
        <circle cx="150" cy="130" r="85" fill="url(#w3-core-glow)" stroke="#2563EB" stroke-opacity="0.2" stroke-width="1" />
        <circle cx="150" cy="130" r="55" fill="none" stroke="#2563EB" stroke-opacity="0.35" stroke-width="1.5" />
        <circle cx="150" cy="130" r="30" fill="none" stroke="#14B8A6" stroke-opacity="0.45" stroke-dasharray="4 3" />
        <!-- Tilted orbit -->
        <ellipse cx="150" cy="130" rx="115" ry="38" transform="rotate(-20 150 130)" fill="none" stroke="#14B8A6" stroke-width="2" stroke-dasharray="5 4" />
        <!-- Central body and orbiting satellite -->
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
          <linearGradient id="w4-rect-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2563EB" stop-opacity="0.08" />
            <stop offset="100%" stop-color="#14B8A6" stop-opacity="0.04" />
          </linearGradient>
        </defs>
        <!-- Golden rectangles hierarchy -->
        <rect x="70" y="50" width="160" height="160" fill="url(#w4-rect-grad)" stroke="#2563EB" stroke-opacity="0.3" stroke-width="1" />
        <rect x="70" y="50" width="100" height="100" fill="none" stroke="#14B8A6" stroke-opacity="0.4" stroke-width="1" />
        <rect x="170" y="50" width="60" height="60" fill="none" stroke="#2563EB" stroke-opacity="0.3" stroke-width="1" />
        <!-- Logarithmic spiral arc -->
        <path d="M 70 210 A 160 160 0 0 1 230 50" fill="none" stroke="#2563EB" stroke-width="2.5" />
        <path d="M 230 50 A 100 100 0 0 1 130 150" fill="none" stroke="#14B8A6" stroke-width="2" />
        <!-- Convergence center -->
        <circle cx="130" cy="150" r="5" fill="#F5C542" />
        <text x="150" y="240" font-family="'JetBrains Mono', monospace" font-size="11.5" fill="#F5C542" font-weight="600" text-anchor="middle">φ = (1+√5)/2 ≈ <tspan fill="#2563EB">1.618</tspan></text>
      `;
    }

    const w5 = document.getElementById('wyg-vis-5');
    if (w5) {
      w5.innerHTML = `
        <defs>
          <radialGradient id="w5-incircle" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#14B8A6" stop-opacity="0.16" />
            <stop offset="100%" stop-color="#14B8A6" stop-opacity="0.02" />
          </radialGradient>
        </defs>
        <!-- Coordinate axes -->
        <line x1="50" y1="130" x2="250" y2="130" stroke="#2563EB" stroke-opacity="0.15" />
        <line x1="150" y1="30" x2="150" y2="230" stroke="#2563EB" stroke-opacity="0.15" />
        <!-- Triangle -->
        <polygon points="150,60 210,170 90,170" fill="none" stroke="#2563EB" stroke-width="2" />
        <!-- Circumcircle / Inscribed circle -->
        <circle cx="150" cy="130" r="32" fill="url(#w5-incircle)" stroke="#14B8A6" stroke-width="1.8" stroke-dasharray="3 3" />
        <!-- Euler line passing through centers -->
        <line x1="150" y1="45" x2="150" y2="185" stroke="#14B8A6" stroke-width="1.4" stroke-opacity="0.8" />
        <!-- Centers -->
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
          <linearGradient id="p1-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2563EB" stop-opacity="0.12" />
            <stop offset="100%" stop-color="#14B8A6" stop-opacity="0.04" />
          </linearGradient>
        </defs>
        <polygon points="100,20 170,120 30,120" fill="url(#p1-grad)" stroke="#2563EB" stroke-width="2" />
        <circle cx="100" cy="85" r="32" fill="none" stroke="#14B8A6" stroke-opacity="0.75" stroke-dasharray="3 3" stroke-width="1.5" />
        <circle cx="100" cy="20" r="5" fill="#F5C542" />
        <circle cx="100" cy="85" r="3.5" fill="#14B8A6" />
      `;
    }

    const p2 = document.getElementById('price-vis-2');
    if (p2) {
      p2.innerHTML = `
        <defs>
          <linearGradient id="p2-top" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2563EB" stop-opacity="0.18" />
            <stop offset="100%" stop-color="#14B8A6" stop-opacity="0.08" />
          </linearGradient>
          <linearGradient id="p2-side" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#14B8A6" stop-opacity="0.14" />
            <stop offset="100%" stop-color="#2563EB" stop-opacity="0.04" />
          </linearGradient>
        </defs>
        <polygon points="100,20 160,55 100,90 40,55" fill="url(#p2-top)" stroke="#2563EB" stroke-width="2" />
        <polygon points="100,90 160,55 160,115 100,150" fill="url(#p2-side)" stroke="#14B8A6" stroke-width="1.8" />
        <polygon points="100,90 40,55 40,115 100,150" fill="rgba(37, 99, 235, 0.06)" stroke="#2563EB" stroke-width="1.8" />
        <circle cx="100" cy="90" r="5" fill="#F5C542" />
      `;
    }

    const p3 = document.getElementById('price-vis-3');
    if (p3) {
      p3.innerHTML = `
        <defs>
          <radialGradient id="p3-sphere" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#2563EB" stop-opacity="0.16" />
            <stop offset="70%" stop-color="#14B8A6" stop-opacity="0.06" />
            <stop offset="100%" stop-color="#2563EB" stop-opacity="0.01" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="85" r="60" fill="url(#p3-sphere)" stroke="#2563EB" stroke-width="2" />
        <ellipse cx="100" cy="85" rx="80" ry="25" transform="rotate(30 100 85)" fill="none" stroke="#14B8A6" stroke-width="1.8" />
        <ellipse cx="100" cy="85" rx="80" ry="25" transform="rotate(-30 100 85)" fill="none" stroke="#14B8A6" stroke-width="1.8" />
        <circle cx="100" cy="85" r="14" fill="#F5C542" opacity="0.95" />
        <circle cx="100" cy="85" r="22" fill="none" stroke="#F5C542" stroke-opacity="0.4" stroke-dasharray="3 3" />
      `;
    }
  },

  /**
   * ==================================================
   * 07 — TRANSFORMATION VISUAL (WITH PHYSICAL ORBIT MECHANICS)
   * Stages: Circle -> Wheel -> Planet / Orbit -> Pattern
   * ==================================================
   */
  initTransformationVisual(svgEl) {
    if (!svgEl) return;

    svgEl.innerHTML = `
      <defs>
        <!-- Radial gradient for Stage 1: Circle -->
        <radialGradient id="t-circle-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#2563EB" stop-opacity="0.12" />
          <stop offset="70%" stop-color="#14B8A6" stop-opacity="0.03" />
          <stop offset="100%" stop-color="#2563EB" stop-opacity="0" />
        </radialGradient>

        <!-- Planet core volumetric sphere gradient -->
        <radialGradient id="planet-sphere-grad" cx="36%" cy="34%" r="66%">
          <stop offset="0%" stop-color="#14B8A6" stop-opacity="0.35" />
          <stop offset="45%" stop-color="#2563EB" stop-opacity="0.22" />
          <stop offset="85%" stop-color="#2563EB" stop-opacity="0.08" />
          <stop offset="100%" stop-color="#2563EB" stop-opacity="0.02" />
        </radialGradient>

        <!-- Central body aura -->
        <radialGradient id="planet-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#2563EB" stop-opacity="0.25" />
          <stop offset="60%" stop-color="#14B8A6" stop-opacity="0.06" />
          <stop offset="100%" stop-color="#2563EB" stop-opacity="0" />
        </radialGradient>
      </defs>

      <g id="t-stage-group" transform="translate(250, 250)">
        <!-- 1. STAGE: CIRCLE -->
        <circle id="t-circle" r="140" fill="url(#t-circle-glow)" stroke="#2563EB" stroke-width="2.5" />

        <!-- 2. STAGE: WHEEL -->
        <g id="t-wheel" opacity="0">
          <circle r="140" fill="none" stroke="#2563EB" stroke-width="3.5" />
          <circle r="36" fill="var(--bg-primary)" stroke="#14B8A6" stroke-width="2.5" />
          <line x1="0" y1="-140" x2="0" y2="140" stroke="#14B8A6" stroke-width="1.6" />
          <line x1="-140" y1="0" x2="140" y2="0" stroke="#14B8A6" stroke-width="1.6" />
          <line x1="-99" y1="-99" x2="99" y2="99" stroke="#14B8A6" stroke-width="1.6" />
          <line x1="-99" y1="99" x2="99" y2="-99" stroke="#14B8A6" stroke-width="1.6" />
          <circle r="6.5" fill="#F5C542" />
        </g>

        <!-- 3. STAGE: PLANET & KEPLERIAN ORBIT SYSTEM -->
        <g id="t-planet" opacity="0">
          <!-- Ambient atmospheric halo -->
          <circle r="115" fill="url(#planet-halo)" />

          <!-- Background coordinate grid & angle sectors -->
          <g stroke="#2563EB" stroke-opacity="0.12" stroke-width="1">
            <line x1="-220" y1="0" x2="220" y2="0" stroke-dasharray="3 3" />
            <line x1="0" y1="-220" x2="0" y2="220" stroke-dasharray="3 3" />
            <circle r="200" fill="none" stroke-dasharray="2 6" />
          </g>

          <!-- Outer Resonant Orbit (a = 210, b = 95, tilted 20°) -->
          <ellipse rx="210" ry="95" transform="rotate(20)" fill="none" stroke="#2563EB" stroke-width="1.4" stroke-opacity="0.38" stroke-dasharray="5 5" />

          <!-- Primary Keplerian Elliptical Orbit (a = 165, b = 75, tilted -18°) -->
          <ellipse id="orbit-primary-path" rx="165" ry="75" transform="rotate(-18)" fill="none" stroke="#14B8A6" stroke-width="2" stroke-opacity="0.85" />

          <!-- Inner Fast Orbit (a = 95, b = 50, tilted 35°) -->
          <ellipse rx="95" ry="50" transform="rotate(35)" fill="none" stroke="#2563EB" stroke-width="1.2" stroke-opacity="0.3" stroke-dasharray="3 3" />

          <!-- Focal Points (F1, F2) -->
          <g transform="rotate(-18)">
            <!-- c = sqrt(a² - b²) = sqrt(165² - 75²) ≈ 147 -->
            <line x1="-147" y1="0" x2="147" y2="0" stroke="#2563EB" stroke-opacity="0.25" stroke-dasharray="2 2" />
            <circle cx="-147" cy="0" r="3" fill="#2563EB" fill-opacity="0.6" />
            <circle cx="147" cy="0" r="3" fill="#2563EB" fill-opacity="0.6" />
          </g>

          <!-- Central Planet Body (Distinct, Volumetric Sphere) -->
          <g id="central-planet">
            <circle r="52" fill="url(#planet-sphere-grad)" stroke="#2563EB" stroke-width="2.5" />
            <!-- Geodesic latitude/longitude rings -->
            <ellipse rx="52" ry="18" fill="none" stroke="#14B8A6" stroke-width="1.4" stroke-opacity="0.5" transform="rotate(-23.5)" />
            <ellipse rx="18" ry="52" fill="none" stroke="#14B8A6" stroke-width="1.4" stroke-opacity="0.5" transform="rotate(-23.5)" />
            <!-- Polar axis -->
            <line x1="-24" y1="-56" x2="24" y2="56" stroke="#2563EB" stroke-width="1.8" stroke-linecap="round" />
            <!-- Core center node -->
            <circle r="5" fill="#F5C542" />
            <circle r="8" fill="none" stroke="#F5C542" stroke-opacity="0.4" stroke-width="1" />
          </g>

          <!-- Dynamic Satellite 1 (Primary - Warm Yellow with velocity & gravity vectors) -->
          <g id="orbit-sat-1">
            <!-- Radius vector from center to satellite -->
            <line id="sat-radius-line" x1="0" y1="0" x2="140" y2="-45" stroke="#14B8A6" stroke-width="1.2" stroke-opacity="0.5" stroke-dasharray="3 3" />
            <!-- Gravitational force vector (pointing toward central planet) -->
            <line id="sat-gravity-vec" x1="140" y1="-45" x2="105" y2="-34" stroke="#2563EB" stroke-width="2" />
            <!-- Velocity vector (tangent to orbit) -->
            <line id="sat-velocity-vec" x1="140" y1="-45" x2="128" y2="-82" stroke="#14B8A6" stroke-width="2.2" />
            <!-- Satellite Body -->
            <circle id="sat-body-1" cx="140" cy="-45" r="7" fill="#F5C542" />
            <circle id="sat-halo-1" cx="140" cy="-45" r="12" fill="none" stroke="#F5C542" stroke-opacity="0.4" stroke-dasharray="2 2" />
          </g>

          <!-- Dynamic Satellite 2 (Outer Resonant - Soft Teal) -->
          <g id="orbit-sat-2">
            <circle id="sat-body-2" cx="-180" cy="50" r="5" fill="#14B8A6" />
            <circle cx="-180" cy="50" r="9" fill="none" stroke="#14B8A6" stroke-opacity="0.3" />
          </g>

          <!-- Dynamic Satellite 3 (Inner Fast - Deep Blue) -->
          <g id="orbit-sat-3">
            <circle id="sat-body-3" cx="60" cy="30" r="4" fill="#2563EB" />
          </g>

          <!-- Mathematical Formula Annotations -->
          <g font-family="'JetBrains Mono', monospace" font-size="10.5">
            <text x="-215" y="-180" fill="#2563EB" font-weight="600">KEPLERIAN ORBIT DYNAMICS</text>
            <text x="-215" y="-162" fill="#14B8A6">T² = (4π²/GM) · a³</text>
            <text x="-215" y="-144" fill="#585860">F_g = G(M·m)/r²</text>
            <text x="110" y="195" fill="#F5C542" font-weight="600">v_orbit = √(GM/r)</text>
          </g>
        </g>

        <!-- 4. STAGE: PATTERN / UNIVERSAL GEOMETRY -->
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

    // Start physical orbit animation loop
    this.startOrbitAnimation();

    // Attach subtle cursor tilt
    this.initOrbitCursorTilt();
  },

  /**
   * Continuous Physical Keplerian Orbit Animation
   */
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

    const satBody1 = document.getElementById('sat-body-1');
    const satHalo1 = document.getElementById('sat-halo-1');
    const satRadLine = document.getElementById('sat-radius-line');
    const satVelVec = document.getElementById('sat-velocity-vec');
    const satGravVec = document.getElementById('sat-gravity-vec');
    const satBody2 = document.getElementById('sat-body-2');
    const satBody3 = document.getElementById('sat-body-3');

    const animate = () => {
      t += 0.016;

      // 1. Primary Satellite (Keplerian: a = 165, b = 75, angle advances slightly faster at periapsis)
      // Keplerian mean anomaly approximation
      const speed1 = 0.65;
      const angle1 = t * speed1;
      const unrotatedX1 = 165 * Math.cos(angle1);
      const unrotatedY1 = 75 * Math.sin(angle1);

      // Rotate by orbit tilt (-18°)
      const x1 = unrotatedX1 * cosTilt1 - unrotatedY1 * sinTilt1;
      const y1 = unrotatedX1 * sinTilt1 + unrotatedY1 * cosTilt1;

      // Tangent velocity vector (derivative dx/dt, dy/dt)
      const unrotatedVx = -165 * Math.sin(angle1);
      const unrotatedVy = 75 * Math.cos(angle1);
      const vLen = Math.hypot(unrotatedVx, unrotatedVy);
      const normVx = (unrotatedVx / vLen) * 38;
      const normVy = (unrotatedVy / vLen) * 38;
      const vx = normVx * cosTilt1 - normVy * sinTilt1;
      const vy = normVx * sinTilt1 + normVy * cosTilt1;

      // Gravity vector towards center (0,0)
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

      // 2. Outer Resonant Satellite (a = 210, b = 95, tilted 20°, slower orbit)
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

      // 3. Inner Fast Satellite (a = 95, b = 50, tilted 35°, faster orbit)
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

  /**
   * Subtle Cursor Tilt for the Orbital Apparatus
   */
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
      const normX = ((e.clientX - rect.left) / rect.width) - 0.5; // -0.5 to 0.5
      const normY = ((e.clientY - rect.top) / rect.height) - 0.5; // -0.5 to 0.5

      // Subtle tilt: max ±7 degrees
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

      if (group && Math.abs(currRotX) > 0.01 || Math.abs(currRotY) > 0.01) {
        group.style.transform = `perspective(600px) rotateX(${currRotX.toFixed(2)}deg) rotateY(${currRotY.toFixed(2)}deg)`;
        group.style.transformOrigin = 'center center';
      }
      requestAnimationFrame(updateTilt);
    };

    requestAnimationFrame(updateTilt);
  },

  /**
   * 11 — ONE CONCEPT: WHY DOES A CIRCLE LOOK LIKE THIS?
   */
  initConceptVisual(svgEl) {
    if (!svgEl) return;
    svgEl.innerHTML = `
      <defs>
        <linearGradient id="c-card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(255, 255, 255, 0.98)" />
          <stop offset="100%" stop-color="rgba(250, 249, 246, 0.95)" />
        </linearGradient>
        <radialGradient id="c-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#2563EB" stop-opacity="0.1" />
          <stop offset="70%" stop-color="#14B8A6" stop-opacity="0.03" />
          <stop offset="100%" stop-color="#2563EB" stop-opacity="0" />
        </radialGradient>
      </defs>
      <g id="c-stage-group" transform="translate(260, 260)">
        <!-- Coordinate crosshairs & radial compass ticks -->
        <circle r="180" fill="url(#c-core-glow)" stroke="#2563EB" stroke-opacity="0.12" stroke-dasharray="6 6" />
        <line x1="-220" y1="0" x2="220" y2="0" stroke="#2563EB" stroke-opacity="0.18" />
        <line x1="0" y1="-220" x2="0" y2="220" stroke="#2563EB" stroke-opacity="0.18" />

        <!-- Circumference -->
        <circle id="c-circumference" r="160" fill="none" stroke="#2563EB" stroke-width="3.2" stroke-dasharray="1005" stroke-dashoffset="0" />
        <!-- Diameter -->
        <line id="c-diameter" x1="-160" y1="0" x2="160" y2="0" stroke="#14B8A6" stroke-width="2.6" opacity="0" />
        <!-- Radius vector -->
        <line id="c-radius" x1="0" y1="0" x2="113" y2="-113" stroke="#14B8A6" stroke-width="3" opacity="0" />
        <circle id="c-radius-tip" cx="113" cy="-113" r="5.5" fill="#F5C542" opacity="0" />
        <circle id="c-center" cx="0" cy="0" r="6" fill="#F5C542" />

        <!-- Formula card overlay -->
        <g id="c-pi-label" opacity="0" transform="translate(0, 0)">
          <rect x="-90" y="-32" width="180" height="64" rx="12" fill="url(#c-card-grad)" stroke="#2563EB" stroke-width="1.8" stroke-opacity="0.8" />
          <text x="0" y="8" font-family="'JetBrains Mono', monospace" font-size="22" font-weight="700" fill="#2563EB" text-anchor="middle">π = C / d</text>
          <text x="0" y="46" font-family="'JetBrains Mono', monospace" font-size="12" fill="#F5C542" font-weight="600" text-anchor="middle">≈ 3.14159265...</text>
        </g>

        <text id="label-radius" x="65" y="-70" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="600" fill="#14B8A6" opacity="0">RADIUS (r)</text>
        <text id="label-diameter" x="-120" y="-12" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="600" fill="#14B8A6" opacity="0">DIAMETER (2r)</text>
        <text id="label-circumference" x="0" y="-175" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="600" fill="#2563EB" text-anchor="middle" opacity="0">CIRCUMFERENCE (2πr)</text>
      </g>
    `;
  },

  /**
   * 13 — MATH AROUND YOU: ARCHITECTURE & PERSPECTIVE
   */
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
        <!-- Vanishing perspective point -->
        <circle cx="390" cy="180" r="6" fill="#F5C542" />
        <line x1="390" y1="180" x2="0" y2="100" stroke-dasharray="4 4" stroke="#14B8A6" stroke-opacity="0.75" />
        <line x1="390" y1="180" x2="840" y2="100" stroke-dasharray="4 4" stroke="#14B8A6" stroke-opacity="0.75" />
        <line x1="390" y1="180" x2="80" y2="440" stroke-dasharray="4 4" stroke="#2563EB" stroke-opacity="0.85" />
        <line x1="390" y1="180" x2="760" y2="440" stroke-dasharray="4 4" stroke="#2563EB" stroke-opacity="0.85" />

        <!-- Golden ratio logarithmic spiral -->
        <path d="M 520 120 A 260 260 0 0 1 260 380 A 160 160 0 0 1 360 440 A 100 100 0 0 1 440 380" stroke="#14B8A6" stroke-width="2.4" />
        <text x="530" y="140" font-family="'JetBrains Mono', monospace" font-size="11" fill="#F5C542" font-weight="600">φ ≈ 1.618</text>

        <!-- Right triangle structural pitch -->
        <path d="M 550 440 L 670 280" stroke="#2563EB" stroke-width="2.2" stroke-dasharray="6 3" />
        <text x="630" y="270" font-family="'JetBrains Mono', monospace" font-size="11" fill="#2563EB" font-weight="600">θ = 36.87° [3:4:5]</text>

        <line x1="140" y1="432" x2="260" y2="432" stroke="#14B8A6" stroke-width="2" />
        <text x="210" y="420" font-family="'JetBrains Mono', monospace" font-size="10" fill="#14B8A6" font-weight="600">TANGENT // dy/dx = 0</text>
      </g>
    `;
  },

  /**
   * 19 — FINAL EXPERIENCE: POINT -> LINE -> SHAPE -> OBJECT -> WORLD
   */
  initFinalVisual(svgEl) {
    if (!svgEl) return;
    svgEl.innerHTML = `
      <defs>
        <linearGradient id="f-shape-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2563EB" stop-opacity="0.14" />
          <stop offset="100%" stop-color="#14B8A6" stop-opacity="0.04" />
        </linearGradient>
        <linearGradient id="f-obj-side" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#14B8A6" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#2563EB" stop-opacity="0.05" />
        </linearGradient>
      </defs>
      <g id="f-stage-group" transform="translate(250, 250)">
        <circle id="f-point" cx="0" cy="0" r="7" fill="#F5C542" />
        <line id="f-line" x1="-120" y1="0" x2="120" y2="0" stroke="#2563EB" stroke-width="2.8" opacity="0" />
        <polygon id="f-shape" points="0,-130 112,65 -112,65" fill="url(#f-shape-grad)" stroke="#2563EB" stroke-width="2.2" opacity="0" />

        <g id="f-object" opacity="0" stroke-width="1.8" fill="none">
          <polygon points="0,-120 104,-60 0,0 -104,-60" fill="rgba(37, 99, 235, 0.14)" stroke="#2563EB" stroke-width="2.2" />
          <polygon points="0,0 104,-60 104,60 0,120" fill="url(#f-obj-side)" stroke="#14B8A6" stroke-opacity="0.85" />
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
