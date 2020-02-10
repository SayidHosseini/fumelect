const express = require('express');
const router = express.Router();
const _ = require('underscore');
const User = require('../models/user');
const LoggedIn = require('../models/loggedIn');
const jwt = require('../services/jwt');
const validate = require('../middlewares/validate');
const rm = require('../static/responseMessages');
const sn = require('../static/names');

router.post('/register', validate.register, (req, res, next) => {
    const { email, password } = req.body;
    const newUser = new User({
        email,
        password,
        role: sn.userRole,
        verified: false
    });

    User.createRecord(newUser, (err, user) => {
        if (err || !user) {
            if (err.code === sn.duplicateError) {
                return res.deliver(rm.emailExists);
            }
            return next(err);
        }

        return res.deliver(rm.registerSuccess);
    });
});

router.post('/login', validate.login, (req, res, next) => {
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
        LoggedIn.createRecord(newLoggedIn, (err) => {
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

router.put('/password', validate.changePassword, (req, res, next) => {
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

router.get('/list', validate.listUsers, (req, res, next) => {
    User.getRecords((err, result) => {
        if (err) {
            return next(err);
        }

        const usersList = result.map(({ id, email, role }) => ({ id, email, role }));
        return res.deliver(rm.loggedIn, { usersList });
    });
});

router.get('/role', validate.getRole, (req, res, next) => {
    const body = _.pick(req.user, ['id', 'email', 'role']);
    return res.deliver(rm.loggedIn, body);
});

router.put('/role', validate.changeRole, (req, res, next) => {
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

router.delete('/logout', validate.logout, (req, res, next) => {
    LoggedIn.revokeToken(req.token, (err) => {
        if (err) {
            return next(err);
        }
        return res.deliver(rm.loggedOutSuccess);
    });
});

router.delete('/delete', validate.deleteUser, (req, res, next) => {
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

            User.removeRecordByEmail(email, (err, rec) => {
                if (err || !rec) {
                    return next(err);
                }

                return res.deliver(rm.userDeletedSuccess);
            });
        });
    });
});

module.exports = router;
