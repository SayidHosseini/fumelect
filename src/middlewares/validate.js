const joi = require('@hapi/joi');
const schemas = require('../utils/validationSchema');
const LoggedIn = require('../models/loggedIn');
const jwt = require('../services/jwt');
const rm = require('../static/responseMessages');

const validateToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        res.deliver(rm.noToken);
        return false;
    }

    const token = req.get('authorization').split(' ')[1];
    try {
        const record = await LoggedIn.getRecordByToken(token);
        if (!record || !record.valid || !jwt.verify(token)) {
            res.deliver(rm.sessionInvalid);
            return false;
        }
    } catch (err) {
        next(err);
        return false;
    }

    req.token = token;
    return true;
};

const validateParams = (schema, req, res, next) => {
    const { error } = joi.validate(req.body, schema);
    if (error) {
        res.deliver(rm.invalidParameters);
        return false;
    }
    return true;
};


module.exports.register = (req, res, next) => {
    if (validateParams(schemas.register, req, res, next)) {
        next();
    }
};

module.exports.login = (req, res, next) => {
    if (validateParams(schemas.login, req, res, next)) {
        next();
    }

};

module.exports.token = async (req, res, next) => {
    if (await validateToken(req, res, next)) {
        next();
    }
};

module.exports.changePassword = async (req, res, next) => {
    if (await validateToken(req, res, next) &&
        validateParams(schemas.changePassword, req, res, next)) {
        next();
    }
};

module.exports.listUsers = async (req, res, next) => {
    if (await validateToken(req, res, next)) {
        next();
    }
};

module.exports.getRole = async (req, res, next) => {
    if (await validateToken(req, res, next)) {
        next();
    }
};

module.exports.changeRole = async (req, res, next) => {
    if (await validateToken(req, res, next) &&
        validateParams(schemas.changeRole, req, res, next)) {
        next();
    }
};

module.exports.logout = async (req, res, next) => {
    if (await validateToken(req, res, next)) {
        next();
    }
};

module.exports.deleteUser = async (req, res, next) => {
    if (await validateToken(req, res, next) &&
        validateParams(schemas.deleteUser, req, res, next)) {
        next();
    }
};
