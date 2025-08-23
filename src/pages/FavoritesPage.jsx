import React from 'react';
import {
    Container,
    Typography,
    Grid,
    Box,
    Button,
    Fade,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import GiftCard from '../components/GiftCard';
import { useFavorites } from '../hooks/useFavorites';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import EmptyFavorites from '../components/EmptyFavorites';

const FavoritesPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    
    // Usar hooks de forma defensiva
    let favorites = [];
    let loading = false;
    let clearFavorites = () => {};
    
    try {
        const favoritesData = useFavorites();
        favorites = favoritesData.items || [];
        loading = favoritesData.loading || false;
        clearFavorites = favoritesData.clearFavorites || (() => {});
        
    } catch (error) {
        console.error('Erro ao carregar favorites context:', error);
    }
    
    const { addItem, removeItem, isItemInCart, totalItems } = useCart();
    const { logout } = useAuth();

    const handleAddToCart = async (product) => {
        try {
            await addItem(product);
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
        }
    };

    const handleRemoveFromCart = async (productId) => {
        try {
            await removeItem(productId);
        } catch (error) {
            console.error('Erro ao remover do carrinho:', error);
        }
    };

    const handleClearFavorites = async () => {
        if (window.confirm('Tem certeza que deseja remover todos os favoritos?')) {
            try {
                if (clearFavorites && typeof clearFavorites === 'function') {
                    const result = clearFavorites();
                    if (result && typeof result.then === 'function') {
                        await result;
                    }
                }
            } catch (error) {
                console.error('Erro ao limpar favoritos:', error);
            }
        }
    };

    // Handlers de navegação
    const handleLogoutClick = () => {
        logout();
        navigate('/auth');
    };

    if (loading) {
        return (
            <>
                <Header
                    cartItemCount={totalItems}
                    currentPage="favorites"
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
                        <Typography variant="h6">Carregando favoritos...</Typography>
                    </Box>
                </Container>
            </>
        );
    }

    return (
        <>
            <Header
                cartItemCount={totalItems}
                currentPage="favorites"
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
                <Fade in timeout={800}>
                    <Box>
                        {/* Cabeçalho da página */}
                        <Box sx={{ 
                            mb: { xs: 3, md: 4 }, 
                            textAlign: 'center',
                            px: { xs: 1, sm: 2 }
                        }}>
                            {favorites.length > 0 ? (
                            <Typography
                                variant={isMobile ? "h4" : "h3"}
                                component="h1"
                                sx={{
                                    fontWeight: 300,
                                    color: theme.palette.text.primary,
                                    mb: 1,
                                    fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' }
                                }}
                            >
                                Meus Favoritos
                            </Typography>
                            ) : (<></>)}
                        </Box>

                        {/* Lista de favoritos */}
                        {favorites.length > 0 ? (
                            <>
                                {/* Botão para limpar favoritos */}
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    mb: 4 
                                }}>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleClearFavorites}
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 600
                                        }}
                                    >
                                        Limpar Favoritos
                                    </Button>
                                </Box>

                                {/* Grid de produtos */}
                                <Grid container spacing={2} justifyContent="center">
                                    {favorites
                                        .filter(favoriteItem => favoriteItem?.product?._id)
                                        .map((favoriteItem) => (
                                            <Grid 
                                                key={favoriteItem.product._id} 
                                                size={{xs: 12, sm: 6, md: 4, lg: 3}} 
                                                sx={{ display: 'flex', justifyContent: 'center' }}
                                            >
                                                <GiftCard
                                                    gift={favoriteItem.product}
                                                    onAddToCart={() => handleAddToCart(favoriteItem.product)}
                                                    onRemoveFromCart={handleRemoveFromCart}
                                                    isInCart={isItemInCart(favoriteItem.product._id)}
                                                />
                                            </Grid>
                                        ))
                                    }
                                </Grid>
                            </>
                        ) : (
                            <EmptyFavorites></EmptyFavorites>
                        )}
                    </Box>
                </Fade>
            </Container>
        </>
    );
};

export default FavoritesPage;
