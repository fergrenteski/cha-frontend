import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, CircularProgress, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';

// Import lazy das páginas
import {
    LazyGiftListPage,
    LazyCartPage,
    LazyFavoritesPage,
    LazyAlbumPage,
    LazyAuthPage,
    LazyAccountPage,
    LazyProductsAdminPage,
    LazyAdminOrdersPage,
    LazyAdminUsersPage
} from './components/LazyComponents';

// Import dos componentes (não lazy por serem pequenos)
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Footer from './components/Footer';

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
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <AuthProvider>
                    <CartProvider>
                        <FavoritesProvider>
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    minHeight: '100vh' 
                                }}
                            >
                                <Box sx={{ flex: 1 }}>
                                    <Suspense fallback={<PageLoader />}>
                                        <Routes>
                                        <Route path="/auth" element={<LazyAuthPage />} />
                                        <Route 
                                            path="/" 
                                            element={
                                                    <LazyGiftListPage />
                                            } 
                                        />
                                        <Route 
                                            path="/products" 
                                            element={
                                                    <LazyGiftListPage />
                                            } 
                                        />
                                        <Route 
                                            path="/cart" 
                                            element={
                                                    <LazyCartPage />
                                            } 
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
                        </FavoritesProvider>
                    </CartProvider>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;