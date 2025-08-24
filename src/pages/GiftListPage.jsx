// pages/GiftListPage.js
import React, { useState } from 'react';
import { 
    Grid, 
    Container, 
    Snackbar, 
    Alert, 
    CircularProgress, 
    Box, 
    Typography, 
    Paper,
    useTheme,
    useMediaQuery,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Chip
} from '@mui/material';
import { 
    Search as SearchIcon,
    Clear as ClearIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';
import GiftCard from '../components/GiftCard';
import ProductPagination from '../components/ProductPagination.jsx';
import { useCart } from '../hooks/useCart';
import { useProducts } from '../hooks/useProducts';

const GiftListPage = () => {
    // Usar o contexto do carrinho
    const { addItem, removeItem, isItemInCart } = useCart();

    // Usar o hook de produtos com paginação
    const {
        products,
        categories,
        loading: productsLoading,
        filterLoading,
        error: productsError,
        filters,
        pagination,
        searchProducts,
        filterByCategory,
        sortProducts,
        clearFilters: clearProductFilters,
        goToPage,
        setItemsPerPage
    } = useProducts();

    // Estados dos filtros locais
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortOrder, setSortOrder] = useState(''); // 'asc', 'desc', ''

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Funções de controle dos filtros
    const handleSearch = () => {
        searchProducts(searchTerm);
    };

    const handleCategoryFilter = (category) => {
        setSelectedCategory(category);
        filterByCategory(category);
    };

    const handleSortChange = (order) => {
        setSortOrder(order);
        if (order === 'asc') {
            sortProducts('price', 'asc');
        } else if (order === 'desc') {
            sortProducts('price', 'desc');
        } else {
            sortProducts('createdAt', 'desc'); // Ordenação padrão
        }
    };

    const handleClearFilters = () => {
        // Limpar estados locais
        setSearchTerm('');
        setSelectedCategory('');
        setSortOrder('');
        // Limpar filtros do backend e recarregar produtos
        clearProductFilters();
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (searchTerm) count++;
        if (selectedCategory) count++;
        if (sortOrder) count++;
        return count;
    };

    // Função para adicionar item ao carrinho
    const handleAddToCart = async (product) => {
        try {
            // Adiciona o item ao carrinho (ou aumenta a quantidade se já existir)
            await addItem(product, 1);

            setSnackbar({
                open: true,
                message: `${product.name} adicionado ao carrinho!`,
                severity: 'success'
            });
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
            setSnackbar({
                open: true,
                message: `Erro ao adicionar ${product.name} ao carrinho!`,
                severity: 'error'
            });
        }
    };

    // Função para remover item do carrinho
    const handleRemoveFromCart = async (productId) => {
        try {
            const product = products.find(p => p._id === productId);
            await removeItem(productId);

            setSnackbar({
                open: true,
                message: `${product?.name || 'Item'} removido do carrinho!`,
                severity: 'warning'
            });
        } catch (error) {
            console.error('Erro ao remover do carrinho:', error);
            setSnackbar({
                open: true,
                message: `Erro ao remover item do carrinho!`,
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    // Renderizar loading
    if (productsLoading) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress size={60} />
                </Box>
            </Container>
        );
    }

    // Renderizar erro
    if (productsError) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <Typography variant="h6" color="error" textAlign="center">
                        Erro ao carregar produtos: {productsError}
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <>
            <Box sx={{ 
                mb: { xs: 2, md: 3 }, 
                textAlign: 'center',
                px: { xs: 1, sm: 2 }
            }}>
                <Typography
                    variant={isMobile ? "h4" : "h3"}
                    component="h1"
                    sx={{
                        fontWeight: 300,
                        color: theme.palette.text.primary,
                        mb: 1,
                        mt: 2,
                        fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' }
                    }}
                >
                    Lista de Presentes
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ 
                        maxWidth: 600, 
                        mx: 'auto',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        px: { xs: 2, sm: 0 },
                        mb: 3
                    }}
                >
                    Selecione os presentes que deseja incluir no seu carrinho e poder presentear os noivis. Lembrando que a presença de vocês já é o melhor presente que eles poderiam receber! Obs.: O mínimo por pessoa é de 100 reais.
                </Typography>
            </Box>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Filtros */}
                <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
                        <FilterIcon color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            Filtros
                        </Typography>
                        {getActiveFiltersCount() > 0 && (
                            <Chip 
                                label={`${getActiveFiltersCount()} ativo${getActiveFiltersCount() > 1 ? 's' : ''}`}
                                size="small" 
                                color="primary"
                                variant="filled"
                            />
                        )}
                    </Box>

                    <Grid container spacing={2} alignItems="center">
                        {/* Campo de busca */}
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Buscar produtos"
                                placeholder="Digite o nome do produto..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                slotProps={{
                                    input: {
                                        endAdornment: searchTerm && (
                                            <Button
                                                size="small"
                                                onClick={handleSearch}
                                                startIcon={<SearchIcon />}
                                                sx={{ minWidth: 'auto', px: 1 }}
                                            >
                                                Buscar
                                            </Button>
                                        )
                                    }
                                }}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                            />
                        </Grid>

                        {/* Filtro por categoria */}
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <FormControl fullWidth>
                                <InputLabel>Categoria</InputLabel>
                                <Select
                                    value={selectedCategory}
                                    label="Categoria"
                                    onChange={(e) => handleCategoryFilter(e.target.value)}
                                    sx={{ borderRadius: 2 }}
                                >
                                    <MenuItem value="">Todas as categorias</MenuItem>
                                    {categories.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Ordenação por preço */}
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <FormControl fullWidth>
                                <InputLabel>Ordenar por preço</InputLabel>
                                <Select
                                    value={sortOrder}
                                    label="Ordenar por preço"
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    sx={{ borderRadius: 2 }}
                                >
                                    <MenuItem value="">Sem ordenação</MenuItem>
                                    <MenuItem value="asc">Menor preço</MenuItem>
                                    <MenuItem value="desc">Maior preço</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Botão limpar filtros */}
                        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleClearFilters}
                                startIcon={<ClearIcon />}
                                disabled={getActiveFiltersCount() === 0}
                                sx={{ 
                                    height: 56,
                                    borderRadius: 2,
                                    borderColor: 'grey.300',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        backgroundColor: 'primary.50'
                                    }
                                }}
                            >
                                Limpar
                            </Button>
                        </Grid>
                    </Grid>

                    {/* Resumo dos resultados */}
                    <Box sx={{ 
                        mt: 2, 
                        pt: 2, 
                        textAlign: 'center' 
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            {products.length > 0 
                                ? (() => {
                                    const isPlural = products.length > 1;
                                    return `${products.length} produto${isPlural ? 's' : ''} encontrado${isPlural ? 's' : ''}`;
                                })()
                                : 'Nenhum produto encontrado'
                            }
                            {Boolean(pagination.totalProducts) && (
                                ` de ${pagination.totalProducts} total`
                            )}
                        </Typography>
                    </Box>
                </Paper>

                <Grid container spacing={2} justifyContent="center" sx={{ position: 'relative' }}>
                    {/* Overlay de loading para filtros */}
                    {filterLoading && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10,
                                borderRadius: 2,
                                backdropFilter: 'blur(2px)'
                            }}
                        >
                            <CircularProgress size={40} thickness={4} />
                        </Box>
                    )}
                    
                    {products.map((product) => (
                        <Grid key={product._id} size={{xs: 12, sm: 6, md: 4, lg: 3}} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <GiftCard
                                gift={product}
                                onAddToCart={() => handleAddToCart(product)}
                                onRemoveFromCart={handleRemoveFromCart}
                                isInCart={isItemInCart(product._id)}
                            />
                        </Grid>
                    ))}
                </Grid>

                {/* Só mostra mensagem se não está carregando, não tem erro e realmente não tem produtos */}
                {!productsLoading && !productsError && products.length === 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
                        <Typography variant="h6" color="text.secondary" textAlign="center">
                            Nenhum presente encontrado
                        </Typography>
                    </Box>
                )}

                {/* Paginação */}
                {!productsLoading && !productsError && products.length > 0 && (
                    <ProductPagination
                        pagination={pagination}
                        onPageChange={goToPage}
                        onItemsPerPageChange={setItemsPerPage}
                        itemsPerPage={filters.limit || 20}
                    />
                )}

            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default GiftListPage;