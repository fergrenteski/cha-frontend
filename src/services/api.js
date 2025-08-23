// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Utilitários para dados locais (usuários não logados)
const localStorageKeys = {
    CART: 'localCart',
    FAVORITES: 'localFavorites'
};



// Utilitários para favoritos locais
const localFavoritesUtils = {
    get: () => {
        try {
            const favorites = localStorage.getItem(localStorageKeys.FAVORITES);
            return favorites ? JSON.parse(favorites) : [];
        } catch {
            return [];
        }
    },
    
    set: (favorites) => {
        localStorage.setItem(localStorageKeys.FAVORITES, JSON.stringify(favorites));
    },
    
    add: (productId) => {
        const favorites = localFavoritesUtils.get();
        if (!favorites.includes(productId)) {
            favorites.push(productId);
            localFavoritesUtils.set(favorites);
        }
        return favorites;
    },
    
    remove: (productId) => {
        const favorites = localFavoritesUtils.get().filter(id => id !== productId);
        localFavoritesUtils.set(favorites);
        return favorites;
    },
    
    clear: () => {
        localStorage.removeItem(localStorageKeys.FAVORITES);
        return [];
    },
    
    includes: (productId) => {
        return localFavoritesUtils.get().includes(productId);
    }
};

// Utilitário para criar cabeçalhos de requisição
const createHeaders = (includeAuth = true, isFormData = false) => {
    const headers = {};

    // Só adiciona Content-Type se não for FormData
    // O browser define automaticamente multipart/form-data para FormData
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    if (includeAuth) {
        const token = localStorage.getItem('authToken');
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
    }

    return headers;
};

// Utilitário para tratar respostas da API
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.message || errorData.msg || `Erro ${response.status}`;
        throw new Error(message);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
        return response.json();
    }
    
    return response.text();
};

// ===================
// SERVIÇOS DE AUTENTICAÇÃO
// ===================

export const authAPI = {
    // Registro de usuário
    register: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: createHeaders(false),
            body: JSON.stringify(userData),
        });
        
        const data = await handleResponse(response);
        
        // Salvar token no localStorage
        if (data.token) {
            localStorage.setItem('authToken', data.token);
        }
        
        return data;
    },

    // Login de usuário
    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: createHeaders(false),
            body: JSON.stringify({ email, password }),
        });
        
        const data = await handleResponse(response);
        
        // Salvar token no localStorage
        if (data.token) {
            localStorage.setItem('authToken', data.token);
        }
        
        return data;
    }
};

// ===================
// SERVIÇOS DE PERFIL
// ===================

export const profileAPI = {
    // Obter perfil do usuário
    getProfile: async () => {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            headers: createHeaders(),
        });
        
        return handleResponse(response);
    },

    // Atualizar perfil
    updateProfile: async (profileData) => {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'PUT',
            headers: createHeaders(),
            body: JSON.stringify(profileData),
        });
        
        return handleResponse(response);
    },

    // Excluir conta
    deleteAccount: async () => {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'DELETE',
            headers: createHeaders(),
        });
        
        return handleResponse(response);
    },
};

// ===================
// SERVIÇOS DE PRODUTOS
// ===================

export const productsAPI = {
    // Listar produtos com filtros opcionais
    getProducts: async (filters = {}) => {
        const queryParams = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value);
            }
        });
        
        const queryString = queryParams.toString();
        const url = queryString ? `${API_BASE_URL}/products?${queryString}` : `${API_BASE_URL}/products`;
        
        const response = await fetch(url, {
            headers: createHeaders(false),
        });
        
        return handleResponse(response);
    },

    // Obter categorias
    getCategories: async () => {
        const response = await fetch(`${API_BASE_URL}/products/categories`, {
            headers: createHeaders(false),
        });
        
        return handleResponse(response);
    },

    // Obter produto por ID
    getProductById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            headers: createHeaders(false),
        });
        
        return handleResponse(response);
    },

        // Criar produto (requer autenticação)
    createProduct: async (productData, imageFile = null) => {
        let body;
        let headers;
        
        if (imageFile) {
            // Se há arquivo de imagem, usar FormData
            const formData = new FormData();
            
            // Adicionar dados do produto
            Object.entries(productData).forEach(([key, value]) => {
                if (value !== undefined && value !== null && key !== 'image') {
                    formData.append(key, value);
                }
            });
            
            // Adicionar arquivo de imagem
            formData.append('image', imageFile);
            
            body = formData;
            headers = createHeaders(true, true); // FormData = true
        } else {
            // Se não há arquivo, usar JSON
            body = JSON.stringify(productData);
            headers = createHeaders(true, false); // FormData = false
        }
        
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers,
            body,
        });
        
        return handleResponse(response);
    },

    // Atualizar produto (requer autenticação)
    updateProduct: async (id, productData, imageFile = null) => {
        let body;
        let headers;
        
        if (imageFile) {
            // Se há arquivo de imagem, usar FormData
            const formData = new FormData();
            
            // Adicionar dados do produto
            Object.entries(productData).forEach(([key, value]) => {
                if (value !== undefined && value !== null && key !== 'image') {
                    formData.append(key, value);
                }
            });
            
            // Adicionar arquivo de imagem
            formData.append('image', imageFile);
            
            body = formData;
            headers = createHeaders(true, true); // FormData = true
        } else {
            // Se não há arquivo, usar JSON
            body = JSON.stringify(productData);
            headers = createHeaders(true, false); // FormData = false
        }
        
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'PUT',
            headers,
            body,
        });
        
        return handleResponse(response);
    },

    // Excluir produto (requer autenticação)
    deleteProduct: async (id) => {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE',
            headers: createHeaders(),
        });
        
        return handleResponse(response);
    },
};

// ===================
// SERVIÇOS DE CARRINHO
// ===================

export const cartAPI = {
    // Obter carrinho
    getCart: async () => {
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
            throw new Error('Login necessário para acessar o carrinho');
        }
        
        const response = await fetch(`${API_BASE_URL}/cart`, {
            headers: createHeaders(true),
        });
        
        return handleResponse(response);
    },

    // Adicionar produto ao carrinho
    addToCart: async (productId, quantity = 1) => {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('Login necessário para adicionar itens ao carrinho');
        }

        const body = { productId, quantity };
        
        const response = await fetch(`${API_BASE_URL}/cart/add`, {
            method: 'POST',
            headers: createHeaders(true),
            body: JSON.stringify(body),
        });
        
        return handleResponse(response);
    },

    // Remover produto do carrinho
    removeFromCart: async (productId) => {
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
            throw new Error('Login necessário para remover itens do carrinho');
        }
        
        const body = { productId };
        
        const response = await fetch(`${API_BASE_URL}/cart/remove`, {
            method: 'POST',
            headers: createHeaders(true),
            body: JSON.stringify(body),
        });
        
        return handleResponse(response);
    },

    // Atualizar quantidade de produto no carrinho
    updateQuantity: async (productId, quantity) => {
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
            throw new Error('Login necessário para atualizar quantidade');
        }
        
        const body = { productId, quantity };
        
        const response = await fetch(`${API_BASE_URL}/cart/update-quantity`, {
            method: 'PUT',
            headers: createHeaders(true),
            body: JSON.stringify(body),
        });
        
        return handleResponse(response);
    },

    // Limpar carrinho
    clearCart: async () => {
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
            throw new Error('Login necessário para limpar carrinho');
        }
        
        const body = {};
        
        const response = await fetch(`${API_BASE_URL}/cart/clear`, {
            method: 'POST',
            headers: createHeaders(true),
            body: JSON.stringify(body),
        });
        
        return handleResponse(response);
    },

    // Listar participantes do carrinho
    getParticipants: async () => {
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
            throw new Error('Login necessário para acessar participantes');
        }
        
        const response = await fetch(`${API_BASE_URL}/cart/participants`, {
            headers: createHeaders(true),
        });
        
        return handleResponse(response);
    },

    // Adicionar participante ao carrinho
    addParticipant: async (name) => {
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
            throw new Error('Login necessário para adicionar participantes');
        }
        
        const body = { name };
        
        const response = await fetch(`${API_BASE_URL}/cart/participants/add`, {
            method: 'POST',
            headers: createHeaders(true),
            body: JSON.stringify(body),
        });
        
        return handleResponse(response);
    },

    // Remover participante do carrinho
    removeParticipant: async (name) => {
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
            throw new Error('Login necessário para remover participantes');
        }
        
        const body = { name };
        
        const response = await fetch(`${API_BASE_URL}/cart/participants/remove`, {
            method: 'POST',
            headers: createHeaders(true),
            body: JSON.stringify(body),
        });
        
        return handleResponse(response);
    },

    checkout: async () => {
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
            throw new Error('Login necessário para finalizar compra');
        }
        
        const body = {};
        
        const response = await fetch(`${API_BASE_URL}/cart/checkout`, {
            method: 'POST',
            headers: createHeaders(true),
            body: JSON.stringify(body),
        });
        
        return handleResponse(response);
    }
};

// ===================
// SERVIÇOS DE FAVORITOS
// ===================

export const favoritesAPI = {
    // Obter favoritos
    getFavorites: async () => {
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
            throw new Error('Login necessário para acessar favoritos');
        }
        
        const response = await fetch(`${API_BASE_URL}/favorites`, {
            headers: createHeaders(true),
        });
        
        return handleResponse(response);
    },

    // Adicionar produto aos favoritos
    addToFavorites: async (productId) => {
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
            throw new Error('Login necessário para adicionar favoritos');
        }
        
        const body = { productId };
        
        const response = await fetch(`${API_BASE_URL}/favorites/add`, {
            method: 'POST',
            headers: createHeaders(true),
            body: JSON.stringify(body),
        });
        
        return handleResponse(response);
    },

    // Remover produto dos favoritos
    removeFromFavorites: async (productId) => {
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
            throw new Error('Login necessário para remover favoritos');
        }
        
        const body = { productId };
        
        const response = await fetch(`${API_BASE_URL}/favorites/remove`, {
            method: 'POST',
            headers: createHeaders(true),
            body: JSON.stringify(body),
        });
        
        return handleResponse(response);
    },

    // Limpar todos os favoritos
    clearFavorites: async () => {
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
            throw new Error('Login necessário para limpar favoritos');
        }
        
        const body = {};
        
        const response = await fetch(`${API_BASE_URL}/favorites/clear`, {
            method: 'POST',
            headers: createHeaders(true),
            body: JSON.stringify(body),
        });
        
        return handleResponse(response);
    },

    // Verificar se produto está nos favoritos
    isProductInFavorites: async (productId) => {
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
            return false; // Se não está logado, não tem favoritos
        }
        
        const response = await fetch(`${API_BASE_URL}/favorites/check/${productId}`, {
            headers: createHeaders(true),
        });
        
        return handleResponse(response);
    }
};

// API de Pedidos
export const ordersAPI = {
    // Criar novo pedido
    async createOrder(notes = '') {
        // Gerar número do pedido único
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const orderNumber = `ORD-${timestamp}-${random}`;
        
        const response = await fetch(`${API_BASE_URL}/orders/create`, {
            method: 'POST',
            headers: createHeaders(true),
            body: JSON.stringify({ 
                orderNumber,
                notes 
            }),
        });
        
        return handleResponse(response);
    },

    // Obter pedidos do usuário
    async getUserOrders(filters = {}, admin=false) {
        const queryParams = new URLSearchParams();
        
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.page) queryParams.append('page', filters.page);
        if (filters.limit) queryParams.append('limit', filters.limit);
        if(admin) queryParams.append('admin', admin);

        const response = await fetch(`${API_BASE_URL}/orders?${queryParams}`, {
            method: 'GET',
            headers: createHeaders(true),
        });
        
        return handleResponse(response);
    },

    // Obter detalhes de um pedido
    async getOrderDetails(orderId) {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'GET',
            headers: createHeaders(true),
        });
        
        return handleResponse(response);
    },

    // Cancelar pedido
    async cancelOrder(orderId, cancelReason = '') {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
            method: 'PUT',
            headers: createHeaders(true),
            body: JSON.stringify({ cancelReason }),
        });
        
        return handleResponse(response);
    },

    // Atualizar status do pedido (admin)
    async updateOrderStatus(orderId, status) {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: createHeaders(true),
            body: JSON.stringify({ status }),
        });
        
        return handleResponse(response);
    },

    // Obter estatísticas dos pedidos
    async getOrderStats() {
        const response = await fetch(`${API_BASE_URL}/orders/stats`, {
            method: 'GET',
            headers: createHeaders(true),
        });
        
        return handleResponse(response);
    },

    // Obter estatísticas dos pedidos
    async getAllOrderStats() {
        const response = await fetch(`${API_BASE_URL}/orders/stats/admin`, {
            method: 'GET',
            headers: createHeaders(true),
        });
        
        return handleResponse(response);
    },

    // Obter todos os pedidos (admin) - usa rota de usuário por enquanto
    async getAllOrders(filters = {}) {
        // Por enquanto, usamos getUserOrders que retorna os pedidos do usuário logado
        // Idealmente, deveria haver uma rota específica para admin
        return this.getUserOrders(filters, true);
    },
};

// API de Usuários (Admin)
const usersAPI = {
    // Obter todos os usuários (admin)
    async getAllUsers() {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'GET',
            headers: createHeaders(true),
        });
        
        return handleResponse(response);
    },

    // Excluir usuário (admin)
    async deleteUser(userId) {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/delete`, {
            method: 'DELETE',
            headers: createHeaders(true),
        });
        
        return handleResponse(response);
    },

    // Alternar status de admin do usuário (admin)
    async toggleUserAdmin(userId) {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/admin`, {
            method: 'POST',
            headers: createHeaders(true),
        });
        
        return handleResponse(response);
    }
};

// Exportação padrão com todas as APIs
const api = {
    auth: authAPI,
    profile: profileAPI,
    products: productsAPI,
    cart: cartAPI,
    favorites: favoritesAPI,
    orders: ordersAPI,
    users: usersAPI,
};

export default api;
