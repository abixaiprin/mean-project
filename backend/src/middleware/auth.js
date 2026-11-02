const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

function verifyToken(req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Falta el token. Envía Authorization: Bearer <token>' });
  }
  try {
    req.userId = jwt.verify(token, jwtSecret).sub;
    return next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'El token expiró. Inicia sesión de nuevo.' : 'Token inválido';
    return res.status(401).json({ error: msg });
  }
}

module.exports = { verifyToken };
