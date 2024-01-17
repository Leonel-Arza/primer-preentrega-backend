const express = require('express');
const router = express.Router();


let productsDB = [];


function generateProductId() {
    return productsDB.length + 1; 
}

router.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const newProduct = {
        id: generateProductId(),
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || [],
    };

    productsDB.push(newProduct);

    res.json({ message: 'Producto agregado correctamente', data: newProduct });
});


router.get('/', (req, res) => {
    res.json({ products: productsDB });
});

router.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = productsDB.find((p) => p.id === productId);

    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ product });
});


router.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const productIndex = productsDB.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }


    const updatedProduct = {
        ...productsDB[productIndex],
        ...req.body,
        id: productId, 
    };


    productsDB[productIndex] = updatedProduct;

    res.json({ message: 'Producto actualizado correctamente', data: updatedProduct });
});

router.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const productIndex = productsDB.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }


    const deletedProduct = productsDB.splice(productIndex, 1)[0];

    res.json({ message: 'Producto eliminado correctamente', data: deletedProduct });
});

module.exports = router;
