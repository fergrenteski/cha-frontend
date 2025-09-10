// components/GiftCard.js
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    IconButton,
    Box,
    Chip,
    useTheme,
    useMediaQuery,
    CircularProgress
} from '@mui/material';

import {
    Favorite,
    FavoriteBorder,
    Check,
    Block
} from '@mui/icons-material';

import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../hooks/useAuth';

const GiftCard = ({
                      gift,
                      onAddToCart,
                      onRemoveFromCart,
                      isInCart = false
                  }) => {
    const theme = useTheme();
    const { isFavorite, toggleFavorite } = useFavorites();
    const { user } = useAuth(); // Verificar se usuário está logado
    
    // Estados de loading
    const [loadingFavorite, setLoadingFavorite] = useState(false);
    const [loadingCart, setLoadingCart] = useState(false);

    // Media query apenas para celular
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Verificar se o gift é válido
    if (!gift || !gift._id) {
        console.warn('GiftCard: gift is null or invalid:', gift);
        return null;
    }

    // Item Disponível
    const isUnavailable = gift.available === false;
    
    // Usar o estado do carrinho ao invés do estado local
    const isSelected = isInCart;

    // Verificar se está nos favoritos
    const isCurrentlyFavorite = isFavorite(gift._id);

    const handleFavorite = async (e) => {
        e.stopPropagation();
        if (!user || loadingFavorite) return; // Não permitir ação se não estiver logado ou já carregando
        
        setLoadingFavorite(true);
        try {
            await toggleFavorite(gift._id);
        } catch (error) {
            console.error('Erro ao favoritar:', error);
        } finally {
            setLoadingFavorite(false);
        }
    };

    const handleSelect = async (e) => {
        e.stopPropagation();
        if (!user || loadingCart) return; // Não permitir ação se não estiver logado ou já carregando
        
        setLoadingCart(true);
        try {
            if(!isSelected) {
                await onAddToCart(gift);
            } else {
                await onRemoveFromCart(gift._id);
            }
        } catch (error) {
            console.error('Erro ao selecionar:', error);
        } finally {
            setLoadingCart(false);
        }
    };

    // Caso não tenha Produto
    if (!gift) return null;

    return (
        <Card
            sx={{
                minHeight: '500px',
                height: '100%',
                width: isMobile ? '450px' : '300px',
                borderRadius: 4,
                background: 'linear-gradient(135deg, #fefdfb 0%, #faf8f3 100%)',
                border: '2px solid #f4e4bc',
                boxShadow: '0 8px 30px rgba(218, 165, 32, 0.12)',
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                position: 'relative',
                '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 50px rgba(218, 165, 32, 0.25)',
                    borderColor: '#daa520'
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -2,
                    left: -2,
                    right: -2,
                    bottom: -2,
                    background: 'linear-gradient(45deg, #daa520, #b8860b, #daa520)',
                    borderRadius: 4,
                    zIndex: -1,
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                },
                '&:hover::before': {
                    opacity: 0.1
                },
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1, // permite expandir igualmente no grid pai
            }}
        >
            {/* Image Section */}
            <Box
                sx={{
                    position: 'relative',
                    height: isMobile ? 300 : 250,
                    background: theme.palette.background.paper,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}
            >
                {/* Imagem com blur se indisponível */}
                <Box
                    component="img"
                    src={gift.image || null}
                    alt={gift.name || 'Produto'}
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: isUnavailable ? 'grayscale(100%) blur(2px) brightness(0.7)' : 'none',
                        transition: '0.3s ease'
                    }}
                />

                {/* Overlay cinza escuro com ícone se indisponível */}
                {isUnavailable && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2,
                            color: 'white',
                            flexDirection: 'column'
                        }}
                    >
                        <Block sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="subtitle2">Indisponível</Typography>
                    </Box>
                )}

                {/* Favorite Button visível apenas se disponível */}
                {!isUnavailable && (
                    <IconButton
                        onClick={handleFavorite}
                        disabled={!user || loadingFavorite}
                        title={!user ? "Login necessário para favoritar" : ""}
                        sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,244,230,0.9) 100%)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(218, 165, 32, 0.2)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #fff 0%, #f8f4e6 100%)',
                                transform: 'scale(1.1)',
                                borderColor: '#daa520',
                                boxShadow: '0 4px 15px rgba(218, 165, 32, 0.3)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {loadingFavorite ? (
                            <CircularProgress size={20} sx={{ color: '#9e9e9e' }} />
                        ) : isCurrentlyFavorite ? (
                            <Favorite sx={{ color: '#e91e63' }} />
                        ) : (
                            <FavoriteBorder sx={{ color: '#9e9e9e' }} />
                        )}
                    </IconButton>
                )}
            </Box>

            <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 600,
                            color: '#8b4513',
                            fontSize: '0.95rem',
                            minHeight: '50px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            letterSpacing: '0.5px'
                        }}
                    >
                        {gift.name?.toUpperCase()}
                    </Typography>
                </Box>

                {/* Description */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 2,
                        lineHeight: 1.1,
                        minHeight: '50px',
                        width: '100%',
                        fontSize: '0.75rem',
                        flexGrow: 1,
                        fontFamily: "'Playfair Display', serif",
                        fontStyle: 'italic',
                        fontWeight: 300,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {gift.description}
                </Typography>

                {/* Price and Capacity */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}>
                    <Typography
                        variant="h6"
                        component="span"
                        sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 700,
                            color: '#daa520',
                            textShadow: '0 1px 3px rgba(218, 165, 32, 0.2)'
                        }}
                    >
                        R$ {gift.price?.toFixed(2).replace('.', ',')}
                    </Typography>
                    <Chip
                        label={gift.capacity || gift.category || 'Produto'}
                        size="small"
                        sx={{
                            background: 'linear-gradient(135deg, rgba(218, 165, 32, 0.15) 0%, rgba(25, 118, 210, 0.1) 100%)',
                            color: '#8b4513',
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 500,
                            fontSize: '0.7rem',
                            border: '1px solid rgba(218, 165, 32, 0.3)'
                        }}
                    />
                </Box>
                <Button
                    variant="contained"
                    onClick={isUnavailable || !user ? null : handleSelect}
                    startIcon={loadingCart ? <CircularProgress size={16} sx={{ color: 'white' }} /> : (isSelected && !isUnavailable ? <Check /> : null)}
                    disabled={isUnavailable || !user || loadingCart}
                    title={!user ? "Login necessário para selecionar" : ""}
                    sx={{
                        flex: 1,
                        py: 1.5,
                        borderRadius: 3,
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '0.9rem',
                        letterSpacing: '0.5px',
                        background: isUnavailable || !user
                            ? 'linear-gradient(135deg, #e4e4e4ff, #d4d4d4ff)'
                            : isSelected
                                ? 'linear-gradient(135deg, #4caf50, #388e3c)'
                                : 'linear-gradient(135deg, #e7bf20ff, #e4b035ff)',
                        color: '#ffffff',
                        boxShadow: isUnavailable || !user 
                            ? 'none' 
                            : isSelected
                                ? '0 4px 15px rgba(76, 175, 80, 0.3)'
                                : '0 4px 15px rgba(212, 174, 37, 0.4)',
                        '&:hover': {
                            background: isUnavailable || !user
                                ? 'linear-gradient(135deg, #e4e4e4ff, #d4d4d4ff)'
                                : isSelected
                                    ? 'linear-gradient(135deg, #45a049, #2e7d32)'
                                    : 'linear-gradient(135deg, #e7bf20ff, #e4b035ff)',
                            transform: isUnavailable || !user ? 'none' : 'translateY(-2px)',
                            boxShadow: isUnavailable || !user 
                                ? 'none' 
                                : isSelected
                                    ? '0 6px 20px rgba(76, 175, 80, 0.4)'
                                    : '0 6px 25px rgba(218, 165, 32, 0.5)'
                        },
                        transition: 'all 0.3s ease'
                    }}
                >
                    {!user
                        ? 'Login necessário'
                        : isUnavailable
                            ? 'Indisponível'
                            : loadingCart
                                ? 'Carregando...'
                                : isSelected
                                    ? 'Selecionado'
                                    : 'Selecionar'}
                </Button>
            </CardContent>
        </Card>
    );
};

export default GiftCard;