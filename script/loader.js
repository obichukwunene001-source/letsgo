// Page Loader: Ensures a minimum visible delay while waiting for resources to load
(function () {
  'use strict';
  // Reduced minimum loader delay to avoid perceived lag on modern devices
  const minDelay = 300; // milliseconds
  const start = Date.now();
  const overlay = document.getElementById('pageLoader');

  if (!overlay) return;

  function hideOverlay() {
    overlay.setAttribute('aria-hidden', 'true');
    // Use attribute to trigger css transition, also remove DOM after transition
    setTimeout(() => {
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 320);
  }

  // Hide when window fully loaded (images, frames, etc) AND minDelay has passed
  function onFinishedLoading() {
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, minDelay - elapsed);
    setTimeout(hideOverlay, remaining);
  }

  // Always fallback to hide overlay after a hard timeout to avoid infinite loader
  const hardTimeout = setTimeout(hideOverlay, Math.max(minDelay, 10000));

  if (document.readyState === 'complete') {
    clearTimeout(hardTimeout);
    onFinishedLoading();
  } else {
    window.addEventListener('load', () => { clearTimeout(hardTimeout); onFinishedLoading(); }, { once: true });
  }
})();
