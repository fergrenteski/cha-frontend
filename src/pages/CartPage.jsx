// pages/CartPage.js
import React, { useState } from 'react';
import {
    Container,
    Typography,
    Grid,
    Box,
    Snackbar,
    Alert,
    useTheme,
    useMediaQuery,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
    ContentCopy as CopyIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';
import EmptyCart from '../components/EmptyCart';
import PaymentSelector from '../components/PaymentSelector';
import { useCart } from '../hooks/useCart';

const CartPage = () => {
    // Usar o contexto do carrinho
    const {
        items: cartItems,
        participants,
        totalPrice,
        removeItem,
        updateQuantity,
        clearCart,
        addParticipant,
        removeParticipant,
        handleCheckout,
        isAuthenticated,
        user
    } = useCart();

    // Estado para gerenciar participantes
    const [participantName, setParticipantName] = useState('');
    const [loadingAddParticipant, setLoadingAddParticipant] = useState(false);
    const [loadingRemoveParticipant, setLoadingRemoveParticipant] = useState('');

    // Estado para gerenciar pagamento
    const [paymentDetails, setPaymentDetails] = useState({
        method: 'pix',
        installments: 1,
        rate: 0,
        fee: 0,
        total: totalPrice,
        installmentValue: totalPrice
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Estado para controlar a modal de confirmação
    const [confirmationModal, setConfirmationModal] = useState({
        open: false,
        loading: false
    });

    // Estado para controlar a modal de sucesso
    const [successModal, setSuccessModal] = useState({
        open: false,
        orderNumber: '',
        orderId: '',
        whatsappMessage: ''
    });

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const calculateMinimumValue = () => {
        const baseValue = 100; // Valor base
        const additionalValue = participants.length * 100; // Exemplo: R$50 por
        // Valor mínimo baseado no número de participantes
        return additionalValue + baseValue // Exemplo:
    };

    // Função para lidar com mudanças no pagamento
    const handlePaymentChange = React.useCallback((newPaymentDetails) => {
        setPaymentDetails(newPaymentDetails);
    }, []);

    // Função para adicionar participante
    const handleAddParticipant = async () => {
        if (participantName.trim()) {
            setLoadingAddParticipant(true);
            try {
                await addParticipant(participantName.trim());
                setParticipantName('');
                setSnackbar({
                    open: true,
                    message: `Convidado ${participantName.trim()} adicionado`,
                    severity: 'success'
                });
            } catch (error) {
                setSnackbar({
                    open: true,
                    message: error.message || 'Erro ao adicionar convidado',
                    severity: 'error'
                });
            } finally {
                setLoadingAddParticipant(false);
            }
        }
    };

    // Função para remover participante
    const handleRemoveParticipant = async (participantNameToRemove) => {
        setLoadingRemoveParticipant(participantNameToRemove);
        try {
            await removeParticipant(participantNameToRemove);
            setSnackbar({
                open: true,
                message: `Convidado ${participantNameToRemove} removido`,
                severity: 'info'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || 'Erro ao remover convidado',
                severity: 'error'
            });
        } finally {
            setLoadingRemoveParticipant('');
        }
    };

    // Função para remover item com feedback visual
    const handleRemoveItem = async (itemId, itemName) => {
        try {
            await removeItem(itemId);
            setSnackbar({
                open: true,
                message: `${itemName} removido do carrinho`,
                severity: 'info'
            });
        } catch (error) {
            console.error('Erro ao remover item:', error);
            setSnackbar({
                open: true,
                message: `Erro ao remover ${itemName} do carrinho`,
                severity: 'error'
            });
        }
    };

    // Função para atualizar quantidade
    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity > 99) {
            setSnackbar({
                open: true,
                message: `Não é possível colocar mais de 99 itens`,
                severity: 'warning'
            });
            return;
        }
        
        if (newQuantity <= 0) {
            setSnackbar({
                open: true,
                message: `Quantidade deve ser maior que 0`,
                severity: 'warning'
            });
            return;
        }
        
        try {
            await updateQuantity(itemId, newQuantity);
            setSnackbar({
                open: true,
                message: `Quantidade atualizada com sucesso`,
                severity: 'success'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: `Erro ao atualizar quantidade: ${error.message}`,
                severity: 'error'
            });
        }
    };

    // Redirect to WhatsApp
    const redirectToWhatsApp = (whatsappUrl) => {
        if (whatsappUrl) {
            window.open(whatsappUrl, '_blank');
        }
    };

    // Função para limpar carrinho
    const handleClearCart = () => {
        clearCart();
        setSnackbar({
            open: true,
            message: 'Carrinho limpo com sucesso',
            severity: 'success'
        });
    };

    // Função para abrir modal de confirmação
    const handleOpenConfirmation = () => {
        if (cartItems.length === 0) {
            setSnackbar({
                open: true,
                message: 'Carrinho está vazio',
                severity: 'warning'
            });
            return;
        }

        setConfirmationModal({ open: true, loading: false });
    };

    // Função para fechar modal de confirmação
    const handleCloseConfirmation = () => {
        setConfirmationModal({ open: false, loading: false });
    };

    // Função para fechar modal de sucesso
    const handleCloseSuccessModal = () => {
        setSuccessModal({ open: false, orderNumber: '', orderId: '', whatsappMessage: '' });
        // Recarregar a página para limpar o carrinho e resetar o estado
        clearCart();
    };

    // Função para copiar mensagem do WhatsApp
    const handleCopyMessage = async () => {
        if (successModal.whatsappMessage) {
            try {
                await navigator.clipboard.writeText(successModal.whatsappMessage);
                setSnackbar({
                    open: true,
                    message: 'Mensagem copiada para a área de transferência!',
                    severity: 'success'
                });
            } catch {
                setSnackbar({
                    open: true,
                    message: 'Erro ao copiar mensagem',
                    severity: 'error'
                });
            }
        }
    };

    // Função original de checkout (agora será chamada após confirmação)
    const handleConfirmedCheckout = async () => {
        setConfirmationModal({ open: true, loading: true });
        
        if (cartItems.length === 0) {
            setSnackbar({
                open: true,
                message: 'Carrinho está vazio',
                severity: 'warning'
            });
            setConfirmationModal({ open: false, loading: false });
            return;
        }

        try {
            const response = await handleCheckout(paymentDetails);
            if (response.success) {
                // Fechar modal de confirmação
                setConfirmationModal({ open: false, loading: false });
                
                // Mostrar modal de sucesso com detalhes do pedido
                setSuccessModal({
                    open: true,
                    orderNumber: response.orderNumber || response.order?.orderNumber || 'N/A',
                    orderId: response.orderId || response.order?._id || response._id || 'N/A',
                    whatsappMessage: response.whatsapp_message || response.message || ''
                });
                
                // Após 3 segundos, apenas redirecionar para WhatsApp (sem fechar modal)
                setTimeout(() => {
                    redirectToWhatsApp(response.whatsapp_url);
                    
                    // Mostrar mensagem final após redirecionamento
                    setTimeout(() => {
                        setSnackbar({
                            open: true,
                            message: 'Redirecionado para WhatsApp com sucesso!',
                            severity: 'success'
                        });
                    }, 500);
                }, 3000);
                
            } else if (response.requiresLogin) {
                setConfirmationModal({ open: false, loading: false });
                setSnackbar({
                    open: true,
                    message: 'É necessário fazer login para finalizar o pedido',
                    severity: 'warning'
                });
            } else {
                setConfirmationModal({ open: false, loading: false });
                setSnackbar({
                    open: true,
                    message: response.error || 'Erro ao preparar pedido',
                    severity: 'error'
                });
            }
        } catch (error) {
            setConfirmationModal({ open: false, loading: false });
            setSnackbar({
                open: true,
                message: `Erro ao preparar pedido: ${error.message}`,
                severity: 'error'
            });
        }
    };

    // Função para redirecionar para login
    const handleLoginRedirect = () => {
        navigate('/auth');
    };

    const handleContinueShopping = () => {
        navigate('/products');
    };

    const handleGoToAccount = () => {
        navigate('/account');
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <>
            {/* Estilos de animação */}
            <style>
                {`
                    @keyframes pulse {
                        0% {
                            transform: scale(1);
                            box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
                        }
                        50% {
                            transform: scale(1.05);
                            box-shadow: 0 12px 35px rgba(76, 175, 80, 0.4);
                        }
                        100% {
                            transform: scale(1);
                            box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
                        }
                    }
                    
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
            
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {cartItems.length > 0 ? (
                    <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        mb: 4,
                        fontSize: isMobile ? '1.8rem' : '2.5rem'
                    }}
                >
                    Carrinho de Compras
                </Typography>
                ) : (
                    <Typography>
                    </Typography>
                )}

                {cartItems.length === 0 ? (
                    <EmptyCart 
                        onContinueShopping={handleContinueShopping}
                        onGoToAccount={handleGoToAccount}
                    />
                ) : (
                    <Grid
                        container
                        spacing={isMobile ? 3 : 4}
                        alignItems="flex-start"
                    >
                        {/* Coluna dos itens do carrinho */}
                        <Grid size={isMobile ? 12 : 8}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    height: '100%',
                                }}
                            >
                                {cartItems.map((item) => (
                                    <CartItem
                                        key={item._id}
                                        item={item}
                                        onRemove={() => handleRemoveItem(item.product._id, item.product.name)}
                                        onUpdateQuantity={(newQuantity) =>
                                            handleUpdateQuantity(item.product._id, newQuantity)
                                        }
                                    />
                                ))}
                            </Box>
                        </Grid>

                        {/* Coluna do resumo (centralizado verticalmente) */}
                        <Grid size={isMobile ? 12 : 4}>
                            {/* Seção de Participantes */}
                            <Box
                                elevation={2}
                                sx={{
                                borderRadius: '20px',
                                background: 'rgba(255, 255, 255, 0.98)',
                                border: '2px solid',
                                borderColor: 'transparent',
                                boxShadow: '0 12px 40px rgba(218, 165, 32, 0.15)',
                                position: 'static',
                                top: 20,
                                mb: 3,
                                p: 4,
                                height: 'fit-content',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 16px 50px rgba(218, 165, 32, 0.2)',
                                    borderColor: 'rgba(218, 165, 32, 0.3)'
                                }
                            }}
                            >
                                {/* Informação do Organizador */}
                                {isAuthenticated && user && (
                                    <Box sx={{ mb: 3, p: 2, backgroundColor: theme.palette.primary.light, borderRadius: 1 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: theme.palette.primary.dark,
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                textAlign: 'center'
                                            }}
                                        >
                                            👤 Convidado: {user.firstName} {user.lastName}
                                        </Typography>
                                    </Box>
                                )}

                                {!isAuthenticated && (
                                    <Box sx={{ mb: 3, p: 2, backgroundColor: theme.palette.warning.light, borderRadius: 1 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: theme.palette.warning.dark,
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                textAlign: 'center'
                                            }}
                                        >
                                            ⚠️ Faça login para finalizar seu pedido
                                        </Typography>
                                    </Box>
                                )}

                                <Typography
                                    variant="h6"
                                    gutterBottom
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
                                    Convidados Adicionais
                                </Typography>
                                
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 2, fontSize: '0.85rem' }}
                                >
                                    {isAuthenticated 
                                        ? 'Você já está incluído como Convidado. Adicione outros convidados:'
                                        : 'Adicione convidados (você será incluído como organizador após o login):'
                                    }
                                </Typography>
                                
                                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Nome do convidado"
                                        value={participantName}
                                        onChange={(e) => setParticipantName(e.target.value)}
                                        variant="outlined"
                                        size={isMobile ? "small" : "medium"}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleAddParticipant();
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleAddParticipant}
                                        disabled={!participantName.trim() || loadingAddParticipant}
                                        sx={{ minWidth: 'auto', px: 2 }}
                                    >
                                        {loadingAddParticipant ? (
                                            <CircularProgress size={20} color="inherit" />
                                        ) : (
                                            <AddIcon />
                                        )}
                                    </Button>
                                </Box>

                                {participants.length > 0 && (
                                        <List dense sx={{ mb: 2 }}>
                                            {participants.map((participant) => (
                                                <ListItem
                                                    key={participant}
                                                    sx={{
                                                        px: 2,
                                                        py: 0.5,
                                                        backgroundColor: theme.palette.action.hover,
                                                        borderRadius: 1,
                                                        mb: 0.5,
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary={participant}
                                                    />
                                                    <IconButton
                                                        onClick={() => handleRemoveParticipant(participant)}
                                                        size="small"
                                                        color="error"
                                                        disabled={loadingRemoveParticipant === participant}
                                                        sx={{ ml: 1 }}
                                                    >
                                                        {loadingRemoveParticipant === participant ? (
                                                            <CircularProgress size={16} color="inherit" />
                                                        ) : (
                                                            <DeleteIcon fontSize="small" />
                                                        )}
                                                    </IconButton>
                                                </ListItem>
                                            ))}
                                        </List>
                                )}

                                {participants.length === 0 && (
                                    <Box sx={{ textAlign: 'center', py: 2 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Nenhum convidado adicionado
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                            Adicione convidados ou envie apenas com você como organizador
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            {/* Seção de Pagamento */}
                            <PaymentSelector
                                subtotal={totalPrice}
                                onPaymentChange={handlePaymentChange}
                            />

                            {/* Resumo do Carrinho */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    height: '100%',
                                    minHeight: isMobile ? 'auto' : '100%', // para forçar altura igual em desktop
                                }}
                            >
                                <CartSummary
                                    items={cartItems}
                                    totalPrice={paymentDetails.total}
                                    paymentDetails={paymentDetails}
                                    onClearCart={handleClearCart}
                                    onCheckout={handleOpenConfirmation}
                                    onContinueShopping={handleContinueShopping}
                                    onLogin={handleLoginRedirect}
                                    participants={participants}
                                    minimumValue={calculateMinimumValue()}
                                    isAuthenticated={isAuthenticated}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                )}
            </Container>

            {/* Modal de Confirmação */}
            <Dialog
                open={confirmationModal.open}
                onClose={!confirmationModal.loading ? handleCloseConfirmation : undefined}
                maxWidth="sm"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.98)',
                            border: '2px solid',
                            borderColor: 'transparent',
                            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.98)), linear-gradient(135deg, rgba(218, 165, 32, 0.15), rgba(184, 134, 11, 0.15))',
                            backgroundOrigin: 'border-box',
                            backgroundClip: 'content-box, border-box',
                            boxShadow: '0 25px 80px rgba(218, 165, 32, 0.15)',
                        }
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 500,
                        background: 'linear-gradient(135deg, #daa520, #b8860b)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: '1.5rem',
                        textAlign: 'center',
                        pb: 1
                    }}
                >
                    Confirmar Pedido
                </DialogTitle>
                
                <DialogContent sx={{ px: 3, py: 2 }}>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            mb: 3,
                            fontFamily: "'Playfair Display', serif",
                            color: '#8b4513',
                            textAlign: 'center',
                            fontStyle: 'italic'
                        }}
                    >
                        Você está prestes a enviar seu pedido via WhatsApp. Confirma?
                    </Typography>

                    {/* Resumo do pedido */}
                    <Box
                        sx={{
                            p: 2,
                            background: 'linear-gradient(135deg, rgba(218, 165, 32, 0.05), rgba(184, 134, 11, 0.05))',
                            borderRadius: '12px',
                            border: '1px solid rgba(218, 165, 32, 0.2)',
                            mb: 3
                        }}
                    >
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                mb: 2,
                                fontFamily: "'Playfair Display', serif",
                                color: '#daa520',
                                fontSize: '1.1rem',
                                fontWeight: 500
                            }}
                        >
                            Resumo do Pedido:
                        </Typography>
                        
                        <Typography variant="body2" sx={{ mb: 1, color: '#8b4513' }}>
                            • {cartItems.length} {cartItems.length === 1 ? 'produto' : 'produtos'}
                        </Typography>
                        
                        <Typography variant="body2" sx={{ mb: 1, color: '#8b4513' }}>
                            • {participants.length + 1} {participants.length + 1 === 1 ? 'participante' : 'participantes'}
                        </Typography>
                        
                        <Typography variant="body2" sx={{ mb: 1, color: '#8b4513' }}>
                            • Pagamento: {paymentDetails.method === 'pix' ? 'PIX' : 'Cartão de Crédito'}
                            {paymentDetails.method === 'credit_card' && ` (${paymentDetails.installments}x)`}
                        </Typography>
                        
                        <Divider sx={{ 
                            my: 1,
                            background: 'linear-gradient(90deg, transparent, rgba(218, 165, 32, 0.3), transparent)'
                        }} />
                        
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                color: '#daa520',
                                fontFamily: "'Playfair Display', serif",
                                fontWeight: 600,
                                textAlign: 'center'
                            }}
                        >
                            Total: R$ {paymentDetails.total.toFixed(2).replace('.', ',')}
                        </Typography>
                    </Box>

                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: '#8b4513',
                            textAlign: 'center',
                            fontStyle: 'italic',
                            fontSize: '0.9rem'
                        }}
                    >
                        Após confirmar, você será redirecionado para o WhatsApp com os detalhes do pedido.
                    </Typography>
                </DialogContent>
                
                <DialogActions sx={{ px: 3, pb: 3, gap: 1, justifyContent: 'center' }}>
                    <Button
                        onClick={handleCloseConfirmation}
                        disabled={confirmationModal.loading}
                        variant="outlined"
                        sx={{
                            borderRadius: '20px',
                            fontFamily: "'Playfair Display', serif",
                            borderColor: 'rgba(218, 165, 32, 0.3)',
                            color: '#8b4513',
                            px: 3,
                            '&:hover': {
                                borderColor: 'rgba(218, 165, 32, 0.5)',
                                backgroundColor: 'rgba(218, 165, 32, 0.05)'
                            }
                        }}
                    >
                        Cancelar
                    </Button>
                    
                    <Button
                        onClick={handleConfirmedCheckout}
                        disabled={confirmationModal.loading}
                        variant="contained"
                        sx={{
                            borderRadius: '20px',
                            fontFamily: "'Playfair Display', serif",
                            background: 'linear-gradient(135deg, #25D366, #128C7E)',
                            px: 4,
                            '&:hover': {
                                background: 'linear-gradient(135deg, #128C7E, #0d5d4f)'
                            }
                        }}
                    >
                        {confirmationModal.loading ? (
                            <>
                                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                Enviando...
                            </>
                        ) : (
                            'Confirmar e Enviar'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal de Sucesso - Pedido Registrado */}
            <Dialog
                open={successModal.open}
                onClose={handleCloseSuccessModal}
                maxWidth="sm"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.98)',
                            border: '2px solid',
                            borderColor: 'transparent',
                            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.98)), linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(56, 142, 60, 0.15))',
                            backgroundOrigin: 'border-box',
                            backgroundClip: 'content-box, border-box',
                            boxShadow: '0 25px 80px rgba(76, 175, 80, 0.15)',
                            position: 'relative'
                        }
                    }
                }}
            >
                {/* Botão X para fechar */}
                <IconButton
                    onClick={handleCloseSuccessModal}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'grey.500',
                        zIndex: 1,
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            color: 'grey.700'
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>
                
                <DialogContent sx={{ textAlign: 'center', py: 4, px: 3 }}>
                    {/* Ícone de Sucesso */}
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #4caf50, #388e3c)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 3,
                            boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
                            animation: 'pulse 2s infinite'
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: '2rem',
                                color: 'white'
                            }}
                        >
                            ✓
                        </Typography>
                    </Box>

                    <Typography 
                        variant="h5" 
                        sx={{ 
                            mb: 2,
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 600,
                            color: '#2e7d32',
                        }}
                    >
                        Pedido Registrado com Sucesso!
                    </Typography>

                    <Box
                        sx={{
                            p: 3,
                            background: 'linear-gradient(135deg, rgba(218, 165, 32, 0.05), rgba(184, 134, 11, 0.05))',
                            borderRadius: '12px',
                            border: '1px solid rgba(218, 165, 32, 0.2)',
                            mb: 3
                        }}
                    >
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                mb: 1,
                                fontFamily: "'Playfair Display', serif",
                                color: '#daa520',
                                fontSize: '1.2rem',
                                fontWeight: 600
                            }}
                        >
                            Número do Pedido:
                        </Typography>
                        
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                fontFamily: 'monospace',
                                color: '#2e7d32',
                                fontWeight: 700,
                                mb: 2,
                                letterSpacing: '1px'
                            }}
                        >
                            #{successModal.orderNumber}
                        </Typography>

                        <Divider sx={{ 
                            my: 2,
                            background: 'linear-gradient(90deg, transparent, rgba(218, 165, 32, 0.3), transparent)'
                        }} />

                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: '#8b4513',
                                fontFamily: "'Playfair Display', serif",
                                fontStyle: 'italic'
                            }}
                        >
                            Seu pedido foi registrado no sistema!
                        </Typography>
                    </Box>

                    <Typography 
                        variant="body1" 
                        sx={{ 
                            mb: 2,
                            color: '#2e7d32',
                            fontWeight: 500
                        }}
                    >
                        Você será redirecionado para o WhatsApp automaticamente
                    </Typography>

                    {/* Indicador de carregamento - apenas nos primeiros 2 segundos */}
                    <CircularProgress 
                        size={30} 
                        sx={{ 
                            color: '#25D366',
                            animation: 'spin 1s linear infinite',
                            mb: 2
                        }} 
                    />

                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: 'text.secondary',
                            fontSize: '0.9rem',
                            mb: 2
                        }}
                    >
                        Você receberá os detalhes completos do pedido no WhatsApp
                    </Typography>

                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: '#8b4513',
                            fontStyle: 'italic',
                            fontSize: '0.85rem'
                        }}
                    >
                        💡 Esta janela permanecerá aberta para sua referência. 
                        Você pode fechá-la clicando no ✕ acima.
                    </Typography>

                    {/* Seção de backup - caso não redirecione */}
                    {successModal.whatsappMessage && (
                        <Box
                            sx={{
                                mt: 4,
                                p: 3,
                                background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.05), rgba(18, 140, 126, 0.05))',
                                borderRadius: '12px',
                                border: '1px solid rgba(37, 211, 102, 0.2)',
                            }}
                        >
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    mb: 2,
                                    fontFamily: "'Playfair Display', serif",
                                    color: '#25D366',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    textAlign: 'center'
                                }}
                            >
                                📱 Não foi redirecionado?
                            </Typography>
                            
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: '#2e7d32',
                                    textAlign: 'center',
                                    mb: 2,
                                    lineHeight: 1.6
                                }}
                            >
                                Copie a mensagem abaixo e envie manualmente para:
                            </Typography>

                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontFamily: 'monospace',
                                    color: '#25D366',
                                    fontWeight: 700,
                                    textAlign: 'center',
                                    mb: 2,
                                    fontSize: '1.2rem',
                                    letterSpacing: '1px'
                                }}
                            >
                                (41) 98898-7128
                            </Typography>

                            <Button
                                onClick={handleCopyMessage}
                                variant="contained"
                                startIcon={<CopyIcon />}
                                fullWidth
                                sx={{
                                    borderRadius: '20px',
                                    fontFamily: "'Playfair Display', serif",
                                    background: 'linear-gradient(135deg, #25D366, #128C7E)',
                                    fontWeight: 600,
                                    py: 1.5,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #128C7E, #0d5d4f)'
                                    }
                                }}
                            >
                                Copiar Mensagem do Pedido
                            </Button>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default CartPage;