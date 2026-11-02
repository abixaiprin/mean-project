require('dotenv').config();

const config = {
  port: Number(process.env.PORT) || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mean-auth',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
  corsOrigin: process.env.CORS_ORIGIN || '*',
};

if (!config.jwtSecret) {
  console.error('Falta JWT_SECRET. Copia backend/.env.example como backend/.env y define una clave.');
  process.exit(1);
}

module.exports = config;
