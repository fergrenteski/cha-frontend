import React, { createContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { favoritesAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export const FavoritesContext = createContext();

// Actions
const FAVORITES_ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_FAVORITES: 'SET_FAVORITES',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
    TOGGLE_FAVORITE: 'TOGGLE_FAVORITE',
    SET_INITIALIZED: 'SET_INITIALIZED',
};

// Reducer
const favoritesReducer = (state, action) => {
    switch (action.type) {
        case FAVORITES_ACTIONS.SET_LOADING:
            return { ...state, loading: action.payload };
        case FAVORITES_ACTIONS.SET_FAVORITES:
            return { 
                ...state, 
                items: action.payload.products || action.payload || [],
                loading: false,
                error: null,
                initialized: true
            };
        case FAVORITES_ACTIONS.SET_ERROR:
            return { ...state, error: action.payload, loading: false };
        case FAVORITES_ACTIONS.CLEAR_ERROR:
            return { ...state, error: null };
        case FAVORITES_ACTIONS.SET_INITIALIZED:
            return { ...state, initialized: action.payload };
        case FAVORITES_ACTIONS.TOGGLE_FAVORITE: {
            const { productId, isFavorite } = action.payload;
            if (isFavorite) {
                // Adicionar aos favoritos
                return {
                    ...state,
                    items: [...state.items, { product: { _id: productId } }]
                };
            } else {
                // Remover dos favoritos
                return {
                    ...state,
                    items: state.items.filter(item => item?.product?._id !== productId)
                };
            }
        }
        default:
            return state;
    }
};

// Estado inicial
const initialState = {
    items: [],
    loading: false,
    error: null,
    initialized: false,
};

export const FavoritesProvider = ({ children }) => {
    const [favoritesState, dispatch] = useReducer(favoritesReducer, initialState);
    const { user } = useAuth();

    // Marcar como inicializado assim que o componente é montado
    useEffect(() => {
        dispatch({ type: FAVORITES_ACTIONS.SET_INITIALIZED, payload: true });
    }, []);

    // Carregar favoritos na inicialização ou quando autenticação muda
    useEffect(() => {
        const loadFavorites = async () => {
            // Se não está logado, limpar favoritos
            if (!user) {
                dispatch({ type: FAVORITES_ACTIONS.SET_FAVORITES, payload: [] });
                return;
            }

            dispatch({ type: FAVORITES_ACTIONS.SET_LOADING, payload: true });
            
            try {
                const favorites = await favoritesAPI.getFavorites();
                dispatch({ type: FAVORITES_ACTIONS.SET_FAVORITES, payload: favorites });
            } catch (error) {
                console.error('Erro ao carregar favoritos:', error);
                dispatch({ type: FAVORITES_ACTIONS.SET_ERROR, payload: error.message });
                // Se falhar, inicializar com favoritos vazios
                dispatch({ type: FAVORITES_ACTIONS.SET_FAVORITES, payload: [] });
            }
        };

        loadFavorites();
    }, [user]);

    // Função para adicionar/remover favorito
    const toggleFavorite = useCallback(async (productId) => {
        if (!user) {
            dispatch({ type: FAVORITES_ACTIONS.SET_ERROR, payload: 'Login necessário para gerenciar favoritos' });
            return;
        }

        dispatch({ type: FAVORITES_ACTIONS.CLEAR_ERROR });
        
        try {
            const isCurrentlyFavorite = favoritesState.items.some(
                item => item?.product?._id === productId
            );
            
            if (isCurrentlyFavorite) {
                await favoritesAPI.removeFromFavorites(productId);
                dispatch({ 
                    type: FAVORITES_ACTIONS.TOGGLE_FAVORITE, 
                    payload: { productId, isFavorite: false } 
                });
            } else {
                await favoritesAPI.addToFavorites(productId);
                dispatch({ 
                    type: FAVORITES_ACTIONS.TOGGLE_FAVORITE, 
                    payload: { productId, isFavorite: true } 
                });
            }
        } catch (error) {
            console.error('Erro ao toggle favorito:', error);
            dispatch({ type: FAVORITES_ACTIONS.SET_ERROR, payload: error.message });
        }
    }, [favoritesState.items, user]);

    // Função para verificar se um produto está nos favoritos
    const isFavorite = useCallback((productId) => {
        return favoritesState.items.some(item => item?.product?._id === productId);
    }, [favoritesState.items]);

    // Função para limpar todos os favoritos
    const clearFavorites = useCallback(async () => {
        if (!user) {
            dispatch({ type: FAVORITES_ACTIONS.SET_ERROR, payload: 'Login necessário para limpar favoritos' });
            return;
        }

        dispatch({ type: FAVORITES_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: FAVORITES_ACTIONS.CLEAR_ERROR });
        
        try {
            await favoritesAPI.clearFavorites();
            dispatch({ type: FAVORITES_ACTIONS.SET_FAVORITES, payload: [] });
        } catch (error) {
            console.error('Erro ao limpar favoritos:', error);
            dispatch({ type: FAVORITES_ACTIONS.SET_ERROR, payload: error.message });
        }
    }, [user]);

    // Função para recarregar favoritos
    const refreshFavorites = useCallback(async () => {
        if (!user) {
            dispatch({ type: FAVORITES_ACTIONS.SET_FAVORITES, payload: [] });
            return;
        }

        dispatch({ type: FAVORITES_ACTIONS.SET_LOADING, payload: true });
        
        try {
            const favorites = await favoritesAPI.getFavorites();
            dispatch({ type: FAVORITES_ACTIONS.SET_FAVORITES, payload: favorites });
        } catch (error) {
            console.error('Erro ao recarregar favoritos:', error);
            dispatch({ type: FAVORITES_ACTIONS.SET_ERROR, payload: error.message });
        }
    }, [user]);

    // Função para limpar erro
    const clearError = useCallback(() => {
        dispatch({ type: FAVORITES_ACTIONS.CLEAR_ERROR });
    }, []);

    // Valor do contexto
    const value = useMemo(() => ({
        ...favoritesState,
        totalFavorites: favoritesState.items.length,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        refreshFavorites,
        clearError,
    }), [
        favoritesState, 
        toggleFavorite, 
        isFavorite, 
        clearFavorites, 
        refreshFavorites, 
        clearError
    ]);

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};

FavoritesProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
