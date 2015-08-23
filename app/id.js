define([], function () {

    function randomString() {
        return Math.random().toString(36).slice(2);
    }

    return {

        uuid: function () {
            var result = "";
            while (result.length < 20) {
                result += randomString();
            }
            return result;
        }

    }
});