const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: Number, default: 3 },
  divisions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Division' }],
});

module.exports = mongoose.model('User', userSchema);

