import React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Pagination,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack
} from '@mui/material';

const ProductPagination = ({
    pagination,
    onPageChange,
    onItemsPerPageChange,
    itemsPerPage = 20,
    showItemsPerPage = true,
    showSummary = true
}) => {
    const { currentPage, totalPages, totalProducts } = pagination;

    if (totalPages <= 1) {
        return null; // Não mostrar paginação se só há 1 página
    }

    const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalProducts);
    const endItem = Math.min(currentPage * itemsPerPage, totalProducts);

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            mt: 3,
            py: 2
        }}>
            {/* Resumo dos itens */}
            {showSummary && (
                <Typography variant="body2" color="text.secondary">
                    Mostrando {startItem}-{endItem} de {totalProducts} produtos
                </Typography>
            )}

            {/* Controles de paginação */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                {/* Seletor de itens por página */}
                {showItemsPerPage && (
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Por página</InputLabel>
                        <Select
                            value={itemsPerPage}
                            label="Por página"
                            onChange={(e) => onItemsPerPageChange(e.target.value)}
                        >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                        </Select>
                    </FormControl>
                )}

                {/* Paginação */}
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, page) => onPageChange(page)}
                    color="primary"
                    size="medium"
                    showFirstButton
                    showLastButton
                    sx={{
                        '& .MuiPagination-ul': {
                            flexWrap: 'nowrap'
                        }
                    }}
                />
            </Stack>
        </Box>
    );
};

ProductPagination.propTypes = {
    pagination: PropTypes.shape({
        currentPage: PropTypes.number.isRequired,
        totalPages: PropTypes.number.isRequired,
        totalProducts: PropTypes.number.isRequired,
        hasMore: PropTypes.bool
    }).isRequired,
    onPageChange: PropTypes.func.isRequired,
    onItemsPerPageChange: PropTypes.func.isRequired,
    itemsPerPage: PropTypes.number,
    showItemsPerPage: PropTypes.bool,
    showSummary: PropTypes.bool
};

export default ProductPagination;
