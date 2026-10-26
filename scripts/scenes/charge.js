/**
 * Scene 3: Charge
 * Large ring of light in center of dark screen. Press and hold.
 * Ring slowly fills with warm light, whole screen breathes with it (4s in, 6s out).
 * Arabic ayat reveal softly around the ring from sacred-text.json.
 * If released early, ring recedes gently without failure.
 * When full, ring blooms outward, haptic pulse, and "Ready." appears.
 */

window.ReadyApp = window.ReadyApp || {};

window.ReadyApp.initChargeScene = function(sacredTextData) {
  const ringBtn = document.getElementById('chargeRingBtn');
  const ringProgress = document.getElementById('ringProgress');
  const ringInnerCore = document.getElementById('ringInnerCore');
  const chargeAura = document.getElementById('chargeAura');
  const bloomWave = document.getElementById('chargeBloomWave');
  const readyWord = document.getElementById('readyWord');

  // Ayah 1 elements
  const ayah1Container = document.getElementById('chargeAyah1');
  const arabic1El = document.getElementById('chargeArabic1');
  const trans1El = document.getElementById('chargeTrans1');

  // Ayah 2 elements
  const ayah2Container = document.getElementById('chargeAyah2');
  const arabic2El = document.getElementById('chargeArabic2');
  const trans2El = document.getElementById('chargeTrans2');

  // Populate ayat from sacred-text.json
  if (sacredTextData?.charge && sacredTextData.charge.length >= 2) {
    if (arabic1El) arabic1El.textContent = sacredTextData.charge[0].arabic;
    if (trans1El) trans1El.textContent = sacredTextData.charge[0].translation;
    if (arabic2El) arabic2El.textContent = sacredTextData.charge[1].arabic;
    if (trans2El) trans2El.textContent = sacredTextData.charge[1].translation;
  }

  const CIRCUMFERENCE = 753.98; // 2 * PI * 120
  const FILL_DURATION = 8200;   // ~8.2s of calm, continuous hold
  const RECEDE_DURATION = 3200; // ~3.2s to gently drain back if released

  let isHolding = false;
  let progress = 0;
  let isCompleted = false;
  let lastTimestamp = 0;
  let animFrameId = null;

  function updateVisuals() {
    const offset = (1 - progress) * CIRCUMFERENCE;
    if (ringProgress) {
      ringProgress.style.strokeDashoffset = `${offset}`;
    }

    if (ringInnerCore) {
      const radius = 16 + progress * 24;
      ringInnerCore.setAttribute('r', radius);
      ringInnerCore.style.fill = `rgba(243, 201, 126, ${0.25 + progress * 0.65})`;
    }

    if (ayah1Container) {
      if (progress >= 0.32) {
        ayah1Container.classList.add('revealed');
      } else {
        ayah1Container.classList.remove('revealed');
      }
    }

    if (ayah2Container) {
      if (progress >= 0.70) {
        ayah2Container.classList.add('revealed');
      } else {
        ayah2Container.classList.remove('revealed');
      }
    }
  }

  function loop(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const dt = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    if (!isCompleted) {
      if (isHolding) {
        progress += dt / FILL_DURATION;
        if (progress >= 1.0) {
          progress = 1.0;
          onComplete();
        }
      } else {
        if (progress > 0) {
          progress -= dt / RECEDE_DURATION;
          if (progress < 0) progress = 0;
        }
      }
      updateVisuals();
    }

    animFrameId = requestAnimationFrame(loop);
  }

  function onComplete() {
    isCompleted = true;
    updateVisuals();

    if (bloomWave) {
      bloomWave.classList.add('blooming');
    }

    if (readyWord) {
      readyWord.classList.add('visible');
    }

    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([35, 60, 45]);
      } catch (_) {}
    }
  }

  function startHold(e) {
    if (isCompleted) return;
    if (e && e.cancelable) e.preventDefault();
    isHolding = true;

    if (chargeAura) {
      chargeAura.classList.add('breathing');
    }

    if (ringBtn && e && e.pointerId) {
      try { ringBtn.setPointerCapture(e.pointerId); } catch (_) {}
    }
  }

  function stopHold(e) {
    if (isCompleted) return;
    isHolding = false;

    if (chargeAura) {
      chargeAura.classList.remove('breathing');
    }

    if (ringBtn && e && e.pointerId) {
      try { ringBtn.releasePointerCapture(e.pointerId); } catch (_) {}
    }
  }

  if (ringBtn) {
    ringBtn.addEventListener('contextmenu', (e) => e.preventDefault());

    ringBtn.addEventListener('pointerdown', startHold);
    ringBtn.addEventListener('pointerup', stopHold);
    ringBtn.addEventListener('pointercancel', stopHold);
    ringBtn.addEventListener('lostpointercapture', stopHold);

    ringBtn.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!isHolding) startHold(null);
      }
    });

    ringBtn.addEventListener('keyup', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        stopHold(null);
      }
    });
  }

  function activate() {
    lastTimestamp = 0;
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(loop);
    }
  }

  function deactivate() {
    isHolding = false;
    if (chargeAura) chargeAura.classList.remove('breathing');
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  return {
    activate,
    deactivate
  };
};
