import React, { createContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { cartAPI, ordersAPI, authAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

// Tipos de ações
const CART_ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_CART: 'SET_CART',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR'
};

// Estado inicial
const initialState = {
    items: [],
    participants: [],
    totalItems: 0,
    totalPrice: 0,
    loading: false,
    error: null
};

// Reducer para gerenciar o estado do carrinho
const cartReducer = (state, action) => {
    switch (action.type) {
        case CART_ACTIONS.SET_LOADING:
            return { ...state, loading: action.payload };
            
        case CART_ACTIONS.SET_CART: {
            const { cart } = action.payload;
            const items = cart?.products || [];
            const participants = cart?.participants || [];
            
            // Verificar se os produtos estão populados corretamente
            const validItems = items.filter(item => {
                if (!item.product || typeof item.product === 'string') {
                    console.warn('Item with invalid product data:', item);
                    return false;
                }
                return true;
            });
            
            // Calcular totais
            const totalItems = validItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = validItems.reduce((sum, item) => {
                const price = item.product?.price || 0;
                return sum + (price * item.quantity);
            }, 0);
            
            return {
                ...state,
                items: validItems,
                participants,
                totalItems,
                totalPrice,
                loading: false,
                error: null
            };
        }
        
        case CART_ACTIONS.SET_ERROR:
            return { ...state, error: action.payload, loading: false };
            
        case CART_ACTIONS.CLEAR_ERROR:
            return { ...state, error: null };
            
        default:
            return state;
    }
};

// Context
export const CartContext = createContext();

// Provider
export const CartProvider = ({ children }) => {
    const [cartState, dispatch] = useReducer(cartReducer, initialState);
    const { user } = useAuth(); // Obter informações do usuário logado

    // Função para garantir token de convidado
    const ensureGuestToken = async () => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) return; // Usuário autenticado, não precisa de guest token
        
        let guestToken = localStorage.getItem('guestToken');
        if (!guestToken) {
            try {
                await authAPI.createGuestSession();
            } catch (error) {
                console.error('Erro ao criar sessão de convidado:', error);
            }
        }
    };

    // Carregar carrinho na inicialização ou quando autenticação muda
    useEffect(() => {
        const loadCart = async () => {
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
            
            try {
                await ensureGuestToken();
                
                // Aguardar um pouco se acabou de fazer login para permitir migração
                if (user && localStorage.getItem('guestToken')) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                
                const cart = await cartAPI.getCart();
                dispatch({ type: CART_ACTIONS.SET_CART, payload: { cart } });
            } catch (error) {
                console.error('Erro ao carregar carrinho:', error);
                dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
                // Se falhar, inicializar com carrinho vazio
                dispatch({ type: CART_ACTIONS.SET_CART, payload: { cart: { products: [] } } });
            }
        };

        loadCart();
    }, [user]); // Dependência do user para recarregar quando login/logout

    // Função para adicionar item ao carrinho
    const addItem = useCallback(async (product, quantity = 1) => {
        dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: CART_ACTIONS.CLEAR_ERROR });
        
        try {
            await ensureGuestToken();
            const updatedCart = await cartAPI.addToCart(product._id, quantity);
            
            // Verificar se o carrinho retornado tem produtos populados
            // Se não tiver, fazer uma busca separada do carrinho
            if (updatedCart?.products?.some(item => typeof item.product === 'string')) {
                console.warn('API returned cart with unpopulated products, fetching full cart...');
                const fullCart = await cartAPI.getCart();
                dispatch({ type: CART_ACTIONS.SET_CART, payload: { cart: fullCart } });
            } else {
                dispatch({ type: CART_ACTIONS.SET_CART, payload: { cart: updatedCart } });
            }
        } catch (error) {
            console.error('Erro ao adicionar item:', error);
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
        }
    }, []);

    // Função para remover item do carrinho
    const removeItem = useCallback(async (productId) => {
        dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: CART_ACTIONS.CLEAR_ERROR });
        
        try {
            const updatedCart = await cartAPI.removeFromCart(productId);
            
            // Verificar se precisa buscar o carrinho completo
            if (updatedCart?.products?.some(item => typeof item.product === 'string')) {
                const fullCart = await cartAPI.getCart();
                dispatch({ type: CART_ACTIONS.SET_CART, payload: { cart: fullCart } });
            } else {
                dispatch({ type: CART_ACTIONS.SET_CART, payload: { cart: updatedCart } });
            }
        } catch (error) {
            console.error('Erro ao remover item:', error);
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
        }
    }, []);

    // Função para atualizar quantidade
    const updateQuantity = useCallback(async (productId, newQuantity) => {
        if (newQuantity <= 0) {
            // Se a quantidade for 0 ou menor, remover o item
            await removeItem(productId);
            return;
        }
        
        dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: CART_ACTIONS.CLEAR_ERROR });
        
        try {
            const updatedCart = await cartAPI.updateQuantity(productId, newQuantity);
            
            // Verificar se precisa buscar o carrinho completo
            if (updatedCart?.products?.some(item => typeof item.product === 'string')) {
                const fullCart = await cartAPI.getCart();
                dispatch({ type: CART_ACTIONS.SET_CART, payload: { cart: fullCart } });
            } else {
                dispatch({ type: CART_ACTIONS.SET_CART, payload: { cart: updatedCart } });
            }
        } catch (error) {
            console.error('Erro ao atualizar quantidade:', error);
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
        }
    }, [removeItem]);

    // Função para limpar carrinho
    const clearCart = useCallback(async () => {
        dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: CART_ACTIONS.CLEAR_ERROR });
        
        try {
            const updatedCart = await cartAPI.clearCart();
            dispatch({ type: CART_ACTIONS.SET_CART, payload: { cart: updatedCart } });
        } catch (error) {
            console.error('Erro ao limpar carrinho:', error);
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
        }
    }, []);

    // Função para verificar se item está no carrinho
    const isItemInCart = useCallback((productId) => {
        return cartState.items.some(item => item.product._id === productId);
    }, [cartState.items]);

    // Função para obter quantidade de um item
    const getItemQuantity = useCallback((productId) => {
        const item = cartState.items.find(item => item.product._id === productId);
        return item ? item.quantity : 0;
    }, [cartState.items]);

    // Função para recarregar carrinho
    const refreshCart = useCallback(async () => {
        dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
        
        try {
            const cart = await cartAPI.getCart();
            dispatch({ type: CART_ACTIONS.SET_CART, payload: { cart } });
        } catch (error) {
            console.error('Erro ao recarregar carrinho:', error);
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
        }
    }, []);

    const clearError = useCallback(() => {
        dispatch({ type: CART_ACTIONS.CLEAR_ERROR });
    }, []);

    // Função para adicionar participante
    const addParticipant = useCallback(async (name) => {
        if (!name?.trim()) return;
        
        dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: CART_ACTIONS.CLEAR_ERROR });
        
        try {
            const result = await cartAPI.addParticipant(name.trim());
            const cart = await cartAPI.getCart();
            dispatch({ type: CART_ACTIONS.SET_CART, payload: { cart } });
            return result;
        } catch (error) {
            console.error('Erro ao adicionar participante:', error);
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
            throw error;
        }
    }, []);

    // Função para remover participante
    const removeParticipant = useCallback(async (name) => {
        if (!name?.trim()) return;
        
        dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: CART_ACTIONS.CLEAR_ERROR });
        
        try {
            const result = await cartAPI.removeParticipant(name.trim());
            const cart = await cartAPI.getCart();
            dispatch({ type: CART_ACTIONS.SET_CART, payload: { cart } });
            return result;
        } catch (error) {
            console.error('Erro ao remover participante:', error);
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
            throw error;
        }
    }, []);

    // Função para finalizar compra (checkout via WhatsApp)
    const handleCheckout = useCallback(async () => {
        dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: CART_ACTIONS.CLEAR_ERROR });
        
        try {
            // Verificar se o usuário está logado
            if (!user) {
                dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'É necessário fazer login para enviar o pedido' });
                return { 
                    success: false, 
                    error: 'É necessário fazer login para enviar o pedido',
                    requiresLogin: true 
                };
            }

            // Função para criar mensagem formatada do WhatsApp
            const createWhatsAppMessage = (items, participants, totalPrice, orderNumber) => {
                const currentDate = new Date().toLocaleDateString('pt-BR');
                const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                
                // Nome do organizador (usuário logado)
                let organizerName = 'Voce (organizador)';
                if (user?.firstName && user?.lastName) {
                    organizerName = `${user.firstName} ${user.lastName} (organizador)`;
                } else if (user?.firstName) {
                    organizerName = `${user.firstName} (organizador)`;
                }
                
                let message = `*PEDIDO DE CHA DE CASA NOVA*\n\n`;
                message += `*Numero do Pedido:* ${orderNumber}\n`;
                message += `Data: ${currentDate} as ${currentTime}\n\n`;
                
                // Lista de participantes (incluindo quem está comprando)
                message += `*PARTICIPANTES:*\n`;
                message += `1. ${organizerName}\n`;
                if (participants.length > 0) {
                    participants.forEach((participant, index) => {
                        message += `${index + 2}. ${participant}\n`;
                    });
                }
                message += `\n`;
                
                // Lista de produtos
                message += `*PRODUTOS SELECIONADOS:*\n`;
                items.forEach((item, index) => {
                    const productName = item.product.name;
                    const quantity = item.quantity;
                    const unitPrice = item.product.price;
                    const totalItemPrice = unitPrice * quantity;
                    
                    message += `${index + 1}. ${productName}\n`;
                    message += `   Quantidade: ${quantity}x\n`;
                    message += `   Valor unitario: R$ ${unitPrice.toFixed(2).replace('.', ',')}\n`;
                    message += `   Subtotal: R$ ${totalItemPrice.toFixed(2).replace('.', ',')}\n\n`;
                });
                
                // Total
                message += `*VALOR TOTAL: R$ ${totalPrice.toFixed(2).replace('.', ',')}*\n\n`;
                
                // Informações adicionais
                message += `*Observacoes:*\n`;
                message += `- Total de ${items.length} ${items.length === 1 ? 'produto' : 'produtos'} selecionado${items.length === 1 ? '' : 's'}\n`;
                message += `- ${participants.length + 1} ${participants.length + 1 === 1 ? 'participante' : 'participantes'} no cha\n\n`;
                
                message += `Obrigado!`;
                
                return message;
            };

            // Criar pedido no backend primeiro para obter o número do pedido
            let orderData;
            try {
                orderData = await ordersAPI.createOrder();
                console.log('Pedido criado no backend:', orderData);
            } catch (backendError) {
                console.error('Erro ao criar pedido no backend:', backendError);
                return { 
                    success: false, 
                    error: backendError.message || 'Erro ao criar pedido no backend',
                };
            }

            // Criar mensagem formatada para WhatsApp com o número do pedido
            const whatsappMessage = createWhatsAppMessage(
                cartState.items, 
                cartState.participants, 
                cartState.totalPrice,
                orderData.orderNumber || orderData._id || 'N/A'
            );
            
            // Número do WhatsApp (sem espaços e caracteres especiais)
            const phoneNumber = "5541988987128";
            
            // URL do WhatsApp
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
            
            return {
                success: true,
                whatsapp_url: whatsappUrl,
                message: whatsappMessage,
                orderNumber: orderData.orderNumber || orderData._id,
                orderId: orderData._id
            };
        } catch (error) {
            console.error('Erro ao preparar checkout:', error);
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
            throw error;
        } finally {
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
        }
    }, [cartState.items, cartState.participants, cartState.totalPrice, user]);

    const value = useMemo(() => ({
        // Estado
        items: cartState.items,
        participants: cartState.participants,
        totalItems: cartState.totalItems,
        totalPrice: cartState.totalPrice,
        loading: cartState.loading,
        error: cartState.error,
        isAuthenticated: !!user,
        user: user,
        // Actions
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isItemInCart,
        getItemQuantity,
        refreshCart,
        clearError,
        addParticipant,
        removeParticipant,
        handleCheckout
    }), [cartState, addItem, removeItem, updateQuantity, clearCart, isItemInCart, getItemQuantity, refreshCart, clearError, addParticipant, removeParticipant, handleCheckout, user]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};