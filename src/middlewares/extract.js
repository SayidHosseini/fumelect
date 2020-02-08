const User = require('../models/user');
const jwt = require('../services/jwt');

module.exports.userByToken = async (req, res, next) => {
    req.user = await User.getUserByEmail(jwt.decode(req.token).payload.email);
    next();
};

module.exports.userByEmail = async (req, res, next) => {
    req.bodyUser = await User.getUserByEmail(req.body.email);
    next();
};
