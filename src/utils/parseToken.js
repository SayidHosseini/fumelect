const LoggedIn = require('../models/loggedIn');
const User = require('./../models/user');
const rm = require('../static/responseMessages');
const jwt = require('../jwt/jwtService');

module.exports.tokenResponse = async (token, req, res, next) => {
    // TODO: extract email and role, add it to user request for further processing 
    try {
        const result = await LoggedIn.getRecordByToken(token);
        if (!result) {
            res.deliver(rm.notLoggedIn);
            return false;
        }
        if (!result.valid || !validateToken(token)) {
            res.deliver(rm.sessionInvalid);
            return false;
        }
    } catch (err) {
        next(err);
        return false;
    }

    try {
        const user = await User.getUserByEmail(jwt.decode(token).payload.email); // check if user exist
        if (!user) {
            res.deliver(rm.sessionInvalid);
            return false;
        }

    } catch (err) {
        next(err);
        return false;
    }

    return true;
}

const validateToken = (token) => { // checks if the jwt has expired
    const verifyOptions = {
        issuer: jwt.authentiqIssuer,
        audience: jwt.authentiqIssuer
    };

    const legit = jwt.verify(token, verifyOptions);
    currentTime = new Date().getTime() / 1000 | 0;

    if (currentTime > legit.iat && currentTime < legit.exp)
        return true;
    return false;
}
