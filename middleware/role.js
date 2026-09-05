const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Insufficient permissions.',
        errorCode: 'FORBIDDEN_ERROR'
      });
    }
    next();
  };
};

module.exports = authorize;
