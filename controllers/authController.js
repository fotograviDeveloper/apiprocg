const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { BlacklistedToken } = require('../models');

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Validación básica
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Todos los campos son requeridos'
        });
      }

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'El email ya está registrado'
        });
      }

      // Crear usuario
      const user = await User.create({
        username,
        email,
        password,
        role: 'user',
        isActive: true
      });

      // Generar token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Excluir la contraseña en la respuesta
      const userResponse = user.get({ plain: true });
      delete userResponse.password;

      res.status(201).json({
        success: true,
        data: userResponse,
        token
      });

    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        success: false,
        error: 'Error al registrar usuario',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validación básica
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email y contraseña son requeridos'
        });
      }

      // Buscar usuario
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Credenciales inválidas'
        });
      }

      // Verificar contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Credenciales inválidas'
        });
      }

      // Generar token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Excluir la contraseña en la respuesta
      const userResponse = user.get({ plain: true });
      delete userResponse.password;

      res.json({
        success: true,
        token,
        data: userResponse
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        error: 'Error al iniciar sesión',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Controlador de logout
  logout: (req, res) => {
    // En JWT, el logout se maneja principalmente en el frontend
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente. Elimina el token en el cliente.'
    });
  }
};

module.exports = authController;