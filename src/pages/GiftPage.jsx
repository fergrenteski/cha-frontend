// GiftListPage.jsx
import React from 'react';
import { Grid, Container } from '@mui/material';
import GiftCard from '../components/GiftCard';
import giftList from '../data/giftList';

const GiftListPage = () => {
    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Grid container spacing={3} justifyContent="center">
                {giftList.map((gift) => (
                    <Grid item key={gift.id} xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <GiftCard
                            gift={gift}
                            onSelect={(gift, selected) =>
                                console.log("Selecionado:", gift.name, selected)
                            }
                            onFavorite={(gift, favorited) =>
                                console.log("Favoritado:", gift.name, favorited)
                            }
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default GiftListPage;