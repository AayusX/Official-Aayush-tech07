document.addEventListener('DOMContentLoaded', () => {
  // Scroll-reveal
  const revealElems = document.querySelectorAll('.reveal');
  window.addEventListener('scroll', () => {
    revealElems.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 100) {
        el.classList.add('show');
      }
    });
  });

  // Hamburger nav toggle
  const menuBtn = document.querySelector('.toggle-btn');
  const navUl = document.querySelector('.nav ul');
  menuBtn.addEventListener('click', () => {
    navUl.classList.toggle('show');
  });

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    themeToggle.innerHTML = next === 'dark' ? '🌙' : '☀️';
  });
  // Init from stored preference
  const saved = localStorage.getItem('theme') || 'light';
  applyTheme(saved);
  themeToggle.innerHTML = saved === 'dark' ? '🌙' : '☀️';
});
