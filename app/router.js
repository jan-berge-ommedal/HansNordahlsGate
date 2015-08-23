define([
    "underscore",
    "jquery",
    "backbone",
    "./model",
    "./view/house/houses"
], function (_, $, Backbone, Model, houses) {

    var HouseSelectView;
    var HouseView;
    var LoginView;
    var CreateOrUpdateView;
    var HouseContactFormView;
    var HouseBoardView;
    var ShowHouseItemView;
    var DocumentsView;

    require([
        "app/view/house/houseSelectView",
        "app/view/house/houseView",
        "app/view/loginView",
        "app/view/createOrUpdateView",

        "app/view/house/contactFormView",
        "app/view/house/boardView",
        "app/view/house/newsView",
        "app/view/house/documentsView"
    ], function () {
        HouseSelectView = arguments[0];
        HouseView = arguments[1];
        LoginView = arguments[2];
        CreateOrUpdateView = arguments[3];
        HouseContactFormView = arguments[4];
        HouseBoardView = arguments[5];
        ShowHouseItemView = arguments[6];
        DocumentsView = arguments[7];
    });

    function render(view) {
        $(".mainContainer").empty().append(view.render().$el);
    }

    function house(houseId) {
        var house = houses.get(houseId);
        render(new HouseView({
            house: house,
            houseId: houseId
        }));
    }

    function houseContactForm(houseId) {
        var house = houses.get(houseId);
        render(new HouseContactFormView({
            house: house,
            houseId: houseId
        }));
    }

    function houseBoard(houseId) {
        var house = houses.get(houseId);
        render(new HouseBoardView({
            houseId: house.get("id"),
            house: house
        }));
    }

    function resolveRedirectPath(houseId, itemType) {
        switch (itemType) {
            case "boardMember":
                return "house/" + houseId + "/board";
            case "news":
                return "house/" + houseId + "/news";
            case "document":
                return "house/" + houseId + "/documents";
        }
    }



    function addHouse() {
        render(new CreateOrUpdateView({
            model: new Model({
                dataType: "house"
            })
        }));
    }

    function addHouseItem(houseId, itemType) {
        render(new CreateOrUpdateView({
            redirectPath: resolveRedirectPath(houseId, itemType),
            model: new Model({
                houseId: houseId,
                dataType: "house-" + houseId + "-" + itemType
            })
        }));
    }

    function editItem(id) {
        var model = new Model({id: id});
        model.fetch({
            success: function () {
                render(new CreateOrUpdateView({
                    redirectPath: resolveRedirectPath(model.getHouseId(), model.getItemType()),
                    model: model
                }));
            }
        });
    }

    function houseNews(houseId) {
        var house = houses.get(houseId);
        render(new ShowHouseItemView({
            houseId: houseId,
            house: house
        }));
    }

    function houseDocuments(houseId) {
        var house = houses.get(houseId);
        render(new DocumentsView({
            houseId: houseId,
            house: house
        }));
    }


    function root() {
        render(new HouseSelectView({}));
    }

    function login() {
        render(new LoginView({}));
    }

    var Router = Backbone.Router.extend({

        routes: {
            "house/add": addHouse,
            "house/:houseId": house,
            "house/:houseId/contactForm": houseContactForm,
            "house/:houseId/board": houseBoard,
            "house/:houseId/news": houseNews,
            "house/:houseId/documents": houseDocuments,
            "house/:houseId/add/:type": addHouseItem,
            "edit/:id": editItem,
            "login": login,
            ".*": root
        },

        navigateAndTrigger: function (fragment) {
            this.navigate(fragment, {trigger: true});
        },

        start: function () {
            if (!HouseSelectView) {
                _.defer(_.bind(this.start, this));
            } else {
                Backbone.history.start();
            }
        }

    });

    return new Router();

});
