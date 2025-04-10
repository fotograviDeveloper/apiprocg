const express = require('express');
const router = express.Router(); // Router de Express, NO del paquete 'router'
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { verifyToken } = require('../middlewares/authMiddleware'); // Importa el middleware

// Ruta de registro simplificada
router.post('/register', (req, res, next) => {
  // Validación básica
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ 
      success: false,
      error: 'Todos los campos son requeridos' 
    });
  }
  
  // Pasar al controlador
  authController.register(req, res, next);
});
// Ruta de login
router.post('/login', authController.login);
router.post('/logout', verifyToken, authController.logout); // <- Nueva ruta

module.exports = router;