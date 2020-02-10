const _ = require('underscore');
const jwt = require('../services/jwt');
const User = require('../models/user');
const LoggedIn = require('../models/loggedIn');
const rm = require('../static/responseMessages');
const sn = require('../static/names');

module.exports.register = (req, res, next) => {
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
};

module.exports.login = (req, res, next) => {
    const { id, email, password } = req.bodyUser;

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
};

module.exports.changePassword = (req, res, next) => {
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
};

module.exports.listUsers = (req, res, next) => {
    User.getRecords((err, result) => {
        if (err) {
            return next(err);
        }

        const usersList = result.map(({ id, email, role }) => ({ id, email, role }));
        return res.deliver(rm.loggedIn, { usersList });
    });
};

module.exports.getRole = (req, res, next) => {
    const body = _.pick(req.user, ['id', 'email', 'role']);
    return res.deliver(rm.loggedIn, body);
};

module.exports.setRole = (req, res, next) => {
    if (req.bodyUser.role === sn.superAdminRole) {
        return res.deliver(rm.superAdminChangeRoleFail);
    }
    if (req.bodyUser.role === req.body.role) {
        return res.deliver(rm.roleNotChanged);
    }

    User.updateRole(req.bodyUser, req.body.role, () => {
        return res.deliver(rm.changeRoleSuccess);
    });
};

module.exports.logout = (req, res, next) => {
    LoggedIn.revokeToken(req.token, (err) => {
        if (err) {
            return next(err);
        }
        return res.deliver(rm.loggedOutSuccess);
    });
};

module.exports.deleteUser = (req, res, next) => {
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
};
