const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { authenticate } = require('../middlewares/authMiddleware');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    
    const userResponse = user.toJSON();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : 'Error en el login',
        user
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) return next(err);
      
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );
      
      return res.json({ token });
    });
  })(req, res, next);
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile
};