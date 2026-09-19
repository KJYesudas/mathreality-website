/**
 * MATHREALITY - Main Application Entry Point
 */

import { MathVisuals } from './math-visuals.js';
import { MathExperiments } from './interactive.js';
import { BigInteractiveGrid } from './grid-canvas.js';
import { ScrollController } from './scroll.js';

class MathRealityApp {
  constructor() {
    this.init();
  }

  init() {
    // 1. Initialize Visual SVG Templates
    MathVisuals.initQuestionVisual(document.querySelector('.question-circle-svg'));
    MathVisuals.initTransformationVisual(document.querySelector('.transform-svg-stage'));
    MathVisuals.initConceptVisual(document.querySelector('.concept-svg-circle'));
    MathVisuals.initMathAroundVisual(document.querySelector('.math-around-svg'));
    MathVisuals.initFinalVisual(document.querySelector('.final-svg-element'));

    // 2. Initialize Interactive Widgets
    this.experiments = new MathExperiments();

    // 3. Initialize Section 10 Coordinate Grid Canvas
    const gridCanvas = document.getElementById('big-grid-canvas');
    const gridHud = document.getElementById('big-grid-hud');
    if (gridCanvas) {
      this.grid = new BigInteractiveGrid(gridCanvas, gridHud);
    }

    // 4. Initialize Lenis Smooth Scroll & GSAP ScrollTrigger
    this.scroll = new ScrollController();

    // 5. Initialize Navigation & Header state
    this.initHeader();

    // 6. Initialize Custom Cursor
    this.initCustomCursor();
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

    // Smooth scroll for anchor navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
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

    // Hover interactions for interactive elements
    const hoverElements = document.querySelectorAll('button, a, input, .learn-card, .reality-card, .fact-card, .audience-card, .prob-token');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        follower.classList.add('active');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        follower.classList.remove('active');
      });
    });
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.mathRealityApp = new MathRealityApp();
});
