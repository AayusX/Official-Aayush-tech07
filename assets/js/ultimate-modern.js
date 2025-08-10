// ====================================
// ULTIMATE MODERN JAVASCRIPT 2024
// Advanced Interactions & Animations
// ====================================

class ModernWebsite {
  constructor() {
    this.init();
  }

  init() {
    this.setupLoadingScreen();
    this.setupNavigation();
    this.setupScrollEffects();
    this.setupAnimations();
    this.setupParticles();
    this.setupCursor();
    this.setupTouchEffects();
    this.setupPerformanceOptimizations();
  }

  // ===== LOADING SCREEN =====
  setupLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    const progressBar = document.querySelector('.scroll-progress-bar');
    
    if (loadingScreen) {
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progressBar) {
          progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
        
        if (progress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            document.body.style.overflow = 'visible';
            this.triggerPageAnimations();
          }, 500);
        }
      }, 100);
    }
  }

  // ===== NAVIGATION =====
  setupNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        
        if (targetId.startsWith('#')) {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80;
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Close mobile menu
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
          }
        }
      });
    });

    // Mobile menu toggle
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
      });
    }

    // Navbar scroll effect
    if (navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      });
    }

    // Active section detection
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }

  // ===== SCROLL EFFECTS =====
  setupScrollEffects() {
    // Scroll progress indicator
    const scrollProgress = document.querySelector('.scroll-progress-bar');
    if (scrollProgress) {
      window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollTop = window.scrollY;
        const scrollPercent = (scrollTop / windowHeight) * 100;
        scrollProgress.style.width = `${scrollPercent}%`;
      });
    }

    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      });

      backToTop.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    // Parallax effects
    const parallaxElements = document.querySelectorAll('.parallax');
    if (parallaxElements.length > 0) {
      window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        parallaxElements.forEach(element => {
          const speed = element.dataset.speed || 0.5;
          const yPos = -(scrollTop * speed);
          element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
      });
    }
  }

  // ===== ANIMATIONS =====
  setupAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Add stagger effect for child elements
          const children = entry.target.querySelectorAll('.stagger-child');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('visible');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    // Observe elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });

    // Counter animations
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.dataset.target);
          const increment = target / 100;
          let current = 0;
          
          const updateCounter = () => {
            if (current < target) {
              current += increment;
              counter.textContent = Math.ceil(current);
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          };
          
          updateCounter();
          counterObserver.unobserve(counter);
        }
      });
    });

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });

    // Typing animation
    const typingElements = document.querySelectorAll('.typing-text');
    typingElements.forEach(element => {
      const text = element.textContent;
      element.textContent = '';
      element.style.borderRight = '2px solid';
      element.style.animation = 'blink 1s infinite';
      
      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 50);
        } else {
          element.style.borderRight = 'none';
        }
      };
      
      // Start typing when element is visible
      const typingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(typeWriter, 500);
            typingObserver.unobserve(entry.target);
          }
        });
      });
      
      typingObserver.observe(element);
    });
  }

  // ===== PARTICLE EFFECTS =====
  setupParticles() {
    const createParticle = (x, y) => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: #667eea;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${x}px;
        top: ${y}px;
        animation: particleFloat 1s ease-out forwards;
      `;
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 1000);
    };

    // Create particles on click
    document.addEventListener('click', (e) => {
      if (Math.random() > 0.7) { // 30% chance
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            createParticle(
              e.clientX + (Math.random() - 0.5) * 20,
              e.clientY + (Math.random() - 0.5) * 20
            );
          }, i * 100);
        }
      }
    });

    // Add particle animation keyframes
    if (!document.querySelector('#particle-styles')) {
      const style = document.createElement('style');
      style.id = 'particle-styles';
      style.textContent = `
        @keyframes particleFloat {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) scale(0);
          }
        }
        
        @keyframes blink {
          0%, 50% { border-color: transparent; }
          51%, 100% { border-color: currentColor; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ===== CURSOR EFFECTS =====
  setupCursor() {
    if (window.innerWidth < 768) return; // Skip on mobile

    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');
    
    cursorDot.className = 'cursor-dot';
    cursorOutline.className = 'cursor-outline';
    
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    const animateOutline = () => {
      outlineX += (mouseX - outlineX) * 0.2;
      outlineY += (mouseY - outlineY) * 0.2;
      
      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;
      
      requestAnimationFrame(animateOutline);
    };
    
    animateOutline();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .hover-target');
    hoverElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hover');
        cursorOutline.classList.add('hover');
      });
      
      element.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hover');
        cursorOutline.classList.remove('hover');
      });
    });
  }

  // ===== TOUCH EFFECTS =====
  setupTouchEffects() {
    // Ripple effect on touch
    const createRipple = (element, x, y) => {
      const ripple = document.createElement('div');
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x - rect.left - size / 2}px;
        top: ${y - rect.top - size / 2}px;
        background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
      `;
      
      element.style.position = 'relative';
      element.style.overflow = 'hidden';
      element.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    };

    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(rippleStyle);

    // Apply ripple to buttons
    document.querySelectorAll('button, .btn, .cta-button').forEach(button => {
      button.addEventListener('click', (e) => {
        createRipple(button, e.clientX, e.clientY);
      });
    });
  }

  // ===== PERFORMANCE OPTIMIZATIONS =====
  setupPerformanceOptimizations() {
    // Throttle scroll events
    let ticking = false;
    const throttleScroll = (func) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          func();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Lazy loading for images
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
      });
    }

    // Preload critical resources
    this.preloadResources();

    // Service Worker registration for PWA capabilities
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Silently fail if service worker is not available
      });
    }
  }

  // ===== RESOURCE PRELOADING =====
  preloadResources() {
    const criticalResources = [
      '/assets/images/hero-bg.jpg',
      '/assets/fonts/inter.woff2'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
    });
  }

  // ===== PAGE ANIMATIONS =====
  triggerPageAnimations() {
    // Stagger animation for hero elements
    const heroElements = document.querySelectorAll('.hero .fade-in');
    heroElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('visible');
      }, index * 200);
    });

    // Animate floating elements
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach(element => {
      element.style.animationPlayState = 'running';
    });
  }

  // ===== UTILITY METHODS =====
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

  // ===== FORM HANDLING =====
  setupForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        try {
          const formData = new FormData(form);
          const data = Object.fromEntries(formData.entries());
          
          // Replace with actual form submission logic
          await this.simulateFormSubmission(data);
          
          // Show success message
          this.showNotification('Message sent successfully!', 'success');
          form.reset();
          
        } catch (error) {
          this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      });
    });
  }

  // ===== NOTIFICATIONS =====
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 10000;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    });
  }

  // ===== SIMULATE FORM SUBMISSION =====
  async simulateFormSubmission(data) {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000); // Simulate network delay
    });
  }
}

// ===== ADDITIONAL UTILITIES =====
class AnimationUtils {
  static fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = null;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = Math.min(progress / duration, 1);
      
      element.style.opacity = opacity;
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  static slideUp(element, duration = 300) {
    const height = element.offsetHeight;
    element.style.overflow = 'hidden';
    element.style.height = height + 'px';
    element.style.transition = `height ${duration}ms ease`;
    
    setTimeout(() => {
      element.style.height = '0px';
      setTimeout(() => {
        element.style.display = 'none';
        element.style.height = '';
        element.style.transition = '';
        element.style.overflow = '';
      }, duration);
    }, 10);
  }

  static slideDown(element, duration = 300) {
    element.style.display = 'block';
    const height = element.scrollHeight;
    element.style.overflow = 'hidden';
    element.style.height = '0px';
    element.style.transition = `height ${duration}ms ease`;
    
    setTimeout(() => {
      element.style.height = height + 'px';
      setTimeout(() => {
        element.style.height = '';
        element.style.transition = '';
        element.style.overflow = '';
      }, duration);
    }, 10);
  }
}

// ===== INITIALIZE ON DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', () => {
  window.modernWebsite = new ModernWebsite();
});

// ===== ADDITIONAL EVENT LISTENERS =====
window.addEventListener('load', () => {
  // Remove any remaining loading indicators
  document.body.classList.add('loaded');
  
  // Initialize any components that need full page load
  if (window.modernWebsite) {
    window.modernWebsite.setupForms();
  }
});

window.addEventListener('resize', () => {
  // Handle responsive adjustments
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const handleResize = debounce(() => {
    // Recalculate any size-dependent elements
    document.dispatchEvent(new CustomEvent('resize-complete'));
  }, 250);

  handleResize();
});

// ===== EXPORT FOR MODULE USE =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ModernWebsite, AnimationUtils };
}
