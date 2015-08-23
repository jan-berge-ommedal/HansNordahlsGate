define([
    "underscore",
    "backbone",
    "mustache"
], function (_, Backbone, Mustache) {

    return Backbone.View.extend({

        render: function () {
            this.renderTemplate();
            return this;
        },

        renderTemplate: function () {
            var templateDataArguments = _.rest(arguments, 0);
            templateDataArguments.unshift({});
            var templateData = _.extend.apply(_, templateDataArguments);
            var template = this.template || "<div>no template</div>";
            var data = templateData || this.templateData || {};
            var render = Mustache.render(this.template, data);
            this.$el.html(render);
            return this;
        },

        hide: function () {
            this.$el.hide();
        },

        show: function () {
            this.$el.show();
        }

    });

});
