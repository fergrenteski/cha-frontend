// Dados das fotos do álbum
export const albumPhotos = [
    {
        id: 1,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1755961044/IMG_4527_brx6xw.jpg',
    },
    {
        id: 2,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1755961042/IMG_2226_jnhxss.jpg',
    },
    {
        id: 3,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1755961041/IMG_0679_kjxluh.jpg',
    },
    {
        id: 4,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1755961030/IMG_2527_q0ft3h.jpg',
    },
    {
        id: 5,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1755961022/IMG_7215_d0xuuc.jpg',
    },
    {
        id: 6,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1755961019/IMG_6319_dcd22l.jpg',
    },
    {
        id: 7,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1755961019/IMG_0844_ybnmjt.jpg',
    },
    {
        id: 8,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1755961017/IMG_4088_cuclky.jpg',
    },
    {
        id: 9,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1755961016/IMG_3796_nlokjf.jpg',
    },
    {
        id: 10,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1755961016/32985DEE-6C56-4A2A-98B0-76F2D3AB1D81_bjqs2b.jpg',
    },
    {
        id: 11,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1755961016/IMG_6306_pdaykg.jpg',
    },
    {
        id: 12,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1755961015/IMG_0480_x8kukn.jpg',
    },
    {
        id: 13,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1755961015/IMG_6309_liz6mu.jpg',
    },
    {
        id: 14,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1755961012/IMG_6414_v4jbpy.jpg',
    },
    {
        id: 15,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1755961012/IMG_5727_zvkk5z.jpg',
    },
    {
        id: 16,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1755961012/IMG_7266_rbqb6h.jpg',
    },
    {
        id: 17,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1755961005/a246ef49-1a7a-4753-89ee-0d24b1580ae5_evopws.jpg',
    },
    {
        id: 18,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1755961004/0524d712-8e5d-48dc-987f-27ba3672e9f9_stqcyy.jpg',
    },
    {
        id: 19,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1755961004/6A329BD9-1FC8-44BC-A9B6-048496969F3C_t6fcfm.jpg',
    },
    {
        id: 20,
        url: 'https://res.cloudinary.com/dxtyesk50/image/upload/v1755961094/IMG_7160_xqycvq.jpg',
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
