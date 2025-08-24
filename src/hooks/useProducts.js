import { useState, useEffect, useCallback, useMemo } from 'react';
import { productsAPI } from '../services/api';
import { debounce } from '../utils/performance';

export const useProducts = (initialFilters = {}) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true); // Carregamento inicial
    const [filterLoading, setFilterLoading] = useState(false); // Carregamento de filtros
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState(initialFilters);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        hasMore: false
    });

    // Função para busca inicial (mostra loading completo)
    const fetchProductsInitial = useMemo(
        () => debounce(async (searchFilters = {}) => {
            setLoading(true);
            setError(null);
            
            try {
                const data = await productsAPI.getProducts(searchFilters);
                
                // Verificar se a resposta tem estrutura de paginação
                if (data.products && data.pagination) {
                    setProducts(data.products);
                    setPagination(data.pagination);
                } else {
                    // Retorno antigo (sem paginação)
                    setProducts(data);
                    setPagination({
                        currentPage: 1,
                        totalPages: 1,
                        totalProducts: data.length,
                        hasMore: false
                    });
                }
            } catch (err) {
                console.error('Erro ao buscar produtos:', err);
                setError(err.message);
                setProducts([]);
                setPagination({
                    currentPage: 1,
                    totalPages: 1,
                    totalProducts: 0,
                    hasMore: false
                });
            } finally {
                setLoading(false);
            }
        }, 300),
        []
    );

    // Função para filtros (mostra loading menor/overlay)
    const debouncedFetchProducts = useMemo(
        () => debounce(async (searchFilters = {}) => {
            setFilterLoading(true);
            setError(null);
            
            try {
                const data = await productsAPI.getProducts(searchFilters);
                
                // Verificar se a resposta tem estrutura de paginação
                if (data.products && data.pagination) {
                    setProducts(data.products);
                    setPagination(data.pagination);
                } else {
                    // Retorno antigo (sem paginação)
                    setProducts(data);
                    setPagination({
                        currentPage: 1,
                        totalPages: 1,
                        totalProducts: data.length,
                        hasMore: false
                    });
                }
            } catch (err) {
                console.error('Erro ao buscar produtos:', err);
                setError(err.message);
                setProducts([]);
                setPagination({
                    currentPage: 1,
                    totalPages: 1,
                    totalProducts: 0,
                    hasMore: false
                });
            } finally {
                setFilterLoading(false);
            }
        }, 300),
        []
    );

    // Função para buscar produtos (usa filtros, não loading completo)
    const fetchProducts = useCallback(async (searchFilters = {}) => {
        debouncedFetchProducts(searchFilters);
    }, [debouncedFetchProducts]);

    // Função para buscar produtos inicial (usa loading completo)
    const fetchProductsWithLoading = useCallback(async (searchFilters = {}) => {
        fetchProductsInitial(searchFilters);
    }, [fetchProductsInitial]);

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
        const searchFilters = { ...filters, search: searchTerm, page: 1 }; // Reset page on search
        setFilters(searchFilters);
        fetchProducts(searchFilters);
    }, [filters, fetchProducts]);

    // Função para filtrar por categoria
    const filterByCategory = useCallback((category) => {
        const categoryFilters = { ...filters, category, page: 1 }; // Reset page on filter
        setFilters(categoryFilters);
        fetchProducts(categoryFilters);
    }, [filters, fetchProducts]);

    // Função para ordenar produtos
    const sortProducts = useCallback((sortBy, order) => {
        const sortFilters = { ...filters, sortBy, order, page: 1 }; // Reset page on sort
        setFilters(sortFilters);
        fetchProducts(sortFilters);
    }, [filters, fetchProducts]);

    // Funções de paginação
    const goToPage = useCallback((page) => {
        const pageFilters = { ...filters, page };
        setFilters(pageFilters);
        fetchProducts(pageFilters);
    }, [filters, fetchProducts]);

    const nextPage = useCallback(() => {
        if (pagination.hasMore) {
            goToPage(pagination.currentPage + 1);
        }
    }, [pagination.hasMore, pagination.currentPage, goToPage]);

    const prevPage = useCallback(() => {
        if (pagination.currentPage > 1) {
            goToPage(pagination.currentPage - 1);
        }
    }, [pagination.currentPage, goToPage]);

    const setItemsPerPage = useCallback((limit) => {
        const limitFilters = { ...filters, limit, page: 1 }; // Reset page when changing limit
        setFilters(limitFilters);
        fetchProducts(limitFilters);
    }, [filters, fetchProducts]);

    // Carregar produtos e categorias na inicialização
    useEffect(() => {
        fetchProductsWithLoading(initialFilters);
        fetchCategories();
    }, [fetchProductsWithLoading, fetchCategories]); // eslint-disable-line react-hooks/exhaustive-deps

    // Memoizar objeto de retorno para evitar re-renders desnecessários
    const returnValue = useMemo(() => ({
        // Estado
        products,
        categories,
        loading,
        filterLoading,
        error,
        filters,
        pagination,
        
        // Funções
        fetchProducts,
        fetchCategories,
        getProductById,
        applyFilters,
        clearFilters,
        searchProducts,
        filterByCategory,
        sortProducts,
        
        // Funções de paginação
        goToPage,
        nextPage,
        prevPage,
        setItemsPerPage,
        
        // Utilitários
        refresh: () => fetchProducts(filters),
        clearError: () => setError(null)
    }), [
        products, 
        categories, 
        loading,
        filterLoading,
        error, 
        filters,
        pagination,
        fetchProducts,
        fetchCategories,
        getProductById,
        applyFilters,
        clearFilters,
        searchProducts,
        filterByCategory,
        sortProducts,
        goToPage,
        nextPage,
        prevPage,
        setItemsPerPage
    ]);

    return returnValue;
};
