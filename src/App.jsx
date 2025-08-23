import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';

// Import das páginas
import GiftListPage from './pages/GiftListPage';
import CartPage from './pages/CartPage';
import AccountPage from './pages/AccountPage';
import AuthPage from './pages/AuthPage';
import ProductsAdminPage from './pages/ProductsAdminPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminUsersPage from './pages/AdminUsersPage';
import FavoritesPage from './pages/FavoritesPage';
import AlbumPage from './pages/AlbumPage';

// Import dos componentes
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Footer from './components/Footer';

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
                                    <Routes>
                                    <Route path="/auth" element={<AuthPage />} />
                                    <Route 
                                        path="/" 
                                        element={
                                                <GiftListPage />
                                        } 
                                    />
                                    <Route 
                                        path="/products" 
                                        element={
                                                <GiftListPage />
                                        } 
                                    />
                                    <Route 
                                        path="/cart" 
                                        element={
                                                <CartPage />
                                        } 
                                    />
                                    <Route 
                                        path="/account" 
                                        element={
                                            <ProtectedRoute>
                                                <AccountPage />
                                            </ProtectedRoute>
                                        } 
                                    />
                                    <Route 
                                        path="/admin" 
                                        element={
                                            <AdminRoute>
                                                <ProductsAdminPage />
                                            </AdminRoute>
                                        } 
                                    />
                                    <Route 
                                        path="/admin/products" 
                                        element={
                                            <AdminRoute>
                                                <ProductsAdminPage />
                                            </AdminRoute>
                                        } 
                                    />
                                    <Route 
                                        path="/admin/orders" 
                                        element={
                                            <AdminRoute>
                                                <AdminOrdersPage />
                                            </AdminRoute>
                                        } 
                                    />
                                    <Route 
                                        path="/admin/users" 
                                        element={
                                            <AdminRoute>
                                                <AdminUsersPage />
                                            </AdminRoute>
                                        } 
                                    />
                                    <Route path="/album" element={<AlbumPage />} />
                                    <Route path="/favorites" element={<FavoritesPage />} />
                                </Routes>
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