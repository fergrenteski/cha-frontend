import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Button,
    Divider,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    ShoppingBag as OrderIcon,
    Visibility as ViewIcon,
    Cancel as CancelIcon,
    LocalShipping as ShippingIcon,
    CheckCircle as CompleteIcon,
    Schedule as PendingIcon
} from '@mui/icons-material';
import api from '../services/api';

const UserOrders = ({ limit = 5 }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.orders.getUserOrders({ 
                page: 1, 
                limit: limit 
            });
            setOrders(response.orders || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleViewOrder = async (orderId) => {
        try {
            const orderDetails = await api.orders.getOrderDetails(orderId);
            setSelectedOrder(orderDetails);
            setDialogOpen(true);
        } catch (err) {
            console.error('Erro ao carregar detalhes do pedido:', err);
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            await api.orders.cancelOrder(orderId, 'Cancelado pelo usuário');
            await fetchOrders(); // Recarregar lista
        } catch (err) {
            console.error('Erro ao cancelar pedido:', err);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <PendingIcon color="warning" />;
            case 'completed':
                return <CompleteIcon color="success" />;
            case 'cancelled':
                return <CancelIcon color="error" />;
            default:
                return <OrderIcon />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'warning';
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Pendente';
            case 'completed':
                return 'Concluído';
            case 'cancelled':
                return 'Cancelado';
            default:
                return status;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                Erro ao carregar pedidos: {error}
            </Alert>
        );
    }

    if (orders.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <OrderIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                    Nenhum pedido encontrado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Seus pedidos aparecerão aqui após a primeira compra
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <List sx={{ width: '100%' }}>
                {orders.map((order, index) => (
                    <React.Fragment key={order._id}>
                        <ListItem
                            sx={{
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                py: 2
                            }}
                        >
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                                mb: 1
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {getStatusIcon(order.status)}
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        Pedido #{order._id.slice(-6)}
                                    </Typography>
                                    <Chip 
                                        label={getStatusText(order.status)}
                                        color={getStatusColor(order.status)}
                                        size="small"
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Tooltip title="Ver detalhes">
                                        <IconButton 
                                            size="small"
                                            onClick={() => handleViewOrder(order._id)}
                                        >
                                            <ViewIcon />
                                        </IconButton>
                                    </Tooltip>
                                    {order.status === 'pending' && (
                                        <Tooltip title="Cancelar pedido">
                                            <IconButton 
                                                size="small"
                                                color="error"
                                                onClick={() => handleCancelOrder(order._id)}
                                            >
                                                <CancelIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Box>
                            </Box>
                            
                            <Box sx={{ width: '100%', pl: 4 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {formatDate(order.createdAt)}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    {order.products.length} item(s) • Total: {formatPrice(order.totalAmount)}
                                </Typography>
                                {order.participants?.length > 0 && (
                                    <Typography variant="body2" color="text.secondary">
                                        Convidados: {order.participants.join(', ')}
                                    </Typography>
                                )}
                            </Box>
                        </ListItem>
                        {index < orders.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>

            {/* Dialog de detalhes do pedido */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <OrderIcon />
                        Detalhes do Pedido #{selectedOrder?._id.slice(-6)}
                        <Chip 
                            label={getStatusText(selectedOrder?.status)}
                            color={getStatusColor(selectedOrder?.status)}
                            size="small"
                        />
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Criado em: {formatDate(selectedOrder.createdAt)}
                            </Typography>

                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Produtos
                            </Typography>
                            <List dense>
                                {selectedOrder.products.map((item) => (
                                    <ListItem key={item._id}>
                                        <ListItemAvatar>
                                            <Avatar 
                                                src={item.productImage} 
                                                variant="rounded"
                                            >
                                                <OrderIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={item.productName}
                                            secondary={`Quantidade: ${item.quantity} • Preço: ${formatPrice(item.price)}`}
                                        />
                                        <ListItemSecondaryAction>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {formatPrice(item.price * item.quantity)}
                                            </Typography>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>

                            <Divider sx={{ my: 2 }} />

                            {selectedOrder.participants?.length > 0 && (
                                <>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        Convidados
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                        {selectedOrder.participants.map((participant, index) => (
                                            <Chip 
                                                key={index}
                                                label={participant}
                                                variant="outlined"
                                                size="small"
                                            />
                                        ))}
                                    </Box>
                                </>
                            )}

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6">
                                    Total: {formatPrice(selectedOrder.totalAmount)}
                                </Typography>
                            </Box>

                            {selectedOrder.notes && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        Observações
                                    </Typography>
                                    <Typography variant="body2">
                                        {selectedOrder.notes}
                                    </Typography>
                                </>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UserOrders;
