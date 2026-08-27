import React from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Stack,
    useTheme,
    useMediaQuery,
    Fade,
    Grow,
    Divider
} from '@mui/material';
import {
    CalendarToday as CalendarIcon,
    AccessTime as TimeIcon,
    LocationOn as LocationIcon,
    ShoppingBag as ShoppingIcon,
    Payment as PaymentIcon,
    LocalFlorist as FloristIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const InvitePage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #fdfbf7 0%, #f8f4e6 30%, #f5f0e1 70%, #f0e6d2 100%)',
                position: 'relative',
                py: { xs: 3, md: 6 },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `
                        radial-gradient(circle at 20% 20%, rgba(218, 165, 32, 0.03) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(218, 165, 32, 0.02) 0%, transparent 50%),
                        radial-gradient(circle at 40% 60%, rgba(212, 175, 55, 0.015) 0%, transparent 50%)
                    `,
                    zIndex: 1
                }
            }}
        >
            {/* Decorative floral elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 50,
                    left: 50,
                    width: 100,
                    height: 100,
                    opacity: 0.1,
                    transform: 'rotate(-15deg)',
                    zIndex: 1
                }}
            >
                <FloristIcon sx={{ fontSize: 100, color: '#daa520' }} />
            </Box>
            <Box
                sx={{
                    position: 'absolute',
                    top: 100,
                    right: 80,
                    width: 120,
                    height: 120,
                    opacity: 0.08,
                    transform: 'rotate(25deg)',
                    zIndex: 1
                }}
            >
                <FloristIcon sx={{ fontSize: 120, color: '#b8860b' }} />
            </Box>
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 150,
                    left: 80,
                    width: 80,
                    height: 80,
                    opacity: 0.06,
                    transform: 'rotate(45deg)',
                    zIndex: 1
                }}
            >
                <FloristIcon sx={{ fontSize: 80, color: '#daa520' }} />
            </Box>

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                {/* Hero Section */}
                <Fade in timeout={1000}>
                    <Box
                        sx={{
                            textAlign: 'center',
                            mb: 8,
                            py: { xs: 6, md: 10 },
                            position: 'relative'
                        }}
                    >
                        {/* Decorative border */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 20,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: { xs: 280, md: 400 },
                                height: 2,
                                background: 'linear-gradient(90deg, transparent 0%, #daa520 20%, #b8860b 50%, #daa520 80%, transparent 100%)',
                                opacity: 0.6
                            }}
                        />
                        
                        <Typography
                            variant={isMobile ? "h3" : "h2"}
                            sx={{
                                fontFamily: "'Playfair Display', serif",
                                fontWeight: 400,
                                color: '#8b4513',
                                mb: 1,
                                letterSpacing: '0.02em',
                                textShadow: '0 2px 4px rgba(139, 69, 19, 0.1)'
                            }}
                        >
                            Chá de Casa Nova
                        </Typography>
                        
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 3,
                                gap: 2
                            }}
                        >
                            <FloristIcon sx={{ fontSize: 24, color: '#daa520', transform: 'rotate(-15deg)' }} />
                            <Box
                                sx={{
                                    width: 80,
                                    height: 1,
                                    bgcolor: '#daa520',
                                    opacity: 0.7
                                }}
                            />
                            <FloristIcon sx={{ fontSize: 24, color: '#daa520', transform: 'rotate(15deg)' }} />
                        </Box>
                        
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: "'Playfair Display', serif",
                                fontWeight: 300,
                                fontStyle: 'italic',
                                color: '#a0522d',
                                maxWidth: 600,
                                mx: 'auto',
                                lineHeight: 1.8,
                                fontSize: { xs: '1.1rem', md: '1.3rem' }
                            }}
                        >
                            "Você está cordialmente convidado(a) para celebrar conosco 
                            esta nova etapa da nossa vida"
                        </Typography>
                        
                        {/* Bottom decorative border */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 20,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: { xs: 280, md: 400 },
                                height: 2,
                                background: 'linear-gradient(90deg, transparent 0%, #daa520 20%, #b8860b 50%, #daa520 80%, transparent 100%)',
                                opacity: 0.6
                            }}
                        />
                    </Box>
                </Fade>

                {/* Event Details */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
                    <Grid container spacing={4} sx={{ maxWidth: 1200 }}>
                        <Grid size={{xs: 12, md: 4}}>
                            <Grow in timeout={1200}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        textAlign: 'center',
                                        minHeight: '280px',
                                        minWidth: '200px',
                                        p: 4,
                                        background: 'linear-gradient(135deg, #fefdfb 0%, #faf8f3 100%)',
                                        border: '2px solid #f4e4bc',
                                        borderRadius: 4,
                                        position: 'relative',
                                        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                        '&:hover': {
                                            transform: 'translateY(-8px) scale(1.02)',
                                            boxShadow: '0 20px 40px rgba(218, 165, 32, 0.2)',
                                            borderColor: '#daa520'
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: -2,
                                            left: -2,
                                            right: -2,
                                            bottom: -2,
                                            background: 'linear-gradient(45deg, #daa520, #b8860b, #daa520)',
                                            borderRadius: 4,
                                            zIndex: -1,
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease'
                                        },
                                        '&:hover::before': {
                                            opacity: 0.3
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #daa520, #b8860b)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 3,
                                            boxShadow: '0 8px 20px rgba(218, 165, 32, 0.3)'
                                        }}
                                    >
                                        <CalendarIcon sx={{ fontSize: 32, color: 'white' }} />
                                    </Box>
                                    <Typography variant="h6" sx={{ 
                                        fontFamily: "'Playfair Display', serif",
                                        fontWeight: 600, 
                                        mb: 2, 
                                        color: '#8b4513',
                                        letterSpacing: '0.5px'
                                    }}>
                                        Data
                                    </Typography>
                                    <Typography variant="h4" sx={{ 
                                        fontFamily: "'Playfair Display', serif",
                                        fontWeight: 400, 
                                        color: '#daa520',
                                        mb: 1,
                                        textShadow: '0 2px 4px rgba(218, 165, 32, 0.2)'
                                    }}>
                                        11/10
                                    </Typography>
                                    <Typography variant="h6" sx={{ 
                                        color: '#a0522d', 
                                        fontFamily: "'Playfair Display', serif",
                                        fontStyle: 'italic'
                                    }}>
                                        2026
                                    </Typography>
                                </Card>
                            </Grow>
                        </Grid>

                        <Grid size={{xs: 12, md: 4}}>
                            <Grow in timeout={1400}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        textAlign: 'center',
                                        p: 4,
                                        minHeight: '280px',
                                        minWidth: '200px',
                                        background: 'linear-gradient(135deg, #fefdfb 0%, #faf8f3 100%)',
                                        border: '2px solid #f4e4bc',
                                        borderRadius: 4,
                                        position: 'relative',
                                        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                        '&:hover': {
                                            transform: 'translateY(-8px) scale(1.02)',
                                            boxShadow: '0 20px 40px rgba(218, 165, 32, 0.2)',
                                            borderColor: '#daa520'
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: -2,
                                            left: -2,
                                            right: -2,
                                            bottom: -2,
                                            background: 'linear-gradient(45deg, #daa520, #b8860b, #daa520)',
                                            borderRadius: 4,
                                            zIndex: -1,
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease'
                                        },
                                        '&:hover::before': {
                                            opacity: 0.3
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #daa520, #b8860b)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 3,
                                            boxShadow: '0 8px 20px rgba(218, 165, 32, 0.3)'
                                        }}
                                    >
                                        <TimeIcon sx={{ fontSize: 32, color: 'white' }} />
                                    </Box>
                                    <Typography variant="h6" sx={{ 
                                        fontFamily: "'Playfair Display', serif",
                                        fontWeight: 600, 
                                        mb: 2, 
                                        color: '#8b4513',
                                        letterSpacing: '0.5px'
                                    }}>
                                        Horário
                                    </Typography>
                                    <Typography variant="h4" sx={{ 
                                        fontFamily: "'Playfair Display', serif",
                                        fontWeight: 400, 
                                        color: '#daa520',
                                        mb: 1,
                                        textShadow: '0 2px 4px rgba(218, 165, 32, 0.2)'
                                    }}>
                                        12:00
                                    </Typography>
                                    <Typography variant="h6" sx={{ 
                                        color: '#a0522d', 
                                        fontFamily: "'Playfair Display', serif",
                                        fontStyle: 'italic'
                                    }}>
                                        da manhã    
                                    </Typography>
                                </Card>
                            </Grow>
                        </Grid>

                        <Grid size={{xs: 12, md: 4}}>
                            <Grow in timeout={1600}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        textAlign: 'center',
                                        p: 4,
                                        minHeight: '280px',
                                        minWidth: '200px',
                                        background: 'linear-gradient(135deg, #fefdfb 0%, #faf8f3 100%)',
                                        border: '2px solid #f4e4bc',
                                        borderRadius: 4,
                                        position: 'relative',
                                        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                        '&:hover': {
                                            transform: 'translateY(-8px) scale(1.02)',
                                            boxShadow: '0 20px 40px rgba(218, 165, 32, 0.2)',
                                            borderColor: '#daa520'
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: -2,
                                            left: -2,
                                            right: -2,
                                            bottom: -2,
                                            background: 'linear-gradient(45deg, #daa520, #b8860b, #daa520)',
                                            borderRadius: 4,
                                            zIndex: -1,
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease'
                                        },
                                        '&:hover::before': {
                                            opacity: 0.3
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #daa520, #b8860b)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 3,
                                            boxShadow: '0 8px 20px rgba(218, 165, 32, 0.3)'
                                        }}
                                    >
                                        <LocationIcon sx={{ fontSize: 32, color: 'white' }} />
                                    </Box>
                                    <Typography variant="h6" sx={{ 
                                        fontFamily: "'Playfair Display', serif",
                                        fontWeight: 600, 
                                        mb: 2, 
                                        color: '#8b4513',
                                        letterSpacing: '0.5px'
                                    }}>
                                        Local
                                    </Typography>
                                    <Typography variant="body1" sx={{ 
                                        fontFamily: "'Playfair Display', serif",
                                        fontWeight: 400, 
                                        color: '#daa520', 
                                        lineHeight: 1.6,
                                        fontSize: '1.1rem',
                                        mb: 1
                                    }}>
                                        Rua Antônio Manosso, 1220
                                    </Typography>
                                    <Typography variant="body2" sx={{ 
                                        color: '#a0522d', 
                                        fontFamily: "'Playfair Display', serif",
                                        fontStyle: 'italic',
                                        fontSize: '0.95rem'
                                    }}>
                                        Campo Magro - PR
                                    </Typography>
                                </Card>
                            </Grow>
                        </Grid>
                    </Grid>
                </Box>

                {/* RSVP Section */}
                <Fade in timeout={1800}>
                    <Card
                        elevation={0}
                        sx={{
                            background: 'linear-gradient(135deg, #fefdfb 0%, #faf8f3 100%)',
                            border: '3px solid #f4e4bc',
                            borderRadius: 6,
                            mb: 6,
                            overflow: 'hidden',
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 6,
                                background: 'linear-gradient(90deg, #daa520, #b8860b, #daa520)',
                            }
                        }}
                    >
                        <Box
                            sx={{
                                background: 'linear-gradient(135deg, #daa520 0%, #b8860b 50%, #daa520 100%)',
                                color: 'white',
                                p: 5,
                                textAlign: 'center',
                                position: 'relative',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -1,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 0,
                                    height: 0,
                                    borderLeft: '20px solid transparent',
                                    borderRight: '20px solid transparent',
                                    borderTop: '20px solid #b8860b',
                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                                }
                            }}
                        >
                            <FloristIcon sx={{ fontSize: 40, mb: 2, opacity: 0.9 }} />
                            <Typography variant="h4" sx={{ 
                                fontFamily: "'Playfair Display', serif",
                                fontWeight: 400, 
                                mb: 3,
                                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}>
                                Confirmação de Presença
                            </Typography>
                            <Typography variant="h6" sx={{ 
                                opacity: 0.95, 
                                maxWidth: 600, 
                                mx: 'auto',
                                fontFamily: "'Playfair Display', serif",
                                fontWeight: 300,
                                fontStyle: 'italic',
                                lineHeight: 1.7
                            }}>
                                Para confirmar sua presença, realize uma compra de presentes 
                                no valor mínimo de R$ 100,00
                            </Typography>
                        </Box>
                        
                        <CardContent sx={{ p: 6 }}>
                            <Grid container spacing={6} alignItems="center">
                                <Grid size={{xs: 12, md: 6}}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Box
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #daa520, #b8860b)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 3,
                                                boxShadow: '0 12px 30px rgba(218, 165, 32, 0.3)',
                                                position: 'relative',
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    inset: '4px',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))'
                                                }
                                            }}
                                        >
                                            <ShoppingIcon sx={{ fontSize: 40, color: 'white', zIndex: 1 }} />
                                        </Box>
                                        <Typography variant="h5" sx={{ 
                                            fontFamily: "'Playfair Display', serif",
                                            fontWeight: 600, 
                                            mb: 3, 
                                            color: '#8b4513',
                                            letterSpacing: '0.5px'
                                        }}>
                                            Valor Mínimo
                                        </Typography>
                                        <Typography variant="h3" sx={{ 
                                            fontFamily: "'Playfair Display', serif",
                                            fontWeight: 700, 
                                            color: '#daa520', 
                                            mb: 2,
                                            textShadow: '0 2px 8px rgba(218, 165, 32, 0.3)'
                                        }}>
                                            R$ 100,00
                                        </Typography>
                                        <Typography variant="body1" sx={{ 
                                            color: '#a0522d',
                                            fontFamily: "'Playfair Display', serif",
                                            fontStyle: 'italic'
                                        }}>
                                            em produtos da lista
                                        </Typography>
                                    </Box>
                                </Grid>
                                
                                <Grid size={{xs: 12, md: 6}}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Box
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #daa520, #b8860b)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 3,
                                                boxShadow: '0 12px 30px rgba(218, 165, 32, 0.3)',
                                                position: 'relative',
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    inset: '4px',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))'
                                                }
                                            }}
                                        >
                                            <PaymentIcon sx={{ fontSize: 40, color: 'white', zIndex: 1 }} />
                                        </Box>
                                        <Typography variant="h5" sx={{ 
                                            fontFamily: "'Playfair Display', serif",
                                            fontWeight: 600, 
                                            mb: 3, 
                                            color: '#8b4513',
                                            letterSpacing: '0.5px'
                                        }}>
                                            Formas de Pagamento
                                        </Typography>
                                        <Typography variant="h6" sx={{ 
                                            color: '#daa520', 
                                            mb: 2,
                                            fontFamily: "'Playfair Display', serif",
                                            fontWeight: 500
                                        }}>
                                            PIX
                                        </Typography>
                                        <Typography variant="body1" sx={{ 
                                            color: '#a0522d',
                                            fontFamily: "'Playfair Display', serif",
                                            fontStyle: 'italic'
                                        }}>
                                            Pagamento seguro e fácil
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                            
                            <Box
                                sx={{
                                    mt: 6,
                                    p: 4,
                                    background: 'linear-gradient(135deg, #f9f6f0 0%, #f5f0e1 100%)',
                                    border: '2px solid #f4e4bc',
                                    borderRadius: 4,
                                    textAlign: 'center',
                                    position: 'relative',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: -8,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: 0,
                                        height: 0,
                                        borderLeft: '12px solid transparent',
                                        borderRight: '12px solid transparent',
                                        borderBottom: '12px solid #f4e4bc',
                                    }
                                }}
                            >
                                <FloristIcon sx={{ fontSize: 28, color: '#daa520', mb: 2, opacity: 0.7 }} />
                                <Typography variant="h6" sx={{ 
                                    fontFamily: "'Playfair Display', serif",
                                    fontWeight: 600, 
                                    color: '#8b4513', 
                                    mb: 2,
                                    letterSpacing: '0.5px'
                                }}>
                                    Prazo para Confirmação
                                </Typography>
                                <Typography variant="h5" sx={{ 
                                    fontFamily: "'Playfair Display', serif",
                                    fontWeight: 500, 
                                    color: '#daa520',
                                    textShadow: '0 1px 3px rgba(218, 165, 32, 0.2)'
                                }}>
                                    Até 25 de Setembro de 2026
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Fade>

                {/* Action Buttons */}
                <Fade in timeout={2000}>
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={4}
                        justifyContent="center"
                        sx={{ mb: 8 }}
                    >
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/')}
                            sx={{
                                px: 8,
                                py: 3,
                                fontSize: '1.1rem',
                                fontFamily: "'Playfair Display', serif",
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #daa520 0%, #b8860b 50%, #daa520 100%)',
                                color: 'white',
                                borderRadius: 8,
                                textTransform: 'none',
                                letterSpacing: '0.5px',
                                boxShadow: '0 8px 30px rgba(218, 165, 32, 0.4)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: '-100%',
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                    transition: 'left 0.6s',
                                },
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #b8860b 0%, #996515 50%, #b8860b 100%)',
                                    transform: 'translateY(-3px) scale(1.02)',
                                    boxShadow: '0 15px 40px rgba(218, 165, 32, 0.5)',
                                    '&::before': {
                                        left: '100%',
                                    }
                                },
                                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                            }}
                        >
                            <FloristIcon sx={{ mr: 2, fontSize: 24 }} />
                            Ver Lista de Presentes
                        </Button>
                        
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/cart')}
                            sx={{
                                px: 8,
                                py: 3,
                                fontSize: '1.1rem',
                                fontFamily: "'Playfair Display', serif",
                                fontWeight: 600,
                                borderColor: '#daa520',
                                color: '#daa520',
                                borderRadius: 8,
                                textTransform: 'none',
                                borderWidth: 2,
                                letterSpacing: '0.5px',
                                background: 'rgba(218, 165, 32, 0.05)',
                                '&:hover': {
                                    borderColor: '#daa520',
                                    background: 'linear-gradient(135deg, #daa520 0%, #b8860b 100%)',
                                    color: 'white',
                                    transform: 'translateY(-3px) scale(1.02)',
                                    boxShadow: '0 15px 40px rgba(218, 165, 32, 0.4)',
                                    borderWidth: 2
                                },
                                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                            }}
                        >
                            <ShoppingIcon sx={{ mr: 2, fontSize: 24 }} />
                            Meu Carrinho
                        </Button>
                    </Stack>
                </Fade>

                {/* Footer Message */}
                <Fade in timeout={2200}>
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 6,
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: { xs: 200, md: 300 },
                                height: 2,
                                background: 'linear-gradient(90deg, transparent 0%, #daa520 20%, #b8860b 50%, #daa520 80%, transparent 100%)',
                                opacity: 0.4
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4, mt: 2 }}>
                            <FloristIcon sx={{ fontSize: 32, color: '#daa520', mx: 2, transform: 'rotate(-20deg)', opacity: 0.7 }} />
                            <Typography
                                variant="h4"
                                sx={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontWeight: 400,
                                    color: '#8b4513',
                                    mx: 3,
                                    textShadow: '0 2px 4px rgba(139, 69, 19, 0.1)'
                                }}
                            >
                                Contamos com sua presença
                            </Typography>
                            <FloristIcon sx={{ fontSize: 32, color: '#daa520', mx: 2, transform: 'rotate(20deg)', opacity: 0.7 }} />
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#a0522d',
                                fontFamily: "'Playfair Display', serif",
                                fontStyle: 'italic',
                                fontWeight: 300,
                                maxWidth: 600,
                                mx: 'auto',
                                lineHeight: 1.8,
                                px: 2,
                                position: 'relative',
                            }}
                        >
                            Uma casa se torna um lar quando é preenchida com amor, 
                            risadas e as pessoas que mais amamos
                        </Typography>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default InvitePage;
