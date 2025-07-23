// pages/CartPage.js
import React, { useState } from 'react';
import {
    Container,
    Typography,
    Grid,
    Box,
    Snackbar,
    Alert,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';
import EmptyCart from '../components/EmptyCart';
import { useCart } from '../contexts/CartContext'; // Import do contexto

const CartPage = () => {
    // Usar o contexto do carrinho
    const {
        items: cartItems,
        totalItems,
        totalPrice,
        removeItem,
        updateQuantity,
        clearCart
    } = useCart();

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

    // Função para remover item com feedback visual
    const handleRemoveItem = (itemId, itemName) => {
        removeItem(itemId);
        setSnackbar({
            open: true,
            message: `${itemName} removido do carrinho`,
            severity: 'info'
        });
    };

    // Função para atualizar quantidade
    const handleUpdateQuantity = (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            const item = cartItems.find(item => item.id === itemId);
            handleRemoveItem(itemId, item?.name || 'Item');
        } else {
            updateQuantity(itemId, newQuantity);
        }
    };

    // Função para limpar carrinho
    const handleClearCart = () => {
        clearCart();
        setSnackbar({
            open: true,
            message: 'Carrinho limpo com sucesso',
            severity: 'success'
        });
    };

    // Handlers de navegação
    const handleCartClick = () => {
        console.log('Already on cart page');
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleProductClick = () => {
        navigate('/products');
    };

    const handleAlbumClick = () => {
        navigate('/album');
    };

    const handleAccountClick = () => {
        navigate('/account');
    };

    const handleFavoritesClick = () => {
        navigate('/favorites');
    };

    const handleLogoutClick = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const handleContinueShopping = () => {
        navigate('/products');
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <>
            <Header
                cartItemCount={totalItems} // Usando totalItems do contexto
                currentPage="cart"
                onCartClick={handleCartClick}
                onLogoClick={handleLogoClick}
                onProductClick={handleProductClick}
                onAlbumClick={handleAlbumClick}
                onAccountClick={handleAccountClick}
                onFavoritesClick={handleFavoritesClick}
                onLogoutClick={handleLogoutClick}
            />

            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        mb: 4,
                        fontSize: isMobile ? '1.8rem' : '2.5rem'
                    }}
                >
                    Carrinho de Compras
                </Typography>

                {cartItems.length === 0 ? (
                    <EmptyCart onContinueShopping={handleContinueShopping} />
                ) : (
                    <Grid
                        container
                        spacing={isMobile ? 3 : 4}
                        alignItems="flex-start"
                    >
                        {/* Coluna dos itens do carrinho */}
                        <Grid item size={isMobile ? 12 : 8}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    height: '100%',
                                }}
                            >
                                {cartItems.map((item) => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        onRemove={() => handleRemoveItem(item.id, item.name)}
                                        onUpdateQuantity={(newQuantity) =>
                                            handleUpdateQuantity(item.id, newQuantity)
                                        }
                                    />
                                ))}
                            </Box>
                        </Grid>

                        {/* Coluna do resumo (centralizado verticalmente) */}
                        <Grid item size={isMobile ? 12 : 4}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    height: '100%',
                                    minHeight: isMobile ? 'auto' : '100%', // para forçar altura igual em desktop
                                }}
                            >
                                <CartSummary
                                    items={cartItems}
                                    totalPrice={totalPrice}
                                    onClearCart={handleClearCart}
                                    onContinueShopping={handleContinueShopping}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                )}
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
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

export default CartPage;