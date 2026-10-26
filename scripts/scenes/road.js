/**
 * Scene 1: The Road Here (progress made visible)
 * A wide Kashmir snowfield at dusk.
 * Footprints stretch behind her, and appear ahead one by one as she moves forward.
 * Optional light for Dadyy off to the side, with Sahih Muslim 963 du'a from JSON.
 */

window.ReadyApp = window.ReadyApp || {};

window.ReadyApp.initRoadScene = function(sacredTextData) {
  const container = document.getElementById('footprintsContainer');
  const snowfield = document.getElementById('snowfield');
  const lanternBtn = document.getElementById('dadyyLantern');
  const duaOverlay = document.getElementById('dadyyDuaOverlay');
  const arabicEl = document.getElementById('dadyyArabic');
  const transEl = document.getElementById('dadyyTranslation');

  // Populate Dadyy du'a text from sacred-text.json
  if (sacredTextData?.dadyy) {
    if (arabicEl) arabicEl.textContent = sacredTextData.dadyy.arabic;
    if (transEl) transEl.textContent = sacredTextData.dadyy.translation;
  }

  // Generate footprints along an organic curved trail
  const footprintCount = 14;
  const footprints = [];
  let currentStepIndex = 5; // First 5 steps already walked and visible

  function buildFootprints() {
    if (!container) return;
    container.innerHTML = '';
    footprints.length = 0;

    // Screen-relative path coordinates (from bottom center toward upper middle)
    for (let i = 0; i < footprintCount; i++) {
      const t = i / (footprintCount - 1); // 0 (bottom) to 1 (top/horizon)
      // Perspective perspective scaling: closer (t=0) is larger, farther (t=1) is smaller
      const scale = 1.05 - t * 0.45;
      const bottomPercent = 4 + t * 82; // 4% to 86% from bottom

      // Slight natural S-curve in the snow
      const curveX = Math.sin(t * Math.PI * 1.5) * 35;
      const isLeft = i % 2 === 0;
      const footOffsetX = (isLeft ? -18 : 18) * scale;
      const rotation = (isLeft ? -7 : 7) + Math.cos(t * Math.PI) * 5;

      const printEl = document.createElement('div');
      printEl.className = 'footprint';
      printEl.style.bottom = `${bottomPercent}%`;
      printEl.style.left = `calc(50% + ${curveX + footOffsetX}px)`;
      printEl.style.transform = `translate(-50%, 50%) scale(${scale}) rotate(${rotation}deg)`;

      // Footprint SVG: Organic boot sole print with glowing depression
      printEl.innerHTML = `
        <svg viewBox="0 0 28 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="printInnerGlow-${i}" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <!-- Outer depression contour -->
          <path class="print-indent" d="M14,4 C8,4 5,8 5,16 C5,24 8,28 11,32 C11.5,34 12,38 12,44 C12,46.5 14,47 15,47 C16,47 18,46.5 18,44 C18,38 18.5,34 19,32 C22,28 25,24 25,16 C25,8 22,4 14,4 Z" opacity="0.65"/>
          <!-- Inner warm golden glow -->
          <path class="print-glow" filter="url(#printInnerGlow-${i})" d="M14,7 C9.5,7 7.5,10 7.5,16 C7.5,23 9.8,26.5 12,30 C12.8,32 13.2,36 13.2,42 C13.2,43.5 14,44 14.5,44 C15,44 15.8,43.5 15.8,42 C15.8,36 16.2,32 17,30 C19.2,26.5 21.5,23 21.5,16 C21.5,10 19.5,7 14,7 Z"/>
          <!-- Heel indentation -->
          <ellipse cx="14.5" cy="40" rx="3.5" ry="4.5" fill="#FFE8B6" opacity="0.45"/>
        </svg>
      `;

      container.appendChild(printEl);
      footprints.push(printEl);
    }

    renderVisibleFootprints();
  }

  function renderVisibleFootprints() {
    footprints.forEach((el, idx) => {
      if (idx <= currentStepIndex) {
        el.classList.add('visible');
      } else {
        el.classList.remove('visible');
      }
    });
  }

  // Advance footprint when user scrolls or drags forward
  function advanceStep() {
    if (currentStepIndex < footprintCount - 1) {
      currentStepIndex++;
      renderVisibleFootprints();
      if ('vibrate' in navigator) {
        try { navigator.vibrate(12); } catch (_) {}
      }
    } else {
      // Path already walked ahead -> advance seamlessly to Scene 2
      if (window.ReadyApp && window.ReadyApp.goToScene) {
        window.ReadyApp.goToScene(2);
      }
    }
  }

  // Interactive drag / wheel handler on snowfield
  let startY = 0;
  let isDragging = false;

  function handlePointerDown(e) {
    isDragging = true;
    startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
  }

  function handlePointerMove(e) {
    if (!isDragging) return;
    const currentY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const deltaY = startY - currentY;
    if (deltaY > 28) {
      advanceStep();
      startY = currentY;
    }
  }

  function handlePointerUp() {
    isDragging = false;
  }

  function handleWheel(e) {
    if (e.deltaY > 15) {
      advanceStep();
    }
  }

  if (snowfield) {
    snowfield.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    snowfield.addEventListener('wheel', handleWheel, { passive: true });
    snowfield.addEventListener('click', (e) => {
      if (e.target.closest('#dadyyLantern')) return;
      advanceStep();
    });
  }

  // Dadyy Lantern Interaction
  let hideDuaTimeout = null;

  if (lanternBtn && duaOverlay) {
    lanternBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      duaOverlay.classList.add('active');

      if (hideDuaTimeout) clearTimeout(hideDuaTimeout);
      hideDuaTimeout = setTimeout(() => {
        duaOverlay.classList.remove('active');
      }, 5200);

      if ('vibrate' in navigator) {
        try { navigator.vibrate(25); } catch (_) {}
      }
    });
  }

  function activate() {
    buildFootprints();
  }

  function deactivate() {
    if (hideDuaTimeout) clearTimeout(hideDuaTimeout);
    if (duaOverlay) duaOverlay.classList.remove('active');
  }

  return {
    activate,
    deactivate
  };
};
