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
    InputAdornment,
    Icon
} from '@mui/material';
import {
    Delete,
    Refresh,
    Person,
    AdminPanelSettings,
    CheckCircle,
    Search,
    ToggleOff,
    ToggleOn
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import api from '../services/api';

// Mock API - você pode substituir por chamadas reais para sua API
// Removido pois agora usamos o backend real

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const { logout } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();

    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const usersData = await api.users.getAllUsers();
            
            setUsers(usersData || []);
            setFilteredUsers(usersData || []);
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
    }, []);

    // Handlers de navegação
    const handleLogoutClick = () => {
        logout();
        navigate('/');
    };

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

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

        setFilteredUsers(filtered);
    }, [users, searchTerm, filterRole]);

    const handleToggleAdmin = async (userId, userName, currentIsAdmin) => {
        if (window.confirm(`Tem certeza que deseja ${currentIsAdmin ? 'remover' : 'adicionar'} privilégios de administrador para ${userName}?`)) {
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
            }
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`Tem certeza que deseja excluir o usuário ${userName}? Esta ação não pode ser desfeita.`)) {
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
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterRole('');
    };

    // Calcular estatísticas localmente
    const stats = {
        totalUsers: users.length,
        adminUsers: users.filter(user => user.isAdmin).length,
        regularUsers: users.filter(user => !user.isAdmin).length
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
            <Header
                cartItemCount={totalItems}
                currentPage="admin"
                onAlbumClick={() => navigate('/album')}
                onCartClick={() => navigate('/cart')}
                onLogoClick={() => navigate('/')}
                onProductClick={() => navigate('/products')}
                onAccountClick={() => navigate('/account')}
                onAdminClick={() => navigate('/admin')}
                onLogoutClick={handleLogoutClick}
                onLoginClick={() => navigate('/auth')}
                onFavoritesClick={() => navigate('/favorites')}
            />
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
                            <Grid item xs={12} sm={6} lg={3}>
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
                                                <Person sx={{ color: 'white', fontSize: 24 }} />
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                    {stats.totalUsers || 0}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Total de Usuários
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} lg={3}>
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
                                                    {stats.activeUsers || 0}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Usuários Ativos
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} lg={3}>
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

                            <Grid item xs={12} sm={6} lg={3}>
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
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{xs: 12, md: 3}}>
                                    <TextField
                                        fullWidth
                                        label="Buscar usuários"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Search />
                                                    </InputAdornment>
                                                ),
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid size={{xs: 12, sm: 6, md: 3}}>
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
                                <Grid size={{xs: 12, sm: 6, md: 3}}>
                                    
                                </Grid>
                                <Grid size={{xs: 12, md: 2}}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        onClick={clearFilters}
                                    >
                                        Limpar Filtros
                                    </Button>
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
                                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Ações</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredUsers.map((user) => (
                                                <TableRow key={user._id} hover>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar sx={{ mr: 2 }}>
                                                                {user.firstName.charAt(0).toUpperCase()}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                                    {user.firstName} {user.lastName}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    ID: {user._id}
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
                                                    <TableCell align="center">
                                                        <Tooltip title="Alterar Privilégios de Admin">
                                                            <IconButton
                                                                onClick={() => handleToggleAdmin(user._id)}
                                                                size="small"
                                                                color="info"
                                                            >
                                                                <AdminPanelSettings />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Excluir">
                                                            <IconButton
                                                                onClick={() => handleDeleteUser(user._id)}
                                                                size="small"
                                                                color="error"
                                                            >
                                                                <Delete />
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

export default AdminUsersPage;
