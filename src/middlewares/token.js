const LoggedIn = require('../models/loggedIn');
const jwt = require('../services/jwt');
const sn = require('../static/names')
const rm = require('../static/responseMessages');

module.exports.validate = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.deliver(rm.noToken);
    }

    const token = req.get(sn.authorizationName).split(' ')[1];
    try {
        const record = await LoggedIn.getRecordByToken(token);
        if (!record || !record.valid || !jwt.verify(token)) {
            return res.deliver(rm.sessionInvalid);
        }
    } catch (err) {
        return next(err);
    }
    next();
};
