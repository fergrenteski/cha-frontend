// pages/GiftListPage.js
import React, { useState } from 'react';
import { Grid, Container, Snackbar, Alert, CircularProgress, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GiftCard from '../components/GiftCard';
import Header from "../components/Header.jsx";
import ProductPagination from '../components/ProductPagination.jsx';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useProducts } from '../hooks/useProducts';

const GiftListPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Usar o contexto do carrinho
    const { addItem, removeItem, totalItems, isItemInCart } = useCart();

    // Usar o hook de produtos com paginação
    const { 
        products, 
        loading: productsLoading, 
        error: productsError,
        pagination,
        goToPage,
        setItemsPerPage,
        filters
    } = useProducts({ page: 1, limit: 20 });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

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

    // Handlers de navegação
    const handleLogoutClick = () => {
        logout();
        navigate('/auth');
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    // Renderizar loading
    if (productsLoading) {
        return (
            <>
                <Header
                    cartItemCount={totalItems}
                    currentPage="products"
                    onAlbumClick={() => navigate('/album')}
                    onCartClick={() => navigate('/cart')}
                    onLogoClick={() => navigate('/')}
                    onProductClick={() => navigate('/products')}
                    onAccountClick={() => navigate('/account')}
                    onAdminClick={() => navigate('/admin')}
                    onLogoutClick={handleLogoutClick}
                    onLoginClick={() => navigate('/auth')}
                    onFavoritesClick={() => navigate('/favorites')}
                />
                <Container maxWidth="xl" sx={{ py: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                        <CircularProgress size={60} />
                    </Box>
                </Container>
            </>
        );
    }

    // Renderizar erro
    if (productsError) {
        return (
            <>
                <Header
                    cartItemCount={totalItems}
                    currentPage="products"
                    onAlbumClick={() => navigate('/album')}
                    onCartClick={() => navigate('/cart')}
                    onLogoClick={() => navigate('/')}
                    onProductClick={() => navigate('/products')}
                    onAccountClick={() => navigate('/account')}
                    onAdminClick={() => navigate('/admin')}
                    onLogoutClick={handleLogoutClick}
                    onLoginClick={() => navigate('/auth')}
                    onFavoritesClick={() => navigate('/favorites')}
                />
                <Container maxWidth="xl" sx={{ py: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                        <Typography variant="h6" color="error" textAlign="center">
                            Erro ao carregar produtos: {productsError}
                        </Typography>
                    </Box>
                </Container>
            </>
        );
    }

    return (
        <>
            <Header
                cartItemCount={totalItems}
                currentPage="products"
                onAlbumClick={() => navigate('/album')}
                onCartClick={() => navigate('/cart')}
                onLogoClick={() => navigate('/')}
                onProductClick={() => navigate('/products')}
                onAccountClick={() => navigate('/account')}
                onAdminClick={() => navigate('/admin')}
                onLogoutClick={handleLogoutClick}
                onLoginClick={() => navigate('/auth')}
                onFavoritesClick={() => navigate('/favorites')}
            />

            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Grid container spacing={2} justifyContent="center">
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