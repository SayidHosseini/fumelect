const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const validateController = require('../controllers/validate');

router.get('/token', validate.token, validateController.token);

module.exports = router;
