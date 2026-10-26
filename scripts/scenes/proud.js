/**
 * Scene 4: Proud
 * A thin glowing thread with photographs hanging like polaroids.
 * Unedited photos, gentle sway in a soft breeze, small stars twinkling above.
 * Tapping a photo gently lifts and enlarges it; tapping again settles it back.
 */

window.ReadyApp = window.ReadyApp || {};

window.ReadyApp.initProudScene = function() {
  const gallery = document.getElementById('polaroidGallery');
  const items = document.querySelectorAll('.polaroid-item');

  let activeExpandedItem = null;

  function toggleExpand(item) {
    if (activeExpandedItem === item) {
      item.classList.remove('expanded');
      activeExpandedItem = null;
    } else {
      if (activeExpandedItem) {
        activeExpandedItem.classList.remove('expanded');
      }
      item.classList.add('expanded');
      activeExpandedItem = item;

      if ('vibrate' in navigator) {
        try { navigator.vibrate(18); } catch (_) {}
      }
    }
  }

  items.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleExpand(item);
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleExpand(item);
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (activeExpandedItem && !e.target.closest('.polaroid-item')) {
      activeExpandedItem.classList.remove('expanded');
      activeExpandedItem = null;
    }
  });

  function activate() {
    if (activeExpandedItem) {
      activeExpandedItem.classList.remove('expanded');
      activeExpandedItem = null;
    }
  }

  function deactivate() {
    if (activeExpandedItem) {
      activeExpandedItem.classList.remove('expanded');
      activeExpandedItem = null;
    }
  }

  return {
    activate,
    deactivate
  };
};
