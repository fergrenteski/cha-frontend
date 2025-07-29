// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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
    },

    // Criar sessão de convidado
    createGuestSession: async () => {
        const response = await fetch(`${API_BASE_URL}/auth/guest`, {
            method: 'POST',
            headers: createHeaders(false),
            body: JSON.stringify({}),
        });
        
        const data = await handleResponse(response);
        
        // Salvar token de convidado
        if (data.token) {
            localStorage.setItem('guestToken', data.token);
        }
        
        return data;
    },
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
        const guestToken = localStorage.getItem('guestToken');
        
        let url = `${API_BASE_URL}/cart`;
        let headers = createHeaders(false);
        
        if (authToken) {
            headers.Authorization = `Bearer ${authToken}`;
        } else if (guestToken) {
            url += `?guestToken=${guestToken}`;
        }
        
        const response = await fetch(url, { headers });
        
        return handleResponse(response);
    },

    // Adicionar produto ao carrinho
    addToCart: async (productId, quantity = 1) => {
        const authToken = localStorage.getItem('authToken');
        const guestToken = localStorage.getItem('guestToken');
        
        const body = { productId, quantity };
        
        if (!authToken && guestToken) {
            body.guestToken = guestToken;
        }
        
        const response = await fetch(`${API_BASE_URL}/cart/add`, {
            method: 'POST',
            headers: createHeaders(!!authToken),
            body: JSON.stringify(body),
        });
        
        return handleResponse(response);
    },

    // Remover produto do carrinho
    removeFromCart: async (productId) => {
        const authToken = localStorage.getItem('authToken');
        const guestToken = localStorage.getItem('guestToken');
        
        const body = { productId };
        
        if (!authToken && guestToken) {
            body.guestToken = guestToken;
        }
        
        const response = await fetch(`${API_BASE_URL}/cart/remove`, {
            method: 'POST',
            headers: createHeaders(!!authToken),
            body: JSON.stringify(body),
        });
        
        return handleResponse(response);
    },

    // Atualizar quantidade de produto no carrinho
    updateQuantity: async (productId, quantity) => {
        const authToken = localStorage.getItem('authToken');
        const guestToken = localStorage.getItem('guestToken');
        
        const body = { productId, quantity };
        
        if (!authToken && guestToken) {
            body.guestToken = guestToken;
        }
        
        const response = await fetch(`${API_BASE_URL}/cart/update-quantity`, {
            method: 'PUT',
            headers: createHeaders(!!authToken),
            body: JSON.stringify(body),
        });
        
        return handleResponse(response);
    },

    // Limpar carrinho
    clearCart: async () => {
        const authToken = localStorage.getItem('authToken');
        const guestToken = localStorage.getItem('guestToken');
        
        const body = {};
        
        if (!authToken && guestToken) {
            body.guestToken = guestToken;
        }
        
        const response = await fetch(`${API_BASE_URL}/cart/clear`, {
            method: 'POST',
            headers: createHeaders(!!authToken),
            body: JSON.stringify(body),
        });
        
        return handleResponse(response);
    },

    // Listar participantes do carrinho
    getParticipants: async () => {
        const authToken = localStorage.getItem('authToken');
        const guestToken = localStorage.getItem('guestToken');
        
        let url = `${API_BASE_URL}/cart/participants`;
        let headers = createHeaders(false);
        
        if (authToken) {
            headers.Authorization = `Bearer ${authToken}`;
        } else if (guestToken) {
            url += `?guestToken=${guestToken}`;
        }
        
        const response = await fetch(url, { headers });
        
        return handleResponse(response);
    },

    // Adicionar participante ao carrinho
    addParticipant: async (name) => {
        const authToken = localStorage.getItem('authToken');
        const guestToken = localStorage.getItem('guestToken');
        
        const body = { name };
        
        if (!authToken && guestToken) {
            body.guestToken = guestToken;
        }
        
        const response = await fetch(`${API_BASE_URL}/cart/participants/add`, {
            method: 'POST',
            headers: createHeaders(!!authToken),
            body: JSON.stringify(body),
        });
        
        return handleResponse(response);
    },

    // Remover participante do carrinho
    removeParticipant: async (name) => {
        const authToken = localStorage.getItem('authToken');
        const guestToken = localStorage.getItem('guestToken');
        
        const body = { name };
        
        if (!authToken && guestToken) {
            body.guestToken = guestToken;
        }
        
        const response = await fetch(`${API_BASE_URL}/cart/participants/remove`, {
            method: 'POST',
            headers: createHeaders(!!authToken),
            body: JSON.stringify(body),
        });
        
        return handleResponse(response);
    },
};

// Exportação padrão com todas as APIs
const api = {
    auth: authAPI,
    profile: profileAPI,
    products: productsAPI,
    cart: cartAPI,
};

export default api;
