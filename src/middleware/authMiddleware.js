/*
 * Simple admin authentication middleware
*/
const isAdmin = (req, res, next) => {
  const adminToken = process.env.ADMIN_TOKEN;
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Admin token required'
    });
  }

  const token = authHeader.substring(7);

  if (token !== adminToken) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Invalid admin token'
    });
  }

  next();
};

module.exports = { isAdmin };