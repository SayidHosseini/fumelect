const joi = require('@hapi/joi');
const sn = require('../static/names');

const passwordValidation = joi.string().required().regex(/^[a-zA-Z0-9!@#$%^&*]{8,}$/);
const emailValidation = joi.string().required().email({ minDomainSegments: 2 });
const roleValidation = joi.string().required().valid([sn.adminRole, sn.userRole, sn.guestRole]).insensitive();

module.exports = {
    register: joi.object({
        email: emailValidation,
        password: passwordValidation
    }),
    login: joi.object({
        email: emailValidation,
        password: passwordValidation
    }),
    changePassword: joi.object({
        password: passwordValidation,
        newPassword: passwordValidation
    }),
    changeRole: joi.object({
        email: emailValidation,
        role: roleValidation
    }),
    deleteUser: joi.object({
        password: passwordValidation
    })
};
