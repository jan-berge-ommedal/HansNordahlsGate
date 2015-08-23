requirejs.config({
    //urlArgs: new Date().getTime(), // TODO development
    waitSeconds: 15,
    paths: {
        //    jqueryEasing: "js-lib/jquery.easing.min",
        underscore: "js-lib/underscore",
        "backbone-lib": "js-lib/backbone",
        mustache: "js-lib/mustache",
        text: "js-lib/require-plugins/text",
        json: "js-lib/require-plugins/json",
        //    async: "js-lib/require-plugins/async",
        less: "js-lib/require-plugins/less",
        lessc: "js-lib/require-plugins/lessc",
        normalize: "js-lib/require-plugins/normalize"
        //    style: "style",
        //    template: "template",
        //    raw: "data/"
    },
    shim: {
        "backbone-lib": {
            deps: ["jquery", "underscore"]
        }
    }
});

var start = new Date();
requirejs.onResourceLoad = function (context, map, depArray) {
    var duration = new Date() - start;
    console && console.log && console.log("onResourceLoad", duration + "ms", map.id);
};

define("Cookies", ["js-lib/js.cookie"], function (Cookies) {
    return Cookies;
});

define("jquery", function () {
    return jQuery;
});

// Map from CRUD to HTTP for our default `Backbone.sync` implementation.
var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch': 'PATCH',
    'delete': 'DELETE',
    'read': 'GET'
};

define("sync", ["jquery", "app/config", "app/id", "app/error"], function ($, config, idUtil, error) {
    return function (method, model, options) {
        var data;
        var url;

        if ("read" === method) {
            var dataType = model.dataType || (model.get && model.get("dataType"));
            var id = model.id;
            url = config.apiPath + "?" + (id ? "id=" + id + "&" : "") + (dataType ? "dataType=" + dataType + "&" : "");
        } else {
            url = config.apiPath;
            var attributes = options.attrs || model.toJSON(options);
            data = {
                id: attributes.id || idUtil.uuid(),
                dataType: attributes.dataType || model.dataType || (model.get && model.get("dataType")),
                contentType: "application/json",
                data: JSON.stringify(attributes)
            }
        }

        var xhr = $.ajax({
            url: url,
            type: methodMap[method],
            contentType: "application/x-www-form-urlencoded",
            data: data && jQuery.param(data),
            success: options.success,
            error: function () {
                error.ajaxError.apply(this, arguments);
                options.error && options.error.apply(this, arguments);
            }
        });

        model.trigger('request', model, xhr, options);
        return xhr;
    }
});

define("backbone", ["backbone-lib", "jquery", "sync"], function (Backbone, $, sync) {
    Backbone.$ = $;
    Backbone.sync = sync;
    return Backbone;
});