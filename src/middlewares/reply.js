
module.exports.deliver = (req, res, next) => {
    res.deliver = (content, body) => {
        return res.status(content.code).json(body || content.msg);
    };
    next();
};
