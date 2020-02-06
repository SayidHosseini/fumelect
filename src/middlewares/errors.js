const sn = require('../static/names');
const rm = require('../static/responseMessages');

module.exports.notFound = (req, res, next) => {
    res.sendStatus(404);
};

module.exports.unknown = (err, req, res, next) => {
    console.error(err);
    if (process.env.NODE_ENV !== sn.production) {
        return res.contentType('text').status(err.status || 500).send(err.stack);
    }
    return res.status(err.status || rm.internalServerError.code).json(rm.internalServerError.msg);
};
