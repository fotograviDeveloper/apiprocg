// filepath: c:\Users\MARKETING\Desktop\apps\api_cg\controllers\productController.js
const { Product } = require('../models');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};