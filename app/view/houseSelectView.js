define([
    "../view",
    "../events",
    "text!./houseSelectView.mustache",
    "less!./houseSelectView"
], function (View, Events, template) {


    function houseSelected(ev) {
        var $ev = $(ev);
        Events.trigger("houseSelected", 1);
    }

    return View.extend({
        template: template,

        events: {
            "click .house": houseSelected
        },

        render: function () {
            this.renderTemplate();
            return this;
        }

    });

});
