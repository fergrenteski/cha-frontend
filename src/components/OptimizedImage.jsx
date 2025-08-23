import React, { useState, useRef, useEffect, memo } from 'react';
import { Box, Skeleton } from '@mui/material';

const OptimizedImage = memo(({ 
    src, 
    alt, 
    width, 
    height, 
    sx = {}, 
    placeholder = true,
    onLoad,
    onError,
    ...props 
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef(null);
    const observerRef = useRef(null);

    useEffect(() => {
        const img = imgRef.current;
        if (!img || !src) return;

        // Intersection Observer para lazy loading
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        if (target.dataset.src && !target.src) {
                            target.src = target.dataset.src;
                        }
                        observerRef.current?.unobserve(target);
                    }
                });
            },
            {
                rootMargin: '50px 0px', // Começar a carregar 50px antes de entrar na tela
                threshold: 0.1
            }
        );

        observerRef.current.observe(img);

        return () => {
            if (observerRef.current && img) {
                observerRef.current.unobserve(img);
            }
        };
    }, [src]);

    const handleLoad = (event) => {
        setIsLoaded(true);
        onLoad?.(event);
    };

    const handleError = (event) => {
        setHasError(true);
        onError?.(event);
    };

    // Se não tem src, não renderizar nada
    if (!src) {
        return placeholder ? (
            <Skeleton 
                variant="rectangular" 
                width={width} 
                height={height}
                sx={sx}
            />
        ) : null;
    }

    return (
        <Box sx={{ position: 'relative', ...sx }}>
            {/* Skeleton placeholder enquanto carrega */}
            {placeholder && !isLoaded && !hasError && (
                <Skeleton 
                    variant="rectangular" 
                    width={width} 
                    height={height}
                    sx={{
                        position: isLoaded ? 'absolute' : 'static',
                        top: 0,
                        left: 0,
                        zIndex: 1
                    }}
                />
            )}
            
            {/* Imagem */}
            <img
                ref={imgRef}
                data-src={src}
                alt={alt}
                width={width}
                height={height}
                onLoad={handleLoad}
                onError={handleError}
                style={{
                    display: hasError ? 'none' : 'block',
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out',
                    width: width || '100%',
                    height: height || 'auto',
                    objectFit: 'cover'
                }}
                {...props}
            />
            
            {/* Fallback para erro */}
            {hasError && (
                <Box
                    sx={{
                        width: width || '100%',
                        height: height || 200,
                        backgroundColor: 'grey.200',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'grey.500',
                        fontSize: '0.875rem'
                    }}
                >
                    Imagem não disponível
                </Box>
            )}
        </Box>
    );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
