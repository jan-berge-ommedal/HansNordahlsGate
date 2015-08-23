define([], function () {

    return {
        apiPath: "/php/api.php",
        uploadPath: "/php/upload.php",
        emailPath: "/php/sendEmail.php",
        downloadPath: "/php/download.php",
        imageSizes: {
            house: {
                w: 200,
                h: 200
            },
            image: {
                w: 570,
                h: 320
            },
            boardMember: {
                w: 320,
                h: 320
            },
            news: {
                w: 640,
                h: 480
            }
        }
    };

});
