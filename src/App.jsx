// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CartProvider } from './contexts/CartContext'; // Import do CartProvider

// Import das páginas
import GiftListPage from './pages/GiftListPage';
import CartPage from './pages/CartPage';

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
                {/* Envolver toda a aplicação com o CartProvider */}
                <CartProvider>
                    <div className="App">
                        <Routes>
                            <Route path="/" element={<GiftListPage />} />
                            <Route path="/products" element={<GiftListPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            {/*<Route path="/album" element={<AlbumPage />} />*/}
                            {/*<Route path="/account" element={<AccountPage />} />*/}
                            {/*<Route path="/favorites" element={<FavoritesPage />} />*/}
                            {/*<Route path="/login" element={<LoginPage />} />*/}
                            {/* Adicione outras rotas conforme necessário */}
                        </Routes>
                    </div>
                </CartProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;