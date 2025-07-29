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

const AuthPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register } = useAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
        <Box
            sx={{
                minHeight: '100dvh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '10dvh',
                p: 2,
            }}
        >
            <Container maxWidth="sm" maxHeight="80dvh">
                <Slide direction="up" in={true} timeout={600}>
                    <Paper
                        elevation={24}
                        sx={{
                            p: isMobile ? 3 : 4,
                            borderRadius: 3,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        }}
                    >
                        {/* Header */}
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 60,
                                    height: 60,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    mb: 2
                                }}
                            >
                                <Home sx={{ color: 'white', fontSize: 28 }} />
                            </Box>
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    fontWeight: 700,
                                    color: '#212121',
                                    mb: 1,
                                    fontSize: isMobile ? '1.8rem' : '2.5rem'
                                }}
                            >
                                {isLogin ? 'Bem-vindo!' : 'Criar Conta'}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: '#666',
                                    fontSize: '1.1rem'
                                }}
                            >
                                {isLogin ? 'Entre na sua conta' : 'Cadastre-se para continuar'}
                            </Typography>
                        </Box>

                        {/* Alerts */}
                        {error && (
                            <Fade in={!!error}>
                                <Alert 
                                    severity="error" 
                                    sx={{ mb: 3, borderRadius: 2 }}
                                    onClose={() => setError('')}
                                >
                                    {error}
                                </Alert>
                            </Fade>
                        )}

                        {success && (
                            <Fade in={!!success}>
                                <Alert 
                                    severity="success" 
                                    sx={{ mb: 3, borderRadius: 2 }}
                                >
                                    {success}
                                </Alert>
                            </Fade>
                        )}

                        {/* Form */}
                        <Box component="form" onSubmit={handleSubmit}>
                            {/* Campos de Nome (apenas para cadastro) */}
                            {!isLogin && (
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
                                                borderRadius: 2
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
                                                borderRadius: 2
                                            }
                                        }}
                                    />
                                </Box>
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
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                            />

                            {/* Telefone (apenas para cadastro) */}
                            {!isLogin && (
                                <TextField
                                    fullWidth
                                    label="Telefone"
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                    error={!!formErrors.phone}
                                    helperText={formErrors.phone}
                                    variant="outlined"
                                    sx={{
                                        mb: 3,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                />
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
                                            <Lock sx={{ color: '#666' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    mb: 4,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
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
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    fontSize: '1.1rem',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                        boxShadow: '0 6px 25px rgba(102, 126, 234, 0.4)',
                                        transform: 'translateY(-2px)'
                                    },
                                    '&:disabled': {
                                        background: 'linear-gradient(135deg, #ccc 0%, #999 100%)',
                                        boxShadow: 'none'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    isLogin ? 'Entrar' : 'Criar Conta'
                                )}
                            </Button>
                        </Box>

                        {/* Toggle entre Login/Cadastro */}
                        <Box sx={{ mt: 4 }}>
                            <Divider sx={{ mb: 3 }}>
                                <Typography variant="body2" sx={{ color: '#666' }}>
                                    ou
                                </Typography>
                            </Divider>
                            
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                                    {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                                </Typography>
                                <Button
                                    onClick={toggleMode}
                                    variant="text"
                                    sx={{
                                        fontWeight: 600,
                                        color: theme.palette.primary.main,
                                        '&:hover': {
                                            backgroundColor: 'rgba(102, 126, 234, 0.04)'
                                        }
                                    }}
                                >
                                    {isLogin ? 'Criar conta' : 'Fazer login'}
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Slide>
            </Container>
        </Box>
    );
};

export default AuthPage;
