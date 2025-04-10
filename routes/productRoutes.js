const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Authenticated routes
router.post('/', authenticate, productController.createProduct);
router.put('/:id', authenticate, productController.updateProduct);

// Admin-only routes
router.delete('/:id', authenticate, authorize('admin'), productController.deleteProduct);

module.exports = router;