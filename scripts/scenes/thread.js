/**
 * Scene 2: Steady Hands
 * One fine golden thread laid out as a gentle curved path across the screen.
 * Tracing is smoothed and softly magnetized. No failure state, no score.
 * Upon completion, thread draws into a golden knot blooming into a star, and "Steady." fades in.
 */

window.ReadyApp = window.ReadyApp || {};

window.ReadyApp.initThreadScene = function() {
  const arena = document.getElementById('threadArena');
  const svg = document.getElementById('threadSvg');
  const guidePath = document.getElementById('guidePath');
  const tracedPath = document.getElementById('tracedPath');
  const bead = document.getElementById('threadBead');
  const endTarget = document.getElementById('endTarget');
  const knotBloom = document.getElementById('knotBloom');
  const steadyWord = document.getElementById('steadyWord');

  const pathD = 'M 110,470 C 220,180 580,440 690,130';
  let totalLength = 0;
  const samples = [];
  const SAMPLE_COUNT = 300;

  let isTracing = false;
  let currentProgress = 0;
  let targetProgress = 0;
  let isCompleted = false;
  let animFrameId = null;
  let steadyWordTimeout = null;

  function setupPath() {
    if (!guidePath || !tracedPath) return;
    guidePath.setAttribute('d', pathD);
    tracedPath.setAttribute('d', pathD);

    totalLength = guidePath.getTotalLength();
    tracedPath.style.strokeDasharray = `${totalLength}`;
    tracedPath.style.strokeDashoffset = `${totalLength}`;

    samples.length = 0;
    for (let i = 0; i <= SAMPLE_COUNT; i++) {
      const len = (i / SAMPLE_COUNT) * totalLength;
      const pt = guidePath.getPointAtLength(len);
      samples.push({ x: pt.x, y: pt.y, progress: i / SAMPLE_COUNT, length: len });
    }

    const endPt = samples[samples.length - 1];
    if (endTarget) {
      endTarget.setAttribute('transform', `translate(${endPt.x}, ${endPt.y})`);
    }
    if (knotBloom) {
      knotBloom.setAttribute('cx', endPt.x);
      knotBloom.setAttribute('cy', endPt.y);
    }

    updateBeadPosition(0);
  }

  function updateBeadPosition(prog) {
    if (!bead || !guidePath) return;
    const len = prog * totalLength;
    const pt = guidePath.getPointAtLength(len);
    bead.setAttribute('transform', `translate(${pt.x}, ${pt.y})`);
  }

  function getSvgCoords(clientX, clientY) {
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    return pt.matrixTransform(ctm.inverse());
  }

  function projectToPath(x, y) {
    let closestIndex = 0;
    let minDistanceSq = Infinity;

    for (let i = 0; i < samples.length; i++) {
      const s = samples[i];
      const dx = s.x - x;
      const dy = s.y - y;
      const distSq = dx * dx + dy * dy;
      if (distSq < minDistanceSq) {
        minDistanceSq = distSq;
        closestIndex = i;
      }
    }

    const projectedProg = samples[closestIndex].progress;
    if (minDistanceSq < 180 * 180) {
      if (projectedProg > targetProgress && projectedProg <= targetProgress + 0.35) {
        targetProgress = projectedProg;
      }
    }
  }

  function loop() {
    if (currentProgress < targetProgress) {
      currentProgress += (targetProgress - currentProgress) * 0.22;
      if (targetProgress - currentProgress < 0.002) {
        currentProgress = targetProgress;
      }

      const offset = (1 - currentProgress) * totalLength;
      tracedPath.style.strokeDashoffset = `${offset}`;
      updateBeadPosition(currentProgress);

      if (currentProgress >= 0.985 && !isCompleted) {
        completeThread();
      }
    }

    animFrameId = requestAnimationFrame(loop);
  }

  function completeThread() {
    isCompleted = true;
    currentProgress = 1;
    targetProgress = 1;
    tracedPath.style.strokeDashoffset = '0';
    updateBeadPosition(1);

    if (knotBloom) {
      knotBloom.classList.add('blooming');
    }

    if (steadyWord) {
      steadyWord.classList.add('visible');
      if (steadyWordTimeout) clearTimeout(steadyWordTimeout);
      steadyWordTimeout = setTimeout(() => {
        steadyWord.classList.remove('visible');
      }, 4200);
    }

    if ('vibrate' in navigator) {
      try { navigator.vibrate([25, 50, 30]); } catch (_) {}
    }
  }

  function handlePointerDown(e) {
    if (isCompleted) return;
    isTracing = true;
    try { arena.setPointerCapture(e.pointerId); } catch (_) {}
    const coords = getSvgCoords(e.clientX, e.clientY);
    projectToPath(coords.x, coords.y);
  }

  function handlePointerMove(e) {
    if (!isTracing || isCompleted) return;
    const coords = getSvgCoords(e.clientX, e.clientY);
    projectToPath(coords.x, coords.y);
  }

  function handlePointerUp(e) {
    isTracing = false;
    try { arena.releasePointerCapture(e.pointerId); } catch (_) {}
  }

  function handleKeyDown(e) {
    if (isCompleted) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      targetProgress = Math.min(1, targetProgress + 0.08);
    }
  }

  if (arena) {
    arena.addEventListener('pointerdown', handlePointerDown);
    arena.addEventListener('pointermove', handlePointerMove);
    arena.addEventListener('pointerup', handlePointerUp);
    arena.addEventListener('pointercancel', handlePointerUp);
    window.addEventListener('keydown', handleKeyDown);
  }

  function activate() {
    setupPath();
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(loop);
    }
  }

  function deactivate() {
    isTracing = false;
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    if (steadyWordTimeout) clearTimeout(steadyWordTimeout);
  }

  return {
    activate,
    deactivate
  };
};
