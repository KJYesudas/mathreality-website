/**
 * MATHREALITY - Section 08: Interactive Mathematical Experiments
 * Angle slider, Probability generator, and Fraction visualizer.
 * Refined with Deep Blue (#2563EB), Soft Teal (#14B8A6), Warm Yellow (#F5C542)
 * and interactive audio feedback.
 */

import { Sound } from './sound.js';

export class MathExperiments {
  constructor() {
    this.initAngleExperiment();
    this.initProbabilityExperiment();
    this.initFractionExperiment();
  }

  /**
   * 1. Interactive Angles
   * Slider: 30° to 180°
   * Renders dynamic triangle, angle arc, and real-time trigonometric readout.
   */
  initAngleExperiment() {
    const slider = document.getElementById('angle-slider');
    const badge = document.getElementById('angle-degree-val');
    const svg = document.getElementById('angle-svg');
    if (!slider || !svg) return;

    let lastDeg = parseInt(slider.value, 10);

    const updateAngle = (degrees) => {
      const rad = (degrees * Math.PI) / 180;
      badge.textContent = `${degrees}°`;

      // Triangle vertices with origin B at (70, 170)
      const bx = 70;
      const by = 170;
      const sideA = 150; // horizontal base to point C
      const cx = bx + sideA;
      const cy = by;

      const sideC = 140; // arm extending at angle
      const ax = bx + sideC * Math.cos(Math.PI - rad);
      const ay = by - sideC * Math.sin(Math.PI - rad);

      // Arc path
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

        <!-- Base Grid -->
        <line x1="20" y1="${by}" x2="300" y2="${by}" stroke="#2563EB" stroke-opacity="0.15" stroke-dasharray="3 3" />

        <!-- Triangle Body -->
        <polygon points="${bx},${by} ${cx},${cy} ${ax},${ay}" fill="url(#triGrad)" stroke="#2563EB" stroke-width="2.5" stroke-linejoin="round" />

        <!-- Angle Arc -->
        <path d="M ${arcStartX} ${arcStartY} A ${arcRadius} ${arcRadius} 0 ${largeArc} 0 ${arcEndX} ${arcEndY}" fill="rgba(20, 184, 166, 0.15)" stroke="#14B8A6" stroke-width="2" />

        <!-- Vertices Dots -->
        <circle cx="${bx}" cy="${by}" r="4.5" fill="#2563EB" />
        <circle cx="${cx}" cy="${cy}" r="4.5" fill="#2563EB" />
        <circle cx="${ax}" cy="${ay}" r="5.5" fill="#F5C542" />

        <!-- Angle Label in SVG -->
        <text x="${bx + 22}" y="${by - 14}" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" fill="#14B8A6">${degrees}°</text>

        <!-- Dynamic Trigonometric Readout -->
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

      // Gentle chime on 90° right angle or 180° straight angle
      if ((val === 90 || val === 180) && lastDeg !== val) {
        Sound.playDiscoveryChime();
      }
      lastDeg = val;
    });

    updateAngle(parseInt(slider.value, 10));
  }

  /**
   * 2. Interactive Probability
   * Collection of geometric tokens. Generates random outcomes, calculates experimental odds.
   */
  initProbabilityExperiment() {
    const btn = document.getElementById('prob-btn');
    const tokensContainer = document.getElementById('prob-tokens-container');
    const statTrials = document.getElementById('prob-stat-trials');
    const statRate = document.getElementById('prob-stat-rate');
    if (!btn || !tokensContainer) return;

    let totalTrials = 0;
    let targetHits = 0;
    const items = [
      { id: 1, shape: '▲', label: 'Tri' },
      { id: 2, shape: '■', label: 'Sq' },
      { id: 3, shape: '●', label: 'Cir' },
      { id: 4, shape: '◆', label: 'Dia' },
      { id: 5, shape: '⬡', label: 'Hex' },
      { id: 6, shape: '★', label: 'Star' }
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
          if (finalIdx === 0) targetHits++; // Tracking Triangle occurrence
          const experimentalPct = Math.round((targetHits / totalTrials) * 100);

          if (statTrials) statTrials.textContent = `TRIALS: ${totalTrials}`;
          if (statRate) statRate.textContent = `P(▲): ${experimentalPct}% (Theor: 16.7%)`;

          btn.disabled = false;
          Sound.playDiscoveryChime();
        }
      }, 60);
    });
  }

  /**
   * 3. Interactive Fractions
   * Circular fraction visualization. Fills radial slices smoothly.
   */
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

      // Update button active states
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
