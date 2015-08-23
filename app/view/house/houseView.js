define([
    "jquery",
    "app/view",
    "app/collection",
    "app/login",
    "text!./houseView.mustache",
    "less!./houseView"
], function ($, View, Collection, login, template) {

    function deleteHouseImage(e) {
        var imageId = $(e.target).attr("data-id");
        this.houseImages.get(imageId).destroy();
        return false;
    }

    return View.extend({
        template: template,

        events: {
            "click .deleteHouseImage": deleteHouseImage
        },

        initialize: function (options) {
            var house = this.house = options.house;
            var houseId = this.houseId = options.houseId;
            var houseImages = this.houseImages = new Collection();
            houseImages.dataType = "house-" + houseId + "-image";
            this.listenTo(houseImages, "add remove", this.render);
            houseImages.fetch();
        },

        render: function () {
            var house = this.house;
            this.renderTemplate({
                loggedIn: login.isLoggedIn(),
                houseName: house.getName(),
                houseId: house.getId(),
                houseImages: this.houseImages.map(function (image, index) {
                    return {
                        id: image.getId(),
                        active: index == 0,
                        index: index,
                        url: image.getDataDownloadUrl()
                    };
                })
            });
            this.$(".carousel").carousel();
            return this;
        }

    });

});
