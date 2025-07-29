import React, { useState } from 'react';
import {
    Container,
    Paper,
    Box,
    Typography,
    TextField,
    Avatar,
    Grid,
    Divider,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Switch,
    FormControlLabel,
    Chip,
    IconButton,
    Fade,
    Alert,
    Snackbar,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Person,
    Email,
    Phone,
    Edit,
    Save,
    Cancel,
    ShoppingBag,
    Notifications,
    Logout
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const AccountPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { totalItems } = useCart();

    const [editMode, setEditMode] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });

    // Dados simulados de pedidos
    const orderHistory = [
        {
            id: 'PED001',
            date: '2024-07-15',
            total: 299.90,
            status: 'Entregue',
            items: 3
        },
        {
            id: 'PED002',
            date: '2024-07-10',
            total: 159.50,
            status: 'Em trânsito',
            items: 2
        },
        {
            id: 'PED003',
            date: '2024-07-05',
            total: 89.90,
            status: 'Processando',
            items: 1
        }
    ];

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = () => {
        // Aqui você implementaria a lógica para salvar os dados
        setEditMode(false);
        setSnackbar({
            open: true,
            message: 'Dados atualizados com sucesso!',
            severity: 'success'
        });
    };

    const handleCancel = () => {
        setFormData({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            phone: user?.phone || ''
        });
        setEditMode(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Entregue': return 'success';
            case 'Em trânsito': return 'info';
            case 'Processando': return 'warning';
            default: return 'default';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <>
            <Header
                cartItemCount={totalItems}
                onCartClick={() => navigate('/cart')}
                onProductClick={() => navigate('/')}
                onAccountClick={() => navigate('/account')}
                onLogoutClick={handleLogout}
            />
            
            <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
                <Fade in timeout={800}>
                    <Box>
                        {/* Cabeçalho da página */}
                        <Box sx={{ 
                            mb: { xs: 3, md: 4 }, 
                            textAlign: 'center',
                            px: { xs: 1, sm: 2 }
                        }}>
                            <Typography
                                variant={isMobile ? "h4" : "h3"}
                                component="h1"
                                sx={{
                                    fontWeight: 300,
                                    color: theme.palette.text.primary,
                                    mb: 1,
                                    fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' }
                                }}
                            >
                                Minha Conta
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ 
                                    maxWidth: 600, 
                                    mx: 'auto',
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                    px: { xs: 2, sm: 0 }
                                }}
                            >
                                Gerencie suas informações pessoais e preferências
                            </Typography>
                        </Box>

                        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                            {/* Perfil do usuário */}
                            <Grid size={{ xs: 12, md: 4}}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: { xs: 2, sm: 3 },
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: 3,
                                        textAlign: 'center',
                                        height: 'fit-content',
                                        position: 'sticky',
                                        top: { xs: 'auto', lg: 24 }
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: { xs: 80, sm: 100 },
                                            height: { xs: 80, sm: 100 },
                                            mx: 'auto',
                                            mb: 2,
                                            bgcolor: theme.palette.primary.main,
                                            fontSize: { xs: '1.5rem', sm: '2rem' },
                                            fontWeight: 500
                                        }}
                                    >
                                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                    </Avatar>
                                    
                                    <Typography 
                                        variant={isSmall ? "h6" : "h5"} 
                                        gutterBottom
                                        sx={{ 
                                            fontWeight: 500,
                                            lineHeight: 1.2
                                        }}
                                    >
                                        {user?.firstName} {user?.lastName}
                                    </Typography>
                                    
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary" 
                                        sx={{ 
                                            mb: 3,
                                            fontSize: { xs: '0.75rem', sm: '0.875rem'
                                            }
                                        }}
                                    >
                                        Membro desde {formatDate(user?.createdAt || new Date())}
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    <List dense sx={{ px: 0 }}>
                                        <ListItem sx={{ px: 0, py: 1 }}>
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                <Email color="action" fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography
                                                        sx={{
                                                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                                            wordBreak: 'break-word'
                                                        }}
                                                    >
                                                        {user?.email}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography
                                                        sx={{
                                                            fontSize: { xs: '0.7rem', sm: '0.75rem' }
                                                        }}
                                                        color="text.secondary"
                                                    >
                                                        Email
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                        <ListItem sx={{ px: 0, py: 1 }}>
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                <Phone color="action" fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography
                                                        sx={{
                                                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                                        }}
                                                    >
                                                        {user?.phone || 'Não informado'}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography
                                                        sx={{
                                                            fontSize: { xs: '0.7rem', sm: '0.75rem' }
                                                        }}
                                                        color="text.secondary"
                                                    >
                                                        Telefone
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    </List>
                                </Paper>
                            </Grid>

                            {/* Informações pessoais e configurações */}
                            <Grid size={{ xs: 12, md: 8 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
                                    {/* Informações pessoais */}
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: { xs: 2, sm: 3 },
                                            border: `1px solid ${theme.palette.divider}`,
                                            borderRadius: 3
                                        }}
                                    >
                                        <Box sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center', 
                                            mb: 3,
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            gap: { xs: 2, sm: 0 }
                                        }}>
                                            <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                                                Informações Pessoais
                                            </Typography>
                                            {!editMode ? (
                                                <IconButton
                                                    onClick={() => setEditMode(true)}
                                                    color="primary"
                                                    size={isSmall ? "small" : "medium"}
                                                    sx={{
                                                        bgcolor: theme.palette.primary.main + '10',
                                                        '&:hover': {
                                                            bgcolor: theme.palette.primary.main + '20'
                                                        }
                                                    }}
                                                >
                                                    <Edit />
                                                </IconButton>
                                            ) : (
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <IconButton
                                                        onClick={handleSave}
                                                        color="primary"
                                                        size={isSmall ? "small" : "medium"}
                                                        sx={{
                                                            bgcolor: theme.palette.success.main + '10',
                                                            '&:hover': {
                                                                bgcolor: theme.palette.success.main + '20'
                                                            }
                                                        }}
                                                    >
                                                        <Save />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={handleCancel}
                                                        color="error"
                                                        size={isSmall ? "small" : "medium"}
                                                        sx={{
                                                            bgcolor: theme.palette.error.main + '10',
                                                            '&:hover': {
                                                                bgcolor: theme.palette.error.main + '20'
                                                            }
                                                        }}
                                                    >
                                                        <Cancel />
                                                    </IconButton>
                                                </Box>
                                            )}
                                        </Box>

                                        <Grid container spacing={{ xs: 2, sm: 3 }}>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Nome"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    disabled={!editMode}
                                                    variant="outlined"
                                                    size={isSmall ? "small" : "medium"}
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: <Person color="action" sx={{ mr: 1 }} />
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Sobrenome"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    disabled={!editMode}
                                                    variant="outlined"
                                                    size={isSmall ? "small" : "medium"}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    disabled={!editMode}
                                                    variant="outlined"
                                                    size={isSmall ? "small" : "medium"}
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: <Email color="action" sx={{ mr: 1 }} />
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Telefone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    disabled={!editMode}
                                                    variant="outlined"
                                                    size={isSmall ? "small" : "medium"}
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: <Phone color="action" sx={{ mr: 1 }} />
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>

                                    {/* Histórico de pedidos */}
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: { xs: 2, sm: 3 },
                                            border: `1px solid ${theme.palette.divider}`,
                                            borderRadius: 3
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ 
                                            mb: 3,
                                            fontSize: { xs: '1.1rem', sm: '1.25rem' }
                                        }}>
                                            Histórico de Pedidos
                                        </Typography>

                                        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                                            {orderHistory.map((order) => (
                                                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={order.id}>
                                                    <Card
                                                        variant="outlined"
                                                        sx={{
                                                            borderRadius: 2,
                                                            transition: 'all 0.2s ease',
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                borderColor: theme.palette.primary.main,
                                                                boxShadow: `0 4px 20px ${theme.palette.primary.main}20`,
                                                                transform: 'translateY(-2px)'
                                                            }
                                                        }}
                                                    >
                                                        <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
                                                            <Box sx={{ 
                                                                display: 'flex', 
                                                                justifyContent: 'space-between', 
                                                                alignItems: { xs: 'flex-start', sm: 'center' },
                                                                flexDirection: { xs: 'column', sm: 'row' },
                                                                gap: { xs: 2, sm: 1 }
                                                            }}>
                                                                <Box sx={{ flex: 1 }}>
                                                                    <Typography 
                                                                        variant="h6" 
                                                                        gutterBottom
                                                                        sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                                                                    >
                                                                        Pedido #{order.id}
                                                                    </Typography>
                                                                    <Typography 
                                                                        variant="body2" 
                                                                        color="text.secondary" 
                                                                        gutterBottom
                                                                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                                                    >
                                                                        {formatDate(order.date)} • {order.items} {order.items === 1 ? 'item' : 'itens'}
                                                                    </Typography>
                                                                    <Typography 
                                                                        variant="h6" 
                                                                        color="primary"
                                                                        sx={{ 
                                                                            fontSize: { xs: '1rem', sm: '1.25rem' },
                                                                            fontWeight: 600
                                                                        }}
                                                                    >
                                                                        {formatCurrency(order.total)}
                                                                    </Typography>
                                                                </Box>
                                                                <Chip
                                                                    label={order.status}
                                                                    color={getStatusColor(order.status)}
                                                                    variant="outlined"
                                                                    size={isSmall ? "small" : "medium"}
                                                                    sx={{ 
                                                                        fontWeight: 500,
                                                                        minWidth: { xs: 'auto', sm: 100 }
                                                                    }}
                                                                />
                                                            </Box>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>

                                        {orderHistory.length === 0 && (
                                            <Box sx={{ textAlign: 'center', py: { xs: 3, sm: 4 } }}>
                                                <ShoppingBag
                                                    sx={{ 
                                                        fontSize: { xs: 48, sm: 60 }, 
                                                        color: theme.palette.text.disabled, 
                                                        mb: 2 
                                                    }}
                                                />
                                                <Typography 
                                                    variant="h6" 
                                                    color="text.secondary"
                                                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                                                >
                                                    Nenhum pedido encontrado
                                                </Typography>
                                                <Typography 
                                                    variant="body2" 
                                                    color="text.disabled"
                                                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                                >
                                                    Você ainda não fez nenhum pedido
                                                </Typography>
                                            </Box>
                                        )}
                                    </Paper>
                                </Box>
                            </Grid>
                        </Grid>
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

export default AccountPage;
