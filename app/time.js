define([
    "js-lib/jsi18n_patch.js"
], function () {

    var format = {
        "day": "numeric",
        "year": "numeric",
        "month": "numeric"
    };

    return {

        now: function () {
            return new Date().getTime();
        },

        formatDate: function (timestamp) {

            return timestamp ? new Date(timestamp).toLocaleDateString("nb", format) : "";
        }

    }

});
