const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/productDB', { useNewUrlParser: true, useUnifiedTopology: true });

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnails: [String],
});

const Product = mongoose.model('Product', productSchema);

router.post('/', async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const newProduct = await Product.create({
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails: thumbnails || [],
        });

        res.json({ message: 'Producto agregado correctamente', data: newProduct });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

router.get('/:pid', async (req, res) => {
    const productId = req.params.pid;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ product });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

router.put('/:pid', async (req, res) => {
    const productId = req.params.pid;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ message: 'Producto actualizado correctamente', data: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;

    try {
        const deletedProduct = await Product.findByIdAndRemove(productId);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ message: 'Producto eliminado correctamente', data: deletedProduct });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;
