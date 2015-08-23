define([
    "underscore",
    "jquery",
    "app/view",
    "app/config",
    "app/error",
    "./houses",
    "text!./contactFormView.mustache",
    "less!./contactFormView"
], function (_, $, View, config, error, houses, template) {

    function success() {
        this.$(".success").show();
        window.scrollTo(0, 2000);
    }

    function send() {

        var name = this.$(".name").val();
        var email = this.$(".email").val();
        var phone = this.$(".phone").val();
        var message = this.$(".message").val();

        var house = this.house;
        var houseName = house.getName();
        var data = {
            receiptSubjectPrefix: "Kvittering: ",
            receiptBodyPrefix: "Du har sendt inn følgende forespørsel:\n\n",
            to: houseName.toLowerCase().replace(/\s/g,""),
            from: email,
            subject: "Kontaktskjema " + houseName,
            body: "Navn:\n" + name +
            "\n\nEpost:\n" + email +
            "\n\nTelefon:\n" + phone +
            "\n\nMelding:\n" + message
        };

        $.ajax({
            type: "POST",
            url: config.emailPath,
            contentType: "application/x-www-form-urlencoded",
            data: data,
            success: _.bind(success, this),
            error: error.ajaxError
        });
        return false;
    }

    return View.extend({
        template: template,

        events: {
            "submit .contactForm": send
        },

        initialize: function (options) {
            this.house = houses.get(options.houseId);
        },

        render: function () {
            var house = this.house;
            this.renderTemplate({
                housePath: "house/" + house.getId(),
                houseName: house.getName()
            });
            this.$(".success").hide();
            return this;
        }

    });

});
