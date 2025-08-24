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
    Shuffle as ShuffleIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { albumPhotos, shuffleArray } from '../data/albumData';

const AlbumPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [photos, setPhotos] = useState(albumPhotos);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isShuffling, setIsShuffling] = useState(false);

    const handleShuffleWithAnimation = useCallback(() => {
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
                px: { xs: 0.5, sm: 1, md: 2 }, 
                py: 2,
                pb: 0
            }}>
                <Fade in timeout={800}>
                    <Box>
                        {/* Cabeçalho da página */}
                        <Box sx={{ 
                            mb: { xs: 2, md: 3 }, 
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
                                Álbum de Fotos
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ 
                                    maxWidth: 600, 
                                    mx: 'auto',
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                    px: { xs: 2, sm: 0 },
                                    mb: 3
                                }}
                            >
                                Momentos especiais capturados em {photos.length} fotografias
                            </Typography>

                            {/* Botão de embaralhar */}
                            <Button
                                variant="outlined"
                                startIcon={<ShuffleIcon />}
                                onClick={handleShuffleWithAnimation}
                                disabled={isShuffling}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 3,
                                    py: 1
                                }}
                            >
                                {isShuffling ? 'Embaralhando...' : 'Embaralhar Fotos'}
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
                                            display: 'flex'
                                        }}
                                    >
                                        <Card
                                            sx={{
                                                cursor: 'pointer',
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                '&:hover': {
                                                    transform: 'scale(1.02)',
                                                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                                },
                                                position: 'relative',
                                                width: '100%',
                                                aspectRatio: '1', // Card também quadrado
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
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                                                    color: 'white',
                                                    p: { xs: 1, sm: 2 },
                                                    opacity: 0,
                                                    transition: 'opacity 0.3s ease',
                                                    '&:hover': {
                                                        opacity: 1
                                                    }
                                                }}
                                            >
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                                    }}
                                                >
                                                    {photo.title}
                                                </Typography>
                                            </Box>
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
