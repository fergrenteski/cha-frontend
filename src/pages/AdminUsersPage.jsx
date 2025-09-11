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
    Grid,
    Card,
    CardContent,
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
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Pagination,
    Stack,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Collapse
} from '@mui/material';
import {
    Delete,
    Person,
    AdminPanelSettings,
    CheckCircle,
    KeyboardArrowDown,
    KeyboardArrowRight,
    Group,
    PersonOutline
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

// Mock API - você pode substituir por chamadas reais para sua API
// Removido pois agora usamos o backend real

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterConfirmed, setFilterConfirmed] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null, color: 'error' });
    
    // Estados de paginação
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    
    // Estados de loading para botões da modal
    const [loadingConfirm, setLoadingConfirm] = useState(false);

    // Estados do acordeão de participantes
    const [expandedUsers, setExpandedUsers] = useState({});

    const { user: currentUser } = useAuth();

    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));

    const fetchUsers = useCallback(async (currentPage = 1) => {
        try {
            setLoading(true);
            const usersData = await api.users.getAllUsers({
                page: currentPage,
                limit: pageSize
            });
            
            setUsers(usersData.users || []);
            setFilteredUsers(usersData.users || []);
            
            // A API retorna totalPages e totalUsers diretamente
            if (usersData.pagination) {
                setTotalPages(usersData.pagination.totalPages || 1);
                setTotalUsers(usersData.pagination.totalUsers || 0);
            } else {
                // Fallback se não houver objeto pagination
                setTotalPages(usersData.totalPages || Math.ceil((usersData.totalUsers || 0) / pageSize));
                setTotalUsers(usersData.totalUsers || 0);
            }
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            
            setSnackbar({
                open: true,
                message: 'Erro ao carregar usuários: ' + error.message,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    }, [pageSize]);

    useEffect(() => {
        fetchUsers(page);
    }, [fetchUsers, page]);

    // Filtros
    useEffect(() => {
        let filtered = users;

        // Filtro por texto
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtro por role
        if (filterRole) {
            filtered = filtered.filter(user =>
                filterRole === 'admin' ? user.isAdmin : !user.isAdmin
            );
        }

        // Filtro por confirmação
        if (filterConfirmed) {
            filtered = filtered.filter(user =>
                filterConfirmed === 'confirmed' ? user.confirmed : !user.confirmed
            );
        }

        setFilteredUsers(filtered);
    }, [users, searchTerm, filterRole, filterConfirmed]);

    // Handler para mudança de página
    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    // Handler para mudança de itens por página
    const handleItemsPerPageChange = (newPageSize) => {
        setPageSize(newPageSize);
        setPage(1); // Reset para primeira página quando mudar o tamanho
    };

    // Mostrar dialog de confirmação
    const showConfirmDialog = (title, message, onConfirm, color) => {
        setConfirmDialog({
            open: true,
            title,
            message,
            onConfirm,
            color
        });
    };

    // Fechar dialog de confirmação
    const closeConfirmDialog = () => {
        setLoadingConfirm(false);
        setConfirmDialog({ open: false, title: '', message: '', onConfirm: null, color: 'error' });
    };

    const handleToggleAdmin = async (userId, userName, currentIsAdmin) => {
        const confirmToggle = async () => {
            setLoadingConfirm(true);
            try {
                const response = await api.users.toggleUserAdmin(userId);
                
                setSnackbar({
                    open: true,
                    message: response.msg || `Privilégios de ${userName} atualizados com sucesso`,
                    severity: 'success'
                });

                // Recarregar a lista de usuários após a operação
                await fetchUsers();
            } catch (error) {
                console.error('Erro ao alterar privilégios:', error);
                setSnackbar({
                    open: true,
                    message: 'Erro ao alterar privilégios: ' + error.message,
                    severity: 'error'
                });
            } finally {
                setLoadingConfirm(false);
                closeConfirmDialog();
            }
        };

        showConfirmDialog(
            'Alterar Privilégios',
            `Tem certeza que deseja ${currentIsAdmin ? 'remover' : 'adicionar'} privilégios de administrador para ${userName}?`,
            confirmToggle,
            'info'
        );
    };

    const handleDeleteUser = async (userId, userName) => {
        const confirmDelete = async () => {
            setLoadingConfirm(true);
            try {
                const response = await api.users.deleteUser(userId);
                
                setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
                setSnackbar({
                    open: true,
                    message: response.msg || 'Usuário excluído com sucesso',
                    severity: 'success'
                });
            } catch (error) {
                console.error('Erro ao excluir usuário:', error);
                setSnackbar({
                    open: true,
                    message: 'Erro ao excluir usuário: ' + error.message,
                    severity: 'error'
                });
            } finally {
                setLoadingConfirm(false);
                closeConfirmDialog();
            }
        };

        showConfirmDialog(
            'Confirmar Exclusão',
            `Tem certeza que deseja excluir o usuário ${userName}? Esta ação não pode ser desfeita.`,
            confirmDelete,
            'error'
        );
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterRole('');
        setFilterConfirmed('');
    };

    // Função para toggle do acordeão de participantes
    const handleToggleParticipants = (userId) => {
        setExpandedUsers(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }));
    };

    // Função auxiliar para determinar o label da fonte do participante
    const getParticipantSourceLabel = (source) => {
        if (source === 'cart') return 'Carrinho';
        if (source === 'order') return 'Pedido';
        return 'Ambos';
    };

    // Calcular estatísticas localmente
    const totalParticipants = users.reduce((total, user) => total + (user.participants?.length || 0), 0);
    const confirmedParticipants = users.reduce((total, user) => 
        total + (user.participants?.filter(p => p.confirmed)?.length || 0), 0
    );
    
    const stats = {
        totalUsers: users.length + totalParticipants, // Usuários + Participantes
        adminUsers: users.filter(user => user.isAdmin).length,
        regularUsers: users.filter(user => !user.isAdmin).length,
        confirmedUsers: users.filter(user => user.confirmed).length + confirmedParticipants, // Usuários confirmados + Participantes confirmados
        onlyUsers: users.length, // Apenas usuários (para referência)
        onlyParticipants: totalParticipants // Apenas participantes (para referência)
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
                                Gerenciar Usuários
                            </Typography>
                        </Box>

                        {/* Cards de Estatísticas */}
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            <Grid size={{xs: 12, sm: 6, lg: 3}}>
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
                                                <Group sx={{ color: 'white', fontSize: 24 }} />
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                    {stats.totalUsers || 0}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Total de Participantes
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    ({stats.onlyUsers} usuários + {stats.onlyParticipants} convidados)
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid size={{xs: 12, sm: 6, lg: 3}}>
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
                                                <CheckCircle sx={{ color: 'white', fontSize: 24 }} />
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                    {stats.confirmedUsers || 0}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Participantes Confirmados
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid size={{xs: 12, sm: 6, lg: 3}}>
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
                                                <AdminPanelSettings sx={{ color: 'white', fontSize: 24 }} />
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                    {stats.adminUsers || 0}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Administradores
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid size={{xs: 12, sm: 6, lg: 3}}>
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
                                                <Person sx={{ color: 'white', fontSize: 24 }} />
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                    {stats.regularUsers || 0}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Usuários Regulares
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Filtros */}
                        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                             <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
                                Filtros
                            </Typography>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{xs: 12, sm: 6, md: 4}}>
                                    <TextField
                                        fullWidth
                                        label="Buscar usuários"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </Grid>
                                <Grid size={{xs: 12, sm: 3, md: 2.5}}>
                                    <FormControl fullWidth>
                                        <InputLabel>Tipo de Usuário</InputLabel>
                                        <Select
                                            value={filterRole}
                                            label="Tipo de Usuário"
                                            onChange={(e) => setFilterRole(e.target.value)}
                                        >
                                            <MenuItem value="">Todos</MenuItem>
                                            <MenuItem value="admin">Administradores</MenuItem>
                                            <MenuItem value="regular">Usuários Regulares</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{xs: 12, sm: 3, md: 2.5}}>
                                    <FormControl fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            value={filterConfirmed}
                                            label="Status"
                                            onChange={(e) => setFilterConfirmed(e.target.value)}
                                        >
                                            <MenuItem value="">Todos</MenuItem>
                                            <MenuItem value="confirmed">Confirmados</MenuItem>
                                            <MenuItem value="pending">Pendentes</MenuItem>
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
                                        Limpar
                                    </Button>
                                </Grid>
                                <Grid size={{xs: 12, sm: 12}}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {filteredUsers.length} de {users.length} usuários
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Tabela de Usuários */}
                        <Paper elevation={3}>
                            {filteredUsers.length > 0 ? (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Usuário</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Telefone</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Ações</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredUsers.map((user) => (
                                                <React.Fragment key={user._id}>
                                                    <TableRow 
                                                        hover
                                                        sx={{
                                                            ...(user.confirmed && {
                                                                borderLeft: '4px solid #4caf50',
                                                                backgroundColor: 'rgba(76, 175, 80, 0.05)',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                                                }
                                                            })
                                                        }}
                                                    >
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Avatar 
                                                                    sx={{ 
                                                                        mr: 2,
                                                                        ...(user.confirmed && {
                                                                            border: '2px solid #4caf50',
                                                                            backgroundColor: '#4caf50',
                                                                            color: 'white',
                                                                            fontWeight: 'bold'
                                                                        })
                                                                    }}
                                                                >
                                                                    {user.firstName.charAt(0).toUpperCase()}
                                                                </Avatar>
                                                                <Box sx={{ flex: 1 }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                        <Typography 
                                                                            variant="body1" 
                                                                            sx={{ 
                                                                                fontWeight: 'medium',
                                                                                ...(user.confirmed && {
                                                                                    color: '#2e7d32',
                                                                                    fontWeight: 'bold'
                                                                                })
                                                                            }}
                                                                        >
                                                                            {user.firstName} {user.lastName}
                                                                            {user.confirmed && (
                                                                                <CheckCircle 
                                                                                    sx={{ 
                                                                                        color: '#4caf50', 
                                                                                        fontSize: 16,
                                                                                        ml: 1,
                                                                                        verticalAlign: 'middle'
                                                                                    }} 
                                                                                />
                                                                            )}
                                                                        </Typography>
                                                                        {/* Botão para mostrar participantes se houver */}
                                                                        {user.participants && user.participants.length > 0 && (
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() => handleToggleParticipants(user._id)}
                                                                                sx={{ ml: 1 }}
                                                                            >
                                                                                {expandedUsers[user._id] ? (
                                                                                    <KeyboardArrowDown />
                                                                                ) : (
                                                                                    <KeyboardArrowRight />
                                                                                )}
                                                                            </IconButton>
                                                                        )}
                                                                    </Box>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        ID: {user._id}
                                                                        {user.participants && user.participants.length > 0 && (
                                                                            <span style={{ marginLeft: 8 }}>
                                                                                • {user.participants.length} participante{user.participants.length !== 1 ? 's' : ''}
                                                                            </span>
                                                                        )}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>{user.email}</TableCell>
                                                        <TableCell>{user.phone}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={user.isAdmin ? 'Admin' : 'Usuário'}
                                                                color={user.isAdmin ? 'warning' : 'default'}
                                                                size="small"
                                                                variant="filled"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Chip
                                                                    label={user.confirmed ? 'Confirmado' : 'Pendente'}
                                                                    color={user.confirmed ? 'success' : 'default'}
                                                                    size="small"
                                                                    variant={user.confirmed ? 'filled' : 'outlined'}
                                                                    sx={{
                                                                        fontWeight: 'normal',
                                                                        ...(user.confirmed && {
                                                                            backgroundColor: '#4caf50',
                                                                            color: 'white',
                                                                        })
                                                                    }}
                                                                />
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {user._id === currentUser?._id ? (
                                                                <Chip
                                                                    label="Você"
                                                                    color="primary"
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                            ) : (
                                                                <>
                                                                    <Tooltip title="Alterar Privilégios de Admin">
                                                                        <IconButton
                                                                            onClick={() => handleToggleAdmin(user._id, `${user.firstName} ${user.lastName}`, user.isAdmin)}
                                                                            size="small"
                                                                            color="info"
                                                                        >
                                                                            <AdminPanelSettings />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Excluir">
                                                                        <IconButton
                                                                            onClick={() => handleDeleteUser(user._id, `${user.firstName} ${user.lastName}`)}
                                                                            size="small"
                                                                            color="error"
                                                                        >
                                                                            <Delete />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                    
                                                    {/* Linha do acordeão para participantes */}
                                                    {user.participants && user.participants.length > 0 && (
                                                        <TableRow>
                                                            <TableCell 
                                                                colSpan={6} 
                                                                sx={{ 
                                                                    py: 0,
                                                                    border: 0,
                                                                    backgroundColor: expandedUsers[user._id] ? 'rgba(0, 0, 0, 0.02)' : 'transparent'
                                                                }}
                                                            >
                                                                <Collapse in={expandedUsers[user._id]} timeout="auto" unmountOnExit>
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
                                                                            Participantes ({user.participants.length})
                                                                        </Typography>
                                                                        
                                                                        <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                                                                            {user.participants.map((participant, index) => (
                                                                                <ListItem 
                                                                                    key={`${user._id}-participant-${index}`}
                                                                                    sx={{
                                                                                        border: '1px solid',
                                                                                        borderColor: participant.confirmed ? 'success.light' : 'grey.200',
                                                                                        borderRadius: 1,
                                                                                        mb: 0.5,
                                                                                        backgroundColor: participant.confirmed ? 'success.50' : 'transparent',
                                                                                        '&:last-child': {
                                                                                            mb: 0
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                                                                        {participant.confirmed ? (
                                                                                            <CheckCircle 
                                                                                                fontSize="small" 
                                                                                                sx={{ color: 'success.main' }} 
                                                                                            />
                                                                                        ) : (
                                                                                            <PersonOutline fontSize="small" />
                                                                                        )}
                                                                                    </ListItemIcon>
                                                                                    <ListItemText 
                                                                                        primary={
                                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                                <Typography variant="body2">
                                                                                                    {participant.name}
                                                                                                </Typography>
                                                                                                <Chip
                                                                                                    label={participant.confirmed ? 'Confirmado' : 'Pendente'}
                                                                                                    color={participant.confirmed ? 'success' : 'default'}
                                                                                                    size="small"
                                                                                                    variant={participant.confirmed ? 'filled' : 'outlined'}
                                                                                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                                                                                />
                                                                                                {participant.source && (
                                                                                                    <Chip
                                                                                                        label={getParticipantSourceLabel(participant.source)}
                                                                                                        color="info"
                                                                                                        size="small"
                                                                                                        variant="outlined"
                                                                                                        sx={{ fontSize: '0.65rem', height: 18 }}
                                                                                                    />
                                                                                                )}
                                                                                            </Box>
                                                                                        }
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
                                    <Person 
                                        sx={{ 
                                            fontSize: 64, 
                                            color: 'text.secondary', 
                                            mb: 2,
                                            opacity: 0.5 
                                        }} 
                                    />
                                    <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
                                        Nenhum usuário encontrado
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
                                        Não há usuários que correspondam aos filtros aplicados.
                                    </Typography>
                                </Box>
                            )}
                        </Paper>

                {/* Controles de Paginação */}
                {totalUsers > 0 && (
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
                                    value={pageSize}
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
                            <Box>
                                {totalPages >= 1 ? (
                                    <Pagination
                                        count={totalPages}
                                        page={page}
                                        onChange={handlePageChange}
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
                                ) : (
                                    <Typography variant="caption" color="text.secondary">
                                        Nenhuma paginação necessária
                                    </Typography>
                                )}
                            </Box>

                                                        {/* Informações de paginação */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Página {page} de {totalPages} • {totalUsers} usuários total
                                </Typography>
                            </Box> 
                        </Stack>
                    </Paper>
                )}

                    </Box>
                </Fade>
            </Container>

            {/* Dialog de Confirmação */}
            <Dialog
                open={confirmDialog.open}
                onClose={closeConfirmDialog}
                maxWidth="sm"
                fullWidth
                slotProps={{
                    paper: {
                        sx: { 
                            borderRadius: 3,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                        }
                    }
                }}
            >
                <DialogTitle sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 3,
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: `${confirmDialog.color}.main`
                }}>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: `${confirmDialog.color}.100`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        ⚠️
                    </Box>
                    {confirmDialog.title}
                </DialogTitle>
                
                <DialogContent sx={{ pt: 2, pb: 3 }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
                        {confirmDialog.message}
                    </Typography>
                </DialogContent>
                
                <DialogActions sx={{ 
                    p: 3, 
                    gap: 2,
                    borderTop: '1px solid',
                    borderColor: 'grey.200'
                }}>
                    <Button 
                        onClick={closeConfirmDialog}
                        variant="outlined"
                        size="large"
                        sx={{ 
                            borderRadius: 2,
                            px: 3,
                            py: 1.5,
                            fontWeight: 600
                        }}
                    >
                        Cancelar
                    </Button>
                    
                    <Button
                        onClick={confirmDialog.onConfirm}
                        variant="contained"
                        color={confirmDialog.color}
                        size="large"
                        disabled={loadingConfirm}
                        startIcon={loadingConfirm ? <CircularProgress size={16} sx={{ color: 'white' }} /> : null}
                        sx={{ 
                            borderRadius: 2,
                            px: 3,
                            py: 1.5,
                            fontWeight: 600,
                            boxShadow: confirmDialog.color === 'info' 
                                ? '0 4px 15px rgba(33, 150, 243, 0.4)' 
                                : '0 4px 15px rgba(244, 67, 54, 0.4)',
                            '&:hover': {
                                boxShadow: confirmDialog.color === 'info' 
                                    ? '0 6px 20px rgba(33, 150, 243, 0.6)' 
                                    : '0 6px 20px rgba(244, 67, 54, 0.6)',
                                transform: 'translateY(-1px)'
                            }
                        }}
                    >
                        {loadingConfirm ? 'Carregando...' : 'Confirmar'}
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

export default AdminUsersPage;
