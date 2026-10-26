/**
 * "Ready." - For Ainain
 * Senior Motion & Front-End Engineering
 * Silent, tactile, steadying private web experience.
 */

// ============================================================================
// CONFIGURATION CONSTANTS
// Target local time when the Morning Card envelope unlocks and can be opened
// ============================================================================
window.MORNING_CARD_OPENS = '2026-10-27T04:00:00';

window.ReadyApp = window.ReadyApp || {};

// Sacred Text data source (embedded to guarantee 100% reliability offline and under file://)
window.ReadyApp.SACRED_TEXT = {
  charge: [
    {
      key: "whoever_relies",
      arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
      translation: "And whoever relies upon Allah - then He is sufficient for him.",
      reference: "At-Talaq 65:3"
    },
    {
      key: "burden_soul",
      arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
      translation: "Allah does not charge a soul except [with that within] its capacity.",
      reference: "Al-Baqarah 2:286"
    }
  ],
  dadyy: {
    key: "dadyy",
    arabic: "اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ",
    translation: "O Allah, forgive him and have mercy on him.",
    reference: "Sahih Muslim 963"
  },
  morning: {
    bismillah: {
      key: "bismillah",
      arabic: "بِسْمِ اللَّهِ",
      translation: "",
      reference: ""
    },
    verses: [
      {
        key: "expand_breast",
        arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
        translation: "My Lord, expand for me my breast and ease for me my task",
        reference: "Ta-Ha 20:25–26"
      },
      {
        key: "increase_knowledge",
        arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
        translation: "And say, 'My Lord, increase me in knowledge.'",
        reference: "Ta-Ha 20:114"
      }
    ]
  }
};

(function() {
  let currentSceneIndex = 0;
  const sceneControllers = [];
  let sacredText = window.ReadyApp.SACRED_TEXT;

  // ============================================================================
  // AMBIENT & SNOW CANVAS SYSTEM
  // ============================================================================
  function initAmbientCanvas() {
    const canvas = document.getElementById('ambientCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotionQuery.matches) {
      canvas.style.display = 'none';
      return;
    }

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const PARTICLE_COUNT = 65;
    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.4,
        vy: Math.random() * 0.75 + 0.35,
        alpha: Math.random() * 0.65 + 0.25,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.02 + 0.01
      });
    }

    let animId = null;

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);
      const isSnowScene = currentSceneIndex === 1;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.sway += p.swaySpeed;
        p.x += p.vx + Math.sin(p.sway) * 0.45;
        p.y += p.vy;

        if (p.y > height + 5) {
          p.y = -5;
          p.x = Math.random() * width;
        }
        if (p.x < -5) p.x = width + 5;
        if (p.x > width + 5) p.x = -5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

        if (isSnowScene) {
          ctx.fillStyle = `rgba(228, 236, 244, ${p.alpha * 0.8})`;
        } else {
          ctx.fillStyle = `rgba(243, 201, 126, ${p.alpha * 0.42})`;
        }
        ctx.fill();
      }

      animId = requestAnimationFrame(renderParticles);
    }

    animId = requestAnimationFrame(renderParticles);

    reducedMotionQuery.addEventListener('change', (e) => {
      if (e.matches) {
        if (animId) cancelAnimationFrame(animId);
        ctx.clearRect(0, 0, width, height);
        canvas.style.display = 'none';
      } else {
        canvas.style.display = 'block';
        animId = requestAnimationFrame(renderParticles);
      }
    });
  }

  // ============================================================================
  // SCENE NAVIGATION (Fluid Page Sliding)
  // ============================================================================
  let isNavigating = false;

  function updatePageDots(index) {
    const dots = document.querySelectorAll('.page-dot');
    dots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  window.ReadyApp.goToScene = function(targetIndex) {
    const totalScenes = 6;
    if (targetIndex < 0 || targetIndex >= totalScenes) return;
    if (targetIndex === currentSceneIndex || isNavigating) return;

    isNavigating = true;
    const isForward = targetIndex > currentSceneIndex;
    const currentEl = document.getElementById(`scene-${currentSceneIndex}`);
    const nextEl = document.getElementById(`scene-${targetIndex}`);

    // Deactivate controller
    if (sceneControllers[currentSceneIndex]?.deactivate) {
      sceneControllers[currentSceneIndex].deactivate();
    }

    // Set initial position of entering scene before animating
    if (nextEl) {
      nextEl.classList.remove('active', 'exit-up', 'exit-down', 'enter-up', 'enter-down');
      nextEl.classList.add(isForward ? 'enter-down' : 'enter-up');
      void nextEl.offsetWidth; // Force CSS reflow
    }

    // Trigger directional slide
    if (currentEl) {
      currentEl.classList.remove('active');
      currentEl.classList.add(isForward ? 'exit-up' : 'exit-down');
    }

    if (nextEl) {
      nextEl.classList.remove('enter-down', 'enter-up');
      nextEl.classList.add('active');
    }

    const prevIndex = currentSceneIndex;
    currentSceneIndex = targetIndex;
    updatePageDots(currentSceneIndex);

    // Activate controller
    if (sceneControllers[currentSceneIndex]?.activate) {
      sceneControllers[currentSceneIndex].activate();
    }

    if ('vibrate' in navigator) {
      try { navigator.vibrate(15); } catch (_) {}
    }

    // Clean up exit classes after animation finishes
    setTimeout(() => {
      if (currentEl) {
        currentEl.classList.remove('exit-up', 'exit-down');
      }
      isNavigating = false;
    }, 760);
  };

  function initNavigationGestures() {
    // 1. Scene Handles
    const handles = document.querySelectorAll('.scene-handle');
    handles.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const next = parseInt(btn.dataset.next, 10);
        if (!isNaN(next)) {
          window.ReadyApp.goToScene(next);
        }
      });
    });

    // 2. Trackpad / Mouse Wheel Scroll (Two-finger swipe on Mac trackpad)
    let isWheeling = false;
    let wheelTimer = null;

    window.addEventListener('wheel', (e) => {
      if (document.querySelector('.polaroid-item.expanded')) return;
      if (document.querySelector('.morning-card-overlay.active')) return;
      if (document.querySelector('.sleep-overlay.active')) return;

      if (isWheeling) return;

      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) > 18) {
        if (delta > 0) {
          // Scroll down / swipe up trackpad -> Next page
          isWheeling = true;
          window.ReadyApp.goToScene(currentSceneIndex + 1);
        } else {
          // Scroll up / swipe down trackpad -> Prev page
          isWheeling = true;
          window.ReadyApp.goToScene(currentSceneIndex - 1);
        }

        clearTimeout(wheelTimer);
        wheelTimer = setTimeout(() => {
          isWheeling = false;
        }, 700);
      }
    }, { passive: true });

    // 3. Touch Swipe (Mobile thumb swipe - vertical and horizontal)
    let touchStartX = 0;
    let touchStartY = 0;
    let touchActive = false;

    window.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchActive = true;
      }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (!touchActive || e.changedTouches.length === 0) return;
      touchActive = false;

      if (document.querySelector('.polaroid-item.expanded')) return;
      if (document.querySelector('.morning-card-overlay.active')) return;
      if (document.querySelector('.sleep-overlay.active')) return;

      const deltaX = touchStartX - e.changedTouches[0].clientX;
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Threshold: 36px swipe distance
      if (absY > 36 || absX > 36) {
        if (absY >= absX) {
          // Vertical swipe
          if (deltaY > 36) {
            window.ReadyApp.goToScene(currentSceneIndex + 1); // Swipe Up -> Next
          } else if (deltaY < -36) {
            window.ReadyApp.goToScene(currentSceneIndex - 1); // Swipe Down -> Prev
          }
        } else {
          // Horizontal swipe
          if (deltaX > 36) {
            window.ReadyApp.goToScene(currentSceneIndex + 1); // Swipe Left -> Next
          } else if (deltaX < -36) {
            window.ReadyApp.goToScene(currentSceneIndex - 1); // Swipe Right -> Prev
          }
        }
      }
    }, { passive: true });

    // 4. Desktop Mouse Drag (Click & drag to swipe)
    let mouseStartX = 0;
    let mouseStartY = 0;
    let isMouseDown = false;

    window.addEventListener('mousedown', (e) => {
      if (e.target.closest('#threadArena, #chargeRingBtn, .polaroid-item, .ritual-btn, .scene-handle, #morningEnvelopeBtn, .page-dot')) return;
      mouseStartX = e.clientX;
      mouseStartY = e.clientY;
      isMouseDown = true;
    });

    window.addEventListener('mouseup', (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;

      const deltaX = mouseStartX - e.clientX;
      const deltaY = mouseStartY - e.clientY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absY > 40 || absX > 40) {
        if (absY >= absX) {
          if (deltaY > 40) window.ReadyApp.goToScene(currentSceneIndex + 1);
          else if (deltaY < -40) window.ReadyApp.goToScene(currentSceneIndex - 1);
        } else {
          if (deltaX > 40) window.ReadyApp.goToScene(currentSceneIndex + 1);
          else if (deltaX < -40) window.ReadyApp.goToScene(currentSceneIndex - 1);
        }
      }
    });

    // 5. Keyboard Navigation (Arrow keys, Space, PageDown/PageUp)
    window.addEventListener('keydown', (e) => {
      if (document.querySelector('.morning-card-overlay.active')) return;
      if (document.querySelector('.sleep-overlay.active')) return;

      if (e.key === 'PageDown' || e.key === 'ArrowDown') {
        // Only arrow down if not tracing thread
        if (currentSceneIndex !== 2) {
          window.ReadyApp.goToScene(currentSceneIndex + 1);
        }
      } else if (e.key === 'PageUp' || e.key === 'ArrowUp') {
        if (currentSceneIndex !== 2) {
          window.ReadyApp.goToScene(currentSceneIndex - 1);
        }
      }
    });
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  async function initApp() {
    // Attempt fetch from sacred-text.json if running on server
    try {
      const res = await fetch('content/sacred-text.json');
      if (res.ok) {
        const loaded = await res.json();
        if (loaded && loaded.charge) {
          sacredText = loaded;
        }
      }
    } catch (_) {
      // Offline or file:// - already using embedded ReadyApp.SACRED_TEXT
    }

    initAmbientCanvas();

    // Initialize scenes safely
    const R = window.ReadyApp;
    if (R.initThresholdScene) sceneControllers[0] = R.initThresholdScene();
    if (R.initRoadScene) sceneControllers[1] = R.initRoadScene(sacredText);
    if (R.initThreadScene) sceneControllers[2] = R.initThreadScene();
    if (R.initChargeScene) sceneControllers[3] = R.initChargeScene(sacredText);
    if (R.initProudScene) sceneControllers[4] = R.initProudScene();
    if (R.initTonightScene) sceneControllers[5] = R.initTonightScene(sacredText, window.MORNING_CARD_OPENS);

    initNavigationGestures();

    if (sceneControllers[0]?.activate) {
      sceneControllers[0].activate();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
