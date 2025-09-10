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
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
                px: 2,
                background: 'linear-gradient(135deg, rgba(218, 165, 32, 0.03) 0%, rgba(139, 69, 19, 0.05) 25%, rgba(184, 134, 11, 0.03) 50%, rgba(205, 133, 63, 0.04) 75%, rgba(218, 165, 32, 0.02) 100%)',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 30% 20%, rgba(218, 165, 32, 0.08) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(139, 69, 19, 0.06) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }
            }}
        >
                <Container maxWidth="sm">
                    <Slide direction="up" in={true} timeout={600}>
                        <Paper
                            elevation={24}
                            sx={{
                                p: 5,
                                borderRadius: '20px',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 25px 80px rgba(218, 165, 32, 0.15), 0 15px 40px rgba(139, 69, 19, 0.1)',
                                border: '2px solid linear-gradient(135deg, #daa520, #b8860b)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px'
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
                                        background: 'linear-gradient(135deg, #daa520 0%, #b8860b 100%)',
                                        mb: 3,
                                        boxShadow: '0 12px 35px rgba(218, 165, 32, 0.3)',
                                        position: 'relative',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            inset: '3px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
                                        }
                                    }}
                                >
                                    <Home sx={{ color: 'white', fontSize: 32, zIndex: 1 }} />
                                </Box>
                                <Typography
                                    variant="h4"
                                    component="h1"
                                    sx={{
                                        fontFamily: "'Playfair Display', serif",
                                        fontWeight: 400,
                                        background: 'linear-gradient(135deg, #daa520 0%, #b8860b 50%, #cd853f 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: 1,
                                        fontSize: isMobile ? '2rem' : '2.5rem',
                                        letterSpacing: '1px',
                                        textShadow: '0 2px 4px rgba(218, 165, 32, 0.1)'
                                    }}
                                >
                                    {isLogin ? 'Bem-vindo de volta!' : 'Criar Conta'}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontFamily: "'Playfair Display', serif",
                                        fontWeight: 300,
                                        fontStyle: 'italic',
                                        color: '#ab7f19ff',
                                        fontSize: '1.1rem',
                                        letterSpacing: '0.5px'
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
                                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                                    border: '1px solid rgba(218, 165, 32, 0.1)',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255,255,255,1)',
                                                        borderColor: 'rgba(218, 165, 32, 0.3)',
                                                        boxShadow: '0 4px 15px rgba(218, 165, 32, 0.1)'
                                                    },
                                                    '&.Mui-focused': {
                                                        backgroundColor: 'rgba(255,255,255,1)',
                                                        borderColor: '#daa520',
                                                        boxShadow: '0 4px 20px rgba(218, 165, 32, 0.2)'
                                                    }
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontFamily: "'Playfair Display', serif",
                                                    '&.Mui-focused': {
                                                        color: '#daa520'
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
                                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                                    border: '1px solid rgba(218, 165, 32, 0.1)',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255,255,255,1)',
                                                        borderColor: 'rgba(218, 165, 32, 0.3)',
                                                        boxShadow: '0 4px 15px rgba(218, 165, 32, 0.1)'
                                                    },
                                                    '&.Mui-focused': {
                                                        backgroundColor: 'rgba(255,255,255,1)',
                                                        borderColor: '#daa520',
                                                        boxShadow: '0 4px 20px rgba(218, 165, 32, 0.2)'
                                                    }
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontFamily: "'Playfair Display', serif",
                                                    '&.Mui-focused': {
                                                        color: '#daa520'
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
                                onChange={(e) => handleInputChange('email', e.target.value.toLowerCase())}
                                error={!!formErrors.email}
                                helperText={formErrors.email}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email sx={{ color: '#ab7f19ff' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        backgroundColor: 'rgba(255,255,255,0.9)',
                                        border: '1px solid rgba(218, 165, 32, 0.1)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,1)',
                                            borderColor: 'rgba(218, 165, 32, 0.3)',
                                            boxShadow: '0 4px 15px rgba(218, 165, 32, 0.1)'
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: 'rgba(255,255,255,1)',
                                            borderColor: '#daa520',
                                            boxShadow: '0 4px 20px rgba(218, 165, 32, 0.2)'
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontFamily: "'Playfair Display', serif",
                                        '&.Mui-focused': {
                                            color: '#daa520'
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
                                                    <Phone sx={{ color: '#ab7f19ff' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            mb: 3,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                backgroundColor: 'rgba(255,255,255,0.9)',
                                                border: '1px solid rgba(218, 165, 32, 0.1)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255,255,255,1)',
                                                    borderColor: 'rgba(218, 165, 32, 0.3)',
                                                    boxShadow: '0 4px 15px rgba(218, 165, 32, 0.1)'
                                                },
                                                '&.Mui-focused': {
                                                    backgroundColor: 'rgba(255,255,255,1)',
                                                    borderColor: '#daa520',
                                                    boxShadow: '0 4px 20px rgba(218, 165, 32, 0.2)'
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontFamily: "'Playfair Display', serif",
                                                '&.Mui-focused': {
                                                    color: '#daa520'
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
                                            <Lock sx={{ color: '#ab7f19ff' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(218, 165, 32, 0.08)'
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
                                        backgroundColor: 'rgba(255,255,255,0.9)',
                                        border: '1px solid rgba(218, 165, 32, 0.1)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,1)',
                                            borderColor: 'rgba(218, 165, 32, 0.3)',
                                            boxShadow: '0 4px 15px rgba(218, 165, 32, 0.1)'
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: 'rgba(255,255,255,1)',
                                            borderColor: '#daa520',
                                            boxShadow: '0 4px 20px rgba(218, 165, 32, 0.2)'
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontFamily: "'Playfair Display', serif",
                                        '&.Mui-focused': {
                                            color: '#daa520'
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
                                    borderRadius: '25px',
                                    fontFamily: "'Playfair Display', serif",
                                    fontWeight: 900,
                                    color: '#fff',
                                    fontSize: '1.2rem',
                                    background: 'linear-gradient(135deg, #daa520 0%, #b8860b 50%, #cd853f 100%)',
                                    boxShadow: '0 12px 40px rgba(218, 165, 32, 0.3)',
                                    textTransform: 'none',
                                    letterSpacing: '0.5px',
                                    border: '1px solid rgba(184, 134, 11, 0.3)',
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
                                        background: 'linear-gradient(135deg, #b8860b 0%, #cd853f 50%, #daa520 100%)',
                                        boxShadow: '0 16px 50px rgba(218, 165, 32, 0.4)',
                                        transform: 'translateY(-2px)',
                                        borderColor: 'rgba(218, 165, 32, 0.5)',
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
                                    fontFamily: "'Playfair Display', serif",
                                    color: '#ab7f19ff', 
                                    mb: 2,
                                    fontWeight: 300,
                                    fontStyle: 'italic'
                                }}>
                                    {isLogin ? 'Ainda não tem uma conta?' : 'Já possui uma conta?'}
                                </Typography>
                                <Button
                                    onClick={toggleMode}
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        borderRadius: '20px',
                                        fontFamily: "'Playfair Display', serif",
                                        fontWeight: 500,
                                        px: 4,
                                        py: 1.5,
                                        borderColor: 'transparent',
                                        background: 'linear-gradient(135deg, rgba(218, 165, 32, 0.1) 0%, rgba(184, 134, 11, 0.1) 100%)',
                                        color: '#daa520',
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        border: '1px solid rgba(218, 165, 32, 0.3)',
                                        '&:hover': {
                                            borderColor: 'rgba(218, 165, 32, 0.5)',
                                            background: 'linear-gradient(135deg, rgba(218, 165, 32, 0.15) 0%, rgba(184, 134, 11, 0.15) 100%)',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 6px 20px rgba(218, 165, 32, 0.2)'
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
    );
};

export default AuthPage;
