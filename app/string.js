define(["underscore"], function (_) {

    return {
        notNullOrEmpty: function (string) {
            return string && _.isString(string) && string.length;
        }
    }

});