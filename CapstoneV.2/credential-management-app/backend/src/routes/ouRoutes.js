// ouRoutes.js
const express = require('express');
const router = express.Router();
const { getOUs } = require('../controllers/ouController');

router.get('/api/ous', getOUs);

module.exports = router;
