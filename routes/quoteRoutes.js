// routes/quoteRoutes.js
const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const authMiddleware = require('../middlewares/authMiddleware');

// Crear cotización (restringido, requiere autenticación)
//router.post('/modif', authMiddleware.verifyToken, quoteController.createQuote);

// Obtener todas las cotizaciones (solo para usuarios autenticados)
//router.get('/mof', authMiddleware.verifyToken, quoteController.getAllQuotes);

// Obtener una cotización por ID
//router.get('/:id', authMiddleware.verifyToken, quoteController.getQuoteById);

// Actualizar estado de cotización (ej. de 'draft' a 'approved')
//router.patch('/:id/status', authMiddleware.verifyToken, quoteController.updateQuoteStatus);

// Eliminar cotización por ID
//router.delete('/:id', authMiddleware.verifyToken, quoteController.deleteQuote);

module.exports = router;
