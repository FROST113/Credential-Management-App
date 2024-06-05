const express = require('express');
const router = express.Router();
const divisionController = require('../controllers/divisionController');

router.get('/divisions', divisionController.getDivisions);

module.exports = router;
