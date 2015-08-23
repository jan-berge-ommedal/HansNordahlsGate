define([
    "../view",
    "text!./houseView.mustache",
    "less!./houseView"
], function (View, template) {

    return View.extend({
        template: template,

        render: function () {
            this.renderTemplate();
            return this;
        },

        setHouse: function (houseId) {
            this.houseId = houseId;
            return this;
        }

    });

});
