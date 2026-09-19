/**
 * MatheReality - Mathematical Visuals & SVG Generator
 * 3-Color Visual Language:
 * - Deep Blue (#2563EB): Knowledge, primary geometry, circle outline, coordinate axes
 * - Soft Teal (#14B8A6): Discovery, orbits, transformations, waves, dynamic curves
 * - Warm Yellow (#F5C542): Curiosity, discovery points, focal centers, highlighted numbers
 */

export const MathVisuals = {
  initEditorialMoments() {
    // 02 What is MatheReality visuals
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
    // 03 What You Get visuals
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
