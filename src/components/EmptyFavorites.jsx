import React from 'react';
import {
    Box,
    Typography,
    Button,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Favorite as FavoriteIcon,
    ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { red } from '@mui/material/colors';

const EmptyFavorites = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

return (
    <Box sx={{ 
        textAlign: 'center', 
        py: { xs: 6, md: 8 },
        px: { xs: 2, sm: 4 }
    }}>
        <Box
            sx={{
                width: isMobile ? 120 : 150,
                height: isMobile ? 120 : 150,
                borderRadius: '50%',
                backgroundColor: '#ff000034',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 'auto',
                mb: 3
            }}
        >
            <FavoriteIcon
                sx={{
                    fontSize: isMobile ? 60 : 80,
                    color: 'rgba(255, 0, 0, 1)',
                }}
            />
        </Box>
        <Typography
            variant="h4"
            sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 2,
                fontSize: isMobile ? '1.5rem' : '2rem'
            }}
        >
            Seus favoritos estão vazios
        </Typography>
        <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
                mb: 4,
                maxWidth: 400,
                mx: 'auto',
                fontSize: { xs: '0.875rem', md: '1rem' }
            }}
        >
            Explore nossos produtos e adicione seus favoritos clicando no ícone de coração
        </Typography>
        <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            startIcon={<ShoppingCartIcon />}
            sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    backgroundColor: '#212121',
                    boxShadow: '0 4px 20px rgba(33, 33, 33, 0.3)',
                    '&:hover': {
                        backgroundColor: '#424242',
                        boxShadow: '0 6px 30px rgba(33, 33, 33, 0.4)',
                        transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                }}
          >
            Explorar Produtos
        </Button>
    </Box>
)};

export default EmptyFavorites;