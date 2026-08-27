import React from 'react';
import PropTypes from 'prop-types';
import {
    Card,
    CardContent,
    Typography,
    Box
} from '@mui/material';
import PixIcon from './PixIcon';

const PaymentSelector = ({ subtotal, onPaymentChange }) => {
    const paymentDetails = React.useMemo(() => {
        return {
            method: 'pix',
            installments: 1,
            rate: 0,
            fee: 0,
            total: subtotal,
            installmentValue: subtotal
        };
    }, [subtotal]);

    // Atualizar o componente pai sempre que houver mudanças
    React.useEffect(() => {
        onPaymentChange(paymentDetails);
    }, [paymentDetails, onPaymentChange]);

    return (
        <Card
            sx={{
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.98)',
                border: '2px solid',
                borderColor: 'transparent',
                boxShadow: '0 12px 40px rgba(218, 165, 32, 0.15)',
                position: 'static',
                top: 20,
                mb: 3,
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
                    Forma de Pagamento
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: 'success.light',
                        color: 'success.dark'
                    }}
                >
                    <PixIcon sx={{ fontSize: 28 }} />
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            PIX
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Sem taxas
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

PaymentSelector.propTypes = {
    subtotal: PropTypes.number.isRequired,
    onPaymentChange: PropTypes.func.isRequired,
};

export default PaymentSelector;
