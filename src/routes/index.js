const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');

router.get('/heartbeat', indexController.heartbeat);

module.exports = router;
