const Product = require('../models/Product');

exports.uploadJSON = async (req, res) => {
    try {
        const products = req.body; // Array de productos en JSON
        await Product.insertMany(products);
        res.json({ message: 'Productos cargados correctamente' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
