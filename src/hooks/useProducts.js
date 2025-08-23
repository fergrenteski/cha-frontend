import { useState, useEffect, useCallback, useMemo } from 'react';
import { productsAPI } from '../services/api';
import { debounce } from '../utils/performance';

export const useProducts = (initialFilters = {}) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true); // Iniciar como true
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState(initialFilters);

    // Memoizar função de busca de produtos com debounce
    const debouncedFetchProducts = useMemo(
        () => debounce(async (searchFilters = {}) => {
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
        }, 300), // 300ms de delay
        []
    );

    // Função para buscar produtos
    const fetchProducts = useCallback(async (searchFilters = {}) => {
        debouncedFetchProducts(searchFilters);
    }, [debouncedFetchProducts]);

    // Função para buscar categorias
    const fetchCategories = useCallback(async () => {
        try {
            const data = await productsAPI.getCategories();
            setCategories(data);
        } catch (err) {
            console.error('Erro ao buscar categorias:', err);
        }
    }, []);

    // Função para buscar produto por ID com cache
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

    // Função para aplicar filtros com memoização
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

    // Função para pesquisar produtos com debounce
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

    // Memoizar objeto de retorno para evitar re-renders desnecessários
    const returnValue = useMemo(() => ({
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
    }), [
        products, 
        categories, 
        loading, 
        error, 
        filters,
        fetchProducts,
        fetchCategories,
        getProductById,
        applyFilters,
        clearFilters,
        searchProducts
    ]);

    return returnValue;
};
