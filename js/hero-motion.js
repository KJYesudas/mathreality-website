/**
 * MatheReality - Hero Motion Controller
 * Implements cursor-based 3D floating with physical spring inertia,
 * and cinematic scroll-driven camera pull-back.
 */

export class HeroMotionController {
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
      // Normalize cursor relative to viewport center (-1 to +1)
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;

      // Small, expensive, restrained values (video frame only)
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

    // Cinematic camera pull-back on scroll
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
