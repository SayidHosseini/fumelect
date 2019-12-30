const User = require('../src/models/user');
const sn = require('../src/static/names');
const errorMessages = require('./../src/static/errorMessages');

module.exports.create = () => {
    const adminUser = new User({
        email: sn.adminEmail,
        password: sn.adminPassword,
        role: sn.adminRole,
        verified: false
    });
    User.getUserByEmail(adminUser.email).then((user) => { // check to see if admin user exists
        if (!user) {
            User.createUser(adminUser, (err, user) => { // add admin user if doesn't already exist
                if (err) {
                    console.error(errorMessages.createAdminFailedError);
                }
            });
        }
    });
};