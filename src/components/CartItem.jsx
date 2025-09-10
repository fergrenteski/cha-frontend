// components/CartItem.js
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Box,
    Avatar,
    TextField,
    useMediaQuery,
    useTheme,
    CircularProgress,
} from '@mui/material';
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
    const product = item.product || {};
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user } = useAuth(); // Verificar se usuário está logado
    
    // Estados de loading
    const [loadingQuantity, setLoadingQuantity] = useState(false);
    const [loadingRemove, setLoadingRemove] = useState(false);

    const handleQuantityChange = async (newQuantity) => {
        if (!user || loadingQuantity) return; // Não permitir mudanças se não estiver logado ou já carregando
        if (newQuantity >= 1) {
            setLoadingQuantity(true);
            try {
                await onUpdateQuantity(newQuantity);
            } catch (error) {
                console.error('Erro ao atualizar quantidade:', error);
            } finally {
                setLoadingQuantity(false);
            }
        }
    };

    const handleInputChange = async (event) => {
        if (!user || loadingQuantity) return; // Não permitir mudanças se não estiver logado ou já carregando
        const value = parseInt(event.target.value) || 1;
        await handleQuantityChange(value);
    };

    const handleRemove = async () => {
        if (!user || loadingRemove) return; // Não permitir remoção se não estiver logado ou já carregando
        setLoadingRemove(true);
        try {
            await onRemove();
        } catch (error) {
            console.error('Erro ao remover item:', error);
        } finally {
            setLoadingRemove(false);
        }
    };

    return (
        <Card sx={{ 
            mb: 2, 
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.98)',
            border: '2px solid',
            borderColor: 'transparent',
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.98)), linear-gradient(135deg, rgba(218, 165, 32, 0.1), rgba(184, 134, 11, 0.1))',
            backgroundOrigin: 'border-box',
            backgroundClip: 'content-box, border-box',
            boxShadow: '0 8px 32px rgba(218, 165, 32, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(218, 165, 32, 0.15)',
                borderColor: 'rgba(218, 165, 32, 0.3)'
            }
        }}>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        alignItems: isMobile ? 'flex-start' : 'center',
                        gap: 2,
                    }}
                >
                    {/* Imagem */}
                    <Avatar
                        src={product.image || ''}
                        alt={product.name || 'Produto'}
                        variant="rounded"
                        sx={{
                            width: isMobile ? 150 : 120,
                            height: isMobile ? 150 : 120,
                            backgroundColor: '#f5f5f5',
                            alignSelf: 'center'
                        }}
                    />

                    {/* Informações */}
                    <Box sx={{ flexGrow: 1, width: '100%' }}>
                        <Typography variant="h6" sx={{ 
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 500, 
                            fontSize: '1.05rem',
                            color: '#8b4513',
                            mb: 0.5
                        }}>
                            {product.name || 'Produto sem nome'}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ 
                            mb: 1, 
                            minHeight: 40,
                            fontFamily: "'Playfair Display', serif",
                            fontStyle: 'italic',
                            fontWeight: 300
                        }}>
                            {product.description || 'Sem descrição'}
                        </Typography>

                        <Box sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            {!isMobile && (
                                <Typography variant="h6" sx={{ 
                                    fontFamily: "'Playfair Display', serif",
                                    fontWeight: 600, 
                                    fontSize: '1.05rem',
                                    background: 'linear-gradient(135deg, #daa520, #b8860b)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    R$ {product.price?.toFixed(2) || '0.00'}
                                </Typography>
                            )}
                            <Box>
                                <IconButton
                                    onClick={() => handleQuantityChange(item.quantity - 1)}
                                    size="small"
                                    disabled={!user || item.quantity <= 1 || loadingQuantity}
                                    title={!user ? "Login necessário" : ""}
                                    sx={{
                                        color: '#8b4513',
                                        backgroundColor: 'rgba(218, 165, 32, 0.1)',
                                        border: '1px solid rgba(218, 165, 32, 0.2)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(218, 165, 32, 0.2)',
                                            borderColor: 'rgba(218, 165, 32, 0.4)',
                                            color: '#daa520'
                                        },
                                        '&:disabled': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                            borderColor: 'rgba(0, 0, 0, 0.12)'
                                        }
                                    }}
                                >
                                    {loadingQuantity ? (
                                        <CircularProgress size={16} />
                                    ) : (
                                        <RemoveIcon />
                                    )}
                                </IconButton>

                                <TextField
                                    value={item.quantity}
                                    onChange={handleInputChange}
                                    size="small"
                                    disabled={!user || loadingQuantity}
                                    inputProps={{
                                        min: 1,
                                        style: { 
                                            textAlign: 'center', 
                                            width: '20px',
                                            fontFamily: "'Playfair Display', serif",
                                            fontWeight: 500,
                                            color: '#8b4513'
                                        }
                                    }}
                                    sx={{
                                        mx: 1,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'rgba(218, 165, 32, 0.05)',
                                            '& fieldset': {
                                                borderColor: 'rgba(218, 165, 32, 0.3)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'rgba(218, 165, 32, 0.5)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#daa520',
                                            },
                                        },
                                    }}
                                    title={!user ? "Login necessário" : ""}
                                />

                                <IconButton
                                    onClick={() => handleQuantityChange(item.quantity + 1)}
                                    size="small"
                                    disabled={!user || loadingQuantity}
                                    title={!user ? "Login necessário" : ""}
                                    sx={{
                                        color: '#8b4513',
                                        backgroundColor: 'rgba(218, 165, 32, 0.1)',
                                        border: '1px solid rgba(218, 165, 32, 0.2)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(218, 165, 32, 0.2)',
                                            borderColor: 'rgba(218, 165, 32, 0.4)',
                                            color: '#daa520'
                                        },
                                        '&:disabled': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                            borderColor: 'rgba(0, 0, 0, 0.12)'
                                        }
                                    }}
                                >
                                    {loadingQuantity ? (
                                        <CircularProgress size={16} />
                                    ) : (
                                        <AddIcon />
                                    )}
                                </IconButton>
                            </Box>
                            {/* Subtotal */}
                            <Box sx={{ textAlign: 'right'}}>
                                <Typography variant="body2" sx={{ 
                                    fontFamily: "'Playfair Display', serif",
                                    color: '#8b4513',
                                    fontWeight: 300,
                                    fontStyle: 'italic'
                                }}>
                                    Subtotal
                                </Typography>
                                <Typography variant="h6" sx={{ 
                                    fontFamily: "'Playfair Display', serif",
                                    fontWeight: 600, 
                                    fontSize: '1.05rem',
                                    background: 'linear-gradient(135deg, #daa520, #b8860b)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    R$ {((product.price || 0) * item.quantity).toFixed(2)}
                                </Typography>
                            </Box>
                            {/* Botão remover (mobile) */}
                            {isMobile && (
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <IconButton
                                        onClick={handleRemove}
                                        disabled={!user || loadingRemove}
                                        title={!user ? "Login necessário" : ""}
                                        sx={{
                                            color: '#d32f2f',
                                            backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                            border: '1px solid rgba(211, 47, 47, 0.2)',
                                            borderRadius: '12px',
                                            '&:hover': {
                                                backgroundColor: 'rgba(211, 47, 47, 0.12)',
                                                borderColor: 'rgba(211, 47, 47, 0.3)',
                                                transform: 'scale(1.05)'
                                            },
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {loadingRemove ? (
                                            <CircularProgress size={20} sx={{ color: 'error.main' }} />
                                        ) : (
                                            <DeleteIcon />
                                        )}
                                    </IconButton>
                                </Box>
                            )}
                        </Box>
                    </Box>

                    {/* Botão remover (desktop) */}
                    {!isMobile && (
                        <IconButton
                            onClick={handleRemove}
                            disabled={!user || loadingRemove}
                            title={!user ? "Login necessário" : ""}
                            sx={{
                                ml: 1,
                                color: '#d32f2f',
                                backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                border: '1px solid rgba(211, 47, 47, 0.2)',
                                borderRadius: '12px',
                                '&:hover': {
                                    backgroundColor: 'rgba(211, 47, 47, 0.12)',
                                    borderColor: 'rgba(211, 47, 47, 0.3)',
                                    transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {loadingRemove ? (
                                <CircularProgress size={20} sx={{ color: 'error.main' }} />
                            ) : (
                                <DeleteIcon />
                            )}
                        </IconButton>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default CartItem;
