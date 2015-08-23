define([
    "app/collection"
], function (Collection) {

    var houses = new Collection();
    houses.dataType = "house";
    houses.fetch();
    return houses;

});
