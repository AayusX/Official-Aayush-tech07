// ====================================
// SERVICE WORKER FOR AAYUSH TECH
// Enhanced Performance & Offline Support
// ====================================

const CACHE_NAME = 'aayush-tech-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Resources to cache for offline use
const RESOURCES_TO_CACHE = [
  '/',
  '/index.html',
  '/about.html',
  '/services.html',
  '/contact.html',
  '/blog.html',
  '/members.html',
  '/petition.html',
  '/assets/css/ultimate-beast.css',
  '/assets/js/ultimate-beast.js',
  '/assets/js/site.js',
  '/manifest.json',
  '/offline.html',
  // Critical images
  '/assets/images/techno.jpg',
  '/assets/images/logo.webp'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app shell');
        return cache.addAll(RESOURCES_TO_CACHE);
      })
      .then(() => self.skipWaiting())
      .catch(error => {
        console.error('Cache installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.open(CACHE_NAME)
            .then(cache => {
              return cache.match('/index.html');
            });
        })
    );
    return;
  }

  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
          .then(fetchResponse => {
            // Don't cache non-successful responses
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }

            // Clone the response
            const responseToCache = fetchResponse.clone();

            // Add to cache for future use
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return fetchResponse;
          });
      })
      .catch(() => {
        // If both cache and network fail, show offline page for HTML requests
        if (event.request.destination === 'document') {
          return caches.match(OFFLINE_URL);
        }
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form') {
    event.waitUntil(
      // Handle offline form submissions
      handleOfflineFormSubmissions()
    );
  }
});

// Push notification handling
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/assets/images/logo-192.png',
      badge: '/assets/images/badge.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: 'View Details',
          icon: '/assets/images/checkmark.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/assets/images/xmark.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for dynamic cache updates
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Utility functions
async function handleOfflineFormSubmissions() {
  try {
    // Implement offline form submission logic here
    console.log('Handling offline form submissions');
    // This would typically involve retrieving stored form data
    // and attempting to submit it when the connection is restored
  } catch (error) {
    console.error('Error handling offline submissions:', error);
  }
}

// Clean up old cache entries periodically
function cleanupCache() {
  caches.open(CACHE_NAME)
    .then(cache => {
      cache.keys().then(requests => {
        requests.forEach(request => {
          // Remove entries older than 30 days
          const cacheTime = new Date(request.headers.get('date'));
          const now = new Date();
          const thirtyDays = 30 * 24 * 60 * 60 * 1000;
          
          if (now - cacheTime > thirtyDays) {
            cache.delete(request);
          }
        });
      });
    });
}

// Run cleanup periodically
setInterval(cleanupCache, 24 * 60 * 60 * 1000); // Once per day
