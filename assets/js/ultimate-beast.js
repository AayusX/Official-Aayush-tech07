// ====================================
// ULTIMATE BEAST JAVASCRIPT 2024
// Mind-Blowing Interactive Experience
// ====================================

class CyberWebsite {
  constructor() {
    this.isLoaded = false;
    this.isMobile = window.innerWidth < 768;
    this.mouseX = 0;
    this.mouseY = 0;
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.matrixColumns = [];
    this.particles = [];
    this.audioContext = null;
    this.analyzer = null;
    this._matrixResizeListener = null;
    
    this.init();
  }

  init() {
    this.setupLoading();
    this.setupMatrixRain();
    this.setupNavigation();
    this.setupScrollEffects();
    this.setupCursor();
    this.setupParticleSystem();
    this.setup3DEffects();
    this.setupAudioVisualization();
    this.setupHolographicEffects();
    this.setupGlitchEffects();
    this.setupPerformanceOptimizations();
    this.setupAdvancedAnimations();
  }

  // ===== ADVANCED LOADING SYSTEM =====
  setupLoading() {
    const loadingScreen = document.querySelector('.ultimate-loading');
    const progressFill = document.querySelector('.progress-fill');
    const loadingText = document.querySelector('.loading-text');
    
    if (!loadingScreen) return;

    const loadingMessages = [
      'INITIALIZING CYBER MATRIX...',
      'LOADING QUANTUM PROCESSORS...',
      'ESTABLISHING NEURAL LINKS...',
      'ACTIVATING HOLOGRAPHIC DISPLAY...',
      'CALIBRATING NEON SYSTEMS...',
      'SYNCHRONIZING REALITY...'
    ];

    let progress = 0;
    let messageIndex = 0;

    const progressInterval = setInterval(() => {
      progress += Math.random() * 12 + 3;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        
        setTimeout(() => {
          loadingScreen.classList.add('fade-out');
          document.body.style.overflow = 'visible';
          this.isLoaded = true;
          this.triggerEntranceAnimations();
        }, 800);
      }

      if (progressFill) {
        progressFill.style.width = `${progress}%`;
      }

      // Change loading messages
      if (progress > messageIndex * 16.66 && messageIndex < loadingMessages.length - 1) {
        messageIndex++;
        if (loadingText) {
          loadingText.textContent = loadingMessages[messageIndex];
        }
      }
    }, 150);
  }

  // ===== MATRIX RAIN EFFECT =====
  setupMatrixRain() {
    if (this.isMobile || this.prefersReducedMotion()) return;

    let matrixContainer = document.querySelector('.matrix-rain');
    if (!matrixContainer) {
      matrixContainer = document.createElement('div');
      matrixContainer.className = 'matrix-rain';
      document.body.appendChild(matrixContainer);
    }

    // Clear previous columns to avoid duplicates
    matrixContainer.innerHTML = '';

    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const columnCount = Math.max(10, Math.floor(this.windowWidth / 24));

    for (let i = 0; i < columnCount; i++) {
      this.createMatrixColumn(i, characters);
    }

    // Single resize listener
    if (this._matrixResizeListener) {
      window.removeEventListener('resize', this._matrixResizeListener);
    }
    this._matrixResizeListener = this.debounce(() => {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
      this.isMobile = this.windowWidth < 768;
      if (!this.isMobile && !this.prefersReducedMotion()) {
        this.setupMatrixRain();
      } else if (matrixContainer) {
        matrixContainer.innerHTML = '';
      }
    }, 300);
    window.addEventListener('resize', this._matrixResizeListener);
  }

  createMatrixColumn(index, characters) {
    const column = document.createElement('div');
    column.className = 'matrix-column';
    column.style.left = `${index * 20}px`;
    column.style.animationDuration = `${Math.random() * 3 + 2}s`;
    column.style.animationDelay = `${Math.random() * 5}s`;

    // Generate random characters for this column
    let columnText = '';
    const length = Math.floor(Math.random() * 20) + 10;
    for (let i = 0; i < length; i++) {
      columnText += characters[Math.floor(Math.random() * characters.length)] + '<br>';
    }
    column.innerHTML = columnText;

    const matrixContainer = document.querySelector('.matrix-rain');
    if (matrixContainer) {
      matrixContainer.appendChild(column);
    }

    // Remove and recreate column after animation
    setTimeout(() => {
      if (column.parentNode) {
        column.parentNode.removeChild(column);
        this.createMatrixColumn(index, characters);
      }
    }, 8000);
  }

  // ===== ADVANCED NAVIGATION =====
  setupNavigation() {
    const nav = document.querySelector('.cyber-nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.cyber-menu');
    const navLinks = document.querySelectorAll('.cyber-link');

    // Smooth scroll for hash links; allow normal navigation for others
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href') || '';
        if (href.startsWith('#')) {
          e.preventDefault();
          const targetElement = document.querySelector(href);
          if (targetElement) {
            this.smoothScrollTo(targetElement.offsetTop - 100, 1000);

            // Update active link with cyber effect
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Add cyber pulse effect
            this.addCyberPulse(link);

            // Close mobile menu
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
          }
        } else {
          // Close mobile menu before navigation
          if (navMenu) navMenu.classList.remove('active');
          if (navToggle) navToggle.classList.remove('active');
        }
      });
    });

    // Mobile menu toggle with animation
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        const expanded = navToggle.classList.contains('active');
        navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        navMenu.setAttribute('aria-hidden', expanded ? 'false' : 'true');
        
        // Add glitch effect
        this.addGlitchEffect(navToggle);
      });
      // Initialize ARIA
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Toggle navigation menu');
      navMenu.setAttribute('role', 'navigation');
      navMenu.setAttribute('aria-hidden', 'true');
    }

    // Navbar scroll effects
    if (nav) {
      window.addEventListener('scroll', this.throttle(() => {
        if (window.scrollY > 50) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }, 16));
    }

    // Active section detection with cyber highlighting
    this.setupActiveSection(navLinks);
  }

  setupActiveSection(navLinks) {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentSection = entry.target.getAttribute('id');
          
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
              link.classList.add('active');
              this.addCyberPulse(link);
            }
          });
        }
      });
    }, { threshold: 0.6 });

    sections.forEach(section => observer.observe(section));
  }

  // ===== SCROLL EFFECTS =====
  setupScrollEffects() {
    // Scroll progress with cyber glow
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
      window.addEventListener('scroll', this.throttle(() => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = `${scrollPercent}%`;
        
        // Add dynamic glow based on scroll position
        const hue = scrollPercent * 3.6; // 360 degrees
        progressBar.style.filter = `hue-rotate(${hue}deg)`;
      }, 16));
    }

    // Back to top button with 3D effect
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
      window.addEventListener('scroll', this.throttle(() => {
        if (window.scrollY > 500) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      }, 100));

      backToTop.addEventListener('click', () => {
        this.smoothScrollTo(0, 1200);
        this.addCyberPulse(backToTop);
      });
    }

    // Parallax effects for 3D elements
    this.setupParallax();
  }

  setupParallax() {
    const parallaxElements = document.querySelectorAll('.cube, .holographic-display');
    
    window.addEventListener('scroll', this.throttle(() => {
      const scrollY = window.scrollY;
      
      parallaxElements.forEach((element, index) => {
        const speed = 0.1 + (index * 0.05);
        const yPos = -(scrollY * speed);
        const rotateY = scrollY * 0.1;
        
        element.style.transform = `translateY(${yPos}px) rotateY(${rotateY}deg)`;
      });
    }, 16));
  }

  // ===== CUSTOM CURSOR WITH CYBER EFFECTS =====
  setupCursor() {
    if (window.innerWidth < 768) return; // Skip on mobile

    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      this.mouseX = mouseX;
      this.mouseY = mouseY;
    });

    // Smooth cursor follow
    const updateCursor = () => {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      
      cursorX += dx * 0.2;
      cursorY += dy * 0.2;
      
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      
      requestAnimationFrame(updateCursor);
    };
    
    updateCursor();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .cyber-btn, .nav-toggle');
    hoverElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        this.addCyberTrail(element);
      });
      
      element.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
      });
    });

    // Click effects
    document.addEventListener('click', (e) => {
      this.createClickWave(e.clientX, e.clientY);
    });
  }

  // ===== PARTICLE SYSTEM =====
  setupParticleSystem() {
    if (this.prefersReducedMotion()) return;
    this.particleCanvas = document.createElement('canvas');
    this.particleCanvas.style.position = 'fixed';
    this.particleCanvas.style.top = '0';
    this.particleCanvas.style.left = '0';
    this.particleCanvas.style.width = '100%';
    this.particleCanvas.style.height = '100%';
    this.particleCanvas.style.pointerEvents = 'none';
    this.particleCanvas.style.zIndex = '5';
    this.particleCanvas.style.opacity = '0.7';
    document.body.appendChild(this.particleCanvas);

    this.particleCtx = this.particleCanvas.getContext('2d');
    this.resizeParticleCanvas();

    // Create initial particles
    const initial = this.isMobile ? 12 : 40;
    for (let i = 0; i < initial; i++) {
      this.particles.push(this.createParticle());
    }

    this.animateParticles();

    window.addEventListener('resize', () => {
      this.resizeParticleCanvas();
    });

    // Add particles on interaction
    document.addEventListener('click', (e) => {
      const burst = this.isMobile ? 2 : 5;
      for (let i = 0; i < burst; i++) {
        this.particles.push(this.createParticle(e.clientX, e.clientY));
      }
    });
  }

  resizeParticleCanvas() {
    const dpr = window.devicePixelRatio || 1;
    this.particleCanvas.width = window.innerWidth * dpr;
    this.particleCanvas.height = window.innerHeight * dpr;
    this.particleCtx.scale(dpr, dpr);
    this.particleCanvas.style.width = window.innerWidth + 'px';
    this.particleCanvas.style.height = window.innerHeight + 'px';
  }

  createParticle(x = null, y = null) {
    return {
      x: x || Math.random() * window.innerWidth,
      y: y || Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      life: 1,
      decay: Math.random() * 0.02 + 0.005,
      color: this.getRandomNeonColor(),
      trail: []
    };
  }

  getRandomNeonColor() {
    const colors = ['#00f5ff', '#8a2be2', '#39ff14', '#ff1493', '#ffd700'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  animateParticles() {
    this.particleCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    // Update and draw particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Add to trail
      particle.trail.push({ x: particle.x, y: particle.y });
      if (particle.trail.length > 10) {
        particle.trail.shift();
      }
      
      // Update life
      particle.life -= particle.decay;
      
      // Remove dead particles
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      
      // Draw trail
      this.particleCtx.strokeStyle = particle.color;
      this.particleCtx.lineWidth = particle.size;
      this.particleCtx.globalAlpha = particle.life * 0.5;
      
      this.particleCtx.beginPath();
      if (particle.trail.length > 1) {
        this.particleCtx.moveTo(particle.trail[0].x, particle.trail[0].y);
        for (let j = 1; j < particle.trail.length; j++) {
          this.particleCtx.lineTo(particle.trail[j].x, particle.trail[j].y);
        }
        this.particleCtx.stroke();
      }
      
      // Draw particle
      this.particleCtx.fillStyle = particle.color;
      this.particleCtx.globalAlpha = particle.life;
      this.particleCtx.beginPath();
      this.particleCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.particleCtx.fill();
    }
    
    // Maintain particle count
    while (this.particles.length < 30) {
      this.particles.push(this.createParticle());
    }
    
    requestAnimationFrame(() => this.animateParticles());
  }

  // ===== 3D EFFECTS =====
  setup3DEffects() {
    if (!this.prefersReducedMotion()) {
      this.setup3DCubes();
      this.setupHolographicDisplay();
      this.setupMouseTrackingEffects();
    }
  }

  setup3DCubes() {
    const cubesContainer = document.querySelector('.floating-cubes');
    if (!cubesContainer) {
      const container = document.createElement('div');
      container.className = 'floating-cubes';
      const heroScene = document.querySelector('.hero-3d-scene');
      if (heroScene) {
        heroScene.appendChild(container);
      }
    }

    // Create 3D cubes with advanced animations
    const count = this.isMobile ? 3 : 8;
    for (let i = 0; i < count; i++) {
      this.create3DCube(i);
    }
  }

  create3DCube(index) {
    const cube = document.createElement('div');
    cube.className = 'cube';
    cube.style.cssText = `
      position: absolute;
      width: ${30 + Math.random() * 20}px;
      height: ${30 + Math.random() * 20}px;
      background: linear-gradient(45deg, #00f5ff, #8a2be2, #ff1493);
      transform-style: preserve-3d;
      animation-delay: ${-index}s;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      opacity: 0.6;
      border: 1px solid rgba(0, 245, 255, 0.5);
      box-shadow: 0 0 20px rgba(0, 245, 255, 0.3);
    `;

    // Add mouse interaction
    cube.addEventListener('mouseenter', () => {
      cube.style.animation = 'none';
      cube.style.transform = 'scale(1.5) rotateX(45deg) rotateY(45deg)';
      cube.style.boxShadow = '0 0 30px rgba(0, 245, 255, 0.8)';
    });

    cube.addEventListener('mouseleave', () => {
      cube.style.animation = 'cubeFloat 10s ease-in-out infinite';
      cube.style.transform = '';
      cube.style.boxShadow = '0 0 20px rgba(0, 245, 255, 0.3)';
    });

    const cubesContainer = document.querySelector('.floating-cubes');
    if (cubesContainer) {
      cubesContainer.appendChild(cube);
    }
  }

  setupHolographicDisplay() {
    const display = document.querySelector('.holographic-display');
    if (display) {
      // Add data streaming effect
      this.addDataStream(display);
      
      // Add interactive scan lines
      this.addScanLines(display);
      
      // Add glitch effects
      setInterval(() => {
        if (Math.random() > 0.8) {
          this.addGlitchEffect(display);
        }
      }, 3000);
    }
  }

  setupMouseTrackingEffects() {
    document.addEventListener('mousemove', (e) => {
      const hero = document.querySelector('.ultimate-hero');
      if (hero) {
        const rect = hero.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const rotateX = (mouseY - centerY) / centerY * 10;
        const rotateY = (mouseX - centerX) / centerX * 10;
        
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent) {
          heroContent.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
        }
      }
    });
  }

  // ===== AUDIO VISUALIZATION =====
  setupAudioVisualization() {
    // Create silent audio context for frequency analysis
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyzer = this.audioContext.createAnalyser();
      
      // Create oscillator for ambient frequency
      const oscillator = this.audioContext.createOscillator();
      oscillator.frequency.setValueAtTime(0.1, this.audioContext.currentTime);
      oscillator.connect(this.analyzer);
      oscillator.start();
      
      this.visualizeAudio();
    } catch (error) {
      console.log('Audio context not available');
    }
  }

  visualizeAudio() {
    if (!this.analyzer) return;
    
    const bufferLength = this.analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const animate = () => {
      this.analyzer.getByteFrequencyData(dataArray);
      
      // Use audio data to affect visual elements
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
      const intensity = average / 255;
      
      // Affect particle system
      if (intensity > 0.1 && this.particles.length < 100) {
        for (let i = 0; i < Math.floor(intensity * 5); i++) {
          this.particles.push(this.createParticle());
        }
      }
      
      // Affect title pulsing
      const title = document.querySelector('.cyber-title');
      if (title) {
        title.style.filter = `hue-rotate(${intensity * 360}deg) brightness(${1 + intensity})`;
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }

  // ===== HOLOGRAPHIC EFFECTS =====
  setupHolographicEffects() {
    // Add holographic scan lines to elements
    const holoElements = document.querySelectorAll('.holographic-display, .cyber-badge');
    holoElements.forEach(element => {
      this.addHolographicOverlay(element);
    });
  }

  addHolographicOverlay(element) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 245, 255, 0.03) 2px,
        rgba(0, 245, 255, 0.03) 4px
      );
      pointer-events: none;
      opacity: 0.5;
      animation: scanLines 3s linear infinite;
    `;
    
    element.style.position = 'relative';
    element.appendChild(overlay);
  }

  addDataStream(element) {
    const dataStream = document.createElement('div');
    dataStream.style.cssText = `
      position: absolute;
      top: 20px;
      left: 20px;
      font-family: 'Courier New', monospace;
      font-size: 10px;
      color: #39ff14;
      opacity: 0.7;
      line-height: 1.2;
    `;
    
    const streamData = [
      '> NEURAL LINK ESTABLISHED',
      '> QUANTUM ENCRYPTION: ACTIVE',
      '> DATA STREAM: 1.21 GW/s',
      '> HOLOGRAPHIC PROJECTION: STABLE',
      '> CYBERNETIC INTERFACE: ONLINE'
    ];
    
    let currentIndex = 0;
    setInterval(() => {
      dataStream.innerHTML = streamData.slice(0, currentIndex + 1).join('<br>');
      currentIndex = (currentIndex + 1) % streamData.length;
      if (currentIndex === 0) {
        setTimeout(() => dataStream.innerHTML = '', 1000);
      }
    }, 2000);
    
    element.appendChild(dataStream);
  }

  addScanLines(element) {
    const scanLine = document.createElement('div');
    scanLine.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, #00f5ff, transparent);
      animation: scanVertical 4s ease-in-out infinite;
      opacity: 0.8;
    `;
    
    element.appendChild(scanLine);
  }

  // ===== GLITCH EFFECTS =====
  setupGlitchEffects() {
    // Add random glitch effects
    setInterval(() => {
      if (Math.random() > 0.9) {
        this.triggerRandomGlitch();
      }
    }, 5000);
  }

  addGlitchEffect(element) {
    element.style.animation = 'glitch 0.3s ease-in-out';
    setTimeout(() => {
      element.style.animation = '';
    }, 300);
    
    // Add CSS animation if not exists
    if (!document.querySelector('#glitch-styles')) {
      const style = document.createElement('style');
      style.id = 'glitch-styles';
      style.textContent = `
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        
        @keyframes scanLines {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        
        @keyframes scanVertical {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  triggerRandomGlitch() {
    const glitchElements = document.querySelectorAll('.cyber-title, .cyber-badge, .nav-cta');
    const randomElement = glitchElements[Math.floor(Math.random() * glitchElements.length)];
    if (randomElement) {
      this.addGlitchEffect(randomElement);
    }
  }

  // ===== CYBER EFFECTS =====
  addCyberPulse(element) {
    element.style.boxShadow = '0 0 20px #00f5ff, 0 0 40px #00f5ff, 0 0 60px #00f5ff';
    setTimeout(() => {
      element.style.boxShadow = '';
    }, 500);
  }

  addCyberTrail(element) {
    // Create trailing particles
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.particles.push(this.createParticle(this.mouseX, this.mouseY));
      }, i * 50);
    }
  }

  createClickWave(x, y) {
    const wave = document.createElement('div');
    wave.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 20px;
      height: 20px;
      border: 2px solid #00f5ff;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: clickWave 0.6s ease-out;
      pointer-events: none;
      z-index: 10000;
    `;
    
    document.body.appendChild(wave);
    
    setTimeout(() => {
      wave.remove();
    }, 600);
    
    // Add CSS animation
    if (!document.querySelector('#click-wave-styles')) {
      const style = document.createElement('style');
      style.id = 'click-wave-styles';
      style.textContent = `
        @keyframes clickWave {
          0% {
            width: 20px;
            height: 20px;
            opacity: 1;
          }
          100% {
            width: 100px;
            height: 100px;
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ===== ADVANCED ANIMATIONS =====
  setupAdvancedAnimations() {
    // Intersection Observer for advanced animations
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.triggerElementAnimation(entry.target);
        }
      });
    }, { threshold: 0.3 });

    // Observe all sections and important elements
    const animatedElements = document.querySelectorAll('section, .cyber-btn, .stat-item');
    animatedElements.forEach(element => {
      animationObserver.observe(element);
    });
  }

  triggerElementAnimation(element) {
    // Add different animations based on element type
    if (element.classList.contains('cyber-btn')) {
      element.style.animation = 'slideInUp 0.8s ease-out';
    } else if (element.classList.contains('stat-item')) {
      this.animateCounter(element);
    } else {
      element.style.animation = 'fadeIn 1s ease-out';
    }
  }

  animateCounter(element) {
    const numberElement = element.querySelector('.stat-number');
    if (numberElement) {
      const target = parseInt(numberElement.textContent);
      let current = 0;
      const increment = target / 60; // 1 second animation at 60fps
      
      const updateCounter = () => {
        if (current < target) {
          current += increment;
          numberElement.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          numberElement.textContent = target;
        }
      };
      
      updateCounter();
    }
  }

  triggerEntranceAnimations() {
    // Hero entrance animations
    const heroElements = document.querySelectorAll('.cyber-badge, .cyber-title, .cyber-subtitle, .hero-actions');
    heroElements.forEach((element, index) => {
      setTimeout(() => {
        element.style.animation = `slideInUp 1s ease-out ${index * 0.2}s both`;
      }, 200);
    });

    // 3D scene activation
    const scene3D = document.querySelector('.hero-3d-scene');
    if (scene3D) {
      scene3D.style.animationPlayState = 'running';
    }
  }

  // ===== PERFORMANCE OPTIMIZATIONS =====
  setupPerformanceOptimizations() {
    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      this.reduceAnimations();
    }

    // Respect user preference for reduced motion
    if (this.prefersReducedMotion()) {
      this.reduceAnimations();
    }

    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAnimations();
      } else {
        this.resumeAnimations();
      }
    });

    // Memory cleanup
    setInterval(() => {
      this.cleanupParticles();
    }, 30000);
  }

  reduceAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      * {
        animation-duration: 0.1s !important;
        animation-delay: 0s !important;
        transition-duration: 0.1s !important;
      }
    `;
    document.head.appendChild(style);
  }

  pauseAnimations() {
    document.body.style.animationPlayState = 'paused';
  }

  resumeAnimations() {
    document.body.style.animationPlayState = 'running';
  }

  cleanupParticles() {
    if (this.particles.length > 100) {
      this.particles = this.particles.slice(-50);
    }
  }

  // ===== UTILITY FUNCTIONS =====
  smoothScrollTo(target, duration) {
    const start = window.scrollY;
    const startTime = performance.now();
    
    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeInOutCubic = progress < 0.5 
        ? 4 * progress * progress * progress 
        : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
      
      window.scrollTo(0, start + (target - start) * easeInOutCubic);
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}

// ===== ADDITIONAL CYBER EFFECTS =====
class CyberEffects {
  static createLightningEffect(startX, startY, endX, endY) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Create jagged lightning path
    let pathData = `M ${startX} ${startY}`;
    const segments = 10;
    
    for (let i = 1; i <= segments; i++) {
      const x = startX + (endX - startX) * (i / segments) + (Math.random() - 0.5) * 50;
      const y = startY + (endY - startY) * (i / segments) + (Math.random() - 0.5) * 50;
      pathData += ` L ${x} ${y}`;
    }
    
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', '#00f5ff');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    path.style.filter = 'drop-shadow(0 0 10px #00f5ff)';
    
    svg.appendChild(path);
    document.body.appendChild(svg);
    
    setTimeout(() => {
      svg.remove();
    }, 200);
  }
  
  static createEnergyOrb(x, y) {
    const orb = document.createElement('div');
    orb.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 100px;
      height: 100px;
      background: radial-gradient(circle, #00f5ff 0%, transparent 70%);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: energyOrb 2s ease-out;
      pointer-events: none;
      z-index: 9999;
    `;
    
    document.body.appendChild(orb);
    
    setTimeout(() => {
      orb.remove();
    }, 2000);
    
    if (!document.querySelector('#energy-orb-styles')) {
      const style = document.createElement('style');
      style.id = 'energy-orb-styles';
      style.textContent = `
        @keyframes energyOrb {
          0% {
            width: 10px;
            height: 10px;
            opacity: 1;
          }
          50% {
            width: 150px;
            height: 150px;
            opacity: 0.8;
          }
          100% {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  window.cyberWebsite = new CyberWebsite();
});

// ===== EXPORT =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CyberWebsite, CyberEffects };
}
