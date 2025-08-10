// Shared site enhancements: PWA registration, lazy images, link security
(function () {
  // Register Service Worker after window load to avoid blocking
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function (err) {
        console.warn('Service worker registration failed:', err);
      });
    });
  }

  // Enhance images and links once DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    // Lazy-load all images without explicit loading attribute
    document.querySelectorAll('img:not([loading])').forEach(function (img) {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    });

    // Ensure external links are safe
    document.querySelectorAll('a[target="_blank"]').forEach(function (a) {
      var currentRel = (a.getAttribute('rel') || '').toLowerCase();
      if (!currentRel.includes('noopener')) a.setAttribute('rel', (currentRel + ' noopener').trim());
      if (!currentRel.includes('noreferrer')) a.setAttribute('rel', (a.getAttribute('rel') + ' noreferrer').trim());
    });
  });
})();


