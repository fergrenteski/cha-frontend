// pages/CartPage.js
import { useState } from 'react';
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
    Paper
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';
import EmptyCart from '../components/EmptyCart';
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

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
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
    // Função para adicionar participante
    const handleAddParticipant = async () => {
        if (participantName.trim()) {
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
            }
        }
    };

    // Função para remover participante
    const handleRemoveParticipant = async (participantNameToRemove) => {
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

    const handleCheckoutProcess = async () => {
        if (cartItems.length === 0) {
            setSnackbar({
                open: true,
                message: 'Carrinho está vazio',
                severity: 'warning'
            });
            return;
        }

        try {
            const response = await handleCheckout();
            if (response.success) {
                setSnackbar({
                    open: true,
                    message: 'Redirecionando para WhatsApp...',
                    severity: 'success'
                });
                
                // Redirecionar para WhatsApp
                redirectToWhatsApp(response.whatsapp_url);
                
                // Limpar carrinho após 2 segundos
                setTimeout(() => {
                    clearCart();
                    setSnackbar({
                        open: true,
                        message: 'Pedido enviado! Carrinho limpo.',
                        severity: 'success'
                    });
                }, 2000);
            } else if (response.requiresLogin) {
                setSnackbar({
                    open: true,
                    message: 'É necessário fazer login para enviar o pedido',
                    severity: 'warning'
                });
            }
        } catch (error) {
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

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <>
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
                    <EmptyCart onContinueShopping={handleContinueShopping} />
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
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 3,
                                    mb: 3,
                                    borderRadius: 2,
                                    backgroundColor: theme.palette.background.paper
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
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        fontWeight: 600,
                                        color: theme.palette.text.primary
                                    }}
                                >
                                    <PersonIcon />
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
                                        disabled={!participantName.trim()}
                                        sx={{ minWidth: 'auto', px: 2 }}
                                    >
                                        <AddIcon />
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
                                                        sx={{ ml: 1 }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
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
                            </Paper>

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
                                    totalPrice={totalPrice}
                                    onClearCart={handleClearCart}
                                    onCheckout={handleCheckoutProcess}
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