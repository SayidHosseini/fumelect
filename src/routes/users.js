const express = require('express');
const router = express.Router();
const joi = require('@hapi/joi');
const _ = require('underscore');
const schemas = require('../utils/validationSchema');
const User = require('../models/user');
const LoggedIn = require('../models/loggedIn');
const jwt = require('../services/jwt');
const token = require('../middlewares/token');
const extract = require('../middlewares/extract');
const rm = require('../static/responseMessages');
const sn = require('../static/names');

router.post('/register', (req, res, next) => {
    const { error } = joi.validate(req.body, schemas.register);
    if (error) {
        return res.deliver(rm.invalidParameters);
    }

    const { email, password } = req.body;
    const newUser = new User({
        email,
        password,
        role: sn.userRole,
        verified: false
    });

    User.createUser(newUser, (err, user) => {
        if (err || !user) {
            if (err.code === sn.duplicateError) {
                return res.deliver(rm.emailExists);
            }
            return next(err);
        }

        const token = jwt.sign(email);
        const newLoggedIn = new LoggedIn({
            token,
            userID: user._id,
        });

        LoggedIn.createLoggedIn(newLoggedIn, (err) => {
            if (err) {
                return next(err);
            }

            const body = {
                token,
                user: _.pick(user, ['id', 'email', 'role']),
                message: rm.registerSuccess.msg.message
            };
            return res.deliver(rm.registerSuccess, body);
        });
    });
});

router.post('/login', extract.userByEmail, (req, res, next) => {
    const { error } = joi.validate(req.body, schemas.login);
    if (error) {
        return res.deliver(rm.invalidParameters);
    }
    if (!req.bodyUser) {
        return res.deliver(rm.invalidCredentials);
    }

    const { id, email, password } = req.bodyUser;
    // TODO: Make this part reusable and use it in Register    
    User.comparePassword(req.body.password, password, (err) => {
        if (err) {
            return next(err);
        }
        if (!isMatched) {
            return res.deliver(rm.invalidCredentials);
        }

        const token = jwt.sign(email);
        const newLoggedIn = new LoggedIn({ token, userID: id });
        LoggedIn.createLoggedIn(newLoggedIn, (err) => {
            if (err) {
                if (err.code === sn.duplicateError) {
                    return res.deliver(rm.tooManyRequests);
                }
                return next(err);
            }

            return res.deliver(rm.loggedInSuccess, { token });
        });
    });
});

router.put('/password', token.validate, extract.userByToken, (req, res, next) => {
    const { error } = joi.validate(req.body, schemas.changePassword);
    if (error) {
        return res.deliver(rm.invalidParameters);
    }

    const { password, newPassword } = req.body;
    User.comparePassword(password, req.user.password, (err) => {
        if (err) {
            return next(err);
        }
        if (!isMatched) {
            return res.deliver(rm.invalidPassword);
        }

        User.changePassword(req.user, newPassword, (err, user) => {
            if (err || !user) {
                return next(err);
            }

            return res.deliver(rm.changePasswordSuccess);
        });
    });
});

router.get('/list', token.validate, (req, res, next) => {
    // TODO: Restrict to admin users only
    User.getUsers((err, result) => {
        if (err) {
            return next(err);
        }

        const usersList = result.map(({ id, email, role }) => ({ id, email, role }));
        return res.deliver(rm.loggedIn, { usersList });
    });
});

router.get('/role', token.validate, extract.userByToken, (req, res, next) => {
    const body = _.pick(req.user, ['id', 'email', 'role']);
    return res.deliver(rm.loggedIn, body);
});

router.put('/role', token.validate, extract.userByToken, extract.userByEmail, (req, res, next) => {
    const { error } = joi.validate(req.body, schemas.changeRole);
    if (error) {
        return res.deliver(rm.invalidParameters);
    }

    if (![sn.superAdminRole, sn.adminRole].includes(req.user.role)) {
        return res.deliver(rm.notAuthorized);
    }
    if (!req.bodyUser) {
        return res.deliver(rm.emailNotFound);
    }
    if (req.bodyUser.role === sn.superAdminRole) {
        return res.deliver(rm.superAdminChangeRoleFail);
    }
    if (req.bodyUser.role === req.body.role) {
        return res.deliver(rm.roleNotChanged);
    }

    User.updateRole(req.bodyUser, req.body.role, () => {
        return res.deliver(rm.changeRoleSuccess);
    });
});

router.delete('/logout', token.validate, (req, res, next) => {
    LoggedIn.revokeToken(req.token, (err) => {
        if (err) {
            return next(err);
        }
        return res.deliver(rm.loggedOutSuccess);
    });
});

router.delete('/delete', token.validate, extract.userByToken, (req, res, next) => {
    const { error } = joi.validate(req.body, schemas.deleteUser);
    if (error) {
        return res.deliver(rm.invalidParameters);
    }

    const { id, email, password, role } = req.user;
    User.comparePassword(req.body.password, password, (err) => {
        if (err) {
            return next(err);
        }
        if (!isMatched) {
            return res.deliver(rm.invalidPassword);
        }
        if (role === sn.superAdminRole) {
            return res.deliver(rm.superAdminDeleteFail);
        }

        LoggedIn.revokeAllTokens(id, (err, rec) => {
            if (err || !rec) {
                return next(err);
            }

            User.removeUserByEmail(email, (err, rec) => {
                if (err || !rec) {
                    return next(err);
                }

                return res.deliver(rm.userDeletedSuccess);
            });
        });
    });
});

module.exports = router;
