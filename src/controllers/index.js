const rm = require('../static/responseMessages');

module.exports.heartbeat = (req, res, next) => {
    return res.deliver(rm.heartbeat);
};
