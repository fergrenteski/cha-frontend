import React from 'react';
import {
    Box,
    Container,
    Typography,
    IconButton,
    Divider,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Instagram as InstagramIcon,
    WhatsApp as WhatsAppIcon,
    Favorite as FavoriteIcon
} from '@mui/icons-material';

const Footer = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleInstagramClick = (profile) => {
        window.open(`https://instagram.com/${profile}`, '_blank');
    };

    return (
        <Box
            component="footer"
            sx={{
                mt: 4,
                py: { xs: 1, md: 2 },
                px: { xs: 1, md: 2 },
                backgroundColor: theme.palette.grey[50],
                borderTop: `1px solid ${theme.palette.divider}`,
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: { xs: 2, md: 0 }
                    }}
                >
                    {/* Seção de confirmação */}
                    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 600,
                                mb: 1,
                                fontSize: { xs: '1rem', md: '1.25rem' }
                            }}
                        >
                            Confirme sua presença!
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ mb: 2, maxWidth: { xs: '100%', md: '300px' } }}
                        >
                            Realize a compra dos presentes e confirme sua presença no nosso chá de casa nova!
                        </Typography>
                    </Box>

                    {/* Divisor */}
                    {!isMobile && (
                        <Divider 
                            orientation="vertical" 
                            flexItem 
                            sx={{ mx: 3, height: '100px', mt: 3 }} 
                        />
                    )}

                    {isMobile && <Divider sx={{ width: '100%', my: 1 }} />}

                    {/* Seção dos Instagrams */}
                    <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 600,
                                mb: 1,
                                fontSize: { xs: '1rem', md: '1.25rem' }
                            }}
                        >
                            Nos sigam no Instagram
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            Acompanhem nossa jornada
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-end' } }}>
                            {/* Instagram da Noiva */}
                            <Box sx={{ textAlign: 'center' }}>
                                <IconButton
                                    onClick={() => handleInstagramClick('anabeluzzo')}
                                    sx={{
                                        background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                                        color: 'white',
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                            boxShadow: '0 4px 20px rgba(188, 24, 136, 0.4)'
                                        },
                                        transition: 'all 0.3s ease',
                                        mb: 0.5
                                    }}
                                >
                                    <InstagramIcon />
                                </IconButton>
                                <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                                    @anabeluzzo
                                </Typography>
                            </Box>

                            {/* Instagram do Noivo */}
                            <Box sx={{ textAlign: 'center' }}>
                                <IconButton
                                    onClick={() => handleInstagramClick('fergrenteski')}
                                    sx={{
                                        background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                                        color: 'white',
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                            boxShadow: '0 4px 20px rgba(188, 24, 136, 0.4)'
                                        },
                                        transition: 'all 0.3s ease',
                                        mb: 0.5
                                    }}
                                >
                                    <InstagramIcon />
                                </IconButton>
                                <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                                    @fergrenteski
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Linha inferior */}
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ textAlign: 'center' }}>
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.5
                        }}
                    >
                        Feito com <FavoriteIcon sx={{ fontSize: 16, color: 'red' }} /> para nosso chá de casa nova
                    </Typography>
                    <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        © 2025 - Todos os direitos reservados
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
