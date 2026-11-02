const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
  },
  { timestamps: true }
);

// Las contraseñas se guardan cifradas con bcrypt, nunca en texto plano.
userSchema.pre('save', async function hash(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matches = function matches(plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = model('User', userSchema);
