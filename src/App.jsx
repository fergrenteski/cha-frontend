import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, CircularProgress, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { useCart } from './hooks/useCart';
import { useAuth } from './hooks/useAuth';

// Import dos componentes
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Footer from './components/Footer';

// Import lazy das páginas
import {
    LazyGiftListPage,
    LazyCartPage,
    LazyFavoritesPage,
    LazyAlbumPage,
    LazyAuthPage,
    LazyAccountPage,
    LazyInvitePage,
    LazyProductsAdminPage,
    LazyAdminOrdersPage,
    LazyAdminUsersPage
} from './components/LazyComponents';

// Componente de loading para Suspense
const PageLoader = () => (
    <Box 
        sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '60vh',
            gap: 2
        }}
    >
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary">
            Carregando...
        </Typography>
    </Box>
);

// Configuração do tema (opcional)
const theme = createTheme({
    palette: {
        primary: {
            main: '#daa520',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
});

// Componente interno que usa os hooks do contexto
const AppContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const { totalItems } = useCart();

    // Determinar página atual baseada na rota
    const getCurrentPage = () => {
        const path = location.pathname;
        if (path.startsWith('/admin')) return 'admin';
        if (path === '/cart') return 'cart';
        if (path === '/account') return 'account';
        if (path === '/album') return 'album';
        if (path === '/favorites') return 'favorites';
        if (path === '/auth') return 'auth';
        return 'products'; // default para / e /products
    };

    // Handlers de navegação
    const handleLogoutClick = () => {
        logout();
        navigate('/auth');
    };

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                minHeight: '100vh' 
            }}
        >

            <Header
                cartItemCount={totalItems}
                currentPage={getCurrentPage()}
                onAlbumClick={() => navigate('/album')}
                onCartClick={() => navigate('/cart')}
                onLogoClick={() => navigate('/')}
                onProductClick={() => navigate('/products')}
                onAccountClick={() => navigate('/account')}
                onAdminClick={() => navigate('/admin')}
                onLogoutClick={handleLogoutClick}
                onLoginClick={() => navigate('/auth')}
                onFavoritesClick={() => navigate('/favorites')}
            />
            
            <Box sx={{ flex: 1 }}>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/auth" element={<LazyAuthPage />} />
                        <Route path="/convite" element={<LazyInvitePage />} />
                        <Route 
                            path="/" 
                            element={<LazyGiftListPage />} 
                        />
                        <Route 
                            path="/products" 
                            element={<LazyGiftListPage />} 
                        />
                        <Route 
                            path="/cart" 
                            element={<LazyCartPage />} 
                        />
                        <Route 
                            path="/account" 
                            element={
                                <ProtectedRoute>
                                    <LazyAccountPage />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/admin" 
                            element={
                                <AdminRoute>
                                    <LazyProductsAdminPage />
                                </AdminRoute>
                            } 
                        />
                        <Route 
                            path="/admin/products" 
                            element={
                                <AdminRoute>
                                    <LazyProductsAdminPage />
                                </AdminRoute>
                            } 
                        />
                        <Route 
                            path="/admin/orders" 
                            element={
                                <AdminRoute>
                                    <LazyAdminOrdersPage />
                                </AdminRoute>
                            } 
                        />
                        <Route 
                            path="/admin/users" 
                            element={
                                <AdminRoute>
                                    <LazyAdminUsersPage />
                                </AdminRoute>
                            } 
                        />
                        <Route path="/album" element={<LazyAlbumPage />} />
                        <Route path="/favorites" element={<LazyFavoritesPage />} />
                    </Routes>
                </Suspense>
            </Box>
            <Footer />
        </Box>
    );
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <AuthProvider>
                    <CartProvider>
                        <FavoritesProvider>
                            <AppContent />
                        </FavoritesProvider>
                    </CartProvider>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;