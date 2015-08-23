define([
    "underscore",
    "jquery",
    "../view",
    "app/router",
    "app/config",
    "app/id",
    "app/time",
    "app/string",
    "app/error",
    "./house/houses",
    "json!/font-awesome-icons.json",
    "text!./createOrUpdateView.mustache",
    "less!./createOrUpdateView"
], function (_, $, View, Router, config, idUtils, time, string, error, houses, fontAwesomeIcons, template) {

    var sixTeenMegaBytes = 16 * 1000 * 1000;
    var iconOptions = _.map(fontAwesomeIcons.icons, function (icon) {
        return icon.id;
    });

    function goBack() {
        if(this.isHouse){
            houses.fetch();
        }
        Router.navigateAndTrigger(this.redirectPath);
        return false;
    }


    function setShouldPerformUpload(view, value) {
        view.$(".fileGroup").toggle(value);
        view.$(".currentFile").toggle(!value);
        view.$(".fileInput").prop("required", function () {
            return view.fileRequired && value;
        });
    }

    function fileInputChanged() {
        var $fileInput = this.$(".fileInput");
        var fileInput = $fileInput[0];
        var file = fileInput.files[0];
        var name = file && file.name;
        var size = file && file.size;

        var $nameInput = this.$(".nameInput");
        string.notNullOrEmpty($nameInput.val()) || $nameInput.val(name);
        this.$(".fileGroup").toggleClass("has-error", size > sixTeenMegaBytes);
        this.$(".tooLargeFile").toggle(size > sixTeenMegaBytes);
    }

    function updateProgress(e) {
        if (e.lengthComputable) {
            this.$(".progress").show();
            var percentComplete = (100 * e.loaded / e.total);
            var $progress = this.$(".theProgressBar");
            $progress.width(percentComplete + "%");
            $progress.text(Math.floor(percentComplete) + "%");
        }
    }

    function createItem(dataId) {
        var name = this.$(".nameInput").val();
        var iconId = this.$(".fontAwesomeRadio:checked").val();
        var description = this.$(".descriptionInput").val();

        var model = this.model;

        model.set({
            name: name,
            description: description,
            dataId: dataId || model.getDataId(),
            iconId: iconId,
            timestamp: time.now()
        });

        model.save({}, {
            success: _.bind(goBack, this)
        });

        return false;
    }

    function uploadFile() {
        var that = this;
        var $uploadForm = this.$(".uploadForm");
        var formData = new FormData($uploadForm[0]);

        var $fileInput = this.$(".fileInput");
        var fileInput = $fileInput[0];
        var createItemBound = _.bind(createItem, this);

        var file = fileInput.files[0];
        if (!file) {
            createItemBound();
        } else {
            var id = this.fileId ? this.fileId : idUtils.uuid();
            formData.append("id", id);
            formData.append("dataType", "file");

            // TODO
            //formData.append("debug", "true");
            // TODO

            var imageWidth = this.imageWidth;
            var imageHeight = this.imageHeight;
            if (imageWidth && imageHeight) {
                formData.append("imageWidth", imageWidth);
                formData.append("imageHeight", imageHeight);
            }

            $.ajax({
                url: config.uploadPath,
                type: "POST",
                xhr: function () {  // custom xhr
                    var myXhr = $.ajaxSettings.xhr();
                    myXhr.upload && myXhr.upload.addEventListener(
                        'progress',
                        _.bind(updateProgress, that),
                        false
                    );
                    return myXhr;
                },
                success: function () {
                    createItemBound(id);
                },
                error: error.ajaxError,
                data: formData,
                cache: false,
                contentType: false,
                processData: false
            }, 'json');
        }

        return false;
    }

    function uploadNewImage() {
        setShouldPerformUpload(this, true);
        return false;
    }

    return View.extend({
        template: template,

        events: {
            "click .backButton": goBack,
            "click .uploadNewImageButton": uploadNewImage,
            "change .fileInput": fileInputChanged,
            "submit .uploadForm": uploadFile
        },

        initialize: function (options) {
            var model = this.model = options.model;
            var type = model.getItemType();
            var houseId = model.getHouseId();
            this.redirectPath = options.redirectPath || (houseId ? "house/" + houseId : "/");

            this.isHouse = "house" == type;
            this.fileIsImage = "document" != type;
            this.largeDescription = "news" == type;
            this.fileRequired = "news" != type;
            this.additionalInfo = "image" != type;
            this.withIcon = "boardMember" != type && "news" != type && "house" != type;

            this.fileId = type == "image" ? model.getId() : model.getDataId();

            var imageSize = config.imageSizes[type];
            var imageWidth = imageSize && imageSize.w;
            var imageHeight = imageSize && imageSize.h;

            this.imageWidth = imageWidth;
            this.imageHeight = imageHeight;
        },

        render: function () {
            var model = this.model;
            var dataDownloadUrl = model.getDataDownloadUrl();
            this.renderTemplate(model.toJSON(), {
                imageUrl: dataDownloadUrl,
                withIcon: this.withIcon,
                additionalInfo: this.additionalInfo,
                largeDescription: this.largeDescription,
                fileIsImage: this.fileIsImage,
                iconOptions: iconOptions
            });

            var iconId = model.getIconId();
            if (iconId) {
                this.$(".icon-" + iconId).attr('checked', true);
            }

            setShouldPerformUpload(this, !dataDownloadUrl);
            this.$(".tooLargeFile").hide();
            this.$(".progress").hide();
            return this;
        }

    });

});
