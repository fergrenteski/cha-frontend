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
    ShoppingCartCheckout
} from '@mui/icons-material';

const CartSummary = ({
                         items = [],
                         onCheckout,
                         onContinueShopping
                     }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Cálculos
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal; // Sem frete para presentes
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    // Progresso até R$ 100
    const progressPercentage = Math.min((subtotal / 100) * 100, 100);

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
                        R$ {subtotal.toFixed(2).replace('.', ',')}
                    </Typography>
                </Box>


                {/* Progress Bar até R$ 100 */}
                {subtotal > 0 && subtotal <= 100 && (
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1
                        }}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: '0.8rem' }}
                            >
                                Progresso até R$ 100
                            </Typography>
                            <Typography
                                variant="body2"
                                color="primary.main"
                                sx={{ fontSize: '0.8rem', fontWeight: 600 }}
                            >
                                {progressPercentage.toFixed(0)}%
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
                                    backgroundColor: theme.palette.primary.main
                                }
                            }}
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                fontSize: '0.75rem',
                                textAlign: 'center',
                                mt: 1
                            }}
                        >
                            {subtotal < 100
                                ? `Faltam R$ ${(100 - subtotal).toFixed(2).replace('.', ',')} para chegar aos R$ 100!`
                                : 'Meta de R$ 100 alcançada! 🎉'
                            }
                        </Typography>
                    </Box>
                )}

                {subtotal > 100 && (
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
                            🎉 Meta de R$ 100 superada!
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
                        onClick={onCheckout}
                        startIcon={<ShoppingCartCheckout />}
                        disabled={items.length === 0}
                        sx={{
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '1rem',
                            backgroundColor: '#212121',
                            '&:hover': {
                                backgroundColor: '#424242'
                            },
                            '&:disabled': {
                                backgroundColor: theme.palette.grey[300],
                                color: theme.palette.grey[500]
                            }
                        }}
                    >
                        Finalizar Compra
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
                        Pagamento 100% seguro via PIX, cartão de crédito ou débito
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CartSummary;