const express = require('express');
const cors = require('cors');
const config = require('./config');
const { connect } = require('./database');

const app = express();
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '10kb' }));
app.use('/api', require('./routes'));

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno' });
});

connect()
  .then(() => app.listen(config.port, () => console.log(`API en http://localhost:${config.port}/api`)))
  .catch((err) => {
    console.error('No se pudo conectar a MongoDB:', err.message);
    process.exit(1);
  });

module.exports = app;
