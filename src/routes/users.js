const express = require('express');
const router = express.Router();

const Joi = require('@hapi/joi');
const schemas = require('../utils/validationSchema');

const User = require('../models/user');
const LoggedIn = require('../models/loggedIn');

const jwt = require('../jwt/jwtService');
const rm = require('../static/responseMessages');
const sn = require('../static/names');

router.post('/register', (req, res, next) => {
    const { error } = Joi.validate(req.body, schemas.register);
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

        // Log the user in automatically
        const payload = { email };
        const signOptions = { subject: email };
        const token = jwt.sign(payload, signOptions);
        const newLoggedIn = new LoggedIn({
            [sn.userID]: user._id,
            token
        });

        LoggedIn.createLoggedIn(newLoggedIn, (err) => {
            if (err) {
                return next(err);
            }

            const body = {
                [sn.message]: rm.registerSuccessful.msg.message,
                [sn.user]: {
                    [sn.userID]: user._id,
                    [sn.email]: user.email,
                    [sn.role]: user.role
                },
                token
            };
            return res.deliver(rm.registerSuccessful, body);
        });
    });
});

router.post('/login', (req, res, next) => {
    const { error } = Joi.validate(req.body, schemas.login);
    if (error) {
        return res.deliver(rm.invalidParameters);
    }

    const { email, password } = req.body;

    // TODO: Make this part reusable and use it in Register    
    User.getUserByEmail(email).then((user) => {
        if (!user) {
            return res.deliver(rm.invalidUserPass);
        }
        User.comparePassword(password, user.password, (err) => {
            if (err) {
                return next(err);
            }
            if (!isMatched) {
                return res.deliver(rm.invalidUserPass);
            }

            const payload = { email };
            const signOptions = { subject: email };
            const token = jwt.sign(payload, signOptions);
            const newLoggedIn = new LoggedIn({
                [sn.userID]: user._id,
                token
            });

            LoggedIn.createLoggedIn(newLoggedIn, (err) => {
                if (err) {
                    if (err.code === sn.duplicateError) {
                        return res.deliver(rm.tooManyRequests);
                    }
                    return next(err);
                }

                const body = { token };
                return res.deliver(rm.loggedInSuccess, body);
            });
        });
    }).catch((err) => {
        return next(err);
    });
});

router.put('/password', (req, res, next) => {
    const { error } = Joi.validate(req.body, schemas.changePassword);
    if (error) {
        return res.deliver(rm.invalidParameters);
    }

    const token = req.get(sn.authorizationName).split(' ')[1]; // Extract the token from Bearer
    const { email } = jwt.decode(token).payload;
    const { password, newPassword } = req.body;

    User.getUserByEmail(email).then((user) => {
        if (!user) {
            return res.deliver(rm.emailNotFound);
        }

        User.comparePassword(password, user.password, (err) => {
            if (err) {
                return next(err);
            }
            if (!isMatched) {
                return res.deliver(rm.invalidPassword);
            }

            User.changePassword(user, newPassword, (err, user) => {
                if (err || !user) {
                    return next(err);
                }

                return res.deliver(rm.changePasswordSuccess);
            });
        });
    }).catch((err) => {
        return next(err);
    });
});

router.get('/list', (req, res, next) => {
    // TODO: Restrict to admin users only

    User.getUsers((err, result) => {
        if (err) {
            return next(err);
        }

        const body = { usersList: [] };

        result.forEach(({
            _id,
            email,
            role
        }) => {
            const user = {
                [sn.userID]: _id,
                [sn.email]: email,
                [sn.role]: role
            };

            body.usersList.push(user);
        });

        return res.deliver(rm.loggedIn, body);
    });
});

router.get('/role', (req, res, next) => {
    // TODO: Make this part reusable and use it in token validation
    // TODO: Make Get Role more flexible by accepting emails in request and checking their role

    const token = req.get(sn.authorizationName).split(' ')[1]; // Extract the token from Bearer
    User.getUserByEmail(jwt.decode(token).payload.email).then((user) => {
        if (!user) {
            return res.deliver(rm.emailNotFound);
        }

        const body = {
            [sn.userID]: user._id,
            [sn.email]: user.email,
            [sn.role]: user.role
        };
        return res.deliver(rm.loggedIn, body);
    }).catch((err) => {
        return next(err);
    });
});

router.put('/role', (req, res, next) => {
    const { error } = Joi.validate(req.body, schemas.changeRole);
    if (error) {
        return res.deliver(rm.invalidParameters);
    }

    const { email, role } = req.body;
    const token = req.get(sn.authorizationName).split(' ')[1]; // Extract the token from Bearer

    User.getUserByEmail(jwt.decode(token).payload.email).then((tokenUser) => { // get the user of token
        if (!tokenUser) {
            return res.deliver(rm.emailNotFound);
        }
        if (![sn.superAdminRole, sn.adminRole].includes(tokenUser.role)) { // check if the requester is actually an admin pr
            return res.deliver(rm.notAuthorized);
        }
        if (role !== sn.adminRole && role !== sn.userRole && role !== sn.guestRole) {
            return res.deliver(rm.notAcceptableRole);
        }
        User.getUserByEmail(email).then((requestUser) => { // get the user of email
            if (!requestUser) {
                return res.deliver(rm.emailNotFound);
            }
            if (requestUser.role === sn.superAdminRole) {
                return res.deliver(rm.superAdminChangeRoleFail);
            }
            if (requestUser.role === role) {
                return res.deliver(rm.roleNotChanged);
            }

            User.updateRole(requestUser, role, () => {
                return res.deliver(rm.changeRoleSuccess);
            });
        }).catch((err) => {
            return next(err);
        });
    }).catch((err) => {
        return next(err);
    });
});

router.delete('/logout', (req, res, next) => {
    const token = req.get(sn.authorizationName).split(' ')[1]; // Extract the token from Bearer
    LoggedIn.revokeToken(token, (err) => {
        if (err) {
            return next(err);
        }
        return res.deliver(rm.loggedOutSuccess);
    });
});

router.delete('/delete', (req, res, next) => {
    const { error } = Joi.validate(req.body, schemas.deleteUser);
    if (error) {
        return res.deliver(rm.invalidParameters);
    }

    const token = req.get(sn.authorizationName).split(' ')[1]; // Extract the token from Bearer
    const { email } = jwt.decode(token).payload;
    const { password } = req.body;

    User.getUserByEmail(email).then((user) => {
        if (!user) {
            return res.deliver(rm.emailNotFound);
        }

        User.comparePassword(password, user.password, (err) => {
            if (err) {
                return next(err);
            }
            if (!isMatched) {
                return res.deliver(rm.invalidPassword);
            }
            if (user.role === sn.superAdminRole) {
                return res.deliver(rm.superAdminDeleteFail);
            }

            LoggedIn.revokeAllTokens(user._id, (err, rec) => {
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
    }).catch((err) => {
        return next(err);
    });
});

module.exports = router;
