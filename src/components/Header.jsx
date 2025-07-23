import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Badge,
    Box,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    ShoppingCart,
    AccountCircle,
    Person,
    Favorite,
    Logout,
    Menu as MenuIcon
} from '@mui/icons-material';

const Header = ({
                    cartItemCount = 0,
                    onCartClick,
                    onProductClick,
                    onAlbumClick,
                    onAccountClick,
                    onFavoritesClick,
                    onLogoutClick
                }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleAccountMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleAccountMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMobileMenuClick = (event) => {
        setMobileMenuAnchor(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMenuAnchor(null);
    };

    const handleMenuItemClick = (action) => {
        handleAccountMenuClose();
        handleMobileMenuClose();
        action?.();
    };

    return (
        <AppBar
            position="sticky"
            sx={{
                backgroundColor: 'white',
                boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
                borderBottom: `1px solid ${theme.palette.grey[200]}`
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                {/* Logo - Lado Esquerdo */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{
                            fontWeight: 700,
                            color: '#212121',
                            letterSpacing: '-0.5px',
                            cursor: 'pointer'
                        }}
                    >
                        LOGO
                    </Typography>
                </Box>

                {/* Links de Navegação - Centro (Desktop) */}
                {!isMobile && (
                    <Box sx={{ display: 'flex', gap: 4 }}>
                        <Button
                            onClick={onProductClick}
                            sx={{
                                color: '#212121',
                                fontWeight: 600,
                                textTransform: 'none',
                                fontSize: '1rem',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    color: theme.palette.primary.main
                                }
                            }}
                        >
                            Produto
                        </Button>
                        <Button
                            onClick={onAlbumClick}
                            sx={{
                                color: '#212121',
                                fontWeight: 600,
                                textTransform: 'none',
                                fontSize: '1rem',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    color: theme.palette.primary.main
                                }
                            }}
                        >
                            Álbum
                        </Button>
                    </Box>
                )}

                {/* Ações - Lado Direito */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Carrinho */}
                    <IconButton
                        onClick={onCartClick}
                        sx={{
                            color: '#212121',
                            '&:hover': {
                                backgroundColor: 'rgba(33, 33, 33, 0.04)'
                            }
                        }}
                    >
                        <Badge
                            badgeContent={cartItemCount}
                            color="error"
                            sx={{
                                '& .MuiBadge-badge': {
                                    fontSize: '0.7rem',
                                    minWidth: '18px',
                                    height: '18px'
                                }
                            }}
                        >
                            <ShoppingCart />
                        </Badge>
                    </IconButton>

                    {/* Menu Mobile */}
                    {isMobile ? (
                        <>
                            <IconButton
                                onClick={handleMobileMenuClick}
                                sx={{
                                    color: '#212121',
                                    '&:hover': {
                                        backgroundColor: 'rgba(33, 33, 33, 0.04)'
                                    }
                                }}
                            >
                                <MenuIcon />
                            </IconButton>

                            <Menu
                                anchorEl={mobileMenuAnchor}
                                open={Boolean(mobileMenuAnchor)}
                                onClose={handleMobileMenuClose}
                                PaperProps={{
                                    sx: {
                                        mt: 1,
                                        minWidth: 200,
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                        borderRadius: 2
                                    }
                                }}
                            >
                                <MenuItem onClick={() => handleMenuItemClick(onProductClick)}>
                                    <ListItemText primary="Produto" />
                                </MenuItem>
                                <MenuItem onClick={() => handleMenuItemClick(onAlbumClick)}>
                                    <ListItemText primary="Álbum" />
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={() => handleMenuItemClick(onAccountClick)}>
                                    <ListItemIcon>
                                        <Person fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Minha Conta" />
                                </MenuItem>
                                <MenuItem onClick={() => handleMenuItemClick(onFavoritesClick)}>
                                    <ListItemIcon>
                                        <Favorite fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Favoritos" />
                                </MenuItem>
                                <MenuItem onClick={() => handleMenuItemClick(onLogoutClick)}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Logout" />
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        /* Botão Minha Conta - Desktop */
                        <>
                            <Button
                                onClick={handleAccountMenuClick}
                                startIcon={<AccountCircle />}
                                sx={{
                                    color: '#212121',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    px: 2,
                                    '&:hover': {
                                        backgroundColor: 'rgba(33, 33, 33, 0.04)'
                                    }
                                }}
                            >
                                Minha Conta
                            </Button>

                            {/* Menu Popup da Conta */}
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleAccountMenuClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                PaperProps={{
                                    sx: {
                                        mt: 1,
                                        minWidth: 200,
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                        borderRadius: 2
                                    }
                                }}
                            >
                                <MenuItem onClick={() => handleMenuItemClick(onAccountClick)}>
                                    <ListItemIcon>
                                        <Person fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Minha Conta" />
                                </MenuItem>
                                <MenuItem onClick={() => handleMenuItemClick(onFavoritesClick)}>
                                    <ListItemIcon>
                                        <Favorite fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Favoritos" />
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={() => handleMenuItemClick(onLogoutClick)}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Logout" />
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;