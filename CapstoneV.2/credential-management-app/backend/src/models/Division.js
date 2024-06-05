// backend/src/models/Division.js
const mongoose = require('mongoose');

const divisionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quick_reference: {type: String, required: true, unique:true},
  ou: { type: mongoose.Schema.Types.ObjectId, ref: 'OU', required: true },
});

module.exports = mongoose.model('Division', divisionSchema);
