import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Box,
    Chip,
    Alert,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControlLabel,
    Switch,
    Grid,
    InputAdornment,
    Fab,
    Tooltip,
    useTheme,
    useMediaQuery,
    Avatar,
    TablePagination,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
    Card
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Visibility as ViewIcon,
    PhotoCamera as PhotoIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Refresh as RefreshIcon,
    CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { useProducts } from '../hooks/useProducts';
import Header from '../components/Header';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';

const ProductsAdminPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { totalItems } = useCart();
    
    // States do hook de produtos
    const { 
        products, 
        categories, 
        loading: productsLoading, 
        error: productsError,
        refresh: refreshProducts
    } = useProducts();

    // States locais
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [localCategories, setLocalCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [availableFilter, setAvailableFilter] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState('create'); // 'create', 'edit', 'view'
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    
    // States da paginação
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // State do formulário
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        capacity: '',
        image: '',
        category: '',
        available: true,
        stock: ''
    });

    // Atualizar produtos filtrados quando produtos mudarem
    useEffect(() => {
        let filtered = [...products];

        // Filtrar por busca
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtrar por categoria
        if (categoryFilter) {
            filtered = filtered.filter(product => product.category === categoryFilter);
        }

        // Filtrar por disponibilidade
        if (availableFilter !== '') {
            filtered = filtered.filter(product => 
                product.available === (availableFilter === 'true')
            );
        }

        setFilteredProducts(filtered);
    }, [products, searchTerm, categoryFilter, availableFilter]);

    // Atualizar categorias locais quando categorias do hook mudarem
    useEffect(() => {
        setLocalCategories(categories);
    }, [categories]);

    // Handlers de navegação
    const handleCartClick = () => navigate('/cart');
    const handleLogoClick = () => navigate('/');
    const handleProductClick = () => navigate('/products');
    const handleAccountClick = () => navigate('/account');
    const handleAdminClick = () => navigate('/admin');
    const handleLogoutClick = () => {
        logout();
        navigate('/auth');
    };

    // Handler de busca
    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    // Handler de filtros
    const handleCategoryFilter = (category) => {
        setCategoryFilter(category);
    };

    const handleAvailableFilter = (available) => {
        setAvailableFilter(available);
    };

    // Limpar filtros
    const clearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setAvailableFilter('');
    };

    // Abrir dialog
    const openDialog = (mode, product = null) => {
        setDialogMode(mode);
        setSelectedProduct(product);
        
        if (mode === 'create') {
            setFormData({
                name: '',
                description: '',
                price: '',
                capacity: '',
                image: '',
                category: '',
                available: true,
                stock: ''
            });
        } else if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                capacity: product.capacity || '',
                image: product.image || '',
                category: product.category || '',
                available: product.available ?? true,
                stock: product.stock || ''
            });
        }
        
        setDialogOpen(true);
    };

    // Fechar dialog
    const closeDialog = () => {
        setDialogOpen(false);
        setSelectedProduct(null);
        setSelectedImageFile(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            capacity: '',
            image: '',
            category: '',
            available: true,
            stock: ''
        });
    };

    // Handler do formulário
    const handleFormChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handler para mudança de categoria
    const handleCategoryChange = (value) => {
        if (value === '__nova_categoria__') {
            const novaCategoria = prompt('Digite o nome da nova categoria:');
            if (novaCategoria?.trim()) {
                const categoriaTrimmed = novaCategoria.trim();
                // Verifica se a categoria já existe
                if (!localCategories.includes(categoriaTrimmed)) {
                    // Adiciona a nova categoria à lista local
                    setLocalCategories(prev => [...prev, categoriaTrimmed]);
                    handleFormChange('category', categoriaTrimmed);
                    showSnackbar(`Nova categoria "${categoriaTrimmed}" criada!`, 'success');
                } else {
                    handleFormChange('category', categoriaTrimmed);
                    showSnackbar('Categoria já existe, selecionada automaticamente', 'info');
                }
            }
            // Se o usuário cancelar ou não digitar nada, não muda a categoria
        } else {
            handleFormChange('category', value);
        }
    };

    // Salvar produto
    const handleSave = async () => {
        try {
            setLoading(true);
            
            const productData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                capacity: formData.capacity,
                image: formData.image,
                category: formData.category,
                available: formData.available,
                stock: parseInt(formData.stock)
            };

            if (dialogMode === 'create') {
                await productsAPI.createProduct(productData, selectedImageFile);
                showSnackbar('Produto criado com sucesso!', 'success');
            } else if (dialogMode === 'edit') {
                await productsAPI.updateProduct(selectedProduct._id, productData, selectedImageFile);
                showSnackbar('Produto atualizado com sucesso!', 'success');
            }

            closeDialog();
            refreshProducts();
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            showSnackbar(error.message || 'Erro ao salvar produto', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Excluir produto
    const handleDelete = async (productId) => {
        if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
            return;
        }

        try {
            setLoading(true);
            await productsAPI.deleteProduct(productId);
            showSnackbar('Produto excluído com sucesso!', 'success');
            refreshProducts();
        } catch (error) {
            showSnackbar(error.message || 'Erro ao excluir produto', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Mostrar snackbar
    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    // Lidar com seleção de arquivo de imagem
    const handleImageFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
            showSnackbar('Por favor, selecione apenas arquivos de imagem', 'error');
            return;
        }

        // Validar tamanho do arquivo (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showSnackbar('A imagem deve ter no máximo 5MB', 'error');
            return;
        }

        setSelectedImageFile(file);
        
        // Criar preview da imagem
        const reader = new FileReader();
        reader.onload = (e) => {
            handleFormChange('image', e.target.result);
        };
        reader.readAsDataURL(file);
        
        showSnackbar('Imagem selecionada com sucesso!', 'success');
    };

    // Handler da paginação
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Produtos paginados
    const paginatedProducts = filteredProducts.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Box sx={{ minHeight: '100vh' }}>
            <Header
                cartItemCount={totalItems}
                currentPage="admin"
                onCartClick={handleCartClick}
                onLogoClick={handleLogoClick}
                onProductClick={handleProductClick}
                onAccountClick={handleAccountClick}
                onAdminClick={handleAdminClick}
                onLogoutClick={handleLogoutClick}
            />

            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Header da página */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            Administração de Produtos
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                            Gerencie produtos, categorias e estoque
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Atualizar lista">
                            <IconButton 
                                onClick={refreshProducts}
                                disabled={productsLoading}
                                sx={{ 
                                    bgcolor: 'background.paper',
                                    boxShadow: 1,
                                    '&:hover': { boxShadow: 2 }
                                }}
                            >
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                        
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => openDialog('create')}
                            sx={{
                                bgcolor: 'primary.main',
                                boxShadow: 2,
                                '&:hover': { boxShadow: 4 }
                            }}
                        >
                            Novo Produto
                        </Button>
                    </Box>
                </Box>

                {/* Filtros */}
                <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 1 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item size={{xs: 12, sm: 6, md: 3}}>
                            <TextField
                                fullWidth
                                placeholder="Buscar produtos..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                            />
                        </Grid>
                        
                        <Grid item size={{xs: 12, sm: 6, md: 3}}>
                            <FormControl fullWidth>
                                <InputLabel>Categoria</InputLabel>
                                <Select
                                    value={categoryFilter}
                                    label="Categoria"
                                    onChange={(e) => handleCategoryFilter(e.target.value)}
                                    sx={{ borderRadius: 2 }}
                                >
                                    <MenuItem value="">Todas</MenuItem>
                                    {localCategories.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid item size={{xs: 12, sm: 6, md: 3}}>
                            <FormControl fullWidth>
                                <InputLabel>Disponibilidade</InputLabel>
                                <Select
                                    value={availableFilter}
                                    label="Disponibilidade"
                                    onChange={(e) => handleAvailableFilter(e.target.value)}
                                    sx={{ borderRadius: 2 }}
                                >
                                    <MenuItem value="">Todos</MenuItem>
                                    <MenuItem value="true">Disponível</MenuItem>
                                    <MenuItem value="false">Indisponível</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid item size={{xs: 12, sm: 6, md: 3}}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={clearFilters}
                                sx={{ 
                                    height: 56,
                                    borderRadius: 2,
                                    borderColor: 'grey.300'
                                }}
                            >
                                Limpar
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Alertas */}
                {productsError && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {productsError}
                    </Alert>
                )}

                {/* Tabela de produtos */}
                <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 2 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'grey.50' }}>
                                    <TableCell sx={{ fontWeight: 600 }}>Produto</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Categoria</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }} align="right">Preço</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }} align="center">Estoque</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }} align="center">Status</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }} align="center">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedProducts.map((product) => (
                                    <TableRow 
                                        key={product._id}
                                        sx={{ 
                                            '&:hover': { bgcolor: 'grey.50' },
                                            '&:last-child td, &:last-child th': { border: 0 }
                                        }}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar
                                                    src={product.image}
                                                    alt={product.name}
                                                    sx={{ 
                                                        width: 48, 
                                                        height: 48,
                                                        borderRadius: 2
                                                    }}
                                                >
                                                    <PhotoIcon />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                        {product.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {product.capacity}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={product.category} 
                                                size="small"
                                                sx={{ 
                                                    bgcolor: 'primary.50',
                                                    color: 'primary.main',
                                                    fontWeight: 500
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                R$ {product.price?.toFixed(2)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            {(() => {
                                                let color;
                                                if (product.stock > 10) color = 'success.main';
                                                else if (product.stock > 0) color = 'warning.main';
                                                else color = 'error.main';
                                                
                                                return (
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ 
                                                            fontWeight: 600,
                                                            color
                                                        }}
                                                    >
                                                        {product.stock}
                                                    </Typography>
                                                );
                                            })()}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={product.available ? 'Disponível' : 'Indisponível'}
                                                size="small"
                                                color={product.available ? 'success' : 'error'}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                                <Tooltip title="Visualizar">
                                                    <IconButton 
                                                        size="small"
                                                        onClick={() => openDialog('view', product)}
                                                        sx={{ color: 'info.main' }}
                                                    >
                                                        <ViewIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Editar">
                                                    <IconButton 
                                                        size="small"
                                                        onClick={() => openDialog('edit', product)}
                                                        sx={{ color: 'warning.main' }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Excluir">
                                                    <IconButton 
                                                        size="small"
                                                        onClick={() => handleDelete(product._id)}
                                                        sx={{ color: 'error.main' }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                    {/* Paginação */}
                    <TablePagination
                        component="div"
                        count={filteredProducts.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        labelRowsPerPage="Itens por página:"
                        labelDisplayedRows={({ from, to, count }) => {
                            const total = count !== -1 ? count : `mais de ${to}`;
                            return `${from}-${to} de ${total}`;
                        }}
                        sx={{ borderTop: 1, borderColor: 'divider' }}
                    />
                </Paper>

                {/* FAB para mobile */}
                {isMobile && (
                    <Fab
                        color="primary"
                        onClick={() => openDialog('create')}
                        sx={{
                            position: 'fixed',
                            bottom: 24,
                            right: 24,
                            zIndex: 1000
                        }}
                    >
                        <AddIcon />
                    </Fab>
                )}
            </Container>

            {/* Dialog do formulário */}
            <Dialog 
                open={dialogOpen} 
                onClose={closeDialog}
                maxWidth="lg"
                fullWidth
                fullScreen={isMobile}
                PaperProps={{
                    sx: { 
                        borderRadius: isMobile ? 0 : 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 3,
                    fontSize: '1.25rem',
                    fontWeight: 600
                }}>
                    {dialogMode === 'create' && <><AddIcon sx={{ fontSize: 28 }} /> Novo Produto</>}
                    {dialogMode === 'edit' && <><EditIcon sx={{ fontSize: 28 }} /> Editar Produto</>}
                    {dialogMode === 'view' && <><ViewIcon sx={{ fontSize: 28 }} /> Visualizar Produto</>}
                </DialogTitle>
                
                <DialogContent sx={{ pt: 4, pb: 2, px: 4 }}>
                    {/* Preview do Produto - Estilo GiftCard */}
                    {(formData.image || formData.name || formData.price) && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                            <Card
                                sx={{
                                    width: isMobile ? '450px' : '300px',
                                    borderRadius: 3,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                                    },
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                {/* Image Section */}
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: isMobile ? 300 : 250,
                                        background: theme.palette.background.paper,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {formData.image ? (
                                        <Box
                                            component="img"
                                            src={formData.image}
                                            alt={formData.name || 'Preview'}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                filter: !formData.available ? 'grayscale(100%) blur(2px) brightness(0.7)' : 'none',
                                                transition: '0.3s ease'
                                            }}
                                        />
                                    ) : (
                                        <PhotoIcon sx={{ fontSize: 80, color: 'grey.300' }} />
                                    )}

                                    {/* Overlay se indisponível */}
                                    {!formData.available && formData.image && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                zIndex: 2,
                                                color: 'white',
                                                flexDirection: 'column'
                                            }}
                                        >
                                            <Typography variant="subtitle2">Indisponível</Typography>
                                        </Box>
                                    )}

                                    {/* Label de Preview */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            left: 8,
                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                            backdropFilter: 'blur(10px)',
                                            borderRadius: 1,
                                            px: 1,
                                            py: 0.5,
                                        }}
                                    >
                                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                            PREVIEW
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                    {/* Header */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                        <Typography
                                            variant="h6"
                                            component="h3"
                                            sx={{
                                                fontWeight: 600,
                                                color: 'text.primary',
                                                fontSize: '0.9rem',
                                                minHeight: '50px',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {formData.name ? formData.name.toUpperCase() : 'NOME DO PRODUTO'}
                                        </Typography>
                                    </Box>

                                    {/* Description */}
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            mb: 2,
                                            lineHeight: 1.1,
                                            minHeight: '50px',
                                            width: '100%',
                                            fontSize: '0.75rem',
                                            flexGrow: 1,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        {formData.description || 'Descrição do produto aparecerá aqui...'}
                                    </Typography>

                                    {/* Price and Capacity */}
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 2
                                    }}>
                                        <Typography
                                            variant="h6"
                                            component="span"
                                            sx={{
                                                fontWeight: 700,
                                                color: 'text.primary'
                                            }}
                                        >
                                            R$ {formData.price ? parseFloat(formData.price).toFixed(2).replace('.', ',') : '0,00'}
                                        </Typography>
                                        <Chip
                                            label={formData.capacity || 'Produto'}
                                            size="small"
                                            sx={{
                                                backgroundColor: theme.palette.grey[100],
                                                color: theme.palette.text.secondary,
                                                fontWeight: 500,
                                                fontSize: '0.7rem'
                                            }}
                                        />
                                    </Box>
                                    
                                    <Button
                                        variant="contained"
                                        disabled={!formData.available}
                                        sx={{
                                            py: 1,
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            fontSize: '0.85rem',
                                            backgroundColor: !formData.available
                                                ? '#9e9e9e'
                                                : '#212121',
                                            color: '#ffffff',
                                            '&:hover': {
                                                backgroundColor: !formData.available
                                                    ? '#9e9e9e'
                                                    : '#424242'
                                            }
                                        }}
                                    >
                                        {!formData.available ? 'Indisponível' : 'Selecionar'}
                                    </Button>
                                </Box>
                            </Card>
                        </Box>
                    )}

                    {/* Seção: Informações Básicas */}
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EditIcon /> Informações Básicas
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item size={{xs: 12, md: 6}}>
                                <TextField
                                    fullWidth
                                    label="Nome do Produto"
                                    value={formData.name}
                                    onChange={(e) => handleFormChange('name', e.target.value)}
                                    disabled={dialogMode === 'view'}
                                    variant="outlined"
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': { 
                                            borderRadius: 2,
                                            bgcolor: 'white'
                                        }
                                    }}
                                />
                            </Grid>
                            
                            <Grid item size={{xs: 12, md: 6}}>
                                <FormControl fullWidth>
                                    <InputLabel>Categoria</InputLabel>
                                    <Select
                                        value={formData.category}
                                        label="Categoria"
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        disabled={dialogMode === 'view'}
                                        sx={{ 
                                            borderRadius: 2,
                                            bgcolor: 'white'
                                        }}
                                    >
                                        {localCategories.map((category) => (
                                            <MenuItem key={category} value={category}>
                                                {category}
                                            </MenuItem>
                                        ))}
                                        <MenuItem value="__nova_categoria__">+ Nova Categoria</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            <Grid item size={{xs: 12}}>
                                <TextField
                                    fullWidth
                                    label="Descrição"
                                    multiline
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => handleFormChange('description', e.target.value)}
                                    disabled={dialogMode === 'view'}
                                    placeholder="Descreva o produto, suas características e benefícios..."
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': { 
                                            borderRadius: 2,
                                            bgcolor: 'white'
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Seção: Preço e Estoque */}
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                            💰 Preço e Estoque
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item size={{xs: 12, sm: 6, md: 4}}>
                                <TextField
                                    fullWidth
                                    label="Preço"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => handleFormChange('price', e.target.value)}
                                    disabled={dialogMode === 'view'}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                    }}
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': { 
                                            borderRadius: 2,
                                            bgcolor: 'white'
                                        }
                                    }}
                                />
                            </Grid>
                            
                            <Grid item size={{xs: 12, sm: 6, md: 4}}>
                                <TextField
                                    fullWidth
                                    label="Estoque"
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => handleFormChange('stock', e.target.value)}
                                    disabled={dialogMode === 'view'}
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': { 
                                            borderRadius: 2,
                                            bgcolor: 'white'
                                        }
                                    }}
                                />
                            </Grid>
                            
                            <Grid item size={{xs: 12, sm: 6, md: 4}}>
                                <TextField
                                    fullWidth
                                    label="Capacidade"
                                    value={formData.capacity}
                                    onChange={(e) => handleFormChange('capacity', e.target.value)}
                                    disabled={dialogMode === 'view'}
                                    placeholder="Ex: 6 unidades"
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': { 
                                            borderRadius: 2,
                                            bgcolor: 'white'
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Seção: Imagem e Configurações */}
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhotoIcon /> Imagem e Configurações
                        </Typography>
                        <Grid container spacing={3} alignItems="flex-start">
                            <Grid item size={{xs: 12, md: 6}}>
                                <TextField
                                    fullWidth
                                    label="URL da Imagem (opcional)"
                                    value={formData.image && !formData.image.startsWith('data:') ? formData.image : ''}
                                    onChange={(e) => handleFormChange('image', e.target.value)}
                                    disabled={dialogMode === 'view'}
                                    placeholder="/images/produto.webp"
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': { 
                                            borderRadius: 2,
                                            bgcolor: 'white'
                                        }
                                    }}
                                />
                                
                                {/* Botão de Upload de Imagem */}
                                {dialogMode !== 'view' && (
                                    <Box sx={{ mt: 2 }}>
                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="image-upload-button"
                                            type="file"
                                            onChange={handleImageFileSelect}
                                        />
                                        <label htmlFor="image-upload-button">
                                            <Button
                                                variant="outlined"
                                                component="span"
                                                startIcon={<CloudUploadIcon />}
                                                fullWidth
                                                sx={{ 
                                                    borderRadius: 2,
                                                    py: 1.5,
                                                    borderStyle: 'dashed',
                                                    borderWidth: 2,
                                                    borderColor: 'primary.main',
                                                    color: 'primary.main',
                                                    '&:hover': {
                                                        borderColor: 'primary.dark',
                                                        bgcolor: 'primary.50'
                                                    }
                                                }}
                                            >
                                                Escolher Imagem do Computador
                                            </Button>
                                        </label>
                                        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary', textAlign: 'center' }}>
                                            Formatos aceitos: JPG, PNG, WebP. Máximo 5MB
                                        </Typography>
                                        {selectedImageFile && (
                                            <Typography variant="body2" sx={{ mt: 1, color: 'success.main', textAlign: 'center' }}>
                                                📁 {selectedImageFile.name}
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                            </Grid>
                            
                            <Grid item size={{xs: 12, md: 3}}>
                                <Paper sx={{ 
                                    p: 2, 
                                    textAlign: 'center',
                                    bgcolor: 'white',
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'grey.200'
                                }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.available}
                                                onChange={(e) => handleFormChange('available', e.target.checked)}
                                                disabled={dialogMode === 'view'}
                                                color="primary"
                                                size="large"
                                            />
                                        }
                                        label={
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                    {formData.available ? '✅ Disponível' : '❌ Indisponível'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Produto visível na loja
                                                </Typography>
                                            </Box>
                                        }
                                        labelPlacement="bottom"
                                        sx={{ m: 0 }}
                                    />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Paper>
                </DialogContent>
                
                <DialogActions sx={{ 
                    p: 4, 
                    gap: 2,
                    borderTop: '1px solid',
                    borderColor: 'grey.200',
                    bgcolor: 'grey.50'
                }}>
                    <Button 
                        onClick={closeDialog}
                        startIcon={<CancelIcon />}
                        size="large"
                        sx={{ 
                            borderRadius: 2,
                            px: 3,
                            py: 1.5,
                            fontWeight: 600
                        }}
                    >
                        {dialogMode === 'view' ? 'Fechar' : 'Cancelar'}
                    </Button>
                    
                    {dialogMode !== 'view' && (
                        <Button
                            onClick={handleSave}
                            variant="contained"
                            disabled={loading}
                            startIcon={loading ? null : <SaveIcon />}
                            size="large"
                            sx={{ 
                                borderRadius: 2,
                                px: 4,
                                py: 1.5,
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                '&:hover': {
                                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                                    transform: 'translateY(-1px)'
                                },
                                '&:disabled': {
                                    background: 'grey.400'
                                }
                            }}
                        >
                            {(() => {
                                if (loading) {
                                    return (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box
                                                sx={{
                                                    width: 20,
                                                    height: 20,
                                                    border: '2px solid',
                                                    borderColor: 'white',
                                                    borderTopColor: 'transparent',
                                                    borderRadius: '50%',
                                                    animation: 'spin 1s linear infinite',
                                                    '@keyframes spin': {
                                                        '0%': { transform: 'rotate(0deg)' },
                                                        '100%': { transform: 'rotate(360deg)' }
                                                    }
                                                }}
                                            />
                                            Salvando...
                                        </Box>
                                    );
                                }
                                return dialogMode === 'create' ? 'Criar Produto' : 'Salvar Alterações';
                            })()}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    sx={{ borderRadius: 2 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProductsAdminPage;
