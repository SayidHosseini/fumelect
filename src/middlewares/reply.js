
module.exports.deliver = function(req, res, next) {
    res.deliver = function(content, body) {
        return res.status(content.code).json(body || content.msg);
    };
    next();
};
