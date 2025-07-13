// Galaxy, stars, and falling particles with sun glare on hover for BritishBaccy
// Uses tsParticles (https://github.com/tsparticles/tsparticles)
// CDN: https://cdn.jsdelivr.net/npm/tsparticles-engine@3/tsparticles.engine.min.js
// and https://cdn.jsdelivr.net/npm/tsparticles-preset-galaxy@3/tsparticles.preset.galaxy.min.js

window.addEventListener('DOMContentLoaded', async () => {
  // Load tsParticles and galaxy preset
  if (!window.tsParticles) {
    await new Promise(resolve => {
      const s1 = document.createElement('script');
      s1.src = 'https://cdn.jsdelivr.net/npm/tsparticles-engine@3/tsparticles.engine.min.js';
      s1.onload = resolve;
      document.head.appendChild(s1);
    });
    await new Promise(resolve => {
      const s2 = document.createElement('script');
      s2.src = 'https://cdn.jsdelivr.net/npm/tsparticles-preset-galaxy@3/tsparticles.preset.galaxy.min.js';
      s2.onload = resolve;
      document.head.appendChild(s2);
    });
  }
  if (window.tsParticles) {
    window.tsParticles.load('particles-js', {
      preset: 'galaxy',
      background: {
        color: '#111',
      },
      particles: {
        number: { value: 120 },
        color: { value: ["#fff", "#FFD600", "#a259ff", "#00c3ff", "#ff0055"] },
        size: { value: { min: 1, max: 3 } },
        move: { enable: true, speed: 0.5 },
        opacity: { value: { min: 0.3, max: 1 } },
        twinkle: { particles: { enable: true, color: '#fff', frequency: 0.1, opacity: 1 } },
      },
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: ["repulse", "trail", "bubble"]
          },
          onClick: { enable: true, mode: "push" },
        },
        modes: {
          repulse: { distance: 120, duration: 0.4 },
          trail: { delay: 0.1, quantity: 8, particles: { color: { value: ["#FFD600", "#fff"] }, opacity: 1 } },
          bubble: { distance: 120, size: 8, duration: 0.6, opacity: 1 },
        }
      },
      detectRetina: true
    });
  }

  // Sun glare effect on nav/product buttons
  function addSunGlare(e) {
    const btn = e.currentTarget;
    let glare = btn.querySelector('.sun-glare');
    if (!glare) {
      glare = document.createElement('span');
      glare.className = 'sun-glare';
      btn.appendChild(glare);
    }
    glare.style.display = 'block';
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glare.style.left = x + 'px';
    glare.style.top = y + 'px';
    glare.classList.add('active');
  }
  function removeSunGlare(e) {
    const btn = e.currentTarget;
    const glare = btn.querySelector('.sun-glare');
    if (glare) glare.classList.remove('active');
  }
  // Attach to nav and product buttons
  document.querySelectorAll('nav a, .product-card button').forEach(btn => {
    btn.addEventListener('mousemove', addSunGlare);
    btn.addEventListener('mouseleave', removeSunGlare);
  });
});
