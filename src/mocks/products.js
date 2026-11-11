import chocolateCake from '../assets/chocolate-cake.png';
import coconutCake from '../assets/coconut-cake.png';
import oreoCookieCake from '../assets/oreo-cookie-cake.png';
import passionFruitCake from '../assets/passion-fruit-cake.png';
import whiteChocolateCake from '../assets/white-chocolate-cake.png';

export const categories = [
    {
        id: 1,
        name: 'Bolos Caseiros',
        imageUrl: chocolateCake,
        link: 'Produtos',
    },

    {
        id: 2,
        name: 'Bolos de Pote',
        imageUrl: whiteChocolateCake,
        link: 'Produtos',
    },
];

export const products = [
    {
        id: 1,
        name: 'Coco Ralado',
        description: 'Delicioso bolo sabor coco ralado.',
        price: 19.99,
        imageUrl: coconutCake,
        link: 'Produto',
    },

    {
        id: 2,
        name: 'Biscoito Oreo',
        description: 'Delicioso bolo de pote sabor biscoito oreo.',
        price: 40.0,
        imageUrl: oreoCookieCake,
        link: 'Produto',
    },

    {
        id: 3,
        name: 'Chocolate Branco',
        description: 'Delicioso bolo de pote sabor chocolate branco.',
        price: 29.99,
        imageUrl: whiteChocolateCake,
        link: 'Produto',
    },

    {
        id: 4,
        name: 'Bolos Caseiros',
        description: 'Delicioso bolo sabor chocolate.',
        price: 23.9,
        imageUrl: chocolateCake,
        link: 'Produto',
    },

    {
        id: 5,
        name: 'Maracujá',
        description: 'Delicioso bolo de pote sabor maracujá com um toque especial de canela.',
        price: 35.9,
        imageUrl: passionFruitCake,
        link: 'Produto',
    },
];

const favoriteProductIds = [2, 1, 3];

export const favorites = favoriteProductIds.map((id) => products.find((product) => product.id === id)).filter(Boolean);
