// Utilitários para performance e debouncing

// Debounce para evitar muitas chamadas à API
export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
};

// Throttle para limitar frequência de chamadas
export const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Lazy loading para imagens
export const createLazyImageLoader = () => {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    return {
        observe: (img) => imageObserver.observe(img),
        disconnect: () => imageObserver.disconnect()
    };
};

// Request deduplication - evitar requests duplicados
class RequestDeduplicator {
    constructor() {
        this.pendingRequests = new Map();
    }

    async dedupe(key, requestFn) {
        if (this.pendingRequests.has(key)) {
            return this.pendingRequests.get(key);
        }

        const promise = requestFn()
            .finally(() => {
                this.pendingRequests.delete(key);
            });

        this.pendingRequests.set(key, promise);
        return promise;
    }
}

export const requestDeduplicator = new RequestDeduplicator();

// Otimização de re-renders com shallow compare
export const shallowEqual = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }

    return true;
};

// Preload de recursos
export const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
};

// Batch de atualizações para evitar re-renders desnecessários
export const batchUpdates = (callback) => {
    if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(callback);
    } else {
        setTimeout(callback, 0);
    }
};

// Memoização simples para funções
export const memoize = (fn, maxSize = 100) => {
    const cache = new Map();
    
    return (...args) => {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            return cache.get(key);
        }
        
        const result = fn(...args);
        
        if (cache.size >= maxSize) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }
        
        cache.set(key, result);
        return result;
    };
};
