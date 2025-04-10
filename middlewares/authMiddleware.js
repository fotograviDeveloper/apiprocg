const passport = require('passport');

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

module.exports = { authenticate, authorize };