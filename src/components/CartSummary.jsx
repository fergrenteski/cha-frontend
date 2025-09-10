import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Divider,
    useTheme,
    useMediaQuery,
    LinearProgress
} from '@mui/material';
import {
    WhatsApp,
    Login
} from '@mui/icons-material';

const CartSummary = ({
                items = [],
                totalPrice = 0,
                paymentDetails = null,
                onCheckout,
                onContinueShopping,
                participants = [],
                minimumValue = 0,
                isAuthenticated = false,
                onLogin
            }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Cálculos
    const subtotal = paymentDetails ? paymentDetails.total - paymentDetails.fee : totalPrice;
    const total = paymentDetails ? paymentDetails.total : totalPrice;
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    // Progresso baseado no valor mínimo (se houver convidados)
    const targetValue = participants.length > 0 ? minimumValue : 100;
    const progressPercentage = Math.min((subtotal / targetValue) * 100, 100);
    
    // Textos para evitar ternários aninhados
    const guestText = participants.length > 1 ? 's' : '';
    const progressText = `Valor mínimo (você + ${participants.length} convidado${guestText})`;
    const successText = `Valor mínimo atingido (você + ${participants.length} convidado${guestText})!`;

    // Função para determinar o texto do botão
    const getButtonText = () => {
        if (!isAuthenticated) return 'Fazer Login para Enviar';
        if (subtotal < targetValue) return `Valor mínimo: R$ ${targetValue.toFixed(2).replace('.', ',')}`;
        return 'Enviar pelo WhatsApp';
    };

    // Função para determinar o ícone do botão
    const getButtonIcon = () => {
        if (!isAuthenticated) return <Login />;
        return <WhatsApp />;
    };

    return (
        <Card
            sx={{
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.98)',
                border: '2px solid',
                borderColor: 'transparent',
                boxShadow: '0 12px 40px rgba(218, 165, 32, 0.15)',
                position: isMobile ? 'static' : 'sticky',
                top: isMobile ? 'auto' : 20,
                height: 'fit-content',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 16px 50px rgba(218, 165, 32, 0.2)',
                    borderColor: 'rgba(218, 165, 32, 0.3)'
                }
            }}
        >
            <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 500,
                        background: 'linear-gradient(135deg, #daa520, #b8860b)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 3,
                        fontSize: '1.3rem',
                        letterSpacing: '0.5px',
                        textAlign: 'center'
                    }}
                >
                    Resumo do Pedido
                </Typography>

                {/* Items Count */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}>
                    <Typography variant="body1" sx={{ 
                        fontFamily: "'Playfair Display', serif",
                        color: '#8b4513',
                        fontWeight: 300,
                        fontStyle: 'italic'
                    }}>
                        {totalItems} {totalItems === 1 ? 'item' : 'itens'}
                    </Typography>
                    <Typography variant="body1" sx={{ 
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 500,
                        color: '#daa520'
                    }}>
                        R$ {(paymentDetails ? paymentDetails.total - paymentDetails.fee : totalPrice).toFixed(2).replace('.', ',')}
                    </Typography>
                </Box>

                {/* Payment Details */}
                {paymentDetails && paymentDetails.fee > 0 && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            Taxa do cartão ({paymentDetails.rate}%)
                        </Typography>
                        <Typography variant="body2" color="warning.main" sx={{ fontWeight: 500 }}>
                            + R$ {paymentDetails.fee.toFixed(2).replace('.', ',')}
                        </Typography>
                    </Box>
                )}

                {paymentDetails && paymentDetails.method === 'credit_card' && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            {paymentDetails.installments}x no cartão
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            R$ {paymentDetails.installmentValue.toFixed(2).replace('.', ',')}
                        </Typography>
                    </Box>
                )}

                {/* Progress Bar */}
                {subtotal > 0 && subtotal < targetValue && (
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1
                        }}>
                            <Typography variant="body2" color="text.secondary">
                                {progressText}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                R$ {subtotal.toFixed(2)} / R$ {targetValue.toFixed(2)}
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={progressPercentage}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: theme.palette.grey[200],
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    backgroundColor: progressPercentage >= 100
                                        ? theme.palette.success.main 
                                        : theme.palette.primary.main
                                }
                            }}
                        />
                        <Typography
                            variant="body2"
                            color="warning.main"
                            sx={{ fontSize: '0.75rem', mt: 1, textAlign: 'center' }}
                        >
                            Faltam R$ {(targetValue - subtotal).toFixed(2).replace('.', ',')} para o valor mínimo
                        </Typography>
                    </Box>
                )}

                <Divider sx={{ 
                    my: 2,
                    background: 'linear-gradient(90deg, transparent, rgba(218, 165, 32, 0.3), transparent)'
                }} />

                {/* Mensagem de sucesso quando meta é atingida */}
                {subtotal >= targetValue && (
                    <Box sx={{
                        p: 2,
                        background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.1), rgba(27, 94, 32, 0.1))',
                        border: '1px solid rgba(46, 125, 50, 0.3)',
                        borderRadius: '12px',
                        mb: 2
                    }}>
                        <Typography
                            variant="body2"
                            sx={{
                                fontFamily: "'Playfair Display', serif",
                                color: '#2e7d32',
                                fontSize: '0.8rem',
                                textAlign: 'center',
                                fontWeight: 500
                            }}
                        >
                            🎉 {successText}
                        </Typography>
                    </Box>
                )}

                <Divider sx={{ 
                    my: 2,
                    background: 'linear-gradient(90deg, transparent, rgba(218, 165, 32, 0.3), transparent)'
                }} />

                {/* Total */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 600,
                            color: '#8b4513'
                        }}
                    >
                        Total
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #daa520, #b8860b)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        R$ {total.toFixed(2).replace('.', ',')}
                    </Typography>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                        variant="contained"
                        onClick={!isAuthenticated ? onLogin : onCheckout}
                        startIcon={getButtonIcon()}
                        disabled={items.length === 0 || (!isAuthenticated ? false : subtotal < targetValue)}
                        sx={{
                            py: 1.5,
                            borderRadius: '25px',
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 500,
                            textTransform: 'none',
                            fontSize: '1rem',
                            letterSpacing: '0.5px',
                            background: !isAuthenticated 
                                ? 'linear-gradient(135deg, #daa520, #b8860b)' 
                                : 'linear-gradient(135deg, #25D366, #128C7E)',
                            border: !isAuthenticated 
                                ? '1px solid rgba(218, 165, 32, 0.3)'
                                : '1px solid rgba(37, 211, 102, 0.3)',
                            boxShadow: !isAuthenticated
                                ? '0 8px 25px rgba(218, 165, 32, 0.3)'
                                : '0 8px 25px rgba(37, 211, 102, 0.3)',
                            '&:hover': {
                                background: !isAuthenticated
                                    ? 'linear-gradient(135deg, #b8860b, #cd853f)'
                                    : 'linear-gradient(135deg, #128C7E, #0d5d4f)',
                                transform: 'translateY(-2px)',
                                boxShadow: !isAuthenticated
                                    ? '0 12px 35px rgba(218, 165, 32, 0.4)'
                                    : '0 12px 35px rgba(37, 211, 102, 0.4)'
                            },
                            '&:disabled': {
                                background: 'linear-gradient(135deg, #ccc, #999)',
                                boxShadow: 'none',
                                transform: 'none'
                            },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        {getButtonText()}
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={onContinueShopping}
                        sx={{
                            py: 1.5,
                            borderRadius: '20px',
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 500,
                            textTransform: 'none',
                            fontSize: '0.9rem',
                            borderColor: 'rgba(218, 165, 32, 0.3)',
                            color: '#8b4513',
                            backgroundColor: 'rgba(218, 165, 32, 0.05)',
                            '&:hover': {
                                borderColor: 'rgba(218, 165, 32, 0.5)',
                                backgroundColor: 'rgba(218, 165, 32, 0.1)',
                                color: '#daa520',
                                transform: 'translateY(-1px)'
                            },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        Continuar Comprando
                    </Button>
                </Box>

                {/* Payment Info */}
                <Box sx={{ 
                    mt: 3, 
                    pt: 2, 
                    borderTop: `1px solid rgba(218, 165, 32, 0.2)`,
                    background: 'linear-gradient(135deg, rgba(218, 165, 32, 0.02), rgba(184, 134, 11, 0.02))',
                    borderRadius: '8px',
                    p: 2,
                    mx: -1
                }}>
                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '0.75rem',
                            textAlign: 'center',
                            lineHeight: 1.4,
                            color: '#8b4513',
                            fontStyle: 'italic',
                            fontWeight: 300
                        }}
                    >
                        {!isAuthenticated 
                            ? ' Faça login para Terminar seu pedido'
                            : ' Seu pedido será enviado via WhatsApp com todos os detalhes'
                        }
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CartSummary;