define([
    "./model",
    "Cookies"
], function (Model, Cookies) {

    var Login = Model.extend({
        isLoggedIn: function () {
            return !!Cookies.get("SESSIONID");
        }
    });

    return new Login();

});