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
                    <Box sx={{ textAlign: { xs: 'center', md: 'center' } }}>
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
                        © 2026 - Todos os direitos reservados
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
