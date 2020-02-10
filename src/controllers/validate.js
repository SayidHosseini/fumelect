const rm = require('../static/responseMessages');

module.exports.token = (req, res, next) => {
    return res.deliver(rm.loggedIn);
};
