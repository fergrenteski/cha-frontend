// pages/GiftListPage.js
import React, { useState } from 'react';
import { Grid, Container, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GiftCard from '../components/GiftCard';
import giftList from '../data/giftList';
import Header from "../components/Header.jsx";
import { useCart } from '../contexts/CartContext'; // Import do contexto

const GiftListPage = () => {
    const navigate = useNavigate();

    // Usar o contexto do carrinho
    const { addItem, removeItem, totalItems, isItemInCart } = useCart();

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Função para adicionar item ao carrinho
    const handleAddToCart = (gift) => {
        // Adiciona o item ao carrinho (ou aumenta a quantidade se já existir)
        addItem({
            id: gift.id,
            name: gift.name,
            price: gift.price,
            image: gift.image,
            description: gift.description,
            category: gift.category || 'Presente',
            quantity: 1,
            available: gift.available,
        });

        setSnackbar({
            open: true,
            message: `${gift.name} adicionado ao carrinho!`,
            severity: 'success'
        });
    };

    // Função para remover item do carrinho
    const handleRemoveFromCart = (giftId) => {
        const gift = giftList.find(g => g.id === giftId);
        removeItem(giftId);

        setSnackbar({
            open: true,
            message: `${gift?.name || 'Item'} removido do carrinho!`,
            severity: 'warning'
        });
    };

    // Handlers de navegação
    const handleCartClick = () => {
        navigate('/cart');
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

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <>
            <Header
                cartItemCount={totalItems} // Usando totalItems do contexto
                currentPage="products"
                onCartClick={handleCartClick}
                onLogoClick={handleLogoClick}
                onProductClick={handleProductClick}
                onAlbumClick={handleAlbumClick}
                onAccountClick={handleAccountClick}
                onFavoritesClick={handleFavoritesClick}
                onLogoutClick={handleLogoutClick}
            />

            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Grid container spacing={3} justifyContent="center">
                    {giftList.map((gift) => (
                        <Grid item key={gift.id} xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <GiftCard
                                gift={gift}
                                onFavorite={null}
                                onAddToCart={() => handleAddToCart(gift)}
                                onRemoveFromCart={handleRemoveFromCart}
                                isInCart={isItemInCart(gift.id)}
                            />
                        </Grid>
                    ))}
                </Grid>
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