// ====================================
// NOTIFICATION MANAGER
// Handles all notification types and user preferences
// ====================================

class NotificationManager {
  constructor() {
    this.isSupported = 'Notification' in window;
    this.permission = this.isSupported ? Notification.permission : 'denied';
    this.notifications = [];
    this.updateCheckInterval = null;
    this.lastUpdateCheck = Date.now();
    
    this.init();
  }

  async init() {
    if (!this.isSupported) {
      console.log('Notifications not supported in this browser');
      return;
    }

    // Register notification service worker
    await this.registerNotificationSW();
    
    // Initialize notification UI
    this.createNotificationUI();
    
    // Check for updates periodically
    this.startUpdateCheck();
    
    // Listen for visibility changes to check updates when tab becomes visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkForUpdates();
      }
    });
  }

  async registerNotificationSW() {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/notification-sw.js');
        console.log('Notification Service Worker registered:', registration);
        
        // Request notification permission
        await this.requestPermission();
        
        // Subscribe to push notifications
        await this.subscribeToPush();
      }
    } catch (error) {
      console.error('Failed to register notification service worker:', error);
    }
  }

  async requestPermission() {
    if (this.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        this.permission = permission;
        console.log('Notification permission:', permission);
        
        if (permission === 'granted') {
          this.showInAppNotification('Notifications enabled!', 'You\'ll now receive updates about new content and features.', 'success');
        }
      } catch (error) {
        console.error('Failed to request notification permission:', error);
      }
    }
  }

  async subscribeToPush() {
    if (this.permission !== 'granted') return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.getVapidPublicKey())
      });
      
      console.log('Push subscription:', subscription);
      
      // Store subscription for server
      localStorage.setItem('pushSubscription', JSON.stringify(subscription));
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
    }
  }

  getVapidPublicKey() {
    // Replace with your actual VAPID public key
    return 'BEl62iUYgUivxIkv69yViEuiBIa1lQHDfIvt7v-IFzXsJOMihdURx_0u0JYTamheNn5A5oEeFZ2B0IdTnlpO94FE';
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  createNotificationUI() {
    // Create notification container
    const notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);

    // Create notification bell icon in header
    this.createNotificationBell();
    
    // Create update notification banner
    this.createUpdateBanner();
  }

  createNotificationBell() {
    const header = document.querySelector('.cyber-nav .nav-container');
    if (!header) return;

    const notificationBell = document.createElement('div');
    notificationBell.className = 'notification-bell';
    notificationBell.innerHTML = `
      <i class="fas fa-bell"></i>
      <span class="notification-badge" id="notification-badge" style="display: none;">0</span>
    `;
    
    notificationBell.addEventListener('click', () => {
      this.toggleNotificationPanel();
    });

    // Insert before the nav-toggle button
    const navToggle = header.querySelector('.nav-toggle');
    if (navToggle) {
      header.insertBefore(notificationBell, navToggle);
    } else {
      header.appendChild(notificationBell);
    }
  }

  createUpdateBanner() {
    const banner = document.createElement('div');
    banner.id = 'update-banner';
    banner.className = 'update-banner hidden';
    banner.innerHTML = `
      <div class="banner-content">
        <i class="fas fa-rocket"></i>
        <span class="banner-text">New updates available! Click to see what's new.</span>
        <button class="banner-close" id="banner-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    document.body.insertBefore(banner, document.body.firstChild);
    
    // Add event listeners
    banner.addEventListener('click', (e) => {
      if (!e.target.closest('.banner-close')) {
        this.showUpdateDetails();
      }
    });
    
    document.getElementById('banner-close').addEventListener('click', () => {
      this.hideUpdateBanner();
    });
  }

  toggleNotificationPanel() {
    const panel = document.getElementById('notification-panel');
    if (panel) {
      panel.classList.toggle('show');
    } else {
      this.createNotificationPanel();
    }
  }

  createNotificationPanel() {
    const panel = document.createElement('div');
    panel.id = 'notification-panel';
    panel.className = 'notification-panel';
    panel.innerHTML = `
      <div class="panel-header">
        <h3>Notifications</h3>
        <button class="panel-close" id="panel-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="panel-content" id="panel-content">
        <div class="no-notifications">No notifications yet</div>
      </div>
      <div class="panel-footer">
        <button class="clear-all" id="clear-all">Clear All</button>
        <button class="settings" id="settings">Settings</button>
      </div>
    `;
    
    document.body.appendChild(panel);
    
    // Add event listeners
    document.getElementById('panel-close').addEventListener('click', () => {
      panel.classList.remove('show');
    });
    
    document.getElementById('clear-all').addEventListener('click', () => {
      this.clearAllNotifications();
    });
    
    document.getElementById('settings').addEventListener('click', () => {
      this.showNotificationSettings();
    });
    
    panel.classList.add('show');
    this.updateNotificationPanel();
  }

  updateNotificationPanel() {
    const content = document.getElementById('panel-content');
    if (!content) return;
    
    if (this.notifications.length === 0) {
      content.innerHTML = '<div class="no-notifications">No notifications yet</div>';
      return;
    }
    
    const notificationsHTML = this.notifications
      .map(notification => `
        <div class="notification-item ${notification.type}" data-id="${notification.id}">
          <div class="notification-icon">
            <i class="fas ${this.getNotificationIcon(notification.type)}"></i>
          </div>
          <div class="notification-content">
            <div class="notification-title">${notification.title}</div>
            <div class="notification-message">${notification.message}</div>
            <div class="notification-time">${this.formatTime(notification.timestamp)}</div>
          </div>
          <button class="notification-close" onclick="notificationManager.removeNotification('${notification.id}')">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `)
      .join('');
    
    content.innerHTML = notificationsHTML;
  }

  getNotificationIcon(type) {
    const icons = {
      'info': 'fa-info-circle',
      'success': 'fa-check-circle',
      'warning': 'fa-exclamation-triangle',
      'error': 'fa-times-circle',
      'update': 'fa-rocket'
    };
    return icons[type] || 'fa-bell';
  }

  formatTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  }

  showInAppNotification(title, message, type = 'info', duration = 5000) {
    const notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: Date.now()
    };
    
    this.notifications.unshift(notification);
    this.updateNotificationBadge();
    this.updateNotificationPanel();
    
    // Auto-remove after duration
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, duration);
    
    return notification.id;
  }

  showUpdateNotification(title, message, updateData = {}) {
    // Show in-app notification
    this.showInAppNotification(title, message, 'update');
    
    // Show update banner
    this.showUpdateBanner();
    
    // Show push notification if permission granted
    if (this.permission === 'granted') {
      this.showPushNotification(title, message, updateData);
    }
  }

  showUpdateBanner() {
    const banner = document.getElementById('update-banner');
    if (banner) {
      banner.classList.remove('hidden');
    }
  }

  hideUpdateBanner() {
    const banner = document.getElementById('update-banner');
    if (banner) {
      banner.classList.add('hidden');
    }
  }

  async showPushNotification(title, message, data = {}) {
    if (this.permission !== 'granted') return;
    
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        body: message,
        icon: '/assets/images/techno.jpg',
        badge: '/assets/images/techno.jpg',
        tag: 'update-notification',
        requireInteraction: true,
        actions: [
          {
            action: 'view',
            title: 'View Now',
            icon: '/assets/images/techno.jpg'
          }
        ],
        data: {
          url: data.url || '/',
          timestamp: Date.now()
        }
      });
    } catch (error) {
      console.error('Failed to show push notification:', error);
    }
  }

  removeNotification(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.updateNotificationBadge();
    this.updateNotificationPanel();
  }

  clearAllNotifications() {
    this.notifications = [];
    this.updateNotificationBadge();
    this.updateNotificationPanel();
  }

  updateNotificationBadge() {
    const badge = document.getElementById('notification-badge');
    if (badge) {
      if (this.notifications.length > 0) {
        badge.textContent = this.notifications.length;
        badge.style.display = 'block';
      } else {
        badge.style.display = 'none';
      }
    }
  }

  startUpdateCheck() {
    // Check for updates every 30 minutes
    this.updateCheckInterval = setInterval(() => {
      this.checkForUpdates();
    }, 30 * 60 * 1000);
    
    // Initial check
    this.checkForUpdates();
  }

  async checkForUpdates() {
    try {
      // Check for updates using the API simulation
      if (window.updateAPI) {
        const result = await window.updateAPI.checkForUpdates();
        
        if (result.hasUpdates) {
          this.showUpdateNotification(
            'New Updates Available!',
            'AAYUSH TECH has new content and features for you to explore.',
            { url: '/', type: 'content-update', data: result.data }
          );
        }
      } else {
        // Fallback to simulation
        const hasUpdates = await this.simulateUpdateCheck();
        
        if (hasUpdates) {
          this.showUpdateNotification(
            'New Updates Available!',
            'AAYUSH TECH has new content and features for you to explore.',
            { url: '/', type: 'content-update' }
          );
        }
      }
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  }

  async simulateUpdateCheck() {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if we should show updates (for demo purposes)
    const lastShown = localStorage.getItem('lastUpdateShown');
    const now = Date.now();
    
    // Show update every 2 hours for demo
    if (!lastShown || (now - parseInt(lastShown)) > 2 * 60 * 60 * 1000) {
      localStorage.setItem('lastUpdateShown', now.toString());
      return true;
    }
    
    return false;
  }

  showUpdateDetails() {
    // Create a modal showing update details
    const modal = document.createElement('div');
    modal.className = 'update-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2><i class="fas fa-rocket"></i> Latest Updates</h2>
          <button class="modal-close" id="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="update-item">
            <h3>🚀 New Notification System</h3>
            <p>Stay updated with real-time notifications about new content, features, and updates.</p>
          </div>
          <div class="update-item">
            <h3>🎨 Enhanced UI Components</h3>
            <p>Improved cyberpunk design elements and better user experience.</p>
          </div>
          <div class="update-item">
            <h3>⚡ Performance Improvements</h3>
            <p>Faster loading times and better offline support.</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" onclick="this.closest('.update-modal').remove()">
            Got it!
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.modal-overlay').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.querySelector('#modal-close').addEventListener('click', () => {
      modal.remove();
    });
    
    // Hide update banner
    this.hideUpdateBanner();
  }

  showNotificationSettings() {
    // Create settings modal
    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2><i class="fas fa-cog"></i> Notification Settings</h2>
          <button class="modal-close" id="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="setting-item">
            <label>
              <input type="checkbox" id="push-notifications" ${this.permission === 'granted' ? 'checked' : ''}>
              Push Notifications
            </label>
            <p>Receive notifications even when the website is closed</p>
          </div>
          <div class="setting-item">
            <label>
              <input type="checkbox" id="update-notifications" checked>
              Update Notifications
            </label>
            <p>Get notified about new content and features</p>
          </div>
          <div class="setting-item">
            <label>
              <input type="checkbox" id="sound-notifications" checked>
              Sound Alerts
            </label>
            <p>Play sound when notifications arrive</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" onclick="this.closest('.settings-modal').remove()">Cancel</button>
          <button class="btn-primary" onclick="notificationManager.saveSettings()">Save</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.modal-overlay').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.querySelector('#modal-close').addEventListener('click', () => {
      modal.remove();
    });
  }

  async saveSettings() {
    const pushNotifications = document.getElementById('push-notifications').checked;
    const updateNotifications = document.getElementById('update-notifications').checked;
    const soundNotifications = document.getElementById('sound-notifications').checked;
    
    // Save settings to localStorage
    localStorage.setItem('notificationSettings', JSON.stringify({
      pushNotifications,
      updateNotifications,
      soundNotifications
    }));
    
    // Handle push notification permission
    if (pushNotifications && this.permission === 'default') {
      await this.requestPermission();
    }
    
    // Close modal
    document.querySelector('.settings-modal').remove();
    
    // Show confirmation
    this.showInAppNotification('Settings Saved!', 'Your notification preferences have been updated.', 'success');
  }

  // Public methods for external use
  notify(title, message, type = 'info') {
    return this.showInAppNotification(title, message, type);
  }

  notifyUpdate(title, message, data = {}) {
    return this.showUpdateNotification(title, message, data);
  }

  getNotificationCount() {
    return this.notifications.length;
  }

  hasNotifications() {
    return this.notifications.length > 0;
  }
}

// Initialize notification manager when DOM is ready
let notificationManager;
document.addEventListener('DOMContentLoaded', () => {
  notificationManager = new NotificationManager();
});

// Make it globally available
window.notificationManager = notificationManager;
