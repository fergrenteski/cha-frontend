// Dados das fotos do álbum
export const albumPhotos = [
    {
        id: 1,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1787696212/WhatsApp_Image_2026-08-25_at_19.15.08_hg8tc8.jpg',
    },
    {
        id: 2,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1787696211/WhatsApp_Image_2026-08-25_at_19.15.09_1_wstho7.jpg',
    },
    {
        id: 3,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1787696211/WhatsApp_Image_2026-08-25_at_19.15.08_3_kvfgsq.jpg',
    },
    {
        id: 4,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1787696211/WhatsApp_Image_2026-08-25_at_19.15.09_dcqodt.jpg',
    },
    {
        id: 5,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1787696211/WhatsApp_Image_2026-08-25_at_19.15.08_2_rijcpi.jpg',
    },
    {
        id: 6,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1787696211/WhatsApp_Image_2026-08-25_at_19.15.08_1_ukgqg7.jpg',
    },
];

// Função para embaralhar array
export const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};
