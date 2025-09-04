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
    Login,
    Menu as MenuIcon,
    Inventory,
    Assignment
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Header = ({
    cartItemCount = 0,
    onCartClick,
    onProductClick,
    onAlbumClick,
    onAccountClick,
    onFavoritesClick,
    onLogoutClick,
    onLoginClick
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [adminMenuAnchor, setAdminMenuAnchor] = useState(null);
    const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const handleAccountMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleAccountMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAdminMenuClick = (event) => {
        setAdminMenuAnchor(event.currentTarget);
    };

    const handleAdminMenuClose = () => {
        setAdminMenuAnchor(null);
    };

    const handleMobileMenuClick = (event) => {
        setMobileMenuAnchor(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMenuAnchor(null);
    };

    const handleMenuItemClick = (action) => {
        handleAccountMenuClose();
        handleAdminMenuClose();
        handleMobileMenuClose();
        action?.();
    };

    const handleAdminProductsClick = () => {
        navigate('/admin/products');
    };

    const handleAdminOrdersClick = () => {
        navigate('/admin/orders');
    };

    const handleAdminUsersClick = () => {
        navigate('/admin/users');
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
                        ANA & LUIZ
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
                            Presentes
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
                        <Button
                            onClick={() => navigate('/convite')}
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
                            Convite 💌
                        </Button>
                        
                        {/* Menu Admin com submenu - apenas para admins */}
                        {user?.isAdmin && (
                            <>
                                <Button
                                    onClick={handleAdminMenuClick}
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
                                    Admin
                                </Button>
                                
                                <Menu
                                    anchorEl={adminMenuAnchor}
                                    open={Boolean(adminMenuAnchor)}
                                    onClose={handleAdminMenuClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    slotProps={{
                                        paper: {
                                            sx: {
                                                mt: 1,
                                                minWidth: 200,
                                                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                                borderRadius: 2
                                            }
                                        }
                                    }}
                                >
                                    <MenuItem onClick={() => handleMenuItemClick(handleAdminProductsClick)}>
                                        <ListItemIcon>
                                            <Inventory fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary="Gerenciar Presentes" />
                                    </MenuItem>
                                    <MenuItem onClick={() => handleMenuItemClick(handleAdminOrdersClick)}>
                                        <ListItemIcon>
                                            <Assignment fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary="Gerenciar Pedidos" />
                                    </MenuItem>
                                    <MenuItem onClick={() => handleMenuItemClick(handleAdminUsersClick)}>
                                        <ListItemIcon>
                                            <Person fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary="Gerenciar Usuários" />
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
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
                                slotProps={{
                                    paper: {
                                        sx: {
                                            mt: 1,
                                            minWidth: 200,
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                            borderRadius: 2
                                        }
                                    }
                                }}
                            >
                                <MenuItem onClick={() => handleMenuItemClick(onProductClick)}>
                                    <ListItemText primary="Produto" />
                                </MenuItem>
                                <MenuItem onClick={() => handleMenuItemClick(onAlbumClick)}>
                                    <ListItemText primary="Álbum" />
                                </MenuItem>
                                <MenuItem onClick={() => handleMenuItemClick(() => navigate('/convite'))}>
                                    <ListItemText primary="Convite 💌" />
                                </MenuItem>
                                
                                {/* Itens Admin - apenas para admins */}
                                {user?.isAdmin && [
                                    <MenuItem key="admin-products" onClick={() => handleMenuItemClick(handleAdminProductsClick)}>
                                        <ListItemIcon>
                                            <Inventory fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary="Admin - Produtos" />
                                    </MenuItem>,
                                    <MenuItem key="admin-orders" onClick={() => handleMenuItemClick(handleAdminOrdersClick)}>
                                        <ListItemIcon>
                                            <Assignment fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary="Admin - Pedidos" />
                                    </MenuItem>,
                                    <MenuItem key="admin-users" onClick={() => handleMenuItemClick(handleAdminUsersClick)}>
                                        <ListItemIcon>
                                            <Person fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary="Admin - Usuários" />
                                    </MenuItem>
                                ]}
                                
                                <Divider />
                                
                                {isAuthenticated ? [
                                    <MenuItem key="account" onClick={() => handleMenuItemClick(onAccountClick)}>
                                        <ListItemIcon>
                                            <Person fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary="Minha Conta" />
                                    </MenuItem>,
                                    <MenuItem key="favorites" onClick={() => handleMenuItemClick(onFavoritesClick)}>
                                        <ListItemIcon>
                                            <Favorite fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary="Favoritos" />
                                    </MenuItem>,
                                    <MenuItem key="logout" onClick={() => handleMenuItemClick(onLogoutClick)}>
                                        <ListItemIcon>
                                            <Logout fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary="Logout" />
                                    </MenuItem>
                                ] : (
                                    <MenuItem onClick={() => handleMenuItemClick(onLoginClick)}>
                                        <ListItemIcon>
                                            <Login fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary="Fazer Login" />
                                    </MenuItem>
                                )}
                            </Menu>
                        </>
                    ) : (
                        /* Botão Minha Conta - Desktop */
                        <>
                            <Button
                                onClick={isAuthenticated ? handleAccountMenuClick : onLoginClick}
                                startIcon={isAuthenticated ? <AccountCircle /> : <Login />}
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
                                {isAuthenticated ? 'Minha Conta' : 'Fazer Login'}
                            </Button>

                            {/* Menu Popup da Conta - só aparece se estiver logado */}
                            {isAuthenticated && (
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
                                    slotProps={{
                                        paper: {
                                            sx: {
                                                mt: 1,
                                                minWidth: 200,
                                                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                                borderRadius: 2
                                            }
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
                            )}
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;