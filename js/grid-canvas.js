/**
 * MATHREALITY - Section 10: Big Interactive Grid Canvas
 * Renders an interactive coordinate grid where points and lines dynamically
 * react to mouse movements with magnetic distortion, line connections, and live coordinates HUD.
 */

export class BigInteractiveGrid {
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

    // Event listeners
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
          vx: 0,
          vy: 0,
          color: (r % 4 === 0 && c % 4 === 0) ? '#6C38CC' : '#121214'
        });
      }
    }
  }

  updateHud(x, y) {
    if (!this.hud) return;
    // Map canvas coordinates to Cartesian (center origin at width/2, height/2)
    const cartesianX = Math.round(x - this.width / 2);
    const cartesianY = Math.round((this.height / 2) - y);
    const angle = Math.round((Math.atan2(cartesianY, cartesianX) * 180 / Math.PI + 360) % 360);
    const dist = Math.round(Math.hypot(cartesianX, cartesianY));

    this.hud.innerHTML = `
      POINT: (<span>${cartesianX}</span>, <span>${cartesianY}</span>) &nbsp;|&nbsp; 
      r: <span>${dist}px</span> &nbsp;|&nbsp; 
      θ: <span>${angle}°</span>
    `;
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Smooth mouse lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.15;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.15;

    // Center origin axes
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    this.ctx.strokeStyle = 'rgba(18, 18, 20, 0.08)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, 0);
    this.ctx.lineTo(centerX, this.height);
    this.ctx.moveTo(0, centerY);
    this.ctx.lineTo(this.width, centerY);
    this.ctx.stroke();

    // Update and draw points
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      let dx = this.mouse.x - p.originX;
      let dy = this.mouse.y - p.originY;
      let dist = Math.hypot(dx, dy);

      // Magnetic deformation
      if (this.mouse.active && dist < this.radius && dist > 0) {
        let force = (1 - dist / this.radius) * 18;
        let angle = Math.atan2(dy, dx);
        p.currentX = p.originX + Math.cos(angle) * force;
        p.currentY = p.originY + Math.sin(angle) * force;
      } else {
        // Restoring spring back to origin
        p.currentX += (p.originX - p.currentX) * 0.1;
        p.currentY += (p.originY - p.currentY) * 0.1;
      }

      // Draw point dot
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.color === '#6C38CC' ? 0.6 : 0.18;
      this.ctx.beginPath();
      this.ctx.arc(p.currentX, p.currentY, p.color === '#6C38CC' ? 2.5 : 1.5, 0, Math.PI * 2);
      this.ctx.fill();

      // Connect lines to mouse if nearby
      if (this.mouse.active && dist < 95) {
        this.ctx.strokeStyle = '#6C38CC';
        this.ctx.globalAlpha = (1 - dist / 95) * 0.45;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(p.currentX, p.currentY);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.stroke();
      }
    }

    // Draw active cursor target in canvas
    if (this.mouse.active) {
      this.ctx.strokeStyle = '#6C38CC';
      this.ctx.globalAlpha = 0.5;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.arc(this.mouse.x, this.mouse.y, 16, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.fillStyle = '#6C38CC';
      this.ctx.globalAlpha = 0.9;
      this.ctx.beginPath();
      this.ctx.arc(this.mouse.x, this.mouse.y, 3, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1.0;
    requestAnimationFrame(() => this.render());
  }
}
