/**
 * Scene 5: Tonight (small rituals, then rest)
 * 4 tactile icons (water, bag, clock, moon).
 * Sky above collects stars as rituals complete.
 * Moon triggers Sleep Mode ("Rest.").
 * Corner sealed envelope reveals Morning Card after 04:00 on 27 Oct 2026.
 */

window.ReadyApp = window.ReadyApp || {};

window.ReadyApp.initTonightScene = function(sacredTextData, morningCardOpensTime) {
  const skyStars = document.getElementById('skyStars');
  const sleepSkyStars = document.getElementById('sleepSkyStars');
  const sleepOverlay = document.getElementById('sleepOverlay');
  const sleepWord = document.getElementById('sleepWord');

  // Ritual Buttons
  const glassBtn = document.getElementById('ritualGlass');
  const bagBtn = document.getElementById('ritualBag');
  const clockBtn = document.getElementById('ritualClock');
  const moonBtn = document.getElementById('ritualMoon');

  const glassBox = glassBtn?.querySelector('.glass-box');
  const bagBox = bagBtn?.querySelector('.bag-box');
  const clockBox = clockBtn?.querySelector('.clock-box');
  const moonBox = moonBtn?.querySelector('.moon-box');

  // Morning Card elements
  const envelopeBtn = document.getElementById('morningEnvelopeBtn');
  const morningOverlay = document.getElementById('morningCardOverlay');
  const closeMorningBtn = document.getElementById('closeMorningCardBtn');

  const bismillahEl = document.getElementById('morningBismillah');
  const arabic1El = document.getElementById('morningArabic1');
  const trans1El = document.getElementById('morningTrans1');
  const arabic2El = document.getElementById('morningArabic2');
  const trans2El = document.getElementById('morningTrans2');

  // Populate Morning Card sacred text
  if (sacredTextData?.morning) {
    if (bismillahEl && sacredTextData.morning.bismillah) {
      bismillahEl.textContent = sacredTextData.morning.bismillah.arabic;
    }
    const verses = sacredTextData.morning.verses;
    if (verses && verses.length >= 2) {
      if (arabic1El) arabic1El.textContent = verses[0].arabic;
      if (trans1El) trans1El.textContent = verses[0].translation;
      if (arabic2El) arabic2El.textContent = verses[1].arabic;
      if (trans2El) trans2El.textContent = verses[1].translation;
    }
  }

  const STORAGE_KEY_RITUALS = 'ainain_paper2_rituals';
  const STORAGE_KEY_MORNING = 'ainain_paper2_morning_opened';

  let completedRituals = new Set();
  try {
    const saved = localStorage.getItem(STORAGE_KEY_RITUALS);
    if (saved) {
      completedRituals = new Set(JSON.parse(saved));
    }
  } catch (_) {}

  function saveRituals() {
    try {
      localStorage.setItem(STORAGE_KEY_RITUALS, JSON.stringify([...completedRituals]));
    } catch (_) {}
  }

  function addSkyStar(index) {
    if (!skyStars) return;
    const star = document.createElement('div');
    star.className = 'sky-star-point active';
    const lefts = [24, 46, 68, 85];
    const tops = [35, 20, 42, 18];
    star.style.left = `${lefts[index % lefts.length]}%`;
    star.style.top = `${tops[index % tops.length]}%`;
    skyStars.appendChild(star);
  }

  function checkMoonReadiness() {
    if (completedRituals.has('glass') && completedRituals.has('bag') && completedRituals.has('clock')) {
      if (moonBox) moonBox.classList.add('ready');
    }
  }

  if (completedRituals.has('glass')) {
    glassBtn?.classList.add('completed');
    glassBox?.classList.add('filled');
    addSkyStar(0);
  }
  if (completedRituals.has('bag')) {
    bagBtn?.classList.add('completed');
    bagBox?.classList.add('zipped');
    addSkyStar(1);
  }
  if (completedRituals.has('clock')) {
    clockBtn?.classList.add('completed');
    clockBox?.classList.add('settled');
    addSkyStar(2);
  }
  checkMoonReadiness();

  if (glassBtn) {
    glassBtn.addEventListener('click', () => {
      if (!completedRituals.has('glass')) {
        completedRituals.add('glass');
        glassBtn.classList.add('completed');
        glassBox?.classList.add('filled');
        addSkyStar(0);
        saveRituals();
        checkMoonReadiness();
        if ('vibrate' in navigator) try { navigator.vibrate(20); } catch (_) {}
      }
    });
  }

  if (bagBtn) {
    bagBtn.addEventListener('click', () => {
      if (!completedRituals.has('bag')) {
        completedRituals.add('bag');
        bagBtn.classList.add('completed');
        bagBox?.classList.add('zipped');
        addSkyStar(1);
        saveRituals();
        checkMoonReadiness();
        if ('vibrate' in navigator) try { navigator.vibrate(20); } catch (_) {}
      }
    });
  }

  if (clockBtn) {
    clockBtn.addEventListener('click', () => {
      if (!completedRituals.has('clock')) {
        completedRituals.add('clock');
        clockBtn.classList.add('completed');
        clockBox?.classList.add('settled');
        addSkyStar(2);
        saveRituals();
        checkMoonReadiness();
        if ('vibrate' in navigator) try { navigator.vibrate(20); } catch (_) {}
      }
    });
  }

  let sleepWordTimeout = null;

  function populateSleepStars() {
    if (!sleepSkyStars || sleepSkyStars.children.length > 0) return;
    for (let i = 0; i < 16; i++) {
      const star = document.createElement('div');
      star.className = 'sky-star-point active';
      star.style.left = `${Math.random() * 92 + 4}%`;
      star.style.top = `${Math.random() * 80 + 10}%`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      sleepSkyStars.appendChild(star);
    }
  }

  function startSleepMode() {
    populateSleepStars();
    if (sleepOverlay) sleepOverlay.classList.add('active');
    if (moonBox) moonBox.classList.add('ready');

    if (sleepWord) {
      sleepWord.classList.add('visible');
      if (sleepWordTimeout) clearTimeout(sleepWordTimeout);
      sleepWordTimeout = setTimeout(() => {
        sleepWord.classList.remove('visible');
      }, 5500);
    }

    if ('vibrate' in navigator) try { navigator.vibrate(30); } catch (_) {}
  }

  if (moonBtn) {
    moonBtn.addEventListener('click', () => {
      startSleepMode();
    });
  }

  if (sleepOverlay) {
    sleepOverlay.addEventListener('click', () => {
      if (sleepWord && !sleepWord.classList.contains('visible')) {
        sleepWord.classList.add('visible');
        if (sleepWordTimeout) clearTimeout(sleepWordTimeout);
        sleepWordTimeout = setTimeout(() => {
          sleepWord.classList.remove('visible');
        }, 4000);
      }
    });
  }

  // Morning Envelope Logic
  let tapCountBefore0400 = 0;
  let tapTimer = null;

  function isMorningCardUnlocked() {
    // 1. Time check: At or after 04:00 on 27 Oct 2026
    const targetDate = new Date(morningCardOpensTime);
    const now = new Date();
    if (now >= targetDate) return true;

    // 2. Already unlocked in localStorage
    try {
      if (localStorage.getItem(STORAGE_KEY_MORNING) === 'true') return true;
    } catch (_) {}

    // 3. Preview triggers (?morning in URL, window flag, or 3 quick test taps)
    if (new URLSearchParams(window.location.search).has('morning') || window.__unlockMorningCard) {
      return true;
    }

    return false;
  }

  function openMorningCard() {
    if (morningOverlay) morningOverlay.classList.add('active');
    try { localStorage.setItem(STORAGE_KEY_MORNING, 'true'); } catch (_) {}
    if ('vibrate' in navigator) try { navigator.vibrate([25, 50]); } catch (_) {}
  }

  let shakeTimeout = null;

  if (envelopeBtn) {
    envelopeBtn.addEventListener('click', () => {
      if (isMorningCardUnlocked()) {
        openMorningCard();
      } else {
        // Track test taps: 3 quick taps unlocks preview for Kamran
        tapCountBefore0400++;
        if (tapTimer) clearTimeout(tapTimer);
        tapTimer = setTimeout(() => { tapCountBefore0400 = 0; }, 1800);

        if (tapCountBefore0400 >= 3) {
          openMorningCard();
          return;
        }

        // Standard pre-04:00 behavior: soft little shake
        envelopeBtn.classList.remove('shake');
        void envelopeBtn.offsetWidth; // reflow
        envelopeBtn.classList.add('shake');
        if (shakeTimeout) clearTimeout(shakeTimeout);
        shakeTimeout = setTimeout(() => {
          envelopeBtn.classList.remove('shake');
        }, 700);

        if ('vibrate' in navigator) try { navigator.vibrate(15); } catch (_) {}
      }
    });
  }

  if (closeMorningBtn && morningOverlay) {
    closeMorningBtn.addEventListener('click', () => {
      morningOverlay.classList.remove('active');
    });

    morningOverlay.addEventListener('click', (e) => {
      if (e.target === morningOverlay) {
        morningOverlay.classList.remove('active');
      }
    });
  }

  function activate() {}

  function deactivate() {
    if (shakeTimeout) clearTimeout(shakeTimeout);
    if (sleepWordTimeout) clearTimeout(sleepWordTimeout);
    if (tapTimer) clearTimeout(tapTimer);
  }

  return {
    activate,
    deactivate
  };
};
