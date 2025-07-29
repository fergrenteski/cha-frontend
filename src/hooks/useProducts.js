import { useState, useEffect, useCallback } from 'react';
import { productsAPI } from '../services/api';

export const useProducts = (initialFilters = {}) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState(initialFilters);

    // Função para buscar produtos
    const fetchProducts = useCallback(async (searchFilters = {}) => {
        setLoading(true);
        setError(null);
        
        try {
            const data = await productsAPI.getProducts(searchFilters);
            setProducts(data);
        } catch (err) {
            console.error('Erro ao buscar produtos:', err);
            setError(err.message);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Função para buscar categorias
    const fetchCategories = useCallback(async () => {
        try {
            const data = await productsAPI.getCategories();
            setCategories(data);
        } catch (err) {
            console.error('Erro ao buscar categorias:', err);
        }
    }, []);

    // Função para buscar produto por ID
    const getProductById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        
        try {
            const product = await productsAPI.getProductById(id);
            return product;
        } catch (err) {
            console.error('Erro ao buscar produto:', err);
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Função para aplicar filtros
    const applyFilters = useCallback((newFilters) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        fetchProducts(updatedFilters);
    }, [filters, fetchProducts]);

    // Função para limpar filtros
    const clearFilters = useCallback(() => {
        setFilters({});
        fetchProducts({});
    }, [fetchProducts]);

    // Função para pesquisar produtos
    const searchProducts = useCallback((searchTerm) => {
        const searchFilters = { ...filters, search: searchTerm };
        setFilters(searchFilters);
        fetchProducts(searchFilters);
    }, [filters, fetchProducts]);

    // Carregar produtos e categorias na inicialização
    useEffect(() => {
        fetchProducts(initialFilters);
        fetchCategories();
    }, [fetchProducts, fetchCategories]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        // Estado
        products,
        categories,
        loading,
        error,
        filters,
        
        // Funções
        fetchProducts,
        fetchCategories,
        getProductById,
        applyFilters,
        clearFilters,
        searchProducts,
        
        // Utilitários
        refresh: () => fetchProducts(filters),
        clearError: () => setError(null)
    };
};
