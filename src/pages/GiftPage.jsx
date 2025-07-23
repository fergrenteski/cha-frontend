import React, { useState } from 'react';
import { Grid, Container } from '@mui/material';
import GiftCard from '../components/GiftCard';
import giftList from '../data/giftList';
import Header from "../components/Header.jsx";

const GiftListPage = () => {
    const [selectedGifts, setSelectedGifts] = useState([]);

    const handleSelect = (giftId) => {
        setSelectedGifts((prevSelected) =>
            prevSelected.includes(giftId)
                ? prevSelected.filter((id) => id !== giftId)
                : [...prevSelected, giftId]
        );
    };

    return (
        <>
            <Header
                cartItemCount={selectedGifts.length}
                onCartClick={() => {}}
                onProductClick={() => {}}
                onAlbumClick={() => {}}
                onAccountClick={() => {}}
                onFavoritesClick={() => {}}
                onLogoutClick={() => {}}
            />
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Grid container spacing={3} justifyContent="center">
                    {giftList.map((gift) => (
                        <Grid item key={gift.id} xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <GiftCard
                                gift={gift}
                                onSelect={() => handleSelect(gift.id)}
                                isSelected={selectedGifts.includes(gift.id)}
                                onFavorite={null}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    );
};

export default GiftListPage;