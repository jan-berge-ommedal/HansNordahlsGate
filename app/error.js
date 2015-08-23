define([
    "jquery"
], function ($) {

    function renderErrorMessage(errorMessage) {
        var $error = $("<div class=\"alert alert-danger\" />");
        $error.text(errorMessage);
        $(".mainContainer").prepend($error);
        window.scrollTo(0, 0);
    }

    return {
        ajaxError: function (xhr) {
            var status = xhr && xhr.status;
            renderErrorMessage(status == 401 ? "Vennligst logg inn" : "Ukjent feil. Forsøk på nytt senere");
        }
    }

});