define([
    "app/view",
    "app/collection",
    "app/router",
    "app/login",
    "./houses",
    "text!./houseSelectView.mustache",
    "text!./houseSelectViewItem.mustache",
    "less!./houseSelectView"
], function (View, Collection, Router, login, houses, template, itemTemplate) {

    function houseSelected() {
        var houseId = this.house.getId();
        Router.navigateAndTrigger("house/" + houseId);
        return false;
    }

    function edit() {
        Router.navigateAndTrigger("edit/" + this.house.getId());
        return false;
    }

    function destroy() {
        this.house.destroy();
        return false;
    }

    var HouseView = View.extend({
        template: itemTemplate,

        events: {
            "click .deleteButton": destroy,
            "click .editButton": edit,
            "click .theHouse": houseSelected
        },

        initialize: function (options) {
            this.columnClass = options.columnClass;
            this.house = options.house;
        },

        render: function () {
            var house = this.house;
            this.$el.addClass("house pointer " + this.columnClass);
            this.renderTemplate(house.toJSON(), {
                loggedIn: login.isLoggedIn(),
                imageUrl: house.getDataDownloadUrl()
            });
            return this;
        }

    });


    return View.extend({
        template: template,

        initialize: function () {
            this.listenTo(houses, "add remove sync", this.render);
        },

        render: function () {
            this.renderTemplate({
                loggedIn: login.isLoggedIn()
            });
            var columns = Math.max(Math.min(houses.length, 4), 2);
            var columnClass = "col-lg-" + (12 / columns);
            var $houses = this.$(".houses");
            $houses.empty().append(houses.map(function (house) {
                return new HouseView({
                    columnClass: columnClass,
                    house: house
                }).render().$el;
            }));
            if (houses.length == 1) { // this case is not handled well by the template
                $houses.prepend("<div class=\"col-lg-3\"/>");
                $houses.append("<div class=\"col-lg-3\"/>");
            }
            return this;
        }

    });

});
