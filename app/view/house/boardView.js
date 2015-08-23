define([
    "underscore",
    "app/view",
    "app/collection",
    "app/login",
    "app/router",
    "text!./boardView.mustache",
    "text!./boardViewItem.mustache",
    "less!./boardView"
], function (_, View, Collection, login, Router, template, itemTemplate) {

    function edit() {
        Router.navigateAndTrigger("edit/" + this.member.getId());
        return false;
    }

    function destroy() {
        this.member.destroy();
    }

    var BoardMemberView = View.extend({
        template: itemTemplate,
        className: "col-xs-3 col-centered",

        events: {
            "click .deleteButton": destroy,
            "click .editButton": edit
        },

        initialize: function (options) {
            this.member = options.member;
        },

        render: function () {
            var member = this.member;
            this.renderTemplate(member.toJSON(), {
                loggedIn: login.isLoggedIn(),
                imageUrl: member.getDataDownloadUrl()
            });
            return this;
        }
    });


    return View.extend({
        template: template,

        initialize: function (options) {
            this.house = options.house;
            var houseId = this.houseId = options.houseId;
            var members = this.members = new Collection();
            members.dataType = "house-" + houseId + "-boardMember";
            this.listenTo(members, "add remove", this.render);
            members.fetch();
        },

        render: function () {
            var house = this.house;
            this.renderTemplate({
                housePath: "house/" + house.getId(),
                loggedIn: login.isLoggedIn(),
                houseId: house.get("id"),
                houseName: house.get("name")
            });
            this.$(".members").append(this.members.map(function (member) {
                return new BoardMemberView({
                    member: member
                }).render().$el;
            }));
            return this;
        }

    });

});
