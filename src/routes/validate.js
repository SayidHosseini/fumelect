const express = require('express');
const router = express.Router();

const User = require('../models/user');
const jwt = require('../jwt/jwtService');
const rm = require('../static/responseMessages');
const sn = require('../static/names');

router.get('/token', (req, res, next) => {
    const token = req.get(sn.authorizationName).split(' ')[1]; // Extract the token from Bearer
    User.getUserByEmail(jwt.decode(token).payload.email).then((user) => {
        if (!user) {
            return res.deliver(rm.emailNotFound);
        }

        const body = {
            [sn.message]: rm.loggedIn.msg.message,
            [sn.userID]: user._id,
            [sn.email]: user.email
        };
        return res.deliver(rm.loggedIn);
    }).catch((err) => {
        return next(err);
    });
});

module.exports = router;
