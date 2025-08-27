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

    // Função para determinar a cor do botão
    const getButtonColor = () => {
        if (!isAuthenticated) return '#1976d2'; // Azul para login
        return '#25D366'; // Verde do WhatsApp
    };

    // Função para determinar a cor do hover
    const getButtonHoverColor = () => {
        if (!isAuthenticated) return '#1565c0';
        return '#128C7E';
    };

    return (
        <Card
            sx={{
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                position: isMobile ? 'static' : 'sticky',
                top: isMobile ? 'auto' : 20,
                height: 'fit-content'
            }}
        >
            <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        mb: 3,
                        fontSize: '1.2rem'
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
                    <Typography variant="body1" color="text.secondary">
                        {totalItems} {totalItems === 1 ? 'item' : 'itens'}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
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

                <Divider sx={{ my: 2 }} />

                {/* Mensagem de sucesso quando meta é atingida */}
                {subtotal >= targetValue && (
                    <Box sx={{
                        p: 2,
                        backgroundColor: theme.palette.success.light,
                        borderRadius: 1,
                        mb: 2
                    }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.success.dark,
                                fontSize: '0.8rem',
                                textAlign: 'center',
                                fontWeight: 600
                            }}
                        >
                            🎉 {successText}
                        </Typography>
                    </Box>
                )}

                <Divider sx={{ my: 2 }} />

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
                            fontWeight: 700,
                            color: 'text.primary'
                        }}
                    >
                        Total
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            color: 'primary.main'
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
                            borderRadius: 2,
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '1rem',
                            backgroundColor: getButtonColor(),
                            '&:hover': {
                                backgroundColor: getButtonHoverColor()
                            },
                            '&:disabled': {
                                backgroundColor: theme.palette.grey[300],
                                color: theme.palette.grey[500]
                            }
                        }}
                    >
                        {getButtonText()}
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={onContinueShopping}
                        sx={{
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '0.9rem',
                            borderColor: theme.palette.grey[300],
                            color: 'text.primary',
                            '&:hover': {
                                borderColor: theme.palette.grey[400],
                                backgroundColor: 'transparent'
                            }
                        }}
                    >
                        Continuar Comprando
                    </Button>
                </Box>

                {/* Payment Info */}
                <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${theme.palette.grey[200]}` }}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            fontSize: '0.75rem',
                            textAlign: 'center',
                            lineHeight: 1.4
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