const { Router } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { verifyToken } = require('../middleware/auth');
const { jwtSecret, jwtExpiresIn } = require('../config');

const router = Router();
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sign = (user) => jwt.sign({ sub: user._id.toString() }, jwtSecret, { expiresIn: jwtExpiresIn });

function validate(req, res) {
  const { email, password } = req.body || {};
  if (!EMAIL.test(email || '')) return res.status(400).json({ error: 'Correo inválido' }) && null;
  if (!password || password.length < 8) return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' }) && null;
  return { email: email.toLowerCase().trim(), password };
}

router.get('/', (req, res) => res.json({ ok: true, servicio: 'mean-auth-starter' }));

router.post('/signup', async (req, res, next) => {
  try {
    const data = validate(req, res);
    if (!data) return;
    if (await User.exists({ email: data.email })) return res.status(409).json({ error: 'Ese correo ya está registrado' });
    const user = await User.create(data);
    return res.status(201).json({ token: sign(user) });
  } catch (err) { return next(err); }
});

router.post('/signin', async (req, res, next) => {
  try {
    const data = validate(req, res);
    if (!data) return;
    const user = await User.findOne({ email: data.email }).select('+password');
    // Mismo mensaje para correo o contraseña incorrectos: no revela qué cuentas existen.
    if (!user || !(await user.matches(data.password))) return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    return res.json({ token: sign(user) });
  } catch (err) { return next(err); }
});

const sample = [
  { _id: 1, name: 'Diseñar la base de datos', done: true },
  { _id: 2, name: 'Crear el login con JWT', done: true },
  { _id: 3, name: 'Proteger rutas privadas', done: false },
];

router.get('/tasks', (req, res) => res.json(sample));
router.get('/private-tasks', verifyToken, (req, res) => res.json(sample.map((t) => ({ ...t, private: true }))));

router.get('/profile', verifyToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    return res.json({ id: user._id, email: user.email, createdAt: user.createdAt });
  } catch (err) { return next(err); }
});

module.exports = router;
