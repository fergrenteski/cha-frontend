import { useState } from 'react';
import {
    Container,
    Paper,
    Box,
    Typography,
    TextField,
    Avatar,
    Grid,
    IconButton,
    Alert,
    Snackbar,
    CircularProgress,
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
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { profileAPI } from '../services/api';
import UserOrders from '../components/UserOrders';

const AccountPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const { user, updateUser } = useAuth();

    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        // Validação básica
        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
            setSnackbar({
                open: true,
                message: 'Por favor, preencha todos os campos obrigatórios.',
                severity: 'error'
            });
            return;
        }

        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setSnackbar({
                open: true,
                message: 'Por favor, insira um email válido.',
                severity: 'error'
            });
            return;
        }

        setLoading(true);
        try {
            // Atualizar perfil via API
            const updatedUser = await profileAPI.updateProfile(formData);
            
            // Atualizar dados do usuário no contexto
            updateUser(updatedUser);
            
            setEditMode(false);
            setSnackbar({
                open: true,
                message: 'Dados atualizados com sucesso!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            setSnackbar({
                open: true,
                message: error.message || 'Erro ao atualizar dados. Tente novamente.',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    return (
        <>
            
            <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
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

                        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} height="100%">
                            {/* Perfil do usuário */}
                            <Grid size={{ xs: 12, md: 4}}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: { xs: 2, sm: 3 },
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: 3,
                                        textAlign: 'center',
                                        height: '100%',
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
                                            lineHeight: 1.2,
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
                                </Paper>
                            </Grid>

                            {/* Informações pessoais e configurações */}
                            <Grid size={{ xs: 12, md: 8 }}>
                                <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
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
                                                        disabled={loading}
                                                        sx={{
                                                            bgcolor: theme.palette.success.main + '10',
                                                            '&:hover': {
                                                                bgcolor: theme.palette.success.main + '20'
                                                            }
                                                        }}
                                                    >
                                                        {loading ? (
                                                            <CircularProgress size={20} color="inherit" />
                                                        ) : (
                                                            <Save />
                                                        )}
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={handleCancel}
                                                        color="error"
                                                        size={isSmall ? "small" : "medium"}
                                                        disabled={loading}
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
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Seção de Pedidos */}
                    <UserOrders />
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
