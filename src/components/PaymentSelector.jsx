import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Card,
    CardContent,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Divider,
    useTheme,
    Paper
} from '@mui/material';
import {
    CreditCard
} from '@mui/icons-material';
import PixIcon from './PixIcon';

// Taxas para cartão de crédito (recebimento em 1 dia útil)
const CREDIT_CARD_RATES = {
    1: 4.20,  // 1x (crédito à vista)
    2: 6.09,  // 2x
    3: 7.01,  // 3x
    4: 7.91,  // 4x
    5: 8.80,  // 5x
    6: 9.67,  // 6x
    7: 12.59, // 7x
    8: 13.42, // 8x
    9: 14.25, // 9x
    10: 15.06, // 10x
    11: 15.87, // 11x
    12: 16.66  // 12x
};

const PaymentSelector = ({ subtotal, onPaymentChange }) => {
    const [paymentMethod, setPaymentMethod] = useState('pix');
    const [installments, setInstallments] = useState(1);
    const theme = useTheme();

    // Calcular valores com useMemo para evitar recálculos desnecessários
    const paymentDetails = React.useMemo(() => {
        if (paymentMethod === 'pix') {
            return {
                method: 'pix',
                installments: 1,
                rate: 0,
                fee: 0,
                total: subtotal,
                installmentValue: subtotal
            };
        } else {
            const rate = CREDIT_CARD_RATES[installments];
            const fee = subtotal * (rate / 100);
            const total = subtotal + fee;
            const installmentValue = total / installments;
            
            return {
                method: 'credit_card',
                installments,
                rate,
                fee,
                total,
                installmentValue
            };
        }
    }, [paymentMethod, installments, subtotal]);

    // Atualizar o componente pai sempre que houver mudanças
    React.useEffect(() => {
        onPaymentChange(paymentDetails);
    }, [paymentDetails, onPaymentChange]);

    const handlePaymentMethodChange = (event, newMethod) => {
        if (newMethod !== null) {
            setPaymentMethod(newMethod);
            // Reset installments when changing to PIX
            if (newMethod === 'pix') {
                setInstallments(1);
            }
        }
    };

    const handleInstallmentsChange = (event) => {
        setInstallments(event.target.value);
    };

    return (
        <Card
            sx={{
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                mb: 3
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    💳 Forma de Pagamento
                </Typography>

                {/* Seleção do método de pagamento */}
                <ToggleButtonGroup
                    value={paymentMethod}
                    exclusive
                    onChange={handlePaymentMethodChange}
                    fullWidth
                    sx={{ mb: 3 }}
                >
                    <ToggleButton
                        value="pix"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 0.1,
                            borderRadius: 2,
                            '&.Mui-selected': {
                                backgroundColor: theme.palette.success.light,
                                color: theme.palette.success.dark,
                                '&:hover': {
                                    backgroundColor: theme.palette.success.light,
                                }
                            }
                        }}
                    >
                        <PixIcon sx={{ fontSize: 24 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            PIX
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Sem taxas
                        </Typography>
                    </ToggleButton>

                    <ToggleButton
                        value="credit_card"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 0.1,
                            borderRadius: 2,
                            '&.Mui-selected': {
                                backgroundColor: theme.palette.primary.light,
                                color: theme.palette.primary.dark,
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.light,
                                }
                            }
                        }}
                    >
                        <CreditCard sx={{ fontSize: 24 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Cartão
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            1 a 12x
                        </Typography>
                    </ToggleButton>
                </ToggleButtonGroup>

                {/* Seleção de parcelas (apenas para cartão) */}
                {paymentMethod === 'credit_card' && (
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Número de parcelas</InputLabel>
                        <Select
                            value={installments}
                            label="Número de parcelas"
                            onChange={handleInstallmentsChange}
                        >
                            {Object.entries(CREDIT_CARD_RATES).map(([key, rate]) => (
                                <MenuItem key={key} value={parseInt(key)}>
                                    {key}x de R$ {((paymentDetails?.total || 0) / parseInt(key)).toFixed(2).replace('.', ',')} 
                                    {key === '1' ? ' (à vista)' : ''} - Taxa: {rate}%
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </CardContent>
        </Card>
    );
};

PaymentSelector.propTypes = {
    subtotal: PropTypes.number.isRequired,
    onPaymentChange: PropTypes.func.isRequired,
};

export default PaymentSelector;
