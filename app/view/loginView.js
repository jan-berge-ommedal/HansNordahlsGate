define([
    "underscore",
    "jquery",
    "../view",
    "text!./loginView.mustache",
    "less!./loginView"
], function (_, $, View, template) {

    var loginUrl = "/php/login.php";

    function loginInitiated(data) {
        this.$(".loginForm").hide();
        this.$(".loginInitiated").show();
        var parse = JSON.parse(data);
        this.$(".loginEmail").text(parse.email);
    }

    function initiateLogin() {
        $.post(loginUrl, {}, _.bind(loginInitiated, this));
        return false;
    }

    return View.extend({
        template: template,

        events: {
            "submit .loginForm": initiateLogin
        },

        render: function () {
            this.renderTemplate();
            this.$(".loginInitiated").hide();
            return this;
        }

    });

});
