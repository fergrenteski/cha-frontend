import React, { memo, useMemo } from 'react';
import { Grid } from '@mui/material';
import { FixedSizeList as List } from 'react-window';

const VirtualizedGrid = memo(({ 
    items, 
    renderItem, 
    itemHeight = 300,
    itemsPerRow = 4,
    containerHeight = 600,
    spacing = 2 
}) => {
    // Agrupar itens em linhas
    const rows = useMemo(() => {
        const groupedRows = [];
        for (let i = 0; i < items.length; i += itemsPerRow) {
            groupedRows.push(items.slice(i, i + itemsPerRow));
        }
        return groupedRows;
    }, [items, itemsPerRow]);

    // Componente para renderizar uma linha
    const Row = memo(({ index, style }) => {
        const rowItems = rows[index];
        
        return (
            <div style={style}>
                <Grid container spacing={spacing} sx={{ px: spacing }}>
                    {rowItems.map((item, itemIndex) => (
                        <Grid 
                            key={item.id || item._id || index * itemsPerRow + itemIndex}
                            item 
                            xs={12} 
                            sm={6} 
                            md={3} 
                            sx={{ display: 'flex', justifyContent: 'center' }}
                        >
                            {renderItem(item, index * itemsPerRow + itemIndex)}
                        </Grid>
                    ))}
                </Grid>
            </div>
        );
    });

    Row.displayName = 'VirtualizedRow';

    if (items.length === 0) {
        return null;
    }

    return (
        <List
            height={containerHeight}
            itemCount={rows.length}
            itemSize={itemHeight + (spacing * 8)} // Adicionar espaço para spacing
        >
            {Row}
        </List>
    );
});

VirtualizedGrid.displayName = 'VirtualizedGrid';

export default VirtualizedGrid;
