const mongoose = require('mongoose');
const config = require('../../config/config');

const LoggedInSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    valid: {
        type: Boolean,
        default: true
    }
});

// TODO: Modify structure to use objects instead of method parameters

const LoggedIn = module.exports = mongoose.model('LoggedIn', LoggedInSchema);

module.exports.createLoggedIn = (newLoggedIn, callback) => {
    newLoggedIn.save(callback);
};

module.exports.getRecordByToken = (token) => {
    const query = { token };
    return LoggedIn.findOne(query);
};

module.exports.revokeToken = async (token, callback) => {
    const query = { token };
    LoggedIn.updateOne(query, { $set: { valid: false } }, callback);
};

module.exports.revokeAllTokens = async (userID, callback) => {
    const query = { userID };
    LoggedIn.updateMany(query, { $set: { valid: false } }, callback);
};
