import { useState, useCallback } from 'react';
import {
    Typography,
    Box,
    Card,
    CardMedia,
    Button,
    Fade,
    useTheme,
    useMediaQuery,
    IconButton,
    Dialog,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    Shuffle,
    Close as CloseIcon,
} from '@mui/icons-material';
import { albumPhotos, shuffleArray } from '../data/albumData';

const AlbumPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [photos, setPhotos] = useState(albumPhotos);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isShuffling, setIsShuffling] = useState(false);

    const handleShuffle = useCallback(() => {
        setIsShuffling(true);
        setTimeout(() => {
            setPhotos(shuffleArray(albumPhotos));
            setIsShuffling(false);
        }, 300);
    }, []);

    const handlePhotoClick = (photo) => {
        setSelectedPhoto(photo);
    };

    const handleCloseDialog = () => {
        setSelectedPhoto(null);
    };


    // Sistema simplificado - todas as fotos quadradas responsivas
    const getPhotoGridStyle = () => {
        // Todas as fotos ocupam 1 posição e são sempre quadradas
        return {
            gridColumn: 'span 1',
            gridRow: 'span 1',
            aspectRatio: '1', // Força proporção 1:1 (quadrado)
            width: '100%'
        };
    };

    return (
        <>
            <Box sx={{ 
                width: '100%', 
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #fdfbf7 0%, #f8f4e6 30%, #f5f0e1 70%, #f0e6d2 100%)',
                px: { xs: 0.5, sm: 1, md: 2 }, 
                py: 2,
                pb: 0,
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `
                        radial-gradient(circle at 20% 20%, rgba(218, 165, 32, 0.03) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(25, 118, 210, 0.02) 0%, transparent 50%),
                        radial-gradient(circle at 40% 60%, rgba(212, 175, 55, 0.015) 0%, transparent 50%)
                    `,
                    zIndex: 1
                }
            }}>
                <Fade in timeout={800}>
                    <Box sx={{ position: 'relative', zIndex: 2 }}>
                        {/* Cabeçalho da página */}
                        <Box sx={{ 
                            mb: { xs: 2, md: 3 }, 
                            textAlign: 'center',
                            px: { xs: 1, sm: 2 },
                            position: 'relative'
                        }}>
                            {/* Decorative border */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: { xs: 200, md: 300 },
                                    height: 2,
                                    background: 'linear-gradient(90deg, transparent 0%, #daa520 10%, #b8860b 30%, #cd853f 50%, #daa520 70%, #b8860b 90%, transparent 100%)',
                                    opacity: 0.6,
                                    mb: 3
                                }}
                            />
                            
                            <Typography
                                variant={isMobile ? "h4" : "h3"}
                                component="h1"
                                sx={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontWeight: 400,
                                    background: 'linear-gradient(135deg, #daa520 0%, #b8860b 50%, #cd853f 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 2,
                                    fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' },
                                    letterSpacing: '1px',
                                    textShadow: '0 2px 4px rgba(218, 165, 32, 0.1)',
                                    mt: 4
                                }}
                            >
                                Álbum de Fotos
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ 
                                    fontFamily: "'Playfair Display', serif",
                                    fontWeight: 300,
                                    fontStyle: 'italic',
                                    color: '#8b4513',
                                    maxWidth: 600, 
                                    mx: 'auto',
                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                    px: { xs: 2, sm: 0 },
                                    mb: 4,
                                    lineHeight: 1.6
                                }}
                            >
                                "Momentos especiais capturados em {photos.length} fotografias que contam nossa história"
                            </Typography>

                            {/* Botão de embaralhar */}
                            <Button
                                onClick={handleShuffle}
                                variant="contained"
                                startIcon={<Shuffle />}
                                sx={{
                                    mt: 2,
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: '25px',
                                    background: 'linear-gradient(135deg, #daa520 0%, #b8860b 50%, #cd853f 100%)',
                                    color: 'white',
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                    fontFamily: "'Playfair Display', serif",
                                    fontWeight: 500,
                                    letterSpacing: '0.5px',
                                    textTransform: 'none',
                                    boxShadow: '0 8px 32px rgba(218, 165, 32, 0.3)',
                                    border: '1px solid rgba(218, 165, 32, 0.3)',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #b8860b 0%, #cd853f 50%, #daa520 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 12px 48px rgba(218, 165, 32, 0.4)',
                                        borderColor: 'rgba(218, 165, 32, 0.5)'
                                    },
                                    '&:active': {
                                        transform: 'translateY(0px)'
                                    }
                                }}
                            >
                                Embaralhar Fotos
                            </Button>
                        </Box>

                        {/* Mosaico de fotos - Grid responsivo simples */}
                        <Fade in={!isShuffling} timeout={600}>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: 'repeat(1, 1fr)',  // 1 coluna no mobile
                                        sm: 'repeat(2, 1fr)',  // 2 colunas no tablet
                                        md: 'repeat(4, 1fr)',  // 4 colunas no desktop
                                        lg: 'repeat(4, 1fr)',  // 4 colunas em telas grandes
                                        xl: 'repeat(4, 1fr)'   // 4 colunas em telas muito grandes
                                    },
                                    gap: { xs: 1, sm: 2, md: 2 },
                                    width: '100%',
                                    justifyItems: 'center', // Centraliza itens individuais
                                    opacity: isShuffling ? 0.3 : 1,
                                    transition: 'opacity 0.3s ease'
                                }}
                            >
                                {photos.map((photo, index) => (
                                    <Box
                                        key={`${photo.id}-${index}`}
                                        sx={{
                                            ...getPhotoGridStyle(),
                                            display: 'flex',
                                            '&:hover .photo-overlay': {
                                                opacity: 1
                                            },
                                            '&:hover .photo-gradient-overlay': {
                                                opacity: 1
                                            }
                                        }}
                                    >
                                        <Card
                                            sx={{
                                                cursor: 'pointer',
                                                borderRadius: '16px',
                                                overflow: 'hidden',
                                                background: 'linear-gradient(135deg, rgba(218, 165, 32, 0.05) 0%, rgba(184, 134, 11, 0.05) 100%)',
                                                border: '2px solid',
                                                borderColor: 'transparent',
                                                backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #daa520, #b8860b)',
                                                backgroundOrigin: 'border-box',
                                                backgroundClip: 'content-box, border-box',
                                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                '&:hover': {
                                                    transform: 'translateY(-8px) scale(1.02)',
                                                    boxShadow: '0 10px 10px rgba(218, 165, 32, 0.2)',
                                                    borderColor: 'rgba(218, 165, 32, 0.6)',
                                                },
                                                '&:active': {
                                                    transform: 'translateY(-4px) scale(1.01)'
                                                },
                                                position: 'relative',
                                                width: '100%',
                                                aspectRatio: '1',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                            onClick={() => handlePhotoClick(photo)}
                                        >
                                            <CardMedia
                                                component="img"
                                                image={photo.url}
                                                alt={photo.alt}
                                                sx={{
                                                    width: '100%',
                                                    aspectRatio: '1', // Força proporção quadrada
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'scale(1.05)'
                                                    }
                                                }}
                                            />
                                            
                                            {/* Overlay com título */}
                                            
                                        </Card>
                                    </Box>
                                ))}
                            </Box>
                        </Fade>
                    </Box>
                </Fade>
            </Box>

            {/* Dialog para foto ampliada */}
            <Dialog
                open={!!selectedPhoto}
                onClose={handleCloseDialog}
                maxWidth="lg"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogContent sx={{ p: 0, position: 'relative' }}>
                    {selectedPhoto && (
                        <>
                            <Box
                                component="img"
                                src={selectedPhoto.url.replace('w=400', 'w=800')}
                                alt={selectedPhoto.alt}
                                sx={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: '80vh',
                                    objectFit: 'contain',
                                    borderRadius: 2
                                }}
                            />
                            
                            {/* Título da foto */}
                        </>
                    )}
                </DialogContent>
                
                <DialogActions sx={{ position: 'absolute', top: 0, right: 200 }}>
                    <IconButton
                        onClick={handleCloseDialog}
                        sx={{
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.7)'
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AlbumPage;
