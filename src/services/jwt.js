const fs = require('fs');
const jwt = require('jsonwebtoken');

// use 'utf8' to get string instead of byte array  (512 bit key)
const privateKEY = fs.readFileSync('./keys/private.key', 'utf8');
const publicKEY = fs.readFileSync('./keys/public.key', 'utf8');

const authentiqServerIssuer = "Authentiq Server";
const authentiqClientIssuer = "Authentiq Client";
const authentiqTokenSubject = "Authentiq Access Token";
const validityPeriod = "1d";
const signAlgorithm = "RS256";

const sign = (email) => {
    const payload = { email };
    const signOptions = {
        issuer: authentiqServerIssuer,
        subject: authentiqTokenSubject,
        audience: authentiqClientIssuer,
        expiresIn: validityPeriod,
        algorithm: signAlgorithm
    };
    return jwt.sign(payload, privateKEY, signOptions);
};

const verify = (token) => {
    const verifyOptions = {
        issuer: authentiqServerIssuer,
        subject: authentiqTokenSubject,
        audience: authentiqClientIssuer,
        expiresIn: validityPeriod,
        algorithm: [signAlgorithm]
    };

    try {
        const legit = jwt.verify(token, publicKEY, verifyOptions);
        currentTime = new Date().getTime() / 1000 | 0;
        return (currentTime > legit.iat && currentTime < legit.exp);
    } catch (err) {
        return false;
    }
};

const decode = (token) => { // returns null if token is invalid
    return jwt.decode(token, { complete: true });
};


module.exports = { sign, verify, decode };
