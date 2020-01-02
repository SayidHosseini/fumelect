module.exports = {
    dbURL: "mongodb://db:27017/authentiq",
    AuthenticationList: [{
        method: "GET",
        url: "/authentiq/v1/validate/token"
    }, {
        method: "PUT",
        url: "/authentiq/v1/user/changePassword"
    }, {
        method: "GET",
        url: "/authentiq/v1/user/list"
    }, {
        method: "GET",
        url: "/authentiq/v1/user/role"
    }, {
        method: "PUT",
        url: "/authentiq/v1/user/role"
    }, {
        method: "DELETE",
        url: "/authentiq/v1/user/logout"
    }, {
        method: "DELETE",
        url: "/authentiq/v1/user/delete"
    }]
};