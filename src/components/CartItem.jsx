// components/CartItem.js
import React from 'react';
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

    const handleQuantityChange = (newQuantity) => {
        if (!user) return; // Não permitir mudanças se não estiver logado
        if (newQuantity >= 1) {
            onUpdateQuantity(newQuantity);
        }
    };

    const handleInputChange = (event) => {
        if (!user) return; // Não permitir mudanças se não estiver logado
        const value = parseInt(event.target.value) || 1;
        handleQuantityChange(value);
    };

    const handleRemove = () => {
        if (!user) return; // Não permitir remoção se não estiver logado
        onRemove();
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
                                    disabled={!user || item.quantity <= 1}
                                    title={!user ? "Login necessário" : ""}
                                >
                                    <RemoveIcon />
                                </IconButton>

                                <TextField
                                    value={item.quantity}
                                    onChange={handleInputChange}
                                    size="small"
                                    disabled={!user}
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
                                    disabled={!user}
                                    title={!user ? "Login necessário" : ""}
                                >
                                    <AddIcon />
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
                                        disabled={!user}
                                        title={!user ? "Login necessário" : ""}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'rgba(244, 67, 54, 0.08)'
                                            }
                                        }}
                                    >
                                        <DeleteIcon />
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
                            disabled={!user}
                            title={!user ? "Login necessário" : ""}
                            sx={{
                                ml: 1,
                                '&:hover': {
                                    backgroundColor: 'rgba(244, 67, 54, 0.08)'
                                }
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default CartItem;
