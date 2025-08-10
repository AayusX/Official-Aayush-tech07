// ====================================
// NOTIFICATION SERVICE WORKER
// Handles push notifications and update alerts
// ====================================

const NOTIFICATION_CACHE = 'notification-cache-v1';
const UPDATE_NOTIFICATION_ID = 'update-notification';

// Handle push notifications
self.addEventListener('push', event => {
  console.log('Push notification received:', event);
  
  let notificationData = {
    title: 'AAYUSH TECH Update',
    body: 'New content available!',
    icon: '/assets/images/techno.jpg',
    badge: '/assets/images/techno.jpg',
    tag: 'update-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View Now',
        icon: '/assets/images/techno.jpg'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/assets/images/techno.jpg'
      }
    ],
    data: {
      url: '/',
      timestamp: Date.now()
    }
  };

  // If push data is available, use it
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (e) {
      console.log('Using default notification data');
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'view') {
    // Open the website
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    event.notification.close();
  } else {
    // Default action - open the website
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Handle notification close
self.addEventListener('notificationclose', event => {
  console.log('Notification closed:', event);
  
  // Track notification engagement
  if (event.notification.data) {
    // You could send analytics here
    console.log('Notification closed at:', new Date(event.notification.data.timestamp));
  }
});

// Handle background sync for offline notifications
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Check for updates when back online
    const response = await fetch('/api/check-updates', { 
      method: 'GET',
      cache: 'no-cache'
    });
    
    if (response.ok) {
      const updates = await response.json();
      if (updates.hasUpdates) {
        // Show update notification
        await self.registration.showNotification('AAYUSH TECH Update Available', {
          body: 'New content has been added to the website!',
          icon: '/assets/images/techno.jpg',
          tag: 'update-notification',
          requireInteraction: true,
          actions: [
            {
              action: 'view',
              title: 'View Updates',
              icon: '/assets/images/techno.jpg'
            }
          ],
          data: {
            url: '/',
            timestamp: Date.now()
          }
        });
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

// Install event
self.addEventListener('install', event => {
  console.log('Notification Service Worker installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
  console.log('Notification Service Worker activating...');
  event.waitUntil(self.clients.claim());
});
