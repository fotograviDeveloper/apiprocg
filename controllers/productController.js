// controllers/productController.js
const { Product } = require('../models');

// Crear un nuevo producto
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || 'Error al crear el producto'
    });
    const { name, price, sku } = req.body;
if (!name || !price || !sku) {
  return res.status(400).json({
    success: false,
    error: 'Faltan campos requeridos: name, price, sku'
  });
}
  }
};

// Obtener todos los productos
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] } // Excluir campos sensibles
    });
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener los productos'
    });
  }
};

// Obtener producto por ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener el producto'
    });
  }
};

// Obtener producto por SKU
const getProductBySku = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      where: { sku: req.params.sku },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al buscar el producto por SKU'
    });
  }
};

// Actualizar un producto
const updateProduct = async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id }
    });
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }
    
    const updatedProduct = await Product.findByPk(req.params.id);
    res.json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || 'Error al actualizar el producto'
    });
  }
};

// Eliminar un producto (solo admin)
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { id: req.params.id }
    });
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar el producto'
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getProductBySku,
  updateProduct,  // Añadido para coincidir con productRoutes.js
  deleteProduct   // Añadido para coincidir con productRoutes.js
};