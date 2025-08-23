import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, loading, user } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    gap: 2
                }}
            >
                <CircularProgress size={40} />
                <Typography variant="body1" color="textSecondary">
                    Carregando...
                </Typography>
            </Box>
        );
    }

    if (!isAuthenticated) {
        // Redirecionar para login, mas salvar a localização atual
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // Verificar se o usuário é admin
    if (!user?.isAdmin) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    gap: 2,
                    px: 3
                }}
            >
                <Alert severity="error" sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Acesso Negado
                    </Typography>
                    <Typography variant="body1">
                        Você não tem permissão para acessar esta área administrativa.
                        Entre em contato com o administrador do sistema se acredita que isso é um erro.
                    </Typography>
                </Alert>
                <Typography variant="body2" color="textSecondary">
                    Apenas administradores podem acessar esta página.
                </Typography>
            </Box>
        );
    }

    return children;
};

export default AdminRoute;
