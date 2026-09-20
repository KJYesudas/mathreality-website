/**
 * MatheReality - Theme Controller (Dark Mode + Light Mode)
 * Animates theme transitions and synchronizes with localStorage and system preferences.
 */

import { Sound } from './sound.js';

export class ThemeController {
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

    // React to system preference changes if user hasn't set explicit preference
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
