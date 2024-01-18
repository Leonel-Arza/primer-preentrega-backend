const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/cartDB', { useNewUrlParser: true, useUnifiedTopology: true });

const cartSchema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number
    }]
});

const Cart = mongoose.model('Cart', cartSchema);

router.post('/', async (req, res) => {
    try {
        const newCart = await Cart.create({ products: [] });
        res.json({ message: 'Carrito creado correctamente', data: newCart });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await Cart.findById(cartId).populate('products.product', 'name'); // Assuming 'Product' model with a 'name' field
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json({ products: cart.products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const existingProduct = cart.products.find(p => p.product.toString() === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();

        res.json({ message: 'Producto agregado al carrito correctamente', data: cart });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

module.exports = router;
