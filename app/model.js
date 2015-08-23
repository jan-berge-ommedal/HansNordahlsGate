define([
    "underscore",
    "backbone",
    "./config",
    "./time",
    "./id"
], function (_, Backbone, config, time, id) {

    var BackboneModel = Backbone.Model;
    var originalDestroy = BackboneModel.prototype.destroy;
    var Model = BackboneModel.extend({

        initialize: function () {
            this.set("timestamp", time.now());
        },

        getId: function () {
            return this.get(this.idAttribute);
        },

        getTimestamp: function () {
            return this.get("timestamp");
        },

        getName: function () {
            return this.get("name");
        },

        getDataType: function () {
            return this.get("dataType");
        },

        getHouseId: function () {
            return this.get("houseId");
        },

        getItemType: function () {
            var dataType = this.getDataType();
            return dataType && dataType.substr(dataType.lastIndexOf("-") + 1)
        },

        getIconId: function(){
            return this.get("iconId");
        },

        getDataId: function () {
            return this.get("dataId");
        },

        getDataDownloadUrl: function () {
            return Model.getDownloadUrl(this, this.getDataId());
        },

        getDownloadUrl: function () {
            return Model.getDownloadUrl(this, this.id);
        },

        parse: function (attributes) {
            var data = attributes && attributes.data && JSON.parse(attributes.data);
            return _.extend(attributes, data);
        },

        destroy: function(){
            var dataId = this.getDataId();
            if (dataId != null) {
                new Model({id: dataId}).destroy();
            }
            return originalDestroy.apply(this, arguments);
        }

    });

    Model.getDownloadUrl = function (model, id) {
        return id && config.downloadPath + "?id=" + id + "&modified=" + model.getTimestamp();
    };

    return Model;

});