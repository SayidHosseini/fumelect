const joi = require('@hapi/joi');
const schemas = require('../utils/validationSchema');
const User = require('../models/user');
const LoggedIn = require('../models/loggedIn');
const jwt = require('../services/jwt');
const rm = require('../static/responseMessages');
const sn = require('../static/names');

const validateToken = async (req, res) => {
    if (!req.headers.authorization) {
        res.deliver(rm.noToken);
        return false;
    }

    const token = req.get('authorization').split(' ')[1];
    const record = await LoggedIn.getRecordByToken(token);
    if (!record || !record.valid || !jwt.verify(token)) {
        res.deliver(rm.sessionInvalid);
        return false;
    }

    req.token = token;
    return true;
};

const validateParams = (schema, req, res) => {
    const { error } = joi.validate(req.body, schema);
    if (error) {
        res.deliver(rm.invalidParameters);
        return false;
    }
    return true;
};

const validatePolicy = (req, res) => {
    if (![sn.superAdminRole, sn.adminRole].includes(req.user.role)) {
        res.deliver(rm.notAuthorized);
        return false;
    }
    return true;
};


module.exports.register = (req, res, next) => {
    if (validateParams(schemas.register, req, res)) {
        next();
    }
};

module.exports.login = async (req, res, next) => {
    if (validateParams(schemas.login, req, res)) {
        req.bodyUser = await User.getRecordByEmail(req.body.email);
        if (!req.bodyUser) {
            return res.deliver(rm.invalidCredentials);
        }
        next();
    }
};

module.exports.token = async (req, res, next) => {
    if (await validateToken(req, res)) {
        next();
    }
};

module.exports.changePassword = async (req, res, next) => {
    if (await validateToken(req, res) &&
        validateParams(schemas.changePassword, req, res)) {
        req.user = await User.getRecordByEmail(jwt.decode(req.token).payload.email);
        next();
    }
};

module.exports.listUsers = async (req, res, next) => {
    if (await validateToken(req, res)) {
        req.user = await User.getRecordByEmail(jwt.decode(req.token).payload.email);
        if (validatePolicy(req, res)) {
            next();
        }
    }
};

module.exports.getRole = async (req, res, next) => {
    if (await validateToken(req, res)) {
        req.user = await User.getRecordByEmail(jwt.decode(req.token).payload.email);
        next();
    }
};

module.exports.changeRole = async (req, res, next) => {
    if (await validateToken(req, res) &&
        validateParams(schemas.changeRole, req, res)) {
        req.bodyUser = await User.getRecordByEmail(req.body.email);
        if (!req.bodyUser) {
            return res.deliver(rm.emailNotFound);
        }

        req.user = await User.getRecordByEmail(jwt.decode(req.token).payload.email);
        if (validatePolicy(req, res)) {
            next();
        }
    }
};

module.exports.logout = async (req, res, next) => {
    if (await validateToken(req, res)) {
        next();
    }
};

module.exports.deleteUser = async (req, res, next) => {
    if (await validateToken(req, res, next) &&
        validateParams(schemas.deleteUser, req, res, next)) {
        req.user = await User.getRecordByEmail(jwt.decode(req.token).payload.email);
        next();
    }
};
