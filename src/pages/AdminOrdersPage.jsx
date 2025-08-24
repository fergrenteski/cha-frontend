import React, { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Box,
    Tooltip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Snackbar,
    Alert,
    Avatar,
    CircularProgress,
    useTheme,
    useMediaQuery,
    Fade,
    Divider,
    TextField,
} from '@mui/material';
import {
    Visibility,
    Refresh,
    ShoppingCart,
    Person,
    CalendarToday,
    AttachMoney,
    Cancel,
    Check,
    PhotoCamera as PhotoIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import api from '../services/api';

const OrderStatus = {
    pending: { label: 'Pendente', color: 'warning' },
    completed: { label: 'Confirmado', color: 'success' },
    cancelled: { label: 'Cancelado', color: 'error' }
};

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [stats, setStats] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success'});

    // Estados dos filtros
    const [customerFilter, setCustomerFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const [ordersResponse, statsResponse] = await Promise.all([
                api.orders.getAllOrders(),
                api.orders.getAllOrderStats()
            ]);
            
            
            setOrders(ordersResponse.orders || ordersResponse || []);
            setStats(statsResponse || {});
        } catch (error) {
            console.error('Erro ao carregar pedidos:', error);
            setSnackbar({
                open: true,
                message: 'Erro ao carregar pedidos',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Effect para filtrar pedidos
    useEffect(() => {
        let filtered = [...orders];

        // Filtrar por cliente
        if (customerFilter.trim()) {
            filtered = filtered.filter(order => {
                const firstName = order.user?.firstName?.toLowerCase() || '';
                const lastName = order.user?.lastName?.toLowerCase() || '';
                const fullName = `${firstName} ${lastName}`.trim();
                const email = order.user?.email?.toLowerCase() || '';
                const searchTerm = customerFilter.toLowerCase();
                
                return firstName.includes(searchTerm) ||
                       lastName.includes(searchTerm) ||
                       fullName.includes(searchTerm) ||
                       email.includes(searchTerm);
            });
        }

        // Filtrar por status
        if (statusFilter) {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        setFilteredOrders(filtered);
    }, [orders, customerFilter, statusFilter]);

    // Handlers para filtros
    const handleCustomerFilterChange = (value) => {
        setCustomerFilter(value);
    };

    const handleStatusFilterChange = (value) => {
        setStatusFilter(value);
    };

    const clearFilters = () => {
        setCustomerFilter('');
        setStatusFilter('');
    };

    const handleViewDetails = async (orderId) => {
        try {
            const response = await api.orders.getOrderDetails(orderId);
            setSelectedOrder(response);
            setDetailsOpen(true);
        } catch (error) {
            console.error('Erro ao carregar detalhes do pedido:', error);
            setSnackbar({
                open: true,
                message: 'Erro ao carregar detalhes do pedido',
                severity: 'error'
            });
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            setUpdating(true);
            await api.orders.updateOrderStatus(orderId, newStatus);
            
            // Atualizar a lista de pedidos
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );

            // Atualizar pedido selecionado se for o mesmo
            if (selectedOrder && selectedOrder._id === orderId) {
                setSelectedOrder(prev => ({ ...prev, status: newStatus }));
            }

            // Recarregar as estatísticas após atualizar o status
            try {
                const [ordersResponse, statsResponse] = await Promise.all([
                api.orders.getAllOrders(),
                api.orders.getAllOrderStats()
                ]);
                setOrders(ordersResponse.orders || ordersResponse || []);
                setStats(statsResponse || {});  
            } catch (statsError) {
                console.error('Erro ao recarregar estatísticas:', statsError);
            }    
            setSnackbar({
                open: true,
                message: 'Status do pedido atualizado com sucesso',
                severity: 'success'
            });
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            setSnackbar({
                
                open: true,
                message: 'Erro ao atualizar status do pedido',
                severity: 'error'
            });
        } finally {
            setUpdating(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateString));
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress size={60} />
                </Box>
            </Container>
        );
    }

    return (
        <>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Fade in timeout={800}>
                    <Box>
                        {/* Cabeçalho */}
                    <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                            Gerenciar Pedidos
                        </Typography>
                    </Box>

                    {/* Cards de Estatísticas */}
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        <Grid size={{xs: 12, sm: 6, lg: 2.4}}>
                            <Card 
                                sx={{ 
                                    display: 'flex',
                                    alignItems: 'center', 
                                    justifyContent: isSmall ? 'left' : 'center', 
                                    height: '100%',
                                    borderLeft: '4px solid #9c27b0',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                                    '&:hover': {
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 2 }}>
                                    <Box display="flex" alignItems="center">
                                        <Box 
                                            sx={{ 
                                                width: 56, 
                                                height: 56, 
                                                borderRadius: '50%', 
                                                backgroundColor: '#9c27b0', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                mr: 2,
                                                flexShrink: 0
                                            }}
                                        >
                                            <ShoppingCart sx={{ color: 'white', fontSize: 24 }} />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                {stats.totalOrders || 0}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Total de Pedidos
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        <Grid size={{xs: 12, sm: 6, lg: 2.4}}>
                            <Card 
                                sx={{ 
                                    display: 'flex',
                                    alignItems: 'center', 
                                    justifyContent: isSmall ? 'left' : 'center', 
                                    height: '100%',
                                    borderLeft: '4px solid #2196f3',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                                    '&:hover': {
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 2 }}>
                                    <Box display="flex" alignItems="center">
                                        <Box 
                                            sx={{ 
                                                width: 56, 
                                                height: 56, 
                                                borderRadius: '50%', 
                                                backgroundColor: '#2196f3', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                mr: 2,
                                                flexShrink: 0
                                            }}
                                        >
                                            <CalendarToday sx={{ color: 'white', fontSize: 24 }} />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                {stats.ordersByStatus?.pending || 0}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Pedidos Pendentes
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        <Grid size={{xs: 12, sm: 6, lg: 2.4}}>
                            <Card 
                                sx={{ 
                                    display: 'flex',
                                    alignItems: 'center', 
                                    justifyContent: isSmall ? 'left' : 'center', 
                                    height: '100%',
                                    borderLeft: '4px solid #ff9800',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                                    '&:hover': {
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 2 }}>
                                    <Box display="flex" alignItems="center">
                                        <Box 
                                            sx={{ 
                                                width: 56, 
                                                height: 56, 
                                                borderRadius: '50%', 
                                                backgroundColor: '#ff9800', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                mr: 2,
                                                flexShrink: 0
                                            }}
                                        >
                                            <AttachMoney sx={{ color: 'white', fontSize: 24 }} />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                {formatCurrency(stats.totalSpent || 0)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Total Ganho
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        <Grid size={{xs: 12, sm: 6, lg: 2.4}}>
                            <Card 
                                sx={{ 
                                    display: 'flex',
                                    alignItems: 'center', 
                                    justifyContent: isSmall ? 'left' : 'center', 
                                    height: '100%',
                                    borderLeft: '4px solid #4caf50',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                                    '&:hover': {
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 2 }}>
                                    <Box display="flex" alignItems="center">
                                        <Box 
                                            sx={{ 
                                                width: 56, 
                                                height: 56, 
                                                borderRadius: '50%', 
                                                backgroundColor: '#4caf50', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                mr: 2,
                                                flexShrink: 0
                                            }}
                                        >
                                            <Check sx={{ color: 'white', fontSize: 24 }} />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                {stats.ordersByStatus?.completed || 0}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Pedidos Completos
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        <Grid size={{xs: 12, sm: 6, lg: 2.4}}>
                            <Card 
                                sx={{ 
                                    display: 'flex',
                                    alignItems: 'center', 
                                    justifyContent: isSmall ? 'left' : 'center', 
                                    height: '100%',
                                    borderLeft: '4px solid #f44336',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                                    '&:hover': {
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 2 }}>
                                    <Box display="flex" alignItems="center">
                                        <Box 
                                            sx={{ 
                                                width: 56, 
                                                height: 56, 
                                                borderRadius: '50%', 
                                                backgroundColor: '#f44336', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                mr: 2,
                                                flexShrink: 0
                                            }}
                                        >
                                            <Cancel sx={{ color: 'white', fontSize: 24 }} />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                {stats.ordersByStatus?.cancelled || 0}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Pedidos Cancelados
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Filtros */}
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 1 }}>
                        <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
                            Filtros
                        </Typography>
                        <Grid container spacing={3} alignItems="center">
                            <Grid size={{xs: 12, sm: 6, md: 6}}>
                                <TextField
                                    fullWidth
                                    label="Buscar por cliente (nome ou email)..."
                                    value={customerFilter}
                                    onChange={(e) => handleCustomerFilterChange(e.target.value)}
                                />
                            </Grid>
                            
                            <Grid size={{xs: 12, sm: 6, md: 3}}>
                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={statusFilter}
                                        label="Status"
                                        onChange={(e) => handleStatusFilterChange(e.target.value)}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <MenuItem value="">Todos</MenuItem>
                                        <MenuItem value="pending">Pendente</MenuItem>
                                        <MenuItem value="completed">Confirmado</MenuItem>
                                        <MenuItem value="cancelled">Cancelado</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            <Grid size={{xs: 12, sm: 12, md: 3}}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={clearFilters}
                                    sx={{ 
                                        height: 56,
                                        borderRadius: 2,
                                        borderColor: 'grey.300'
                                    }}
                                >
                                    Limpar Filtros
                                </Button>
                            </Grid>
                            
                            <Grid size={{xs: 12, sm: 12}}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {filteredOrders.length} de {orders.length} pedidos
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Tabela de Pedidos */}
                    <Paper elevation={3}>
                        {filteredOrders.length > 0 ? (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                                            <TableCell sx={{ fontWeight: 'bold' }}>ID do Pedido</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Data</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }} align="center">Ações</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredOrders.map((order) => (
                                            <TableRow key={order._id} hover>
                                                <TableCell>
                                                    <Typography variant="body2" fontFamily="monospace">
                                                        #{order._id.slice(-8)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center">
                                                        <Person sx={{ mr: 1, color: 'text.secondary' }} />
                                                        <Box>
                                                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                                {order.user?.firstName + " " + order.user?.lastName || 'Nome não disponível'}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {order.user?.email || 'Email não disponível'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {formatDate(order.createdAt)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                        {formatCurrency(order.totalAmount)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={OrderStatus[order.status]?.label || order.status}
                                                        color={OrderStatus[order.status]?.color || 'default'}
                                                        size="small"
                                                        variant="filled"
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Ver detalhes">
                                                        <IconButton
                                                            onClick={() => handleViewDetails(order._id)}
                                                            size="small"
                                                            color="primary"
                                                        >
                                                            <Visibility />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    py: 8,
                                    px: 3,
                                    textAlign: 'center'
                                }}
                            >
                                <ShoppingCart 
                                    sx={{ 
                                        fontSize: 64, 
                                        color: 'text.secondary', 
                                        mb: 2,
                                        opacity: 0.5 
                                    }} 
                                />
                                <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
                                    {orders.length === 0 ? 'Nenhum pedido encontrado' : 'Nenhum pedido corresponde aos filtros'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
                                    {orders.length === 0 
                                        ? 'Ainda não há pedidos registrados no sistema. Quando os clientes começarem a fazer pedidos, eles aparecerão aqui.'
                                        : 'Tente ajustar os filtros para encontrar os pedidos que você está procurando.'
                                    }
                                </Typography>
                            </Box>
                        )}
                    </Paper>

                    {/* Dialog de Detalhes do Pedido */}
                    <Dialog
                        open={detailsOpen}
                        onClose={() => setDetailsOpen(false)}
                        maxWidth="md"
                        fullWidth
                        fullScreen={isSmall}
                    >
                        <DialogTitle>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Typography variant="h6">
                                    Pedido #{selectedOrder?._id?.slice(-8)}
                                </Typography>
                                <Chip
                                    label={OrderStatus[selectedOrder?.status]?.label || selectedOrder?.status}
                                    color={OrderStatus[selectedOrder?.status]?.color || 'default'}
                                    variant="filled"
                                />
                            </Box>
                        </DialogTitle>
                                        <DialogContent dividers>
                            {selectedOrder ? (
                                <Grid container spacing={3}>
                                    {/* Informações do Cliente */}
                                    <Grid size={{xs: 12, md: 6}}>
                                        <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                                            <Typography variant="h6" gutterBottom color="primary">
                                                Informações do Cliente
                                            </Typography>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Nome"
                                                        secondary={selectedOrder.user?.firstName + " " + selectedOrder.user?.lastName || 'Não disponível'}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Email"
                                                        secondary={selectedOrder.user?.email || 'Não disponível'}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Telefone"
                                                        secondary={selectedOrder.user?.phone || 'Não informado'}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Participantes"
                                                        secondary={
                                                            <Box sx={{ mt: 1 }}>
                                                                {selectedOrder.participants && selectedOrder.participants.length > 0 ? (
                                                                    selectedOrder.participants.map((participant) => (
                                                                        <Box key={participant} sx={{ mb: 1, p: 1, backgroundColor: 'grey.100', borderRadius: 1 }}>
                                                                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                                                {participant || 'Nome não informado'}
                                                                            </Typography>
                                                                        </Box>
                                                                    ))
                                                                ) : (
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        Nenhum participante informado
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        }
                                                    />
                                                </ListItem>
                                            </List>
                                        </Paper>
                                    </Grid>

                                    {/* Informações do Pedido */}
                                    <Grid size={{xs: 12, md: 6}}>
                                        <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                                            <Typography variant="h6" gutterBottom color="primary">
                                                Informações do Pedido
                                            </Typography>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Data do Pedido"
                                                        secondary={formatDate(selectedOrder.createdAt)}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Total"
                                                        secondary={formatCurrency(selectedOrder.totalAmount)}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Alterar Status"
                                                        secondary={
                                                            <FormControl size="small" sx={{ mt: 1, minWidth: 150 }}>
                                                                <InputLabel>Status</InputLabel>
                                                                <Select
                                                                    value={selectedOrder.status}
                                                                    label="Status"
                                                                    onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                                                                    disabled={updating}
                                                                >
                                                                    {Object.entries(OrderStatus).map(([value, { label }]) => (
                                                                        <MenuItem key={value} value={value}>
                                                                            {label}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        }
                                                    />
                                                </ListItem>
                                            </List>
                                        </Paper>
                                    </Grid>

                                    {/* Itens do Pedido */}
                                    <Grid size={12}>
                                        <Paper elevation={1} sx={{ p: 2 }}>
                                            <Typography variant="h6" gutterBottom color="primary">
                                                Itens do Pedido
                                            </Typography>
                                            <Divider sx={{ mb: 2 }} />
                                            {selectedOrder.products?.map((product) => (
                                                <Box key={product?._id || `item-${product?._id}`} sx={{ mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid size={{xs: 12, sm: 6, }} sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>    
                                                            <Avatar
                                                                    src={product.productImage}
                                                                    alt={product.productName}
                                                                    sx={{ 
                                                                        width: 48, 
                                                                        height: 48,
                                                                        borderRadius: 2
                                                                    }}
                                                                >
                                                                  <PhotoIcon />
                                                                </Avatar>                                    
                                                            <Box>
                                                              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                                                {product?.productName || 'Produto não disponível'}
                                                              </Typography>
                                                              <Typography variant="body2" color="text.secondary">
                                                                  {product?.productDescription || 'Descrição não disponível'}
                                                              </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid size={{xs: 6, sm: 3}} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>     
                                                            <Typography variant="body2" color="text.secondary">
                                                                Quantidade: {product.quantity}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid size={{xs: 6, sm: 3}} sx={{ textAlign: { xs: 'right' } }}>     
                                                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                                {formatCurrency(product?.price || 0)}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            ))}
                                        </Paper>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                                    <CircularProgress />
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Button onClick={() => setDetailsOpen(false)} color="primary">
                                Fechar
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
                </Fade>
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AdminOrdersPage;
