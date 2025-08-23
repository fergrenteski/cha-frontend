// Utilitário para registrar e gerenciar service worker

export const registerServiceWorker = () => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('SW registrado com sucesso:', registration);
                    
                    // Verificar por atualizações
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // Nova versão disponível
                                    if (confirm('Nova versão disponível! Recarregar página?')) {
                                        newWorker.postMessage({ type: 'SKIP_WAITING' });
                                        window.location.reload();
                                    }
                                }
                            });
                        }
                    });
                })
                .catch((error) => {
                    console.log('Falha ao registrar SW:', error);
                });
        });

        // Escutar por mudanças no controller
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
        });
    }
};

export const unregisterServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then((registration) => {
                registration.unregister();
            })
            .catch((error) => {
                console.error(error.message);
            });
    }
};

export const clearServiceWorkerCache = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then((registration) => {
                if (registration.active) {
                    registration.active.postMessage({ type: 'CLEAR_CACHE' });
                }
            });
    }
};
