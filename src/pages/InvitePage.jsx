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
    Grow
} from '@mui/material';
import {
    CalendarToday as CalendarIcon,
    AccessTime as TimeIcon,
    LocationOn as LocationIcon,
    ShoppingBag as ShoppingIcon,
    Payment as PaymentIcon
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
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
                py: { xs: 3, md: 6 }
            }}
        >
            <Container maxWidth="lg">
                {/* Hero Section */}
                <Fade in timeout={1000}>
                    <Box
                        sx={{
                            textAlign: 'center',
                            mb: 8,
                            py: { xs: 6, md: 10 }
                        }}
                    >
                        <Typography
                            variant={isMobile ? "h3" : "h2"}
                            sx={{
                                fontWeight: 300,
                                color: '#0d47a1',
                                mb: 2,
                                letterSpacing: '0.02em'
                            }}
                        >
                            Chá de Casa Nova
                        </Typography>
                        
                        <Box
                            sx={{
                                width: 60,
                                height: 1,
                                bgcolor: '#1976d2',
                                mx: 'auto',
                                mb: 3
                            }}
                        />
                        
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 300,
                                color: '#42a5f5',
                                maxWidth: 600,
                                mx: 'auto',
                                lineHeight: 1.6
                            }}
                        >
                            Você está cordialmente convidado(a) para celebrar conosco 
                            esta nova etapa da nossa vida
                        </Typography>
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
                                        minHeight: '250px',
                                        minWidth: '200px',
                                        p: 4,
                                        border: '1px solid #e3f2fd',
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 10px 30px rgba(25, 118, 210, 0.15)'
                                        }
                                    }}
                                >
                                    <CalendarIcon sx={{ fontSize: 40, color: '#1976d2', mb: 2 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 500, mb: 1, color: '#1565c0' }}>
                                        Data
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 300, color: '#0d47a1' }}>
                                        15/11
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#64b5f6', mt: 1 }}>
                                        2025
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
                                        minHeight: '250px',
                                        minWidth: '200px',
                                        border: '1px solid #e3f2fd',
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 10px 30px rgba(25, 118, 210, 0.15)'
                                        }
                                    }}
                                >
                                    <TimeIcon sx={{ fontSize: 40, color: '#1976d2', mb: 2 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 500, mb: 1, color: '#1565c0' }}>
                                        Horário
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 300, color: '#0d47a1' }}>
                                        11:00
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#64b5f6', mt: 1 }}>
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
                                        minHeight: '250px',
                                        minWidth: '200px',
                                        border: '1px solid #e3f2fd',
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 10px 30px rgba(25, 118, 210, 0.15)'
                                        }
                                    }}
                                >
                                    <LocationIcon sx={{ fontSize: 40, color: '#1976d2', mb: 2 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 500, mb: 1, color: '#1565c0' }}>
                                        Local
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 400, color: '#0d47a1', lineHeight: 1.4 }}>
                                        Av. Jacob Macanhan, 3697
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#64b5f6', mt: 1 }}>
                                        Atuba, Pinhais - PR
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
                            border: '1px solid #e3f2fd',
                            borderRadius: 2,
                            mb: 6,
                            overflow: 'hidden'
                        }}
                    >
                        <Box
                            sx={{
                                bgcolor: '#1565c0',
                                color: 'white',
                                p: 4,
                                textAlign: 'center'
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 300, mb: 2 }}>
                                Confirmação de Presença
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
                                Para confirmar sua presença, realize uma compra de presentes no valor mínimo de R$ 100,00
                            </Typography>
                        </Box>
                        
                        <CardContent sx={{ p: 5 }}>
                            <Grid container spacing={4} alignItems="center">
                                <Grid size={{xs: 12, md: 6}}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <ShoppingIcon sx={{ fontSize: 50, color: '#1976d2', mb: 2 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, color: '#1565c0' }}>
                                            Valor Mínimo
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 300, color: '#1976d2', mb: 1 }}>
                                            R$ 100,00
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#64b5f6' }}>
                                            em produtos da lista
                                        </Typography>
                                    </Box>
                                </Grid>
                                
                                <Grid size={{xs: 12, md: 6}}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <PaymentIcon sx={{ fontSize: 50, color: '#1976d2', mb: 2 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, color: '#1565c0' }}>
                                            Formas de Pagamento
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#0d47a1', mb: 1 }}>
                                            PIX ou Cartão de Crédito
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#64b5f6' }}>
                                            Pagamento seguro e fácil
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                            
                            <Box
                                sx={{
                                    mt: 4,
                                    p: 3,
                                    bgcolor: '#e3f2fd',
                                    border: '1px solid #bbdefb',
                                    borderRadius: 2,
                                    textAlign: 'center'
                                }}
                            >
                                <Typography variant="body1" sx={{ fontWeight: 500, color: '#0d47a1', mb: 1 }}>
                                    Prazo para Confirmação
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 400, color: '#1565c0' }}>
                                    Até 14 de Novembro de 2025
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Fade>

                {/* Action Buttons */}
                <Fade in timeout={2000}>
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={3}
                        justifyContent="center"
                        sx={{ mb: 6 }}
                    >
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/')}
                            sx={{
                                px: 6,
                                py: 2,
                                fontSize: '1rem',
                                fontWeight: 500,
                                bgcolor: '#1976d2',
                                color: 'white',
                                borderRadius: 2,
                                textTransform: 'none',
                                boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
                                '&:hover': {
                                    bgcolor: '#1565c0',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 30px rgba(25, 118, 210, 0.4)',
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Ver Lista de Presentes
                        </Button>
                        
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/cart')}
                            sx={{
                                px: 6,
                                py: 2,
                                fontSize: '1rem',
                                fontWeight: 500,
                                borderColor: '#1976d2',
                                color: '#1976d2',
                                borderRadius: 2,
                                textTransform: 'none',
                                borderWidth: 2,
                                '&:hover': {
                                    borderColor: '#1976d2',
                                    bgcolor: '#1976d2',
                                    color: 'white',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 30px rgba(25, 118, 210, 0.3)',
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Meu Carrinho
                        </Button>
                    </Stack>
                </Fade>

                {/* Footer Message */}
                <Fade in timeout={2200}>
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 4,
                            borderTop: '1px solid #e3f2fd',
                            mt: 6
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 300,
                                color: '#1565c0',
                                mb: 2
                            }}
                        >
                            Contamos com sua presença
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#64b5f6',
                                fontStyle: 'italic',
                                maxWidth: 500,
                                mx: 'auto',
                                lineHeight: 1.6
                            }}
                        >
                            "Uma casa se torna um lar quando é preenchida com amor, 
                            risadas e as pessoas que mais amamos"
                        </Typography>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default InvitePage;
