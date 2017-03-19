'use strict';
module.exports = function () {
    //4XX - URLs not found
    return function customRaiseUrlNotFoundError(req, res, next) {    	

    	console.log(req);

        res.sendFile('./404.html', { root : __dirname}, function (err) {
            if (err) {
                console.error(err);
                res.status(err.status).end();
            }
        });
    };
};