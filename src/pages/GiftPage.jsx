// src/pages/GiftListPage.jsx
import React from 'react';
import GiftCard from '../components/GiftCard';
import giftList from '../data/giftList';

const GiftListPage = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            {giftList.map((gift) => (
                <GiftCard
                    key={gift.id}
                    gift={gift}
                    onSelect={(gift, selected) => console.log("Selecionado:", gift.name, selected)}
                    onFavorite={(gift, favorited) => console.log("Favoritado:", gift.name, favorited)}
                />
            ))}
        </div>
    );
};

export default GiftListPage;
