define([
    "underscore",
    "../view",
    "../login",
    "text!./pageView.mustache",
    "less!./pageView"
], function (_, View, login, template) {


    return View.extend({
        template: template,

        initialize: function () {

        },

        render: function () {
            this.renderTemplate({
                isLoggedIn: login.isLoggedIn()
            });
            return this;
        }

    });

});
