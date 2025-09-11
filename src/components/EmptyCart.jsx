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
    ArrowBack,
    AccountCircle
} from '@mui/icons-material';

const EmptyCart = ({ onContinueShopping, onGoToAccount }) => {
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
                minHeight: '60vh',
                mt: 4
            }}
        >
            {/* Icon */}
            <Box
                sx={{
                    width: isMobile ? 120 : 150,
                    height: isMobile ? 120 : 150,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.main + '22',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3
                }}
            >
                <ShoppingCartOutlined
                    sx={{
                        fontSize: isMobile ? 60 : 80,
                        color: theme.palette.primary.main
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

            {/* Action Buttons */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: 2,
                    mb: 4,
                    width: '100%',
                    maxWidth: 400,
                    justifyContent: 'center'
                }}
            >
                <Button
                    variant="contained"
                    onClick={onContinueShopping}
                    startIcon={<ArrowBack />}
                    sx={{
                        py: 1.5,
                        px: 4,
                        borderRadius: '20px',
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem',
                        color: '#fff',
                        background: 'linear-gradient(135deg, #daa520, #b8860b)',
                        boxShadow: '0 4px 20px rgba(218, 165, 32, 0.3)',
                        fontFamily: "'Playfair Display', serif",
                        '&:hover': {
                            background: 'linear-gradient(135deg, #b8860b, #8b4513)',
                            boxShadow: '0 6px 30px rgba(218, 165, 32, 0.4)',
                            transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease',
                        flex: isMobile ? 'none' : 1
                    }}
                >
                    Continuar Comprando
                </Button>

                {onGoToAccount && (
                    <Button
                        variant="outlined"
                        onClick={onGoToAccount}
                        startIcon={<AccountCircle />}
                        sx={{
                            py: 1.5,
                            px: 4,
                            borderRadius: '20px',
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '1rem',
                            borderColor: 'rgba(218, 165, 32, 0.5)',
                            color: '#daa520',
                            fontFamily: "'Playfair Display', serif",
                            '&:hover': {
                                borderColor: '#daa520',
                                backgroundColor: 'rgba(218, 165, 32, 0.04)',
                                transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.3s ease',
                            flex: isMobile ? 'none' : 1
                        }}
                    >
                        Meus Pedidos
                    </Button>
                )}
            </Box>

            {/* Orders Info Section */}
            <Box
                sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, rgba(218, 165, 32, 0.05), rgba(184, 134, 11, 0.05))',
                    borderRadius: '15px',
                    border: '1px solid rgba(218, 165, 32, 0.2)',
                    maxWidth: 500,
                    mb: 3
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 600,
                        color: '#daa520',
                        mb: 2,
                        fontSize: '1.1rem',
                        textAlign: 'center'
                    }}
                >
                    🔍 Procurando seus pedidos?
                </Typography>
                
                <Typography
                    variant="body2"
                    sx={{
                        color: '#8b4513',
                        fontSize: '0.9rem',
                        lineHeight: 1.6,
                        textAlign: 'center',
                        mb: 1
                    }}
                >
                    Se você já fez pedidos anteriormente, acesse <strong>"Minha Conta"</strong> para visualizar 
                    o histórico completo, acompanhar status e ver todos os detalhes.
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        fontSize: '0.85rem',
                        textAlign: 'center',
                        fontStyle: 'italic'
                    }}
                >
                    💡 Faça login para acessar seus pedidos salvos
                </Typography>
            </Box>

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