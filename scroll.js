/**
 * MATHREALITY - Scroll & Animation Controller
 * Uses Lenis for smooth scrolling and GSAP ScrollTrigger for pinned & scrubbed animations.
 */

export class ScrollController {
  constructor() {
    this.lenis = null;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.initLenis();
    this.initScrollTriggers();
  }

  initLenis() {
    if (this.isReducedMotion || typeof Lenis === 'undefined') return;

    this.lenis = new Lenis({
      duration: 1.2,
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
      console.warn('GSAP or ScrollTrigger not loaded.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // If reduced motion is requested, do not initialize pin/scrub timelines
    if (this.isReducedMotion) {
      document.querySelectorAll('.reality-card, .learn-card, .fact-card').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const isDesktop = window.innerWidth > 768;

    /* ----------------------------------------------------
       01 — THE QUESTION (Pinned Sequence)
       CIRCLE → WHEEL → PLANET → CAMERA LENS
    ---------------------------------------------------- */
    const questionSec = document.querySelector('.section-the-question');
    if (questionSec) {
      const qTl = gsap.timeline({
        scrollTrigger: {
          trigger: questionSec,
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: 0.8,
        }
      });

      const step1 = document.querySelector('.question-step-1');
      const step2 = document.querySelector('.question-step-2');
      const qStageLabel = document.querySelector('.question-stage-label');
      const wheelLayer = document.querySelector('#q-wheel-layer');
      const planetLayer = document.querySelector('#q-planet-layer');
      const lensLayer = document.querySelector('#q-lens-layer');

      // 1. Text transition: Step 1 dims, Step 2 ("SEE") reveals strongly
      qTl.to(step1, { opacity: 0.35, y: -10, duration: 1 })
         .to(step2, { opacity: 1, y: 0, duration: 1 }, '<0.2');

      // 2. Morph: Circle -> Wheel
      qTl.to(wheelLayer, {
        opacity: 1,
        duration: 1.2,
        onUpdate: () => {
          if (qStageLabel) qStageLabel.textContent = 'STATE 02 // WHEEL';
        }
      });

      // 3. Morph: Wheel -> Planet
      qTl.to(wheelLayer, { opacity: 0, duration: 0.8 })
         .to(planetLayer, {
           opacity: 1,
           duration: 1.2,
           onUpdate: () => {
             if (qStageLabel) qStageLabel.textContent = 'STATE 03 // PLANET';
           }
         }, '<0.2');

      // 4. Morph: Planet -> Camera Lens
      qTl.to(planetLayer, { opacity: 0, duration: 0.8 })
         .to(lensLayer, {
           opacity: 1,
           duration: 1.2,
           onUpdate: () => {
             if (qStageLabel) qStageLabel.textContent = 'STATE 04 // CAMERA LENS';
           }
         }, '<0.2');
    }

    /* ----------------------------------------------------
       02 — MATH IN THE REAL WORLD (Horizontal Scroll)
    ---------------------------------------------------- */
    const realitySec = document.querySelector('.section-reality');
    const realityTrack = document.querySelector('.reality-horizontal-track');
    if (realitySec && realityTrack && isDesktop) {
      const getScrollAmount = () => -(realityTrack.scrollWidth - window.innerWidth + 120);

      gsap.to(realityTrack, {
        x: getScrollAmount,
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

    /* ----------------------------------------------------
       03 — THE TRANSFORMATION (Pinned Scroll)
       CIRCLE → WHEEL → PLANET → PATTERN → FINAL REVEAL
    ---------------------------------------------------- */
    const transformSec = document.querySelector('.section-transformation');
    if (transformSec) {
      const tTl = gsap.timeline({
        scrollTrigger: {
          trigger: transformSec,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 0.8,
        }
      });

      const tText = document.querySelector('.transformation-stage-text');
      const tWheel = document.querySelector('#t-wheel');
      const tPlanet = document.querySelector('#t-planet');
      const tPattern = document.querySelector('#t-pattern');
      const tFinal = document.querySelector('.transformation-final-text');
      const tVisualBox = document.querySelector('.transformation-visual-box');

      // Circle -> Wheel
      tTl.to(tWheel, { opacity: 1, duration: 1 })
         .call(() => { if (tText) tText.textContent = 'A WHEEL.'; })
         
      // Wheel -> Planet
         .to(tWheel, { opacity: 0, duration: 0.8 })
         .to(tPlanet, { opacity: 1, duration: 1 }, '<0.2')
         .call(() => { if (tText) tText.textContent = 'A PLANET.'; })

      // Planet -> Pattern
         .to(tPlanet, { opacity: 0, duration: 0.8 })
         .to(tPattern, { opacity: 1, duration: 1 }, '<0.2')
         .call(() => { if (tText) tText.textContent = 'A PATTERN.'; })

      // Final Reveal: "Same math. Different reality."
         .to([tText, tVisualBox], { opacity: 0.1, scale: 0.92, duration: 1 })
         .to(tFinal, { opacity: 1, y: 0, duration: 1.2 }, '<0.3');
    }

    /* ----------------------------------------------------
       05 — MATH, BUT DIFFERENT (Sequential Reveal)
    ---------------------------------------------------- */
    const wordsSec = document.querySelector('.section-math-different');
    if (wordsSec) {
      const words = document.querySelectorAll('.different-word');
      const finalMsg = document.querySelector('.math-different-final');

      words.forEach((word, idx) => {
        ScrollTrigger.create({
          trigger: word,
          start: 'top 80%',
          onEnter: () => word.classList.add('active'),
          onLeaveBack: () => word.classList.remove('active')
        });
      });

      if (finalMsg) {
        gsap.to(finalMsg, {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: finalMsg,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
      }
    }

    /* ----------------------------------------------------
       07 — ONE CONCEPT (Circle Deconstruction & Rebuild)
    ---------------------------------------------------- */
    const conceptSec = document.querySelector('.section-one-concept');
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

      const cDiameter = document.querySelector('#c-diameter');
      const cRadius = document.querySelector('#c-radius');
      const cRadiusTip = document.querySelector('#c-radius-tip');
      const cPiLabel = document.querySelector('#c-pi-label');
      const labelRadius = document.querySelector('#label-radius');
      const labelDiameter = document.querySelector('#label-diameter');
      const labelCircum = document.querySelector('#label-circumference');
      const conceptConclusion = document.querySelector('.concept-conclusion');

      // 1. Reveal Radius
      cTl.to([cRadius, cRadiusTip, labelRadius], { opacity: 1, duration: 1 })
      // 2. Reveal Diameter
         .to([cDiameter, labelDiameter], { opacity: 1, duration: 1 })
      // 3. Highlight Circumference
         .to(labelCircum, { opacity: 1, duration: 1 })
      // 4. Reveal Pi
         .to(cPiLabel, { opacity: 1, scale: 1.05, duration: 1.2 })
      // 5. Reconstruct circle and final conclusion
         .to([cRadius, cRadiusTip, cDiameter, labelRadius, labelDiameter, labelCircum, cPiLabel], { opacity: 0.2, duration: 1 })
         .to(conceptConclusion, { opacity: 1, y: 0, duration: 1 }, '<0.2');
    }

    /* ----------------------------------------------------
       09 — MATH AROUND YOU (Overlays Reveal)
    ---------------------------------------------------- */
    const aroundSec = document.querySelector('.section-math-around');
    if (aroundSec) {
      const aTl = gsap.timeline({
        scrollTrigger: {
          trigger: aroundSec,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 0.8,
        }
      });

      const overlays = document.querySelector('#env-math-overlays');
      const seqText = document.querySelector('.math-around-text-sequence');

      aTl.to(overlays, { opacity: 1, duration: 1.5 })
         .fromTo(seqText, { opacity: 0.4, y: 15 }, { opacity: 1, y: 0, duration: 1 }, '<0.5');
    }

    /* ----------------------------------------------------
       13 — THE JOURNEY (Horizontal Progression)
    ---------------------------------------------------- */
    const journeySec = document.querySelector('.section-journey');
    const journeyTrack = document.querySelector('.journey-track');
    if (journeySec && journeyTrack && isDesktop) {
      const getScrollAmount = () => -(journeyTrack.scrollWidth - window.innerWidth + 120);

      gsap.to(journeyTrack, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: journeySec,
          start: 'top top',
          end: () => `+=${journeyTrack.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });
    }

    /* ----------------------------------------------------
       15 — FINAL EXPERIENCE (POINT → WORLD)
    ---------------------------------------------------- */
    const finalSec = document.querySelector('.section-final-experience');
    if (finalSec) {
      const fTl = gsap.timeline({
        scrollTrigger: {
          trigger: finalSec,
          start: 'top top',
          end: '+=350%',
          pin: true,
          scrub: 0.8,
        }
      });

      const fPoint = document.querySelector('#f-point');
      const fLine = document.querySelector('#f-line');
      const fShape = document.querySelector('#f-shape');
      const fObject = document.querySelector('#f-object');
      const fWorld = document.querySelector('#f-world');
      const fSeqText = document.querySelector('.final-sequence-text');
      const r1 = document.querySelector('#final-reveal-1');
      const r2 = document.querySelector('#final-reveal-2');
      const r3 = document.querySelector('#final-reveal-3');

      // Point -> Line
      fTl.to(fPoint, { opacity: 0.3, duration: 0.5 })
         .to(fLine, { opacity: 1, duration: 1 }, '<')
         .call(() => { if (fSeqText) fSeqText.textContent = 'LINE'; })
         .to(r1, { opacity: 1, y: 0, duration: 0.8 })

      // Line -> Shape
         .to(fLine, { opacity: 0.2, duration: 0.5 })
         .to(fShape, { opacity: 1, duration: 1 }, '<')
         .call(() => { if (fSeqText) fSeqText.textContent = 'SHAPE'; })

      // Shape -> Object
         .to(fShape, { opacity: 0.2, duration: 0.5 })
         .to(fObject, { opacity: 1, duration: 1 }, '<')
         .call(() => { if (fSeqText) fSeqText.textContent = 'OBJECT'; })
         .to(r2, { opacity: 1, y: 0, duration: 0.8 })

      // Object -> World
         .to(fObject, { opacity: 0.2, duration: 0.5 })
         .to(fWorld, { opacity: 1, duration: 1.2 }, '<')
         .call(() => { if (fSeqText) fSeqText.textContent = 'WORLD'; })
         .to(r3, { opacity: 1, y: 0, duration: 1 });
    }
  }
}
