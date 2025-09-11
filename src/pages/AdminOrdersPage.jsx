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
    Pagination,
    Stack,
    Collapse,
    ListItemIcon
} from '@mui/material';
import {
    Visibility,
    ShoppingCart,
    Person,
    CalendarToday,
    AttachMoney,
    Cancel,
    Check,
    PhotoCamera as PhotoIcon,
    CreditCard,
    AccountBalance as PixIcon,
    Delete,
    WhatsApp,
    Warning,
    KeyboardArrowDown,
    KeyboardArrowRight,
    Group,
    PersonOutline
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
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Estados dos filtros
    const [customerFilter, setCustomerFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Estados de paginação
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    // Estados do acordeão de participantes
    const [expandedOrders, setExpandedOrders] = useState({});

    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));

    const fetchOrders = useCallback(async (page = currentPage, limit = itemsPerPage, filters = {}) => {
        try {
            setLoading(true);
            
            // Construir parâmetros da query
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                admin: 'true'
            });

            // Adicionar filtros se existirem
            if (filters.status || statusFilter) {
                queryParams.append('status', filters.status || statusFilter);
            }

            const [ordersResponse, statsResponse] = await Promise.all([
                api.orders.getUserOrders({ status: filters.status || statusFilter }, true, page, limit),
                api.orders.getAllOrderStats()
            ]);
            
            // Atualizar dados de pedidos e paginação
            setOrders(ordersResponse.orders || []);
            setCurrentPage(ordersResponse.pagination?.currentPage || page);
            setTotalPages(ordersResponse.pagination?.totalPages || 0);
            setTotalOrders(ordersResponse.pagination?.totalOrders || 0);
            setHasMore(ordersResponse.pagination?.hasMore || false);
            setStats(statsResponse || {});
            
            // Debug log
            console.log('Pagination data:', ordersResponse.pagination);
            console.log('Orders count:', ordersResponse.orders?.length);
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
    }, [currentPage, itemsPerPage, statusFilter]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Effect para filtrar pedidos por cliente (filtro local)
    useEffect(() => {
        let filtered = [...orders];

        // Filtrar por cliente (mantido como filtro local)
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

        setFilteredOrders(filtered);
    }, [orders, customerFilter]);

    // Handlers para filtros
    const handleCustomerFilterChange = (value) => {
        setCustomerFilter(value);
    };

    const handleStatusFilterChange = (value) => {
        setStatusFilter(value);
        setCurrentPage(1);
        fetchOrders(1, itemsPerPage, { status: value });
    };

    const clearFilters = () => {
        setCustomerFilter('');
        setStatusFilter('');
        setCurrentPage(1);
        fetchOrders(1, itemsPerPage);
    };

    // Funções de paginação
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            setCurrentPage(page);
            fetchOrders(page, itemsPerPage, { status: statusFilter });
        }
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
        fetchOrders(1, newItemsPerPage, { status: statusFilter });
    };

    // Função para toggle do acordeão de participantes
    const handleToggleParticipants = (orderId) => {
        setExpandedOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    // Função para enviar mensagem de WhatsApp
    const handleSendWhatsApp = async (order) => {
        const phone = order.user?.phone;
        
        if (!phone) {
            setSnackbar({
                open: true,
                message: 'Número de telefone não encontrado para este usuário.',
                severity: 'error'
            });
            return;
        }

        // Limpar o número de telefone (remover caracteres especiais)
        const cleanPhone = phone.replace(/\D/g, '');
        
        // Adicionar código do país se não tiver
        const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

        // Mensagem com emojis originais para copiar
        const message = `*🎉 Presença Confirmada! 🎉*

Seu presente para o nosso Chá de Casa Nova foi registrado com sucesso! 💛

Estamos muito felizes em contar com você para celebrar este momento especial. Lembre-se: o evento será no dia *15 de novembro*, na *Av. Jacob Macanhan, 3697*.

🍖 Teremos um *churrasco especial*, e a única coisa que você precisa levar é a *bebida de sua preferência*.

Mal podemos esperar para comemorar juntos! 🏡✨`;

        try {
            // Copiar mensagem para o clipboard
            await navigator.clipboard.writeText(message);
            
            // Abrir WhatsApp apenas com o número
            const whatsappUrl = `https://wa.me/${formattedPhone}`;
            window.open(whatsappUrl, '_blank');
            
            setSnackbar({
                open: true,
                message: `Mensagem copiada! WhatsApp aberto para ${order.user?.firstName} ${order.user?.lastName}`,
                severity: 'success'
            });
        } catch {
            // Fallback caso não consiga copiar
            setSnackbar({
                open: true,
                message: 'Não foi possível copiar a mensagem. Tente novamente.',
                severity: 'error'
            });
        }
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

            // Recarregar as estatísticas e pedidos após atualizar o status
            try {
                const statsResponse = await api.orders.getAllOrderStats();
                setStats(statsResponse || {});
                // Recarregar a página atual de pedidos
                fetchOrders(currentPage, itemsPerPage, { status: statusFilter });
            } catch (statsError) {
                console.error('Erro ao recarregar dados:', statsError);
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

    const handleDeleteOrder = (order) => {
        setOrderToDelete(order);
        setDeleteConfirmOpen(true);
    };

    const confirmDeleteOrder = async () => {
        if (!orderToDelete) return;

        try {
            setDeleting(true);
            const response = await api.orders.deleteOrder(orderToDelete._id, true);
            
            // Remove o pedido da lista local
            setOrders(prevOrders => 
                prevOrders.filter(order => order._id !== orderToDelete._id)
            );

            // Recarregar as estatísticas
            try {
                const statsResponse = await api.orders.getAllOrderStats();
                setStats(statsResponse || {});
                // Recarregar a página atual de pedidos
                fetchOrders(currentPage, itemsPerPage, { status: statusFilter });
            } catch (statsError) {
                console.error('Erro ao recarregar estatísticas:', statsError);
            }

            // Fechar o modal de detalhes se o pedido deletado estava sendo visualizado
            if (selectedOrder && selectedOrder._id === orderToDelete._id) {
                setDetailsOpen(false);
                setSelectedOrder(null);
            }

            setSnackbar({
                open: true,
                message: response.msg || 'Pedido removido com sucesso',
                severity: 'success'
            });
        } catch (error) {
            console.error('Erro ao remover pedido:', error);
            setSnackbar({
                open: true,
                message: error.message || 'Erro ao remover pedido',
                severity: 'error'
            });
        } finally {
            setDeleting(false);
            setDeleteConfirmOpen(false);
            setOrderToDelete(null);
        }
    };

    const cancelDeleteOrder = () => {
        setDeleteConfirmOpen(false);
        setOrderToDelete(null);
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
                                        {filteredOrders.length} de {totalOrders} pedidos
                                        {totalPages > 1 && ` • Página ${currentPage} de ${totalPages}`}
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
                                            <React.Fragment key={order._id}>
                                                <TableRow hover>
                                                    <TableCell>
                                                        <Typography variant="body2" fontFamily="monospace">
                                                            #{order._id.slice(-8)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center">
                                                            <Person sx={{ mr: 1, color: 'text.secondary' }} />
                                                            <Box sx={{ flex: 1 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                                        {order.user?.firstName + " " + order.user?.lastName || 'Nome não disponível'}
                                                                    </Typography>
                                                                    {/* Botão para expandir participantes - só mostra se houver participantes */}
                                                                    {order.participants && order.participants.length > 0 && (
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => handleToggleParticipants(order._id)}
                                                                            sx={{ ml: 1 }}
                                                                        >
                                                                            {expandedOrders[order._id] ? (
                                                                                <KeyboardArrowDown />
                                                                            ) : (
                                                                                <KeyboardArrowRight />
                                                                            )}
                                                                        </IconButton>
                                                                    )}
                                                                </Box>
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
                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                            <Tooltip title="Ver detalhes">
                                                                <IconButton
                                                                    onClick={() => handleViewDetails(order._id)}
                                                                    size="small"
                                                                    color="primary"
                                                                >
                                                                    <Visibility />
                                                                </IconButton>
                                                            </Tooltip>
                                                            
                                                            {order.status === 'completed' && (
                                                                <Tooltip title="Enviar mensagem de confirmação no WhatsApp">
                                                                    <IconButton
                                                                        onClick={() => handleSendWhatsApp(order)}
                                                                        size="small"
                                                                        sx={{ 
                                                                            color: '#25d366',
                                                                            '&:hover': {
                                                                                backgroundColor: 'rgba(37, 211, 102, 0.08)',
                                                                                transform: 'scale(1.1)'
                                                                            }
                                                                        }}
                                                                    >
                                                                        <WhatsApp />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}

                                                            {(order.status === 'pending' || order.status === 'cancelled') && (
                                                                <Tooltip title="Remover pedido">
                                                                    <IconButton
                                                                        onClick={() => handleDeleteOrder(order)}
                                                                        size="small"
                                                                        sx={{ 
                                                                            color: '#f44336',
                                                                            '&:hover': {
                                                                                backgroundColor: 'rgba(244, 67, 54, 0.04)'
                                                                            }
                                                                        }}
                                                                    >
                                                                        <Delete />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>

                                                {/* Linha do acordeão para participantes */}
                                                {order.participants && order.participants.length > 0 && (
                                                    <TableRow>
                                                        <TableCell 
                                                            colSpan={6} 
                                                            sx={{ 
                                                                py: 0,
                                                                border: 0,
                                                                backgroundColor: expandedOrders[order._id] ? 'rgba(0, 0, 0, 0.02)' : 'transparent'
                                                            }}
                                                        >
                                                            <Collapse in={expandedOrders[order._id]} timeout="auto" unmountOnExit>
                                                                <Box sx={{ py: 2, px: 3 }}>
                                                                    <Typography 
                                                                        variant="subtitle2" 
                                                                        sx={{ 
                                                                            mb: 2,
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: 1,
                                                                            color: 'text.secondary'
                                                                        }}
                                                                    >
                                                                        <Group fontSize="small" />
                                                                        Participantes ({order.participants.length})
                                                                    </Typography>
                                                                    
                                                                    <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                                                                        {order.participants.map((participant, index) => (
                                                                            <ListItem 
                                                                                key={`${order._id}-participant-${index}`}
                                                                                sx={{
                                                                                    border: '1px solid',
                                                                                    borderColor: 'grey.200',
                                                                                    borderRadius: 1,
                                                                                    mb: 0.5,
                                                                                    '&:last-child': {
                                                                                        mb: 0
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                                                    <PersonOutline fontSize="small" />
                                                                                </ListItemIcon>
                                                                                <ListItemText 
                                                                                    primary={participant}
                                                                                    slotProps={{
                                                                                        primary: {
                                                                                            variant: 'body2'
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </ListItem>
                                                                        ))}
                                                                    </List>
                                                                </Box>
                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
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

                    {/* Controles de Paginação */}
                    <Paper elevation={1} sx={{ p: 3, mt: 2, borderRadius: 2 }}>
                        <Stack 
                            direction={isSmall ? 'column' : 'row'} 
                            spacing={2} 
                            alignItems="center" 
                            justifyContent="space-between"
                        >
                            {/* Seletor de itens por página */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Itens por página:
                                </Typography>
                                <FormControl size="small" sx={{ minWidth: 80 }}>
                                    <Select
                                        value={itemsPerPage}
                                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                        sx={{ borderRadius: 1 }}
                                    >
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* Componente de Paginação */}
                            {totalPages > 0 && (
                                <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={(event, page) => goToPage(page)}
                                    color="primary"
                                    size={isSmall ? 'small' : 'medium'}
                                    showFirstButton
                                    showLastButton
                                    sx={{
                                        '& .MuiPaginationItem-root': {
                                            borderRadius: 2,
                                        },
                                    }}
                                />
                            )}

                            {/* Informação de páginas */}
                            <Typography variant="body2" color="text.secondary">
                                Mostrando {totalOrders > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}-{Math.min(currentPage * itemsPerPage, totalOrders)} de {totalOrders}
                            </Typography>
                        </Stack>
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

                                    {/* Informações de Pagamento */}
                                    <Grid size={12}>
                                        <Paper elevation={1} sx={{ p: 2 }}>
                                            <Typography variant="h6" gutterBottom color="primary">
                                                Informações de Pagamento
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                    <Box sx={{ textAlign: 'center', p: 2 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Método de Pagamento
                                                        </Typography>
                                                        <Chip
                                                            label={selectedOrder.payment?.method === 'pix' ? 'PIX' : 'Cartão de Crédito'}
                                                            color={selectedOrder.payment?.method === 'pix' ? 'success' : 'primary'}
                                                            icon={selectedOrder.payment?.method === 'pix' ? <PixIcon /> : <CreditCard />}
                                                            sx={{ mt: 1 }}
                                                        />
                                                    </Box>
                                                </Grid>
                                                
                                                {selectedOrder.payment?.method === 'credit_card' && (
                                                    <>
                                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                            <Box sx={{ textAlign: 'center', p: 2 }}>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Parcelas
                                                                </Typography>
                                                                <Typography variant="h6" sx={{ mt: 1 }}>
                                                                    {selectedOrder.payment.installments}x
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                            <Box sx={{ textAlign: 'center', p: 2 }}>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Taxa ({selectedOrder.payment.rate}%)
                                                                </Typography>
                                                                <Typography variant="h6" color="warning.main" sx={{ mt: 1 }}>
                                                                    {formatCurrency(selectedOrder.payment.fee)}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    </>
                                                )}
                                                
                                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                    <Box sx={{ textAlign: 'center', p: 2 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Subtotal Produtos
                                                        </Typography>
                                                        <Typography variant="h6" sx={{ mt: 1 }}>
                                                            {formatCurrency(selectedOrder.payment?.subtotal || selectedOrder.totalAmount)}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                
                                                <Grid size={12}>
                                                    <Divider sx={{ my: 2 }} />
                                                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'primary.light', borderRadius: 1 }}>
                                                        <Typography variant="body2" color="primary.dark">
                                                            Valor Total Final
                                                        </Typography>
                                                        <Typography variant="h5" color="primary.dark" sx={{ mt: 1, fontWeight: 'bold' }}>
                                                            {formatCurrency(selectedOrder.payment?.total || selectedOrder.totalAmount)}
                                                        </Typography>
                                                        {selectedOrder.payment?.method === 'credit_card' && selectedOrder.payment?.installments > 1 && (
                                                            <Typography variant="body2" color="primary.dark" sx={{ mt: 0.5 }}>
                                                                {selectedOrder.payment.installments}x de {formatCurrency(selectedOrder.payment.total / selectedOrder.payment.installments)}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Grid>
                                            </Grid>
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

            {/* Modal de Confirmação de Exclusão */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={cancelDeleteOrder}
                maxWidth="sm"
                fullWidth
                sx={{
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(218, 165, 32, 0.02), rgba(184, 134, 11, 0.02))',
                        border: '1px solid rgba(218, 165, 32, 0.1)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    }}
            >
                <DialogTitle sx={{ 
                    textAlign: 'center', 
                    pb: 1,
                    background: 'linear-gradient(135deg, #daa520, #b8860b)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: 700,
                    fontSize: '1.5rem',
                }}>
                    <Delete sx={{ 
                        fontSize: 48, 
                        color: '#f44336', 
                        mb: 2, 
                        display: 'block', 
                        mx: 'auto' 
                    }} />
                    Confirmar Remoção
                </DialogTitle>
                
                <DialogContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            mb: 2,
                            color: 'text.primary',
                            fontFamily: 'Playfair Display, serif',
                        }}
                    >
                        Tem certeza que deseja remover este pedido?
                    </Typography>
                    
                    {orderToDelete && (
                        <Paper 
                            elevation={2} 
                            sx={{ 
                                p: 3, 
                                mt: 2,
                                background: 'linear-gradient(135deg, rgba(218, 165, 32, 0.05), rgba(184, 134, 11, 0.05))',
                                border: '1px solid rgba(218, 165, 32, 0.2)',
                                borderRadius: 2,
                            }}
                        >
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontFamily: 'monospace',
                                    background: 'linear-gradient(135deg, #daa520, #b8860b)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontWeight: 700,
                                    mb: 1,
                                }}
                            >
                                #{orderToDelete._id.slice(-8)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Cliente: {orderToDelete.user?.firstName} {orderToDelete.user?.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Total: {formatCurrency(orderToDelete.totalAmount)}
                            </Typography>
                            <Chip
                                label={OrderStatus[orderToDelete.status]?.label || orderToDelete.status}
                                color={OrderStatus[orderToDelete.status]?.color || 'default'}
                                size="small"
                                variant="outlined"
                            />
                        </Paper>
                    )}

                    <Box sx={{ 
                        mt: 3, 
                        p: 2, 
                        backgroundColor: 'rgba(244, 67, 54, 0.05)',
                        borderRadius: 2,
                        border: '1px solid rgba(244, 67, 54, 0.1)',
                    }}>
                        <Typography variant="body2" sx={{ 
                            color: '#f44336',
                            fontWeight: 500,
                            fontStyle: 'italic',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}>
                            <Warning sx={{ fontSize: 18 }} />
                            Esta ação não pode ser desfeita. O pedido será permanentemente removido do sistema.
                        </Typography>
                    </Box>
                </DialogContent>
                
                <DialogActions sx={{ 
                    p: 3, 
                    gap: 2, 
                    justifyContent: 'center',
                    borderTop: '1px solid rgba(218, 165, 32, 0.1)',
                }}>
                    <Button
                        onClick={cancelDeleteOrder}
                        variant="outlined"
                        disabled={deleting}
                        sx={{
                            borderColor: 'rgba(218, 165, 32, 0.5)',
                            color: '#daa520',
                            fontFamily: 'Playfair Display, serif',
                            fontWeight: 600,
                            px: 3,
                            py: 1,
                            '&:hover': {
                                borderColor: '#daa520',
                                backgroundColor: 'rgba(218, 165, 32, 0.04)',
                            },
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={confirmDeleteOrder}
                        variant="contained"
                        disabled={deleting}
                        startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <Delete />}
                        sx={{
                            background: 'linear-gradient(135deg, #f44336, #d32f2f)',
                            color: 'white',
                            fontFamily: 'Playfair Display, serif',
                            fontWeight: 600,
                            px: 3,
                            py: 1,
                            boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #d32f2f, #c62828)',
                                boxShadow: '0 6px 16px rgba(244, 67, 54, 0.4)',
                            },
                            '&:disabled': {
                                background: 'rgba(244, 67, 54, 0.3)',
                                color: 'rgba(255, 255, 255, 0.7)',
                            },
                        }}
                    >
                        {deleting ? 'Removendo...' : 'Confirmar Remoção'}
                    </Button>
                </DialogActions>
            </Dialog>

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
