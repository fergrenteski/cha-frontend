// Utilitários para cache em memória e localStorage
class CacheManager {
    constructor() {
        this.memoryCache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
    }

    // Cache em memória para dados temporários
    setMemory(key, data, ttl = this.cacheTimeout) {
        const expiry = Date.now() + ttl;
        this.memoryCache.set(key, { data, expiry });
    }

    getMemory(key) {
        const cached = this.memoryCache.get(key);
        if (!cached) return null;
        
        if (Date.now() > cached.expiry) {
            this.memoryCache.delete(key);
            return null;
        }
        
        return cached.data;
    }

    // Cache em localStorage para dados persistentes
    setLocal(key, data, ttl = this.cacheTimeout) {
        try {
            const expiry = Date.now() + ttl;
            const cacheData = { data, expiry };
            localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Erro ao salvar no cache local:', error);
        }
    }

    getLocal(key) {
        try {
            const cached = localStorage.getItem(`cache_${key}`);
            if (!cached) return null;

            const { data, expiry } = JSON.parse(cached);
            
            if (Date.now() > expiry) {
                localStorage.removeItem(`cache_${key}`);
                return null;
            }
            
            return data;
        } catch (error) {
            console.warn('Erro ao recuperar do cache local:', error);
            return null;
        }
    }

    // Limpar cache expirado
    cleanup() {
        // Limpar memory cache
        for (const [key, value] of this.memoryCache.entries()) {
            if (Date.now() > value.expiry) {
                this.memoryCache.delete(key);
            }
        }

        // Limpar localStorage cache
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('cache_')) {
                    const cached = localStorage.getItem(key);
                    if (cached) {
                        try {
                            const { expiry } = JSON.parse(cached);
                            if (Date.now() > expiry) {
                                localStorage.removeItem(key);
                            }
                        } catch {
                            localStorage.removeItem(key);
                        }
                    }
                }
            });
        } catch (error) {
            console.warn('Erro na limpeza do cache:', error);
        }
    }

    // Invalidar cache específico
    invalidate(key) {
        this.memoryCache.delete(key);
        try {
            localStorage.removeItem(`cache_${key}`);
        } catch (error) {
            console.warn('Erro ao invalidar cache:', error);
        }
    }

    // Limpar todo o cache
    clear() {
        this.memoryCache.clear();
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('cache_')) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.warn('Erro ao limpar cache:', error);
        }
    }
}

export const cacheManager = new CacheManager();

// Auto-limpeza a cada 10 minutos
setInterval(() => {
    cacheManager.cleanup();
}, 10 * 60 * 1000);
