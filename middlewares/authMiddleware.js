const passport = require('passport');
const jwt = require('jsonwebtoken');

const authenticate = passport.authenticate('jwt', { session: false });

const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    next();
  };
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extrae el token del header "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: 'No autorizado' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Exporta todo junto
module.exports = { authenticate, authorize, verifyToken };