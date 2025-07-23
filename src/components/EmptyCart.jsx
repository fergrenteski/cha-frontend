import React from 'react';
import {
    Box,
    Typography,
    Button,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    ShoppingCartOutlined,
    ArrowBack
} from '@mui/icons-material';

const EmptyCart = ({ onContinueShopping }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                py: isMobile ? 6 : 8,
                px: 3,
                minHeight: '60vh'
            }}
        >
            {/* Icon */}
            <Box
                sx={{
                    width: isMobile ? 120 : 150,
                    height: isMobile ? 120 : 150,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.grey[100],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3
                }}
            >
                <ShoppingCartOutlined
                    sx={{
                        fontSize: isMobile ? 60 : 80,
                        color: theme.palette.grey[400]
                    }}
                />
            </Box>

            {/* Title */}
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 2,
                    fontSize: isMobile ? '1.5rem' : '2rem'
                }}
            >
                Seu carrinho está vazio
            </Typography>

            {/* Description */}
            <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                    mb: 4,
                    maxWidth: 400,
                    lineHeight: 1.6,
                    fontSize: isMobile ? '0.9rem' : '1rem'
                }}
            >
                Que tal explorar nossos produtos e encontrar algo especial?
                Temos uma seleção incrível esperando por você!
            </Typography>

            {/* Action Button */}
            <Button
                variant="contained"
                onClick={onContinueShopping}
                startIcon={<ArrowBack />}
                sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    backgroundColor: '#212121',
                    boxShadow: '0 4px 20px rgba(33, 33, 33, 0.3)',
                    '&:hover': {
                        backgroundColor: '#424242',
                        boxShadow: '0 6px 30px rgba(33, 33, 33, 0.4)',
                        transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                }}
            >
                Continuar Comprando
            </Button>

            {/* Additional Info */}
            <Box
                sx={{
                    mt: 4,
                    p: 3,
                    backgroundColor: theme.palette.grey[50],
                    borderRadius: 2,
                    maxWidth: 500
                }}
            >
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        fontSize: '0.85rem',
                        lineHeight: 1.5
                    }}
                >
                    💡 <strong>Dica:</strong> Seus itens favoritos ficam salvos para você não perder de vista.
                    Visite a seção de favoritos para ver os produtos que você curtiu!
                </Typography>
            </Box>
        </Box>
    );
};

export default EmptyCart;