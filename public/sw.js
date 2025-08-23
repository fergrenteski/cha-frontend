// Service Worker para cache de recursos estáticos e API

const CACHE_NAME = 'cha-frontend-v1';
const STATIC_CACHE = 'static-v1';
const API_CACHE = 'api-v1';

// Recursos para cache estático
const STATIC_ASSETS = [
    '/',
    '/static/js/bundle.js',
    '/static/css/main.css',
    '/manifest.json'
];

// URLs da API para cache
const API_URLS = [
    '/api/products',
    '/api/products/categories'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        Promise.all([
            // Cache recursos estáticos
            caches.open(STATIC_CACHE).then((cache) => {
                return cache.addAll(STATIC_ASSETS);
            }),
            
            // Ativar imediatamente
            self.skipWaiting()
        ])
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            // Limpar caches antigos
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== API_CACHE && 
                            cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            
            // Tomar controle imediatamente
            self.clients.claim()
        ])
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Estratégia para recursos estáticos: Cache First
    if (request.destination === 'script' || 
        request.destination === 'style' || 
        request.destination === 'image' ||
        url.pathname.startsWith('/static/')) {
        
        event.respondWith(
            caches.match(request).then((response) => {
                return response || fetch(request).then((fetchResponse) => {
                    const responseClone = fetchResponse.clone();
                    caches.open(STATIC_CACHE).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return fetchResponse;
                });
            })
        );
        return;
    }

    // Estratégia para API: Network First com fallback para cache
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Se a resposta for bem-sucedida, cache ela
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        
                        // Cache apenas requests GET de produtos e categorias
                        if (request.method === 'GET' && 
                            (url.pathname.includes('/products') || 
                             url.pathname.includes('/categories'))) {
                            
                            caches.open(API_CACHE).then((cache) => {
                                cache.put(request, responseClone);
                            });
                        }
                    }
                    return response;
                })
                .catch(() => {
                    // Se a network falhar, tentar o cache
                    return caches.match(request).then((response) => {
                        if (response) {
                            return response;
                        }
                        
                        // Se não tiver cache, retornar erro offline
                        return new Response(
                            JSON.stringify({
                                error: 'Offline',
                                message: 'Sem conexão com a internet'
                            }),
                            {
                                status: 503,
                                statusText: 'Service Unavailable',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }
                        );
                    });
                })
        );
        return;
    }

    // Para outros requests: Network Only
    event.respondWith(fetch(request));
});

// Limpar cache periodicamente
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        return caches.delete(cacheName);
                    })
                );
            })
        );
    }
});

// Notificar sobre atualizações
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
