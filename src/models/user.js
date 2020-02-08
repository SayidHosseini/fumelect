const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const _ = require('underscore');

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        index: true,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        lowercase: true
    },
    verified: {
        type: Boolean,
        required: true
    }
});

// TODO: Modify structure to use objects instead of method parameters

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.updateOrCreateSuperAdmin = (adminUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            callback(err, null);
        } else {
            bcrypt.hash(adminUser.password, salt, (err, hash) => {
                if (err) {
                    callback(err, null);
                } else {
                    adminUser.password = hash;
                    const query = { role: adminUser.role };
                    User.updateOne(query,
                        { $set: adminUser },
                        { upsert: true },
                        callback);
                }
            });
        }
    });
};

module.exports.createRecord = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            callback(err, null);
        } else {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) {
                    callback(err, null);
                } else {
                    newUser.password = hash;
                    newUser.save(callback);
                }
            });
        }
    });
};

module.exports.getRecords = (callback) => {
    User.find(callback);
};

module.exports.getRecordByEmail = (email) => {
    const query = { email };
    return User.findOne(query);
};

module.exports.comparePassword = (password, dbPassword, callback) => {
    bcrypt.compare(password, dbPassword, (err, res) => {
        if (res) {
            isMatched = true;
        } else {
            isMatched = false;
        }
        callback(null, isMatched);
    });
};

module.exports.updateRole = (user, role, callback) => {
    user.role = role;
    user.save(callback);
};

module.exports.changePassword = (user, newPassword, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            callback(err, null);
        } else {
            bcrypt.hash(newPassword, salt, (err, hash) => {
                if (err) {
                    callback(err, null);
                } else {
                    user.password = hash;
                    user.save(callback);
                }
            });
        }
    });
};

module.exports.removeRecordByEmail = (email, callback) => {
    const query = { email };
    User.deleteOne(query, callback);
};
