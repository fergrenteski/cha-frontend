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

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            onUpdateQuantity(newQuantity);
        }
    };

    const handleInputChange = (event) => {
        const value = parseInt(event.target.value) || 1;
        handleQuantityChange(value);
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
                        src={item.image}
                        alt={item.name}
                        variant="rounded"
                        sx={{
                            width: isMobile ? 150 : 80,
                            height: isMobile ? 150 : 80,
                            backgroundColor: '#f5f5f5',
                            alignSelf: isMobile ? 'center' : 'flex-start'
                        }}
                    />

                    {/* Informações */}
                    <Box sx={{ flexGrow: 1, width: '100%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.05rem' }}>
                            {item.name}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {item.description || 'Sem descrição'}
                        </Typography>

                        {!isMobile && (
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                                R$ {item.price?.toFixed(2) || '0.00'}
                            </Typography>
                        )}

                        {/* Quantidade + Subtotal */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: isMobile ? 'column' : 'row',
                                alignItems: isMobile ? 'flex-start' : 'center',
                                gap: 1,
                                justifyContent: 'space-between'
                            }}
                        >
                            {/* Controles de quantidade */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'space-around' : "",width: '100%' }}>
                                <IconButton
                                    onClick={() => handleQuantityChange(item.quantity - 1)}
                                    size="small"
                                    disabled={item.quantity <= 1}
                                >
                                    <RemoveIcon />
                                </IconButton>

                                <TextField
                                    value={item.quantity}
                                    onChange={handleInputChange}
                                    size="small"
                                    inputProps={{
                                        min: 1,
                                        style: { textAlign: 'center', width: '50px' }
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                            },
                                        },
                                    }}
                                />

                                <IconButton
                                    onClick={() => handleQuantityChange(item.quantity + 1)}
                                    size="small"
                                >
                                    <AddIcon />
                                </IconButton>
                                {/* Botão remover (mobile) */}
                                {isMobile && (
                                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                        <IconButton
                                            onClick={onRemove}
                                            color="error"
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

                            {/* Subtotal */}
                            <Box sx={{ textAlign: isMobile ? 'left' : 'right', mt: isMobile ? 1 : 0, minWidth: '200px' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Subtotal
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700,color: 'primary.main' }}>
                                    R$ {((item.price || 0) * item.quantity).toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Botão remover (desktop) */}
                    {!isMobile && (
                        <IconButton
                            onClick={onRemove}
                            color="error"
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
