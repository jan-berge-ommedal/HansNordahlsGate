require(["require", "config"], function (require) {
    require([
        "app/view/pageView",
        "app/router",
        "less!app/common"
    ], function (PageView, Router) {
        new PageView({el: document.body}).render();
        Router.start();
    });
    require(["resources.min"]);
});



