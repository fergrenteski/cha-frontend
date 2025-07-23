// contexts/CartContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Tipos de ações
const CART_ACTIONS = {
    ADD_ITEM: 'ADD_ITEM',
    REMOVE_ITEM: 'REMOVE_ITEM',
    UPDATE_QUANTITY: 'UPDATE_QUANTITY',
    CLEAR_CART: 'CLEAR_CART',
    LOAD_CART: 'LOAD_CART'
};

// Estado inicial
const initialState = {
    items: [],
    totalItems: 0,
    totalPrice: 0
};

// Reducer para gerenciar o estado do carrinho
const cartReducer = (state, action) => {
    switch (action.type) {
        case CART_ACTIONS.ADD_ITEM: {
            const { item } = action.payload;
            const existingItemIndex = state.items.findIndex(cartItem => cartItem.id === item.id);

            let updatedItems;
            if (existingItemIndex >= 0) {
                // Item já existe, aumenta a quantidade
                updatedItems = state.items.map((cartItem, index) =>
                    index === existingItemIndex
                        ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
                        : cartItem
                );
            } else {
                // Novo item
                updatedItems = [...state.items, { ...item, quantity: item.quantity || 1 }];
            }

            return calculateCartTotals({ ...state, items: updatedItems });
        }

        case CART_ACTIONS.REMOVE_ITEM: {
            const { itemId } = action.payload;
            const updatedItems = state.items.filter(item => item.id !== itemId);
            return calculateCartTotals({ ...state, items: updatedItems });
        }

        case CART_ACTIONS.UPDATE_QUANTITY: {
            const { itemId, quantity } = action.payload;

            if (quantity <= 0) {
                // Se quantidade for 0 ou menor, remove o item
                const updatedItems = state.items.filter(item => item.id !== itemId);
                return calculateCartTotals({ ...state, items: updatedItems });
            }

            const updatedItems = state.items.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            );

            return calculateCartTotals({ ...state, items: updatedItems });
        }

        case CART_ACTIONS.CLEAR_CART: {
            return { ...initialState };
        }

        case CART_ACTIONS.LOAD_CART: {
            const { items } = action.payload;
            return calculateCartTotals({ ...state, items });
        }

        default:
            return state;
    }
};

// Função auxiliar para calcular totais
const calculateCartTotals = (state) => {
    const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return {
        ...state,
        totalItems,
        totalPrice
    };
};

// Context
const CartContext = createContext();

// Provider
export const CartProvider = ({ children }) => {
    const [cartState, dispatch] = useReducer(cartReducer, initialState);

    // Carregar carrinho do localStorage na inicialização
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('cartItems');
            if (savedCart) {
                const items = JSON.parse(savedCart);
                dispatch({ type: CART_ACTIONS.LOAD_CART, payload: { items } });
            }
        } catch (error) {
            console.error('Erro ao carregar carrinho do localStorage:', error);
        }
    }, []);

    // Salvar carrinho no localStorage sempre que mudar
    useEffect(() => {
        try {
            localStorage.setItem('cartItems', JSON.stringify(cartState.items));
        } catch (error) {
            console.error('Erro ao salvar carrinho no localStorage:', error);
        }
    }, [cartState.items]);

    // Actions
    const addItem = (item) => {
        dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: { item } });
    };

    const removeItem = (itemId) => {
        dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: { itemId } });
    };

    const updateQuantity = (itemId, quantity) => {
        dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { itemId, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: CART_ACTIONS.CLEAR_CART });
    };

    const isItemInCart = (itemId) => {
        return cartState.items.some(item => item.id === itemId);
    };

    const getItemQuantity = (itemId) => {
        const item = cartState.items.find(item => item.id === itemId);
        return item ? item.quantity : 0;
    };

    const value = {
        // Estado
        items: cartState.items,
        totalItems: cartState.totalItems,
        totalPrice: cartState.totalPrice,

        // Actions
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isItemInCart,
        getItemQuantity
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// Hook personalizado para usar o contexto
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart deve ser usado dentro de um CartProvider');
    }
    return context;
};

export default CartContext;