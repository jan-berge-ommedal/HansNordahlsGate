define([
    "app/view",
    "app/collection",
    "app/router",
    "app/login",
    "app/time",
    "text!./newsView.mustache",
    "text!./newsViewItem.mustache",
    "less!./newsView"
], function (View, Collection, Router, login, time, template, itemTemplate) {

    function edit() {
        Router.navigateAndTrigger("edit/" + this.newsItem.getId());
        return false;
    }

    function destroy() {
        this.newsItem.destroy();
        return false;
    }

    var NewsItemView = View.extend({
        template: itemTemplate,

        events: {
            "click .deleteButton": destroy,
            "click .editButton": edit
        },

        initialize: function (options) {
            this.newsItem = options.newsItem;
        },

        render: function () {
            var newsItem = this.newsItem;
            this.renderTemplate(newsItem.toJSON(), {
                timestampFormatted: time.formatDate(newsItem.getTimestamp()),
                loggedIn: login.isLoggedIn(),
                imageUrl: newsItem.getDataDownloadUrl()
            });
            return this;
        }

    });

    return View.extend({
        template: template,
        className: "houseNews",

        initialize: function (options) {
            var houseId = this.houseId = options.houseId;
            this.house = options.house;

            var news = this.news = new Collection();
            news.dataType = "house-" + houseId + "-news";
            this.listenTo(news, "add remove", this.render);
            news.fetch();
        },

        render: function () {
            var house = this.house;
            this.renderTemplate({
                housePath: "house/" + house.getId(),
                houseId: house.getId(),
                houseName: house.getName(),
                loggedIn: login.isLoggedIn()
            });
            var news = this.news.map(function (newsItem) {
                return new NewsItemView({
                    newsItem: newsItem
                }).render().$el;
            });
            if (news.length) {
                this.$(".news").empty().append(news);
            }
            return this;
        }

    });

});
