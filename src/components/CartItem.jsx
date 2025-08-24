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
        <Card sx={{ mb: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
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
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.05rem' }}>
                            {product.name || 'Produto sem nome'}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, minHeight: 40 }}>
                            {product.description || 'Sem descrição'}
                        </Typography>

                        <Box sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            {!isMobile && (
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
                                    R$ {product.price?.toFixed(2) || '0.00'}
                                </Typography>
                            )}
                            <Box>
                                <IconButton
                                    onClick={() => handleQuantityChange(item.quantity - 1)}
                                    size="small"
                                    disabled={!user || item.quantity <= 1 || loadingQuantity}
                                    title={!user ? "Login necessário" : ""}
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
                                        style: { textAlign: 'center', width: '20px' }
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
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
                                <Typography variant="body2" color="text.secondary">
                                    Subtotal
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700,color: 'primary.main', fontSize: '1.05rem' }}>
                                    R$ {((product.price || 0) * item.quantity).toFixed(2)}
                                </Typography>
                            </Box>
                            {/* Botão remover (mobile) */}
                            {isMobile && (
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <IconButton
                                        onClick={handleRemove}
                                        color="error"
                                        disabled={!user || loadingRemove}
                                        title={!user ? "Login necessário" : ""}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'rgba(244, 67, 54, 0.08)'
                                            }
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
                            color="error"
                            disabled={!user || loadingRemove}
                            title={!user ? "Login necessário" : ""}
                            sx={{
                                ml: 1,
                                '&:hover': {
                                    backgroundColor: 'rgba(244, 67, 54, 0.08)'
                                }
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
