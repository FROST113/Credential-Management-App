const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
  systemname: {type: String, required: true},
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const credentialRepositorySchema = new mongoose.Schema({
  name: { type: String, required: true},
  division: { type: mongoose.Schema.Types.ObjectId, ref: 'Division', required: true },
  credentials: [credentialSchema],
});

module.exports = mongoose.model('CredentialRepository', credentialRepositorySchema);
