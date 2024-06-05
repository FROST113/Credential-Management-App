const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  roleId: {type: Number, required: true, unique: true },
  rolename: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Roles', roleSchema);