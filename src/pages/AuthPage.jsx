import React, { useState } from 'react';
import {
    Container,
    Paper,
    Box,
    Typography,
    TextField,
    Button,
    Divider,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
    useTheme,
    useMediaQuery,
    Fade,
    Slide
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Person,
    Email,
    Phone,
    Lock,
    Home
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../hooks/useCart';

const AuthPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register } = useAuth();
    const { totalItems } = useCart();

    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Handlers de navegação
    const handleLogoutClick = () => {
        navigate('/auth');
    };

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: ''
    });

    const [formErrors, setFormErrors] = useState({});

    const validateForm = () => {
        const errors = {};

        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            errors.email = 'Email é obrigatório';
        } else if (!emailRegex.test(formData.email)) {
            errors.email = 'Email inválido';
        }

        // Validação de senha
        if (!formData.password) {
            errors.password = 'Senha é obrigatória';
        } else if (formData.password.length < 6) {
            errors.password = 'Senha deve ter pelo menos 6 caracteres';
        }

        // Validações específicas para cadastro
        if (!isLogin) {
            if (!formData.firstName.trim()) {
                errors.firstName = 'Primeiro nome é obrigatório';
            }
            if (!formData.lastName.trim()) {
                errors.lastName = 'Último nome é obrigatório';
            }
            
            const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
            if (!formData.phone) {
                errors.phone = 'Telefone é obrigatório';
            } else if (!phoneRegex.test(formData.phone)) {
                errors.phone = 'Formato: (11) 99999-9999';
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Limpar erro do campo quando o usuário começar a digitar
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const formatPhone = (value) => {
        // Remove todos os caracteres não numéricos
        const cleaned = value.replace(/\D/g, '');
        
        // Aplica a máscara (11) 99999-9999
        if (cleaned.length <= 2) {
            return cleaned;
        } else if (cleaned.length <= 7) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
        } else {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
        }
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhone(e.target.value);
        handleInputChange('phone', formatted);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                setSuccess('Login realizado com sucesso!');
                
                // Redirecionar para a página original ou home
                const from = location.state?.from?.pathname || '/';
                setTimeout(() => navigate(from), 1000);
            } else {
                await register(formData);
                setSuccess('Cadastro realizado com sucesso!');
                setTimeout(() => navigate('/'), 1000);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setSuccess('');
        setFormErrors({});
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: ''
        });
    };

    return (
        <>
            <Header
                cartItemCount={totalItems}
                currentPage="auth"
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
            <Box
                sx={{
                    minHeight: 'calc(100vh - 80px)', // Ajusta para compensar a altura do header
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 4,
                    px: 2,
                }}
            >
                <Container maxWidth="sm">
                    <Slide direction="up" in={true} timeout={600}>
                        <Paper
                            elevation={24}
                            sx={{
                                p: isMobile ? 3 : 5,
                                borderRadius: 4,
                                background: 'rgba(255, 255, 255, 0.98)',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                }
                            }}
                        >
                            {/* Header */}
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Box
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 70,
                                        height: 70,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        mb: 3,
                                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                                        position: 'relative',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            inset: '3px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                                        }
                                    }}
                                >
                                    <Home sx={{ color: 'white', fontSize: 32, zIndex: 1 }} />
                                </Box>
                                <Typography
                                    variant="h4"
                                    component="h1"
                                    sx={{
                                        fontWeight: 700,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: 1,
                                        fontSize: isMobile ? '2rem' : '2.5rem',
                                        letterSpacing: '-0.5px'
                                    }}
                                >
                                    {isLogin ? 'Bem-vindo de volta!' : 'Criar Conta'}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: '1.1rem',
                                        fontWeight: 400
                                    }}
                                >
                                    {isLogin ? 'Entre na sua conta para continuar' : 'Cadastre-se para ter acesso completo'}
                                </Typography>
                            </Box>

                            {/* Alerts */}
                            <Fade in={!!error || !!success}>
                                <Box sx={{ mb: 3 }}>
                                    {error && (
                                        <Alert 
                                            severity="error" 
                                            sx={{ 
                                                mb: 2, 
                                                borderRadius: 3,
                                                border: '1px solid #ffebee',
                                                '& .MuiAlert-icon': {
                                                    fontSize: '1.5rem'
                                                }
                                            }}
                                            onClose={() => setError('')}
                                        >
                                            {error}
                                        </Alert>
                                    )}

                                    {success && (
                                        <Alert 
                                            severity="success" 
                                            sx={{ 
                                                mb: 2, 
                                                borderRadius: 3,
                                                border: '1px solid #e8f5e8',
                                                '& .MuiAlert-icon': {
                                                    fontSize: '1.5rem'
                                                }
                                            }}
                                        >
                                            {success}
                                        </Alert>
                                    )}
                                </Box>
                            </Fade>

                        {/* Form */}
                        <Box component="form" onSubmit={handleSubmit}>
                            {/* Campos de Nome (apenas para cadastro) */}
                            {!isLogin && (
                                <Fade in={!isLogin} timeout={400}>
                                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                        <TextField
                                            fullWidth
                                            label="Primeiro Nome"
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            error={!!formErrors.firstName}
                                            helperText={formErrors.firstName}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                    backgroundColor: 'rgba(255,255,255,0.8)',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255,255,255,1)',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                                    },
                                                    '&.Mui-focused': {
                                                        backgroundColor: 'rgba(255,255,255,1)',
                                                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)'
                                                    }
                                                }
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Último Nome"
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            error={!!formErrors.lastName}
                                            helperText={formErrors.lastName}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                    backgroundColor: 'rgba(255,255,255,0.8)',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255,255,255,1)',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                                    },
                                                    '&.Mui-focused': {
                                                        backgroundColor: 'rgba(255,255,255,1)',
                                                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)'
                                                    }
                                                }
                                            }}
                                        />
                                    </Box>
                                </Fade>
                            )}

                            {/* Email */}
                            <TextField
                                fullWidth
                                label="E-mail"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                error={!!formErrors.email}
                                helperText={formErrors.email}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        backgroundColor: 'rgba(255,255,255,0.8)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,1)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: 'rgba(255,255,255,1)',
                                            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)'
                                        }
                                    }
                                }}
                            />

                            {/* Telefone (apenas para cadastro) */}
                            {!isLogin && (
                                <Fade in={!isLogin} timeout={500}>
                                    <TextField
                                        fullWidth
                                        label="Telefone"
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        error={!!formErrors.phone}
                                        helperText={formErrors.phone}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Phone sx={{ color: 'text.secondary' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            mb: 3,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                backgroundColor: 'rgba(255,255,255,0.8)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255,255,255,1)',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                                },
                                                '&.Mui-focused': {
                                                    backgroundColor: 'rgba(255,255,255,1)',
                                                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)'
                                                }
                                            }
                                        }}
                                    />
                                </Fade>
                            )}

                            {/* Senha */}
                            <TextField
                                fullWidth
                                label="Senha"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                error={!!formErrors.password}
                                helperText={formErrors.password}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(102, 126, 234, 0.04)'
                                                    }
                                                }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    mb: 4,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        backgroundColor: 'rgba(255,255,255,0.8)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,1)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: 'rgba(255,255,255,1)',
                                            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)'
                                        }
                                    }
                                }}
                            />

                            {/* Botão Submit */}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{
                                    py: 2,
                                    borderRadius: 3,
                                    fontWeight: 600,
                                    fontSize: '1.1rem',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    boxShadow: '0 8px 30px rgba(102, 126, 234, 0.3)',
                                    textTransform: 'none',
                                    letterSpacing: '0.5px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: '-100%',
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                        transition: 'left 0.5s',
                                    },
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                        boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                                        transform: 'translateY(-2px)',
                                        '&::before': {
                                            left: '100%',
                                        }
                                    },
                                    '&:disabled': {
                                        background: 'linear-gradient(135deg, #ccc 0%, #999 100%)',
                                        boxShadow: 'none',
                                        transform: 'none'
                                    },
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                {loading ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <CircularProgress size={24} color="inherit" />
                                        <Typography variant="inherit">
                                            {isLogin ? 'Entrando...' : 'Criando conta...'}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Typography variant="inherit">
                                        {isLogin ? 'Entrar' : 'Criar Conta'}
                                    </Typography>
                                )}
                            </Button>
                        </Box>

                        {/* Toggle entre Login/Cadastro */}
                        <Box sx={{ mt: 5 }}>
                            <Divider sx={{ mb: 4, '&::before, &::after': { borderColor: 'rgba(0,0,0,0.08)' } }}>
                                <Typography variant="body2" sx={{ 
                                    color: 'text.secondary',
                                    px: 2,
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    fontWeight: 500
                                }}>
                                    ou
                                </Typography>
                            </Divider>
                            
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body1" sx={{ 
                                    color: 'text.secondary', 
                                    mb: 2,
                                    fontWeight: 400 
                                }}>
                                    {isLogin ? 'Ainda não tem uma conta?' : 'Já possui uma conta?'}
                                </Typography>
                                <Button
                                    onClick={toggleMode}
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        borderRadius: 3,
                                        fontWeight: 600,
                                        px: 4,
                                        py: 1.5,
                                        borderColor: 'transparent',
                                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                        color: 'primary.main',
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        '&:hover': {
                                            borderColor: 'transparent',
                                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                                        },
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                >
                                    {isLogin ? 'Criar nova conta' : 'Fazer login'}
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Slide>
            </Container>
        </Box>
        </>
    );
};

export default AuthPage;
