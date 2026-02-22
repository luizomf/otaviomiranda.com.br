function canvasBg() {
  const makeCanvasBg = (canv, configs) => {
    if (!canv) return;
    let w, h;

    const ctx = canv.getContext('2d');

    function resize() {
      w = canv.width = canv.clientWidth;
      h = canv.height = canv.clientHeight;
    }

    const mouse = {
      x: -9999,
      y: -9999,
      radius: configs.radius,
    };

    window.addEventListener('mousemove', e => {
      const bounds = canv.parentElement.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;

      mouse.x = x;
      mouse.y = y;
    });

    const radiusSq = () => mouse.radius * mouse.radius;

    class Particle {
      constructor() {
        this.baseX = Math.random() * w;
        this.baseY = Math.random() * h;

        this.x = this.baseX;
        this.y = this.baseY;

        this.vx = 0;
        this.vy = 0;

        // drift planetário
        this.driftPhase = Math.random() * Math.PI * 2;
        this.driftRadius = 10 + Math.random() * 20;

        this.size =
          Math.random() *
            (configs.particle_max_size - configs.particle_min_size) +
          configs.particle_min_size;
      }

      update() {
        this.driftPhase += 0.01;

        const targetX =
          this.baseX + Math.cos(this.driftPhase) * this.driftRadius;

        const targetY =
          this.baseY + Math.sin(this.driftPhase) * this.driftRadius;

        this.vx += (targetX - this.x) * configs.spring;
        this.vy += (targetY - this.y) * configs.spring;

        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < radiusSq()) {
          const dist = Math.sqrt(distSq);
          const nx = dx / dist;
          const ny = dy / dist;

          const force = Math.pow(1 - dist / mouse.radius, 2);

          this.vx += nx * force * configs.force;
          this.vy += ny * force * configs.force;
        }

        this.vx -= this.vx * configs.drag;
        this.vy -= this.vy * configs.drag;

        this.x += this.vx;
        this.y += this.vy;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = configs.color;
        ctx.fill();
      }
    }

    let particles = [];

    function rebuildParticles() {
      particles = Array.from(
        { length: configs.particle_count },
        () => new Particle(),
      );
    }

    function loop() {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.update();
        p.draw();
      }

      requestAnimationFrame(loop);
    }

    let resizeTimeout;

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(() => {
        resize();
        rebuildParticles();
      }, 150);
    });

    window.addEventListener('load', () => {
      resize();
      rebuildParticles();
      loop();
    });
  };

  const defaults = {
    spring: 0.01,
    force: 25,
    drag: 0.4,
    particle_min_size: 0.1,
    particle_max_size: 1.5,
    particle_count: 500,
    color: 'rgba(0, 0, 0, 0.6)',
    radius: 200,
  };

  const canvas2 = document.getElementById('canvas-hero-dark');
  makeCanvasBg(canvas2, {
    ...defaults,
    spring: 0.01,
    force: 25,
    drag: 0.4,
    particle_min_size: 0.1,
    particle_max_size: 2,
    particle_count: 200,
    color: 'rgba(255, 255, 255, 0.8)',
    radius: 200,
  });
}

canvasBg();
