module.exports.setup = function (app, handlers) {
    for (var handler in handlers) {
        var currentHandler = handlers[handler];
        currentHandler.module.setupHandlers(app, currentHandler.options);
    }
};