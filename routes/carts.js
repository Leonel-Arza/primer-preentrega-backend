const express = require('express');
const router = express.Router();


let cartsDB = [];


function generateCartId() {
    return cartsDB.length + 1; 
}

router.post('/', (req, res) => {
    const newCart = {
        id: generateCartId(),
        products: [],
    };

    cartsDB.push(newCart);

    res.json({ message: 'Carrito creado correctamente', data: newCart });
});


router.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = cartsDB.find((c) => c.id === cartId);

    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json({ products: cart.products });
});


router.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = req.body.quantity || 1; 

    const cartIndex = cartsDB.findIndex((c) => c.id === cartId);

    if (cartIndex === -1) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const productIndex = cartsDB[cartIndex].products.findIndex((p) => p.product === productId);

    if (productIndex === -1) {
        cartsDB[cartIndex].products.push({ product: productId, quantity });
    } else {
        cartsDB[cartIndex].products[productIndex].quantity += quantity;
    }

    res.json({ message: 'Producto agregado al carrito correctamente', data: cartsDB[cartIndex] });
});

module.exports = router;
