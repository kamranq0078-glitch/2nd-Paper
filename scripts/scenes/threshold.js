/**
 * Scene 0: Threshold
 * Near-black indigo. A single soft ring of warm gold light pulses slowly
 * at resting heartbeat pace. Her name fades in beneath it in a warm serif.
 */

window.ReadyApp = window.ReadyApp || {};

window.ReadyApp.initThresholdScene = function() {
  const sceneEl = document.getElementById('scene-0');
  const nameEl = document.getElementById('subjectName');

  function activate() {
    if (nameEl) {
      nameEl.style.animation = 'none';
      void nameEl.offsetWidth; // trigger reflow
      nameEl.style.animation = 'nameFadeIn 2.6s cubic-bezier(0.25, 1, 0.5, 1) 1.2s forwards';
    }
  }

  function deactivate() {
    // Clean up if needed
  }

  return {
    activate,
    deactivate
  };
};
