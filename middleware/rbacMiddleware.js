const { verifyToken } = require('../utils/jwtUtils');

// Define your role hierarchy (roles with higher indexes have more privileges)
const roleHierarchy = {
  'Town': 1,
  'ZoneAdmin': 2,
  'RegionAdmin': 3,
  'RootAdmin':4
};

const rbacMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    try {
      
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ 
          success: false,
          message: 'Access denied. No token provided.' 
        });
      }

     
      const decoded = verifyToken(token);
      req.user = decoded;

      
      if (roleHierarchy[decoded.role] < roleHierarchy[requiredRole]) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Requires ${requiredRole} role or higher.`
        });
      }

      next();
    } catch (error) {
      console.error('RBAC Middleware Error:', error);
      res.status(401).json({ 
        success: false,
        message: 'Invalid or expired token.' 
      });
    }
  };
};

module.exports = rbacMiddleware;