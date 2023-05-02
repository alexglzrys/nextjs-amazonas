import bcrypt from 'bcryptjs';

const data = {
    users: [
        {
            name: 'Alex',
            email: 'alex@correo.com',
            password: bcrypt.hashSync('123456'),
            isAdmin: true,
        },
        {
            name: 'Florencia',
            email: 'flor@correo.com',
            password: bcrypt.hashSync('123456'),
            isAdmin: false,
        }
    ],
    products: [
        {
            name: 'Playera 01',
            slug: 'playera-01',
            category: 'Playeras',
            image: '/images/playera-01.jpg',
            price: 590,
            brand: 'Nike',
            rating: 4.5,
            numReviews: 8,
            countInStock: 5,
            description: 'Playera unitalla para caballero'
        },
        {
            name: 'Playera 02',
            slug: 'playera-02',
            category: 'Playeras',
            image: '/images/playera-02.jpg',
            price: 590,
            brand: 'Nike',
            rating: 4.5,
            numReviews: 8,
            countInStock: 25,
            description: 'Playera unitalla para caballero'
        },
        {
            name: 'Playera 03',
            slug: 'playera-03',
            category: 'Playeras',
            image: '/images/playera-03.jpg',
            price: 590,
            brand: 'Nike',
            rating: 4.5,
            numReviews: 8,
            countInStock: 25,
            description: 'Playera unitalla para caballero'
        },
        {
            name: 'Tenis 01',
            slug: 'tenis-01',
            category: 'Tenis',
            image: '/images/tenis-01.jpg',
            price: 590,
            brand: 'Nike',
            rating: 4.5,
            numReviews: 8,
            countInStock: 25,
            description: 'Tenis unitalla para caballero'
        },
        {
            name: 'Tenis 02',
            slug: 'tenis-02',
            category: 'Tenis',
            image: '/images/tenis-02.jpg',
            price: 590,
            brand: 'Nike',
            rating: 4.5,
            numReviews: 8,
            countInStock: 25,
            description: 'Tenis unitalla para caballero'
        },
        {
            name: 'Tenis 03',
            slug: 'tenis-03',
            category: 'Tenis',
            image: '/images/tenis-03.jpg',
            price: 590,
            brand: 'Nike',
            rating: 4.5,
            numReviews: 8,
            countInStock: 25,
            description: 'Tenis unitalla para caballero'
        }
    ]
}

export default data;