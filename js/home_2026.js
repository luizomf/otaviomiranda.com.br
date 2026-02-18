(function () {
  'use strict';

  var root = document.documentElement;
  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  initScopedSearch();
  initCounters(prefersReducedMotion);
  initInteractiveGlow();
  initViewTimelineFlag();
  initVortexParticles(prefersReducedMotion);

  function initScopedSearch() {
    var SEARCH_SCOPE = 'site:otaviomiranda.com.br';
    var searchForm = document.getElementById('main-search');

    if (!searchForm) return;

    var searchInput = searchForm.querySelector('input[name="q"]');

    if (!searchInput) return;

    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();

      var query = searchInput.value.trim();
      searchInput.value = query ? SEARCH_SCOPE + ' ' + query : SEARCH_SCOPE;

      searchForm.submit();

      // Restore original value in case user navigates back.
      searchInput.value = query;
    });
  }

  function initCounters(reducedMotion) {
    var counterElements = document.querySelectorAll('[data-counter]');
    var counterSection = document.querySelector('[data-counters]');
    var countersAnimated = false;

    if (!counterSection || !counterElements.length) return;

    function formatCounterValue(value, type) {
      if (type === 'rating') {
        return (
          value.toLocaleString('pt-BR', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }) + '/5'
        );
      }

      if (type === 'intplus') {
        return Math.round(value).toLocaleString('pt-BR') + '+';
      }

      return Math.round(value).toLocaleString('pt-BR');
    }

    function setCounterValue(element, value) {
      var type = element.getAttribute('data-type') || 'int';
      element.textContent = formatCounterValue(value, type);
    }

    function animateCounter(element, toValue, duration) {
      var start = performance.now();
      var type = element.getAttribute('data-type') || 'int';

      function step(now) {
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = toValue * eased;

        if (type === 'rating') {
          current = Math.min(current, toValue);
        }

        setCounterValue(element, current);

        if (progress < 1) {
          window.requestAnimationFrame(step);
          return;
        }

        setCounterValue(element, toValue);
      }

      window.requestAnimationFrame(step);
    }

    function animateCounters() {
      counterElements.forEach(function (element, index) {
        var target = parseFloat(element.getAttribute('data-counter') || '0');
        var duration = 950 + index * 150;

        if (reducedMotion) {
          setCounterValue(element, target);
          return;
        }

        animateCounter(element, target, duration);
      });
    }

    function resetCounters() {
      counterElements.forEach(function (element) {
        setCounterValue(element, 0);
      });
    }

    resetCounters();

    if (reducedMotion) {
      animateCounters();
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (!countersAnimated) {
              countersAnimated = true;
              animateCounters();
            }
            return;
          }

          if (countersAnimated) {
            countersAnimated = false;
            resetCounters();
          }
        });
      },
      {
        threshold: 0.3,
      },
    );

    observer.observe(counterSection);
  }

  function initInteractiveGlow() {
    var glowSections = document.querySelectorAll('.interactive-glow');

    glowSections.forEach(function (section) {
      section.addEventListener('mousemove', function (event) {
        var rect = section.getBoundingClientRect();
        var x = ((event.clientX - rect.left) / rect.width) * 100;
        var y = ((event.clientY - rect.top) / rect.height) * 100;

        section.style.setProperty('--mx', x.toFixed(2) + '%');
        section.style.setProperty('--my', y.toFixed(2) + '%');
      });

      section.addEventListener('mouseleave', function () {
        section.style.setProperty('--mx', '50%');
        section.style.setProperty('--my', '50%');
      });
    });
  }

  function initViewTimelineFlag() {
    var supportsViewTimeline = false;

    if (window.CSS && window.CSS.supports) {
      supportsViewTimeline =
        window.CSS.supports('animation-timeline: view()') ||
        window.CSS.supports('animation-timeline: view(20% 50%)');
    }

    root.classList.toggle('has-view-timeline', supportsViewTimeline);
  }

  function initVortexParticles(reducedMotion) {
    var sections = document.querySelectorAll('[data-particles="vortex"]');

    if (!sections.length) return;

    var instances = [];

    sections.forEach(function (section) {
      var instance = createVortexInstance(section, reducedMotion);

      if (instance) {
        instances.push(instance);
      }
    });

    if (!instances.length) return;

    var resizeTicking = false;

    window.addEventListener('resize', function () {
      if (resizeTicking) return;

      resizeTicking = true;

      window.requestAnimationFrame(function () {
        instances.forEach(function (instance) {
          instance.resize();
        });

        resizeTicking = false;
      });
    });

    document.addEventListener('visibilitychange', function () {
      var isVisible = !document.hidden;

      instances.forEach(function (instance) {
        instance.setDocumentVisible(isVisible);
      });
    });
  }

  function createVortexInstance(section, reducedMotion) {
    var config = readParticlesConfig(section);
    var canvas = document.createElement('canvas');

    canvas.className = 'particles-canvas';
    canvas.setAttribute('aria-hidden', 'true');

    section.insertBefore(canvas, section.firstChild);
    section.classList.add('has-particles');

    var context = canvas.getContext('2d');

    if (!context) return null;

    var width = 1;
    var height = 1;
    var dpr = 1;
    var particles = [];
    var rafId = 0;
    var running = false;
    var inView = false;
    var docVisible = !document.hidden;
    var lastTs = 0;
    var attractRadius = 220;
    var pointer = {
      active: false,
      x: 0,
      y: 0,
      lastMoveAt: 0,
    };

    var hasFinePointer = window.matchMedia('(pointer:fine)').matches;

    if (hasFinePointer) {
      section.addEventListener('pointermove', onPointerMove);
      section.addEventListener('pointerleave', onPointerLeave);
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          inView = entry.isIntersecting;
          syncLoopState();
        });
      },
      {
        threshold: 0.05,
      },
    );

    observer.observe(section);

    resize();

    if (reducedMotion) {
      drawFrame();
    }

    function readNumber(value, fallback) {
      var parsed = parseFloat(value);

      if (Number.isNaN(parsed)) return fallback;
      return parsed;
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function parsePalette(value) {
      if (!value) {
        return ['#1d4ed8', '#2563eb', '#3b82f6', '#ef4444', '#f59e0b'];
      }

      var colors = value
        .split(',')
        .map(function (color) {
          return color.trim();
        })
        .filter(Boolean);

      return colors.length
        ? colors
        : ['#1d4ed8', '#2563eb', '#3b82f6', '#ef4444', '#f59e0b'];
    }

    function readParticlesConfig(node) {
      return {
        densityDesktop: Math.max(
          10,
          Math.round(readNumber(node.dataset.particlesDensityDesktop, 220)),
        ),
        densityMobile: Math.max(
          6,
          Math.round(readNumber(node.dataset.particlesDensityMobile, 84)),
        ),
        radius: clamp(readNumber(node.dataset.particlesRadius, 1.6), 0.6, 3.5),
        speed: clamp(readNumber(node.dataset.particlesSpeed, 0.35), 0.05, 1.2),
        attract: clamp(
          readNumber(node.dataset.particlesAttract, 0.055),
          0.0,
          0.4,
        ),
        friction: clamp(
          readNumber(node.dataset.particlesFriction, 0.92),
          0.82,
          0.995,
        ),
        opacity: clamp(
          readNumber(node.dataset.particlesOpacity, 0.75),
          0.05,
          1,
        ),
        centerX: clamp(readNumber(node.dataset.particlesCenterX, 0.5), 0.1, 0.9),
        centerY: clamp(readNumber(node.dataset.particlesCenterY, 0.5), 0.1, 0.9),
        coreRadius: clamp(
          readNumber(node.dataset.particlesCoreRadius, 120),
          24,
          420,
        ),
        idleMs: clamp(readNumber(node.dataset.particlesIdleMs, 420), 120, 2000),
        releaseForce: clamp(
          readNumber(node.dataset.particlesReleaseForce, 0.75),
          0.05,
          2.5,
        ),
        palette: parsePalette(node.dataset.particlesPalette),
      };
    }

    function getTargetCount() {
      if (window.matchMedia('(max-width: 767px)').matches) {
        return config.densityMobile;
      }

      return config.densityDesktop;
    }

    function randomBetween(min, max) {
      return Math.random() * (max - min) + min;
    }

    function randomItem(list) {
      return list[Math.floor(Math.random() * list.length)];
    }

    function createParticle() {
      var cx = width * config.centerX;
      var cy = height * config.centerY;
      var maxRadius = Math.max(width, height) * 0.58;
      var coreRadius = Math.min(config.coreRadius, Math.min(width, height) * 0.42);
      var minRadius = Math.max(18, coreRadius * 0.42);
      var distance =
        minRadius +
        Math.pow(Math.random(), 1.05) * Math.max(12, maxRadius - minRadius);
      var angle = randomBetween(0, Math.PI * 2);

      var px = cx + Math.cos(angle) * distance;
      var py = cy + Math.sin(angle) * distance;

      var tangent = angle + Math.PI / 2;
      var velocity = config.speed * randomBetween(0.55, 1.45);

      return {
        x: px,
        y: py,
        homeX: px,
        homeY: py,
        vx: Math.cos(tangent) * velocity,
        vy: Math.sin(tangent) * velocity,
        size: config.radius * randomBetween(0.7, 1.35),
        alpha: config.opacity * randomBetween(0.55, 1),
        color: randomItem(config.palette),
        floatAmp: randomBetween(1.2, 6.0),
        floatSpeed: randomBetween(0.35, 1.2),
        floatPhase: randomBetween(0, Math.PI * 2),
      };
    }

    function respawnParticle(particle) {
      var fresh = createParticle();
      particle.x = fresh.x;
      particle.y = fresh.y;
      particle.homeX = fresh.homeX;
      particle.homeY = fresh.homeY;
      particle.vx = fresh.vx;
      particle.vy = fresh.vy;
      particle.size = fresh.size;
      particle.alpha = fresh.alpha;
      particle.color = fresh.color;
      particle.floatAmp = fresh.floatAmp;
      particle.floatSpeed = fresh.floatSpeed;
      particle.floatPhase = fresh.floatPhase;
    }

    function disperseFrom(px, py, strength) {
      var radius = attractRadius * 1.25;
      var radiusSq = radius * radius;

      particles.forEach(function (particle) {
        var dx = particle.x - px;
        var dy = particle.y - py;
        var distSq = dx * dx + dy * dy;

        if (distSq > radiusSq) return;

        var dist = Math.sqrt(distSq) || 0.0001;
        var ratio = 1 - distSq / radiusSq;
        var force = strength * ratio;

        particle.vx += (dx / dist) * force;
        particle.vy += (dy / dist) * force;
      });
    }

    function refillParticles() {
      var target = getTargetCount();

      if (particles.length > target) {
        particles.length = target;
        return;
      }

      while (particles.length < target) {
        particles.push(createParticle());
      }
    }

    function toRgba(hexColor, alpha) {
      var hex = hexColor.replace('#', '');

      if (hex.length === 3) {
        hex =
          hex[0] +
          hex[0] +
          hex[1] +
          hex[1] +
          hex[2] +
          hex[2];
      }

      var red = parseInt(hex.slice(0, 2), 16);
      var green = parseInt(hex.slice(2, 4), 16);
      var blue = parseInt(hex.slice(4, 6), 16);

      return 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + ')';
    }

    function drawFrame() {
      context.clearRect(0, 0, width, height);
      context.lineCap = 'round';

      particles.forEach(function (particle) {
        var tailScale = 6.4 + particle.size * 1.3;
        var tailX = particle.vx * tailScale;
        var tailY = particle.vy * tailScale;

        context.strokeStyle = toRgba(particle.color, particle.alpha);
        context.lineWidth = Math.max(1.15, particle.size * 1.05);
        context.beginPath();
        context.moveTo(particle.x - tailX, particle.y - tailY);
        context.lineTo(particle.x + tailX, particle.y + tailY);
        context.stroke();
      });
    }

    function updateParticles(deltaMs) {
      var dt = deltaMs / 16.666;
      var t = performance.now() * 0.001;
      var homePull = 0.024;
      var attractRadiusSq = attractRadius * attractRadius;

      particles.forEach(function (particle) {
        var targetX =
          particle.homeX +
          Math.cos(t * particle.floatSpeed + particle.floatPhase) * particle.floatAmp;
        var targetY =
          particle.homeY +
          Math.sin(t * (particle.floatSpeed * 0.87) + particle.floatPhase * 1.13) *
            particle.floatAmp;

        particle.vx += (targetX - particle.x) * homePull * dt;
        particle.vy += (targetY - particle.y) * homePull * dt;

        if (pointer.active && config.attract > 0) {
          var mdx = pointer.x - particle.x;
          var mdy = pointer.y - particle.y;
          var mDistSq = mdx * mdx + mdy * mdy;

          if (mDistSq < attractRadiusSq) {
            var mDist = Math.sqrt(mDistSq) || 0.0001;
            var force = (1 - mDistSq / attractRadiusSq) * config.attract;

            particle.vx += (mdx / mDist) * force * dt;
            particle.vy += (mdy / mDist) * force * dt;
          }
        }

        var friction = Math.pow(config.friction, dt);

        particle.vx *= friction;
        particle.vy *= friction;

        var speedSq = particle.vx * particle.vx + particle.vy * particle.vy;
        var maxSpeed = config.speed * 3.25;
        var maxSpeedSq = maxSpeed * maxSpeed;

        if (speedSq > maxSpeedSq) {
          var speed = Math.sqrt(speedSq) || 0.0001;
          var scale = maxSpeed / speed;
          particle.vx *= scale;
          particle.vy *= scale;
        }

        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;

        if (
          particle.x < -40 ||
          particle.x > width + 40 ||
          particle.y < -40 ||
          particle.y > height + 40
        ) {
          respawnParticle(particle);
          return;
        }

      });
    }

    function tick(timestamp) {
      if (!running) return;

      if (!lastTs) {
        lastTs = timestamp;
      }

      if (
        pointer.active &&
        pointer.lastMoveAt &&
        timestamp - pointer.lastMoveAt > config.idleMs
      ) {
        pointer.active = false;
        disperseFrom(pointer.x, pointer.y, config.releaseForce);
      }

      var delta = Math.min(33.0, Math.max(10.0, timestamp - lastTs));
      lastTs = timestamp;

      updateParticles(delta);
      drawFrame();

      rafId = window.requestAnimationFrame(tick);
    }

    function startLoop() {
      if (running || reducedMotion) return;

      running = true;
      lastTs = 0;
      rafId = window.requestAnimationFrame(tick);
    }

    function stopLoop() {
      running = false;

      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    function syncLoopState() {
      if (reducedMotion) {
        stopLoop();
        return;
      }

      if (inView && docVisible) {
        startLoop();
        return;
      }

      stopLoop();
    }

    function onPointerMove(event) {
      var rect = canvas.getBoundingClientRect();
      var now = performance.now();

      if (
        pointer.lastMoveAt &&
        !pointer.active &&
        now - pointer.lastMoveAt > config.idleMs
      ) {
        disperseFrom(pointer.x, pointer.y, config.releaseForce * 0.8);
      }

      pointer.active = true;
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.lastMoveAt = now;
    }

    function onPointerLeave() {
      if (pointer.active) {
        disperseFrom(pointer.x, pointer.y, config.releaseForce);
      }

      pointer.active = false;
    }

    function resize() {
      width = Math.max(1, section.clientWidth);
      height = Math.max(1, section.clientHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      refillParticles();
      particles.forEach(function (particle) {
        respawnParticle(particle);
      });
      drawFrame();
    }

    function setDocumentVisible(value) {
      docVisible = value;
      syncLoopState();
    }

    return {
      resize: resize,
      setDocumentVisible: setDocumentVisible,
    };
  }
})();
