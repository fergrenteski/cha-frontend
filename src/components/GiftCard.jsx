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
    useMediaQuery
} from '@mui/material';

import {
    Favorite,
    FavoriteBorder,
    Check,
    Block
} from '@mui/icons-material';

const GiftCard = ({
                      gift,
                      onFavorite,
                      onAddToCart,
                      onRemoveFromCart,
                      isInCart = false
                  }) => {
    const [isFavorited, setIsFavorited] = useState(false);
    const theme = useTheme();

    // Media query apenas para celular
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Item Disponível
    const isUnavailable = gift.available === false;
    
    // Usar o estado do carrinho ao invés do estado local
    const isSelected = isInCart;

    const handleFavorite = (e) => {
        e.stopPropagation();
        setIsFavorited(!isFavorited);
        onFavorite?.(gift, !isFavorited);
    };

    const handleSelect = (e) => {
        e.stopPropagation();
        if(!isSelected) {
            onAddToCart(gift);
        } else {
            onRemoveFromCart(gift._id);
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
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
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
                    src={gift.image}
                    alt={gift.name}
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
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(10px)',
                            '&:hover': {
                                backgroundColor: 'white',
                                transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {isFavorited ? (
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
                            fontWeight: 600,
                            color: 'text.primary',
                            fontSize: '0.9rem',
                            minHeight: '50px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
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
                            fontWeight: 700,
                            color: 'text.primary'
                        }}
                    >
                        R$ {gift.price?.toFixed(2).replace('.', ',')}
                    </Typography>
                    <Chip
                        label={gift.capacity || gift.category || 'Produto'}
                        size="small"
                        sx={{
                            backgroundColor: theme.palette.grey[100],
                            color: theme.palette.text.secondary,
                            fontWeight: 500,
                            fontSize: '0.7rem'
                        }}
                    />
                </Box>
                <Button
                    variant="contained"
                    onClick={isUnavailable ? null : handleSelect}
                    startIcon={isSelected && !isUnavailable ? <Check /> : null}
                    disabled={isUnavailable}
                    sx={{
                        flex: 1,
                        py: 1,
                        borderRadius: 2,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '0.85rem',
                        backgroundColor: isUnavailable
                            ? '#9e9e9e'
                            : isSelected
                                ? '#4caf50'
                                : '#212121',
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: isUnavailable
                                ? '#9e9e9e'
                                : isSelected
                                    ? '#45a049'
                                    : '#424242'
                        }
                    }}
                >
                    {isUnavailable
                        ? 'Indisponível'
                        : isSelected
                            ? 'Selecionado'
                            : 'Selecionar'}
                </Button>
            </CardContent>
        </Card>
    );
};

export default GiftCard;