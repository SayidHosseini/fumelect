module.exports = {
    heartbeat: {
        code: 200,
        msg: {
            message: "Authentiq is up and running!"
        }
    },
    noToken: {
        code: 401,
        msg: {
            message: "No token sent!"
        }
    },
    invalidParameters: {
        code: 400,
        msg: {
            message: "Invalid parameters!"
        }
    },
    emailExists: {
        code: 409,
        msg: {
            message: "E-mail already exists!"
        }
    },
    registerSuccess: {
        code: 201,
        msg: {
            message: "Successfully Registered!"
        }
    },
    invalidCredentials: {
        code: 401,
        msg: {
            message: "Invalid credentials!"
        }
    },
    loggedInSuccess: {
        code: 200,
        msg: {
            message: "Successfully logged in!"
        }
    },
    tooManyRequests: {
        code: 429,
        msg: {
            message: "Too many requests! Try again later..."
        }
    },
    sessionInvalid: {
        code: 401,
        msg: {
            message: "Session is expired / invalid!"
        }
    },
    invalidPassword: {
        code: 401,
        msg: {
            message: "Invalid password!"
        }
    },
    loggedIn: {
        code: 200,
        msg: {
            message: "Logged in!"
        }
    },
    changePasswordSuccess: {
        code: 200,
        msg: {
            message: "Successfully Changed password!"
        }
    },
    emailNotFound: {
        code: 404,
        msg: {
            message: "E-mail not found!"
        }
    },
    notAcceptableRole: {
        code: 400,
        msg: {
            message: "Acceptable Roles: 'admin', 'user', 'guest'!"
        }
    },
    notAuthorized: {
        code: 403,
        msg: {
            message: "Not authorized!"
        }
    },
    superAdminChangeRoleFail: {
        code: 403,
        msg: {
            message: "Cannot modify SuperAdmin role!"
        }
    },
    roleNotChanged: {
        code: 200,
        msg: {
            message: "Role is already set!"
        }
    },
    changeRoleSuccess: {
        code: 200,
        msg: {
            message: "Successfully changed role!"
        }
    },
    loggedOutSuccess: {
        code: 200,
        msg: {
            message: "Successfully logged out!"
        }
    },
    userDeletedSuccess: {
        code: 200,
        msg: {
            message: "Successfully deleted user!"
        }
    },
    superAdminDeleteFail: {
        code: 403,
        msg: {
            message: "Cannot delete SuperAdmin user!"
        }
    },
    internalServerError: {
        code: 500,
        msg: {
            message: "Something went wrong on our end! Try again later..."
        }
    }
};
