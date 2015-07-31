module.exports.setup = function (app, handlers) {

    app.use(function (req, res, next) {
        req.url = req.url.replace("/api", "");
        next();
    });

    for (var handler in handlers) {
        var currentHandler = handlers[handler];
        currentHandler.module.setupHandlers(app, currentHandler.options);
    }
};