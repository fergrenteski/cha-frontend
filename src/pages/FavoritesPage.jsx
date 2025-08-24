import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Box,
    Button,
    Fade,
    useTheme,
    useMediaQuery,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import GiftCard from '../components/GiftCard';
import { useFavorites } from '../hooks/useFavorites';
import { useCart } from '../hooks/useCart';
import EmptyFavorites from '../components/EmptyFavorites';

const FavoritesPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null, color: 'error' });
    
    // Hooks sempre devem ser chamados na mesma ordem
    const favoritesData = useFavorites();
    const { addItem, removeItem, isItemInCart } = useCart();
    
    // Extrair valores dos favoritos de forma segura
    const favorites = favoritesData?.items || [];
    const loading = favoritesData?.loading || false;

    // Recarregar favoritos quando a página é carregada para garantir dados atualizados
    useEffect(() => {
        const refreshFavorites = favoritesData?.refreshFavorites;
        if (refreshFavorites && typeof refreshFavorites === 'function') {
            refreshFavorites();
        }
    }, [favoritesData?.refreshFavorites]);

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

    // Mostrar dialog de confirmação
    const showConfirmDialog = (title, message, onConfirm, color = 'error') => {
        setConfirmDialog({
            open: true,
            title,
            message,
            onConfirm,
            color
        });
    };

    // Fechar dialog de confirmação
    const closeConfirmDialog = () => {
        setConfirmDialog({ open: false, title: '', message: '', onConfirm: null, color: 'error' });
    };

    const handleClearFavorites = async () => {
        const confirmClear = async () => {
            try {
                const clearFn = favoritesData?.clearFavorites;
                if (clearFn && typeof clearFn === 'function') {
                    const result = clearFn();
                    if (result && typeof result.then === 'function') {
                        await result;
                    }
                }
            } catch (error) {
                console.error('Erro ao limpar favoritos:', error);
            } finally {
                closeConfirmDialog();
            }
        };

        showConfirmDialog(
            'Limpar Favoritos',
            'Tem certeza que deseja remover todos os favoritos? Esta ação não pode ser desfeita.',
            confirmClear
        );
    };

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <Typography variant="h6">Carregando favoritos...</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <>
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

            {/* Dialog de Confirmação */}
            <Dialog
                open={confirmDialog.open}
                onClose={closeConfirmDialog}
                maxWidth="sm"
                fullWidth
                slotProps={{
                    paper: {
                        sx: { 
                            borderRadius: 3,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                        }
                    }
                }}
            >
                <DialogTitle sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 3,
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: `${confirmDialog.color}.main`
                }}>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: `${confirmDialog.color}.100`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        ⚠️
                    </Box>
                    {confirmDialog.title}
                </DialogTitle>
                
                <DialogContent sx={{ pt: 2, pb: 3 }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
                        {confirmDialog.message}
                    </Typography>
                </DialogContent>
                
                <DialogActions sx={{ 
                    p: 3, 
                    gap: 2,
                    borderTop: '1px solid',
                    borderColor: 'grey.200'
                }}>
                    <Button 
                        onClick={closeConfirmDialog}
                        variant="outlined"
                        size="large"
                        sx={{ 
                            borderRadius: 2,
                            px: 3,
                            py: 1.5,
                            fontWeight: 600
                        }}
                    >
                        Cancelar
                    </Button>
                    
                    <Button
                        onClick={confirmDialog.onConfirm}
                        variant="contained"
                        color={confirmDialog.color}
                        size="large"
                        sx={{ 
                            borderRadius: 2,
                            px: 3,
                            py: 1.5,
                            fontWeight: 600,
                            boxShadow: confirmDialog.color === 'info' 
                                ? '0 4px 15px rgba(33, 150, 243, 0.4)' 
                                : '0 4px 15px rgba(244, 67, 54, 0.4)',
                            '&:hover': {
                                boxShadow: confirmDialog.color === 'info' 
                                    ? '0 6px 20px rgba(33, 150, 243, 0.6)' 
                                    : '0 6px 20px rgba(244, 67, 54, 0.6)',
                                transform: 'translateY(-1px)'
                            }
                        }}
                    >
                        Limpar Favoritos
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default FavoritesPage;
