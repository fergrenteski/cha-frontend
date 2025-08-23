import React, { createContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { authAPI, profileAPI, cartAPI, favoritesAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar se há um token de autenticação salvo e buscar perfil
        const checkAuth = async () => {
            const token = localStorage.getItem('authToken');
            
            if (token) {
                try {
                    const userProfile = await profileAPI.getProfile();
                    setUser(userProfile);
                } catch (error) {
                    console.error('Erro ao verificar autenticação:', error);
                    // Token inválido, limpar storage
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userData');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            await authAPI.login(email, password);
            
            // Migrar carrinho de guest se existir
            try {
                await cartAPI.migrateGuestCart();
            } catch (migrationError) {
                console.warn('Erro ao migrar carrinho de guest:', migrationError);
                // Não falhar o login por causa da migração
            }

            // Migrar favoritos de guest se existir
            try {
                await favoritesAPI.migrateGuestFavorites();
            } catch (migrationError) {
                console.warn('Erro ao migrar favoritos de guest:', migrationError);
                // Não falhar o login por causa da migração
            }
            
            // Buscar perfil completo do usuário
            const userProfile = await profileAPI.getProfile();
            setUser(userProfile);
            
            // Salvar dados do usuário também no localStorage para backup
            localStorage.setItem('userData', JSON.stringify(userProfile));
            
            return userProfile;
        } catch (error) {
            throw new Error(error.message || 'Erro ao fazer login');
        }
    };

    const register = async (userData) => {
        try {
            await authAPI.register(userData);
            
            // Migrar carrinho de guest se existir
            try {
                await cartAPI.migrateGuestCart();
            } catch (migrationError) {
                console.warn('Erro ao migrar carrinho de guest:', migrationError);
                // Não falhar o registro por causa da migração
            }

            // Migrar favoritos de guest se existir
            try {
                await favoritesAPI.migrateGuestFavorites();
            } catch (migrationError) {
                console.warn('Erro ao migrar favoritos de guest:', migrationError);
                // Não falhar o registro por causa da migração
            }
            
            // Buscar perfil completo do usuário após registro
            const userProfile = await profileAPI.getProfile();
            setUser(userProfile);
            
            // Salvar dados do usuário também no localStorage para backup
            localStorage.setItem('userData', JSON.stringify(userProfile));
            
            return userProfile;
        } catch (error) {
            throw new Error(error.message || 'Erro ao criar conta');
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setUser(null);
    };

    const updateUser = (updatedUserData) => {
        setUser(updatedUserData);
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
    };

    const value = useMemo(() => ({
        user,
        login,
        register,
        logout,
        updateUser,
        loading,
        isAuthenticated: !!user
    }), [user, loading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
