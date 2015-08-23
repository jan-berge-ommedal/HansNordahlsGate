define([
    "app/view",
    "app/collection",
    "app/router",
    "app/login",
    "text!./documentsView.mustache",
    "text!./documentsViewItem.mustache",
    "less!./documentsView"
], function (View, Collection, Router, login, template, itemTemplate) {

    function edit() {
        Router.navigateAndTrigger("edit/" + this.document.getId());
        return false;
    }

    function destroy() {
        this.document.destroy();
        return false;
    }

    var NewsItemView = View.extend({
        template: itemTemplate,

        events: {
            "click .deleteButton": destroy,
            "click .editButton": edit
        },

        initialize: function (options) {
            this.document = options.document;
        },

        render: function () {
            var document = this.document;
            this.renderTemplate(document.toJSON(), {
                loggedIn: login.isLoggedIn(),
                downloadUrl: document.getDataDownloadUrl()
            });
            return this;
        }

    });

    return View.extend({
        template: template,

        initialize: function (options) {
            var houseId = this.houseId = options.houseId;
            this.house = options.house;

            var documents = this.documents = new Collection();
            documents.dataType = "house-" + houseId + "-document";
            this.listenTo(documents, "add remove", this.render);
            documents.fetch();
        },

        render: function () {
            var house = this.house;
            this.renderTemplate({
                housePath: "house/" + house.getId(),
                houseId: house.getId(),
                houseName: house.getName(),
                loggedIn: login.isLoggedIn()
            });
            this.$(".documents").append(this.documents.map(function (document) {
                return new NewsItemView({
                    document: document
                }).render().$el;
            }));
            return this;
        }

    });

});
