module.exports.setup = function (app, handlers) {

  app.use(function(req, res, next) {
    req.url = req.url.replace("/app/api", "");
    next();
  });

  for (handler in handlers) {
    handlers[handler].setupHandlers(app);
  }
};