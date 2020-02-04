const express = require('express');
const router = express.Router();

const rm = require('../static/responseMessages');

router.get('/heartbeat', function (req, res, next) {
	return res.deliver(rm.heartbeat);
});

module.exports = router;
