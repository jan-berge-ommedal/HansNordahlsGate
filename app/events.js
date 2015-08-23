define([
    "backbone",
    "underscore"
], function (Backbone, _) {

    var Events = function () {
        _.extend(this, Backbone.Events);
    };
    _.extend(Events, Backbone.Events);
    return Events

});