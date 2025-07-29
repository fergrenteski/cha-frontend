// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';

// Import das páginas
import GiftListPage from './pages/GiftListPage';
import CartPage from './pages/CartPage';
import AccountPage from './pages/AccountPage';
import AuthPage from './pages/AuthPage';
import ProductsAdminPage from './pages/ProductsAdminPage';

// Import dos componentes
import ProtectedRoute from './components/ProtectedRoute';

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
                        <div className="App">
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
                                        <ProtectedRoute>
                                            <ProductsAdminPage />
                                        </ProtectedRoute>
                                    } 
                                />
                                <Route 
                                    path="/admin/products" 
                                    element={
                                        <ProtectedRoute>
                                            <ProductsAdminPage />
                                        </ProtectedRoute>
                                    } 
                                />
                                {/*<Route path="/album" element={<AlbumPage />} />*/}
                                {/*<Route path="/favorites" element={<FavoritesPage />} />*/}
                            </Routes>
                        </div>
                    </CartProvider>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;