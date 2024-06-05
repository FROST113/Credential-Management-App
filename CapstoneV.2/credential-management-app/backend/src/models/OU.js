const mongoose = require('mongoose');

const ouSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('OU', ouSchema);
